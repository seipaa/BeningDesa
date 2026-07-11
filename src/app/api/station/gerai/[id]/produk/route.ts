import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createAdminClient()
    const geraiId = params.id

    // 1. Fetch standard products
    const { data: standardProduk, error: prodErr } = await supabase
      .from('produk')
      .select('id, nama, satuan, harga, stok')
      .eq('gerai_id', geraiId)
      .order('nama')

    if (prodErr) throw prodErr

    // 2. Fetch listed consignment (titip) products
    const { data: titipProduk, error: titipErr } = await supabase
      .from('titip_barang')
      .select('id, nama_barang, satuan, harga_satuan, berat_kg, jumlah_pcs, anggota_id, anggota(nama)')
      .eq('gerai_id', geraiId)
      .eq('status_terakhir', 'LISTED')

    if (titipErr) throw titipErr

    // Map titip products to standard product format
    const mappedTitip = (titipProduk || []).map((tp: any) => {
      const stok = tp.satuan === 'kg' ? parseFloat(tp.berat_kg || 0) : parseInt(tp.jumlah_pcs || 0)
      return {
        id: tp.id,
        nama: `${tp.nama_barang} (Titipan ${tp.anggota?.nama || 'Anggota'})`,
        satuan: tp.satuan,
        harga: parseFloat(tp.harga_satuan),
        stok,
        is_titipan: true,
        anggota_id: tp.anggota_id
      }
    })

    // Combine standard products and consignment products
    const allProducts = [...(standardProduk || []), ...mappedTitip]

    return NextResponse.json({ produk: allProducts })
  } catch (err: any) {
    console.error('[GERAI PRODUK GET]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
