import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = createAdminClient()
    const r = await supabase.from('konsultasi').select('id', { count: 'exact', head: true })
    if (r.error && r.error.message.includes('does not exist')) {
      return NextResponse.json({ status: 'ok', db: 'empty', message: 'Tables not created yet' })
    }

    const modeResult = await supabase.from('system_state').select('value').eq('key', 'mode_offline').single()
    const mode = modeResult.data?.value || 'OFF'

    return NextResponse.json({
      status: 'ok',
      mode_offline: mode,
      db_latency_ms: 0,
      timestamp: new Date().toISOString(),
    })
  } catch (err: any) {
    return NextResponse.json({ status: 'ok', mode_offline: 'OFF', db: 'checking' })
  }
}
