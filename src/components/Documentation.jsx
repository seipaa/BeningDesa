import React, { useState } from 'react';
import { Card, Collapse, Typography, Row, Col, Divider, Space, Tag } from 'antd';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

export default function Documentation() {
  const [activeSection, setActiveSection] = useState('1');

  const containerStyle = {
    padding: '0 12px 24px',
    maxWidth: 1200,
    margin: '0 auto',
  };

  const headerCardStyle = {
    borderRadius: 14,
    background: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #047857 100%)',
    color: '#fff',
    border: 'none',
    marginBottom: 24,
    boxShadow: '0 10px 20px -8px rgba(4, 120, 87, 0.3)',
  };

  const stepCardStyle = {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0 2px 4px rgba(0,0,0,0.01)'
  };

  const formulaCardStyle = {
    background: '#090d16',
    color: '#38bdf8',
    padding: '14px 18px',
    borderRadius: 8,
    fontFamily: '"Courier New", monospace',
    fontSize: 12,
    border: '1px solid #1e293b',
    marginBottom: 12,
  };

  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    borderRadius: '50%',
    background: '#047857',
    color: '#fff',
    fontWeight: 800,
    fontSize: 12,
    marginRight: 10,
    boxShadow: '0 2px 4px rgba(4,120,87,0.2)'
  };

  return (
    <div style={containerStyle}>
      {/* Header Deskripsi Utama */}
      <Card style={headerCardStyle} bodyStyle={{ padding: '36px 28px' }}>
        <Title level={2} style={{ color: '#fff', margin: 0, fontWeight: 900, fontSize: 26 }}>
          PANDUAN OPERASIONAL BENINGDESA V2
        </Title>
        <Paragraph style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 12, maxWidth: 800, lineHeight: 1.7, marginBottom: 0 }}>
          Selamat datang di portal panduan sistem Koperasi Desa Merah Putih. Platform ini menggunakan teknologi 
          distributed ledger (Hash-Chain Ledger) untuk mencatat setiap transaksi belanja dan barang konsinyasi secara aman, 
          transparan, dan tidak dapat dimanipulasi. Panduan ini menjelaskan alur operasional per fitur secara komprehensif.
        </Paragraph>
      </Card>

      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Collapse
            accordion
            activeKey={activeSection}
            onChange={(key) => setActiveSection(key)}
            expandIconPosition="end"
            style={{ background: 'transparent', border: 'none' }}
          >
            {/* FITUR 1: SMART STATION */}
            <Panel
              header={<span style={{ fontWeight: 800, fontSize: 14, color: '#1e293b', letterSpacing: 0.3 }}>1. SMART STATION (KIOS KASIR BELANJA)</span>}
              key="1"
              style={{ background: '#fff', borderRadius: 12, marginBottom: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}
            >
              <div style={{ padding: '8px 16px' }}>
                <Paragraph style={{ fontWeight: 700, color: '#047857', fontSize: 13 }}>
                  FUNGSI UTAMA: Fitur ini berfungsi sebagai terminal kasir mandiri digital di mana operator gerai atau anggota dapat mengidentifikasi diri dan melakukan pencatatan transaksi pembelian secara real-time.
                </Paragraph>
                <Paragraph style={{ fontSize: 13, color: '#475569' }}>
                  Smart Station melayani pemindaian kartu RFID, pencarian dropdown profil anggota, penimbangan digital otomatis dengan sensor load-cell, dan pembayaran tagihan belanja.
                </Paragraph>
                
                <Divider style={{ margin: '16px 0' }} />
                
                <Title level={5} style={{ fontWeight: 800, color: '#047857', marginBottom: 16 }}>ALUR TRANSAKSI BELANJA</Title>
                
                <div style={stepCardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                    <span style={badgeStyle}>1</span>
                    <Text strong style={{ color: '#0f172a' }}>Identifikasi Anggota (Opsional)</Text>
                  </div>
                  <Paragraph style={{ margin: '0 0 0 34px', fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
                    Kasir dapat mengidentifikasi anggota menggunakan tab RFID TAP dengan menempelkan kartu fisik virtual, 
                    atau menggunakan tab GUEST dengan mencari nama/nomor anggota melalui dropdown pencarian autocomplete. 
                    Jika pembeli bukan anggota, kasir dapat melewati tahap ini dengan memilih opsi CHECKOUT SEBAGAI GUEST.
                  </Paragraph>
                </div>

                <div style={stepCardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                    <span style={badgeStyle}>2</span>
                    <Text strong style={{ color: '#0f172a' }}>Menambahkan Barang ke Keranjang</Text>
                  </div>
                  <Paragraph style={{ margin: '0 0 0 34px', fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
                    Pilih barang dari Katalog Produk Gerai. Jika barang yang dipilih memiliki satuan Kilogram (kg), 
                    sistem otomatis memicu simulasi sensor Load-Cell timbangan digital. Tunggu hingga berat stabil 
                    dan terkunci sebelum produk dimasukkan ke keranjang belanja.
                  </Paragraph>
                </div>

                <div style={stepCardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                    <span style={badgeStyle}>3</span>
                    <Text strong style={{ color: '#0f172a' }}>Checkout Pembayaran</Text>
                  </div>
                  <Paragraph style={{ margin: '0 0 0 34px', fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
                    Setelah semua barang masuk ke keranjang belanja, klik PROSES BAYAR. Sistem akan memvalidasi sisa saldo anggota 
                    (jika menggunakan kartu anggota) atau memprosesnya secara tunai (jika guest checkout). Transaksi akan disegel 
                    secara kriptografis dan struk thermal transaksi akan diterbitkan lengkap dengan kode Block Hash.
                  </Paragraph>
                </div>
              </div>
            </Panel>

            {/* FITUR 2: EDGE SERVER */}
            <Panel
              header={<span style={{ fontWeight: 800, fontSize: 14, color: '#1e293b', letterSpacing: 0.3 }}>2. EDGE SERVER (DASHBOARD OPERATOR & AUDIT)</span>}
              key="2"
              style={{ background: '#fff', borderRadius: 12, marginBottom: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}
            >
              <div style={{ padding: '8px 16px' }}>
                <Paragraph style={{ fontWeight: 700, color: '#047857', fontSize: 13 }}>
                  FUNGSI UTAMA: Fitur ini berfungsi sebagai pusat kontrol node gerai lokal yang mengelola mode konektivitas jaringan (online/offline), sinkronisasi database ke cloud platform, serta sistem audit mandiri integritas data.
                </Paragraph>
                <Paragraph style={{ fontSize: 13, color: '#475569' }}>
                  Melalui dashboard ini, operator dapat mengontrol sinkronisasi data transaksi yang tertunda akibat hilangnya koneksi internet (Offline-First Gateway) dan melakukan verifikasi validasi ledger secara visual.
                </Paragraph>

                <Divider style={{ margin: '16px 0' }} />

                <Title level={5} style={{ fontWeight: 800, color: '#047857', marginBottom: 16 }}>FITUR & KENDALI OPERATOR</Title>

                <div style={stepCardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                    <span style={badgeStyle}>1</span>
                    <Text strong style={{ color: '#0f172a' }}>Kendali Mode Online / Offline</Text>
                  </div>
                  <Paragraph style={{ margin: '0 0 0 34px', fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
                    Gunakan saklar koneksi di panel kiri untuk beralih mode. Saat mode offline aktif, transaksi akan disimpan 
                    di database lokal. Saat beralih kembali ke online, kasir dapat mengklik tombol SYNC NOW untuk mengunggah 
                    antrean data tertunda ke cloud platform.
                  </Paragraph>
                </div>

                <div style={stepCardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                    <span style={badgeStyle}>2</span>
                    <Text strong style={{ color: '#0f172a' }}>Audit Ledger & Verifikasi Rantai Hash</Text>
                  </div>
                  <Paragraph style={{ margin: '0 0 0 34px', fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
                    Klik tombol VERIFIKASI LEDGER di kanan atas untuk memicu proses verifikasi otomatis rantai hash (hash-chain). 
                    Sistem akan mencocokkan setiap hash transaksi ke belakang hingga blok genesis untuk membuktikan tidak ada data yang diubah atau dimanipulasi secara ilegal.
                  </Paragraph>
                </div>
              </div>
            </Panel>

            {/* FITUR 3: TITIP JUAL */}
            <Panel
              header={<span style={{ fontWeight: 800, fontSize: 14, color: '#1e293b', letterSpacing: 0.3 }}>3. TITIP JUAL (KONSINYASI ANGGOTA BERANTAI)</span>}
              key="3"
              style={{ background: '#fff', borderRadius: 12, marginBottom: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}
            >
              <div style={{ padding: '8px 16px' }}>
                <Paragraph style={{ fontWeight: 700, color: '#047857', fontSize: 13 }}>
                  FUNGSI UTAMA: Fitur ini berfungsi sebagai modul konsinyasi berantai yang mencatat seluruh riwayat peredaran barang titipan milik anggota secara transparan sejak barang masuk, dipajang di gerai, hingga terjual habis.
                </Paragraph>
                <Paragraph style={{ fontSize: 13, color: '#475569' }}>
                  Setiap transisi status barang (Masuk menjadi Dipajang lalu menjadi Terjual) diikat menggunakan hash unik untuk mencegah ketidaksesuaian laporan antara koperasi dan anggota penitip.
                </Paragraph>

                <Divider style={{ margin: '16px 0' }} />

                <Title level={5} style={{ fontWeight: 800, color: '#047857', marginBottom: 16 }}>ALUR KERJA TITIP JUAL</Title>

                <div style={stepCardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                    <span style={badgeStyle}>1</span>
                    <Text strong style={{ color: '#0f172a' }}>Pendaftaran Barang Konsinyasi</Text>
                  </div>
                  <Paragraph style={{ margin: '0 0 0 34px', fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
                    Pada Dasbor Operator (Edge Server), masuk ke tab Kelola Titip Jual dan klik TAMBAH BARANG TITIPAN. 
                    Pilih nama anggota penitip, gerai penjualan (Gerai Pasar), masukkan nama barang, berat/jumlah pcs, harga, dan persentase komisi koperasi. 
                    Setelah disimpan, sistem secara otomatis menerbitkan event MASUK dan event DIPAJANG (LISTED) di database.
                  </Paragraph>
                </div>

                <div style={stepCardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                    <span style={badgeStyle}>2</span>
                    <Text strong style={{ color: '#0f172a' }}>Penjualan di Katalog & Pemotongan Stok</Text>
                  </div>
                  <Paragraph style={{ margin: '0 0 0 34px', fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
                    Barang konsinyasi yang dipajang otomatis muncul di katalog Smart Station dengan label khusus (misal: "Bayam Jepang - Titipan Budi Santoso"). 
                    Ketika produk tersebut dibeli oleh konsumen, sistem checkout otomatis mengurangi berat/stok barang di database secara real-time dan 
                    mencatat event penjualan SOLD baru di database event blockchain.
                  </Paragraph>
                </div>

                <div style={stepCardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                    <span style={badgeStyle}>3</span>
                    <Text strong style={{ color: '#0f172a' }}>Pelacakan Timeline bagi Anggota</Text>
                  </div>
                  <Paragraph style={{ margin: '0 0 0 34px', fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
                    Anggota dapat memantau kondisi barang titipannya dari dasbor mereka di tab TITIPAN SAYA. Status barang akan otomatis 
                    ter-update dari MASUK (Orange) ke DIPAJANG (Biru) lalu TERJUAL (Hijau) saat transaksi kasir terjadi. Anggota dapat mengklik 
                    barang tersebut untuk membuka visual thermal receipt dan verifikasi kecocokan event chain timeline.
                  </Paragraph>
                </div>
              </div>
            </Panel>

            {/* FITUR 4: DASBOR ANGGOTA */}
            <Panel
              header={<span style={{ fontWeight: 800, fontSize: 14, color: '#1e293b', letterSpacing: 0.3 }}>4. DASBOR ANGGOTA</span>}
              key="4"
              style={{ background: '#fff', borderRadius: 12, marginBottom: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}
            >
              <div style={{ padding: '8px 16px' }}>
                <Paragraph style={{ fontWeight: 700, color: '#047857', fontSize: 13 }}>
                  FUNGSI UTAMA: Fitur ini berfungsi sebagai portal transparansi bagi anggota koperasi desa untuk memantau sisa saldo simpanan, melihat riwayat thermal receipt transaksi belanja secara visual, dan melacak status realtime barang titipan mereka secara mandiri.
                </Paragraph>
                <Paragraph style={{ fontSize: 13, color: '#475569' }}>
                  Dasbor ini memberikan akses mandiri bagi anggota untuk melihat bukti digital transaksi belanja dan riwayat audit audit blockchain secara detail.
                </Paragraph>

                <Divider style={{ margin: '16px 0' }} />

                <Title level={5} style={{ fontWeight: 800, color: '#047857', marginBottom: 16 }}>PANDUAN OPERASIONAL ANGGOTA</Title>

                <div style={stepCardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                    <span style={badgeStyle}>1</span>
                    <Text strong style={{ color: '#0f172a' }}>Pencarian Profil Anggota</Text>
                  </div>
                  <Paragraph style={{ margin: '0 0 0 34px', fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
                    Di Dasbor Anggota, masukkan nama atau ID nomor kartu anggota pada bar pencarian di bagian atas, lalu klik CARI. 
                    Pilih nama anggota yang cocok untuk memuat halaman dasbor personal mereka.
                  </Paragraph>
                </div>

                <div style={stepCardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                    <span style={badgeStyle}>2</span>
                    <Text strong style={{ color: '#0f172a' }}>Melihat Histori Belanja & Struk Visual</Text>
                  </div>
                  <Paragraph style={{ margin: '0 0 0 34px', fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
                    Pada tab RIWAYAT BELANJA, terdapat daftar transaksi yang pernah dilakukan oleh anggota tersebut. Klik pada salah satu transaksi 
                    untuk memuat struk thermal detail belanja beserta Block Hash ID and Previous Hash sebagai bukti keaslian transaksi.
                  </Paragraph>
                </div>
              </div>
            </Panel>

            {/* FITUR 5: ALUR KRIPTOGRAFI */}
            <Panel
              header={<span style={{ fontWeight: 800, fontSize: 14, color: '#1e293b', letterSpacing: 0.3 }}>5. ALUR KRIPTOGRAFI & INTEGRITAS LEDGER (RANTAI HASH)</span>}
              key="5"
              style={{ background: '#fff', borderRadius: 12, marginBottom: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}
            >
              <div style={{ padding: '8px 16px' }}>
                <Paragraph style={{ fontWeight: 700, color: '#047857', fontSize: 13 }}>
                  FUNGSI UTAMA: Fitur kriptografi ini berfungsi sebagai fondasi keamanan utama sistem untuk menjamin keaslian data keuangan gerai desa, mencegah manipulasi catatan transaksi secara retrospektif, dan memvalidasi keutuhan riwayat mutasi saldo simpanan.
                </Paragraph>
                <Paragraph style={{ fontSize: 13, color: '#475569' }}>
                  Dengan menggunakan rantai hash (hash-chain), setiap catatan transaksi baru terkunci secara matematis dengan catatan transaksi sebelumnya. Hal ini mendeteksi segala upaya perubahan data secara ilegal.
                </Paragraph>

                <Divider style={{ margin: '16px 0' }} />

                <Title level={5} style={{ fontWeight: 800, color: '#047857', marginBottom: 16 }}>CARA KERJA HASH-CHAIN LEDGER</Title>

                <div style={stepCardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                    <span style={badgeStyle}>1</span>
                    <Text strong style={{ color: '#0f172a' }}>Blok Genesis (Root Hash)</Text>
                  </div>
                  <Paragraph style={{ margin: '0 0 0 34px', fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
                    Setiap rantai transaksi dimulai dengan satu pengenal statis unik yang disebut Genesis Hash. 
                    Rumus pembuatannya didasarkan pada ID Gerai Koperasi.
                  </Paragraph>
                  <div style={{ ...formulaCardStyle, margin: '10px 0 10px 34px' }}>
                    genesisHash = SHA256("GENESIS-KDMP-" + geraiId)
                  </div>
                </div>

                <div style={stepCardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                    <span style={badgeStyle}>2</span>
                    <Text strong style={{ color: '#0f172a' }}>Pembuatan Block Hash Baru</Text>
                  </div>
                  <Paragraph style={{ margin: '0 0 0 34px', fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
                    Ketika transaksi baru disimpan, sistem akan mengambil nilai hash dari transaksi terakhir (Previous Hash). 
                    Hash transaksi saat ini dihitung dengan menggabungkan Previous Hash dengan string JSON data transaksi yang dikanonikalisasi (diurutkan key-nya secara alpabetis).
                  </Paragraph>
                  <div style={{ ...formulaCardStyle, margin: '10px 0 10px 34px' }}>
                    currentHash = SHA256(prevHash + JSON.stringify(canonical(transactionData)))
                  </div>
                </div>

                <div style={stepCardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                    <span style={badgeStyle}>3</span>
                    <Text strong style={{ color: '#0f172a' }}>Mekanisme Audit & Deteksi Manipulasi</Text>
                  </div>
                  <Paragraph style={{ margin: '0 0 0 34px', fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
                    Selama proses verifikasi audit, sistem akan membaca seluruh transaksi secara berurutan. Untuk setiap catatan, 
                    sistem menghitung ulang hash transaksi secara mandiri dan membandingkannya dengan hash yang tersimpan di database. 
                    Jika ada data (seperti total nominal atau jumlah barang) diubah di tengah jalan, kalkulasi hash saat ini akan melenceng, 
                    mengakibatkan seluruh hash berikutnya tidak cocok, dan merusak status rantai menjadi tidak valid.
                  </Paragraph>
                </div>
              </div>
            </Panel>
          </Collapse>
        </Col>
      </Row>
    </div>
  );
}
