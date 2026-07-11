import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'
import { genesisHash, sha256, computeTransactionHash } from '@/lib/hash'

export const dynamic = 'force-dynamic'

const KOPERASI_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'

export async function GET() {
  try {
    const supabase = createAdminClient()
    const genHash = genesisHash(KOPERASI_ID)

    const result = await supabase
      .from('transaksi_event')
      .select('id, prev_hash, hash, items, total, metode_input, anggota_id, timestamp')
      .order('timestamp', { ascending: true })

    const txns = result.data || []
    if (txns.length === 0) {
      return NextResponse.json({ valid: true, checked: 0, message: 'Ledger kosong' })
    }

    for (let i = 0; i < txns.length; i++) {
      const tx = txns[i]
      const expectedPrevHash = i === 0 ? genHash : txns[i - 1].hash

      if (tx.prev_hash !== expectedPrevHash) {
        return NextResponse.json({
          valid: false, broken_at: i, checked: txns.length,
          error: `Rantai rusak pada transaksi #${i + 1}: prev_hash tidak cocok`,
        })
      }

      // Verify hash using the canonicalized shared helper
      const expectedHash = computeTransactionHash(tx.prev_hash, {
        items: typeof tx.items === 'string' ? JSON.parse(tx.items) : tx.items,
        total: parseFloat(tx.total),
        metode_input: tx.metode_input,
        anggota_id: tx.anggota_id || null,
        timestamp: new Date(tx.timestamp).toISOString(),
      })
      console.log(`[VERIFY TX${i+1}] stored_hash=${tx.hash}`)
      console.log(`[VERIFY TX${i+1}] prev=${tx.prev_hash}`)
      console.log(`[VERIFY TX${i+1}] computed_hash=${expectedHash}`)
      if (tx.hash !== expectedHash) {
        return NextResponse.json({
          valid: false, broken_at: i, checked: txns.length,
          error: `Rantai rusak pada transaksi #${i + 1}: hash tidak valid`,
        })
      }
    }

    return NextResponse.json({
      valid: true, checked: txns.length,
      message: 'Ledger valid — tidak ada manipulasi terdeteksi',
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
