import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'
import { computeTitipHash } from '@/lib/hash'

export const dynamic = 'force-dynamic'

export async function POST(
  req: NextRequest,
  { params }: { params: { barangId: string } }
) {
  try {
    const { barangId } = params
    const body = await req.json()
    const { event_type, gerai_id, anggota_id, operator_id, extra_payload = {} } = body

    const validTypes = ['LISTED', 'SOLD', 'RETURNED']
    if (!validTypes.includes(event_type)) {
      return NextResponse.json({ error: 'event_type tidak valid' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Fetch current barang
    const { data: barang, error: barangErr } = await supabase
      .from('titip_barang')
      .select('*')
      .eq('id', barangId)
      .single()

    if (barangErr || !barang) {
      return NextResponse.json({ error: 'Barang tidak ditemukan' }, { status: 404 })
    }

    // Fetch last event to get prev_hash
    const { data: lastEvent, error: lastErr } = await supabase
      .from('titip_event')
      .select('hash, event_type')
      .eq('barang_id', barangId)
      .order('timestamp', { ascending: false })
      .limit(1)
      .single()

    if (lastErr || !lastEvent) {
      return NextResponse.json({ error: 'Event sebelumnya tidak ditemukan' }, { status: 400 })
    }

    const timestamp = new Date().toISOString()
    const prevHash = lastEvent.hash

    // Build payload per event type
    let payload: Record<string, any> = { ...extra_payload }

    if (event_type === 'SOLD') {
      const nilai_jual = barang.satuan === 'kg'
        ? (barang.berat_kg || 0) * barang.harga_satuan
        : (barang.jumlah_pcs || 0) * barang.harga_satuan
      const komisi = nilai_jual * (barang.komisi_pct / 100)
      payload = {
        ...payload,
        harga_jual: barang.harga_satuan,
        nilai_jual,
        komisi,
        hasil_bersih: nilai_jual - komisi,
      }
    }

    // Compute new hash
    const newHash = computeTitipHash(prevHash, {
      event_type,
      barang_id: barangId,
      anggota_id: anggota_id || null,
      gerai_id,
      payload,
      timestamp,
    })

    // Insert new event
    const { data: event, error: eventErr } = await supabase
      .from('titip_event')
      .insert({
        barang_id: barangId,
        event_type,
        gerai_id,
        anggota_id: anggota_id || null,
        operator_id: operator_id || null,
        payload,
        prev_hash: prevHash,
        hash: newHash,
        timestamp,
      })
      .select('*')
      .single()

    if (eventErr) {
      return NextResponse.json({ error: eventErr.message }, { status: 500 })
    }

    // Update status_terakhir on barang
    await supabase
      .from('titip_barang')
      .update({ status_terakhir: event_type })
      .eq('id', barangId)

    return NextResponse.json({ event, barang: { ...barang, status_terakhir: event_type } })
  } catch (e: any) {
    console.error('[TITIP STATUS]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
