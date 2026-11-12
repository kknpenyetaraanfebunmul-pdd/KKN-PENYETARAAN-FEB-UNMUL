import { useEffect, useRef, useState, ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'left' | 'right';
  className?: string;
}

export default function Reveal({ children, delay = 0, direction = 'up', className = '' }: RevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // true jika masuk layar, false jika keluar layar
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: '0px 0px 50px 0px' // Muncul 50px sebelum masuk layar
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  // Menentukan posisi awal (transparan & bergeser)
  let hiddenClass = 'opacity-0 translate-y-16 scale-95';
  if (direction === 'left') hiddenClass = 'opacity-0 -translate-x-16 scale-95';
  if (direction === 'right') hiddenClass = 'opacity-0 translate-x-16 scale-95';

  // Posisi akhir (terlihat penuh & di tengah)
  const visibleClass = 'opacity-100 translate-x-0 translate-y-0 scale-100';

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isVisible ? visibleClass : hiddenClass
      }`}
      style={{
        // Delay hanya berlaku saat masuk. Saat keluar (scroll dijauhkan), hilangnya langsung instan.
        transitionDelay: isVisible ? `${delay}ms` : '0ms'
      }}
    >
      {children}
    </div>
  );
}