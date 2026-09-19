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
    {
      id: 'st1',
      jabatan: 'Ketua',
      members: [{ name: 'Christoper Asben', nim: '', photo: '' }],
      urutan: 1,
    },
    {
      id: 'st2',
      jabatan: 'Sekretaris',
      members: [{ name: 'Siti Az Zahra Rahmadani', nim: '', photo: '' }],
      urutan: 2,
    },
    {
      id: 'st3',
      jabatan: 'Bendahara',
      members: [{ name: 'Muhammad Fahri Suryamuthar', nim: '', photo: '' }],
      urutan: 3,
    },
    {
      id: 'st4',
      jabatan: 'Humas',
      members: [
        { name: 'Muhammad Zaini Al Bukhari', nim: '', photo: '' },
        { name: 'Muhammad Fadillah', nim: '', photo: '' },
      ],
      urutan: 4,
    },
    {
      id: 'st5',
      jabatan: 'PDD',
      members: [
        { name: 'Awlia Nur Rahman', nim: '', photo: '' },
        { name: 'Eka Rahmawati', nim: '', photo: '' },
        { name: 'Khalifah Nurul Fadhilah', nim: '', photo: '' },
      ],
      urutan: 5,
    },
    {
      id: 'st6',
      jabatan: 'Perdek',
      members: [
        { name: 'Muhammad Rifadin', nim: '', photo: '' },
        { name: 'Purna Irawan', nim: '', photo: '' },
      ],
      urutan: 6,
    },
  ],
  programs: [
    {
      id: 'p1',
      key: 'pendidikan',
      icon: '📚',
      judul: 'Pendidikan',
      subjudul: 'Mengajar dan mendampingi belajar anak-anak desa.',
      deskripsi_lengkap:
        'Program pendidikan KKN Penyetaraan berfokus pada peningkatan kualitas pendidikan anak-anak di desa binaan. Kegiatan meliputi bimbingan belajar rutin, pelajaran tambahan untuk mata pelajaran inti, serta motivasi untuk melanjutkan pendidikan ke jenjang yang lebih tinggi. Kami percaya pendidikan adalah kunci utama untuk memutus rantai kemiskinan dan membuka peluang masa depan yang lebih baik.',
      kegiatan: [
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
      urutan: 1,
    },
    {
      id: 'p2',
      key: 'lingkungan',
      icon: '🌿',
      judul: 'Lingkungan',
      subjudul: 'Kerja bakti dan penghijauan lingkungan desa.',
      deskripsi_lengkap:
        'Program lingkungan bertujuan menjaga kebersihan dan kelestarian alam desa. Melalui kerja bakti rutin, penghijauan, dan edukasi pengelolaan sampah, kami mendorong kesadaran masyarakat akan pentingnya lingkungan yang bersih dan sehat untuk kualitas hidup yang lebih baik.',
      kegiatan: [
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
      urutan: 2,
    },
    {
      id: 'p3',
      key: 'teknologi',
      icon: '💻',
      judul: 'Teknologi',
      subjudul: 'Pelatihan digital marketing untuk UMKM.',
      deskripsi_lengkap:
        'Program teknologi memberdayakan UMKM desa dengan keterampilan digital. Pelatihan digital marketing, pembuatan konten promosi, dan penggunaan platform jualan online membantu pelaku usaha lokal menjangkau pasar yang lebih luas dan meningkatkan pendapatan.',
      kegiatan: [
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
      urutan: 3,
    },
    {
      id: 'p4',
      key: 'kesehatan',
      icon: '🏥',
      judul: 'Kesehatan',
      subjudul: 'Penyuluhan kesehatan dan posyandu.',
      deskripsi_lengkap:
        'Program kesehatan berfokus pada peningkatan derajat kesehatan masyarakat desa. Kegiatan meliputi penyuluhan kesehatan, pemeriksaan gratis, dan dukungan kegiatan posyandu. Kami bekerja sama dengan bidan desa dan puskesmas untuk memastikan layanan kesehatan yang tepat sasaran.',
      kegiatan: [
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
      urutan: 4,
    },
  ],
  gallery: [
    {
      id: 'g1',
      tipe: 'photo',
      url: 'https://images.pexels.com/photos/11580455/pexels-photo-11580455.jpeg?auto=compress&cs=tinysrgb&w=940',
      judul: 'Bimbingan Belajar',
      deskripsi: 'Mengajar anak-anak desa di balai desa setiap sore.',
      urutan: 1,
    },
    {
      id: 'g2',
      tipe: 'photo',
      url: 'https://images.pexels.com/photos/28662953/pexels-photo-28662953.jpeg?auto=compress&cs=tinysrgb&w=940',
      judul: 'Penghijauan Desa',
      deskripsi: 'Penanaman pohon bersama warga untuk lingkungan yang lebih hijau.',
      urutan: 2,
    },
    {
      id: 'g3',
      tipe: 'photo',
      url: 'https://images.pexels.com/photos/8475199/pexels-photo-8475199.jpeg?auto=compress&cs=tinysrgb&w=940',
      judul: 'Pelatihan UMKM',
      deskripsi: 'Mendampingi pedagang lokal memanfaatkan teknologi digital.',
      urutan: 3,
    },
    {
      id: 'g4',
      tipe: 'photo',
      url: 'https://images.pexels.com/photos/8248293/pexels-photo-8248293.jpeg?auto=compress&cs=tinysrgb&w=940',
      judul: 'Penyuluhan Kesehatan',
      deskripsi: 'Pemeriksaan kesehatan gratis untuk warga desa.',
      urutan: 4,
    },
    {
      id: 'g5',
      tipe: 'photo',
      url: 'https://images.pexels.com/photos/27471164/pexels-photo-27471164.jpeg?auto=compress&cs=tinysrgb&w=940',
      judul: 'Musyawarah Desa',
      deskripsi: 'Pertemuan warga untuk merencanakan program kerja KKN.',
      urutan: 5,
    },
    {
      id: 'g6',
      tipe: 'photo',
      url: 'https://images.pexels.com/photos/37472391/pexels-photo-37472391.jpeg?auto=compress&cs=tinysrgb&w=940',
      judul: 'Jelajah Desa',
      deskripsi: 'Mengenal lebih dekat kehidupan sosial masyarakat desa.',
      urutan: 6,
    },
  ],
  contacts: [
    {
      id: 'c1',
      platform: 'Instagram',
      value: '@kkn.penyetaraan',
      url: 'https://instagram.com',
      urutan: 1,
    },
    {
      id: 'c2',
      platform: 'TikTok',
      value: '@kknpenyetaraan',
      url: 'https://tiktok.com',
      urutan: 2,
    },
    {
      id: 'c3',
      platform: 'Email',
      value: 'kkn.penyetaraan@gmail.com',
      url: 'mailto:kkn.penyetaraan@gmail.com',
      urutan: 3,
    },
  ],
  supportBy: [
    { id: 'sp1', grup: 'support', nama: 'Universitas Negeri', logo_url: 'https://placehold.co/150x60/7b5ea7/ffffff?text=UNIV', urutan: 1 },
    { id: 'sp2', grup: 'support', nama: 'Kementerian Desa', logo_url: 'https://placehold.co/150x60/2b1c3d/ffffff?text=KEMDES', urutan: 2 },
    { id: 'sp3', grup: 'support', nama: 'Pemda Kabupaten', logo_url: 'https://placehold.co/150x60/7b5ea7/ffffff?text=PEMDA', urutan: 3 },
  ],
  sponsorBy: [
    { id: 'sb1', grup: 'sponsor', nama: 'Bank Desa', logo_url: 'https://placehold.co/150x60/2b1c3d/ffffff?text=BANK+DESA', urutan: 1 },
    { id: 'sb2', grup: 'sponsor', nama: 'Toko Sejahtera', logo_url: 'https://placehold.co/150x60/7b5ea7/ffffff?text=TOKO+SEJ', urutan: 2 },
    { id: 'sb3', grup: 'sponsor', nama: 'Koperasi Tani', logo_url: 'https://placehold.co/150x60/2b1c3d/ffffff?text=KOP+TANI', urutan: 3 },
  ],
  footer: {
    copyright: '© 2025 KKN Penyetaraan. All rights reserved.',
    madeWith: 'Dibuat dengan ♥ untuk desa',
  },
};