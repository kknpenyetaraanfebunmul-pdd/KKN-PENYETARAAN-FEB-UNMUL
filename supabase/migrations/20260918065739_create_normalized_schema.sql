/*
# Create normalized schema for KKN Penyetaraan

## Overview
Replaces the single JSONB table with a fully normalized schema where each
website section has its own table. The public site reads directly from these
tables (read-only via RLS), and the admin dashboard writes through SECURITY
DEFINER functions gated by a passcode stored as a SHA-256 hash.

## New Tables
1. site_settings (section text PK, data jsonb) — hero & footer
2. struktur_kkn (id uuid PK, jabatan, deskripsi, urutan int)
3. program_kerja (id uuid PK, key unique, icon, judul, subjudul,
   deskripsi_lengkap, kegiatan jsonb, info jsonb, urutan int)
4. gallery_items (id uuid PK, tipe, url, judul, deskripsi, urutan int)
5. contact_links (id uuid PK, platform, value, url, urutan int)
6. partners (id uuid PK, grup, nama, logo_url, urutan int)
7. admin_access (id int PK=1, passcode_hash text) — NOT readable by anon

## Security
- All content tables: public SELECT (anon + authenticated), no write policies.
- admin_access: no SELECT policy (hash never exposed to client).
- SECURITY DEFINER functions verify passcode via server-side hash comparison
  before allowing any INSERT/UPDATE/DELETE.
- pgcrypto extension enabled for digest() function.

## Seed Data
- All default content inserted (hero, 6 struktur, 4 programs, 6 gallery,
  3 contacts, 6 partners, footer).
- Passcode hash for '110106' computed and stored.
*/

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- site_settings
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  section text PRIMARY KEY,
  data jsonb NOT NULL
);
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_site_settings" ON site_settings;
CREATE POLICY "public_read_site_settings"
  ON site_settings FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- struktur_kkn
-- ============================================================
CREATE TABLE IF NOT EXISTS struktur_kkn (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  jabatan text NOT NULL,
  deskripsi text NOT NULL,
  urutan int NOT NULL DEFAULT 0
);
ALTER TABLE struktur_kkn ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_struktur" ON struktur_kkn;
CREATE POLICY "public_read_struktur"
  ON struktur_kkn FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- program_kerja
-- ============================================================
CREATE TABLE IF NOT EXISTS program_kerja (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  icon text NOT NULL DEFAULT '',
  judul text NOT NULL,
  subjudul text NOT NULL DEFAULT '',
  deskripsi_lengkap text NOT NULL DEFAULT '',
  kegiatan jsonb NOT NULL DEFAULT '[]'::jsonb,
  info jsonb NOT NULL DEFAULT '{}'::jsonb,
  urutan int NOT NULL DEFAULT 0
);
ALTER TABLE program_kerja ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_program_kerja" ON program_kerja;
CREATE POLICY "public_read_program_kerja"
  ON program_kerja FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- gallery_items
-- ============================================================
CREATE TABLE IF NOT EXISTS gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipe text NOT NULL DEFAULT 'photo',
  url text NOT NULL,
  judul text NOT NULL DEFAULT '',
  deskripsi text NOT NULL DEFAULT '',
  urutan int NOT NULL DEFAULT 0
);
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_gallery" ON gallery_items;
CREATE POLICY "public_read_gallery"
  ON gallery_items FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- contact_links
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  value text NOT NULL,
  url text NOT NULL,
  urutan int NOT NULL DEFAULT 0
);
ALTER TABLE contact_links ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_contact_links" ON contact_links;
CREATE POLICY "public_read_contact_links"
  ON contact_links FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- partners
-- ============================================================
CREATE TABLE IF NOT EXISTS partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grup text NOT NULL DEFAULT 'support',
  nama text NOT NULL,
  logo_url text NOT NULL DEFAULT '',
  urutan int NOT NULL DEFAULT 0
);
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_partners" ON partners;
CREATE POLICY "public_read_partners"
  ON partners FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- admin_access (passcode hash — NOT readable by anon)
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_access (
  id int PRIMARY KEY DEFAULT 1,
  passcode_hash text NOT NULL,
  CONSTRAINT single_row CHECK (id = 1)
);
ALTER TABLE admin_access ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- SECURITY DEFINER: verify_admin_passcode
-- ============================================================
CREATE OR REPLACE FUNCTION verify_admin_passcode(input_passcode text)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  stored_hash text;
  input_hash text;
BEGIN
  SELECT passcode_hash INTO stored_hash FROM admin_access WHERE id = 1;
  input_hash := encode(digest(input_passcode, 'sha256'), 'hex');
  RETURN stored_hash IS NOT NULL AND input_hash = stored_hash;
END;
$$;
GRANT EXECUTE ON FUNCTION verify_admin_passcode TO anon, authenticated;

-- ============================================================
-- SECURITY DEFINER: admin_upsert_setting
-- ============================================================
CREATE OR REPLACE FUNCTION admin_upsert_setting(
  p_passcode text, p_section text, p_data jsonb
)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT verify_admin_passcode(p_passcode) THEN
    RAISE EXCEPTION 'Unauthorized: invalid passcode';
  END IF;
  INSERT INTO site_settings (section, data) VALUES (p_section, p_data)
  ON CONFLICT (section) DO UPDATE SET data = EXCLUDED.data;
END;
$$;
GRANT EXECUTE ON FUNCTION admin_upsert_setting TO anon, authenticated;

-- ============================================================
-- SECURITY DEFINER: admin_upsert_struktur
-- (p_id is last with default so caller can omit for insert)
-- ============================================================
CREATE OR REPLACE FUNCTION admin_upsert_struktur(
  p_passcode text, p_jabatan text, p_deskripsi text,
  p_urutan int DEFAULT 0, p_id uuid DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE out_id uuid;
BEGIN
  IF NOT verify_admin_passcode(p_passcode) THEN
    RAISE EXCEPTION 'Unauthorized: invalid passcode';
  END IF;
  IF p_id IS NOT NULL THEN
    UPDATE struktur_kkn SET jabatan=p_jabatan, deskripsi=p_deskripsi, urutan=p_urutan
    WHERE id = p_id RETURNING id INTO out_id;
  ELSE
    INSERT INTO struktur_kkn (jabatan, deskripsi, urutan)
    VALUES (p_jabatan, p_deskripsi, p_urutan) RETURNING id INTO out_id;
  END IF;
  RETURN out_id;
END;
$$;
GRANT EXECUTE ON FUNCTION admin_upsert_struktur TO anon, authenticated;

-- ============================================================
-- SECURITY DEFINER: admin_upsert_program
-- ============================================================
CREATE OR REPLACE FUNCTION admin_upsert_program(
  p_passcode text, p_key text, p_icon text, p_judul text,
  p_subjudul text, p_deskripsi_lengkap text,
  p_kegiatan jsonb, p_info jsonb,
  p_urutan int DEFAULT 0, p_id uuid DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE out_id uuid;
BEGIN
  IF NOT verify_admin_passcode(p_passcode) THEN
    RAISE EXCEPTION 'Unauthorized: invalid passcode';
  END IF;
  IF p_id IS NOT NULL THEN
    UPDATE program_kerja SET key=p_key, icon=p_icon, judul=p_judul, subjudul=p_subjudul,
      deskripsi_lengkap=p_deskripsi_lengkap, kegiatan=p_kegiatan, info=p_info, urutan=p_urutan
    WHERE id = p_id RETURNING id INTO out_id;
  ELSE
    INSERT INTO program_kerja (key, icon, judul, subjudul, deskripsi_lengkap, kegiatan, info, urutan)
    VALUES (p_key, p_icon, p_judul, p_subjudul, p_deskripsi_lengkap, p_kegiatan, p_info, p_urutan)
    RETURNING id INTO out_id;
  END IF;
  RETURN out_id;
END;
$$;
GRANT EXECUTE ON FUNCTION admin_upsert_program TO anon, authenticated;

-- ============================================================
-- SECURITY DEFINER: admin_upsert_gallery
-- ============================================================
CREATE OR REPLACE FUNCTION admin_upsert_gallery(
  p_passcode text, p_tipe text, p_url text, p_judul text,
  p_deskripsi text, p_urutan int DEFAULT 0, p_id uuid DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE out_id uuid;
BEGIN
  IF NOT verify_admin_passcode(p_passcode) THEN
    RAISE EXCEPTION 'Unauthorized: invalid passcode';
  END IF;
  IF p_id IS NOT NULL THEN
    UPDATE gallery_items SET tipe=p_tipe, url=p_url, judul=p_judul, deskripsi=p_deskripsi, urutan=p_urutan
    WHERE id = p_id RETURNING id INTO out_id;
  ELSE
    INSERT INTO gallery_items (tipe, url, judul, deskripsi, urutan)
    VALUES (p_tipe, p_url, p_judul, p_deskripsi, p_urutan) RETURNING id INTO out_id;
  END IF;
  RETURN out_id;
END;
$$;
GRANT EXECUTE ON FUNCTION admin_upsert_gallery TO anon, authenticated;

-- ============================================================
-- SECURITY DEFINER: admin_upsert_contact
-- ============================================================
CREATE OR REPLACE FUNCTION admin_upsert_contact(
  p_passcode text, p_platform text, p_value text, p_url text,
  p_urutan int DEFAULT 0, p_id uuid DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE out_id uuid;
BEGIN
  IF NOT verify_admin_passcode(p_passcode) THEN
    RAISE EXCEPTION 'Unauthorized: invalid passcode';
  END IF;
  IF p_id IS NOT NULL THEN
    UPDATE contact_links SET platform=p_platform, value=p_value, url=p_url, urutan=p_urutan
    WHERE id = p_id RETURNING id INTO out_id;
  ELSE
    INSERT INTO contact_links (platform, value, url, urutan)
    VALUES (p_platform, p_value, p_url, p_urutan) RETURNING id INTO out_id;
  END IF;
  RETURN out_id;
END;
$$;
GRANT EXECUTE ON FUNCTION admin_upsert_contact TO anon, authenticated;

-- ============================================================
-- SECURITY DEFINER: admin_upsert_partner
-- ============================================================
CREATE OR REPLACE FUNCTION admin_upsert_partner(
  p_passcode text, p_grup text, p_nama text, p_logo_url text,
  p_urutan int DEFAULT 0, p_id uuid DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE out_id uuid;
BEGIN
  IF NOT verify_admin_passcode(p_passcode) THEN
    RAISE EXCEPTION 'Unauthorized: invalid passcode';
  END IF;
  IF p_id IS NOT NULL THEN
    UPDATE partners SET grup=p_grup, nama=p_nama, logo_url=p_logo_url, urutan=p_urutan
    WHERE id = p_id RETURNING id INTO out_id;
  ELSE
    INSERT INTO partners (grup, nama, logo_url, urutan)
    VALUES (p_grup, p_nama, p_logo_url, p_urutan) RETURNING id INTO out_id;
  END IF;
  RETURN out_id;
END;
$$;
GRANT EXECUTE ON FUNCTION admin_upsert_partner TO anon, authenticated;

-- ============================================================
-- SECURITY DEFINER: admin_delete_row (generic by table + id)
-- ============================================================
CREATE OR REPLACE FUNCTION admin_delete_row(
  p_passcode text, p_table text, p_id uuid
)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT verify_admin_passcode(p_passcode) THEN
    RAISE EXCEPTION 'Unauthorized: invalid passcode';
  END IF;
  IF p_table = 'struktur_kkn' THEN
    DELETE FROM struktur_kkn WHERE id = p_id;
  ELSIF p_table = 'program_kerja' THEN
    DELETE FROM program_kerja WHERE id = p_id;
  ELSIF p_table = 'gallery_items' THEN
    DELETE FROM gallery_items WHERE id = p_id;
  ELSIF p_table = 'contact_links' THEN
    DELETE FROM contact_links WHERE id = p_id;
  ELSIF p_table = 'partners' THEN
    DELETE FROM partners WHERE id = p_id;
  ELSE
    RAISE EXCEPTION 'Unknown table: %', p_table;
  END IF;
END;
$$;
GRANT EXECUTE ON FUNCTION admin_delete_row TO anon, authenticated;

-- ============================================================
-- SEED DATA
-- ============================================================

INSERT INTO site_settings (section, data) VALUES
('hero', '{
  "title": "KKN PENYETARAAN",
  "subtitle": "Membangun desa, mengabdi untuk negeri. Program Kuliah Kerja Nyata Penyetaraan.",
  "buttonText": "View KKN",
  "slides": [
    {"id": "s1", "url": "https://images.pexels.com/photos/15830193/pexels-photo-15830193.jpeg?auto=compress&cs=tinysrgb&w=1920"},
    {"id": "s2", "url": "https://images.pexels.com/photos/9203969/pexels-photo-9203969.jpeg?auto=compress&cs=tinysrgb&w=1920"},
    {"id": "s3", "url": "https://images.pexels.com/photos/5232267/pexels-photo-5232267.jpeg?auto=compress&cs=tinysrgb&w=1920"}
  ]
}'::jsonb)
ON CONFLICT (section) DO NOTHING;

INSERT INTO site_settings (section, data) VALUES
('footer', '{
  "copyright": "© 2025 KKN Penyetaraan. All rights reserved.",
  "madeWith": "Dibuat dengan ♥ untuk desa"
}'::jsonb)
ON CONFLICT (section) DO NOTHING;

INSERT INTO struktur_kkn (jabatan, deskripsi, urutan) VALUES
('Ketua', 'Koordinator', 0),
('Sekretaris', 'Administrasi', 1),
('Bendahara', 'Keuangan', 2),
('Humas', 'Hubungan Masyarakat', 3),
('PDD', 'Publikasi & Dokumentasi', 4),
('Perdek', 'Perlengkapan & Dekorasi', 5)
ON CONFLICT DO NOTHING;

INSERT INTO program_kerja (key, icon, judul, subjudul, deskripsi_lengkap, kegiatan, info, urutan) VALUES
('pendidikan', '📚', 'Pendidikan',
  'Mengajar dan mendampingi belajar anak-anak desa.',
  'Program pendidikan KKN Penyetaraan berfokus pada peningkatan kualitas pendidikan anak-anak di desa binaan. Kegiatan meliputi bimbingan belajar rutin, pelajaran tambahan untuk mata pelajaran inti, serta motivasi untuk melanjutkan pendidikan ke jenjang yang lebih tinggi. Kami percaya pendidikan adalah kunci utama untuk memutus rantai kemiskinan dan membuka peluang masa depan yang lebih baik.',
  '["Bimbingan belajar rutin setiap sore di balai desa","Les privat mata pelajaran Matematika, Bahasa Inggris, dan IPA","Pelatihan membaca dan menulis untuk anak SD kelas rendah","Workshop motivasi belajar dan cita-cita","Donasi buku pelajaran dan alat tulis untuk siswa kurang mampu","Penyelenggaraan lomba cerdas cermat antar RT"]'::jsonb,
  '{"sasaran": "Anak-anak SD dan SMP desa binaan", "jadwal": "Setiap hari Senin–Jumat, pukul 15.00–17.00 WIB", "lokasi": "Balai Desa dan TK setempat", "target": "80–100 siswa per bulan"}'::jsonb,
  0),
('lingkungan', '🌿', 'Lingkungan',
  'Kerja bakti dan penghijauan lingkungan desa.',
  'Program lingkungan bertujuan menjaga kebersihan dan kelestarian alam desa. Melalui kerja bakti rutin, penghijauan, dan edukasi pengelolaan sampah, kami mendorong kesadaran masyarakat akan pentingnya lingkungan yang bersih dan sehat untuk kualitas hidup yang lebih baik.',
  '["Kerja bakti membersihkan selokan dan area umum desa","Penanaman 200 pohon di lahan kritis dan pinggir jalan","Sosialisasi pemilahan sampah organik dan anorganik","Pembuatan komposter dari sampah organik rumah tangga","Penyediaan tempat sampah terpilah di titik strategis desa","Kampanye Desa Bersih melalui poster dan pengumuman"]'::jsonb,
  '{"sasaran": "Seluruh warga desa binaan", "jadwal": "Setiap Sabtu pagi, pukul 07.00–10.00 WIB", "lokasi": "Area umum desa, lapangan, dan lahan kosong", "target": "Kerja bakti rutin dengan 100+ warga per kegiatan"}'::jsonb,
  1),
('teknologi', '💻', 'Teknologi',
  'Pelatihan digital marketing untuk UMKM.',
  'Program teknologi memberdayakan UMKM desa dengan keterampilan digital. Pelatihan digital marketing, pembuatan konten promosi, dan penggunaan platform jualan online membantu pelaku usaha lokal menjangkau pasar yang lebih luas dan meningkatkan pendapatan.',
  '["Pelatihan pembuatan akun dan toko di marketplace","Workshop fotografi produk menggunakan kamera ponsel","Pelatihan copywriting untuk deskripsi produk yang menarik","Pendampingan pembuatan konten Instagram dan TikTok","Sosialisasi penggunaan aplikasi pembayaran digital","Konsultasi one-on-one strategi pemasaran online"]'::jsonb,
  '{"sasaran": "Pelaku UMKM desa binaan", "jadwal": "Setiap Selasa dan Kamis, pukul 13.00–16.00 WIB", "lokasi": "Balai Desa dan kunjungan langsung ke lokasi usaha", "target": "25–30 UMKM dibina selama periode KKN"}'::jsonb,
  2),
('kesehatan', '🏥', 'Kesehatan',
  'Penyuluhan kesehatan dan posyandu.',
  'Program kesehatan berfokus pada peningkatan derajat kesehatan masyarakat desa. Kegiatan meliputi penyuluhan kesehatan, pemeriksaan gratis, dan dukungan kegiatan posyandu. Kami bekerja sama dengan bidan desa dan puskesmas untuk memastikan layanan kesehatan yang tepat sasaran.',
  '["Penyuluhan gizi seimbang untuk ibu-ibu PKK","Pemeriksaan tekanan darah dan gula darah gratis","Pendampingan kegiatan posyandu balita setiap bulan","Edukasi PHBS (Perilaku Hidup Bersih dan Sehat)","Kampanye pentingnya imunisasi lengkap untuk balita","Senam bersama warga setiap Minggu pagi"]'::jsonb,
  '{"sasaran": "Ibu-ibu PKK, balita, dan lansia desa", "jadwal": "Setiap Rabu, pukul 09.00–12.00 WIB", "lokasi": "Posyandu desa dan balai PKK", "target": "60–80 warga per kegiatan penyuluhan"}'::jsonb,
  3)
ON CONFLICT (key) DO NOTHING;

INSERT INTO gallery_items (tipe, url, judul, deskripsi, urutan) VALUES
('photo', 'https://images.pexels.com/photos/11580455/pexels-photo-11580455.jpeg?auto=compress&cs=tinysrgb&w=940', 'Bimbingan Belajar', 'Mengajar anak-anak desa di balai desa setiap sore.', 0),
('photo', 'https://images.pexels.com/photos/28662953/pexels-photo-28662953.jpeg?auto=compress&cs=tinysrgb&w=940', 'Penghijauan Desa', 'Penanaman pohon bersama warga untuk lingkungan yang lebih hijau.', 1),
('photo', 'https://images.pexels.com/photos/8475199/pexels-photo-8475199.jpeg?auto=compress&cs=tinysrgb&w=940', 'Pelatihan UMKM', 'Mendampingi pedagang lokal memanfaatkan teknologi digital.', 2),
('photo', 'https://images.pexels.com/photos/8248293/pexels-photo-8248293.jpeg?auto=compress&cs=tinysrgb&w=940', 'Penyuluhan Kesehatan', 'Pemeriksaan kesehatan gratis untuk warga desa.', 3),
('photo', 'https://images.pexels.com/photos/27471164/pexels-photo-27471164.jpeg?auto=compress&cs=tinysrgb&w=940', 'Musyawarah Desa', 'Pertemuan warga untuk merencanakan program kerja KKN.', 4),
('photo', 'https://images.pexels.com/photos/37472391/pexels-photo-37472391.jpeg?auto=compress&cs=tinysrgb&w=940', 'Jelajah Desa', 'Mengenal lebih dekat kehidupan sosial masyarakat desa.', 5)
ON CONFLICT DO NOTHING;

INSERT INTO contact_links (platform, value, url, urutan) VALUES
('Instagram', '@kkn.penyetaraan', 'https://instagram.com', 0),
('TikTok', '@kknpenyetaraan', 'https://tiktok.com', 1),
('Email', 'kkn.penyetaraan@gmail.com', 'mailto:kkn.penyetaraan@gmail.com', 2)
ON CONFLICT DO NOTHING;

INSERT INTO partners (grup, nama, logo_url, urutan) VALUES
('support', 'Universitas Negeri', 'https://placehold.co/150x60/7b5ea7/ffffff?text=UNIV', 0),
('support', 'Kementerian Desa', 'https://placehold.co/150x60/2b1c3d/ffffff?text=KEMDES', 1),
('support', 'Pemda Kabupaten', 'https://placehold.co/150x60/7b5ea7/ffffff?text=PEMDA', 2),
('sponsor', 'Bank Desa', 'https://placehold.co/150x60/2b1c3d/ffffff?text=BANK+DESA', 0),
('sponsor', 'Toko Sejahtera', 'https://placehold.co/150x60/7b5ea7/ffffff?text=TOKO+SEJ', 1),
('sponsor', 'Koperasi Tani', 'https://placehold.co/150x60/2b1c3d/ffffff?text=KOP+TANI', 2)
ON CONFLICT DO NOTHING;

-- Admin access: SHA-256 hash of '110106'
INSERT INTO admin_access (id, passcode_hash) VALUES
(1, encode(digest('110106', 'sha256'), 'hex'))
ON CONFLICT (id) DO NOTHING;
