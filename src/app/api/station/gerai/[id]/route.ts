import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createAdminClient()
    const result = await supabase
      .from('produk')
      .select('id, nama, satuan, harga, stok')
      .eq('gerai_id', params.id)
      .order('nama')

    return NextResponse.json({ produk: result.data || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
