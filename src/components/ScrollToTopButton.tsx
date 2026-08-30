'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      title="Sayfa Başına Dön"
      className="fixed bottom-6 right-6 z-40 p-3 rounded-2xl bg-neutral-900/90 hover:bg-neutral-800 text-white border border-neutral-700/80 hover:border-red-500/60 shadow-2xl shadow-black/80 backdrop-blur-md transition-all duration-300 transform hover:scale-110 active:scale-95 group animate-in fade-in slide-in-from-bottom-4"
    >
      <ChevronUp className="w-5 h-5 text-neutral-300 group-hover:text-red-500 transition-colors" />
    </button>
  );
};
