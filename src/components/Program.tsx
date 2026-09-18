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
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary-purple/20 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-purple/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-14">
          <p className="text-primary-purple font-semibold text-sm tracking-widest uppercase mb-3">
            Kegiatan
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            Program Kerja
          </h2>
          <div className="w-20 h-1.5 bg-primary-purple rounded-full mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {content.map((program, idx) => (
            <button
              key={program.id}
              onClick={() => setSelected(idx)}
              className="group text-left bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 sm:p-8 transition-all duration-300 hover:bg-white/10 hover:border-primary-purple/50 hover:-translate-y-1"
              style={{
                animation: `fadeIn 0.5s ease ${idx * 0.1}s both`,
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-5xl">{program.icon}</span>
                <ArrowUpRight
                  size={24}
                  className="text-white/30 transition-all duration-300 group-hover:text-primary-purple group-hover:rotate-45"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {program.title}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                {program.shortDesc}
              </p>
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
