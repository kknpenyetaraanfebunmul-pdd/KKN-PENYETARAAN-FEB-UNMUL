import { useState } from 'react';
import { X, Target, Calendar, MapPin, Users } from 'lucide-react';
import type { ProgramItem } from '../types';

interface ProgramModalProps {
  program: ProgramItem;
  onClose: () => void;
}

export default function ProgramModal({ program, onClose }: ProgramModalProps) {
  const infoItems = [
    { icon: Target, label: 'Sasaran', value: program.info.sasaran },
    { icon: Calendar, label: 'Jadwal', value: program.info.jadwal },
    { icon: MapPin, label: 'Lokasi', value: program.info.lokasi },
    { icon: Users, label: 'Peserta/Target/Layanan', value: program.info.target },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-purple/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-bg rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-primary-purple to-dark-purple px-6 sm:px-8 py-6 flex items-start justify-between rounded-t-3xl">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{program.icon}</span>
            <h3 className="text-2xl font-extrabold text-white">{program.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <p className="text-dark-purple/80 leading-relaxed mb-8">
            {program.fullDesc}
          </p>

          <h4 className="text-lg font-bold text-dark-purple mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary-purple rounded-full" />
            Kegiatan Utama
          </h4>
          <ol className="space-y-3 mb-8">
            {program.activities.map((activity, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 bg-card-bg rounded-xl p-3"
              >
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary-purple text-white text-sm font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="text-sm text-dark-purple/80 pt-0.5">
                  {activity}
                </span>
              </li>
            ))}
          </ol>

          <h4 className="text-lg font-bold text-dark-purple mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary-purple rounded-full" />
            Informasi Program
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {infoItems.map((info) => {
              const Icon = info.icon;
              return (
                <div
                  key={info.label}
                  className="bg-card-bg rounded-2xl p-4 border border-bubble-light"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={18} className="text-primary-purple" />
                    <span className="text-xs font-semibold text-primary-purple uppercase tracking-wide">
                      {info.label}
                    </span>
                  </div>
                  <p className="text-sm text-dark-purple/80">{info.value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
