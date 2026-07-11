import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createAdminClient()

    const anggotaResult = await supabase
      .from('anggota')
      .select('id, nama, rfid_card_id, qr_code_id, saldo_simpanan, konsultasi_id')
      .eq('id', params.id)
      .single()

    if (!anggotaResult.data) {
      return NextResponse.json({ error: 'Anggota tidak ditemukan' }, { status: 404 })
    }

    // Fetch konsultasi info
    const konsulResult = await supabase
      .from('konsultasi')
      .select('id, nama, desa, kecamatan')
      .eq('id', anggotaResult.data.konsultasi_id)
      .single()

    const transaksiResult = await supabase
      .from('transaksi_event')
      .select('id, total, metode_input, timestamp, synced, items, gerai_id, hash, prev_hash')
      .eq('anggota_id', params.id)
      .order('timestamp', { ascending: false })

    // Enrich transaksi with gerai names
    const txns = transaksiResult.data || []
    if (txns.length > 0) {
      const geraiIds = txns.map((t: any) => t.gerai_id)
      const geraiResult = await supabase.from('gerai').select('id, nama').in('id', geraiIds)
      const geraiMap: Record<string, string> = {}
      if (geraiResult.data) {
        for (const g of geraiResult.data) {
          geraiMap[g.id] = g.nama
        }
      }
      for (const t of txns) {
        (t as any).gerai_nama = geraiMap[t.gerai_id] || 'Gerai'
      }
    }

    const anggota = {
      id: anggotaResult.data.id,
      nama: anggotaResult.data.nama,
      rfid_card_id: anggotaResult.data.rfid_card_id,
      qr_code_id: anggotaResult.data.qr_code_id,
      saldo_simpanan: anggotaResult.data.saldo_simpanan,
      konsultasi_id: anggotaResult.data.konsultasi_id,
      konsultasi_nama: konsulResult.data?.nama || '',
      desa: konsulResult.data?.desa || '',
      kecamatan: konsulResult.data?.kecamatan || '',
    }

    return NextResponse.json({ anggota, transaksi: txns })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
