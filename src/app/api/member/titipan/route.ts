import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const anggota_id = searchParams.get('anggota_id')

  if (!anggota_id) {
    return NextResponse.json({ error: 'anggota_id diperlukan' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('titip_barang')
    .select('*, gerai(nama)')
    .eq('anggota_id', anggota_id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ titipan: data })
}
