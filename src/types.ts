export interface HeroData {
  line1: string;
  line2: string;
  description: string;
  slideshow: string[];
}

export interface StrukturItem {
  id: string;
  jabatan: string;
  deskripsi: string;
}

export interface ProgramItem {
  id: string;
  icon: string;
  title: string;
  shortDesc: string;
  category: string;
  subtitle: string;
  description: string;
  activities: string;
  info: string;
}

export interface GalleryItem {
  id: string;
  type: 'img' | 'video';
  src: string;
  title: string;
  desc: string;
}

export interface ContactData {
  instagramUsername: string;
  instagramUrl: string;
  tiktokUsername: string;
  tiktokUrl: string;
  email: string;
}

export interface PartnerItem {
  id: string;
  name: string;
  logo: string;
}

export interface SiteData {
  hero: HeroData;
  struktur: StrukturItem[];
  program: ProgramItem[];
  gallery: GalleryItem[];
  contact: ContactData;
  partners: {
    support: PartnerItem[];
    sponsor: PartnerItem[];
  };
}
