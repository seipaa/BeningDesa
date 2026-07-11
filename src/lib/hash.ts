// Hash utilities for hash-chain ledger
// hash = SHA256(prev_hash + JSON.stringify(data))
import { createHash } from 'crypto'

export function sha256(data: string): string {
  if (typeof window !== 'undefined') {
    // Browser: use Web Crypto API
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return Math.abs(hash).toString(16).padStart(16, '0')
  } else {
    // Node.js server
    return createHash('sha256').update(data, 'utf8').digest('hex')
  }
}

export async function sha256Async(data: string): Promise<string> {
  if (typeof window !== 'undefined') {
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  } else {
    const crypto = await import('crypto')
    return crypto.createHash('sha256').update(data, 'utf8').digest('hex')
  }
}

export function genesisHash(konsultasiId: string): string {
  return sha256(`GENESIS-KDMP-${konsultasiId}`)
}

export function canonicalize(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  if (Array.isArray(obj)) {
    return obj.map(canonicalize)
  }
  const sortedKeys = Object.keys(obj).sort()
  const sortedObj: any = {}
  for (const key of sortedKeys) {
    sortedObj[key] = canonicalize(obj[key])
  }
  return sortedObj
}

export function computeTransactionHash(
  prevHash: string,
  data: {
    items: any[]
    total: number
    metode_input: string
    anggota_id: string | null
    timestamp: string
  }
): string {
  const payload = JSON.stringify(canonicalize({
    items: data.items,
    total: data.total,
    metode_input: data.metode_input,
    anggota_id: data.anggota_id,
    timestamp: data.timestamp,
  }))
  return sha256(prevHash + payload)
}

export function computeTitipHash(
  prevHash: string,
  data: {
    event_type: string
    barang_id: string
    anggota_id: string | null
    gerai_id: string
    payload: Record<string, any>
    timestamp: string
  }
): string {
  const str = JSON.stringify(canonicalize({
    event_type: data.event_type,
    barang_id: data.barang_id,
    anggota_id: data.anggota_id,
    gerai_id: data.gerai_id,
    payload: data.payload,
    timestamp: data.timestamp,
  }))
  return sha256(prevHash + str)
}

export function genesisTitipHash(barangId: string): string {
  return sha256(`GENESIS-TITIP-${barangId}`)
}

export function shortId(id: string): string {
  if (!id) return '-'
  return id.substring(0, 8)
}

export function formatHash(hash: string): string {
  if (!hash) return '-'
  return hash.substring(0, 8) + '...' + hash.substring(hash.length - 6)
}

export function formatRupiah(num: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num)
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(dateStr))
}

export function formatDateShort(dateStr: string): string {
  if (!dateStr) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).format(new Date(dateStr))
}
