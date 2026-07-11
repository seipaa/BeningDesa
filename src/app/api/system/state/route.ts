import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createAdminClient()
    const result = await supabase.from('system_state').select('key, value, updated_at')
    console.log('[STATE] error:', result.error)
    console.log('[STATE] count:', result.data?.length)
    console.log('[STATE] data:', JSON.stringify(result.data)?.substring(0, 300))
    const state: Record<string, string> = {}
    for (const row of result.data || []) {
      state[row.key] = row.value
    }
    return NextResponse.json({ state })
  } catch (err: any) {
    console.error('[STATE] catch:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
