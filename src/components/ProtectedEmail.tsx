'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Check, Copy } from 'lucide-react';

export const ProtectedEmail: React.FC = () => {
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Botların HTML kazımasını engellemek için parçalı oluşturma
    const user = 'iletisim';
    const domain = 'kanik.com.tr';
    setEmail(`${user}@${domain}`);
  }, []);

  const handleCopy = () => {
    if (!email) return;
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!email) {
    return <span className="text-neutral-500 font-mono text-sm">Yükleniyor...</span>;
  }

  return (
    <div className="inline-flex items-center gap-3 p-3 rounded-2xl bg-neutral-900 border border-neutral-800">
      <a
        href={`mailto:${email}`}
        className="flex items-center gap-2 text-sm sm:text-base font-mono font-bold text-white hover:text-red-500 transition-colors"
      >
        <Mail className="w-4 h-4 text-red-500 shrink-0" />
        <span>{email}</span>
      </a>

      <button
        onClick={handleCopy}
        title="E-postayı Kopyala"
        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all text-xs flex items-center gap-1"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] text-emerald-400 font-medium">Kopyalandı</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium">Kopyala</span>
          </>
        )}
      </button>
    </div>
  );
};
