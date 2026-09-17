export interface HeroData {
  title1: string;
  title2: string;
  desc: string;
  backgroundImages: string[];
}

export interface StrukturItem {
  title: string;
  subtitle: string;
}

export interface ProgramItem {
  key: string;
  icon: string;
  title: string;
  desc: string;
  category: string;
  subtitle: string;
  description: string;
  activities: string[];
  info: { label: string; value: string }[];
}

export interface GalleryItem {
  type: 'img' | 'video';
  src: string;
  title: string;
  desc: string;
}

export interface ContactData {
  instagram: string;
  instagramUrl: string;
  tiktok: string;
  tiktokUrl: string;
  email: string;
}

export interface PartnerItem {
  name: string;
  logo: string;
}

export interface PartnersData {
  support: PartnerItem[];
  sponsor: PartnerItem[];
}

export interface SiteData {
  hero: HeroData;
  struktur: StrukturItem[];
  program: ProgramItem[];
  gallery: GalleryItem[];
  contact: ContactData;
  partners: PartnersData;
}