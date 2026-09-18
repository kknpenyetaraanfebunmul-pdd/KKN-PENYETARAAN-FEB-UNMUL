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
    <section id="struktur" className="py-20 sm:py-28 px-5 sm:px-8 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-primary-purple font-semibold text-sm tracking-widest uppercase mb-3">
            Tim Kami
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-dark-purple mb-4">
            Struktur KKN
          </h2>
          <div className="w-20 h-1.5 bg-primary-purple rounded-full mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {content.map((item, idx) => {
            const Icon = iconMap[item.role] || Users;
            return (
              <div
                key={item.id}
                className="group bg-card-bg rounded-3xl p-6 sm:p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-bubble-light"
                style={{
                  animation: `fadeIn 0.5s ease ${idx * 0.1}s both`,
                }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-purple/10 mb-4 transition-all duration-300 group-hover:bg-primary-purple group-hover:scale-110">
                  <Icon size={28} className="text-primary-purple transition-colors duration-300 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-dark-purple mb-1">
                  {item.role}
                </h3>
                <p className="text-sm text-dark-purple/60 font-medium">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
