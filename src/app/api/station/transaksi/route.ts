import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'
import { computeTransactionHash, genesisHash, computeTitipHash, genesisTitipHash } from '@/lib/hash'
import { v4 as uuidv4 } from 'uuid'

const KOPERASI_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'

export async function POST(req: NextRequest) {
  try {
    const { gerai_id, anggota_id, items, total, metode_input } = await req.json()

    if (!gerai_id || !items || !total || !metode_input) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'items must be a non-empty array' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // 1. Get previous hash for transaction ledger
    const konsulId = KOPERASI_ID
    const lastTx = await supabase
      .from('transaksi_event')
      .select('hash')
      .eq('gerai_id', gerai_id)
      .order('timestamp', { ascending: false })
      .limit(1)
      .single()

    const prevHash = lastTx.data?.hash || genesisHash(konsulId)
    const timestamp = new Date().toISOString()

    const hash = computeTransactionHash(prevHash, {
      items,
      total: parseFloat(total),
      metode_input,
      anggota_id: anggota_id || null,
      timestamp,
    })

    const txId = uuidv4()

    // 2. Insert transaction event
    const { error: txErr } = await supabase.from('transaksi_event').insert({
      id: txId,
      gerai_id,
      anggota_id: anggota_id || null,
      items,
      total: parseFloat(total),
      metode_input,
      timestamp,
      prev_hash: prevHash,
      hash,
      synced: false,
    })

    if (txErr) throw txErr

    // 3. Add to sync queue
    await supabase.from('sync_queue_item').insert({
      transaksi_id: txId,
      status: 'pending',
    })

    // 4. Process each item: update consignment stock if it is a consigned item
    for (const item of items) {
      // Find item in titip_barang table
      const { data: barang, error: fetchErr } = await supabase
        .from('titip_barang')
        .select('*')
        .eq('id', item.produk_id || item.id)
        .maybeSingle()

      if (fetchErr) {
        console.error('[TRANSAKSI] Error fetching titip_barang:', fetchErr)
        continue
      }

      if (barang) {
        // Consigned item found! Deduct stock.
        const qtyToDeduct = parseFloat(item.jumlah || 1)
        let isSoldOut = false
        let updatedBerat = barang.berat_kg
        let updatedJumlah = barang.jumlah_pcs

        if (barang.satuan === 'kg') {
          updatedBerat = Math.max(0, parseFloat(barang.berat_kg || 0) - qtyToDeduct)
          if (updatedBerat <= 0.001) isSoldOut = true
        } else {
          updatedJumlah = Math.max(0, parseInt(barang.jumlah_pcs || 0) - qtyToDeduct)
          if (updatedJumlah === 0) isSoldOut = true
        }

        // Update titip_barang stock
        const { error: updateErr } = await supabase
          .from('titip_barang')
          .update({
            berat_kg: updatedBerat,
            jumlah_pcs: updatedJumlah,
            status_terakhir: isSoldOut ? 'SOLD' : barang.status_terakhir
          })
          .eq('id', barang.id)

        if (updateErr) {
          console.error('[TRANSAKSI] Gagal update stok titipan:', updateErr)
          continue
        }

        // Trigger cryptographic SOLD event for this purchase
        // Get last event hash
        const { data: lastEvent } = await supabase
          .from('titip_event')
          .select('hash')
          .eq('barang_id', barang.id)
          .order('timestamp', { ascending: false })
          .limit(1)
          .maybeSingle()

        const prevTitipHash = lastEvent?.hash || genesisTitipHash(barang.id)
        const soldTimestamp = new Date().toISOString()

        const nilai_jual = qtyToDeduct * parseFloat(barang.harga_satuan)
        const komisi = nilai_jual * (parseFloat(barang.komisi_pct) / 100)

        const soldPayload = {
          jumlah_terjual: qtyToDeduct,
          satuan: barang.satuan,
          harga_jual: parseFloat(barang.harga_satuan),
          nilai_jual,
          komisi,
          hasil_bersih: nilai_jual - komisi,
          stok_sisa: barang.satuan === 'kg' ? updatedBerat : updatedJumlah,
          keterangan: isSoldOut 
            ? 'Terjual habis melalui POS Kasir Belanja' 
            : 'Terjual sebagian melalui POS Kasir Belanja'
        }

        const soldHash = computeTitipHash(prevTitipHash, {
          event_type: 'SOLD',
          barang_id: barang.id,
          anggota_id: barang.anggota_id || null,
          gerai_id,
          payload: soldPayload,
          timestamp: soldTimestamp
        })

        const { error: eventInsertErr } = await supabase.from('titip_event').insert({
          barang_id: barang.id,
          event_type: 'SOLD',
          gerai_id,
          anggota_id: barang.anggota_id || null,
          payload: soldPayload,
          prev_hash: prevTitipHash,
          hash: soldHash,
          timestamp: soldTimestamp
        })

        if (eventInsertErr) {
          console.error('[TRANSAKSI] Gagal mencatat event SOLD:', eventInsertErr)
        }
      }
    }

    // 5. Fetch full transaction details to return to client
    const fullTx = await supabase
      .from('transaksi_event')
      .select('*, gerai(nama), anggota(nama)')
      .eq('id', txId)
      .single()

    return NextResponse.json({
      success: true,
      transaksi: fullTx.data,
      message: 'Transaksi berhasil dicatat',
    })
  } catch (err: any) {
    console.error('[STATION] Transaksi error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
