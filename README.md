# BeningDesa V2 — Sistem Keuangan Koperasi & Konsinyasi Berantai (Buku Kas Berantai)

BeningDesa V2 adalah platform operasional koperasi desa modern yang mengusung arsitektur **Buku Kas Berantai (Hash-Chain Ledger)**. Platform ini dirancang untuk memberikan transparansi mutlak, keamanan data antimultipulasi, serta ketahanan operasional tinggi melalui sistem sinkronisasi offline-first. Proyek ini dipersiapkan untuk pameran **Digital Cooperative Expo 2026** di bawah pengawasan Kemenkop RI.

---

## FUNGSI UTAMA FITUR APLIKASI

1. **Smart Station (Kios Kasir Mandiri)**: Berfungsi sebagai terminal kasir mandiri digital di mana operator gerai atau anggota dapat mengidentifikasi diri dan melakukan pencatatan transaksi pembelian secara real-time.
2. **Edge Server (Dashboard Operator)**: Berfungsi sebagai pusat kontrol node gerai lokal yang mengelola mode konektivitas jaringan (online/offline), sinkronisasi database ke cloud platform, serta sistem audit mandiri integritas data.
3. **Titip Jual (Konsinyasi Koperasi Berantai)**: Berfungsi sebagai modul konsinyasi berantai yang mencatat seluruh riwayat peredaran barang titipan milik anggota secara transparan sejak barang masuk, dipajang di gerai, hingga terjual habis.
4. **Dasbor Anggota (Member Portal)**: Berfungsi sebagai portal transparansi bagi anggota koperasi desa untuk memantau sisa saldo simpanan, melihat riwayat thermal receipt transaksi belanja secara visual, dan melacak status realtime barang titipan mereka secara mandiri.
5. **Alur Kriptografi (Integritas Ledger)**: Berfungsi sebagai fondasi keamanan utama sistem untuk menjamin keaslian data keuangan gerai desa, mencegah manipulasi catatan transaksi secara retrospektif, dan memvalidasi keutuhan riwayat mutasi saldo simpanan.

---

## TECH STACK & TEKNOLOGI UTAMA

* **Frontend & Backend Logic**: Next.js 14 (App Router) + TypeScript
* **UI/UX Styling**: Ant Design 5 (Premium, Clean & Icon-Free) + Tailwind CSS (Utility)
* **Cloud Database & RLS**: Supabase (PostgreSQL) + Row-Level Security
* **Kriptografi**: Node.js Native Crypto Library (SHA-256 Hashing)
* **Kios Simulasi**: HTML5 Weighing scale simulation & Virtual RFID card tapping

---

## ALUR KRIPTOGRAFI & INTEGRITAS LEDGER (DUAL-CHAIN HASH)

Sistem ini mengimplementasikan dua rantai ledger hash yang terpisah tetapi saling mengunci secara matematis untuk menjamin transparansi mutlak:

### 1. Rantai Transaksi Gerai (Global POS Ledger)
Setiap transaksi kasir diikat dengan transaksi sebelumnya membentuk rantai tunggal koperasi global. 
* **Genesis Block (Root Hash)**:
  `genesisHash = SHA256("GENESIS-KDMP-" + koperasiId)`
* **Mekanisme Block Hash Baru**:
  Setiap transaksi baru dihitung dengan menggabungkan hash dari transaksi sebelumnya (`prev_hash`) dengan data transaksi saat ini (items, total, metode input, anggota, dan timestamp) yang diurutkan secara kanonikal:
  `currentHash = SHA256(prevHash + JSON.stringify(canonical(transactionData)))`

### 2. Rantai Siklus Hidup Barang Konsinyasi (Consignment Lifecycle)
Setiap barang titipan memiliki rantai blockchain mandiri untuk melacak pergerakan fisiknya dari produsen (anggota) hingga ke tangan konsumen:
* **Genesis Titip Hash**:
  `genesisTitipHash = SHA256("GENESIS-TITIP-" + barangId)`
* **Transisi Status Berantai**:
  Setiap perubahan kondisi barang (Pendaftaran `MASUK` -> Pemajangan `LISTED` -> Pembelian `SOLD`) akan menerbitkan block event baru di tabel `titip_event` dengan hash yang menyambung secara realtime:
  `currentTitipHash = SHA256(prevTitipHash + JSON.stringify(canonical(eventData)))`

---

## MODUL KONSINYASI (TITIP JUAL) BERANTAI

Sistem ini mencegah fraud internal koperasi (seperti manipulasi stok barang hilang atau manipulasi margin komisi) melalui alur event-sourcing berikut:

```
[Anggota Penitip] ───(Titip Barang)───> [Event MASUK] ───(Dihitung Genesis Hash)
                                              │
                                       [Event LISTED] (Muncul di POS Kasir)
                                              │
[Kasir Smart Station] <───(Checkout)─── [Event SOLD] (Dihitung Realtime Hash)
```

1. **Pendaftaran (MASUK)**: Admin mendaftarkan produk titipan di Edge Server. Event `MASUK` terbuat dengan Genesis Hash khusus.
2. **Pemajangan (LISTED)**: Sistem langsung mengubah status barang ke `LISTED` agar otomatis muncul di katalog kasir gerai. Hash baru terhitung menyambung ke hash event `MASUK`.
3. **Penjualan (SOLD)**: Setiap kali barang titipan dibeli di POS kasir (baik eceran kiloan/pcs maupun borongan), database akan memotong stok secara realtime dan membuat event `SOLD` baru. Nilai jual dan pembagian hasil (komisi koperasi 5% & estimasi hasil bersih anggota) langsung dikunci di dalam hash event tersebut.
4. **Timeline Audit**: Anggota dapat melihat riwayat audit status barang mereka lengkap dengan string hash verifikasi di Dasbor Anggota tab "Titipan Saya".

---

## KETAHANAN DATA OFFLINE-FIRST (EDGE SERVER SYNC GATEWAY)

Sistem dirancang untuk tetap berjalan meskipun koneksi internet di desa terputus total:
* **Offline Mode (ON)**: Transaksi di Smart Station tetap berjalan menggunakan database lokal node kasir. Transaksi dimasukkan ke antrean `sync_queue_item` dengan status `pending`.
* **Sync Process (OFFLINE -> ONLINE)**: Ketika konektivitas pulih, operator memicu tombol `Sync Now` pada Edge Server. Sistem akan mengunggah seluruh transaksi antrean secara otomatis, memperbarui status di cloud, dan mencatatkan timestamp sinkronisasi terbaru.

---

## SKEMA & MODEL DATABASE (POSTGRESQL)

| Nama Tabel | Deskripsi Fungsional |
|---|---|
| `konsultasi` | Menyimpan data unit koperasi tingkat desa/kecamatan. |
| `gerai` | Menyimpan informasi outlet/gerai fisik milik koperasi. |
| `anggota` | Menyimpan profil anggota, saldo simpanan, nomor kartu RFID, dan QR code ID. |
| `produk` | Katalog produk standar yang dikelola langsung oleh koperasi gerai. |
| `titip_barang` | Menyimpan detail barang konsinyasi anggota (stok, harga satuan, komisi %, status terakhir). |
| `titip_event` | Ledger blockchain pelacakan siklus hidup barang titipan (`MASUK`, `LISTED`, `SOLD`). |
| `transaksi_event` | Ledger blockchain transaksi kasir (`prev_hash`, `hash`, `items`, `total`, `metode_input`). |
| `sync_queue_item` | Antrean sinkronisasi data transaksi offline-to-online. |
| `system_state` | Menyimpan konfigurasi global status sistem (`mode_offline`, `last_sync_at`). |

---

## PETUNJUK INSTALASI & PENGOPERASIAN LOKAL

### 1. Prasyarat & Konfigurasi Supabase
1. Buat project baru di [supabase.com](https://supabase.com).
2. Salin dan jalankan seluruh query schema database yang ada di file `supabase/migrations/001_schema.sql` melalui **SQL Editor** Supabase Studio.
3. Buat berkas `.env.local` di root folder proyek:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

### 2. Inisialisasi Data Demo (Seeding)
Gunakan terminal untuk melakukan seed data dummy (5 anggota, gerai, catalog produk, serta riwayat transaksi blockchain berantai):
```bash
node d:\APP\Hackathon\BeningDesaV2\BeningDesa\setup_rls.js
```
*(Atau jalankan skrip migrasi yang telah disediakan untuk menyuntikkan data).*

### 3. Instalasi Dependensi & Menjalankan Dev Server
Jalankan perintah berikut di folder proyek Next.js:
```bash
npm install
npm run dev
```
Buka browser di alamat [http://localhost:3000](http://localhost:3000) untuk mengakses portal operasional.
