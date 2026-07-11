import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Statistic, Button, Divider, Typography, Space, Tag } from 'antd';

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

  return (
    <div style={{ padding: '0 12px 24px' }}>
      {/* Hero Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)',
          borderRadius: 16,
          padding: '40px 48px',
          color: '#fff',
          boxShadow: '0 10px 25px -5px rgba(4, 120, 87, 0.3)',
          marginBottom: 24,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 650 }}>
          <Tag color="rgba(255,255,255,0.2)" style={{ color: '#fff', border: 'none', marginBottom: 12 }}>
            Digital Cooperative Expo 2026
          </Tag>
          <Title level={1} style={{ color: '#fff', margin: '0 0 12px 0', fontWeight: 800 }}>
            Smart Cooperative Station
          </Title>
          <Paragraph style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: '1.6', margin: '0 0 24px 0' }}>
            <strong>Koperasi Desa Merah Putih</strong> — Solusi sistem operasional 3-lapis
            (Station, Edge Server, dan Cloud Platform) berbasis <em>hash-chain ledger</em> append-only
            untuk transparansi keuangan desa yang mutlak, cepat, dan terpercaya.
          </Paragraph>
          <Space size="middle">
            <Button
              type="primary"
              size="large"
              onClick={() => onNavigate('station')}
              style={{
                backgroundColor: '#fff',
                color: '#065f46',
                border: 'none',
                fontWeight: 700,
                borderRadius: 6,
              }}
            >
              Buka Smart Station
            </Button>
            <Button
              type="text"
              size="large"
              onClick={() => onNavigate('edge')}
              style={{
                color: '#fff',
                fontWeight: 600,
              }}
            >
              Edge Dashboard →
            </Button>
          </Space>
        </div>
        {/* Abstract decorative circles */}
        <div
          style={{
            position: 'absolute',
            right: '-10%',
            bottom: '-30%',
            width: 350,
            height: 350,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            zIndex: 1,
          }}
        />
      </div>

      {/* System Status Alert banner */}
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card
            bordered={false}
            style={{
              borderRadius: 12,
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)',
              backgroundColor: isOffline ? '#fffbeb' : '#f0fdf4',
              border: isOffline ? '1px solid #fef3c7' : '1px solid #dcfce7',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <Space direction="vertical" size={2}>
                <Text strong style={{ color: isOffline ? '#92400e' : '#166534', fontSize: 14 }}>
                  [ STATUS SISTEM: {isOffline ? 'OFFLINE' : 'ONLINE'} ]
                </Text>
                <div style={{ fontSize: 12, color: isOffline ? '#b45309' : '#15803d' }}>
                  {isOffline
                    ? 'Transaksi dicatat ke dalam database lokal. Sinkronisasi otomatis ditangguhkan hingga koneksi dipulihkan.'
                    : `Semua transaksi tersinkronisasi. Sinkronisasi terakhir pada: ${systemState.last_sync_at || '-'}`}
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
                  borderRadius: 4,
                  fontWeight: 600,
                }}
              >
                Konfigurasi Koneksi
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Statistic Row */}
      <Title level={4} style={{ margin: '0 0 16px 4px', fontWeight: 700, color: '#334155' }}>
        Statistik Koperasi Desa
      </Title>
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={12} sm={12} md={6}>
          <Card 
            bordered={false} 
            style={{
              borderRadius: 16,
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.02), 0 4px 6px -4px rgba(0, 0, 0, 0.02)',
              borderLeft: '6px solid #64748b',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              padding: '6px 8px'
            }}
            className="hover-lift-card"
          >
            <Statistic
              title={<span style={{ color: '#475569', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Koperasi Terdaftar</span>}
              value={stats.total_konsultasi}
              loading={loading}
              valueStyle={{ color: '#1e293b', fontWeight: 900, fontSize: 28, marginTop: 4 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card 
            bordered={false} 
            style={{
              borderRadius: 16,
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.02), 0 4px 6px -4px rgba(0, 0, 0, 0.02)',
              borderLeft: '6px solid #2563eb',
              background: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              padding: '6px 8px'
            }}
            className="hover-lift-card"
          >
            <Statistic
              title={<span style={{ color: '#1e3a8a', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Total Anggota</span>}
              value={stats.total_anggota}
              loading={loading}
              valueStyle={{ color: '#1d4ed8', fontWeight: 900, fontSize: 28, marginTop: 4 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card 
            bordered={false} 
            style={{
              borderRadius: 16,
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.02), 0 4px 6px -4px rgba(0, 0, 0, 0.02)',
              borderLeft: '6px solid #7c3aed',
              background: 'linear-gradient(135deg, #ffffff 0%, #f5f3ff 100%)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              padding: '6px 8px'
            }}
            className="hover-lift-card"
          >
            <Statistic
              title={<span style={{ color: '#4c1d95', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Transaksi Tercatat</span>}
              value={stats.total_transaksi}
              loading={loading}
              valueStyle={{ color: '#6d28d9', fontWeight: 900, fontSize: 28, marginTop: 4 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card 
            bordered={false} 
            style={{
              borderRadius: 16,
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.02), 0 4px 6px -4px rgba(0, 0, 0, 0.02)',
              borderLeft: '6px solid #059669',
              background: 'linear-gradient(135deg, #ffffff 0%, #ecfdf5 100%)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              padding: '6px 8px'
            }}
            className="hover-lift-card"
          >
            <Statistic
              title={<span style={{ color: '#064e3b', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Volume Transaksi</span>}
              value={stats.total_volume}
              loading={loading}
              formatter={formatRupiah}
              valueStyle={{ color: '#047857', fontWeight: 900, fontSize: 22, marginTop: 4 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Navigation Quick Cards */}
      <Title level={4} style={{ margin: '0 0 16px 4px', fontWeight: 700, color: '#334155' }}>
        Panel Dasbor Fitur
      </Title>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={6}>
          <Card
            bordered={false}
            hoverable
            style={{ borderRadius: 12, height: '100%' }}
            cover={
              <div style={{ background: '#ecfdf5', height: 80, display: 'flex', alignItems: 'center', padding: '0 24px', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                <Text strong style={{ color: '#047857', fontSize: 16, letterSpacing: 0.5 }}>SMART STATION</Text>
              </div>
            }
            onClick={() => onNavigate('station')}
          >
            <Card.Meta
              title={<span style={{ fontWeight: 700 }}>Smart Station</span>}
              description="Kiosk simulasi input kasir. Mendukung QR code reader, virtual RFID card reader, dan timbangan digital."
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            bordered={false}
            hoverable
            style={{ borderRadius: 12, height: '100%' }}
            cover={
              <div style={{ background: '#f5f3ff', height: 80, display: 'flex', alignItems: 'center', padding: '0 24px', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                <Text strong style={{ color: '#6d28d9', fontSize: 16, letterSpacing: 0.5 }}>EDGE SERVER</Text>
              </div>
            }
            onClick={() => onNavigate('edge')}
          >
            <Card.Meta
              title={<span style={{ fontWeight: 700 }}>Edge Server</span>}
              description="Manajemen node lokal. Aktifkan mode offline, sinkronisasi antrean transaksi, dan verifikasi integritas rantai ledger."
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            bordered={false}
            hoverable
            style={{ borderRadius: 12, height: '100%' }}
            cover={
              <div style={{ background: '#fef2f2', height: 80, display: 'flex', alignItems: 'center', padding: '0 24px', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                <Text strong style={{ color: '#b91c1c', fontSize: 16, letterSpacing: 0.5 }}>PEMERINTAH</Text>
              </div>
            }
            onClick={() => onNavigate('government')}
          >
            <Card.Meta
              title={<span style={{ fontWeight: 700 }}>Dasbor Pemerintah</span>}
              description="Akses monitoring dinas Koperasi. Tinjau performa koperasi nasional, audit kepatuhan rantai, dan diagram volume."
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            bordered={false}
            hoverable
            style={{ borderRadius: 12, height: '100%' }}
            cover={
              <div style={{ background: '#eff6ff', height: 80, display: 'flex', alignItems: 'center', padding: '0 24px', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                <Text strong style={{ color: '#1d4ed8', fontSize: 16, letterSpacing: 0.5 }}>ANGGOTA</Text>
              </div>
            }
            onClick={() => onNavigate('member')}
          >
            <Card.Meta
              title={<span style={{ fontWeight: 700 }}>Dasbor Anggota</span>}
              description="Layanan mandiri anggota. Lihat informasi saldo simpanan, kartu digital, dan cetak struk belanja mandiri."
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
