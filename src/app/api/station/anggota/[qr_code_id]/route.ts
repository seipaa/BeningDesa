import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export async function GET(req: NextRequest, { params }: { params: { qr_code_id: string } }) {
  try {
    const supabase = createAdminClient()
    const result = await supabase
      .from('anggota')
      .select('id, nama, rfid_card_id, qr_code_id, saldo_simpanan, konsultasi_id')
      .eq('qr_code_id', params.qr_code_id)
      .single()

    if (!result.data) {
      return NextResponse.json({ error: 'Anggota tidak ditemukan' }, { status: 404 })
    }

    // Enrich with konsultasi data
    const konsulResult = await supabase
      .from('konsultasi')
      .select('id, nama, desa, kecamatan')
      .eq('id', result.data.konsultasi_id)
      .single()

    const anggota = {
      id: result.data.id,
      nama: result.data.nama,
      rfid_card_id: result.data.rfid_card_id,
      qr_code_id: result.data.qr_code_id,
      saldo_simpanan: result.data.saldo_simpanan,
      konsultasi_id: result.data.konsultasi_id,
      konsultasi_nama: konsulResult.data?.nama || '',
      desa: konsulResult.data?.desa || '',
      kecamatan: konsulResult.data?.kecamatan || '',
    }

    return NextResponse.json({ anggota })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
