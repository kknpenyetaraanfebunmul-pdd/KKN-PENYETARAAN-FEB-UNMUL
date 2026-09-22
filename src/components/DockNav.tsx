import { Home, Users, Briefcase, Images, Mail, Sun, Moon } from 'lucide-react';
import { useTheme } from '../ThemeContext';

const dockItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'struktur', label: 'Struktur', icon: Users },
  { id: 'program', label: 'Program', icon: Briefcase },
  { id: 'gallery', label: 'Gallery', icon: Images },
  { id: 'contact', label: 'Contact', icon: Mail },
];

interface DockNavProps {
  activeSection: string;
  visible: boolean;
}

export default function DockNav({ activeSection, visible }: DockNavProps) {
  const { isDark, toggleTheme } = useTheme();

  const handleNav = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* MOBILE: Dock di bawah */}
      <div
        className={`lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 ${
          visible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-20 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-1 bg-dark-purple/90 dark:bg-dark-card/95 backdrop-blur-xl rounded-full px-3 py-2 shadow-2xl border border-white/10 dark:border-dark-border">
          {dockItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-12 h-12 bg-primary-purple text-white'
                    : 'w-10 h-10 text-white/60 hover:text-white hover:bg-white/10'
                }`}
                aria-label={item.label}
              >
                <Icon size={isActive ? 22 : 18} />
                {isActive && (
                  <span className="absolute -top-9 bg-dark-purple text-white text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap shadow-lg">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}

          {/* Divider */}
          <div className="w-px h-8 bg-white/15 mx-1" />

          {/* Toggle Theme */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-10 h-10 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      {/* DESKTOP: Dock di kanan, vertikal */}
      <div
        className={`hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 transition-all duration-500 ${
          visible
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 translate-x-24 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center gap-2 bg-dark-purple/90 dark:bg-dark-card/95 backdrop-blur-xl rounded-3xl px-3 py-4 shadow-2xl border border-white/10 dark:border-dark-border">
          {dockItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`group relative flex items-center justify-center rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'w-16 h-16 bg-primary-purple text-white shadow-lg shadow-primary-purple/40'
                    : 'w-14 h-14 text-white/60 hover:text-white hover:bg-white/10'
                }`}
                aria-label={item.label}
              >
                <Icon size={isActive ? 28 : 22} />
                <span className="absolute right-full mr-4 bg-dark-purple text-white text-sm font-semibold px-4 py-2 rounded-xl whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* Divider */}
          <div className="w-8 h-px bg-white/15 my-1" />

          {/* Toggle Theme */}
          <button
            onClick={toggleTheme}
            className="group relative flex items-center justify-center w-14 h-14 rounded-2xl text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={22} /> : <Moon size={22} />}
            <span className="absolute right-full mr-4 bg-dark-purple text-white text-sm font-semibold px-4 py-2 rounded-xl whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
              {isDark ? 'Mode Terang' : 'Mode Gelap'}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}