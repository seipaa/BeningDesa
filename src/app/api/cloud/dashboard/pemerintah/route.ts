import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createAdminClient()

    const konsultasiResult = await supabase
      .from('konsultasi')
      .select('id, nama, desa, kecamatan')
      .order('nama')

    const konsultasiList = konsultasiResult.data || []

    // Build stats per konsultasi
    const stats = await Promise.all(konsultasiList.map(async (k: any) => {
      const [geraiResult, anggResult] = await Promise.all([
        supabase.from('gerai').select('id').eq('konsultasi_id', k.id),
        supabase.from('anggota').select('id').eq('konsultasi_id', k.id),
      ])

      const geraiIds = (geraiResult.data || []).map((g: any) => g.id)
      let txns: any[] = []
      if (geraiIds.length > 0) {
        const txResult = await supabase
          .from('transaksi_event')
          .select('id, total, synced')
          .in('gerai_id', geraiIds)
        txns = txResult.data || []
      }

      const totalVolume = txns.reduce((s: number, t: any) => s + parseFloat(t.total || 0), 0)
      const synced = txns.filter((t: any) => t.synced).length

      return {
        id: k.id,
        nama: k.nama,
        desa: k.desa,
        kecamatan: k.kecamatan,
        jumlah_gerai: (geraiResult.data || []).length,
        jumlah_anggota: (anggResult.data || []).length,
        total_volume: totalVolume,
        total_transaksi: txns.length,
        transaksi_terverifikasi: synced,
        transaksi_belum_sync: txns.length - synced,
      }
    }))

    const global = {
      total_konsultasi: stats.length,
      total_anggota: stats.reduce((s: number, k: any) => s + k.jumlah_anggota, 0),
      total_volume: stats.reduce((s: number, k: any) => s + k.total_volume, 0),
      total_transaksi: stats.reduce((s: number, k: any) => s + k.total_transaksi, 0),
    }

    return NextResponse.json({ global, konsultasi: stats })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
