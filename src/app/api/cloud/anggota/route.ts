import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''

    let query = supabase
      .from('anggota')
      .select('id, nama, rfid_card_id, qr_code_id, saldo_simpanan, konsultasi_id')
      .order('nama')
      .limit(50)

    if (search) {
      query = query.or(`nama.ilike.%${search}%,qr_code_id.eq.${search},rfid_card_id.eq.${search}`)
    }

    const result = await query

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
