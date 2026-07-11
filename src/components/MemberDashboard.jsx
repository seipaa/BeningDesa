import React, { useState, useEffect } from 'react';
import { Card, Table, Input, Button, Row, Col, Space, Typography, Badge, Modal, Empty, Spin, Avatar, Statistic, Divider, message, Alert, Tag } from 'antd';

const { Title, Text, Paragraph } = Typography;

const FALLBACK_MEMBERS = [
  { id: 'd4e5f6a7-b8c9-0123-4567-890abcdef001', nama: 'Ahmad Wijaya', rfid_card_id: 'RFID-001', qr_code_id: 'QR-001', saldo_simpanan: 150000, desa: 'Desa Bening', kecamatan: 'Kec. Bening Maju', konsultasi_nama: 'Koperasi Desa Merah Putih' },
  { id: 'd4e5f6a7-b8c9-0123-4567-890abcdef002', nama: 'Budi Santoso', rfid_card_id: 'RFID-002', qr_code_id: 'QR-002', saldo_simpanan: 320000, desa: 'Desa Bening', kecamatan: 'Kec. Bening Maju', konsultasi_nama: 'Koperasi Desa Merah Putih' },
  { id: 'd4e5f6a7-b8c9-0123-4567-890abcdef003', nama: 'Citra Dewi', rfid_card_id: 'RFID-003', qr_code_id: 'QR-003', saldo_simpanan: 85000, desa: 'Desa Bening', kecamatan: 'Kec. Bening Maju', konsultasi_nama: 'Koperasi Desa Merah Putih' },
  { id: 'd4e5f6a7-b8c9-0123-4567-890abcdef004', nama: 'Dedi Kurniawan', rfid_card_id: 'RFID-004', qr_code_id: 'QR-004', saldo_simpanan: 420000, desa: 'Desa Bening', kecamatan: 'Kec. Bening Maju', konsultasi_nama: 'Koperasi Desa Merah Putih' },
  { id: 'd4e5f6a7-b8c9-0123-4567-890abcdef005', nama: 'Erni Wati', rfid_card_id: 'RFID-005', qr_code_id: 'QR-005', saldo_simpanan: 210000, desa: 'Desa Bening', kecamatan: 'Kec. Bening Maju', konsultasi_nama: 'Koperasi Desa Merah Putih' },
  { id: 'd4e5f6a7-b8c9-0123-4567-890abcdef006', nama: 'Fajar Nugroho', rfid_card_id: 'RFID-006', qr_code_id: 'QR-006', saldo_simpanan: 500000, desa: 'Desa Bening', kecamatan: 'Kec. Bening Maju', konsultasi_nama: 'Koperasi Desa Merah Putih' },
  { id: 'd4e5f6a7-b8c9-0123-4567-890abcdef007', nama: 'Gita Rahayu', rfid_card_id: 'RFID-007', qr_code_id: 'QR-007', saldo_simpanan: 175000, desa: 'Desa Bening', kecamatan: 'Kec. Bening Maju', konsultasi_nama: 'Koperasi Desa Merah Putih' },
  { id: 'd4e5f6a7-b8c9-0123-4567-890abcdef008', nama: 'Hadi Pranoto', rfid_card_id: 'RFID-008', qr_code_id: 'QR-008', saldo_simpanan: 280000, desa: 'Desa Bening', kecamatan: 'Kec. Bening Maju', konsultasi_nama: 'Koperasi Desa Merah Putih' }
];

const FALLBACK_MEMBER_TX = {
  'd4e5f6a7-b8c9-0123-4567-890abcdef001': [
    { id: 'tx-sim-101', timestamp: '2026-07-10T08:00:00Z', total: 107000, gerai_nama: 'Gerai Pusat', metode_input: 'manual', synced: true, hash: 'a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890', prev_hash: '9e8d7c6b5a4f3e2d1c0b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a10beef', items: JSON.stringify([{nama: 'Beras Premium 5kg', jumlah: 1, harga_satuan: 75000, subtotal: 75000}, {nama: 'Minyak Goreng 2L', jumlah: 1, harga_satuan: 32000, subtotal: 32000}]) }
  ],
  'd4e5f6a7-b8c9-0123-4567-890abcdef002': [
    { id: 'tx-sim-102', timestamp: '2026-07-10T08:15:00Z', total: 58000, gerai_nama: 'Gerai Pusat', metode_input: 'qr_scan', synced: true, hash: 'b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890a1', prev_hash: 'a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890', items: JSON.stringify([{nama: 'Gula Pasir 1kg', jumlah: 2, harga_satuan: 15000, subtotal: 30000}, {nama: 'Telur Ayam 1kg', jumlah: 1, harga_satuan: 28000, subtotal: 28000}]) }
  ]
};

export default function MemberDashboard() {
  const [members, setMembers] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [usingMockFallback, setUsingMockFallback] = useState(false);

  // Selected member dashboard state
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [memberDetail, setMemberDetail] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Receipt Modal state
  const [activeTx, setActiveTx] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  // Titipan Saya state
  const [titipanList, setTitipanList] = useState([]);
  const [loadingTitipan, setLoadingTitipan] = useState(false);
  const [selectedTitipan, setSelectedTitipan] = useState(null);
  const [titipanRiwayat, setTitipanRiwayat] = useState([]);
  const [showTitipanModal, setShowTitipanModal] = useState(false);
  const [loadingRiwayat, setLoadingRiwayat] = useState(false);
  const [memberTab, setMemberTab] = useState('transaksi');

  const fetchMembers = async (query = '') => {
    setLoadingList(true);
    try {
      const res = await fetch(`/api/cloud/anggota${query ? '?search=' + encodeURIComponent(query) : ''}`);
      if (res.ok) {
        const data = await res.json();
        setMembers(data.anggota || []);
      } else {
        throw new Error();
      }
    } catch (e) {
      console.warn('[MEMBER] Gagal memuat daftar anggota, menggunakan data offline.');
      const filtered = FALLBACK_MEMBERS.filter(m =>
        m.nama.toLowerCase().includes(query.toLowerCase()) ||
        m.rfid_card_id.toLowerCase().includes(query.toLowerCase()) ||
        m.qr_code_id.toLowerCase().includes(query.toLowerCase())
      );
      setMembers(filtered);
      setUsingMockFallback(true);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSearch = () => {
    fetchMembers(searchQuery);
  };

  const handleSelectMember = async (memberId) => {
    setSelectedMemberId(memberId);
    setLoadingDetail(true);
    setMemberTab('transaksi');
    try {
      const res = await fetch(`/api/cloud/dashboard/anggota/${memberId}`);
      if (res.ok) {
        const data = await res.json();
        setMemberDetail(data.anggota);
        setTransactions(data.transaksi || []);
      } else {
        throw new Error();
      }
    } catch (e) {
      console.warn('[MEMBER] Gagal memuat profil anggota, menggunakan data offline.');
      const foundMember = FALLBACK_MEMBERS.find(m => m.id === memberId);
      setMemberDetail(foundMember);
      setTransactions(FALLBACK_MEMBER_TX[memberId] || []);
      setUsingMockFallback(true);
    } finally {
      setLoadingDetail(false);
    }
    // Load titipan
    fetchTitipan(memberId);
  };

  const fetchTitipan = async (memberId) => {
    setLoadingTitipan(true);
    try {
      const res = await fetch(`/api/member/titipan?anggota_id=${memberId}`);
      if (res.ok) {
        const data = await res.json();
        setTitipanList(data.titipan || []);
      }
    } catch (e) {
      setTitipanList([]);
    } finally {
      setLoadingTitipan(false);
    }
  };

  const handleShowTitipanRiwayat = async (barang) => {
    setSelectedTitipan(barang);
    setShowTitipanModal(true);
    setLoadingRiwayat(true);
    try {
      const res = await fetch(`/api/member/titipan/${barang.id}/riwayat`);
      if (res.ok) {
        const data = await res.json();
        setTitipanRiwayat(data.events || []);
      }
    } catch (e) {
      setTitipanRiwayat([]);
    } finally {
      setLoadingRiwayat(false);
    }
  };

  const handleShowReceipt = (tx) => {
    setActiveTx(tx);
    setShowReceipt(true);
  };

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num);
  };

  const totalSpent = transactions.reduce((sum, t) => sum + parseFloat(t.total), 0);

  return (
    <div style={{ padding: '0 12px 24px' }}>
      <Alert
        message={
          <div style={{ fontSize: 12, fontWeight: 600 }}>
            {usingMockFallback ? (
              <span>[ MODE DEMO/OFFLINE AKTIF: Server cloud belum tersambung, Dasbor Anggota berjalan dalam memori lokal ]</span>
            ) : (
              <span>[ MODE OPERASIONAL: Menampilkan data keanggotaan dari Cloud Platform ]</span>
            )}
          </div>
        }
        type={usingMockFallback ? "warning" : "info"}
        style={{ marginBottom: 16, borderRadius: 8 }}
      />

      {selectedMemberId && memberDetail ? (
        /* Member Dashboard View */
        <div>
          <Button
            onClick={() => {
              setSelectedMemberId(null);
              setMemberDetail(null);
              setTransactions([]);
              fetchMembers(searchQuery);
            }}
            style={{ marginBottom: 20, borderRadius: 8, fontWeight: 700 }}
          >
            &lt;= KEMBALI KE PENCARIAN
          </Button>

          {loadingDetail ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Spin size="large" tip="Membuat dasbor anggota..." />
            </div>
          ) : (
            <Row gutter={[24, 24]}>
              {/* Left Column: Glassmorphic Member Card & stats */}
              <Col xs={24} lg={9}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  {/* Virtual Member Card */}
                  <Card
                    bordered={false}
                    style={{
                      borderRadius: 18,
                      background: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)',
                      color: '#fff',
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: '0 12px 24px -10px rgba(5, 150, 105, 0.4)',
                      border: 'none',
                    }}
                    bodyStyle={{ padding: 24 }}
                  >
                    {/* Chip Graphic */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                      <div
                        style={{
                          width: 44,
                          height: 32,
                          background: 'linear-gradient(135deg, #f5e6c8 0%, #c4943b 100%)',
                          borderRadius: 6,
                          boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4)',
                        }}
                      />
                      <Text style={{ color: '#fff', fontWeight: 900, fontSize: 13, letterSpacing: 1 }}>
                        KDMP MEMBER
                      </Text>
                    </div>

                    <div style={{ marginBottom: 28 }}>
                      <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
                        Nama Pemegang Kartu
                      </Text>
                      <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: '0.5px', marginTop: 2, textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                        {memberDetail.nama.toUpperCase()}
                      </div>
                    </div>

                    <Row>
                      <Col span={14}>
                        <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          RFID Serial No
                        </Text>
                        <div style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 700, marginTop: 2 }}>
                          {memberDetail.rfid_card_id}
                        </div>
                      </Col>
                      <Col span={10} style={{ textAlign: 'right' }}>
                        <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          QR Code ID
                        </Text>
                        <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>
                          {memberDetail.qr_code_id}
                        </div>
                      </Col>
                    </Row>

                    {/* Translucent background elements */}
                    <div
                      style={{
                        position: 'absolute',
                        right: '-10%',
                        bottom: '-25%',
                        width: 180,
                        height: 180,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.06)',
                      }}
                    />
                  </Card>

                  {/* Savings balance Card */}
                  <Card
                    bordered={false}
                    style={{ borderRadius: 12, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}
                  >
                    <Statistic
                      title="Saldo Simpanan Koperasi"
                      value={memberDetail.saldo_simpanan}
                      formatter={formatRupiah}
                      valueStyle={{ color: '#059669', fontWeight: 900 }}
                    />
                    <Divider style={{ margin: '12px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <Text type="secondary">Koperasi Asal:</Text>
                      <Text strong style={{ color: '#1e293b' }}>{memberDetail.konsultasi_nama}</Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 8 }}>
                      <Text type="secondary">Wilayah:</Text>
                      <Text strong style={{ color: '#1e293b' }}>
                        {memberDetail.desa}, {memberDetail.kecamatan}
                      </Text>
                    </div>
                  </Card>

                  {/* Personal Stats card */}
                  <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Statistic
                          title="Jumlah Kunjungan"
                          value={transactions.length}
                          valueStyle={{ fontWeight: 800 }}
                        />
                      </Col>
                      <Col span={12}>
                        <Statistic
                          title="Total Belanja"
                          value={totalSpent}
                          formatter={formatRupiah}
                          valueStyle={{ color: '#dc2626', fontWeight: 900, fontSize: 16 }}
                        />
                      </Col>
                    </Row>
                  </Card>
                </Space>
              </Col>

              {/* Right Column: Transactions + Titipan Tabs */}
              <Col xs={24} lg={15}>
                {/* Tab Switcher */}
                <div style={{
                  display: 'inline-flex',
                  background: '#f1f5f9',
                  padding: '5px',
                  borderRadius: '30px',
                  border: '1px solid #cbd5e1',
                  marginBottom: 16,
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.03)'
                }}>
                  <button
                    onClick={() => setMemberTab('transaksi')}
                    style={{
                      padding: '6px 20px',
                      fontWeight: 800,
                      fontSize: 11,
                      cursor: 'pointer',
                      border: 'none',
                      borderRadius: '25px',
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      background: memberTab === 'transaksi' ? '#0f172a' : 'transparent',
                      color: memberTab === 'transaksi' ? '#fff' : '#64748b',
                      boxShadow: memberTab === 'transaksi' ? '0 4px 10px rgba(15, 23, 42, 0.25)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      letterSpacing: '0.5px'
                    }}
                  >
                    RIWAYAT BELANJA ({transactions.length})
                  </button>
                  <button
                    onClick={() => setMemberTab('titip')}
                    style={{
                      padding: '6px 20px',
                      fontWeight: 800,
                      fontSize: 11,
                      cursor: 'pointer',
                      border: 'none',
                      borderRadius: '25px',
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      background: memberTab === 'titip' ? '#16a34a' : 'transparent',
                      color: memberTab === 'titip' ? '#fff' : '#64748b',
                      boxShadow: memberTab === 'titip' ? '0 4px 10px rgba(22, 163, 74, 0.25)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      letterSpacing: '0.5px'
                    }}
                  >
                    TITIP SAYA ({titipanList.length})
                  </button>
                </div>

                {memberTab === 'transaksi' && (
                  <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', height: '100%' }} title={<span style={{ fontWeight: 800 }}>RIWAYAT TRANSAKSI ANGGOTA</span>}>
                    <Table
                      dataSource={transactions}
                      rowKey="id"
                      size="middle"
                      pagination={{ pageSize: 6 }}
                      onRow={(record) => ({
                        onClick: () => handleShowReceipt(record),
                        style: { cursor: 'pointer' },
                      })}
                      columns={[
                        {
                          title: 'Tanggal & Waktu',
                          dataIndex: 'timestamp',
                          render: (t) => new Date(t).toLocaleString('id-ID'),
                        },
                        {
                          title: 'Gerai',
                          dataIndex: 'gerai_nama',
                          render: (v) => <span style={{ fontWeight: 600 }}>{v}</span>
                        },
                        {
                          title: 'Jumlah Item',
                          dataIndex: 'items',
                          align: 'center',
                          render: (items) => {
                            const arr = typeof items === 'string' ? JSON.parse(items) : items;
                            return `${arr?.length || 0} item`;
                          },
                        },
                        {
                          title: 'Total Belanja',
                          dataIndex: 'total',
                          render: (total) => <span style={{ fontWeight: 700, color: '#dc2626' }}>{formatRupiah(total)}</span>,
                        },
                        {
                          title: 'Status Sync',
                          dataIndex: 'synced',
                          render: (synced) => (
                            <Badge status={synced ? 'success' : 'warning'} text={synced ? 'Synced' : 'Local'} />
                          ),
                        },
                      ]}
                    />
                  </Card>
                )}

                {memberTab === 'titip' && (
                  <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', height: '100%', borderTop: '3px solid #15803d' }} title={<span style={{ fontWeight: 800, color: '#15803d' }}>BARANG TITIPAN SAYA</span>}>
                    {loadingTitipan ? (
                      <div style={{ textAlign: 'center', padding: '40px 0' }}><Spin tip="Memuat data titipan..." /></div>
                    ) : titipanList.length === 0 ? (
                      <Empty description="Belum ada barang yang dititipkan." style={{ padding: '40px 0' }} />
                    ) : (
                      <div>
                        {titipanList.map(barang => {
                          const statusColors = { MASUK: '#f59e0b', LISTED: '#3b82f6', SOLD: '#15803d', RETURNED: '#ef4444' };
                          const statusLabel = { MASUK: 'Menunggu Dipajang', LISTED: 'Sedang Dipajang', SOLD: 'Terjual', RETURNED: 'Dikembalikan' };
                          const status = barang.status_terakhir || 'MASUK';
                          return (
                            <div key={barang.id} onClick={() => handleShowTitipanRiwayat(barang)}
                              style={{ border: '1px solid #e2e8f0', borderLeft: `4px solid ${statusColors[status] || '#64748b'}`, borderRadius: 10, padding: 14, marginBottom: 12, cursor: 'pointer', transition: 'all 0.2s', background: '#fafafa' }}
                              onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
                              onMouseLeave={e => e.currentTarget.style.background = '#fafafa'}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                  <div style={{ fontWeight: 800, fontSize: 14, color: '#1e293b' }}>{barang.nama_barang}</div>
                                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>{barang.kategori} · {barang.satuan === 'kg' ? `${parseFloat(barang.berat_kg || 0).toFixed(3)} kg` : `${barang.jumlah_pcs} pcs`}</div>
                                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 1 }}>{formatRupiah(barang.harga_satuan)} / {barang.satuan}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                  <div style={{ background: statusColors[status] + '12', color: statusColors[status], fontWeight: 800, fontSize: 10, padding: '3px 10px', borderRadius: 20, border: `1px solid ${statusColors[status]}33`, marginBottom: 4 }}>
                                    {statusLabel[status] || status}
                                  </div>
                                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{new Date(barang.created_at).toLocaleDateString('id-ID')}</div>
                                </div>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, paddingTop: 8, borderTop: '1px dashed #e2e8f0', fontSize: 11 }}>
                                <span style={{ color: '#475569' }}>Nilai Titip: <strong>{formatRupiah((barang.satuan === 'kg' ? (parseFloat(barang.berat_kg || 0)) : (barang.jumlah_pcs || 0)) * barang.harga_satuan)}</strong></span>
                                <span style={{ color: '#15803d', fontWeight: 700 }}>Klik untuk riwayat hash ›</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </Card>
                )}
              </Col>
            </Row>
          )}

          {/* === EVENT CHAIN RIWAYAT MODAL === */}
          <Modal
            open={showTitipModal}
            onCancel={() => { setShowTitipanModal(false); setTitipanRiwayat([]); setSelectedTitipan(null); }}
            footer={<Button onClick={() => setShowTitipanModal(false)} style={{ fontWeight: 700 }}>Tutup</Button>}
            centered
            width={580}
            title={<span style={{ fontWeight: 800, color: '#15803d' }}>Riwayat Event Chain: {selectedTitipan?.nama_barang}</span>}
          >
            {loadingRiwayat ? (
              <div style={{ textAlign: 'center', padding: 40 }}><Spin tip="Memuat riwayat kriptografis..." /></div>
            ) : (
              <div>
                <div style={{ marginBottom: 16, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16, color: '#15803d', fontWeight: 'bold' }}>✓</span>
                  <span style={{ fontWeight: 700, color: '#15803d', fontSize: 12 }}>Rantai Hash Terverifikasi — Riwayat Otentik Tidak Dapat Dimanipulasi</span>
                </div>

                {/* VISUAL RECEIPT (Like Struk Thermal) */}
                {selectedTitipan && (
                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 12,
                    padding: 20,
                    marginBottom: 24,
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
                    position: 'relative'
                  }}>
                    <div style={{ textAlign: 'center', marginBottom: 16 }}>
                      <div style={{ fontSize: 10, fontWeight: 800, color: '#1e293b', background: '#e2e8f0', display: 'inline-block', padding: '2px 8px', borderRadius: 4, letterSpacing: 1, textTransform: 'uppercase' }}>BUKTI TITIP JUAL</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginTop: 8 }}>KOPERASI DESA MERAH PUTIH</div>
                      <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Wilayah: {memberDetail?.desa} · RFID: {memberDetail?.rfid_card_id}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>Tanggal Masuk: {new Date(selectedTitipan.created_at).toLocaleString('id-ID')}</div>
                    </div>

                    <Divider style={{ margin: '12px 0', borderStyle: 'dashed' }} />

                    <Row style={{ marginBottom: 8, fontSize: 12 }}>
                      <Col span={10} style={{ color: '#64748b' }}>Nama Barang:</Col>
                      <Col span={14} style={{ textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>{selectedTitipan.nama_barang}</Col>
                    </Row>
                    <Row style={{ marginBottom: 8, fontSize: 12 }}>
                      <Col span={10} style={{ color: '#64748b' }}>Kategori:</Col>
                      <Col span={14} style={{ textAlign: 'right', fontWeight: 600 }}>{selectedTitipan.kategori}</Col>
                    </Row>
                    <Row style={{ marginBottom: 8, fontSize: 12 }}>
                      <Col span={10} style={{ color: '#64748b' }}>Ukuran / Qty:</Col>
                      <Col span={14} style={{ textAlign: 'right', fontWeight: 700, color: '#15803d' }}>
                        {selectedTitipan.satuan === 'kg'
                          ? `${parseFloat(selectedTitipan.berat_kg || 0).toFixed(3)} kg`
                          : `${selectedTitipan.jumlah_pcs} pcs`}
                      </Col>
                    </Row>
                    <Row style={{ marginBottom: 8, fontSize: 12 }}>
                      <Col span={10} style={{ color: '#64748b' }}>Harga per {selectedTitipan.satuan}:</Col>
                      <Col span={14} style={{ textAlign: 'right', fontWeight: 600 }}>{formatRupiah(selectedTitipan.harga_satuan)}</Col>
                    </Row>

                    <Divider style={{ margin: '12px 0', borderStyle: 'dashed' }} />

                    {(() => {
                      const totalVal = (selectedTitipan.satuan === 'kg' ? parseFloat(selectedTitipan.berat_kg || 0) : parseInt(selectedTitipan.jumlah_pcs || 0)) * parseFloat(selectedTitipan.harga_satuan)
                      const komisi = totalVal * ((selectedTitipan.komisi_pct || 5) / 100)
                      return (
                        <div style={{ background: '#f0fdf4', padding: '10px 14px', borderRadius: 8 }}>
                          <Row style={{ fontSize: 12, marginBottom: 4 }}>
                            <Col span={12} style={{ color: '#1e293b' }}>Nilai Titip:</Col>
                            <Col span={12} style={{ textAlign: 'right', fontWeight: 700 }}>{formatRupiah(totalVal)}</Col>
                          </Row>
                          <Row style={{ fontSize: 12, color: '#dc2626', marginBottom: 4 }}>
                            <Col span={12}>Komisi Koperasi ({selectedTitipan.komisi_pct}%):</Col>
                            <Col span={12} style={{ textAlign: 'right', fontWeight: 600 }}>-{formatRupiah(komisi)}</Col>
                          </Row>
                          <Row style={{ fontSize: 13, color: '#15803d', fontWeight: 800, borderTop: '1px dashed #bbf7d0', paddingTop: 6 }}>
                            <Col span={12}>Estimasi Hasil Bersih:</Col>
                            <Col span={12} style={{ textAlign: 'right' }}>{formatRupiah(totalVal - komisi)}</Col>
                          </Row>
                        </div>
                      )
                    })()}

                    <Divider style={{ margin: '12px 0', borderStyle: 'dashed' }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b', marginBottom: 4 }}>
                      <span>Status Barang Saat Ini:</span>
                      <strong style={{
                        color: selectedTitipan.status_terakhir === 'SOLD' ? '#16a34a' :
                               selectedTitipan.status_terakhir === 'LISTED' ? '#2563eb' :
                               selectedTitipan.status_terakhir === 'RETURNED' ? '#dc2626' : '#d97706'
                      }}>
                        {selectedTitipan.status_terakhir === 'SOLD' ? 'TERJUAL (SOLD)' :
                         selectedTitipan.status_terakhir === 'LISTED' ? 'SEDANG DIPAJANG (LISTED)' :
                         selectedTitipan.status_terakhir === 'RETURNED' ? 'DIKEMBALIKAN' : 'MENUNGGU DIPAJANG (MASUK)'}
                      </strong>
                    </div>
                  </div>
                )}

                <div style={{ fontWeight: 800, fontSize: 13, color: '#1e293b', marginBottom: 12 }}>TIMELINE EVENT CHAIN KRIPTOGRAFIS</div>

                {titipanRiwayat.length === 0 ? (
                  <Empty description="Belum ada riwayat event." />
                ) : (
                  <div style={{ position: 'relative' }}>
                    {titipanRiwayat.map((ev, idx) => {
                      const evColors = { MASUK: '#f59e0b', LISTED: '#3b82f6', SOLD: '#15803d', RETURNED: '#ef4444' };
                      const evLabel = { MASUK: 'MASUK', LISTED: 'DIPAJANG', SOLD: 'TERJUAL', RETURNED: 'DIKEMBALIKAN' };
                      const color = evColors[ev.event_type] || '#64748b';
                      return (
                        <div key={ev.id} style={{ display: 'flex', gap: 12, marginBottom: 16, position: 'relative' }}>
                          <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff', boxShadow: `0 0 0 4px ${color}22` }}>
                            {idx + 1}
                          </div>
                          {idx < titipanRiwayat.length - 1 && (
                            <div style={{ position: 'absolute', left: 17, top: 36, width: 2, height: 20, background: '#e2e8f0' }} />
                          )}
                          <div style={{ flex: 1, background: '#f8fafc', borderRadius: 8, padding: 12, border: `1px solid ${color}33` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                              <span style={{ fontWeight: 800, color, fontSize: 12 }}>{evLabel[ev.event_type] || ev.event_type}</span>
                              <span style={{ fontSize: 11, color: '#94a3b8' }}>{new Date(ev.timestamp).toLocaleString('id-ID')}</span>
                            </div>
                            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#475569', marginBottom: 4 }}>
                              Hash: <strong>{ev.hash?.substring(0, 8)}...xxxxxxxx</strong>
                            </div>
                            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#94a3b8' }}>
                              Prev: {ev.prev_hash?.substring(0, 8)}...xxxxxxxx
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </Modal>
        </div>
      ) : (

        /* Members Directory Search View */
        <Card
          bordered={false}
          style={{ borderRadius: 12, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}
          title={<span style={{ fontWeight: 800 }}>CARI KARTU ANGGOTA KOPERASI</span>}
        >
          <div style={{ maxWidth: 500, margin: '0 auto 24px', display: 'flex', gap: 12 }}>
            <Input
              placeholder="Masukkan nama anggota, RFID, atau QR code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onPressEnter={handleSearch}
              size="large"
              style={{ borderRadius: 8 }}
            />
            <Button type="primary" onClick={handleSearch} size="large" style={{ borderRadius: 8, fontWeight: 700, paddingLeft: 24, paddingRight: 24 }}>
              CARI
            </Button>
          </div>

          {loadingList ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Spin size="large" tip="Mencari data anggota..." />
            </div>
          ) : members.length === 0 ? (
            <Empty description="Anggota tidak ditemukan." />
          ) : (
            <Row gutter={[16, 16]}>
              {members.map((m) => (
                <Col xs={24} sm={12} md={8} key={m.id}>
                  <Card
                    hoverable
                    bordered
                    onClick={() => handleSelectMember(m.id)}
                    style={{ borderRadius: 12, transition: 'all 0.2s', border: '1px solid #e2e8f0' }}
                    className="hover-lift-card"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: '50%',
                          backgroundColor: '#059669',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          flexShrink: 0,
                          fontSize: 16,
                          boxShadow: '0 2px 8px rgba(5,150,105,0.2)'
                        }}
                      >
                        {m.nama.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ overflow: 'hidden', flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: 14, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {m.nama}
                        </div>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          {m.konsultasi_nama}
                        </Text>
                        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <Text style={{ fontSize: 11, color: '#64748b' }}>Saldo:</Text>
                          <Text strong style={{ color: '#059669', fontSize: 15, fontWeight: 800 }}>
                            {formatRupiah(m.saldo_simpanan)}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card>
      )}

      {/* Member Thermal Struk Modal */}
      <Modal
        open={showReceipt}
        onCancel={() => setShowReceipt(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setShowReceipt(false)} style={{ fontWeight: 700 }}>
            TUTUP STRUK
          </Button>,
        ]}
        centered
        width={380}
        bodyStyle={{ padding: 12, backgroundColor: '#f1f5f9' }}
      >
        {activeTx && (
          <div>
            <div
              style={{
                backgroundColor: '#fff',
                borderRadius: 8,
                padding: '24px 20px',
                fontFamily: 'monospace',
                boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                fontSize: 12,
                color: '#1e293b',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 6,
                  backgroundImage:
                    'linear-gradient(45deg, transparent 33.333%, #f1f5f9 33.333%, #f1f5f9 66.667%, transparent 66.667%), linear-gradient(-45deg, transparent 33.333%, #f1f5f9 33.333%, #f1f5f9 66.667%, transparent 66.667%)',
                  backgroundSize: '12px 24px',
                  backgroundPosition: '0 -12px',
                }}
              />

              <div style={{ textAlign: 'center', marginBottom: 16, marginTop: 6 }}>
                <div style={{ fontWeight: 800, fontSize: 14 }}>KOPERASI DESA MP</div>
                <div style={{ fontSize: 10, color: '#64748b' }}>{activeTx.gerai_nama}</div>
                <div style={{ fontSize: 10, color: '#64748b' }}>
                  {new Date(activeTx.timestamp).toLocaleString('id-ID')}
                </div>
                <div style={{ fontSize: 10, color: '#64748b' }}>BLOCK HASH ID: #{activeTx.hash ? activeTx.hash.substring(0, 8) : '-'}</div>
              </div>

              <div style={{ borderBottom: '1px dashed #cbd5e1', margin: '12px 0' }} />

              {/* Items */}
              <div>
                {(typeof activeTx.items === 'string' ? JSON.parse(activeTx.items) : activeTx.items).map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ flex: 1 }}>
                      {item.nama}
                      <div style={{ fontSize: 10, color: '#64748b' }}>
                        {item.jumlah} × {formatRupiah(item.harga_satuan)}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>{formatRupiah(item.harga_satuan * item.jumlah)}</div>
                  </div>
                ))}
              </div>

              <div style={{ borderBottom: '1px dashed #cbd5e1', margin: '12px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 13 }}>
                <span>TOTAL</span>
                <span>{formatRupiah(activeTx.total)}</span>
              </div>

              <div style={{ borderBottom: '1px dashed #cbd5e1', margin: '12px 0' }} />

              <div style={{ fontSize: 10, color: '#475569' }}>
                <div style={{ marginBottom: 4 }}>
                  <strong>Anggota:</strong> {memberDetail?.nama}
                </div>
                <div style={{ marginBottom: 4 }}>
                  <strong>Metode Input:</strong> {activeTx.metode_input}
                </div>
                <div style={{ marginBottom: 4 }}>
                  <strong>Status Ledger:</strong>{' '}
                  {activeTx.synced ? (
                    <span style={{ color: '#16a34a', fontWeight: 700 }}>✓ Synced Cloud</span>
                  ) : (
                    <span style={{ color: '#d97706', fontWeight: 700 }}>⏳ Edge Local (Pending Sync)</span>
                  )}
                </div>
                <div style={{ margin: '8px 0 4px 0' }}>
                  <strong>Block Hash:</strong>
                </div>
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    padding: 4,
                    fontSize: 10,
                    borderRadius: 4,
                    fontFamily: 'monospace',
                  }}
                >
                  {activeTx.hash ? activeTx.hash.substring(0, 8) : '-'}...xxxxxxxx
                </div>
                <div style={{ margin: '6px 0 4px 0' }}>
                  <strong>Prev Block Hash:</strong>
                </div>
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    padding: 4,
                    fontSize: 10,
                    borderRadius: 4,
                    fontFamily: 'monospace',
                  }}
                >
                  {activeTx.prev_hash ? activeTx.prev_hash.substring(0, 8) : '-'}...xxxxxxxx
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <Text style={{ fontSize: 10, color: '#94a3b8' }}>Struk ini sah dikeluarkan oleh KDMP</Text>
              </div>
            </div>
            <div style={{ fontSize: 10, color: '#64748b', textAlign: 'center', marginTop: 12 }}>
              <code>// SIMULASI: struk cetak thermal Koperasi</code>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
