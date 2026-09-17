import type { SiteData } from './types';

export const DEFAULT_DATA: SiteData = {
  hero: {
    line1: 'KKN',
    line2: 'PENYETARAAN',
    description:
      'Membangun desa, mengabdi untuk negeri. Program Kuliah Kerja Nyata Penyetaraan.',
    slideshow: [
      'https://images.unsplash.com/photo-1594708767771-a78216a1c4b8?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1600&q=80',
    ],
  },
  struktur: [
    { id: 's1', jabatan: 'Ketua', deskripsi: 'Koordinator' },
    { id: 's2', jabatan: 'Sekretaris', deskripsi: 'Administrasi' },
    { id: 's3', jabatan: 'Bendahara', deskripsi: 'Keuangan' },
    { id: 's4', jabatan: 'Humas', deskripsi: 'Hubungan Masyarakat' },
    { id: 's5', jabatan: 'PDD', deskripsi: 'Publikasi & Dokumentasi' },
    { id: 's6', jabatan: 'Perdek', deskripsi: 'Perlengkapan & Dekorasi' },
  ],
  program: [
    {
      id: 'pendidikan',
      icon: '\u{1F4DA}',
      title: 'Pendidikan',
      shortDesc: 'Mengajar dan mendampingi belajar anak-anak desa.',
      category: 'Bidang Pendidikan',
      subtitle: 'Mengajar dan mendampingi belajar anak-anak desa.',
      description:
        'Program pendidikan dirancang untuk meningkatkan kualitas belajar anak-anak desa melalui pendampingan intensif, bimbingan belajar, dan kegiatan kreatif yang menyenangkan.',
      activities:
        'Bimbingan belajar rutin 3x seminggu\nLes tambahan Matematika & Bahasa Inggris\nPojok baca & perpustakaan mini desa\nLomba mewarnai & cerdas cermat\nPelatihan komputer dasar untuk anak',
      info: 'Sasaran|Anak SD & SMP\nJadwal|Senin, Rabu, Jumat\nLokasi|Balai Desa\nPeserta|45+ anak',
    },
    {
      id: 'lingkungan',
      icon: '\u{1F33F}',
      title: 'Lingkungan',
      shortDesc: 'Kerja bakti dan penghijauan lingkungan desa.',
      category: 'Bidang Lingkungan',
      subtitle: 'Kerja bakti dan penghijauan lingkungan desa.',
      description:
        'Program lingkungan berfokus pada kebersihan dan penghijauan desa melalui kerja bakti rutin, penanaman pohon, serta edukasi pengelolaan sampah yang berkelanjutan.',
      activities:
        'Kerja bakti massal setiap minggu\nPenanaman 100+ pohon di area desa\nPembuatan tempat sampah organik & anorganik\nSosialisasi bank sampah warga\nPembuatan pupuk kompos dari sampah organik',
      info: 'Sasaran|Seluruh warga desa\nJadwal|Setiap Minggu pagi\nLokasi|Area desa\nTarget|100+ pohon',
    },
    {
      id: 'teknologi',
      icon: '\u{1F4BB}',
      title: 'Teknologi',
      shortDesc: 'Pelatihan digital marketing untuk UMKM.',
      category: 'Bidang Teknologi',
      subtitle: 'Pelatihan digital marketing untuk UMKM.',
      description:
        'Program teknologi dirancang untuk membantu UMKM desa beradaptasi dengan era digital melalui pelatihan pemasaran online, foto produk, dan pengelolaan media sosial.',
      activities:
        'Pelatihan foto produk dengan HP\nWorkshop jualan online via Shopee & Tokopedia\nPembuatan akun Instagram bisnis UMKM\nPelatihan copywriting untuk promosi\nPendampingan pembuatan logo & branding',
      info: 'Sasaran|Pelaku UMKM desa\nJadwal|Selasa & Kamis\nLokasi|Aula Desa\nPeserta|20+ UMKM',
    },
    {
      id: 'kesehatan',
      icon: '\u{1F3E5}',
      title: 'Kesehatan',
      shortDesc: 'Penyuluhan kesehatan dan posyandu.',
      category: 'Bidang Kesehatan',
      subtitle: 'Penyuluhan kesehatan dan posyandu.',
      description:
        'Program kesehatan berfokus pada peningkatan kesadaran hidup sehat warga melalui penyuluhan, pemeriksaan gratis, dan pendampingan posyandu balita & lansia.',
      activities:
        'Pemeriksaan kesehatan gratis untuk warga\nPenyuluhan gizi untuk ibu hamil & balita\nBantuan posyandu balita & lansia\nSosialisasi PHBS (Perilaku Hidup Bersih Sehat)\nSenam sehat bersama setiap minggu',
      info: 'Sasaran|Balita, ibu hamil, lansia\nJadwal|Rabu & Sabtu\nLokasi|Posyandu Desa\nLayanan|Gratis',
    },
  ],
  gallery: [
    { id: 'g1', type: 'img', src: 'https://images.unsplash.com/photo-1594708767771-a78216a1c4b8?auto=format&fit=crop&w=800&q=80', title: 'Kerja Bakti Desa', desc: 'Bersama warga membersihkan lingkungan' },
    { id: 'g2', type: 'img', src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80', title: 'Mengajar Anak', desc: 'Program pendidikan desa' },
    { id: 'g3', type: 'video', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', title: 'Video Kegiatan', desc: 'Dokumentasi keseruan KKN' },
    { id: 'g4', type: 'img', src: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=600&q=80', title: 'Posyandu', desc: 'Pemeriksaan kesehatan warga' },
    { id: 'g5', type: 'img', src: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80', title: 'Pelatihan UMKM', desc: 'Digital marketing untuk warga' },
    { id: 'g6', type: 'video', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', title: 'Video Penghijauan', desc: 'Program lingkungan desa' },
    { id: 'g7', type: 'img', src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80', title: 'Rapat Koordinasi', desc: 'Diskusi bersama perangkat desa' },
    { id: 'g8', type: 'img', src: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=600&q=80', title: 'Penghijauan', desc: 'Menanam pohon di area desa' },
    { id: 'g9', type: 'img', src: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=600&q=80', title: 'Gotong Royong', desc: 'Kebersamaan bersama warga' },
    { id: 'g10', type: 'img', src: 'https://images.unsplash.com/photo-1526976668912-1a811878dd37?auto=format&fit=crop&w=600&q=80', title: 'Kegiatan Desa', desc: 'Bersama warga desa' },
  ],
  contact: {
    instagramUsername: '@kkn.penyetaraan',
    instagramUrl: 'https://instagram.com/kkn.penyetaraan',
    tiktokUsername: '@kkn.penyetaraan',
    tiktokUrl: 'https://tiktok.com/@kkn.penyetaraan',
    email: 'kkn.penyetaraan@email.com',
  },
  partners: {
    support: [
      { id: 'p1', name: 'Universitas ABC', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/368px-Google_2015_logo.svg.png' },
      { id: 'p2', name: 'Pemda Setempat', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/440px-IBM_logo.svg.png' },
      { id: 'p3', name: 'Komunitas Desa', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/220px-YouTube_full-color_icon_%282017%29.svg.png' },
    ],
    sponsor: [
      { id: 'p4', name: 'Sponsor Utama', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/603px-Amazon_logo.svg.png' },
      { id: 'p5', name: 'Toko Bangunan Jaya', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/512px-Samsung_Logo.svg.png' },
      { id: 'p6', name: 'Katering Bu Siti', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Logo_NIKE.svg/440px-Logo_NIKE.svg.png' },
      { id: 'p7', name: 'CV Maju Jaya', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Spotify_logo_with_text.svg/512px-Spotify_logo_with_text.svg.png' },
    ],
  },
};
