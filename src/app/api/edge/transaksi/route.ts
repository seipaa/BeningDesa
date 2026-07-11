import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(req.url)
    const gerai_id = searchParams.get('gerai_id')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build gerai filter
    let geraiIds: string[] = []
    if (gerai_id) {
      geraiIds = [gerai_id]
    } else {
      const allGerai = await supabase.from('gerai').select('id')
      if (allGerai.data) {
        geraiIds = allGerai.data.map((g: any) => g.id)
      }
    }

    let txns: any[] = []
    if (geraiIds.length > 0) {
      let query = supabase
        .from('transaksi_event')
        .select('id, gerai_id, anggota_id, items, total, metode_input, timestamp, prev_hash, hash, synced')
        .in('gerai_id', geraiIds)
        .order('timestamp', { ascending: false })
        .range(offset, offset + limit - 1)

      const result = await query
      txns = result.data || []
    }

    // Get count
    let count = 0
    if (geraiIds.length > 0) {
      const countResult = await supabase
        .from('transaksi_event')
        .select('id', { count: 'exact', head: true })
        .in('gerai_id', geraiIds)
      count = countResult.count || 0
    }

    // Enrich with gerai names
    if (txns.length > 0) {
      const gIds = Array.from(new Set(txns.map((t: any) => t.gerai_id)))
      const geraiResult = await supabase.from('gerai').select('id, nama').in('id', gIds)
      const geraiMap: Record<string, string> = {}
      if (geraiResult.data) {
        for (const g of geraiResult.data) {
          geraiMap[g.id] = g.nama
        }
      }

      // Enrich with anggota names
      const aIds = Array.from(new Set(txns.map((t: any) => t.anggota_id).filter(Boolean)))
      const anggMap: Record<string, string> = {}
      if (aIds.length > 0) {
        const anggResult = await supabase.from('anggota').select('id, nama').in('id', aIds)
        if (anggResult.data) {
          for (const a of anggResult.data) {
            anggMap[a.id] = a.nama
          }
        }
      }

      for (const t of txns) {
        t.gerai_nama = geraiMap[t.gerai_id] || 'Gerai'
        t.anggota_nama = t.anggota_id ? (anggMap[t.anggota_id] || 'Anggota') : null
      }
    }

    return NextResponse.json({
      transaksi: txns,
      total: count,
      limit,
      offset,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
