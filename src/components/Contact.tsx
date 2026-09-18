import { ArrowRight } from 'lucide-react';
import type { SiteContent } from '../types';

interface ContactProps {
  contacts: SiteContent['contacts'];
  supportBy: SiteContent['supportBy'];
  sponsorBy: SiteContent['sponsorBy'];
}

const platformIcons: Record<string, JSX.Element> = {
  Instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  TikTok: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  ),
  Email: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  ),
};

export default function Contact({ contacts, supportBy, sponsorBy }: ContactProps) {
  return (
    <section id="contact" className="py-20 sm:py-28 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-primary-purple font-semibold text-sm tracking-widest uppercase mb-3">
            Hubungi Kami
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-dark-purple mb-4">
            Punya Pertanyaan? Ayo Bicara!
          </h2>
          <div className="w-20 h-1.5 bg-primary-purple rounded-full mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-16">
          {contacts.map((contact, idx) => (
            <a
              key={contact.id}
              href={contact.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card-bg rounded-3xl p-6 flex items-center justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-bubble-light"
              style={{ animation: `fadeIn 0.5s ease ${idx * 0.1}s both` }}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-purple/10 text-primary-purple transition-all duration-300 group-hover:bg-primary-purple group-hover:text-white">
                  {platformIcons[contact.platform] || platformIcons.Email}
                </div>
                <div>
                  <p className="text-xs text-dark-purple/50 font-medium uppercase tracking-wide">
                    {contact.platform}
                  </p>
                  <p className="text-dark-purple font-semibold text-sm">
                    {contact.value}
                  </p>
                </div>
              </div>
              <ArrowRight
                size={20}
                className="text-primary-purple/40 transition-all duration-300 group-hover:text-primary-purple group-hover:translate-x-1"
              />
            </a>
          ))}
        </div>

        <div className="space-y-10">
          <div className="text-center">
            <h3 className="text-xl font-bold text-dark-purple mb-6">Support By</h3>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {supportBy.map((partner) => (
                <div
                  key={partner.id}
                  className="bg-card-bg rounded-2xl px-6 py-3 flex items-center justify-center border border-bubble-light hover:shadow-md transition-all"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-10 object-contain"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-xl font-bold text-dark-purple mb-6">Sponsor By</h3>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {sponsorBy.map((partner) => (
                <div
                  key={partner.id}
                  className="bg-card-bg rounded-2xl px-6 py-3 flex items-center justify-center border border-bubble-light hover:shadow-md transition-all"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-10 object-contain"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
