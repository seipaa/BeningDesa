-- ============================================================
-- BeningDesaV2 — Database Schema
-- PostgreSQL via Supabase
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── konsultasi ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS konsultasi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama VARCHAR(255) NOT NULL,
    desa VARCHAR(255) NOT NULL,
    kecamatan VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── gerai ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gerai (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    konsultasi_id UUID NOT NULL REFERENCES konsultasi(id) ON DELETE CASCADE,
    nama VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gerai_konsultasi ON gerai(konsultasi_id);

-- ─── anggota ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS anggota (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    konsultasi_id UUID NOT NULL REFERENCES konsultasi(id) ON DELETE CASCADE,
    nama VARCHAR(255) NOT NULL,
    rfid_card_id VARCHAR(64) UNIQUE,
    qr_code_id VARCHAR(64) UNIQUE,
    saldo_simpanan DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_anggota_qr ON anggota(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_anggota_rfid ON anggota(rfid_card_id);
CREATE INDEX IF NOT EXISTS idx_anggota_konsultasi ON anggota(konsultasi_id);

-- ─── produk ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS produk (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gerai_id UUID NOT NULL REFERENCES gerai(id) ON DELETE CASCADE,
    nama VARCHAR(255) NOT NULL,
    satuan VARCHAR(20) NOT NULL,
    harga DECIMAL(12,2) NOT NULL,
    stok DECIMAL(10,3) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_produk_gerai ON produk(gerai_id);

-- ─── transaksi_event ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS transaksi_event (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gerai_id UUID NOT NULL REFERENCES gerai(id),
    anggota_id UUID REFERENCES anggota(id),
    items JSONB NOT NULL,
    total DECIMAL(15,2) NOT NULL,
    metode_input VARCHAR(32) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    prev_hash VARCHAR(64) NOT NULL,
    hash VARCHAR(64) NOT NULL,
    synced BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transaksi_gerai ON transaksi_event(gerai_id);
CREATE INDEX IF NOT EXISTS idx_transaksi_anggota ON transaksi_event(anggota_id);
CREATE INDEX IF NOT EXISTS idx_transaksi_timestamp ON transaksi_event(timestamp);
CREATE INDEX IF NOT EXISTS idx_transaksi_sync ON transaksi_event(synced);
CREATE INDEX IF NOT EXISTS idx_transaksi_ordered ON transaksi_event(gerai_id, timestamp);

-- ─── sync_queue_item ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sync_queue_item (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaksi_id UUID NOT NULL REFERENCES transaksi_event(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    percobaan_ke INTEGER DEFAULT 1,
    last_attempt TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sync_transaksi ON sync_queue_item(transaksi_id);
CREATE INDEX IF NOT EXISTS idx_sync_status ON sync_queue_item(status);

-- ─── system_state ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS system_state (
    key VARCHAR(64) PRIMARY KEY,
    value TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── RPC: Get last hash
CREATE OR REPLACE FUNCTION get_last_hash(p_gerai_id UUID)
RETURNS VARCHAR(64) AS $$
DECLARE
    v_konsultasi_id UUID;
    v_genesis VARCHAR(64);
    v_last_hash VARCHAR(64);
BEGIN
    SELECT konsultasi_id INTO v_konsultasi_id FROM gerai WHERE id = p_gerai_id;
    -- Genesis: SHA256("GENESIS-KDMP-" || konsultasi_id)
    SELECT ENCODE(SHA256(('GENESIS-KDMP-' || v_konsultasi_id)::bytea), 'hex')
    INTO v_genesis;

    SELECT te.hash INTO v_last_hash
    FROM transaksi_event te
    JOIN gerai g ON g.id = te.gerai_id
    WHERE g.konsultasi_id = v_konsultasi_id
    ORDER BY te.timestamp DESC
    LIMIT 1;

    RETURN COALESCE(v_last_hash, v_genesis);
END;
$$ LANGUAGE plpgsql STABLE;

-- ─── RPC: Get konsultasi_id from gerai ───────────────────────
CREATE OR REPLACE FUNCTION get_konsultasi_id(p_gerai_id UUID)
RETURNS UUID AS $$
DECLARE
    v_konsultasi_id UUID;
BEGIN
    SELECT konsultasi_id INTO v_konsultasi_id FROM gerai WHERE id = p_gerai_id;
    RETURN v_konsultasi_id;
END;
$$ LANGUAGE plpgsql STABLE;
