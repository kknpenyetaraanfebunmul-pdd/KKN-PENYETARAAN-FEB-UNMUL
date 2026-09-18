import type { SiteContent } from './types';

export const defaultContent: SiteContent = {
  hero: {
    title: 'KKN PENYETARAAN',
    subtitle:
      'Membangun desa, mengabdi untuk negeri. Program Kuliah Kerja Nyata Penyetaraan.',
    buttonText: 'View KKN',
    slides: [
      {
        id: 's1',
        url: 'https://images.pexels.com/photos/15830193/pexels-photo-15830193.jpeg?auto=compress&cs=tinysrgb&w=1920',
      },
      {
        id: 's2',
        url: 'https://images.pexels.com/photos/9203969/pexels-photo-9203969.jpeg?auto=compress&cs=tinysrgb&w=1920',
      },
      {
        id: 's3',
        url: 'https://images.pexels.com/photos/5232267/pexels-photo-5232267.jpeg?auto=compress&cs=tinysrgb&w=1920',
      },
    ],
  },
  struktur: [
    { id: 'st1', role: 'Ketua', description: 'Koordinator' },
    { id: 'st2', role: 'Sekretaris', description: 'Administrasi' },
    { id: 'st3', role: 'Bendahara', description: 'Keuangan' },
    { id: 'st4', role: 'Humas', description: 'Hubungan Masyarakat' },
    { id: 'st5', role: 'PDD', description: 'Publikasi & Dokumentasi' },
    { id: 'st6', role: 'Perdek', description: 'Perlengkapan & Dekorasi' },
  ],
  programs: [
    {
      id: 'p1',
      icon: '📚',
      title: 'Pendidikan',
      shortDesc: 'Mengajar dan mendampingi belajar anak-anak desa.',
      fullDesc:
        'Program pendidikan KKN Penyetaraan berfokus pada peningkatan kualitas pendidikan anak-anak di desa binaan. Kegiatan meliputi bimbingan belajar rutin, pelajaran tambahan untuk mata pelajaran inti, serta motivasi untuk melanjutkan pendidikan ke jenjang yang lebih tinggi. Kami percaya pendidikan adalah kunci utama untuk memutus rantai kemiskinan dan membuka peluang masa depan yang lebih baik.',
      activities: [
        'Bimbingan belajar rutin setiap sore di balai desa',
        'Les privat mata pelajaran Matematika, Bahasa Inggris, dan IPA',
        'Pelatihan membaca dan menulis untuk anak SD kelas rendah',
        'Workshop motivasi belajar dan cita-cita',
        'Donasi buku pelajaran dan alat tulis untuk siswa kurang mampu',
        'Penyelenggaraan lomba cerdas cermat antar RT',
      ],
      info: {
        sasaran: 'Anak-anak SD dan SMP desa binaan',
        jadwal: 'Setiap hari Senin–Jumat, pukul 15.00–17.00 WIB',
        lokasi: 'Balai Desa dan TK setempat',
        target: '80–100 siswa per bulan',
      },
    },
    {
      id: 'p2',
      icon: '🌿',
      title: 'Lingkungan',
      shortDesc: 'Kerja bakti dan penghijauan lingkungan desa.',
      fullDesc:
        'Program lingkungan bertujuan menjaga kebersihan dan kelestarian alam desa. Melalui kerja bakti rutin, penghijauan, dan edukasi pengelolaan sampah, kami mendorong kesadaran masyarakat akan pentingnya lingkungan yang bersih dan sehat untuk kualitas hidup yang lebih baik.',
      activities: [
        'Kerja bakti membersihkan selokan dan area umum desa',
        'Penanaman 200 pohon di lahan kritis dan pinggir jalan',
        'Sosialisasi pemilahan sampah organik dan anorganik',
        'Pembuatan komposter dari sampah organik rumah tangga',
        'Penyediaan tempat sampah terpilah di titik strategis desa',
        'Kampanye "Desa Bersih" melalui poster dan pengumuman',
      ],
      info: {
        sasaran: 'Seluruh warga desa binaan',
        jadwal: 'Setiap Sabtu pagi, pukul 07.00–10.00 WIB',
        lokasi: 'Area umum desa, lapangan, dan lahan kosong',
        target: 'Kerja bakti rutin dengan 100+ warga per kegiatan',
      },
    },
    {
      id: 'p3',
      icon: '💻',
      title: 'Teknologi',
      shortDesc: 'Pelatihan digital marketing untuk UMKM.',
      fullDesc:
        'Program teknologi memberdayakan UMKM desa dengan keterampilan digital. Pelatihan digital marketing, pembuatan konten promosi, dan penggunaan platform jualan online membantu pelaku usaha lokal menjangkau pasar yang lebih luas dan meningkatkan pendapatan.',
      activities: [
        'Pelatihan pembuatan akun dan toko di marketplace',
        'Workshop fotografi produk menggunakan kamera ponsel',
        'Pelatihan copywriting untuk deskripsi produk yang menarik',
        'Pendampingan pembuatan konten Instagram dan TikTok',
        'Sosialisasi penggunaan aplikasi pembayaran digital',
        'Konsultasi one-on-one strategi pemasaran online',
      ],
      info: {
        sasaran: 'Pelaku UMKM desa binaan',
        jadwal: 'Setiap Selasa dan Kamis, pukul 13.00–16.00 WIB',
        lokasi: 'Balai Desa dan kunjungan langsung ke lokasi usaha',
        target: '25–30 UMKM dibina selama periode KKN',
      },
    },
    {
      id: 'p4',
      icon: '🏥',
      title: 'Kesehatan',
      shortDesc: 'Penyuluhan kesehatan dan posyandu.',
      fullDesc:
        'Program kesehatan berfokus pada peningkatan derajat kesehatan masyarakat desa. Kegiatan meliputi penyuluhan kesehatan, pemeriksaan gratis, dan dukungan kegiatan posyandu. Kami bekerja sama dengan bidan desa dan puskesmas untuk memastikan layanan kesehatan yang tepat sasaran.',
      activities: [
        'Penyuluhan gizi seimbang untuk ibu-ibu PKK',
        'Pemeriksaan tekanan darah dan gula darah gratis',
        'Pendampingan kegiatan posyandu balita setiap bulan',
        'Edukasi PHBS (Perilaku Hidup Bersih dan Sehat)',
        'Kampanye pentingnya imunisasi lengkap untuk balita',
        'Senam bersama warga setiap Minggu pagi',
      ],
      info: {
        sasaran: 'Ibu-ibu PKK, balita, dan lansia desa',
        jadwal: 'Setiap Rabu, pukul 09.00–12.00 WIB',
        lokasi: 'Posyandu desa dan balai PKK',
        target: '60–80 warga per kegiatan penyuluhan',
      },
    },
  ],
  gallery: [
    {
      id: 'g1',
      type: 'photo',
      url: 'https://images.pexels.com/photos/11580455/pexels-photo-11580455.jpeg?auto=compress&cs=tinysrgb&w=940',
      title: 'Bimbingan Belajar',
      caption: 'Mengajar anak-anak desa di balai desa setiap sore.',
    },
    {
      id: 'g2',
      type: 'photo',
      url: 'https://images.pexels.com/photos/28662953/pexels-photo-28662953.jpeg?auto=compress&cs=tinysrgb&w=940',
      title: 'Penghijauan Desa',
      caption: 'Penanaman pohon bersama warga untuk lingkungan yang lebih hijau.',
    },
    {
      id: 'g3',
      type: 'photo',
      url: 'https://images.pexels.com/photos/8475199/pexels-photo-8475199.jpeg?auto=compress&cs=tinysrgb&w=940',
      title: 'Pelatihan UMKM',
      caption: 'Mendampingi pedagang lokal memanfaatkan teknologi digital.',
    },
    {
      id: 'g4',
      type: 'photo',
      url: 'https://images.pexels.com/photos/8248293/pexels-photo-8248293.jpeg?auto=compress&cs=tinysrgb&w=940',
      title: 'Penyuluhan Kesehatan',
      caption: 'Pemeriksaan kesehatan gratis untuk warga desa.',
    },
    {
      id: 'g5',
      type: 'photo',
      url: 'https://images.pexels.com/photos/27471164/pexels-photo-27471164.jpeg?auto=compress&cs=tinysrgb&w=940',
      title: 'Musyawarah Desa',
      caption: 'Pertemuan warga untuk merencanakan program kerja KKN.',
    },
    {
      id: 'g6',
      type: 'photo',
      url: 'https://images.pexels.com/photos/37472391/pexels-photo-37472391.jpeg?auto=compress&cs=tinysrgb&w=940',
      title: 'Jelajah Desa',
      caption: 'Mengenal lebih dekat kehidupan sosial masyarakat desa.',
    },
  ],
  contacts: [
    {
      id: 'c1',
      platform: 'Instagram',
      value: '@kkn.penyetaraan',
      url: 'https://instagram.com',
    },
    {
      id: 'c2',
      platform: 'TikTok',
      value: '@kknpenyetaraan',
      url: 'https://tiktok.com',
    },
    {
      id: 'c3',
      platform: 'Email',
      value: 'kkn.penyetaraan@gmail.com',
      url: 'mailto:kkn.penyetaraan@gmail.com',
    },
  ],
  supportBy: [
    { id: 'sp1', name: 'Universitas Negeri', logo: 'https://placehold.co/150x60/7b5ea7/ffffff?text=UNIV' },
    { id: 'sp2', name: 'Kementerian Desa', logo: 'https://placehold.co/150x60/2b1c3d/ffffff?text=KEMDES' },
    { id: 'sp3', name: 'Pemda Kabupaten', logo: 'https://placehold.co/150x60/7b5ea7/ffffff?text=PEMDA' },
  ],
  sponsorBy: [
    { id: 'sb1', name: 'Bank Desa', logo: 'https://placehold.co/150x60/2b1c3d/ffffff?text=BANK+DESA' },
    { id: 'sb2', name: 'Toko Sejahtera', logo: 'https://placehold.co/150x60/7b5ea7/ffffff?text=TOKO+SEJ' },
    { id: 'sb3', name: 'Koperasi Tani', logo: 'https://placehold.co/150x60/2b1c3d/ffffff?text=KOP+TANI' },
  ],
  footer: {
    copyright: '© 2025 KKN Penyetaraan. All rights reserved.',
    madeWith: 'Dibuat dengan ♥ untuk desa',
  },
};
