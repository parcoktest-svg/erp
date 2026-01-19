import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import PptxGenJS from 'pptxgenjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function addTitle(slide, title, subtitle) {
  slide.addText(title, {
    x: 0.6,
    y: 0.6,
    w: 12.1,
    h: 0.8,
    fontFace: 'Calibri',
    fontSize: 36,
    bold: true,
    color: '1F2937'
  })
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.6,
      y: 1.5,
      w: 12.1,
      h: 0.6,
      fontFace: 'Calibri',
      fontSize: 18,
      color: '4B5563'
    })
  }
}

function addBullets(slide, heading, bullets) {
  slide.addText(heading, {
    x: 0.8,
    y: 0.9,
    w: 12,
    h: 0.6,
    fontFace: 'Calibri',
    fontSize: 28,
    bold: true,
    color: '111827'
  })

  const bulletLines = bullets.map((b) => `• ${b}`).join('\n')
  slide.addText(bulletLines, {
    x: 1.1,
    y: 1.7,
    w: 11.5,
    h: 5.0,
    fontFace: 'Calibri',
    fontSize: 18,
    color: '111827',
    valign: 'top'
  })
}

function addFooter(slide, text) {
  slide.addText(text, {
    x: 0.6,
    y: 6.9,
    w: 12.1,
    h: 0.3,
    fontFace: 'Calibri',
    fontSize: 12,
    color: '6B7280'
  })
}

const pptx = new PptxGenJS()

pptx.layout = 'LAYOUT_WIDE'

// Slide 1
{
  const s = pptx.addSlide()
  addTitle(s, 'ERP End-to-End Process', 'Gambaran proses dari Master Data → Transaksi → Stok → Produksi → Laporan')
  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.6,
    y: 2.4,
    w: 12.1,
    h: 3.7,
    fill: { color: 'F3F4F6' },
    line: { color: 'E5E7EB' }
  })
  s.addText('Tujuan presentasi:', {
    x: 1.0,
    y: 2.7,
    w: 11.5,
    h: 0.4,
    fontFace: 'Calibri',
    fontSize: 20,
    bold: true,
    color: '111827'
  })
  s.addText(
    ['• Memahami modul-modul ERP secara sederhana', '• Memahami alur kerja end-to-end', '• Memahami dampak Master Data ke modul lain'].join('\n'),
    {
      x: 1.2,
      y: 3.2,
      w: 11.2,
      h: 2.6,
      fontFace: 'Calibri',
      fontSize: 18,
      color: '111827'
    }
  )
  addFooter(s, 'ERP Presentation - Generated automatically')
}

// Slide 2
{
  const s = pptx.addSlide()
  addBullets(s, 'Apa itu ERP?', [
    'ERP = satu sistem untuk mengelola proses bisnis dalam satu tempat',
    'Mengurangi kerja manual dan data ganda',
    'Membuat proses lebih rapi dan mudah dilacak (audit trail)'
  ])
  addFooter(s, 'Konsep dasar ERP')
}

// Slide 3
{
  const s = pptx.addSlide()
  addBullets(s, 'Modul Utama di Aplikasi', [
    'Master Data: data dasar (Produk, Satuan, Mata Uang, Gudang/Lokasi)',
    'Inventory: stok barang dan pergerakan stok masuk/keluar',
    'Purchase: proses pembelian (Purchase Order)',
    'Sales: proses penjualan (Sales Order)',
    'Manufacturing: produksi (BOM & Work Order)',
    'Finance/Reports: laporan bisnis',
    'HR: data departemen dan karyawan'
  ])
  addFooter(s, 'Modul-modul')
}

// Slide 4
{
  const s = pptx.addSlide()
  addBullets(s, 'Kenapa Master Data Penting?', [
    'Semua transaksi mengambil data dari Master Data',
    'Jika produk belum dibuat, maka tidak bisa melakukan transaksi pembelian/penjualan/produksi',
    'Update data produk akan terlihat di modul lain (tanpa merusak histori transaksi)'
  ])
  addFooter(s, 'Master Data = pondasi')
}

// Slide 5
{
  const s = pptx.addSlide()
  addBullets(s, 'Alur End-to-End (Ringkas)', [
    '1) Setup Master Data (Produk, Lokasi Stok)',
    '2) Purchase (pembelian barang/bahan)',
    '3) Inventory (stok masuk/keluar, koreksi)',
    '4) Manufacturing (BOM → Work Order → Complete)',
    '5) Sales (penjualan barang jadi)',
    '6) Reports (ringkasan & laporan)'
  ])
  addFooter(s, 'E2E flow')
}

// Slide 6
{
  const s = pptx.addSlide()
  addBullets(s, 'Contoh Sederhana (Produksi Meja)', [
    'Bahan baku (komponen): Kayu, Paku',
    'Barang jadi: Meja',
    'BOM = resep: 1 meja butuh kayu dan paku',
    'Work Order = perintah produksi',
    'Saat Complete: stok bahan turun, stok meja naik'
  ])
  addFooter(s, 'Contoh bisnis')
}

// Slide 7
{
  const s = pptx.addSlide()
  addBullets(s, 'Step 1: Buat Produk (Master Data)', [
    'Buat produk komponen (Kayu, Paku) dan produk jadi (Meja)',
    'Produk akan muncul di pilihan modul BOM, Work Order, Purchase, Sales, Inventory',
    'Jika produk di-update (nama/kode), tampilan di modul lain ikut update'
  ])
  addFooter(s, 'Master Data → Produk')
}

// Slide 8
{
  const s = pptx.addSlide()
  addBullets(s, 'Step 2: Siapkan Lokasi Stok (Inventory)', [
    'Buat lokasi stok (Locator), contoh: RM-STOCK (bahan) dan FG-STOCK (barang jadi)',
    'ERP menghitung stok berdasarkan lokasi ini',
    'Lokasi dipakai di proses produksi untuk ambil bahan dan simpan barang jadi'
  ])
  addFooter(s, 'Inventory → Locator')
}

// Slide 9
{
  const s = pptx.addSlide()
  addBullets(s, 'Step 3: Buat BOM (Resep Produksi)', [
    'Pilih Finished Product (Meja)',
    'Isi komponen dan qty: Kayu 5, Paku 20 (contoh)',
    'BOM menjelaskan kebutuhan bahan untuk produksi'
  ])
  addFooter(s, 'Manufacturing → BOM')
}

// Slide 10
{
  const s = pptx.addSlide()
  addBullets(s, 'Step 4: Buat Work Order (Perintah Produksi)', [
    'Pilih BOM',
    'Tentukan qty produksi',
    'Pilih From Locator (ambil bahan) dan To Locator (simpan barang jadi)',
    'Status awal: Draft (belum dieksekusi)'
  ])
  addFooter(s, 'Manufacturing → Work Order')
}

// Slide 11
{
  const s = pptx.addSlide()
  addBullets(s, 'Step 5: Complete Work Order', [
    'Sistem cek stok bahan cukup atau tidak',
    'Jika cukup: bahan berkurang otomatis, barang jadi bertambah otomatis',
    'Perubahan stok tercatat sebagai pergerakan stok (movement)',
    'Jika ada kesalahan: Work Order bisa di-void (dibatalkan)'
  ])
  addFooter(s, 'Produksi berjalan')
}

// Slide 12
{
  const s = pptx.addSlide()
  addBullets(s, 'Penutup: Manfaat ERP', [
    'Satu data untuk semua departemen',
    'Stok lebih akurat dan real-time',
    'Proses mudah dilacak (draft → complete → void)',
    'Mudah dibuat laporan untuk manajemen'
  ])
  addFooter(s, 'Terima kasih')
}

const outPath = path.resolve(__dirname, '..', 'ERP_End_to_End.pptx')
if (fs.existsSync(outPath)) {
  fs.unlinkSync(outPath)
}

await pptx.writeFile({ fileName: outPath })
console.log(`Generated: ${outPath}`)
