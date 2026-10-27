# Panduan Termux → GitHub Pages

## 1. Ekstrak ZIP

Pastikan file ZIP berada di folder Download Android, lalu jalankan di Termux:

```bash
termux-setup-storage
pkg update
pkg install git unzip -y
mkdir -p ~/Zenn-Nova
unzip -o ~/storage/downloads/Zenn-Nova-TJKT-Digital-Toolkit.zip -d ~/Zenn-Nova
find ~/Zenn-Nova -maxdepth 3 -name index.html -print
cd ~/Zenn-Nova/zenn-nova
ls
```

Pastikan `index.html`, `css/`, `js/`, `assets/`, dan `README.md` terlihat sebelum lanjut.

## 2. Buat repository GitHub

Di GitHub, buat repository baru, misalnya `zenn-nova`. Ganti nama akun/repository pada perintah di bawah sesuai milikmu.

```bash
git init
git branch -M main
git add .
git commit -m "Initial ZENN NOVA website"
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

`USERNAME` dan `REPOSITORY` hanya placeholder, bukan URL final.

Jika `remote origin already exists`, periksa remote dan perbarui jika perlu:

```bash
git remote -v
git remote set-url origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

## 3. Publikasikan GitHub Pages

1. Buka repository → **Settings**.
2. Pilih **Pages**.
3. Pada **Build and deployment**, pilih **Deploy from a branch**.
4. Pilih branch `main` dan folder `/ (root)`, lalu klik **Save**.
5. Setelah deployment selesai, buka link yang ditampilkan pada bagian Pages.

## 4. Update website

Dari folder `~/Zenn-Nova/zenn-nova`, setelah mengedit file:

```bash
git add .
git commit -m "Update ZENN NOVA"
git push
```

## Jika terjadi masalah

- `unzip` gagal: periksa nama file dengan `ls ~/storage/downloads/`.
- `cd` gagal: jalankan `find ~/Zenn-Nova -maxdepth 3 -name index.html -print`, lalu masuk ke folder yang benar-benar memuat `index.html`.
- `git push` ditolak: periksa URL `git remote -v`, koneksi, dan autentikasi GitHub.
- Halaman kosong setelah publish: pastikan `index.html` ada di root sumber Pages dan path aset menggunakan path relatif.
- Catatan/favorit berbeda di perangkat lain: data sengaja disimpan secara lokal di browser dan tidak disinkronkan.
