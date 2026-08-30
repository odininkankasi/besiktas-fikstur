export function formatDateTurkish(isoString: string): {
  dateFormatted: string;
  dayName: string;
  timeFormatted: string;
  relativeText: string;
  monthName: string;
  dayNum: string;
} {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    return {
      dateFormatted: '',
      dayName: '',
      timeFormatted: 'TBD',
      relativeText: '',
      monthName: '',
      dayNum: ''
    };
  }

  const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

  const dayNum = String(date.getDate());
  const monthName = months[date.getMonth()];
  const dayName = days[date.getDay()];
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const timeFormatted = `${hours}:${minutes}`;
  const dateFormatted = `${dayNum} ${monthName} ${date.getFullYear()}`;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const matchDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const diffDays = Math.round((matchDay - today) / (1000 * 60 * 60 * 24));

  let relativeText = '';
  if (diffDays === 0) relativeText = 'Bugün';
  else if (diffDays === 1) relativeText = 'Yarın';
  else if (diffDays === -1) relativeText = 'Dün';
  else if (diffDays > 1 && diffDays <= 7) relativeText = `${diffDays} gün sonra`;
  else if (diffDays < -1 && diffDays >= -7) relativeText = `${Math.abs(diffDays)} gün önce`;

  return {
    dateFormatted,
    dayName,
    timeFormatted,
    relativeText,
    monthName,
    dayNum
  };
}

export interface TeamBadge {
  shortName: string;
  bgGradient: string;
  textColor: string;
  borderColor: string;
  logoUrl?: string;
  isBjk: boolean;
}

export function getTeamBadgeInfo(teamName: string): TeamBadge {
  const name = (teamName || '').toLowerCase().trim();

  // BEŞİKTAŞ (Orijinal Resmi Wikimedia SVG Arması)
  if (name.includes('beşiktaş') || name.includes('besiktas') || name.includes('bjk')) {
    return {
      shortName: 'BJK',
      bgGradient: 'from-black via-neutral-900 to-neutral-950',
      textColor: 'text-white font-black',
      borderColor: 'border-red-600',
      logoUrl: '/bjk-logo.svg',
      isBjk: true
    };
  }

  // --- SÜPER LİG & 1. LİG TÜM TÜRK KULÜPLERİ (FOTMOB RESMİ DOĞRULANMIŞ LOGOLARI) ---
  if (name.includes('galatasaray')) {
    return { shortName: 'GS', bgGradient: 'from-amber-500 via-red-600 to-red-700', textColor: 'text-white', borderColor: 'border-amber-400', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8637.png', isBjk: false };
  }
  if (name.includes('fenerbahçe') || name.includes('fenerbahce')) {
    return { shortName: 'FB', bgGradient: 'from-blue-900 via-blue-950 to-yellow-400', textColor: 'text-yellow-300', borderColor: 'border-yellow-400', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8695.png', isBjk: false };
  }
  if (name.includes('trabzonspor') || name.includes('trabzon')) {
    return { shortName: 'TS', bgGradient: 'from-red-800 via-rose-900 to-sky-400', textColor: 'text-sky-200', borderColor: 'border-sky-400', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/9752.png', isBjk: false };
  }
  if (name.includes('başakşehir') || name.includes('basaksehir') || name.includes('medipol') || name.includes('istanbul basaksehir')) {
    return { shortName: 'İBFK', bgGradient: 'from-orange-600 via-orange-700 to-blue-900', textColor: 'text-white', borderColor: 'border-orange-500', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/1933.png', isBjk: false };
  }
  if (name.includes('samsunspor') || name.includes('samsun')) {
    return { shortName: 'SAM', bgGradient: 'from-red-600 via-red-700 to-neutral-900', textColor: 'text-white', borderColor: 'border-red-500', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/9750.png', isBjk: false };
  }
  if (name.includes('eyüpspor') || name.includes('eyupspor') || name.includes('eyüp')) {
    return { shortName: 'EYÜP', bgGradient: 'from-purple-900 via-purple-950 to-yellow-500', textColor: 'text-yellow-300', borderColor: 'border-yellow-400', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/4681.png', isBjk: false };
  }
  // GÖZTEPE (Doğrulanmış FotMob ID: 1925)
  if (name.includes('göztepe') || name.includes('goztepe')) {
    return { shortName: 'GÖZ', bgGradient: 'from-yellow-500 via-amber-600 to-red-700', textColor: 'text-white', borderColor: 'border-yellow-400', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/1925.png', isBjk: false };
  }
  // KASIMPAŞA (Doğrulanmış FotMob ID: 4685)
  if (name.includes('kasımpaşa') || name.includes('kasimpasa')) {
    return { shortName: 'KAS', bgGradient: 'from-blue-700 via-blue-800 to-neutral-900', textColor: 'text-white', borderColor: 'border-blue-400', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/4685.png', isBjk: false };
  }
  // ANTALYASPOR (Doğrulanmış FotMob ID: 1931)
  if (name.includes('antalyaspor') || name.includes('antalya')) {
    return { shortName: 'ANT', bgGradient: 'from-red-600 via-red-700 to-neutral-100', textColor: 'text-white', borderColor: 'border-red-500', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/1931.png', isBjk: false };
  }
  // SİVASSPOR (Doğrulanmış FotMob ID: 6265)
  if (name.includes('sivasspor') || name.includes('sivas')) {
    return { shortName: 'SİV', bgGradient: 'from-red-600 via-red-800 to-neutral-900', textColor: 'text-white', borderColor: 'border-red-400', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/6265.png', isBjk: false };
  }
  // KONYASPOR (Doğrulanmış FotMob ID: 8622)
  if (name.includes('konyaspor') || name.includes('konya') || name.includes('tümosan')) {
    return { shortName: 'KON', bgGradient: 'from-emerald-700 via-emerald-800 to-neutral-900', textColor: 'text-emerald-100', borderColor: 'border-emerald-400', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8622.png', isBjk: false };
  }
  // GAZİANTEP FK (Doğrulanmış FotMob ID: 4081)
  if (name.includes('gaziantep') || name.includes('gfk')) {
    return { shortName: 'GFK', bgGradient: 'from-red-700 via-neutral-900 to-black', textColor: 'text-white', borderColor: 'border-red-500', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/4081.png', isBjk: false };
  }
  // ÇAYKUR RİZESPOR (Doğrulanmış FotMob ID: 2166)
  if (name.includes('rizespor') || name.includes('çaykur') || name.includes('rize')) {
    return { shortName: 'ÇRİZ', bgGradient: 'from-emerald-600 via-blue-700 to-blue-900', textColor: 'text-white', borderColor: 'border-emerald-400', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/2166.png', isBjk: false };
  }
  // ALANYASPOR (Doğrulanmış FotMob ID: 4678)
  if (name.includes('alanyaspor') || name.includes('alanya') || name.includes('corendon')) {
    return { shortName: 'ALN', bgGradient: 'from-orange-500 via-amber-600 to-emerald-700', textColor: 'text-white', borderColor: 'border-orange-400', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/4678.png', isBjk: false };
  }
  // KAYSERİSPOR (Doğrulanmış FotMob ID: 10182)
  if (name.includes('kayserispor') || name.includes('kayseri') || name.includes('bellona')) {
    return { shortName: 'KAY', bgGradient: 'from-yellow-500 via-amber-600 to-red-700', textColor: 'text-white', borderColor: 'border-yellow-400', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/10182.png', isBjk: false };
  }
  // KOCAELİSPOR (Doğrulanmış FotMob ID: 1569)
  if (name.includes('kocaelispor') || name.includes('kocaeli')) {
    return { shortName: 'KOC', bgGradient: 'from-emerald-700 via-black to-neutral-900', textColor: 'text-emerald-300', borderColor: 'border-emerald-500', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/1569.png', isBjk: false };
  }
  // GENÇLERBİRLİĞİ (Doğrulanmış FotMob ID: 7800)
  if (name.includes('gençlerbirliği') || name.includes('genclerbirligi') || name.includes('gençlerbirligi')) {
    return { shortName: 'GB', bgGradient: 'from-red-600 via-black to-neutral-950', textColor: 'text-white', borderColor: 'border-red-500', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/7800.png', isBjk: false };
  }
  // ERZURUMSPOR FK (Doğrulanmış FotMob ID: 281467)
  if (name.includes('erzurumspor') || name.includes('erzurum')) {
    return { shortName: 'ERZ', bgGradient: 'from-blue-700 via-sky-600 to-neutral-900', textColor: 'text-white', borderColor: 'border-sky-400', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/281467.png', isBjk: false };
  }
  // AMEDSPOR / AMED SPORTİF (Doğrulanmış FotMob ID: 96498)
  if (name.includes('amed') || name.includes('amedspor')) {
    return { shortName: 'AMD', bgGradient: 'from-emerald-700 via-red-700 to-neutral-900', textColor: 'text-white', borderColor: 'border-emerald-500', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/96498.png', isBjk: false };
  }
  // ÇORUM FK (Doğrulanmış FotMob ID: 357274)
  if (name.includes('çorum') || name.includes('corum')) {
    return { shortName: 'ÇOR', bgGradient: 'from-red-700 via-neutral-900 to-black', textColor: 'text-white', borderColor: 'border-red-500', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/357274.png', isBjk: false };
  }
  // ADANA DEMİRSPOR (Doğrulanmış FotMob ID: 1926)
  if (name.includes('adana demirspor') || name.includes('adana')) {
    return { shortName: 'ADS', bgGradient: 'from-sky-500 via-blue-700 to-blue-950', textColor: 'text-white', borderColor: 'border-sky-400', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/1926.png', isBjk: false };
  }
  // BODRUM FK (Doğrulanmış FotMob ID: 658811)
  if (name.includes('bodrum')) {
    return { shortName: 'BOD', bgGradient: 'from-emerald-600 via-emerald-700 to-neutral-900', textColor: 'text-white', borderColor: 'border-emerald-400', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/658811.png', isBjk: false };
  }
  // HATAYSPOR
  if (name.includes('hatayspor') || name.includes('hatay')) {
    return { shortName: 'HAT', bgGradient: 'from-rose-700 via-red-800 to-neutral-900', textColor: 'text-white', borderColor: 'border-rose-400', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/1319903.png', isBjk: false };
  }
  if (name.includes('ankagücü') || name.includes('ankaragücü') || name.includes('ankaragucu')) {
    return { shortName: 'AGÜÇ', bgGradient: 'from-yellow-500 via-blue-900 to-blue-950', textColor: 'text-yellow-300', borderColor: 'border-yellow-400', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8681.png', isBjk: false };
  }
  if (name.includes('fatih karagümrük') || name.includes('karagümrük') || name.includes('karagumruk')) {
    return { shortName: 'FKM', bgGradient: 'from-red-700 via-black to-neutral-950', textColor: 'text-white', borderColor: 'border-red-500', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/10199.png', isBjk: false };
  }
  if (name.includes('sakaryaspor') || name.includes('sakarya')) {
    return { shortName: 'SAK', bgGradient: 'from-emerald-700 via-black to-neutral-900', textColor: 'text-emerald-300', borderColor: 'border-emerald-400', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8679.png', isBjk: false };
  }
  if (name.includes('bursaspor') || name.includes('bursa')) {
    return { shortName: 'BUR', bgGradient: 'from-emerald-600 via-emerald-800 to-neutral-900', textColor: 'text-white', borderColor: 'border-emerald-400', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8676.png', isBjk: false };
  }

  // --- AVRUPA & DÜNYA KULÜP LOGOLARI (DOĞRULANMIŞ) ---
  if (name.includes('leverkusen') || name.includes('bayer')) {
    return { shortName: 'B04', bgGradient: 'from-red-600 via-black to-neutral-950', textColor: 'text-white', borderColor: 'border-red-500', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8178.png', isBjk: false };
  }
  if (name.includes('celtic')) {
    return { shortName: 'CEL', bgGradient: 'from-emerald-600 via-emerald-800 to-white', textColor: 'text-white', borderColor: 'border-emerald-400', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/9925.png', isBjk: false };
  }
  if (name.includes('crystal palace') || name.includes('palace')) {
    return { shortName: 'CRY', bgGradient: 'from-blue-600 via-red-600 to-blue-900', textColor: 'text-white', borderColor: 'border-blue-400', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/9826.png', isBjk: false };
  }
  if (name.includes('marseille') || name.includes('marsilya')) {
    return { shortName: 'OM', bgGradient: 'from-sky-400 via-sky-600 to-white', textColor: 'text-sky-950 font-black', borderColor: 'border-sky-400', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8592.png', isBjk: false };
  }
  if (name.includes('union st') || name.includes('saint-gilloise') || name.includes('gilloise') || name.includes('usg')) {
    return { shortName: 'USG', bgGradient: 'from-yellow-400 via-blue-800 to-blue-950', textColor: 'text-yellow-300', borderColor: 'border-yellow-400', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/9993.png', isBjk: false };
  }
  if (name.includes('omonia') || name.includes('nicosia')) {
    return { shortName: 'OMO', bgGradient: 'from-emerald-600 via-emerald-800 to-white', textColor: 'text-white', borderColor: 'border-emerald-400', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8493.png', isBjk: false };
  }
  if (name.includes('hapoel') || name.includes('beer sheva')) {
    return { shortName: 'HBS', bgGradient: 'from-red-600 via-red-800 to-white', textColor: 'text-white', borderColor: 'border-red-400', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8644.png', isBjk: false };
  }
  if (name.includes('zalgiris') || name.includes('kauno') || name.includes('žalgiris')) {
    return { shortName: 'ŽAL', bgGradient: 'from-emerald-700 via-emerald-800 to-neutral-900', textColor: 'text-white', borderColor: 'border-emerald-400', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/647907.png', isBjk: false };
  }
  if (name.includes('hradec') || name.includes('králové') || name.includes('kralove')) {
    return { shortName: 'FCH', bgGradient: 'from-neutral-800 via-neutral-900 to-black', textColor: 'text-white', borderColor: 'border-neutral-500', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/9753.png', isBjk: false };
  }
  if (name.includes('ajax')) {
    return { shortName: 'AJX', bgGradient: 'from-red-600 via-neutral-100 to-neutral-900', textColor: 'text-white', borderColor: 'border-red-500', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8593.png', isBjk: false };
  }
  if (name.includes('tottenham') || name.includes('spurs')) {
    return { shortName: 'TOT', bgGradient: 'from-blue-950 via-slate-900 to-neutral-900', textColor: 'text-white', borderColor: 'border-slate-400', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8586.png', isBjk: false };
  }
  if (name.includes('lyon') || name.includes('olympique')) {
    return { shortName: 'OL', bgGradient: 'from-blue-800 via-red-600 to-neutral-900', textColor: 'text-white', borderColor: 'border-blue-400', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/9748.png', isBjk: false };
  }
  if (name.includes('frankfurt') || name.includes('eintracht')) {
    return { shortName: 'SGE', bgGradient: 'from-red-600 via-black to-neutral-950', textColor: 'text-white', borderColor: 'border-red-500', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/9810.png', isBjk: false };
  }
  if (name.includes('malmö') || name.includes('malmo')) {
    return { shortName: 'MFF', bgGradient: 'from-sky-400 via-sky-600 to-blue-900', textColor: 'text-white', borderColor: 'border-sky-300', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8071.png', isBjk: false };
  }
  if (name.includes('maccabi')) {
    return { shortName: 'MTA', bgGradient: 'from-yellow-400 via-blue-700 to-blue-900', textColor: 'text-yellow-200', borderColor: 'border-yellow-400', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8643.png', isBjk: false };
  }
  if (name.includes('bodø') || name.includes('bodo') || name.includes('glimt')) {
    return { shortName: 'B/G', bgGradient: 'from-yellow-400 via-amber-500 to-neutral-900', textColor: 'text-black font-black', borderColor: 'border-yellow-400', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8402.png', isBjk: false };
  }
  if (name.includes('athletic') || name.includes('bilbao')) {
    return { shortName: 'ATH', bgGradient: 'from-red-600 via-rose-700 to-black', textColor: 'text-white', borderColor: 'border-red-500', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8315.png', isBjk: false };
  }
  if (name.includes('twente')) {
    return { shortName: 'TWE', bgGradient: 'from-red-600 via-red-700 to-neutral-900', textColor: 'text-white', borderColor: 'border-red-500', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8611.png', isBjk: false };
  }
  if (name.includes('midtjylland')) {
    return { shortName: 'FCM', bgGradient: 'from-red-700 via-black to-neutral-950', textColor: 'text-white', borderColor: 'border-red-500', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8113.png', isBjk: false };
  }
  if (name.includes('lugano')) {
    return { shortName: 'LUG', bgGradient: 'from-neutral-900 via-black to-neutral-950', textColor: 'text-white', borderColor: 'border-neutral-400', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/9761.png', isBjk: false };
  }
  if (name.includes('braga')) {
    return { shortName: 'SCB', bgGradient: 'from-red-600 via-red-800 to-neutral-900', textColor: 'text-white', borderColor: 'border-red-500', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/9768.png', isBjk: false };
  }
  if (name.includes('porto')) {
    return { shortName: 'FCP', bgGradient: 'from-blue-700 via-blue-900 to-neutral-900', textColor: 'text-white', borderColor: 'border-blue-400', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/9773.png', isBjk: false };
  }
  if (name.includes('slavia')) {
    return { shortName: 'SLA', bgGradient: 'from-red-600 via-neutral-100 to-neutral-900', textColor: 'text-white', borderColor: 'border-red-500', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8494.png', isBjk: false };
  }
  if (name.includes('lazio')) {
    return { shortName: 'LAZ', bgGradient: 'from-sky-400 via-sky-600 to-neutral-900', textColor: 'text-white', borderColor: 'border-sky-300', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8543.png', isBjk: false };
  }
  if (name.includes('manchester') || name.includes('united')) {
    return { shortName: 'MUN', bgGradient: 'from-red-600 via-yellow-500 to-black', textColor: 'text-white', borderColor: 'border-red-500', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/10260.png', isBjk: false };
  }
  if (name.includes('hoffenheim')) {
    return { shortName: 'HOF', bgGradient: 'from-blue-600 via-blue-800 to-neutral-900', textColor: 'text-white', borderColor: 'border-blue-400', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8226.png', isBjk: false };
  }
  if (name.includes('shakhtar')) {
    return { shortName: 'SHK', bgGradient: 'from-orange-600 via-black to-neutral-900', textColor: 'text-white', borderColor: 'border-orange-500', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8640.png', isBjk: false };
  }
  if (name.includes('dynamo') || name.includes('dinamo kiev')) {
    return { shortName: 'DKV', bgGradient: 'from-blue-600 via-neutral-100 to-neutral-900', textColor: 'text-white', borderColor: 'border-blue-400', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8641.png', isBjk: false };
  }

  // Varsayılan Takımlar (İlk 3 harf veya baş harfler)
  const words = teamName.split(' ').filter(Boolean);
  let initials = '';
  if (words.length >= 2) {
    initials = words.slice(0, 3).map(w => w[0]).join('').toUpperCase();
  } else {
    initials = teamName.substring(0, 3).toUpperCase();
  }

  return {
    shortName: initials || 'FC',
    bgGradient: 'from-neutral-800 via-neutral-900 to-neutral-950',
    textColor: 'text-neutral-200',
    borderColor: 'border-neutral-700',
    isBjk: false
  };
}
