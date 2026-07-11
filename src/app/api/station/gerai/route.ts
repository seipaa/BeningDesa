import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createAdminClient()

    const result = await supabase
      .from('gerai')
      .select('id, nama, konsultasi_id')
      .order('nama')

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }

    const geraiData = result.data || []
    if (geraiData.length === 0) {
      return NextResponse.json({ gerai: [] })
    }

    const konsulIds = geraiData.map((g: any) => g.konsultasi_id as string)
    const konsulResult = await supabase
      .from('konsultasi')
      .select('id, nama, desa')
      .in('id', konsulIds)

    const konsulMap: Record<string, any> = {}
    if (konsulResult.data) {
      for (const k of konsulResult.data) {
        konsulMap[k.id] = k
      }
    }

    const gerai = geraiData
      .filter((g: any) => g.nama !== 'Gerai Pusat')
      .map((g: any) => ({
        id: g.id,
        nama: g.nama,
        konsultasi_id: g.konsultasi_id,
        konsultasi_nama: konsulMap[g.konsultasi_id]?.nama || '',
        desa: konsulMap[g.konsultasi_id]?.desa || '',
      }))

    return NextResponse.json({ gerai })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
