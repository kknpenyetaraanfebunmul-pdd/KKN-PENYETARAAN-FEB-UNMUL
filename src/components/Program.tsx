import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { SiteContent } from '../types';
import ProgramModal from './ProgramModal';

interface ProgramProps {
  content: SiteContent['programs'];
}

export default function Program({ content }: ProgramProps) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section id="program" className="py-20 sm:py-28 px-5 sm:px-8 bg-dark-purple relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary-purple/20 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-purple/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="max-w-6xl mx-auto relative">
        {/* Header Section */}
        <div className="text-center mb-16">
          <p className="text-primary-purple font-semibold text-sm tracking-widest uppercase mb-3">
            Kegiatan
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            Program Kerja
          </h2>
          <div className="w-20 h-1.5 bg-primary-purple rounded-full mx-auto" />
        </div>

        {/* Grid Program */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {content.map((program, idx) => (
            <button
              key={program.id}
              onClick={() => setSelected(idx)}
              className="group text-left relative bg-gradient-to-br from-white/10 to-white/[0.02] backdrop-blur-md border border-white/10 rounded-3xl p-7 sm:p-8 transition-all duration-500 hover:bg-white/[0.08] hover:border-primary-purple/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary-purple/20 overflow-hidden"
              style={{
                animation: `fadeIn 0.5s ease ${idx * 0.1}s both`,
              }}
            >
              {/* Glow effect di sudut saat hover */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary-purple/0 rounded-full blur-3xl transition-all duration-500 group-hover:bg-primary-purple/40" />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  {/* Container Ikon dengan bg */}
                  <div className="w-14 h-14 rounded-2xl bg-primary-purple/15 border border-primary-purple/20 flex items-center justify-center text-3xl transition-all duration-300 group-hover:scale-110 group-hover:bg-primary-purple/25">
                    {program.icon}
                  </div>
                  <ArrowUpRight
                    size={22}
                    className="text-white/30 transition-all duration-300 group-hover:text-primary-purple group-hover:rotate-45 group-hover:scale-110"
                  />
                </div>
                
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-primary-purple transition-colors duration-300">
                  {program.title}
                </h3>
                <p className="text-sm sm:text-base text-white/60 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                  {program.shortDesc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selected !== null && content[selected] && (
        <ProgramModal
          program={content[selected]}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}