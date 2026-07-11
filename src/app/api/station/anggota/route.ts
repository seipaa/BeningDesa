import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createAdminClient()
    const result = await supabase
      .from('anggota')
      .select('id, nama, rfid_card_id, qr_code_id, saldo_simpanan, konsultasi_id')
      .order('nama')

    // Enrich with konsultasi data
    const allData = result.data || []
    if (allData.length === 0) {
      return NextResponse.json({ anggota: [] })
    }

    const konsulIds = allData.map((a: any) => a.konsultasi_id as string)
    const konsulResult = await supabase
      .from('konsultasi')
      .select('id, nama, desa, kecamatan')
      .in('id', konsulIds)

    const konsulMap: Record<string, any> = {}
    if (konsulResult.data) {
      for (const k of konsulResult.data) {
        konsulMap[k.id] = k
      }
    }

    const anggota = allData.map((a: any) => ({
      id: a.id,
      nama: a.nama,
      rfid_card_id: a.rfid_card_id,
      qr_code_id: a.qr_code_id,
      saldo_simpanan: a.saldo_simpanan,
      konsultasi_id: a.konsultasi_id,
      konsultasi_nama: konsulMap[a.konsultasi_id]?.nama || '',
      desa: konsulMap[a.konsultasi_id]?.desa || '',
      kecamatan: konsulMap[a.konsultasi_id]?.kecamatan || '',
    }))

    return NextResponse.json({ anggota })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
