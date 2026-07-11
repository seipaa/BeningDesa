import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createAdminClient()
    const result = await supabase
      .from('sync_queue_item')
      .select('*, transaksi_event(total, timestamp, hash, gerai(nama))')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })

    return NextResponse.json({ queue: result.data || [], total: result.data?.length || 0 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST() {
  try {
    const supabase = createAdminClient()

    // Check offline mode
    const modeResult = await supabase.from('system_state').select('value').eq('key', 'mode_offline').single()
    const mode = modeResult.data?.value || 'OFF'

    if (mode === 'ON') {
      return NextResponse.json({
        error: 'Offline mode aktif — sinkronisasi tidak dapat dilakukan',
        mode_offline: 'ON',
      }, { status: 409 })
    }

    // Get pending items
    const pending = await supabase
      .from('sync_queue_item')
      .select('*, transaksi_event:id')
      .eq('status', 'pending')

    if (!pending.data || pending.data.length === 0) {
      return NextResponse.json({ synced: 0, message: 'Tidak ada transaksi yang perlu disinkronkan' })
    }

    let syncedCount = 0
    for (const item of pending.data) {
      await supabase.from('transaksi_event').update({ synced: true }).eq('id', item.transaksi_id)
      await supabase.from('sync_queue_item').update({ status: 'synced', last_attempt: new Date().toISOString() }).eq('id', item.id)
      syncedCount++
    }

    await supabase.from('system_state').upsert({
      key: 'last_sync_at',
      value: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'key' })

    return NextResponse.json({
      synced: syncedCount,
      message: `${syncedCount} transaksi berhasil disinkronkan ke Cloud Platform`,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
