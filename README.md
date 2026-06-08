# UMKM Circle - Card Album Feed

Project Next.js untuk Album Feed Editor dengan Card individual, OG image otomatis, like & komentar realtime via Supabase.

## Fitur sesuai spec
- /album/[slug] : feed vertikal scroll-snap
- /c/[slug] : halaman card dengan meta tags dinamis (og:image = gambar pertama slider)
- Warna card, border radius, font (Poppins, Montserrat, Inter, Lato, Roboto, Open Sans), ukuran, warna semua dari database
- Carousel gambar dari URL
- Video embed YouTube/Vimeo/mp4
- CTA tombol dengan emoji
- Like realtime, komentar + balas, share native
- Footer "← Lihat semua produk" di setiap card

## Deploy 5 menit
1. Supabase: buat project gratis → SQL Editor → paste supabase.sql → Run
2. GitHub: upload folder ini
3. Vercel: New Project → Import GitHub → tambahkan env:
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   NEXT_PUBLIC_SITE_URL=https://namamu.vercel.app
4. Deploy

Setelah deploy, tambah data via Supabase Table Editor:
- albums: slug='warung-surabaya', title='Warung Surabaya Circle', cover_image='https://...'
- cards: isi sesuai editor, images = ["url1","url2"]

OG test: share https://namamu.vercel.app/c/nasi-goreng-kencur ke WhatsApp → muncul gambar pertama.
