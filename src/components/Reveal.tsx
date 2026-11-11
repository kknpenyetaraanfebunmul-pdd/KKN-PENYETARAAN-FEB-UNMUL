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
        // Hanya munculkan saat elemen masuk layar dari bawah
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { 
        // rootMargin negatif di bawah (-15%) memaksa elemen harus masuk 
        // sejauh 15% dari bawah layar baru animasi terpicu.
        rootMargin: '0px 0px -15% 0px',
        threshold: 0.1 
      }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  const animationClass = 
    direction === 'left' ? 'animate-reveal-left' : 
    direction === 'right' ? 'animate-reveal-right' : 
    'animate-reveal';

  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? animationClass : 'opacity-0 invisible'}`}
      style={{ 
        animationDelay: `${delay}ms`,
        willChange: 'transform, opacity' 
      }}
    >
      {children}
    </div>
  );
}