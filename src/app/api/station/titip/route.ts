import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'
import { computeTitipHash, genesisTitipHash } from '@/lib/hash'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      gerai_id,
      anggota_id,
      nama_barang,
      kategori = 'Umum',
      satuan = 'kg',
      berat_kg,
      jumlah_pcs,
      harga_satuan,
      komisi_pct = 5,
    } = body

    if (!gerai_id || !nama_barang || !harga_satuan) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const timestamp = new Date().toISOString()

    // 1. Insert titip_barang row
    const { data: barang, error: barangErr } = await supabase
      .from('titip_barang')
      .insert({
        gerai_id,
        anggota_id: anggota_id || null,
        nama_barang,
        kategori,
        satuan,
        berat_kg: satuan === 'kg' ? berat_kg : null,
        jumlah_pcs: satuan === 'pcs' ? jumlah_pcs : null,
        harga_satuan: parseFloat(harga_satuan),
        komisi_pct: parseFloat(komisi_pct),
        status_terakhir: 'MASUK',
      })
      .select('*')
      .single()

    if (barangErr || !barang) {
      console.error('[TITIP] Gagal insert barang:', barangErr)
      return NextResponse.json({ error: barangErr?.message }, { status: 500 })
    }

    // 2. Compute genesis + first event hash
    const genesisHash = genesisTitipHash(barang.id)
    const nilai_titip = satuan === 'kg'
      ? parseFloat(berat_kg) * parseFloat(harga_satuan)
      : parseInt(jumlah_pcs) * parseFloat(harga_satuan)
    const komisi = nilai_titip * (parseFloat(komisi_pct) / 100)

    const eventPayload = {
      nama_barang,
      kategori,
      satuan,
      berat_kg: satuan === 'kg' ? parseFloat(berat_kg) : null,
      jumlah_pcs: satuan === 'pcs' ? parseInt(jumlah_pcs) : null,
      harga_satuan: parseFloat(harga_satuan),
      nilai_titip,
      komisi_pct: parseFloat(komisi_pct),
      komisi,
      estimasi_bersih: nilai_titip - komisi,
    }

    const eventHash = computeTitipHash(genesisHash, {
      event_type: 'MASUK',
      barang_id: barang.id,
      anggota_id: anggota_id || null,
      gerai_id,
      payload: eventPayload,
      timestamp,
    })

    // 3. Insert first event
    const { data: event, error: eventErr } = await supabase
      .from('titip_event')
      .insert({
        barang_id: barang.id,
        event_type: 'MASUK',
        gerai_id,
        anggota_id: anggota_id || null,
        payload: eventPayload,
        prev_hash: genesisHash,
        hash: eventHash,
        timestamp,
      })
      .select('*')
      .single()

    if (eventErr) {
      console.error('[TITIP] Gagal insert event:', eventErr)
      return NextResponse.json({ error: eventErr.message }, { status: 500 })
    }

    return NextResponse.json({
      barang,
      event,
      struk: {
        barang_id: barang.id,
        nama_barang,
        satuan,
        berat_kg: satuan === 'kg' ? parseFloat(berat_kg) : null,
        jumlah_pcs: satuan === 'pcs' ? parseInt(jumlah_pcs) : null,
        harga_satuan: parseFloat(harga_satuan),
        nilai_titip,
        komisi_pct: parseFloat(komisi_pct),
        komisi,
        estimasi_bersih: nilai_titip - komisi,
        hash: eventHash,
        prev_hash: genesisHash,
        timestamp,
        anggota_id: anggota_id || null,
        gerai_id,
      },
    })
  } catch (e: any) {
    console.error('[TITIP POST]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const gerai_id = searchParams.get('gerai_id')

  const supabase = createAdminClient()
  let query = supabase
    .from('titip_barang')
    .select('*, anggota(nama, qr_code_id), gerai(nama)')
    .order('created_at', { ascending: false })

  if (gerai_id) query = query.eq('gerai_id', gerai_id)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ barang: data })
}
