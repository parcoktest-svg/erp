# ERP Garment – User Manual (End-to-End)

Dokumen ini adalah **panduan pemakaian aplikasi ERP Garment** dari awal (login & setup) sampai transaksi end-to-end (Sales, Purchase, Inventory, Finance, Manufacturing, HR, Admin).

> Catatan:
> - Nama menu mengikuti sidebar aplikasi.
> - Status dokumen (Draft/Approved/Completed/Void) akan menentukan tombol/aksi yang bisa dijalankan.
> - Hampir semua transaksi membutuhkan **Company** dan **Organization** sebagai konteks.

---

## 1) Akses & Login

### 1.1 Login
1. Buka aplikasi ERP (web).
2. Masuk ke halaman **Login**.
3. Input **Email** dan **Password**.
4. Klik **Login**.

**Hasil berhasil:** masuk ke **Dashboard** dan sidebar modul muncul.

**Case negatif & solusi**
- **Email/Password salah**
  - Pastikan user sudah dibuat di modul **Admin → User Management**.
- **Tidak bisa akses menu tertentu**
  - Role user ditampilkan di header (misal `Role: ...`). Minta admin update role/permission (jika diterapkan di backend).
- **Kembali ke login terus**
  - Biasanya token tidak tersimpan / expired. Coba logout-login ulang.

### 1.2 Logout
1. Klik tombol **Logout** di header kanan.

---

## 2) Urutan Input (Wajib) – Agar End-to-End Berhasil

Ikuti urutan ini untuk menghindari error saat transaksi:

1. **Core Setup**
   - Companies
   - Organizations
2. **Master Data**
   - UoMs
   - Currencies
   - Warehouses
   - (Inventory) Locators (biasanya setelah Warehouse)
   - Products
   - Business Partners (Customer/Vendor)
3. **Transaksi**
   - Sales Orders → Goods Shipments/Movements → Finance Invoices → Payments
   - Purchase Orders → Movements (Receipt/GRN) → Finance Invoices (AP) → Payments
4. **Opsional**
   - Manufacturing (BOMs, Work Orders)
   - Inventory Adjustments
   - Finance Journals/Periods/Reports
   - HR, Admin

### 2.1 Penjelasan untuk user awam: Goods Shipments/Movements → Finance Invoices → Payments

Bagian ini adalah alur standar ERP dari **barang bergerak** sampai **uang tercatat**.

- **Goods Shipments / Movements**
  - **Goods Shipment** artinya dokumen “barang keluar” (pengiriman ke customer).
  - **Movement** adalah dokumen pergerakan stok di gudang (bisa barang keluar, barang masuk, atau pindah lokasi).
  - Jika dokumen shipment/movement di-**Complete**, stok akan berubah dan tercatat di **Inventory → On Hand**.

- **Finance Invoices**
  - **Invoice** adalah dokumen tagihan.
  - Untuk **Sales (SO)** biasanya menghasilkan **AR Invoice** (piutang: customer berutang ke kita).
  - Untuk **Purchase (PO)** biasanya menghasilkan **AP Invoice** (utang: kita berutang ke vendor).
  - Jika invoice di-**Complete**, maka tagihan resmi tercatat di modul Finance.

- **Payments**
  - **Payment** adalah pencatatan transaksi pembayaran untuk melunasi invoice.
  - Untuk **AR**: kita menerima uang dari customer.
  - Untuk **AP**: kita membayar vendor.

**Contoh alur untuk Sales (paling mudah dipahami)**
1. Buat **Sales Order (SO)**: customer pesan barang.
2. Buat **Goods Shipment / Movement**: barang benar-benar dikirim.
3. Buat **Finance Invoice (AR)**: customer ditagih.
4. Buat **Payment (AR Receipt)**: uang dari customer diterima.

**Contoh alur untuk Purchase**
1. Buat **Purchase Order (PO)**: pesan barang ke vendor.
2. Buat **Movement (Receipt/GRN)**: barang benar-benar diterima di gudang.
3. Buat **Finance Invoice (AP)**: vendor menagih kita.
4. Buat **Payment (AP Payment)**: kita bayar vendor.

**Case negatif yang sering terjadi & cara menghindarinya**
- **Invoice dibuat tapi barang belum dikirim/diterima**
  - Pastikan shipment/receipt sudah benar dan complete sebelum invoicing (sesuai SOP perusahaan).
- **Stok tidak berubah**
  - Pastikan dokumen movement/shipment sudah di-Complete.
- **Invoice tidak bisa complete**
  - Pastikan data master lengkap (customer/vendor, produk, pajak jika ada) dan period finance terbuka (jika digunakan).
- **Payment tidak bisa dibuat / tidak balance**
  - Pastikan bank/account tersedia dan amount payment sama dengan outstanding invoice.

---

## 3) Modul: Core Setup

### 3.1 Companies
**Tujuan:** membuat perusahaan (legal entity) sebagai scope utama data.

**Cara pakai**
1. Buka **Core Setup → Companies**.
2. Klik **Create/New** (jika tersedia).
3. Isi data perusahaan.
4. **Save**.

**Case negatif & solusi**
- **Tidak bisa membuat transaksi karena company kosong**
  - Pastikan minimal 1 company dibuat dan dipilih/terpakai oleh transaksi.

### 3.2 Organizations
**Tujuan:** membuat unit/organisasi operasional (misalnya branch/division).

**Cara pakai**
1. Buka **Core Setup → Organizations**.
2. Buat organisasi untuk company terkait.

**Integrasi**
- Banyak transaksi (SO/PO/Invoice/Movement) mengikat `organizationId`.

---

## 4) Modul: Master Data

### 4.1 UoMs
**Tujuan:** satuan untuk produk dan transaksi (PCS, MTR, KG, dll).

**Cara pakai**
1. Buka **Master Data → UoMs**.
2. Tambahkan UoM.

**Case negatif**
- Produk tidak bisa dibuat/line transaksi error karena UoM belum ada.

### 4.2 Currencies
**Tujuan:** mata uang untuk price/invoice.

**Cara pakai**
1. **Master Data → Currencies**.
2. Buat mata uang yang dipakai (IDR, USD, dll).

### 4.3 Warehouses
**Tujuan:** gudang tempat stok.

**Cara pakai**
1. **Master Data → Warehouses**.
2. Buat gudang.

**Integrasi**
- Dipakai oleh Inventory (On Hand, Locators, Movements) dan proses shipment/receipt.

### 4.4 Business Partners
**Tujuan:** data Customer & Vendor (supplier).

**Cara pakai**
1. **Master Data → Business Partners**.
2. Buat BP dengan tipe yang sesuai:
   - Customer (untuk Sales)
   - Vendor (untuk Purchase)

**Case negatif**
- SO tidak bisa dibuat kalau customer belum ada.
- PO tidak bisa dibuat kalau vendor belum ada.

### 4.5 Products
**Tujuan:** item barang/jasa yang dijual/dibeli/di-stok.

**Cara pakai**
1. **Master Data → Products**.
2. Tambahkan produk dan pastikan:
   - UoM sudah benar
   - (Jika barang stok) pastikan bisa dipakai oleh inventory

**Integrasi**
- Dipakai oleh SO/PO lines, BOM, Work Orders, Movements, Invoices.

---

## 5) Modul: Inventory

### 5.1 Locators
**Tujuan:** lokasi/rak di dalam gudang.

**Cara pakai**
1. **Inventory → Locators**.
2. Buat locator untuk warehouse.

**Case negatif**
- Movement/Receipt/Shipment bisa gagal jika sistem membutuhkan locator tapi belum dibuat.

### 5.2 On Hand
**Tujuan:** melihat stok tersedia per produk/gudang/locator.

**Cara pakai**
1. **Inventory → On Hand**.
2. Gunakan filter untuk produk/gudang.

### 5.3 Movements
**Tujuan:** dokumen pergerakan stok (hasil dari shipment/receipt atau movement manual).

**Cara pakai (umum)**
1. **Inventory → Movements**.
2. Buka detail movement (jika ada).
3. Jalankan aksi **Complete** bila semua qty benar.

**Case negatif & solusi**
- **Tidak bisa complete**
  - Pastikan line qty valid, warehouse/locator valid, dan stok cukup (untuk issue).

### 5.4 Adjustments
**Tujuan:** koreksi stok (stock opname/penyesuaian).

**Cara pakai**
1. **Inventory → Adjustments**.
2. Buat adjustment dan complete sesuai prosedur.

---

## 6) Modul: Sales

### 6.1 Sales Orders (SO)
**Tujuan:** membuat pesanan penjualan dari customer.

**Prerequisite**
- Company, Organization
- Customer (Business Partner)
- Products, UoM
- Warehouse/Locator (jika pengiriman mempengaruhi stok)

**Alur sukses (recommended)**
1. **Sales → Sales Orders**
2. Klik **New/Create**
3. Isi header:
   - Customer
   - Dates (Order Date)
   - Warehouse/Org (jika ada)
4. Isi **Lines** (produk, qty, harga)
5. **Save** (status biasanya Draft)
6. Klik **Approve** (jika tersedia)
7. Setelah approved:
   - Klik **Create Shipment** (membuat dokumen pengiriman / inventory movement)
   - Klik **Create Invoice** (membuat AR Invoice di Finance)

**Integrasi antar modul**
- **Create Shipment** → menghasilkan dokumen di:
  - **Sales → Goods Shipments** dan/atau
  - **Inventory → Movements**
- **Create Invoice** → menghasilkan dokumen di:
  - **Finance → Invoices** (biasanya ter-filter oleh `salesOrderId`)

**Fitur Documents / Attachments**
- Di detail SO ada tab **Documents/Attachments**.
- Anda bisa upload file:
  - **Attach To: Header** (terkait SO)
  - **Attach To: Line** (terkait item/line tertentu)

**Case negatif & cara menghindarinya**
- **Approve gagal / tombol tidak muncul**
  - Pastikan SO sudah di-save dan line tidak kosong.
- **Create Shipment gagal**
  - Pastikan warehouse/locator tersedia.
  - Pastikan stok cukup (jika shipment mengurangi stok).
- **Create Invoice gagal**
  - Pastikan data customer, currency, dan harga/qty valid.
- **Upload attachment gagal**
  - Pastikan pilih Attach To yang benar.
  - Pastikan file tidak corrupt dan ukuran file sesuai limit server.

### 6.2 Goods Shipments
**Tujuan:** daftar dokumen pengiriman.

**Cara pakai**
1. **Sales → Goods Shipments**
2. Cari shipment dari SO.
3. Pastikan qty sesuai lalu **Complete** (jika action tersedia di detail shipment/movement).

---

## 7) Modul: Purchase

### 7.1 Purchase Orders (PO)
**Tujuan:** membuat pesanan pembelian ke vendor.

**Prerequisite**
- Company, Organization
- Vendor (Business Partner)
- Products, UoM
- Warehouse/Locator (untuk penerimaan barang)

**Alur sukses (recommended)**
1. **Purchase → Purchase Orders**
2. Klik **New/Create**
3. Isi header:
   - Vendor
   - Dates
4. Isi **Lines** (produk, qty, harga)
5. **Save**
6. Klik **Approve**
7. Setelah approved:
   - Klik **Create Receipt (GRN)** → menghasilkan movement penerimaan barang
   - Klik **Create Invoice (AP)** → menghasilkan invoice hutang (AP) di Finance

**Integrasi antar modul**
- **Create Receipt (GRN)** → dokumen masuk ke:
  - **Inventory → Movements** (receipt)
- **Create Invoice (AP)** → dokumen masuk ke:
  - **Finance → Invoices** (biasanya ter-filter oleh `purchaseOrderId`)

**Fitur Documents / Attachments**
- Di detail PO ada tab **Documents/Attachments**.
- Upload file untuk:
  - **Header** (PO)
  - **Line** (line PO)

**Case negatif & cara menghindarinya**
- **Create Receipt gagal**
  - Warehouse/locator belum ada.
  - Line qty tidak valid.
- **Create AP Invoice gagal**
  - Vendor/currency/pricing tidak valid.
- **Void PO**
  - Biasanya hanya bisa sebelum dokumen turunan (receipt/invoice) dibuat atau sebelum complete.

---

## 8) Modul: Finance

### 8.1 Invoices
**Tujuan:** mengelola invoice AR (customer) dan AP (vendor).

**Cara pakai (umum)**
1. **Finance → Invoices**
2. Filter:
   - berdasarkan **document no**
   - atau link transaksi (misal dari SO/PO)
3. Buka invoice detail (klik document no jika tersedia di tabel SO/PO).
4. Jalankan aksi:
   - **Complete** untuk mem-posting invoice
   - **Void** untuk membatalkan (biasanya perlu tanggal void dan alasan)

**Integrasi**
- SO → menghasilkan AR Invoice.
- PO → menghasilkan AP Invoice.

**Case negatif & solusi**
- **Invoice tidak bisa complete**
  - Pastikan period finance terbuka (jika modul period digunakan).
  - Pastikan total/line/tax valid.
- **Invoice sudah completed tidak bisa di-void**
  - Umumnya perlu prosedur reversal/credit memo (tergantung aturan backend).

### 8.2 Payments
**Tujuan:** pencatatan pembayaran invoice (AR/AP).

**Cara pakai (umum)**
1. **Finance → Payments**
2. Buat pembayaran dan link ke invoice.

**Case negatif**
- Tidak bisa submit jika bank/account belum ada.

### 8.3 Banks
**Tujuan:** master bank account untuk pembayaran.

### 8.4 GL Accounts
**Tujuan:** chart of accounts.

### 8.5 Journals
**Tujuan:** jurnal manual atau jurnal posting.

### 8.6 Periods
**Tujuan:** periode akuntansi untuk membatasi posting.

### 8.7 Reports / Budgets
**Tujuan:** laporan dan budget control (tergantung implementasi di backend).

---

## 9) Modul: Manufacturing

### 9.1 BOMs
**Tujuan:** definisi Bill of Materials (struktur material).

**Cara pakai (umum)**
1. **Manufacturing → BOMs**
2. Buat BOM untuk produk finished goods:
   - Komponen material
   - Qty per

**Integrasi**
- BOM digunakan untuk perhitungan kebutuhan material / work order (jika aktif).

### 9.2 Work Orders
**Tujuan:** perintah produksi.

**Cara pakai (umum)**
1. **Manufacturing → Work Orders**
2. Buat WO berdasarkan demand (SO) atau manual.

### 9.3 Reports
Laporan manufacturing sesuai modul yang tersedia.

---

## 10) Modul: HR

### 10.1 Departments
Buat struktur departemen.

### 10.2 Employees
Input karyawan.

---

## 11) Modul: Admin

### 11.1 User Management
**Tujuan:** membuat/mengelola user aplikasi.

**Cara pakai (umum)**
1. **Admin → User Management**
2. Buat user baru.
3. Set email/password dan role.

**Case negatif**
- User tidak bisa login → pastikan password benar dan user aktif.

---

## 12) Cheat Sheet Integrasi (Ringkas)

- **SO**
  - SO (Sales) → Shipment (Sales/Inventory Movement) → AR Invoice (Finance) → Payment (Finance)
- **PO**
  - PO (Purchase) → Receipt/GRN (Inventory Movement) → AP Invoice (Finance) → Payment (Finance)
- **Inventory**
  - Movements/Adjustments mengubah On Hand.
- **Manufacturing**
  - BOM/WO mengkonsumsi Products (komponen) dan menghasilkan produk jadi (tergantung implementasi).
- **Attachments**
  - Dokumen bisa di-attach ke header/line SO/PO untuk audit trail.

---

## 13) Troubleshooting Umum

- **Data tidak muncul di dropdown**
  - Pastikan master data sudah dibuat (Company, Org, BP, Product, UoM, Warehouse).
- **Button aksi tidak muncul**
  - Biasanya karena status dokumen belum memenuhi (belum save/approve/complete).
- **Tidak bisa download attachment**
  - Pastikan backend berjalan dan file masih ada di server folder `uploads/`.

---

## 14) Saran Proses Implementasi di Lapangan (Agar Tidak Macet)

Urutan implementasi untuk go-live kecil:
1. Setup Company/Org
2. Setup UoM, Currency, Warehouse + Locator
3. Setup BP (customer/vendor)
4. Setup Products
5. Jalankan 1 siklus kecil:
   - 1 SO → shipment → invoice → payment
   - 1 PO → receipt → invoice → payment
6. Baru lanjut ke BOM/WO/Reports
