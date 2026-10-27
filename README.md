# ZENN NOVA — Premium TJKT Digital Toolkit

**Tagline:** Explore. Learn. Build. Beyond.

ZENN NOVA adalah workspace statis untuk mempelajari jaringan komputer, Cisco IOS, MikroTik RouterOS, Linux, server, Cloud Computing, telekomunikasi, dan fiber optik. Proyek dibuat menggunakan HTML, CSS, JavaScript, SVG, dan LocalStorage; tidak membutuhkan backend atau proses build.

## Fitur yang tersedia

- Dashboard midnight navy dengan sidebar kiri, pencarian global (`Ctrl+K`), tema gelap/terang, shortcut, aktivitas lokal, dan progres belajar.
- Kalkulator IPv4/subnetting, VLSM, biner-desimal-heksadesimal, satuan data, hukum Ohm, dan ekspresi matematika yang diparse secara terbatas (tanpa `eval`).
- Network Tools: validator IPv4, hostname, MAC address, serta checklist troubleshooting.
- Referensi perintah Cisco, MikroTik, Linux, Cloud, kabel T568A/B, link budget, dan materi pembelajaran.
- Terminal virtual dengan filesystem simulasi.
- Network Topology Builder: tambah/pindah/hapus perangkat, koneksi, label, detail perangkat, simpan/muat lokal, undo/redo, export SVG/PNG.
- Kuis 10 soal dengan skor nyata, penjelasan jawaban, dan rekor lokal.
- Penyusun laporan dengan preview, ekspor TXT/HTML, serta Print/Save as PDF melalui dialog cetak browser.
- Favorit, catatan, dan progres belajar pada LocalStorage.

## Menjalankan secara lokal

Cara paling sederhana: buka `index.html` dengan browser modern. Beberapa fitur ekspor/clipboard bekerja lebih baik pada konteks browser normal (misalnya GitHub Pages atau server lokal), karena kebijakan keamanan browser berbeda-beda.

## Struktur proyek

```text
zenn-nova/
├── index.html
├── README.md
├── AUDIT-REPORT.md
├── assets/icons/
│   ├── logo.svg
│   └── favicon.svg
├── css/
│   ├── themes.css
│   ├── style.css
│   ├── layout.css
│   ├── components.css
│   ├── responsive.css
│   └── brand-polish.css
├── tests/
│   └── smoke-tests.cjs
└── js/
    ├── app.js
    ├── storage.js
    ├── theme.js
    ├── navigation.js
    ├── search.js
    ├── calculators.js
    ├── network-tools.js
    ├── references.js
    ├── terminal.js
    ├── topology.js
    ├── fiber.js
    ├── quiz.js
    └── reports.js
```

## Uji cepat kode

Dengan Node.js terpasang, jalankan `node tests/smoke-tests.cjs`. Tes dependency-free ini memeriksa rendering template 15 rute, migrasi LocalStorage lama, subnet `/0`, `/24`, `/31`, `/32`, validasi subnet mask, alokasi VLSM, parser matematika aman, dan deklarasi warna ikon SVG. Tes ini bukan pengganti pengujian interaksi visual menyeluruh di browser.

## Termux + GitHub Pages (Android)

1. Unduh `Zenn-Nova-TJKT-Digital-Toolkit.zip` ke folder `Download`.
2. Buka Termux, lalu jalankan:

```bash
termux-setup-storage
pkg update
pkg install git unzip -y
mkdir -p ~/Zenn-Nova
unzip -o ~/storage/downloads/Zenn-Nova-TJKT-Digital-Toolkit.zip -d ~/Zenn-Nova
find ~/Zenn-Nova -maxdepth 3 -name index.html -print
```

ZIP ini menyertakan folder utama `zenn-nova`, jadi masuk ke folder yang berisi `index.html`:

```bash
cd ~/Zenn-Nova/zenn-nova
ls
```

3. Buat repository baru di GitHub (contoh nama `zenn-nova`). Jangan tambahkan README otomatis jika ingin push folder lokal ini langsung sebagai source pertama.
4. Jalankan perintah berikut dari folder yang berisi `index.html`:

```bash
git init
git branch -M main
git add .
git commit -m "Initial ZENN NOVA website"
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

Ganti `USERNAME` dan `REPOSITORY` menggunakan nama akun dan repository milikmu. URL di atas hanya template.

Jika pesan `remote origin already exists` muncul, cek remote:

```bash
git remote -v
```

Jika URL yang terdaftar keliru, perbarui tanpa menambahkan remote kedua:

```bash
git remote set-url origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

5. Di repository GitHub, buka **Settings → Pages**. Pada **Build and deployment**, pilih **Deploy from a branch**, branch `main`, folder `/ (root)`, lalu tekan **Save**.
6. Tunggu indikator deployment selesai dan buka URL yang ditampilkan pada halaman Pages. Jangan menebak URL sebelum GitHub menerbitkannya.

## Catatan LocalStorage dan batasan browser

- Tema, favorit, catatan, progres, terminal virtual, aktivitas, dan proyek topologi tersimpan di browser/perangkat tersebut; tidak tersinkron otomatis. Data lama dengan prefix `zenn-tjkt:` disalin ke prefix baru ketika pertama kali membuka versi ZENN NOVA; data lama tidak dihapus otomatis.
- Membersihkan data situs dapat menghapus data lokal. Jangan menyimpan password atau rahasia di catatan.
- Terminal ZENN adalah simulator, bukan shell Linux asli. File dan perintahnya virtual.
- Diagram topologi adalah alat dokumentasi, bukan emulator paket atau koneksi ke router.
- Browser statis tidak menyediakan raw ICMP secara umum; ZENN tidak mengklaim ping, traceroute, pemindaian host, atau akses router fisik nyata.
- DNS/HTTP lookup lintas domain dibatasi oleh browser dan CORS. Format alamat yang valid tidak berarti perangkat sedang online.
- ZENN tidak membuat VM cloud, mengelola resource cloud, atau menyediakan akun/admin backend.
- Export PDF dilakukan melalui perintah Print browser dan opsi **Save as PDF**; dukungan bergantung browser/perangkat.

## Update konten

- Materi dan referensi perintah: edit array `lessons` dan `refs` di `js/references.js`.
- Soal latihan: edit array `questions` di `js/quiz.js`.
- Warna dan design token: edit `css/themes.css`.
- Layout dan komponen: edit file terkait pada folder `css/`.
- Perilaku tools: edit modul yang sesuai pada `js/`.

Setelah perubahan, jalankan `git add .`, `git commit -m "Update ZENN NOVA"`, dan `git push` dari folder proyek.
