import type { Metadata } from 'next';
import Link from 'next/link';
import { WifiOff, RefreshCw, Calendar, Home, Info } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Çevrimdışı Mod | Beşiktaş Fikstür',
  description: 'İnternet bağlantınız kesildi. Çevrimdışı fikstür verilerine göz atabilirsiniz.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function OfflinePage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center bg-neutral-900 p-8 sm:p-10 rounded-3xl border border-neutral-800 shadow-2xl">
        <div className="w-20 h-20 bg-neutral-800 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <WifiOff size={40} />
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">
          İnternet Bağlantısı Yok
        </h1>
        <p className="text-neutral-400 text-sm leading-relaxed mb-8">
          Şu an çevrimdışısınız. Daha önce ziyaret ettiğiniz Beşiktaş maç takvimi ve puan durumu cihazınızın hafızasında kayıtlıysa erişebilirsiniz.
        </p>
        <div className="space-y-3">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition duration-200 shadow-md shadow-red-900/30 cursor-pointer"
          >
            <RefreshCw size={18} />
            Sayfayı Yenile
          </button>
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium rounded-xl transition duration-200"
          >
            <Calendar size={18} />
            Kayıtlı Fikstürü İncele
          </Link>
        </div>
        <div className="mt-8 pt-6 border-t border-neutral-800 flex items-center justify-center gap-6 text-sm">
          <Link href="/" className="flex items-center gap-1.5 text-red-400 font-medium hover:underline">
            <Home size={16} />
            Ana Sayfa
          </Link>
          <Link href="/hakkinda" className="flex items-center gap-1.5 text-red-400 font-medium hover:underline">
            <Info size={16} />
            Hakkında
          </Link>
        </div>
      </div>
    </div>
  );
}
