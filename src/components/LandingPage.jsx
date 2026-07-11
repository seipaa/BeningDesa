import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Statistic, Button, Typography, Space, Tag } from 'antd';

const { Title, Paragraph, Text } = Typography;

export default function LandingPage({ onNavigate, isOffline, systemState }) {
  const [stats, setStats] = useState({
    total_anggota: 0,
    total_transaksi: 0,
    total_volume: 0,
    total_konsultasi: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/cloud/dashboard/pemerintah');
        if (res.ok) {
          const data = await res.json();
          if (data.global) {
            setStats(data.global);
          }
        }
      } catch (err) {
        console.error('Gagal mengambil statistik beranda:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num);
  };

  const statCards = [
    { label: 'Koperasi Terdaftar', value: stats.total_konsultasi, color: '#475569', gradient: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', borderColor: '#94a3b8' },
    { label: 'Total Anggota', value: stats.total_anggota, color: '#1d4ed8', gradient: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)', borderColor: '#3b82f6' },
    { label: 'Transaksi Tercatat', value: stats.total_transaksi, color: '#7c3aed', gradient: 'linear-gradient(135deg, #ffffff 0%, #f5f3ff 100%)', borderColor: '#8b5cf6' },
    { label: 'Volume Transaksi', value: stats.total_volume, color: '#047857', gradient: 'linear-gradient(135deg, #ffffff 0%, #ecfdf5 100%)', borderColor: '#10b981', isRupiah: true },
  ];

  const featureCards = [
    { key: 'station', label: 'SMART STATION', title: 'Smart Station', desc: 'Kiosk simulasi input kasir. Mendukung QR code reader, virtual RFID card reader, dan timbangan digital.', bg: '#ecfdf5', accent: '#047857' },
    { key: 'edge', label: 'EDGE SERVER', title: 'Edge Server', desc: 'Manajemen node lokal. Aktifkan mode offline, sinkronisasi antrean transaksi, dan verifikasi integritas rantai ledger.', bg: '#f5f3ff', accent: '#6d28d9' },
    { key: 'government', label: 'PEMERINTAH', title: 'Dasbor Pemerintah', desc: 'Akses monitoring dinas Koperasi. Tinjau performa koperasi nasional, audit kepatuhan rantai, dan diagram volume.', bg: '#fef2f2', accent: '#b91c1c' },
    { key: 'member', label: 'ANGGOTA', title: 'Dasbor Anggota', desc: 'Layanan mandiri anggota. Lihat informasi saldo simpanan, kartu digital, dan cetak struk belanja mandiri.', bg: '#eff6ff', accent: '#1d4ed8' },
  ];

  return (
    <div style={{ padding: '0 8px 24px' }}>
      {/* ── Hero Banner ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #022c22 0%, #064e3b 35%, #047857 70%, #059669 100%)',
          borderRadius: 18,
          padding: '44px 40px',
          color: '#fff',
          boxShadow: '0 16px 40px -12px rgba(4, 120, 87, 0.35)',
          marginBottom: 24,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative elements */}
        <div style={{ position: 'absolute', right: '-8%', bottom: '-25%', width: 320, height: 320, borderRadius: '50%', background: 'rgba(16,185,129,0.08)', zIndex: 1 }} />
        <div style={{ position: 'absolute', right: '15%', top: '-15%', width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', zIndex: 1 }} />
        <div style={{ position: 'absolute', left: '-5%', bottom: '10%', width: 100, height: 100, borderRadius: '50%', background: 'rgba(52,211,153,0.06)', zIndex: 1 }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 620 }}>
          <Tag
            style={{
              background: 'rgba(196,148,59,0.2)',
              color: '#f5e6c8',
              border: '1px solid rgba(196,148,59,0.3)',
              borderRadius: 999,
              marginBottom: 16,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.5px',
              padding: '3px 14px',
            }}
          >
            Digital Cooperative Expo 2026
          </Tag>
          <Title level={1} style={{ color: '#fff', margin: '0 0 12px 0', fontWeight: 900, fontSize: 30, lineHeight: 1.15 }}>
            Smart Cooperative
            <br />
            <span style={{ background: 'linear-gradient(90deg, #6ee7b7, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Station
            </span>
          </Title>
          <Paragraph style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: '1.7', margin: '0 0 28px 0' }}>
            <strong style={{ color: '#a7f3d0' }}>Koperasi Desa Merah Putih</strong> — Solusi sistem operasional 3-lapis
            (Station, Edge Server, dan Cloud Platform) berbasis <em>hash-chain ledger</em> append-only
            untuk transparansi keuangan desa yang mutlak, cepat, dan terpercaya.
          </Paragraph>
          <Space size="middle" wrap>
            <Button
              type="primary"
              size="large"
              onClick={() => onNavigate('station')}
              style={{
                backgroundColor: '#fff',
                color: '#064e3b',
                border: 'none',
                fontWeight: 800,
                borderRadius: 10,
                height: 46,
                paddingLeft: 28,
                paddingRight: 28,
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                fontSize: 14,
              }}
            >
              Buka Smart Station
            </Button>
            <Button
              type="text"
              size="large"
              onClick={() => onNavigate('edge')}
              style={{
                color: 'rgba(255,255,255,0.85)',
                fontWeight: 600,
                borderRadius: 10,
                height: 46,
                border: '1px solid rgba(255,255,255,0.2)',
                paddingLeft: 24,
                paddingRight: 24,
              }}
            >
              Edge Dashboard →
            </Button>
          </Space>
        </div>
      </div>

      {/* ── System Status ── */}
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card
            bordered={false}
            style={{
              borderRadius: 14,
              boxShadow: 'none',
              backgroundColor: isOffline ? '#fffbeb' : '#ecfdf5',
              border: isOffline ? '1px solid #fcd34d' : '1px solid #a7f3d0',
            }}
            bodyStyle={{ padding: '14px 20px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <Space direction="vertical" size={2}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: isOffline ? '#f59e0b' : '#10b981',
                    boxShadow: isOffline ? '0 0 8px rgba(245,158,11,0.4)' : '0 0 8px rgba(16,185,129,0.4)',
                    animation: 'breathe 2s infinite',
                  }} />
                  <Text strong style={{ color: isOffline ? '#92400e' : '#065f46', fontSize: 13 }}>
                    STATUS SISTEM: {isOffline ? 'OFFLINE' : 'ONLINE'}
                  </Text>
                </div>
                <div style={{ fontSize: 12, color: isOffline ? '#b45309' : '#15803d', marginLeft: 16 }}>
                  {isOffline
                    ? 'Transaksi dicatat ke dalam database lokal. Sinkronisasi ditangguhkan.'
                    : `Semua transaksi tersinkronisasi. Terakhir: ${systemState.last_sync_at || '-'}`}
                </div>
              </Space>
              <Button
                type="primary"
                ghost
                size="small"
                onClick={() => onNavigate('edge')}
                style={{
                  borderColor: isOffline ? '#d97706' : '#16a34a',
                  color: isOffline ? '#d97706' : '#16a34a',
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 11,
                }}
              >
                Konfigurasi →
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* ── Statistics ── */}
      <Title level={5} style={{ margin: '0 0 14px 4px', fontWeight: 800, color: '#1e293b', fontSize: 15 }}>
        Statistik Koperasi Desa
      </Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        {statCards.map((s, idx) => (
          <Col xs={12} sm={12} md={6} key={idx}>
            <Card
              bordered={false}
              style={{
                borderRadius: 14,
                boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
                borderLeft: `5px solid ${s.borderColor}`,
                background: s.gradient,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              bodyStyle={{ padding: '16px 18px' }}
              className="hover-lift-card"
            >
              <Statistic
                title={<span style={{ color: '#64748b', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</span>}
                value={s.value}
                loading={loading}
                formatter={s.isRupiah ? formatRupiah : undefined}
                valueStyle={{ color: s.color, fontWeight: 900, fontSize: s.isRupiah ? 19 : 26, marginTop: 4 }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* ── Feature Cards ── */}
      <Title level={5} style={{ margin: '0 0 14px 4px', fontWeight: 800, color: '#1e293b', fontSize: 15 }}>
        Panel Dasbor Fitur
      </Title>
      <Row gutter={[16, 16]}>
        {featureCards.map((f) => (
          <Col xs={24} sm={12} md={6} key={f.key}>
            <Card
              bordered={false}
              hoverable
              style={{
                borderRadius: 14,
                height: '100%',
                border: '1px solid #f1f5f9',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              bodyStyle={{ padding: 0 }}
              onClick={() => onNavigate(f.key)}
            >
              <div
                style={{
                  background: f.bg,
                  height: 64,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 20px',
                  borderBottom: `2px solid ${f.accent}15`,
                }}
              >
                <Text strong style={{ color: f.accent, fontSize: 12, letterSpacing: 1.5, fontWeight: 800 }}>
                  {f.label}
                </Text>
              </div>
              <div style={{ padding: '16px 20px 20px' }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: '#1e293b', marginBottom: 6 }}>{f.title}</div>
                <Text style={{ fontSize: 12, color: '#64748b', lineHeight: '1.6' }}>{f.desc}</Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
