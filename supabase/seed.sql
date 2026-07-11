-- ============================================================
-- BeningDesaV2 — Seed Data
-- PostgreSQL via Supabase Studio SQL Editor
-- Run this after 001_schema.sql
-- Uses ON CONFLICT DO NOTHING for idempotent re-runs
-- ============================================================

BEGIN;

-- ─── 1. Konsultasi ────────────────────────────────────────────
INSERT INTO konsultasi (id, nama, desa, kecamatan)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Koperasi Desa Merah Putih',
  'Desa Bening',
  'Kec. Bening Maju'
) ON CONFLICT DO NOTHING;

-- ─── 2. Gerai ─────────────────────────────────────────────────
INSERT INTO gerai (id, konsultasi_id, nama)
VALUES
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Gerai Pusat'),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Gerai Pasar')
ON CONFLICT DO NOTHING;

-- ─── 3. Anggota (8 members) ───────────────────────────────────
INSERT INTO anggota (id, konsultasi_id, nama, rfid_card_id, qr_code_id, saldo_simpanan)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Ahmad Wijaya',       'RFID-001', 'QR-001', 150000.00),
  ('00000000-0000-0000-0000-000000000002', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Budi Santoso',      'RFID-002', 'QR-002', 320000.00),
  ('00000000-0000-0000-0000-000000000003', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Citra Dewi',         'RFID-003', 'QR-003',  85000.00),
  ('00000000-0000-0000-0000-000000000004', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Dedi Kurniawan',    'RFID-004', 'QR-004', 420000.00),
  ('00000000-0000-0000-0000-000000000005', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Erni Wati',         'RFID-005', 'QR-005', 210000.00),
  ('00000000-0000-0000-0000-000000000006', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Fajar Nugroho',     'RFID-006', 'QR-006', 500000.00),
  ('00000000-0000-0000-0000-000000000007', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Gita Rahayu',       'RFID-007', 'QR-007', 175000.00),
  ('00000000-0000-0000-0000-000000000008', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Hadi Pranoto',      'RFID-008', 'QR-008', 280000.00)
ON CONFLICT DO NOTHING;

-- ─── 4. Produk — Gerai Pusat (12 items) ────────────────────────
INSERT INTO produk (id, gerai_id, nama, satuan, harga, stok)
VALUES
  ('00000000-0000-0000-0001-000000000001', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Beras Premium 5kg',  'pcs', 75000.00,  50),
  ('00000000-0000-0000-0001-000000000002', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Beras Medium 5kg',   'pcs', 55000.00,  80),
  ('00000000-0000-0000-0001-000000000003', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Minyak Goreng 2L',   'pcs', 32000.00, 100),
  ('00000000-0000-0000-0001-000000000004', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Minyak Goreng 1L',   'pcs', 18000.00, 120),
  ('00000000-0000-0000-0001-000000000005', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Gula Pasir 1kg',     'kg',  15000.00,  75),
  ('00000000-0000-0000-0001-000000000006', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Gula Pasir 5kg',     'pcs', 65000.00,  40),
  ('00000000-0000-0000-0001-000000000007', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Telur Ayam 1kg',    'kg',  28000.00,  60),
  ('00000000-0000-0000-0001-000000000008', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Tepung Terigu 1kg', 'kg',  12000.00,  90),
  ('00000000-0000-0000-0001-000000000009', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Kedelai 1kg',       'kg',  18000.00,  45),
  ('00000000-0000-0000-0001-000000000010', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Garam 1kg',          'kg',   8000.00, 200),
  ('00000000-0000-0000-0001-000000000011', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Sabun Mandi 100g',  'pcs',   5000.00, 150),
  ('00000000-0000-0000-0001-000000000012', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Sabun Cuci 900ml',   'pcs', 15000.00,  80)
ON CONFLICT DO NOTHING;

-- ─── 5. Produk — Gerai Pasar (12 items) ──────────────────────
INSERT INTO produk (id, gerai_id, nama, satuan, harga, stok)
VALUES
  ('00000000-0000-0000-0002-000000000001', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 'Beras Premium 5kg',  'pcs', 75000.00,  60),
  ('00000000-0000-0000-0002-000000000002', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 'Beras Medium 5kg',   'pcs', 55000.00,  90),
  ('00000000-0000-0000-0002-000000000003', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 'Minyak Goreng 2L',   'pcs', 32000.00, 110),
  ('00000000-0000-0000-0002-000000000004', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 'Minyak Goreng 1L',   'pcs', 18000.00, 130),
  ('00000000-0000-0000-0002-000000000005', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 'Gula Pasir 1kg',     'kg',  15000.00,  80),
  ('00000000-0000-0000-0002-000000000006', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 'Gula Pasir 5kg',     'pcs', 65000.00,  45),
  ('00000000-0000-0000-0002-000000000007', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 'Telur Ayam 1kg',    'kg',  28000.00,  65),
  ('00000000-0000-0000-0002-000000000008', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 'Tepung Terigu 1kg', 'kg',  12000.00,  95),
  ('00000000-0000-0000-0002-000000000009', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 'Kedelai 1kg',       'kg',  18000.00,  50),
  ('00000000-0000-0000-0002-000000000010', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 'Garam 1kg',          'kg',   8000.00, 200),
  ('00000000-0000-0000-0002-000000000011', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 'Sabun Mandi 100g',  'pcs',   5000.00, 160),
  ('00000000-0000-0000-0002-000000000012', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 'Sabun Cuci 900ml',   'pcs', 15000.00,  85)
ON CONFLICT DO NOTHING;

-- ─── 6. Transaksi Event (5 sample transactions) ───────────────
--
-- Hashes are pre-computed using the chain algorithm:
--   genesis = SHA256('GENESIS-KDMP-' || konsultasi_id)
--   tx_hash = SHA256(prev_hash || JSON.stringify({items,total,metode_input,anggota_id,timestamp}))
--   anggota_id NULL means non-member (tamu) transaction
--
-- Genesis for konsultasi a1b2c3d4-e5f6-7890-abcd-ef1234567890:
--   0561e56f185ecf1f29aafa416a2cd2c6db86886e46d904aabdfadff29c2edc40

INSERT INTO transaksi_event (id, gerai_id, anggota_id, items, total, metode_input, timestamp, prev_hash, hash, synced)
VALUES (
  '00000000-0001-0000-0000-000000000001',
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  '00000000-0000-0000-0000-000000000001',
  '[{"produk_id":"00000000-0000-0000-0001-000000000001","nama":"Beras Premium 5kg","jumlah":1,"harga_satuan":75000,"subtotal":75000},{"produk_id":"00000000-0000-0000-0001-000000000003","nama":"Minyak Goreng 2L","jumlah":1,"harga_satuan":32000,"subtotal":32000}]',
  107000.00,
  'manual',
  '2026-07-10T08:00:00Z',
  '0561e56f185ecf1f29aafa416a2cd2c6db86886e46d904aabdfadff29c2edc40',
  '0622e726be70e5a4805b6b279cccbd3d3a527f059b91965dcf3b9d8208afb796',
  true
) ON CONFLICT DO NOTHING;

INSERT INTO transaksi_event (id, gerai_id, anggota_id, items, total, metode_input, timestamp, prev_hash, hash, synced)
VALUES (
  '00000000-0002-0000-0000-000000000002',
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  '00000000-0000-0000-0000-000000000002',
  '[{"produk_id":"00000000-0000-0000-0001-000000000005","nama":"Gula Pasir 1kg","jumlah":2,"harga_satuan":15000,"subtotal":30000},{"produk_id":"00000000-0000-0000-0001-000000000007","nama":"Telur Ayam 1kg","jumlah":1,"harga_satuan":28000,"subtotal":28000}]',
  58000.00,
  'qr_scan',
  '2026-07-10T08:15:00Z',
  '0622e726be70e5a4805b6b279cccbd3d3a527f059b91965dcf3b9d8208afb796',
  '2655e2f264bd30876d76dfa842227e2159df05a26d6187cdb46c80bbc2648c2d',
  true
) ON CONFLICT DO NOTHING;

INSERT INTO transaksi_event (id, gerai_id, anggota_id, items, total, metode_input, timestamp, prev_hash, hash, synced)
VALUES (
  '00000000-0003-0000-0000-000000000003',
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  '00000000-0000-0000-0000-000000000004',
  '[{"produk_id":"00000000-0000-0000-0001-000000000002","nama":"Beras Medium 5kg","jumlah":2,"harga_satuan":55000,"subtotal":110000},{"produk_id":"00000000-0000-0000-0001-000000000004","nama":"Minyak Goreng 1L","jumlah":3,"harga_satuan":18000,"subtotal":54000}]',
  164000.00,
  'rfid_tap',
  '2026-07-10T08:30:00Z',
  '2655e2f264bd30876d76dfa842227e2159df05a26d6187cdb46c80bbc2648c2d',
  'c33599eee4c0078fbfec3dd5debbbf1b43d5a87a3d863bc143dfae2bb300e381',
  true
) ON CONFLICT DO NOTHING;

INSERT INTO transaksi_event (id, gerai_id, anggota_id, items, total, metode_input, timestamp, prev_hash, hash, synced)
VALUES (
  '00000000-0004-0000-0000-000000000004',
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  NULL,
  '[{"produk_id":"00000000-0000-0000-0001-000000000011","nama":"Sabun Mandi 100g","jumlah":5,"harga_satuan":5000,"subtotal":25000}]',
  25000.00,
  'manual',
  '2026-07-10T08:45:00Z',
  'c33599eee4c0078fbfec3dd5debbbf1b43d5a87a3d863bc143dfae2bb300e381',
  '7b88a926a0fb9250f67c96dce7b4fc54778d5b7ec63b760a65f89349d7ce17a9',
  true
) ON CONFLICT DO NOTHING;

INSERT INTO transaksi_event (id, gerai_id, anggota_id, items, total, metode_input, timestamp, prev_hash, hash, synced)
VALUES (
  '00000000-0005-0000-0000-000000000005',
  'c3d4e5f6-a7b8-9012-cdef-123456789012',
  '00000000-0000-0000-0000-000000000006',
  '[{"produk_id":"00000000-0000-0000-0002-000000000001","nama":"Beras Premium 5kg","jumlah":1,"harga_satuan":75000,"subtotal":75000},{"produk_id":"00000000-0000-0000-0002-000000000007","nama":"Telur Ayam 1kg","jumlah":2,"harga_satuan":28000,"subtotal":56000},{"produk_id":"00000000-0000-0000-0002-000000000010","nama":"Garam 1kg","jumlah":3,"harga_satuan":8000,"subtotal":24000}]',
  155000.00,
  'qr_scan',
  '2026-07-10T09:00:00Z',
  '7b88a926a0fb9250f67c96dce7b4fc54778d5b7ec63b760a65f89349d7ce17a9',
  'b89df97a4abe1d50b3072cce939ab353f6c9d42716abd019966786b031758eec',
  true
) ON CONFLICT DO NOTHING;

-- ─── 7. Sync Queue Items (mark all synced transactions) ────────
INSERT INTO sync_queue_item (transaksi_id, status)
VALUES
  ('00000000-0001-0000-0000-000000000001', 'synced'),
  ('00000000-0002-0000-0000-000000000002', 'synced'),
  ('00000000-0003-0000-0000-000000000003', 'synced'),
  ('00000000-0004-0000-0000-000000000004', 'synced'),
  ('00000000-0005-0000-0000-000000000005', 'synced')
ON CONFLICT DO NOTHING;

-- ─── 8. System State ───────────────────────────────────────────
INSERT INTO system_state (key, value)
VALUES ('mode_offline', 'OFF')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();

INSERT INTO system_state (key, value)
VALUES ('last_sync_at', '2026-07-10T09:00:00Z')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();

COMMIT;
