import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BeningDesaV2 — Smart Cooperative System',
  description: 'Sistem Operasional Smart Cooperative — Hash-Chain Ledger & Offline-First Sync',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
