import { useState } from 'react';
import {
  LayoutDashboard,
  Image as ImageIcon,
  Users,
  Briefcase,
  GalleryHorizontal,
  Mail,
  Handshake,
  PanelBottom as FooterIcon,
  LogOut,
  ArrowLeft,
  Save,
  RotateCcw,
} from 'lucide-react';
import type { SiteContent } from '../../types';
import { deepClone, generateId } from '../../useContent';
import HeroEditor from './editors/HeroEditor';
import StrukturEditor from './editors/StrukturEditor';
import ProgramEditor from './editors/ProgramEditor';
import GalleryEditor from './editors/GalleryEditor';
import ContactEditor from './editors/ContactEditor';
import PartnerEditor from './editors/PartnerEditor';
import FooterEditor from './editors/FooterEditor';

type Section =
  | 'hero'
  | 'struktur'
  | 'program'
  | 'gallery'
  | 'contact'
  | 'partners'
  | 'footer';

const menuItems: { id: Section; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'hero', label: 'Hero', icon: ImageIcon },
  { id: 'struktur', label: 'Struktur KKN', icon: Users },
  { id: 'program', label: 'Program Kerja', icon: Briefcase },
  { id: 'gallery', label: 'Gallery', icon: GalleryHorizontal },
  { id: 'contact', label: 'Contact', icon: Mail },
  { id: 'partners', label: 'Partners', icon: Handshake },
  { id: 'footer', label: 'Footer', icon: FooterIcon },
];

interface AdminDashboardProps {
  content: SiteContent;
  updateContent: (updater: (prev: SiteContent) => SiteContent) => void;
  resetContent: () => void;
  onExit: () => void;
  onLogout: () => void;
}

export default function AdminDashboard({
  content,
  updateContent,
  resetContent,
  onExit,
  onLogout,
}: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState<Section>('hero');
  const [draft, setDraft] = useState<SiteContent>(() => deepClone(content));
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateContent(() => deepClone(draft));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleResetSection = () => {
    const sectionMap: Record<Section, keyof SiteContent> = {
      hero: 'hero',
      struktur: 'struktur',
      program: 'programs',
      gallery: 'gallery',
      contact: 'contacts',
      partners: 'supportBy',
      footer: 'footer',
    };
    const key = sectionMap[activeSection];
    setDraft((prev) => ({ ...prev, [key]: deepClone(content[key]) }));
  };

  const handleResetAll = () => {
    if (window.confirm('Reset semua konten ke default? Tindakan ini tidak dapat dibatalkan.')) {
      resetContent();
      onExit();
    }
  };

  const updateDraft = (updater: (prev: SiteContent) => SiteContent) => {
    setDraft(updater);
  };

  const renderEditor = () => {
    switch (activeSection) {
      case 'hero':
        return <HeroEditor draft={draft} updateDraft={updateDraft} />;
      case 'struktur':
        return <StrukturEditor draft={draft} updateDraft={updateDraft} />;
      case 'program':
        return <ProgramEditor draft={draft} updateDraft={updateDraft} />;
      case 'gallery':
        return <GalleryEditor draft={draft} updateDraft={updateDraft} />;
      case 'contact':
        return <ContactEditor draft={draft} updateDraft={updateDraft} />;
      case 'partners':
        return <PartnerEditor draft={draft} updateDraft={updateDraft} />;
      case 'footer':
        return <FooterEditor draft={draft} updateDraft={updateDraft} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-dark-purple flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="lg:w-64 bg-dark-purple border-r border-white/10 flex lg:flex-col flex-row items-center lg:items-stretch px-3 lg:px-4 py-3 lg:py-6 gap-2 overflow-x-auto lg:overflow-x-visible flex-shrink-0">
        <div className="hidden lg:flex items-center gap-2 mb-6 px-2">
          <LayoutDashboard size={24} className="text-primary-purple" />
          <span className="text-white font-bold text-lg">Admin Panel</span>
        </div>

        <nav className="flex lg:flex-col flex-row gap-1 lg:gap-2 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-3 px-3 lg:px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-primary-purple text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={18} className="flex-shrink-0" />
                <span className="hidden lg:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="hidden lg:block mt-auto pt-4 border-t border-white/10 space-y-2">
          <button
            onClick={onExit}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            <ArrowLeft size={18} />
            Kembali ke Website
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile top actions */}
      <div className="lg:hidden flex items-center justify-end gap-2 px-4 py-2 bg-dark-purple border-b border-white/10">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all"
        >
          <ArrowLeft size={16} />
          Website
        </button>
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 text-red-400 hover:text-red-300 text-sm px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-all"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      {/* Main content */}
      <main className="flex-1 bg-bg overflow-y-auto">
        <div className="max-w-3xl mx-auto p-5 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold text-dark-purple capitalize">
              {menuItems.find((m) => m.id === activeSection)?.label}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetSection}
                className="flex items-center gap-1.5 text-sm text-dark-purple/60 hover:text-dark-purple px-3 py-2 rounded-lg hover:bg-card-bg transition-all"
              >
                <RotateCcw size={16} />
                <span className="hidden sm:inline">Reset Section</span>
              </button>
              <button
                onClick={handleSave}
                className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-all ${
                  saved
                    ? 'bg-green-500 text-white'
                    : 'bg-primary-purple text-white hover:bg-primary-purple/90'
                }`}
              >
                <Save size={16} />
                {saved ? 'Tersimpan!' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>

          {renderEditor()}

          <div className="mt-12 pt-6 border-t border-dark-purple/10">
            <button
              onClick={handleResetAll}
              className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium"
            >
              <RotateCcw size={16} />
              Reset semua konten ke default
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

