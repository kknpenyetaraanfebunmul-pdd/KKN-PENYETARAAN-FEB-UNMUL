import type { SiteContent } from '../types';
import { Users, FileText, Wallet, Megaphone, Camera, Package } from 'lucide-react';

const iconMap: Record<string, typeof Users> = {
  Ketua: Users,
  Sekretaris: FileText,
  Bendahara: Wallet,
  Humas: Megaphone,
  PDD: Camera,
  Perdek: Package,
};

interface StrukturProps {
  content: SiteContent['struktur'];
}

export default function Struktur({ content }: StrukturProps) {
  return (
    <section id="struktur" className="py-20 sm:py-28 px-5 sm:px-8 relative bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <p className="text-primary-purple font-semibold text-sm tracking-widest uppercase mb-3">
            Tim Kami
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-dark-purple mb-4">
            Struktur KKN
          </h2>
          <div className="w-20 h-1.5 bg-primary-purple rounded-full mx-auto" />
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {content.map((item, idx) => {
            // PERBAIKAN 1: Gunakan item.jabatan
            const Icon = iconMap[item.jabatan] || Users;
            return (
              <div
                key={item.id}
                className="group relative bg-white rounded-3xl p-8 text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-bubble-light overflow-hidden flex flex-col h-full"
                style={{
                  animation: `fadeIn 0.5s ease ${idx * 0.1}s both`,
                }}
              >
                {/* Efek Background saat Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-purple/0 to-primary-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10 flex flex-col items-center flex-grow">
                  {/* Avatar / Icon Container */}
                  <div className="w-24 h-24 rounded-full bg-primary-purple/10 mb-5 flex items-center justify-center ring-4 ring-white shadow-sm transition-all duration-300 group-hover:bg-primary-purple group-hover:scale-110 group-hover:ring-primary-purple/20">
                    <Icon size={36} className="text-primary-purple transition-colors duration-300 group-hover:text-white" />
                  </div>

                  {/* Teks Jabatan */}
                  <h3 className="text-xl font-bold text-dark-purple mb-4">
                    {/* PERBAIKAN 2: Gunakan item.jabatan */}
                    {item.jabatan}
                  </h3>
                  
                  {/* DAFTAR NAMA (PERBAIKAN 3: Menggunakan item.members) */}
                  <ul className="space-y-1.5 flex-grow">
                    {(item.members || []).map((member, i) => (
                      <li 
                        key={i} 
                        className="text-sm text-dark-purple/70 font-medium leading-relaxed"
                      >
                        {member}
                      </li>
                    ))}
                  </ul>

                  {/* Garis Aksen Kecil di Bawah */}
                  <div className="mt-auto pt-6 w-full flex justify-center">
                    <div className="w-8 h-1 bg-primary-purple/20 rounded-full transition-all duration-300 group-hover:w-16 group-hover:bg-primary-purple/60" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}