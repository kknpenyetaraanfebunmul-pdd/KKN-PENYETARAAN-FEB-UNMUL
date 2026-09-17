import type { SiteData } from './types';

export const STORAGE_KEY = 'kkn_site_data_v1';
export const ADMIN_PASSCODE = '110106';

export const DEFAULT_DATA: SiteData = {
  hero: {
    title1: 'KKN',
    title2: 'PENYETARAAN',
    desc: 'Membangun desa, mengabdi untuk negeri. Program Kuliah Kerja Nyata Penyetaraan.',
    backgroundImages: [
      'https://images.unsplash.com/photo-1594708767771-a78216a1c4b8?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1600&q=80',
    ],
  },
  struktur: [
    { title: 'Ketua', subtitle: 'Koordinator' },
    { title: 'Sekretaris', subtitle: 'Administrasi' },
    { title: 'Bendahara', subtitle: 'Keuangan' },
    { title: 'Humas', subtitle: 'Hubungan Masyarakat' },
    { title: 'PDD', subtitle: 'Publikasi & Dokumentasi' },
    { title: 'Perdek', subtitle: 'Perlengkapan & Dekorasi' },
  ],
  program: [
    {
      key: 'pendidikan',
      icon: '📚',
      title: 'Pendidikan',
      desc: 'Mengajar dan mendampingi belajar anak-anak desa.',
      category: 'Bidang Pendidikan',
      subtitle: 'Mengajar dan mendampingi belajar anak-anak desa.',
      description:
        'Program pendidikan dirancang untuk meningkatkan kualitas belajar anak-anak desa melalui pendampingan intensif.',
      activities: [
        'Bimbingan belajar rutin 3x seminggu',
        'Les tambahan Matematika & Bahasa Inggris',
        'Pojok baca & perpustakaan mini desa',
      ],
      info: [
        { label: 'Sasaran', value: 'Anak SD & SMP' },
        { label: 'Jadwal', value: 'Senin, Rabu, Jumat' },
        { label: 'Lokasi', value: 'Balai Desa' },
        { label: 'Peserta', value: '45+ anak' },
      ],
    },
    {
      key: 'lingkungan',
      icon: '🌿',
      title: 'Lingkungan',
      desc: 'Kerja bakti dan penghijauan lingkungan desa.',
      category: 'Bidang Lingkungan',
      subtitle: 'Kerja bakti dan penghijauan lingkungan desa.',
      description: 'Program lingkungan berfokus pada kebersihan dan penghijauan desa.',
      activities: ['Kerja bakti massal setiap minggu', 'Penanaman 100+ pohon', 'Sosialisasi bank sampah'],
      info: [
        { label: 'Sasaran', value: 'Seluruh warga' },
        { label: 'Jadwal', value: 'Setiap Minggu' },
        { label: 'Lokasi', value: 'Area desa' },
        { label: 'Target', value: '100+ pohon' },
      ],
    },
    {
      key: 'teknologi',
      icon: '💻',
      title: 'Teknologi',
      desc: 'Pelatihan digital marketing untuk UMKM.',
      category: 'Bidang Teknologi',
      subtitle: 'Pelatihan digital marketing untuk UMKM.',
      description: 'Program teknologi untuk membantu UMKM desa beradaptasi dengan era digital.',
      activities: ['Pelatihan foto produk', 'Workshop jualan online', 'Pembuatan Instagram bisnis'],
      info: [
        { label: 'Sasaran', value: 'Pelaku UMKM' },
        { label: 'Jadwal', value: 'Selasa & Kamis' },
        { label: 'Lokasi', value: 'Aula Desa' },
        { label: 'Peserta', value: '20+ UMKM' },
      ],
    },
    {
      key: 'kesehatan',
      icon: '🏥',
      title: 'Kesehatan',
      desc: 'Penyuluhan kesehatan dan posyandu.',
      category: 'Bidang Kesehatan',
      subtitle: 'Penyuluhan kesehatan dan posyandu.',
      description: 'Program kesehatan berfokus pada peningkatan kesadaran hidup sehat warga.',
      activities: ['Pemeriksaan kesehatan gratis', 'Penyuluhan gizi', 'Senam sehat bersama'],
      info: [
        { label: 'Sasaran', value: 'Balita & lansia' },
        { label: 'Jadwal', value: 'Rabu & Sabtu' },
        { label: 'Lokasi', value: 'Posyandu Desa' },
        { label: 'Layanan', value: 'Gratis' },
      ],
    },
  ],
  gallery: [
    {
      type: 'img',
      src: 'https://images.unsplash.com/photo-1594708767771-a78216a1c4b8?auto=format&fit=crop&w=800&q=80',
      title: 'Kerja Bakti Desa',
      desc: 'Bersama warga membersihkan lingkungan',
    },
    {
      type: 'img',
      src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80',
      title: 'Mengajar Anak',
      desc: 'Program pendidikan desa',
    },
    {
      type: 'video',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      title: 'Video Kegiatan',
      desc: 'Dokumentasi keseruan KKN',
    },
    {
      type: 'img',
      src: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=600&q=80',
      title: 'Posyandu',
      desc: 'Pemeriksaan kesehatan warga',
    },
    {
      type: 'img',
      src: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80',
      title: 'Pelatihan UMKM',
      desc: 'Digital marketing untuk warga',
    },
    {
      type: 'video',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      title: 'Video Penghijauan',
      desc: 'Program lingkungan desa',
    },
    {
      type: 'img',
      src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
      title: 'Rapat Koordinasi',
      desc: 'Diskusi bersama perangkat desa',
    },
    {
      type: 'img',
      src: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=600&q=80',
      title: 'Penghijauan',
      desc: 'Menanam pohon di area desa',
    },
    {
      type: 'img',
      src: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=600&q=80',
      title: 'Gotong Royong',
      desc: 'Kebersamaan bersama warga',
    },
    {
      type: 'img',
      src: 'https://images.unsplash.com/photo-1526976668912-1a811878dd37?auto=format&fit=crop&w=600&q=80',
      title: 'Kegiatan Desa',
      desc: 'Bersama warga desa',
    },
  ],
  contact: {
    instagram: '@kkn.penyetaraan',
    instagramUrl: 'https://instagram.com/usernamekkn',
    tiktok: '@kkn.penyetaraan',
    tiktokUrl: 'https://tiktok.com/@usernamekkn',
    email: 'kkn.penyetaraan@email.com',
  },
  partners: {
    support: [
      { name: 'Universitas ABC', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/368px-Google_2015_logo.svg.png' },
      { name: 'Pemda Setempat', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/440px-IBM_logo.svg.png' },
    ],
    sponsor: [
      { name: 'Sponsor Utama', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/603px-Amazon_logo.svg.png' },
      { name: 'Toko Bangunan Jaya', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/512px-Samsung_Logo.svg.png' },
    ],
  },
};