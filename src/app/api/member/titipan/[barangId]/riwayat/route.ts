import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'
import { computeTitipHash, genesisTitipHash } from '@/lib/hash'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: { barangId: string } }
) {
  const { barangId } = params
  const supabase = createAdminClient()

  // Fetch all events in chain order
  const { data: events, error } = await supabase
    .from('titip_event')
    .select('*')
    .eq('barang_id', barangId)
    .order('timestamp', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!events || events.length === 0) {
    return NextResponse.json({ events: [], valid: false, error: 'Tidak ada event' })
  }

  // Verify hash chain integrity
  let valid = true
  let brokenAt = -1
  const expectedGenesis = genesisTitipHash(barangId)

  for (let i = 0; i < events.length; i++) {
    const ev = events[i]
    const expectedPrev = i === 0 ? expectedGenesis : events[i - 1].hash
    if (ev.prev_hash !== expectedPrev) {
      valid = false
      brokenAt = i
      break
    }
    const expectedHash = computeTitipHash(ev.prev_hash, {
      event_type: ev.event_type,
      barang_id: ev.barang_id,
      anggota_id: ev.anggota_id || null,
      gerai_id: ev.gerai_id,
      payload: typeof ev.payload === 'string' ? JSON.parse(ev.payload) : ev.payload,
      timestamp: new Date(ev.timestamp).toISOString(),
    })
    if (ev.hash !== expectedHash) {
      valid = false
      brokenAt = i
      break
    }
  }

  return NextResponse.json({ events, valid, broken_at: brokenAt })
}
