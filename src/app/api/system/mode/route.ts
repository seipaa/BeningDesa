import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const { mode } = await req.json()
    if (mode !== 'ON' && mode !== 'OFF') {
      return NextResponse.json({ error: 'mode must be ON or OFF' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { data, error } = await supabase.from('system_state').upsert({
      key: 'mode_offline',
      value: mode,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'key' }).select()

    console.log('[MODE] upsert result:', { data, error })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ mode_offline: mode, updated_at: new Date().toISOString() })
  } catch (err: any) {
    console.error('[MODE] catch error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
