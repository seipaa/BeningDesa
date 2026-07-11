import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Tabs, Select, Input, Row, Col, Space, Typography, Badge, Modal, Tag, Empty, Alert, Spin, Divider, message } from 'antd';
import confetti from 'canvas-confetti';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// Static seed data for offline fallbacks (consistent with backend seed.js)
const FALLBACK_GERAI = [
  { id: 'c3d4e5f6-a7b8-9012-cdef-123456789012', nama: 'Gerai Pasar', desa: 'Desa Bening', kecamatan: 'Kec. Bening Maju', konsultasi_nama: 'Koperasi Desa Merah Putih' }
];

const FALLBACK_ANGGOTA = [
  { id: 'd4e5f6a7-b8c9-0123-4567-890abcdef001', nama: 'Ahmad Wijaya', rfid_card_id: 'RFID-001', qr_code_id: 'QR-001', saldo_simpanan: 150000, desa: 'Desa Bening', kecamatan: 'Kec. Bening Maju', konsultasi_nama: 'Koperasi Desa Merah Putih' },
  { id: 'd4e5f6a7-b8c9-0123-4567-890abcdef002', nama: 'Budi Santoso', rfid_card_id: 'RFID-002', qr_code_id: 'QR-002', saldo_simpanan: 320000, desa: 'Desa Bening', kecamatan: 'Kec. Bening Maju', konsultasi_nama: 'Koperasi Desa Merah Putih' },
  { id: 'd4e5f6a7-b8c9-0123-4567-890abcdef003', nama: 'Citra Dewi', rfid_card_id: 'RFID-003', qr_code_id: 'QR-003', saldo_simpanan: 85000, desa: 'Desa Bening', kecamatan: 'Kec. Bening Maju', konsultasi_nama: 'Koperasi Desa Merah Putih' },
  { id: 'd4e5f6a7-b8c9-0123-4567-890abcdef004', nama: 'Dedi Kurniawan', rfid_card_id: 'RFID-004', qr_code_id: 'QR-004', saldo_simpanan: 420000, desa: 'Desa Bening', kecamatan: 'Kec. Bening Maju', konsultasi_nama: 'Koperasi Desa Merah Putih' },
  { id: 'd4e5f6a7-b8c9-0123-4567-890abcdef005', nama: 'Erni Wati', rfid_card_id: 'RFID-005', qr_code_id: 'QR-005', saldo_simpanan: 210000, desa: 'Desa Bening', kecamatan: 'Kec. Bening Maju', konsultasi_nama: 'Koperasi Desa Merah Putih' },
  { id: 'd4e5f6a7-b8c9-0123-4567-890abcdef006', nama: 'Fajar Nugroho', rfid_card_id: 'RFID-006', qr_code_id: 'QR-006', saldo_simpanan: 500000, desa: 'Desa Bening', kecamatan: 'Kec. Bening Maju', konsultasi_nama: 'Koperasi Desa Merah Putih' },
  { id: 'd4e5f6a7-b8c9-0123-4567-890abcdef007', nama: 'Gita Rahayu', rfid_card_id: 'RFID-007', qr_code_id: 'QR-007', saldo_simpanan: 175000, desa: 'Desa Bening', kecamatan: 'Kec. Bening Maju', konsultasi_nama: 'Koperasi Desa Merah Putih' },
  { id: 'd4e5f6a7-b8c9-0123-4567-890abcdef008', nama: 'Hadi Pranoto', rfid_card_id: 'RFID-008', qr_code_id: 'QR-008', saldo_simpanan: 280000, desa: 'Desa Bening', kecamatan: 'Kec. Bening Maju', konsultasi_nama: 'Koperasi Desa Merah Putih' }
];

const FALLBACK_PRODUK = [
  { id: 'p1', nama: 'Beras Premium 5kg', satuan: 'pcs', harga: 75000, stok: 50 },
  { id: 'p2', nama: 'Beras Medium 5kg', satuan: 'pcs', harga: 55000, stok: 80 },
  { id: 'p3', nama: 'Minyak Goreng 2L', satuan: 'pcs', harga: 32000, stok: 100 },
  { id: 'p4', nama: 'Minyak Goreng 1L', satuan: 'pcs', harga: 18000, stok: 120 },
  { id: 'p5', nama: 'Gula Pasir 1kg', satuan: 'kg', harga: 15000, stok: 75 },
  { id: 'p6', nama: 'Gula Pasir 5kg', satuan: 'pcs', harga: 65000, stok: 40 },
  { id: 'p7', nama: 'Telur Ayam 1kg', satuan: 'kg', harga: 28000, stok: 60 },
  { id: 'p8', nama: 'Tepung Terigu 1kg', satuan: 'kg', harga: 12000, stok: 90 },
  { id: 'p9', nama: 'Kedelai 1kg', satuan: 'kg', harga: 18000, stok: 45 },
  { id: 'p10', nama: 'Garam 1kg', satuan: 'kg', harga: 8000, stok: 200 },
  { id: 'p11', nama: 'Sabun Mandi 100g', satuan: 'pcs', harga: 5000, stok: 150 },
  { id: 'p12', nama: 'Sabun Cuci 900ml', satuan: 'pcs', harga: 15000, stok: 80 }
];

export default function SmartStation({ isOffline, systemState }) {
  const [geraiList, setGeraiList] = useState([]);
  const [currentGeraiId, setCurrentGeraiId] = useState(null);
  const [products, setProducts] = useState([]);
  const [anggotaList, setAnggotaList] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [activeTab, setActiveTab] = useState('rfid');
  const [searchProduct, setSearchProduct] = useState('');
  const [manualSearch, setManualSearch] = useState('');
  const [usingMockFallback, setUsingMockFallback] = useState(false);

  // UI States
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [weightValue, setWeightValue] = useState('0.00 kg');
  const [weightPhase, setWeightPhase] = useState('TARE'); // TARE | READING | STABILIZING | LOCKED
  const [isWeightStabilizing, setIsWeightStabilizing] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [completedTx, setCompletedTx] = useState(null);
  const [weighingProduct, setWeighingProduct] = useState(null); // null or product object

  // RFID simulation states
  const [selectedRfidId, setSelectedRfidId] = useState('');
  const [isRfidTapping, setIsRfidTapping] = useState(false);

  // === Titip Jual states ===
  const [mainTab, setMainTab] = useState('kasir'); // 'kasir' | 'titip'
  const [titipMember, setTitipMember] = useState(null);
  const [titipScanTab, setTitipScanTab] = useState('qr');
  const [titipRfidId, setTitipRfidId] = useState('');
  const [titipManualSearch, setTitipManualSearch] = useState('');
  const [titipNamaBarang, setTitipNamaBarang] = useState('');
  const [titipKategori, setTitipKategori] = useState('Hasil Tani');
  const [titipSatuan, setTitipSatuan] = useState('kg');
  const [titipHarga, setTitipHarga] = useState('');
  const [titipJumlahPcs, setTitipJumlahPcs] = useState(1);
  const [titipKomisi, setTitipKomisi] = useState(5);
  const [showTitipWeightModal, setShowTitipWeightModal] = useState(false);
  const [titipWeightValue, setTitipWeightValue] = useState('0.000 kg');
  const [titipWeightPhase, setTitipWeightPhase] = useState('TARE');
  const [titipFinalWeight, setTitipFinalWeight] = useState(0);
  const [showTitipReceipt, setShowTitipReceipt] = useState(false);
  const [completedTitip, setCompletedTitip] = useState(null);
  const [isSubmittingTitip, setIsSubmittingTitip] = useState(false);

  const qrScannerRef = useRef(null);

  // Audio Beep generator
  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 2000;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.warn('Audio Beep tidak didukung.');
    }
  };

  // Initial load
  useEffect(() => {
    const fetchInitData = async () => {
      try {
        const geraiRes = await fetch('/api/station/gerai');
        if (geraiRes.ok) {
          const data = await geraiRes.json();
          setGeraiList(data.gerai || []);
          if (data.gerai && data.gerai.length > 0) {
            setCurrentGeraiId(data.gerai[0].id);
          }
        } else {
          throw new Error();
        }
      } catch (err) {
        console.warn('[STATION] Gagal mengambil gerai dari API, menggunakan data offline.');
        setGeraiList(FALLBACK_GERAI);
        setCurrentGeraiId(FALLBACK_GERAI[0].id);
        setUsingMockFallback(true);
      }

      try {
        const anggotaRes = await fetch('/api/station/anggota');
        if (anggotaRes.ok) {
          const data = await anggotaRes.json();
          setAnggotaList(data.anggota || []);
        } else {
          throw new Error();
        }
      } catch (err) {
        console.warn('[STATION] Gagal mengambil anggota dari API, menggunakan data offline.');
        setAnggotaList(FALLBACK_ANGGOTA);
        setUsingMockFallback(true);
      }
    };
    fetchInitData();
  }, []);

  const fetchProducts = async () => {
    if (!currentGeraiId) return;
    setLoadingProducts(true);
    try {
      const res = await fetch(`/api/station/gerai/${currentGeraiId}/produk`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.produk || []);
      } else {
        throw new Error();
      }
    } catch (err) {
      console.warn('[STATION] Gagal mengambil produk, menggunakan data offline.');
      setProducts(FALLBACK_PRODUK);
      setUsingMockFallback(true);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Load products when gerai changes
  useEffect(() => {
    fetchProducts();
  }, [currentGeraiId]);

  // Cart operations
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, jumlah: item.jumlah + 1 } : item
        );
      }
      return [...prev, { ...product, jumlah: 1 }];
    });
    message.success(`${product.nama} dimasukkan ke keranjang.`);
  };

  const addToCartWithWeight = (product, weight) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, jumlah: parseFloat((item.jumlah + weight).toFixed(3)) } : item
        );
      }
      return [...prev, { ...product, jumlah: weight }];
    });
    message.success(`${product.nama} seberat ${weight} kg dimasukkan ke keranjang.`);
  };

  const handleSelectProduct = (product) => {
    if (product.satuan === 'kg') {
      handleWeighProductCatalog(product);
    } else {
      addToCart(product);
    }
  };

  const handleWeighProductCatalog = async (product) => {
    setWeighingProduct(product);
    const finalWeight = (Math.random() * 2 + 0.35).toFixed(3); // Random weight for single item
    setShowWeightModal(true);
    setWeightPhase('TARE');
    setWeightValue('0.000 kg');

    // Phase 1: TARE
    await new Promise(r => setTimeout(r, 500));
    setWeightPhase('READING');

    // Phase 2: READING
    let t = 0;
    const readingInterval = setInterval(() => {
      t += 0.4;
      const amplitude = Math.max(0.8 - t * 0.12, 0.05);
      const noise = (Math.random() - 0.5) * 0.08;
      const val = parseFloat(finalWeight) * (1 - amplitude * Math.abs(Math.sin(t))) + noise;
      setWeightValue(Math.max(0, val).toFixed(3) + ' kg');
    }, 100);

    await new Promise(r => setTimeout(r, 1800));
    clearInterval(readingInterval);

    // Phase 3: STABILIZING
    setWeightPhase('STABILIZING');
    setWeightValue((parseFloat(finalWeight) * 1.01).toFixed(3) + ' kg');
    await new Promise(r => setTimeout(r, 500));
    setWeightValue(finalWeight + ' kg');
    await new Promise(r => setTimeout(r, 300));

    // Phase 4: LOCKED
    setWeightPhase('LOCKED');
    playBeep();
    await new Promise(r => setTimeout(r, 1000));
    setShowWeightModal(false);
    setWeightPhase('TARE');
    setWeighingProduct(null);
    addToCartWithWeight(product, parseFloat(finalWeight));
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.jumlah + delta;
            return { ...item, jumlah: newQty };
          }
          return item;
        })
        .filter((item) => item.jumlah > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
    setSelectedMember(null);
    message.info('Keranjang dikosongkan.');
  };

  // QR Scanning Simulator
  const startQRScanner = () => {
    setIsScanning(true);
    if (!window.Html5Qrcode) {
      message.error('Library QR scanner sedang dimuat, coba lagi.');
      setIsScanning(false);
      return;
    }

    setTimeout(() => {
      try {
        const html5QrcodeScanner = new window.Html5Qrcode('qr-reader-element');
        qrScannerRef.current = html5QrcodeScanner;
        html5QrcodeScanner
          .start(
            { facingMode: 'environment' },
            { fps: 10, qrbox: 220 },
            async (decodedText) => {
              stopQRScanner();
              playBeep();
              try {
                const res = await fetch(`/api/station/anggota/${encodeURIComponent(decodedText)}`);
                if (res.ok) {
                  const data = await res.json();
                  setSelectedMember(data.anggota);
                  message.success(`QR Anggota Terdeteksi: ${data.anggota.nama}`);
                } else {
                  throw new Error();
                }
              } catch (e) {
                // Fallback scan
                const found = anggotaList.find((a) => a.qr_code_id === decodedText);
                if (found) {
                  setSelectedMember(found);
                  message.success(`[SIMULASI QR] Anggota ditemukan: ${found.nama}`);
                } else {
                  message.error('Anggota tidak terdaftar.');
                }
              }
            },
            () => { }
          )
          .catch((err) => {
            console.error('Kamera gagal dibuka:', err);
            setIsScanning(false);
          });
      } catch (e) {
        console.error(e);
        setIsScanning(false);
      }
    }, 100);
  };

  const stopQRScanner = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current
        .stop()
        .then(() => {
          setIsScanning(false);
          qrScannerRef.current = null;
        })
        .catch((e) => console.error(e));
    } else {
      setIsScanning(false);
    }
  };

  // Simulated QR Scan selection for easy presentation
  const handleSimulateQRScan = async (qrId) => {
    playBeep();
    try {
      const res = await fetch(`/api/station/anggota/${encodeURIComponent(qrId)}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedMember(data.anggota);
        message.success(`[SIMULASI QR] Berhasil memindai anggota: ${data.anggota.nama}`);
      } else {
        throw new Error();
      }
    } catch (e) {
      // Fallback
      const found = anggotaList.find((a) => a.qr_code_id === qrId);
      if (found) {
        setSelectedMember(found);
        message.success(`[SIMULASI QR] Anggota terdeteksi: ${found.nama}`);
      } else {
        message.error('Anggota tidak ditemukan.');
      }
    }
  };

  // RFID Simulation Checkout
  const handleRFIDTap = async () => {
    if (!selectedRfidId) {
      message.warning('Pilih salah satu Kartu Virtual RFID terlebih dahulu.');
      return;
    }
    setIsRfidTapping(true);
    setTimeout(async () => {
      playBeep();
      try {
        const res = await fetch(`/api/station/anggota/by-rfid/${encodeURIComponent(selectedRfidId)}`);
        if (res.ok) {
          const data = await res.json();
          setSelectedMember(data.anggota);
          message.success(`[SIMULASI RFID] Kartu terdeteksi untuk: ${data.anggota.nama}`);
        } else {
          throw new Error();
        }
      } catch (err) {
        // Fallback
        const found = anggotaList.find((a) => a.rfid_card_id === selectedRfidId);
        if (found) {
          setSelectedMember(found);
          message.success(`[SIMULASI RFID] Kartu RFID terdeteksi untuk: ${found.nama}`);
        } else {
          message.error('RFID tidak dikenal.');
        }
      } finally {
        setIsRfidTapping(false);
      }
    }, 800);
  };

  // Manual lookup
  const handleManualLookup = async () => {
    if (!manualSearch) return;
    try {
      const res = await fetch(`/api/cloud/anggota?search=${encodeURIComponent(manualSearch)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.anggota && data.anggota.length > 0) {
          setSelectedMember(data.anggota[0]);
          message.success(`Anggota ditemukan: ${data.anggota[0].nama}`);
        } else {
          throw new Error();
        }
      } else {
        throw new Error();
      }
    } catch (e) {
      // Fallback
      const found = anggotaList.find(
        (a) =>
          a.nama.toLowerCase().includes(manualSearch.toLowerCase()) ||
          a.rfid_card_id === manualSearch ||
          a.qr_code_id === manualSearch
      );
      if (found) {
        setSelectedMember(found);
        message.success(`[SIMULASI MANUAL] Anggota ditemukan: ${found.nama}`);
      } else {
        message.warning('Anggota tidak ditemukan.');
      }
    }
  };

  // Payment process - directly execute transaction
  const handlePayCheckout = async () => {
    if (cart.length === 0) {
      message.warning('Keranjang masih kosong.');
      return;
    }
    if (!selectedMember) {
      message.warning('Silakan tap kartu RFID anggota terlebih dahulu untuk checkout.');
      return;
    }
    executeTransaction();
  };

  // === TITIP JUAL HANDLERS ===

  // Scan anggota for titip flow
  const handleTitipScanMember = async (identifier, type = 'qr') => {
    playBeep();
    try {
      const url = type === 'rfid'
        ? `/api/station/anggota/by-rfid/${encodeURIComponent(identifier)}`
        : `/api/station/anggota/${encodeURIComponent(identifier)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setTitipMember(data.anggota);
        message.success(`Anggota terdeteksi: ${data.anggota.nama}`);
      } else throw new Error();
    } catch {
      const found = type === 'rfid'
        ? anggotaList.find(a => a.rfid_card_id === identifier)
        : anggotaList.find(a => a.qr_code_id === identifier);
      if (found) {
        setTitipMember(found);
        message.success(`[SIMULASI] Anggota: ${found.nama}`);
      } else {
        message.error('Anggota tidak ditemukan.');
      }
    }
  };

  const handleTitipManualSearch = async () => {
    if (!titipManualSearch) return;
    const found = anggotaList.find(
      a => a.nama.toLowerCase().includes(titipManualSearch.toLowerCase()) ||
        a.rfid_card_id === titipManualSearch || a.qr_code_id === titipManualSearch
    );
    if (found) { setTitipMember(found); message.success(`Anggota ditemukan: ${found.nama}`); }
    else message.warning('Anggota tidak ditemukan.');
  };

  // Main submit: weigh (if kg) then POST to API
  const handleTitipSubmit = async () => {
    if (!titipNamaBarang || !titipHarga) {
      message.warning('Nama barang dan harga wajib diisi.');
      return;
    }
    if (titipSatuan === 'pcs' && (!titipJumlahPcs || titipJumlahPcs < 1)) {
      message.warning('Jumlah pcs wajib diisi.');
      return;
    }

    let finalWeightKg = null;

    if (titipSatuan === 'kg') {
      // Cinematic weighing animation
      const fw = (Math.random() * 5 + 0.5);
      finalWeightKg = parseFloat(fw.toFixed(3));

      setShowTitipWeightModal(true);
      setTitipWeightPhase('TARE');
      setTitipWeightValue('0.000 kg');

      await new Promise(r => setTimeout(r, 500));
      setTitipWeightPhase('READING');

      let t = 0;
      const interval = setInterval(() => {
        t += 0.4;
        const amplitude = Math.max(0.9 - t * 0.1, 0.04);
        const noise = (Math.random() - 0.5) * 0.05;
        const val = finalWeightKg * (1 - amplitude * Math.abs(Math.sin(t))) + noise;
        setTitipWeightValue(Math.max(0, val).toFixed(3) + ' kg');
      }, 100);

      await new Promise(r => setTimeout(r, 2500));
      clearInterval(interval);

      setTitipWeightPhase('STABILIZING');
      setTitipWeightValue((finalWeightKg * 1.005).toFixed(3) + ' kg');
      await new Promise(r => setTimeout(r, 600));
      setTitipWeightValue(finalWeightKg.toFixed(3) + ' kg');
      await new Promise(r => setTimeout(r, 400));

      setTitipWeightPhase('LOCKED');
      setTitipFinalWeight(finalWeightKg);
      playBeep();
      await new Promise(r => setTimeout(r, 1500));
      setShowTitipWeightModal(false);
      setTitipWeightPhase('TARE');
    }

    // POST to API
    setIsSubmittingTitip(true);
    try {
      const payload = {
        gerai_id: currentGeraiId,
        anggota_id: titipMember?.id || null,
        nama_barang: titipNamaBarang,
        kategori: titipKategori,
        satuan: titipSatuan,
        berat_kg: titipSatuan === 'kg' ? finalWeightKg : null,
        jumlah_pcs: titipSatuan === 'pcs' ? titipJumlahPcs : null,
        harga_satuan: parseFloat(titipHarga),
        komisi_pct: titipKomisi,
      };

      const res = await fetch('/api/station/titip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setCompletedTitip(data.struk);
        setShowTitipReceipt(true);
        confetti({ particleCount: 120, spread: 65, origin: { y: 0.6 }, colors: ['#15803d', '#22c55e', '#bbf7d0', '#fff'] });
        message.success('Barang titipan berhasil dicatat!');
      } else {
        throw new Error('API error');
      }
    } catch (err) {
      // Offline fallback struk
      const nilai = titipSatuan === 'kg'
        ? finalWeightKg * parseFloat(titipHarga)
        : titipJumlahPcs * parseFloat(titipHarga);
      const komisi = nilai * (titipKomisi / 100);
      const mockStruk = {
        barang_id: 'mock-' + Math.random().toString(36).slice(2, 10),
        nama_barang: titipNamaBarang,
        kategori: titipKategori,
        satuan: titipSatuan,
        berat_kg: titipSatuan === 'kg' ? finalWeightKg : null,
        jumlah_pcs: titipSatuan === 'pcs' ? titipJumlahPcs : null,
        harga_satuan: parseFloat(titipHarga),
        nilai_titip: nilai,
        komisi_pct: titipKomisi,
        komisi,
        estimasi_bersih: nilai - komisi,
        hash: 'abcdef12' + Math.random().toString(16).slice(2, 58),
        prev_hash: '0'.repeat(64),
        timestamp: new Date().toISOString(),
        anggota_id: titipMember?.id || null,
        gerai_id: currentGeraiId,
      };
      setCompletedTitip(mockStruk);
      setShowTitipReceipt(true);
      message.warning('Offline mode: struk disimpan lokal.');
      confetti({ particleCount: 120, spread: 65, origin: { y: 0.6 }, colors: ['#15803d', '#22c55e', '#bbf7d0', '#fff'] });
    } finally {
      setIsSubmittingTitip(false);
    }
  };

  // Actual transaction execution
  const executeTransaction = async () => {
    const items = cart.map((item) => ({
      produk_id: item.id,
      nama: item.nama,
      jumlah: item.jumlah,
      harga_satuan: parseFloat(item.harga),
      subtotal: parseFloat(item.harga) * item.jumlah,
    }));

    const total = items.reduce((sum, item) => sum + item.subtotal, 0);

    let metode_input = 'manual';
    if (selectedMember) {
      if (activeTab === 'qr') metode_input = 'qr_scan';
      else if (activeTab === 'rfid') metode_input = 'rfid_tap';
    }

    try {
      const res = await fetch('/api/station/transaksi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gerai_id: currentGeraiId,
          anggota_id: selectedMember?.id || null,
          items,
          total,
          metode_input,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCompletedTx(data.transaksi);
        setCart([]);
        setSelectedMember(null);
        setSelectedRfidId('');
        setShowReceiptModal(true);
        fetchProducts();

        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#059669', '#10b981', '#ffffff', '#dc2626'],
        });
      } else {
        throw new Error();
      }
    } catch (err) {
      // Fallback local simulation
      const mockTx = {
        id: 'tx-sim-' + Math.random().toString(36).substring(2, 10),
        gerai_id: currentGeraiId,
        anggota_id: selectedMember?.id || null,
        items,
        total,
        metode_input,
        timestamp: new Date().toISOString(),
        prev_hash: '9e8d7c6b5a4f3e2d1c0b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a10beef',
        hash: 'a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890',
        synced: false
      };
      setCompletedTx(mockTx);
      setCart([]);
      setSelectedMember(null);
      setSelectedRfidId('');
      setShowReceiptModal(true);

      message.warning('Koneksi server offline. Transaksi berhasil disimpan di memori kasir.');

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#059669', '#10b981', '#ffffff', '#dc2626'],
      });
    }
  };

  // Helper
  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num);
  };

  // Filter products by search
  const filteredProducts = products.filter((p) =>
    p.nama.toLowerCase().includes(searchProduct.toLowerCase())
  );

  return (
    <div style={{ padding: '0 12px 24px' }}>
      {/* Simulation Banner Badge */}
      <Alert
        message={
          <div style={{ fontSize: 12, fontWeight: 600 }}>
            {usingMockFallback ? (
              <span>[ MODE DEMO/OFFLINE AKTIF: Server backend belum tersambung, sistem kasir berjalan dalam memori lokal ]</span>
            ) : (
              <span>[ SIMULASI HARDWARE AKTIF: Sistem mengemulasikan Timbangan Load-Cell, RFID Reader, dan Printer Struk ]</span>
            )}
          </div>
        }
        type={usingMockFallback ? "warning" : "info"}
        style={{ marginBottom: 16, borderRadius: 8 }}
      />

      {/* ============ MAIN MODE TAB SWITCHER ============ */}
      <div style={{
        display: 'inline-flex',
        background: '#f1f5f9',
        padding: '5px',
        borderRadius: '30px',
        border: '1px solid #cbd5e1',
        marginBottom: 20,
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.03)'
      }}>
        <button
          onClick={() => setMainTab('kasir')}
          style={{
            padding: '8px 24px',
            fontWeight: 800,
            fontSize: 12,
            cursor: 'pointer',
            border: 'none',
            borderRadius: '25px',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            background: mainTab === 'kasir' ? '#0f172a' : 'transparent',
            color: mainTab === 'kasir' ? '#fff' : '#64748b',
            boxShadow: mainTab === 'kasir' ? '0 4px 10px rgba(15, 23, 42, 0.25)' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            letterSpacing: '0.5px'
          }}
        >
          KASIR BELANJA
        </button>
        <button
          onClick={() => setMainTab('titip')}
          style={{
            padding: '8px 24px',
            fontWeight: 800,
            fontSize: 12,
            cursor: 'pointer',
            border: 'none',
            borderRadius: '25px',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            background: mainTab === 'titip' ? '#16a34a' : 'transparent',
            color: mainTab === 'titip' ? '#fff' : '#64748b',
            boxShadow: mainTab === 'titip' ? '0 4px 10px rgba(22, 163, 74, 0.25)' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            letterSpacing: '0.5px'
          }}
        >
          TITIP JUAL
        </button>
      </div>

      {/* ============ TITIP JUAL PANEL ============ */}
      {mainTab === 'titip' && (
        <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
          <Col xs={24} lg={10}>
            <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)', borderTop: '3px solid #15803d' }} title={<span style={{ fontWeight: 800, color: '#15803d' }}>IDENTIFIKASI ANGGOTA PENITIP</span>}>
              {titipMember ? (
                <div>
                  <div style={{ background: 'linear-gradient(135deg,#052e16,#15803d)', borderRadius: 8, padding: 16, color: '#fff', marginBottom: 12 }}>
                    <div style={{ fontSize: 11, color: '#86efac', marginBottom: 4 }}>Anggota Terverifikasi</div>
                    <div style={{ fontSize: 18, fontWeight: 800 }}>{titipMember.nama}</div>
                    <div style={{ fontSize: 11, color: '#86efac', marginTop: 6 }}>RFID: {titipMember.rfid_card_id} · QR: {titipMember.qr_code_id}</div>
                  </div>
                  <Button danger onClick={() => setTitipMember(null)} style={{ width: '100%', fontWeight: 600 }}>GANTI ANGGOTA</Button>
                </div>
              ) : (
                <Tabs activeKey={titipScanTab} onChange={setTitipScanTab} centered>
                  <Tabs.TabPane tab="SCAN QR" key="qr">
                    <Divider style={{ margin: '8px 0 12px' }}>SIMULASI CEPAT</Divider>
                    <Space wrap style={{ justifyContent: 'center' }}>
                      {anggotaList.slice(0, 4).map(a => (
                        <Button key={a.id} size="small" type="dashed" style={{ borderColor: '#15803d', color: '#15803d' }} onClick={() => handleTitipScanMember(a.qr_code_id, 'qr')}>{a.nama.split(' ')[0]}</Button>
                      ))}
                    </Space>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="RFID" key="rfid">
                    <Select style={{ width: '100%', marginBottom: 8 }} placeholder="Pilih RFID" onChange={v => handleTitipScanMember(v, 'rfid')}>
                      {anggotaList.map(a => <Option key={a.id} value={a.rfid_card_id}>{a.nama} ({a.rfid_card_id})</Option>)}
                    </Select>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="MANUAL" key="manual">
                    <Space.Compact style={{ width: '100%' }}>
                      <Input placeholder="Nama / ID Anggota..." value={titipManualSearch} onChange={e => setTitipManualSearch(e.target.value)} onPressEnter={handleTitipManualSearch} />
                      <Button type="primary" style={{ background: '#15803d', borderColor: '#15803d' }} onClick={handleTitipManualSearch}>CARI</Button>
                    </Space.Compact>
                  </Tabs.TabPane>
                </Tabs>
              )}
            </Card>
          </Col>

          <Col xs={24} lg={14}>
            <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)', borderTop: '3px solid #15803d' }} title={<span style={{ fontWeight: 800, color: '#15803d' }}>DETAIL BARANG TITIPAN</span>}>
              <Row gutter={[12, 12]}>
                <Col xs={24} sm={14}>
                  <div style={{ marginBottom: 4, fontWeight: 600, fontSize: 12 }}>Nama Barang *</div>
                  <Input placeholder="Contoh: Beras Rojolele, Cabai Merah..." value={titipNamaBarang} onChange={e => setTitipNamaBarang(e.target.value)} size="large" />
                </Col>
                <Col xs={24} sm={10}>
                  <div style={{ marginBottom: 4, fontWeight: 600, fontSize: 12 }}>Kategori</div>
                  <Select value={titipKategori} onChange={setTitipKategori} style={{ width: '100%' }} size="large">
                    {['Hasil Tani', 'Kerajinan', 'Makanan & Minuman', 'Sayur & Buah', 'Ternak', 'Umum'].map(k => <Option key={k} value={k}>{k}</Option>)}
                  </Select>
                </Col>
                <Col xs={12}>
                  <div style={{ marginBottom: 4, fontWeight: 600, fontSize: 12 }}>Satuan</div>
                  <Select value={titipSatuan} onChange={setTitipSatuan} style={{ width: '100%' }} size="large">
                    <Option value="kg">Kilogram (kg) — ditimbang</Option>
                    <Option value="pcs">Satuan (pcs) — manual</Option>
                  </Select>
                </Col>
                <Col xs={12}>
                  <div style={{ marginBottom: 4, fontWeight: 600, fontSize: 12 }}>Harga per {titipSatuan} (Rp) *</div>
                  <Input type="number" placeholder="Contoh: 15000" value={titipHarga} onChange={e => setTitipHarga(e.target.value)} size="large" prefix="Rp" />
                </Col>
                {titipSatuan === 'pcs' && (
                  <Col xs={12}>
                    <div style={{ marginBottom: 4, fontWeight: 600, fontSize: 12 }}>Jumlah (pcs) *</div>
                    <Input type="number" min={1} value={titipJumlahPcs} onChange={e => setTitipJumlahPcs(parseInt(e.target.value) || 1)} size="large" suffix="pcs" />
                  </Col>
                )}
                <Col xs={titipSatuan === 'pcs' ? 12 : 24}>
                  <div style={{ marginBottom: 4, fontWeight: 600, fontSize: 12 }}>Komisi Koperasi (%)</div>
                  <Input type="number" min={0} max={30} value={titipKomisi} onChange={e => setTitipKomisi(parseFloat(e.target.value) || 5)} size="large" suffix="%" />
                </Col>
              </Row>

              {titipHarga && (
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: 12, marginTop: 16 }}>
                  <div style={{ fontWeight: 700, fontSize: 12, color: '#15803d', marginBottom: 8 }}>ESTIMASI NILAI TITIP</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: '#64748b' }}>Satuan harga:</span>
                    <span style={{ fontWeight: 600 }}>{formatRupiah(parseFloat(titipHarga) || 0)} / {titipSatuan}</span>
                  </div>
                  {titipSatuan === 'pcs' && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                        <span style={{ color: '#64748b' }}>Nilai titip ({titipJumlahPcs} pcs):</span>
                        <span style={{ fontWeight: 600 }}>{formatRupiah((parseFloat(titipHarga) || 0) * (titipJumlahPcs || 0))}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#dc2626', marginBottom: 4 }}>
                        <span>Komisi ({titipKomisi}%):</span>
                        <span>-{formatRupiah((parseFloat(titipHarga) || 0) * (titipJumlahPcs || 0) * titipKomisi / 100)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 800, color: '#15803d', borderTop: '1px dashed #bbf7d0', paddingTop: 6 }}>
                        <span>Est. Hasil Bersih:</span>
                        <span>{formatRupiah((parseFloat(titipHarga) || 0) * (titipJumlahPcs || 0) * (1 - titipKomisi / 100))}</span>
                      </div>
                    </>
                  )}
                  {titipSatuan === 'kg' && (
                    <div style={{ fontSize: 11, color: '#64748b', fontStyle: 'italic' }}>Nilai dihitung setelah penimbangan via sensor ESP32</div>
                  )}
                </div>
              )}

              <Button type="primary" size="large" loading={isSubmittingTitip} onClick={handleTitipSubmit}
                style={{ width: '100%', height: 52, marginTop: 16, fontWeight: 700, fontSize: 14, background: 'linear-gradient(135deg,#15803d,#22c55e)', border: 'none', borderRadius: 8 }}>
                {titipSatuan === 'kg' ? 'TIMBANG & DAFTARKAN TITIPAN' : 'DAFTARKAN TITIPAN'}
              </Button>
              <div style={{ fontSize: 10, color: '#94a3b8', textAlign: 'center', marginTop: 8 }}>
                <code>// Menerbitkan struk kriptografis + event chain hash ke Supabase</code>
              </div>
            </Card>
          </Col>
        </Row>
      )}

      {/* ============ KASIR PANEL (existing) ============ */}
      {mainTab === 'kasir' && (
        <Row gutter={[24, 24]}>
          {/* Left Side: Product Catalog */}
          <Col xs={24} lg={15}>

            <Card
              bordered={false}
              style={{ borderRadius: 12, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', height: '100%' }}
              title={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <span style={{ fontWeight: 800, fontSize: 16 }}>KATALOG PRODUK GERAI</span>
                  <Select
                    value={currentGeraiId}
                    onChange={(val) => setCurrentGeraiId(val)}
                    style={{ width: 220 }}
                    placeholder="Pilih Gerai Koperasi"
                  >
                    {geraiList.map((g) => (
                      <Option key={g.id} value={g.id}>
                        {g.nama} ({g.desa})
                      </Option>
                    ))}
                  </Select>
                </div>
              }
            >
              <div style={{ marginBottom: 16 }}>
                <Input.Search
                  placeholder="Cari produk di gerai ini..."
                  allowClear
                  enterButton="CARI"
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                />
              </div>

              {loadingProducts ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <Spin size="large" tip="Memuat produk gerai..." />
                </div>
              ) : filteredProducts.length === 0 ? (
                <Empty description="Tidak ada produk terdaftar di gerai ini." style={{ padding: '40px 0' }} />
              ) : (
                <Row gutter={[12, 12]} style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: 4 }}>
                  {filteredProducts.map((p) => (
                    <Col xs={12} sm={8} key={p.id}>
                      <Card
                        hoverable
                        bordered
                        style={{
                          borderRadius: 12,
                          transition: 'all 0.2s',
                          border: '1px solid #e2e8f0',
                        }}
                        bodyStyle={{ padding: 14 }}
                        onClick={() => handleSelectProduct(p)}
                        className="hover-lift-card"
                      >
                        <Text strong style={{ fontSize: 13, display: 'block', height: 40, overflow: 'hidden', color: '#1e293b' }}>
                          {p.nama}
                        </Text>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 12 }}>
                          <Text style={{ color: '#059669', fontWeight: 800, fontSize: 15 }}>
                            {formatRupiah(p.harga)}
                          </Text>
                          <Text style={{ fontSize: 11, color: '#94a3b8' }}>
                            /{p.satuan}
                          </Text>
                        </div>
                        <div style={{ marginTop: 6, fontSize: 11, color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                          <span>Stok: <Text strong>{p.stok}</Text></span>
                          {p.satuan === 'kg' && <Tag color="green" style={{ margin: 0, fontSize: 9, padding: '0 4px', height: 16, lineHeight: '14px' }}>SCALE</Tag>}
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 16 }}>
                <code>// SIMULASI: pengganti monitor kiosk (UI web kasir)</code>
              </div>
            </Card>
          </Col>

          {/* Right Side: Checkout Cart & Member Identification */}
          <Col xs={24} lg={9}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* Member Identification Widget */}
              <Card
                bordered={false}
                style={{ borderRadius: 12, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}
                title={<span style={{ fontWeight: 800 }}>IDENTIFIKASI ANGGOTA</span>}
              >
                {selectedMember ? (
                  <Card
                    style={{
                      background: 'linear-gradient(135deg, #065f46 0%, #0d9488 100%)',
                      borderRadius: 12,
                      color: '#fff',
                      border: 'none',
                      boxShadow: '0 8px 16px -4px rgba(13, 148, 136, 0.3)',
                    }}
                    bodyStyle={{ padding: 18 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div>
                        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          Anggota Koperasi
                        </Text>
                        <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2, letterSpacing: 0.2 }}>{selectedMember.nama}</div>
                      </div>
                      <Tag color="rgba(255,255,255,0.2)" style={{ color: '#fff', border: 'none', height: 22, fontWeight: 700 }}>
                        VERIFIED
                      </Tag>
                    </div>
                    <div style={{ marginBottom: 14 }}>
                      <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10 }}>SALDO SIMPANAN</Text>
                      <div style={{ fontSize: 24, fontWeight: 900, color: '#f5e6c8' }}>{formatRupiah(selectedMember.saldo_simpanan)}</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(255,255,255,0.8)', fontFamily: 'monospace' }}>
                      <span>RFID: {selectedMember.rfid_card_id}</span>
                      <span>QR: {selectedMember.qr_code_id}</span>
                    </div>
                    <Button
                      size="small"
                      danger
                      type="primary"
                      onClick={() => setSelectedMember(null)}
                      style={{ marginTop: 16, width: '100%', borderRadius: 6, fontWeight: 700 }}
                    >
                      GANTI ANGGOTA
                    </Button>
                  </Card>
                ) : (
                  <div style={{ padding: '8px 0' }}>
                    <Text style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>
                      Pilih kartu fisik anggota untuk di-tap:
                    </Text>
                    <Select
                      style={{ width: '100%', marginBottom: 16 }}
                      placeholder="Pilih Kartu Virtual RFID"
                      value={selectedRfidId || undefined}
                      onChange={setSelectedRfidId}
                    >
                      {anggotaList.map((a) => (
                        <Option key={a.id} value={a.rfid_card_id}>
                          {a.nama} ({a.rfid_card_id})
                        </Option>
                      ))}
                    </Select>

                    <div
                      style={{
                        background: '#f8fafc',
                        border: '2px dashed #cbd5e1',
                        borderRadius: 12,
                        padding: 32,
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onClick={handleRFIDTap}
                      className="rfid-tap-area"
                    >
                      {isRfidTapping ? (
                        <Spin tip="Membaca Kartu RFID..." />
                      ) : (
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 800, color: '#64748b', marginBottom: 4, letterSpacing: 1.5 }}>
                            RFID READER EMULATOR
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>TAP KARTU VIRTUAL</div>
                          <Text style={{ fontSize: 11, color: '#94a3b8' }}>
                            (Klik area ini untuk mensimulasikan sensor tap)
                          </Text>
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 12 }}>
                      <code>// SIMULASI: pengganti RFID reader (dropdown + sensor tap)</code>
                    </div>
                  </div>
                )}
              </Card>

              {/* Shopping Cart */}
              <Card
                bordered={false}
                style={{ borderRadius: 12, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}
                title={
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span style={{ fontWeight: 800, fontSize: 16 }}>KERANJANG BELANJA</span>
                    {cart.length > 0 && (
                      <Button type="text" danger onClick={clearCart} style={{ fontWeight: 700, padding: 0 }}>
                        BERSIHKAN
                      </Button>
                    )}
                  </div>
                }
              >
                {cart.length === 0 ? (
                  <Empty description="Belum ada barang di keranjang." style={{ padding: '24px 0' }} />
                ) : (
                  <div>
                    <div style={{ maxHeight: 220, overflowY: 'auto', marginBottom: 16 }}>
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '10px 0',
                            borderBottom: '1px solid #f1f5f9',
                          }}
                        >
                          <div style={{ flex: 1, paddingRight: 8 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{item.nama}</div>
                            <div style={{ fontSize: 11, color: '#64748b' }}>
                              {formatRupiah(item.harga)}/{item.satuan}
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 12 }}>
                            <Button size="small" shape="circle" onClick={() => updateQty(item.id, -1)} style={{ border: '1px solid #cbd5e1' }}>
                              -
                            </Button>
                            <Text style={{ minWidth: 24, textAlign: 'center', fontWeight: 700 }}>{item.jumlah}</Text>
                            <Button size="small" shape="circle" onClick={() => updateQty(item.id, 1)} style={{ border: '1px solid #cbd5e1' }}>
                              +
                            </Button>
                          </div>
                          <div style={{ fontWeight: 800, fontSize: 13, minWidth: 80, textAlign: 'right', color: '#1e293b' }}>
                            {formatRupiah(item.harga * item.jumlah)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div
                      style={{
                        backgroundColor: '#f8fafc',
                        padding: 14,
                        borderRadius: 10,
                        marginBottom: 16,
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                        <Text style={{ color: '#64748b' }}>Pembayaran:</Text>
                        <Text strong style={{ color: selectedMember ? '#0f172a' : '#ef4444' }}>
                          {selectedMember ? 'Saldo Simpanan Koperasi' : 'Silakan Tap Kartu RFID'}
                        </Text>
                      </div>
                      <Divider style={{ margin: '8px 0', borderStyle: 'dashed' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <Text strong style={{ fontSize: 14 }}>
                          Total Belanja:
                        </Text>
                        <Text style={{ color: '#059669', fontSize: 22, fontWeight: 900 }}>
                          {formatRupiah(cart.reduce((s, i) => s + i.harga * i.jumlah, 0))}
                        </Text>
                      </div>
                    </div>

                    <Button
                      type="primary"
                      size="large"
                      style={{ width: '100%', height: 48, borderRadius: 8, fontWeight: 700, fontSize: 14, background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', border: 'none' }}
                      onClick={handlePayCheckout}
                    >
                      PROSES BAYAR
                    </Button>
                  </div>
                )}
              </Card>
            </Space>
          </Col>
        </Row>
      )}

      {/* =========================================================
          CINEMATIC LOAD CELL SCALE MODAL (KASIR)
      ========================================================= */}
      <Modal
        open={showWeightModal}
        closable={false}
        footer={null}
        centered
        width={380}
        bodyStyle={{ padding: 0, borderRadius: 16, overflow: 'hidden' }}
      >
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: 28, textAlign: 'center', color: '#fff' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: weightPhase === 'LOCKED' ? '#22c55e' : '#f59e0b', boxShadow: weightPhase === 'LOCKED' ? '0 0 8px #22c55e' : '0 0 8px #f59e0b', animation: weightPhase !== 'LOCKED' ? 'pulse 0.8s infinite' : 'none' }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#94a3b8' }}>
              {weighingProduct ? `TIMBANG: ${weighingProduct.nama.substring(0, 16).toUpperCase()}` : 'ESP32 LOAD-CELL SCALE'}
            </span>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: weightPhase === 'LOCKED' ? '#22c55e' : '#f59e0b', boxShadow: weightPhase === 'LOCKED' ? '0 0 8px #22c55e' : '0 0 8px #f59e0b', animation: weightPhase !== 'LOCKED' ? 'pulse 0.8s infinite' : 'none' }} />
          </div>
          <div style={{ fontSize: 10, color: '#475569', marginBottom: 20, letterSpacing: 2 }}>
            {weightPhase === 'TARE' && '■ ZEROING / TARE'}
            {weightPhase === 'READING' && '▶ READING WEIGHT...'}
            {weightPhase === 'STABILIZING' && '◐ STABILIZING...'}
            {weightPhase === 'LOCKED' && '✓ WEIGHT LOCKED'}
          </div>

          {/* LCD Display */}
          <div style={{ background: '#020617', borderRadius: 12, padding: '20px 24px', border: '2px solid #1e40af', boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.8), 0 0 20px rgba(59,130,246,0.15)', marginBottom: 16 }}>
            <div style={{ fontSize: 9, color: '#1d4ed8', letterSpacing: 3, marginBottom: 8, textAlign: 'left' }}>NET WEIGHT</div>
            <div style={{ fontFamily: '"Courier New", monospace', fontSize: 44, fontWeight: 900, color: weightPhase === 'LOCKED' ? '#22c55e' : '#38bdf8', letterSpacing: 4, textShadow: weightPhase === 'LOCKED' ? '0 0 20px rgba(34,197,94,0.6)' : '0 0 20px rgba(56,189,248,0.6)', transition: 'color 0.3s' }}>
              {weightValue}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <span style={{ fontSize: 8, color: '#334155', letterSpacing: 2 }}>HX711 ADC 24-BIT</span>
              <span style={{ fontSize: 8, color: '#334155', letterSpacing: 2 }}>SAMPLES: 80/s</span>
            </div>
          </div>

          {/* Data stream */}
          <div style={{ background: '#0f172a', borderRadius: 8, padding: '8px 12px', fontFamily: 'monospace', fontSize: 9, color: '#1d4ed8', textAlign: 'left', marginBottom: 16, letterSpacing: 1 }}>
            <div>{'>'} serial0: {weightPhase !== 'LOCKED' ? (parseFloat(weightValue) || 0).toFixed(3) + ' kg' : (parseFloat(weightValue) || 0).toFixed(3) + ' kg [STABLE]'}</div>
            <div>{'>'} wifi: connected → {weightPhase === 'LOCKED' ? (weighingProduct ? 'add_to_cart() ✓' : 'POST /api/station/transaksi ✓') : 'awaiting...'}</div>
          </div>

          {weightPhase === 'LOCKED' ? (
            <div style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid #22c55e', borderRadius: 8, padding: '10px 16px', color: '#22c55e', fontWeight: 700, fontSize: 13 }}>
              {weighingProduct ? '✓ BERAT TERKUNCI — MASUK KERANJANG...' : '✓ BERAT TERKUNCI — PROSES CHECKOUT...'}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#64748b', fontSize: 12 }}>
              <Spin size="small" />
              <span>{weightPhase === 'TARE' ? 'Zeroing timbangan...' : weightPhase === 'READING' ? 'Membaca sensor berat...' : 'Menstabilkan pembacaan...'}</span>
            </div>
          )}

          <div style={{ fontSize: 8, color: '#1e293b', marginTop: 16, letterSpacing: 1 }}>
            // SIMULASI: load-cell HX711 → ESP32 → HTTP POST → Next.js Server
          </div>
        </div>
      </Modal>

      {/* =========================================================
          CINEMATIC LOAD CELL SCALE MODAL (TITIP JUAL)
      ========================================================= */}
      <Modal
        open={showTitipWeightModal}
        closable={false}
        footer={null}
        centered
        width={380}
        bodyStyle={{ padding: 0, borderRadius: 16, overflow: 'hidden' }}
      >
        <div style={{ background: 'linear-gradient(135deg, #052e16 0%, #14532d 100%)', padding: 28, textAlign: 'center', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: titipWeightPhase === 'LOCKED' ? '#22c55e' : '#f59e0b', boxShadow: titipWeightPhase === 'LOCKED' ? '0 0 8px #22c55e' : '0 0 8px #f59e0b' }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: '#86efac' }}>TIMBANGAN TITIP JUAL</span>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: titipWeightPhase === 'LOCKED' ? '#22c55e' : '#f59e0b', boxShadow: titipWeightPhase === 'LOCKED' ? '0 0 8px #22c55e' : '0 0 8px #f59e0b' }} />
          </div>
          <div style={{ fontSize: 10, color: '#4ade80', marginBottom: 20, letterSpacing: 2 }}>
            {titipWeightPhase === 'TARE' && '■ ZEROING / TARE'}
            {titipWeightPhase === 'READING' && '▶ MENIMBANG BARANG...'}
            {titipWeightPhase === 'STABILIZING' && '◐ MENSTABILKAN...'}
            {titipWeightPhase === 'LOCKED' && '✓ BERAT TERKUNCI'}
          </div>

          <div style={{ background: '#020617', borderRadius: 12, padding: '20px 24px', border: '2px solid #16a34a', boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.8), 0 0 20px rgba(34,197,94,0.15)', marginBottom: 16 }}>
            <div style={{ fontSize: 9, color: '#15803d', letterSpacing: 3, marginBottom: 8, textAlign: 'left' }}>BERAT BARANG TITIPAN</div>
            <div style={{ fontFamily: '"Courier New", monospace', fontSize: 44, fontWeight: 900, color: titipWeightPhase === 'LOCKED' ? '#22c55e' : '#4ade80', letterSpacing: 4, textShadow: '0 0 20px rgba(34,197,94,0.5)', transition: 'color 0.3s' }}>
              {titipWeightValue}
            </div>
            {titipWeightPhase === 'LOCKED' && titipHarga && (
              <div style={{ marginTop: 10, fontSize: 12, color: '#86efac', fontWeight: 600 }}>
                {parseFloat(titipWeightValue).toFixed(3)} kg × Rp {parseInt(titipHarga).toLocaleString('id-ID')} = Rp {(parseFloat(titipWeightValue) * parseFloat(titipHarga)).toLocaleString('id-ID')}
              </div>
            )}
          </div>

          <div style={{ background: '#052e16', borderRadius: 8, padding: '8px 12px', fontFamily: 'monospace', fontSize: 9, color: '#16a34a', textAlign: 'left', marginBottom: 16 }}>
            <div>{'>'} sensor: {titipNamaBarang || 'barang'} — {titipWeightValue}</div>
            <div>{'>'} status: {titipWeightPhase === 'LOCKED' ? 'LOCKED → mencetak struk titip...' : 'measuring...'}</div>
          </div>

          {titipWeightPhase === 'LOCKED' ? (
            <div style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid #22c55e', borderRadius: 8, padding: '10px 16px', color: '#22c55e', fontWeight: 700 }}>
              ✓ BERAT TERCATAT — MENERBITKAN STRUK TITIP...
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#4ade80', fontSize: 12 }}>
              <Spin size="small" />
              <span>Menimbang barang anggota...</span>
            </div>
          )}
        </div>
      </Modal>

      {/* Thermal Receipt Struk Modal */}
      <Modal
        open={showReceiptModal}
        onCancel={() => setShowReceiptModal(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setShowReceiptModal(false)} style={{ fontWeight: 600 }}>
            SELESAI & TUTUP STRUK
          </Button>,
        ]}
        centered
        width={380}
        bodyStyle={{ padding: 12, backgroundColor: '#f1f5f9' }}
      >
        {completedTx && (
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
                <div style={{ fontSize: 10, color: '#64748b' }}>
                  {geraiList.find((g) => g.id === completedTx.gerai_id)?.nama || 'Gerai Koperasi'}
                </div>
                <div style={{ fontSize: 10, color: '#64748b' }}>
                  {new Date(completedTx.timestamp).toLocaleString('id-ID')}
                </div>
                <div style={{ fontSize: 10, color: '#64748b' }}>BLOCK HASH ID: #{completedTx.hash.substring(0, 8)}</div>
              </div>

              <div style={{ borderBottom: '1px dashed #cbd5e1', margin: '12px 0' }} />

              {/* Items */}
              <div>
                {(typeof completedTx.items === 'string' ? JSON.parse(completedTx.items) : completedTx.items).map(
                  (item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div style={{ flex: 1 }}>
                        {item.nama}
                        <div style={{ fontSize: 10, color: '#64748b' }}>
                          {item.jumlah} × {formatRupiah(item.harga_satuan)}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>{formatRupiah(item.harga_satuan * item.jumlah)}</div>
                    </div>
                  )
                )}
              </div>

              <div style={{ borderBottom: '1px dashed #cbd5e1', margin: '12px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 13 }}>
                <span>TOTAL</span>
                <span>{formatRupiah(completedTx.total)}</span>
              </div>

              <div style={{ borderBottom: '1px dashed #cbd5e1', margin: '12px 0' }} />

              <div style={{ fontSize: 10, color: '#475569' }}>
                <div style={{ marginBottom: 4 }}>
                  <strong>Anggota:</strong>{' '}
                  {anggotaList.find((a) => a.id === completedTx.anggota_id)?.nama || 'Tamu (Guest)'}
                </div>
                <div style={{ marginBottom: 4 }}>
                  <strong>Metode Input:</strong> {completedTx.metode_input}
                </div>
                <div style={{ marginBottom: 4 }}>
                  <strong>Status Ledger:</strong>{' '}
                  {completedTx.synced ? (
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
                  {completedTx.hash.substring(0, 8)}...xxxxxxxx
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
                  {completedTx.prev_hash.substring(0, 8)}...xxxxxxxx
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <Text style={{ fontSize: 10, color: '#94a3b8' }}>Terima Kasih Atas Partisipasi Anda</Text>
              </div>
            </div>
            <div style={{ fontSize: 10, color: '#64748b', textAlign: 'center', marginTop: 12 }}>
              <code>// SIMULASI: output printer struk thermal Koperasi</code>
            </div>
          </div>
        )}
      </Modal>

      {/* =========================================================
          STRUK TITIP JUAL (KONSINYASI) MODAL
      ========================================================= */}
      <Modal
        open={showTitipReceipt}
        onCancel={() => setShowTitipReceipt(false)}
        footer={[
          <Button key="close" type="primary" style={{ background: '#15803d', borderColor: '#15803d', fontWeight: 700 }} onClick={() => { setShowTitipReceipt(false); setCompletedTitip(null); setTitipMember(null); setTitipNamaBarang(''); setTitipHarga(''); setTitipJumlahPcs(1); setTitipFinalWeight(0); }}>
            SELESAI & TUTUP STRUK
          </Button>,
        ]}
        centered
        width={400}
        bodyStyle={{ padding: 12, backgroundColor: '#f0fdf4' }}
      >
        {completedTitip && (
          <div>
            {/* Thermal paper struk */}
            <div style={{ backgroundColor: '#fff', borderRadius: 8, padding: '24px 20px', fontFamily: 'monospace', boxShadow: '0 4px 10px rgba(0,0,0,0.06)', fontSize: 12, color: '#1e293b', position: 'relative' }}>
              {/* Perforated top */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, backgroundImage: 'linear-gradient(45deg, transparent 33.333%, #f0fdf4 33.333%, #f0fdf4 66.667%, transparent 66.667%), linear-gradient(-45deg, transparent 33.333%, #f0fdf4 33.333%, #f0fdf4 66.667%, transparent 66.667%)', backgroundSize: '12px 24px', backgroundPosition: '0 -12px' }} />

              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: 16, marginTop: 6 }}>
                <div style={{ background: '#15803d', color: '#fff', borderRadius: 4, padding: '4px 10px', display: 'inline-block', fontWeight: 800, fontSize: 11, marginBottom: 6, letterSpacing: 1 }}>BUKTI TITIP JUAL</div>
                <div style={{ fontWeight: 800, fontSize: 14 }}>KOPERASI DESA MP</div>
                <div style={{ fontSize: 10, color: '#64748b' }}>{geraiList.find(g => g.id === completedTitip.gerai_id)?.nama || 'Gerai Koperasi'}</div>
                <div style={{ fontSize: 10, color: '#64748b' }}>{new Date(completedTitip.timestamp).toLocaleString('id-ID')}</div>
                <div style={{ fontSize: 10, color: '#15803d', fontWeight: 700 }}>TITIP HASH ID: #{completedTitip.hash.substring(0, 8)}</div>
              </div>

              <div style={{ borderBottom: '1px dashed #bbf7d0', margin: '12px 0' }} />

              {/* Barang info */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: '#64748b' }}>Anggota:</span>
                  <span style={{ fontWeight: 700 }}>{anggotaList.find(a => a.id === completedTitip.anggota_id)?.nama || 'Tamu'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: '#64748b' }}>Nama Barang:</span>
                  <span style={{ fontWeight: 700 }}>{completedTitip.nama_barang}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: '#64748b' }}>Kategori:</span>
                  <span>{completedTitip.kategori}</span>
                </div>
                {completedTitip.satuan === 'kg' ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ color: '#64748b' }}>Berat:</span>
                    <span style={{ fontWeight: 700 }}>{parseFloat(completedTitip.berat_kg).toFixed(3)} kg</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ color: '#64748b' }}>Jumlah:</span>
                    <span style={{ fontWeight: 700 }}>{completedTitip.jumlah_pcs} pcs</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: '#64748b' }}>Harga/{completedTitip.satuan}:</span>
                  <span style={{ fontWeight: 700 }}>{formatRupiah(completedTitip.harga_satuan)}</span>
                </div>
              </div>

              <div style={{ borderBottom: '1px dashed #bbf7d0', margin: '12px 0' }} />

              {/* Financials */}
              <div style={{ background: '#f0fdf4', borderRadius: 6, padding: 10, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span>Nilai Titip:</span>
                  <span style={{ fontWeight: 700 }}>{formatRupiah(completedTitip.nilai_titip)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, color: '#dc2626' }}>
                  <span>Komisi Koperasi ({completedTitip.komisi_pct}%):</span>
                  <span style={{ fontWeight: 700 }}>-{formatRupiah(completedTitip.komisi)}</span>
                </div>
                <div style={{ borderTop: '1px dashed #bbf7d0', paddingTop: 6, display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 800, color: '#15803d' }}>Est. Hasil Bersih:</span>
                  <span style={{ fontWeight: 800, color: '#15803d', fontSize: 14 }}>{formatRupiah(completedTitip.estimasi_bersih)}</span>
                </div>
              </div>

              <div style={{ borderBottom: '1px dashed #bbf7d0', margin: '12px 0' }} />

              {/* Hash chain proof */}
              <div style={{ fontSize: 10, color: '#475569' }}>
                <div style={{ marginBottom: 4 }}><strong>Status:</strong> <span style={{ color: '#15803d', fontWeight: 700 }}>⏳ Menunggu Dipajang</span></div>
                <div style={{ margin: '8px 0 4px 0' }}><strong>Titip Hash:</strong></div>
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: 4, fontSize: 10, borderRadius: 4, fontFamily: 'monospace', marginBottom: 6 }}>
                  {completedTitip.hash.substring(0, 8)}...xxxxxxxx
                </div>
                <div style={{ margin: '4px 0' }}><strong>Prev Hash:</strong></div>
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: 4, fontSize: 10, borderRadius: 4, fontFamily: 'monospace' }}>
                  {completedTitip.prev_hash.substring(0, 8)}...xxxxxxxx
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <Text style={{ fontSize: 10, color: '#94a3b8' }}>Barang Anda Aman Bersama Koperasi</Text>
              </div>
            </div>
            <div style={{ fontSize: 10, color: '#64748b', textAlign: 'center', marginTop: 12 }}>
              <code>// STRUK TITIP JUAL — Bukti kriptografis konsinyasi anggota</code>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
