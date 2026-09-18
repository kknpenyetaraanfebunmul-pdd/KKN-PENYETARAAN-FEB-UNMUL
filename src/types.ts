// Types matching the Supabase normalized schema

export interface HeroData {
  title: string;
  subtitle: string;
  buttonText: string;
  slides: { id: string; url: string }[];
}

export interface FooterData {
  copyright: string;
  madeWith: string;
}

export interface StrukturRow {
  id: string;
  jabatan: string;
  deskripsi: string;
  urutan: number;
}

export interface ProgramRow {
  id: string;
  key: string;
  icon: string;
  judul: string;
  subjudul: string;
  deskripsi_lengkap: string;
  kegiatan: string[];
  info: {
    sasaran: string;
    jadwal: string;
    lokasi: string;
    target: string;
  };
  urutan: number;
}

export interface GalleryRow {
  id: string;
  tipe: 'photo' | 'video';
  url: string;
  judul: string;
  deskripsi: string;
  urutan: number;
}

export interface ContactRow {
  id: string;
  platform: string;
  value: string;
  url: string;
  urutan: number;
}

export interface PartnerRow {
  id: string;
  grup: 'support' | 'sponsor';
  nama: string;
  logo_url: string;
  urutan: number;
}

export interface SiteData {
  hero: HeroData;
  footer: FooterData;
  struktur: StrukturRow[];
  programs: ProgramRow[];
  gallery: GalleryRow[];
  contacts: ContactRow[];
  supportBy: PartnerRow[];
  sponsorBy: PartnerRow[];
}
