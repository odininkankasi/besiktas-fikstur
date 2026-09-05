'use client';

import { useState, useEffect } from 'react';
import { Download, X, Share, PlusSquare } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    // 1. Zaten PWA modunda çalışıyorsa gösterme
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) return;

    // 2. Kullanıcı daha önce kapattıysa 7 gün boyunca sorma
    const dismissedUntil = localStorage.getItem('pwa_prompt_dismissed_until');
    if (dismissedUntil && new Date().getTime() < parseInt(dismissedUntil, 10)) {
      return;
    }

    // 3. iOS tespiti
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    if (isIosDevice) {
      // iOS kullanıcılarına ilk ziyaretinden 4 saniye sonra göster
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 4000);
      return () => clearTimeout(timer);
    }

    // 4. Android & Desktop Chrome/Edge beforeinstallprompt dinleyicisi
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSModal(false);
    // 7 gün boyunca tekrar sorma
    const oneWeekLater = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem('pwa_prompt_dismissed_until', oneWeekLater.toString());
  };

  if (!showPrompt) return null;

  return (
    <>
      {/* Alt Kurulum Çubuğu */}
      <aside aria-label="Uygulama Yükleme" className="pwa-install-bar">
        <div className="pwa-install-container">
          <div className="pwa-info">
            <img
              src="/icon-192x192.png"
              alt="BJK Fikstür"
              className="pwa-app-icon"
              width={44}
              height={44}
            />
            <div className="pwa-text">
              <strong className="pwa-title">Beşiktaş Fikstür Uygulaması</strong>
              <span className="pwa-desc">Maç takvimi ve canlı puan tablosunu ana ekranınıza yükleyin</span>
            </div>
          </div>

          <div className="pwa-actions">
            <button
              onClick={handleInstallClick}
              className="pwa-btn-install"
              aria-label="Uygulamayı Cihaza Yükle"
            >
              <Download size={16} />
              <span>Yükle</span>
            </button>
            <button
              onClick={handleDismiss}
              className="pwa-btn-close"
              aria-label="Kapat"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* iOS Safari Rehber Modalı */}
      {showIOSModal && (
        <div className="pwa-ios-modal-overlay" onClick={() => setShowIOSModal(false)}>
          <div className="pwa-ios-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pwa-ios-header">
              <div className="pwa-ios-title-wrap">
                <img src="/icon-192x192.png" alt="BJK Fikstür" className="pwa-ios-icon" />
                <div>
                  <h3 className="pwa-ios-title">Ana Ekrana Ekle</h3>
                  <p className="pwa-ios-subtitle">bjk.8080.tr</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="pwa-ios-close"
                aria-label="Kapat"
              >
                <X size={20} />
              </button>
            </div>

            <p className="pwa-ios-desc">
              Beşiktaş Maç Takvimi'ni iPhone veya iPad'inize uygulama gibi yüklemek için aşağıdaki adımları uygulayın:
            </p>

            <ol className="pwa-ios-steps">
              <li>
                Safari'nin alt menüsünde yer alan <span className="pwa-step-badge"><Share size={14} /> Paylaş</span> butonuna dokunun.
              </li>
              <li>
                Açılan menüde aşağı kaydırarak <span className="pwa-step-badge"><PlusSquare size={14} /> Ana Ekrana Ekle</span> seçeneğini seçin.
              </li>
              <li>
                Sağ üst köşedeki <strong>Ekle</strong> butonuna basarak kurulumu tamamlayın.
              </li>
            </ol>

            <button onClick={handleDismiss} className="pwa-ios-confirm-btn">
              Anladım
            </button>
          </div>
        </div>
      )}
    </>
  );
}
