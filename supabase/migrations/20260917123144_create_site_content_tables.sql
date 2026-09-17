/*
# Create KKN Penyetaraan site content database

Creates the full schema for the KKN Penyetaraan portfolio website,
replacing the previous localStorage-based data storage with a
persistent Supabase database.

## New Tables

1. `hero` — stores the hero section content (singleton, id=1)
   - line1, line2, description, updated_at

2. `struktur` — list of KKN team structure roles
   - jabatan, deskripsi, sort_order, created_at

3. `programs` — list of program kerja (work programs)
   - icon, title, short_desc, category, subtitle, description,
     activities, info, sort_order, created_at

4. `gallery` — list of gallery media items (photos & videos)
   - type ('img'|'video'), src, title, desc, sort_order, created_at

5. `contact` — contact information (singleton, id=1)
   - instagram_username, instagram_url, tiktok_username,
     tiktok_url, email, updated_at

6. `partners` — list of partner organizations
   - partner_type ('support'|'sponsor'), name, logo, sort_order

## Security

- RLS enabled on ALL tables.
- Single-tenant app with no Supabase sign-in (admin access uses a
  client-side passcode). All policies use TO anon, authenticated
  so the anon-key frontend can read and write.
- 4 policies per table (SELECT, INSERT, UPDATE, DELETE).

## Notes

- `program` is a PostgreSQL reserved word, so the table is named
  `programs` (plural) to avoid quoting everywhere.
- Singleton tables (hero, contact) use id int PRIMARY KEY DEFAULT 1
  with a CHECK constraint ensuring id = 1.
- updated_at auto-updates via trigger on hero & contact.
*/

-- ============================================
-- HERO TABLE (singleton)
-- ============================================
CREATE TABLE IF NOT EXISTS hero (
    id int PRIMARY KEY DEFAULT 1,
    line1 text NOT NULL DEFAULT 'KKN',
    line2 text NOT NULL DEFAULT 'PENYETARAAN',
    description text NOT NULL DEFAULT 'Membangun desa, mengabdi untuk negeri. Program Kuliah Kerja Nyata Penyetaraan.',
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT hero_singleton CHECK (id = 1)
);

ALTER TABLE hero ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_hero" ON hero;
CREATE POLICY "anon_select_hero" ON hero FOR SELECT
    TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_hero" ON hero;
CREATE POLICY "anon_insert_hero" ON hero FOR INSERT
    TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_hero" ON hero;
CREATE POLICY "anon_update_hero" ON hero FOR UPDATE
    TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_hero" ON hero;
CREATE POLICY "anon_delete_hero" ON hero FOR DELETE
    TO anon, authenticated USING (true);

-- ============================================
-- STRUKTUR TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS struktur (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    jabatan text NOT NULL DEFAULT '',
    deskripsi text NOT NULL DEFAULT '',
    sort_order int NOT NULL DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE struktur ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_struktur" ON struktur;
CREATE POLICY "anon_select_struktur" ON struktur FOR SELECT
    TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_struktur" ON struktur;
CREATE POLICY "anon_insert_struktur" ON struktur FOR INSERT
    TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_struktur" ON struktur;
CREATE POLICY "anon_update_struktur" ON struktur FOR UPDATE
    TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_struktur" ON struktur;
CREATE POLICY "anon_delete_struktur" ON struktur FOR DELETE
    TO anon, authenticated USING (true);

-- ============================================
-- PROGRAMS TABLE (named plural to avoid reserved word)
-- ============================================
CREATE TABLE IF NOT EXISTS programs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    icon text NOT NULL DEFAULT '📋',
    title text NOT NULL DEFAULT '',
    short_desc text NOT NULL DEFAULT '',
    category text NOT NULL DEFAULT '',
    subtitle text NOT NULL DEFAULT '',
    description text NOT NULL DEFAULT '',
    activities text NOT NULL DEFAULT '',
    info text NOT NULL DEFAULT '',
    sort_order int NOT NULL DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_programs" ON programs;
CREATE POLICY "anon_select_programs" ON programs FOR SELECT
    TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_programs" ON programs;
CREATE POLICY "anon_insert_programs" ON programs FOR INSERT
    TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_programs" ON programs;
CREATE POLICY "anon_update_programs" ON programs FOR UPDATE
    TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_programs" ON programs;
CREATE POLICY "anon_delete_programs" ON programs FOR DELETE
    TO anon, authenticated USING (true);

-- ============================================
-- GALLERY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS gallery (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    type text NOT NULL DEFAULT 'img' CHECK (type IN ('img', 'video')),
    src text NOT NULL DEFAULT '',
    title text NOT NULL DEFAULT '',
    "desc" text NOT NULL DEFAULT '',
    sort_order int NOT NULL DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_gallery" ON gallery;
CREATE POLICY "anon_select_gallery" ON gallery FOR SELECT
    TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_gallery" ON gallery;
CREATE POLICY "anon_insert_gallery" ON gallery FOR INSERT
    TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_gallery" ON gallery;
CREATE POLICY "anon_update_gallery" ON gallery FOR UPDATE
    TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_gallery" ON gallery;
CREATE POLICY "anon_delete_gallery" ON gallery FOR DELETE
    TO anon, authenticated USING (true);

-- ============================================
-- CONTACT TABLE (singleton)
-- ============================================
CREATE TABLE IF NOT EXISTS contact (
    id int PRIMARY KEY DEFAULT 1,
    instagram_username text NOT NULL DEFAULT '@kkn.penyetaraan',
    instagram_url text NOT NULL DEFAULT 'https://instagram.com/kkn.penyetaraan',
    tiktok_username text NOT NULL DEFAULT '@kkn.penyetaraan',
    tiktok_url text NOT NULL DEFAULT 'https://tiktok.com/@kkn.penyetaraan',
    email text NOT NULL DEFAULT 'kkn.penyetaraan@email.com',
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT contact_singleton CHECK (id = 1)
);

ALTER TABLE contact ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_contact" ON contact;
CREATE POLICY "anon_select_contact" ON contact FOR SELECT
    TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_contact" ON contact;
CREATE POLICY "anon_insert_contact" ON contact FOR INSERT
    TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_contact" ON contact;
CREATE POLICY "anon_update_contact" ON contact FOR UPDATE
    TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_contact" ON contact;
CREATE POLICY "anon_delete_contact" ON contact FOR DELETE
    TO anon, authenticated USING (true);

-- ============================================
-- PARTNERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS partners (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_type text NOT NULL DEFAULT 'support' CHECK (partner_type IN ('support', 'sponsor')),
    name text NOT NULL DEFAULT '',
    logo text NOT NULL DEFAULT '',
    sort_order int NOT NULL DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_partners" ON partners;
CREATE POLICY "anon_select_partners" ON partners FOR SELECT
    TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_partners" ON partners;
CREATE POLICY "anon_insert_partners" ON partners FOR INSERT
    TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_partners" ON partners;
CREATE POLICY "anon_update_partners" ON partners FOR UPDATE
    TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_partners" ON partners;
CREATE POLICY "anon_delete_partners" ON partners FOR DELETE
    TO anon, authenticated USING (true);

-- ============================================
-- UPDATED_AT TRIGGER for hero & contact
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS hero_updated_at ON hero;
CREATE TRIGGER hero_updated_at BEFORE UPDATE ON hero
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS contact_updated_at ON contact;
CREATE TRIGGER contact_updated_at BEFORE UPDATE ON contact
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_struktur_sort_order ON struktur(sort_order);
CREATE INDEX IF NOT EXISTS idx_programs_sort_order ON programs(sort_order);
CREATE INDEX IF NOT EXISTS idx_gallery_sort_order ON gallery(sort_order);
CREATE INDEX IF NOT EXISTS idx_partners_type_sort ON partners(partner_type, sort_order);

-- ============================================
-- SEED DEFAULT DATA
-- ============================================

-- Hero singleton row
INSERT INTO hero (id, line1, line2, description)
VALUES (1, 'KKN', 'PENYETARAAN', 'Membangun desa, mengabdi untuk negeri. Program Kuliah Kerja Nyata Penyetaraan.')
ON CONFLICT (id) DO NOTHING;

-- Contact singleton row
INSERT INTO contact (id, instagram_username, instagram_url, tiktok_username, tiktok_url, email)
VALUES (1, '@kkn.penyetaraan', 'https://instagram.com/kkn.penyetaraan', '@kkn.penyetaraan', 'https://tiktok.com/@kkn.penyetaraan', 'kkn.penyetaraan@email.com')
ON CONFLICT (id) DO NOTHING;

-- Struktur
INSERT INTO struktur (jabatan, deskripsi, sort_order) VALUES
('Ketua', 'Koordinator', 0),
('Sekretaris', 'Administrasi', 1),
('Bendahara', 'Keuangan', 2),
('Humas', 'Hubungan Masyarakat', 3),
('PDD', 'Publikasi & Dokumentasi', 4),
('Perdek', 'Perlengkapan & Dekorasi', 5)
ON CONFLICT DO NOTHING;

-- Programs
INSERT INTO programs (icon, title, short_desc, category, subtitle, description, activities, info, sort_order) VALUES
('📚', 'Pendidikan', 'Mengajar dan mendampingi belajar anak-anak desa.', 'Bidang Pendidikan', 'Mengajar dan mendampingi belajar anak-anak desa.', 'Program pendidikan dirancang untuk meningkatkan kualitas belajar anak-anak desa melalui pendampingan intensif, bimbingan belajar, dan kegiatan kreatif yang menyenangkan.', 'Bimbingan belajar rutin 3x seminggu
Les tambahan Matematika & Bahasa Inggris
Pojok baca & perpustakaan mini desa
Lomba mewarnai & cerdas cermat
Pelatihan komputer dasar untuk anak', 'Sasaran|Anak SD & SMP
Jadwal|Senin, Rabu, Jumat
Lokasi|Balai Desa
Peserta|45+ anak', 0),
('🌱', 'Lingkungan', 'Kerja bakti dan penghijauan lingkungan desa.', 'Bidang Lingkungan', 'Kerja bakti dan penghijauan lingkungan desa.', 'Program lingkungan berfokus pada kebersihan dan penghijauan desa melalui kerja bakti rutin, penanaman pohon, serta edukasi pengelolaan sampah yang berkelanjutan.', 'Kerja bakti massal setiap minggu
Penanaman 100+ pohon di area desa
Pembuatan tempat sampah organik & anorganik
Sosialisasi bank sampah warga
Pembuatan pupuk kompos dari sampah organik', 'Sasaran|Seluruh warga desa
Jadwal|Setiap Minggu pagi
Lokasi|Area desa
Target|100+ pohon', 1),
('💻', 'Teknologi', 'Pelatihan digital marketing untuk UMKM.', 'Bidang Teknologi', 'Pelatihan digital marketing untuk UMKM.', 'Program teknologi dirancang untuk membantu UMKM desa beradaptasi dengan era digital melalui pelatihan pemasaran online, foto produk, dan pengelolaan media sosial.', 'Pelatihan foto produk dengan HP
Workshop jualan online via Shopee & Tokopedia
Pembuatan akun Instagram bisnis UMKM
Pelatihan copywriting untuk promosi
Pendampingan pembuatan logo & branding', 'Sasaran|Pelaku UMKM desa
Jadwal|Selasa & Kamis
Lokasi|Aula Desa
Peserta|20+ UMKM', 2),
('🏥', 'Kesehatan', 'Penyuluhan kesehatan dan posyandu.', 'Bidang Kesehatan', 'Penyuluhan kesehatan dan posyandu.', 'Program kesehatan berfokus pada peningkatan kesadaran hidup sehat warga melalui penyuluhan, pemeriksaan gratis, dan pendampingan posyandu balita & lansia.', 'Pemeriksaan kesehatan gratis untuk warga
Penyuluhan gizi untuk ibu hamil & balita
Bantuan posyandu balita & lansia
Sosialisasi PHBS (Perilaku Hidup Bersih Sehat)
Senam sehat bersama setiap minggu', 'Sasaran|Balita, ibu hamil, lansia
Jadwal|Rabu & Sabtu
Lokasi|Posyandu Desa
Layanan|Gratis', 3)
ON CONFLICT DO NOTHING;

-- Gallery
INSERT INTO gallery (type, src, title, "desc", sort_order) VALUES
('img', 'https://images.unsplash.com/photo-1594708767771-a78216a1c4b8?auto=format&fit=crop&w=800&q=80', 'Kerja Bakti Desa', 'Bersama warga membersihkan lingkungan', 0),
('img', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80', 'Mengajar Anak', 'Program pendidikan desa', 1),
('video', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'Video Kegiatan', 'Dokumentasi keseruan KKN', 2),
('img', 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=600&q=80', 'Posyandu', 'Pemeriksaan kesehatan warga', 3),
('img', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80', 'Pelatihan UMKM', 'Digital marketing untuk warga', 4),
('video', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 'Video Penghijauan', 'Program lingkungan desa', 5),
('img', 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80', 'Rapat Koordinasi', 'Diskusi bersama perangkat desa', 6),
('img', 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=600&q=80', 'Penghijauan', 'Menanam pohon di area desa', 7),
('img', 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=600&q=80', 'Gotong Royong', 'Kebersamaan bersama warga', 8),
('img', 'https://images.unsplash.com/photo-1526976668912-1a811878dd37?auto=format&fit=crop&w=600&q=80', 'Kegiatan Desa', 'Bersama warga desa', 9)
ON CONFLICT DO NOTHING;

-- Partners (support)
INSERT INTO partners (partner_type, name, logo, sort_order) VALUES
('support', 'Universitas ABC', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/368px-Google_2015_logo.svg.png', 0),
('support', 'Pemda Setempat', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/440px-IBM_logo.svg.png', 1),
('support', 'Komunitas Desa', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/220px-YouTube_full-color_icon_%282017%29.svg.png', 2),
('sponsor', 'Sponsor Utama', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/603px-Amazon_logo.svg.png', 0),
('sponsor', 'Toko Bangunan Jaya', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/512px-Samsung_Logo.svg.png', 1),
('sponsor', 'Katering Bu Siti', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Logo_NIKE.svg/440px-Logo_NIKE.svg.png', 2),
('sponsor', 'CV Maju Jaya', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Spotify_logo_with_text.svg/512px-Spotify_logo_with_text.svg.png', 3)
ON CONFLICT DO NOTHING;
