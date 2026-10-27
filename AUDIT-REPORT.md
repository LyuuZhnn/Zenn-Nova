# ZENN NOVA — Audit & Perbaikan

## Perbaikan yang dilakukan

- Mengganti identitas yang terlihat pengguna, judul dokumen, metadata, label navigasi, teks halaman Tentang, dokumentasi, dan nama folder menjadi **ZENN NOVA**.
- Memperbaiki sumber ikon SVG bersama: setiap ikon menggunakan kelas `.icon`, `fill="none"`, `stroke="currentColor"`, ketebalan stroke, dan ujung garis yang konsisten. Ini menghindari fill hitam default yang dapat membuat ikon outline terlihat seperti bidang hitam.
- Menambahkan warna ikon per kategori navigasi, termasuk warna aksen yang tetap kontras pada tema terang dan gelap.
- Memperkaya background dengan lapisan radial/linear gradient dan memberi aksen yang berbeda ke kartu statistik, panel network, learning, kategori, activity, dan favorite.
- Membuat favicon lokal yang konsisten dengan monogram Z.
- Mengubah prefix LocalStorage aplikasi ke `zenn-nova:` dan menambahkan migrasi salin dari `zenn-tjkt:` tanpa menghapus data lama.
- Memperbaiki feedback catatan/favorit agar toast sukses muncul setelah penyimpanan berhasil.
- Memisahkan kalkulasi VLSM ke fungsi `allocateVlsm()` agar lebih mudah diuji dan dirawat.
- Menghubungkan simulator terminal virtual ke halaman Terminal & Linux sekaligus mempertahankan pencarian katalog referensi Linux.
- Memperbaiki kartu referensi yang tidak memiliki renderer, serta mendukung aktivasi kartu dengan Enter/Spasi.
- Menambahkan tes smoke tanpa dependensi di `tests/smoke-tests.cjs`, termasuk identitas baru dan pemeriksaan semua asset lokal yang dirujuk index.

## Pemeriksaan yang dijalankan

- Semua berkas JavaScript lolos `node --check`.
- `node tests/smoke-tests.cjs` berhasil: pemeriksaan 15 template rute, konsistensi identitas dan asset lokal, migrasi penyimpanan, perhitungan IPv4 `/0`, `/24`, `/31`, `/32`, validasi subnet mask, alokasi VLSM dan kapasitas, parser matematika aman, perintah filesystem terminal virtual, daftar tools, serta atribut warna SVG.
- Pemeriksaan struktur file untuk stylesheet, script, favicon, README, dan panduan deployment.
- ZIP dibuat dan integritas arsip diperiksa dengan `unzip -t`.

## Batas pengujian

Pengujian klik interaktif end-to-end dan inspeksi screenshot pada browser tidak dapat diselesaikan di lingkungan build ini karena browser yang tersedia memblokir navigasi lokal. Karena itu, jangan anggap semua kontrol telah tervalidasi secara visual di browser nyata. Tes smoke membuktikan bahwa template rute dapat dirender sebagai string dan logika perhitungan tertentu lulus, tetapi bukan pengganti pengujian manual setelah website diterbitkan melalui GitHub Pages.

## Batasan aplikasi

- Terminal adalah simulator dengan filesystem virtual, bukan shell OS.
- Diagram topologi adalah editor dokumentasi, bukan emulator paket atau koneksi perangkat.
- Website statis tidak memiliki backend, database online, autentikasi, atau sinkronisasi antarpengguna.
- Ping/ICMP, traceroute nyata, akses router fisik, dan pengelolaan resource cloud tidak dilakukan dari website ini.
- LocalStorage tersimpan hanya pada browser/perangkat terkait.
