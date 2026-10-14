// Main Frontend Application Logic for Karimnagar Durga Idol Finder

let currentSiteConfig = getSiteConfig();
let currentMandapams = getMandapams().filter(m => (m.isVerified === true || m.status === 'approved') && m.status !== 'pending');
let currentAreas = getAreasList();

let activeCategoryFilter = "all";
let activeAreaFilter = "all";
let searchQuery = "";
let userLocation = null;
let leafletMap = null;
let mapMarkers = [];
let lastRenderedSignature = "";

function computeDataSignature(mandapams, config) {
  const pList = (mandapams || []).map(m => `${m.id}_${m.status}_${m.isVerified}_${m.updatedAt || ''}_${m.name || ''}_${m.latitude}_${m.longitude}`).join(';');
  const cInfo = config ? `${config.stats?.locationsCount || 0}_${config.hero?.mainTitle || ''}` : '';
  return `${pList}##${cInfo}`;
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  // 1. Initial immediate render from local cache so page is never blank
  initApp();

  // Show Follow Developer popup while entering the website
  setTimeout(() => {
    openDeveloperPopup();
  }, 400);

  // 2. Pull server data and fresh approved pandals from backend
  syncIndexData();
  setupEventListeners();

  // 3. Real-time cross-tab synchronization
  if (typeof listenDataChange === "function") {
    listenDataChange(() => {
      syncIndexData();
    });
  }

  // Smooth background live polling (every 45s): only re-renders when data signature changes
  setInterval(() => {
    syncIndexData();
  }, 45000);

  // Debounced tab focus sync (minimum 30s gap to avoid spamming)
  let lastFocusSyncTime = 0;
  window.addEventListener("focus", () => {
    const now = Date.now();
    if (now - lastFocusSyncTime > 30000) {
      lastFocusSyncTime = now;
      syncIndexData();
    }
  });
});

let isSyncInProgress = false;
function syncIndexData() {
  if (isSyncInProgress) return;
  isSyncInProgress = true;

  fetch(getApiUrl("/api/mandapams?_t=" + Date.now()))
    .then(r => {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then(res => {
      let freshMandapams = [];
      if (res && res.success && Array.isArray(res.mandapams)) {
        // Authoritative list of strictly approved pandals directly from server
        freshMandapams = (typeof deduplicatePandals === 'function') 
          ? deduplicatePandals(res.mandapams)
          : res.mandapams.filter(m => (m.isVerified === true || m.status === 'approved') && m.status !== 'pending' && m.status !== 'rejected');
        safeSaveMandapams(freshMandapams);
      } else {
        freshMandapams = getMandapams();
      }

      const newSignature = computeDataSignature(freshMandapams, getSiteConfig());
      // If data has NOT changed, do not re-render DOM/Map (zero glitch, zero flickering!)
      if (lastRenderedSignature && newSignature === lastRenderedSignature) {
        return;
      }

      lastRenderedSignature = newSignature;
      currentMandapams = freshMandapams;

      if (window._userActiveMapSearch) {
        return;
      }
      renderAllViews();
    })
    .catch((err) => {
      console.warn("Index sync notice (retaining valid cached data):", err);
      // Graceful fallback: Do NOT wipe valid cached pandals
      const localApproved = getMandapams();
      if (localApproved.length > 0 && (!currentMandapams || currentMandapams.length === 0)) {
        currentMandapams = localApproved;
        renderAllViews();
      }
    })
    .finally(() => {
      isSyncInProgress = false;
    });
}

function renderAllViews() {
  currentSiteConfig = getSiteConfig();
  currentAreas = getAreasList();
  renderHeaderAndHero();
  renderStatsBar();
  renderMustVisitRail();
  renderAreaPills();
  renderMandapamsDirectory();
  renderCtaAndFooter();
  if (typeof window.initLeafletMap === "function") {
    try { window.initLeafletMap(); } catch (e) { console.warn("Map init error:", e); }
  } else {
    initLeafletMap();
  }
}

function initApp() {
  currentSiteConfig = getSiteConfig();
  currentMandapams = (typeof deduplicatePandals === 'function')
    ? deduplicatePandals(getMandapams())
    : getMandapams();
  currentAreas = getAreasList();
  lastRenderedSignature = computeDataSignature(currentMandapams, currentSiteConfig);
  renderAllViews();
}

function updateDeveloperDp() {
  const dpUrl = (typeof window.DEVELOPER_DP !== "undefined") ? window.DEVELOPER_DP : "assets/images/developer-varun.jpg";
  const popupImg = document.getElementById("developer-popup-dp");
  if (popupImg) popupImg.src = dpUrl;
}

// Developer modal controllers
function openDeveloperPopup() {
  const modal = document.getElementById("developer-popup-modal");
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    updateDeveloperDp();
  }
}

function closeDeveloperPopup() {
  const modal = document.getElementById("developer-popup-modal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}


// 1. Render Header & Hero
function renderHeaderAndHero() {
  const cfg = currentSiteConfig;
  
  document.querySelectorAll(".site-logo-text").forEach(el => el.textContent = cfg.header?.siteName || "Karimnagar Durga Idol Finder");
  
  const chantEl = document.getElementById("hero-chant");
  if (chantEl) chantEl.innerHTML = `<span>🔱</span> ${cfg.hero?.chantTelugu || '॥ ఓం శ్రీ దుర్గాయై నమః ॥'}`;

  const titleEl = document.getElementById("hero-title");
  if (titleEl) {
    titleEl.innerHTML = `${cfg.hero?.mainTitle || 'Karimnagar Durga'} <span class="block text-saffron-600">${cfg.hero?.titleHighlight || 'Idol Finder'}</span>`;
  }

  const subtitleEl = document.getElementById("hero-subtitle");
  if (subtitleEl && cfg.hero?.subtitle) {
    subtitleEl.innerHTML = cfg.hero.subtitle.replace(/•/g, '<span class="text-saffron-500">•</span>');
  }

  const descEl = document.getElementById("hero-desc");
  if (descEl && cfg.hero?.description) descEl.textContent = cfg.hero.description;

  const heroImgEl = document.getElementById("hero-image-tag");
  if (heroImgEl && cfg.hero?.heroImage) {
    heroImgEl.src = typeof resolveMediaUrl === "function" ? resolveMediaUrl(cfg.hero.heroImage) : cfg.hero.heroImage;
  }
}

// 2. Render Stats Bar
function renderStatsBar() {
  const st = currentSiteConfig.stats || {};
  const verifiedCount = currentMandapams.length;
  const uniqueCount = currentMandapams.filter(m => m.categories && m.categories.includes("unique")).length;
  let photoCount = 0;
  currentMandapams.forEach(m => {
    if (m.photos) photoCount += m.photos.length;
  });

  const locCountEl = document.getElementById("stat-locations-count");
  if (locCountEl) locCountEl.textContent = verifiedCount;

  const themeCountEl = document.getElementById("stat-themes-count");
  if (themeCountEl) themeCountEl.textContent = uniqueCount;

  const photoCountEl = document.getElementById("stat-photos-count");
  if (photoCountEl) photoCountEl.textContent = photoCount;

  const homeLabelEl = document.getElementById("stat-home-label");
  if (homeLabelEl) homeLabelEl.textContent = st.locationLabel || "Karimnagar";

  const quoteTextEl = document.getElementById("stat-quote-text");
  if (quoteTextEl) quoteTextEl.innerHTML = (st.quoteTelugu || '“సకల శుభ ప్రదాయినీ శ్రీ దుర్గాదేవి”').replace(/“|”/g, '');
}

// 3. Render Must Visit Rail (Carousel)
function renderMustVisitRail() {
  const container = document.getElementById("must-visit-rail");
  const section = document.getElementById("must-visit-section");
  if (!container) return;

  const mustVisitList = currentMandapams
    .filter(m => m.isMustVisit || m.category === 'must-visit' || (m.categories && m.categories.includes('must-visit')) || m.priority <= 3)
    .sort((a, b) => (a.priority || 99) - (b.priority || 99));

  if (mustVisitList.length === 0) {
    if (section) section.classList.add("hidden");
    return;
  }

  if (section) section.classList.remove("hidden");

  const countBadge = document.getElementById("must-visit-count");
  if (countBadge) countBadge.textContent = `${mustVisitList.length} Priority Pandals`;

  container.innerHTML = mustVisitList.map((item, idx) => {
    const rawPhoto = (item.photos && item.photos.length > 0) ? (typeof item.photos[0] === 'string' ? item.photos[0] : item.photos[0].url) : "assets/images/hero-durga.jpg";
    const photo = typeof resolveMediaUrl === "function" ? resolveMediaUrl(rawPhoto) : rawPhoto;
    const rank = item.priority || idx + 1;
    const mapUrl = getGoogleMapsUrl(item);

    return `
      <div class="group flex flex-col overflow-hidden rounded-2xl border border-cream-300/80 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift w-[78vw] sm:w-[280px] md:w-[310px] shrink-0 snap-start cursor-pointer" onclick="openPandalDetailsModal('${item.id}')">
        <div class="relative aspect-[4/3.1] overflow-hidden bg-cream-100">
          <img src="${photo}" alt="${item.name}" loading="lazy" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" onerror="this.src='assets/images/hero-durga.jpg'" />
          <div class="absolute left-2.5 top-2.5 flex items-center gap-1.5">
            <span class="grid h-7 min-w-7 place-items-center rounded-full bg-crimson-700 px-1.5 text-[11px] font-bold tabular-nums text-white shadow-soft ring-2 ring-white/80">#${rank}</span>
            <span class="chip bg-amber-500 text-ink-900 font-extrabold text-[10px]">★ Must Visit</span>
          </div>
        </div>
        <div class="flex flex-1 flex-col p-4 justify-between">
          <div>
            <h3 class="font-display text-[16px] font-bold leading-snug text-ink-900 group-hover:text-saffron-700 transition-colors">${item.name}</h3>
            ${item.teluguName ? `<p class="font-telugu text-xs text-saffron-700 mt-0.5 font-medium">${item.teluguName}</p>` : ''}
            <p class="mt-1 flex items-center gap-1 text-xs text-ink-600">
              <svg class="h-3.5 w-3.5 shrink-0 text-saffron-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              ${item.area}
            </p>
            <p class="mt-2 text-xs text-ink-500 line-clamp-2 leading-relaxed">${item.description || item.address || 'Explore darshan timings, special alankarams and location.'}</p>
          </div>

          <div class="pt-3 border-t border-cream-200 mt-3" onclick="event.stopPropagation()">
            ${mapUrl ? `
            <a href="${mapUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary w-full !py-2 !px-3 text-xs flex items-center justify-center gap-1.5 font-bold shadow-sm">
              <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.134 2 5 5.134 5 9C5 13.9 10.4 19.8 11.45 20.89C11.75 21.2 12.25 21.2 12.55 20.89C13.6 19.8 19 13.9 19 9C19 5.134 15.866 2 12 2Z" fill="#EA4335"/>
                <circle cx="12" cy="8.8" r="2.7" fill="#FFFFFF"/>
              </svg>
              <span>Google Maps ➔</span>
            </a>` : `
            <span class="text-xs text-ink-400 font-medium italic block text-center py-1.5">Location link not available</span>`}
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// 4. Render Area Pills
function renderAreaPills() {
  const container = document.getElementById("area-pills-container");
  if (!container) return;

  const areaCounts = {};
  currentMandapams.forEach(m => {
    const a = m.area || "Other";
    areaCounts[a] = (areaCounts[a] || 0) + 1;
  });

  container.innerHTML = `
    <button type="button" class="area-pill flex items-center gap-2 rounded-full border border-cream-300 bg-white px-4 py-2 text-sm font-medium text-ink-700 shadow-soft transition-all hover:-translate-y-0.5 hover:border-saffron-400 hover:text-saffron-700 ${activeAreaFilter === 'all' ? 'bg-saffron-50 border-saffron-500 text-saffron-700 font-bold' : ''}" onclick="filterByArea('all')">
      All Areas <span class="rounded-full bg-saffron-100 px-2 py-0.5 text-xs font-bold text-saffron-700">${currentMandapams.length}</span>
    </button>
  ` + currentAreas.map(area => {
    const count = areaCounts[area] || 0;
    const isActive = activeAreaFilter === area;
    return `
      <button type="button" class="area-pill flex items-center gap-2 rounded-full border border-cream-300 bg-white px-4 py-2 text-sm font-medium text-ink-700 shadow-soft transition-all hover:-translate-y-0.5 hover:border-saffron-400 hover:text-saffron-700 ${isActive ? 'bg-saffron-50 border-saffron-500 text-saffron-700 font-bold' : ''}" onclick="filterByArea('${area}')">
        ${area} <span class="rounded-full bg-saffron-50 px-2 py-0.5 text-xs font-bold text-saffron-700">${count}</span>
      </button>
    `;
  }).join("");
}

// 5. Render All Durga Pandals Directory (Rich Interactive Card with Direct Maps)
function renderMandapamsDirectory() {
  const container = document.getElementById("mandapams-grid");
  const countEl = document.getElementById("directory-count");
  if (!container) return;

  let filtered = currentMandapams.filter(item => {
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = item.name && item.name.toLowerCase().includes(q);
      const matchTelugu = item.teluguName && item.teluguName.toLowerCase().includes(q);
      const matchArea = item.area && item.area.toLowerCase().includes(q);
      const matchAddr = item.address && item.address.toLowerCase().includes(q);
      const matchDesc = item.description && item.description.toLowerCase().includes(q);
      if (!matchName && !matchTelugu && !matchArea && !matchAddr && !matchDesc) return false;
    }

    // Category filter match (including 'must-visit')
    if (activeCategoryFilter !== "all") {
      if (activeCategoryFilter === "must-visit") {
        const isMv = item.isMustVisit || item.category === "must-visit" || (item.categories && item.categories.includes("must-visit"));
        if (!isMv) return false;
      } else {
        if (item.category !== activeCategoryFilter && (!item.categories || !item.categories.includes(activeCategoryFilter))) return false;
      }
    }

    // Area filter match
    if (activeAreaFilter !== "all") {
      if (item.area !== activeAreaFilter) return false;
    }

    return true;
  });

  // Calculate distances if user location is known
  if (userLocation) {
    filtered.forEach(item => {
      if (item.latitude && item.longitude) {
        item.distanceKm = calculateDistance(userLocation.lat, userLocation.lng, item.latitude, item.longitude);
      } else {
        item.distanceKm = 9999;
      }
    });
    filtered.sort((a, b) => (a.distanceKm || 9999) - (b.distanceKm || 9999));
  } else {
    filtered.sort((a, b) => (a.priority || 99) - (b.priority || 99));
  }

  if (countEl) {
    countEl.textContent = `${filtered.length} Pandals`;
  }

  if (currentMandapams.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 px-6 text-center bg-white rounded-3xl border border-cream-300 p-8 shadow-soft space-y-4">
        <span class="text-4xl block">🔱</span>
        <h3 class="font-display font-bold text-xl text-ink-900">No pandals available yet</h3>
        <p class="text-xs sm:text-sm text-ink-600 max-w-md mx-auto leading-relaxed">
          Be the first to add a Durga pandal in Karimnagar. Submissions appear publicly once approved by admin.
        </p>
        <div class="pt-2">
          <a href="submit.html" class="btn-primary text-xs sm:text-sm inline-flex items-center gap-1.5 !py-3 !px-6 shadow-lift">
            <span>🔱</span>
            <span>+ Add Pandal</span>
          </a>
        </div>
      </div>
    `;
    return;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center bg-white rounded-3xl border border-cream-300 p-8 shadow-soft space-y-3">
        <span class="text-4xl block">🔍</span>
        <h3 class="font-display font-bold text-lg text-ink-900">No Matching Durga Pandals Found</h3>
        <p class="text-xs text-ink-600 max-w-md mx-auto leading-relaxed">
          Try resetting filters, selecting another area, or submit your local colony Durga pandal details to get it listed upon admin approval.
        </p>
        <div class="pt-2 flex items-center justify-center gap-3">
          <button type="button" onclick="filterByArea('all'); filterByCategory('all');" class="btn-outline text-xs !py-2.5 !px-4">
            Reset Filters
          </button>
          <a href="submit.html" class="btn-primary text-xs inline-flex items-center gap-1.5 !py-2.5 !px-5 shadow-md">
            <span>+ Add Pandal</span>
          </a>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => {
    const photo = (item.photos && item.photos.length > 0) ? (typeof item.photos[0] === 'string' ? item.photos[0] : item.photos[0].url) : "assets/images/hero-durga.jpg";
    const mapUrl = getGoogleMapsUrl(item);
    const isMv = item.isMustVisit || item.category === 'must-visit' || (item.categories && item.categories.includes('must-visit'));
    const distanceBadge = (typeof item.distanceKm === 'number' && item.distanceKm < 999)
      ? `<span class="chip bg-emerald-600 text-white font-bold text-[10px]">📍 ${item.distanceKm.toFixed(1)} km away</span>`
      : '';

    return `
      <div class="group flex flex-col overflow-hidden rounded-2xl border border-cream-300/90 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift cursor-pointer" onclick="openPandalDetailsModal('${item.id}')">
        <div class="relative aspect-[4/3] overflow-hidden bg-cream-100">
          <img src="${photo}" alt="${item.name}" loading="lazy" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" onerror="this.src='assets/images/hero-durga.jpg'" />
          <div class="absolute left-2.5 top-2.5 flex items-center gap-1.5">
            ${isMv ? '<span class="chip bg-amber-500 text-ink-900 font-extrabold text-[10px]">★ Must Visit</span>' : ''}
            ${distanceBadge}
          </div>
        </div>
        <div class="flex flex-1 flex-col p-3 sm:p-4 justify-between">
          <div>
            <h3 class="font-display text-sm sm:text-[15px] font-bold leading-snug text-ink-900 group-hover:text-saffron-700 transition-colors line-clamp-2">${item.name}</h3>
            ${item.teluguName ? `<p class="font-telugu text-[11px] sm:text-xs text-saffron-700 mt-0.5 font-medium truncate">${item.teluguName}</p>` : ''}
            <p class="mt-1.5 sm:mt-2 flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-ink-600 truncate">
              <svg class="h-3.5 w-3.5 shrink-0 text-saffron-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              <span class="truncate">${item.area}</span>
            </p>
            <p class="mt-1.5 sm:mt-2 text-[11px] sm:text-xs text-ink-500 line-clamp-2 leading-relaxed">${item.description || item.address || 'Explore darshan timings and location.'}</p>
          </div>

          <!-- Direct Map Action -->
          <div class="pt-2.5 sm:pt-3 border-t border-cream-200 mt-2.5 sm:mt-3" onclick="event.stopPropagation()">
            ${mapUrl ? `
            <a href="${mapUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary w-full !py-1.5 sm:!py-2 !px-2 sm:!px-3 text-[11px] sm:text-xs flex items-center justify-center gap-1 font-bold shadow-sm">
              <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.134 2 5 5.134 5 9C5 13.9 10.4 19.8 11.45 20.89C11.75 21.2 12.25 21.2 12.55 20.89C13.6 19.8 19 13.9 19 9C19 5.134 15.866 2 12 2Z" fill="#EA4335"/>
                <circle cx="12" cy="8.8" r="2.7" fill="#FFFFFF"/>
              </svg>
              <span>Google Maps ➔</span>
            </a>` : `
            <span class="text-[11px] sm:text-xs text-ink-400 font-medium italic block text-center py-1 sm:py-1.5">Location not available</span>`}
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// Open Pandal Details in Full Screen Page
function openPandalDetailsModal(pandalId) {
  if (pandalId) {
    window.location.href = `pandal.html?id=${encodeURIComponent(pandalId)}`;
  }
}

function handleWhatsAppShareItem(name, area, mapUrl, pandalId) {
  const origin = window.location.origin;
  const siteUrl = pandalId ? `${origin}/pandal.html?id=${encodeURIComponent(pandalId)}` : origin;
  let text = "";
  if (name && mapUrl) {
    text = `🕉️ *${name}* (${area || 'Karimnagar'})\n\n📍 Google Maps Navigation:\n👉 ${mapUrl}\n\n🔱 View full idol details on Karimnagar Durga Idol Finder:\n👉 ${siteUrl}`;
  } else {
    text = `🕉️ *Karimnagar Durga Idol Finder*\n\nFind all sacred Durga Devi pandals, Navratri mandapams & live GPS locations across Karimnagar!\n\n👉 ${origin}`;
  }

  const encodedText = encodeURIComponent(text);
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || navigator.vendor || window.opera);
  const waUrl = isMobile
    ? `whatsapp://send?text=${encodedText}`
    : `https://api.whatsapp.com/send?text=${encodedText}`;

  if (isMobile) {
    window.location.href = waUrl;
    setTimeout(() => {
      window.open(`https://api.whatsapp.com/send?text=${encodedText}`, "_blank");
    }, 600);
  } else {
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, "_blank");
  }
}

// 6. Render CTA & Footer
function renderCtaAndFooter() {
  const cfg = currentSiteConfig;
  const ctaTitleEl = document.getElementById("cta-title");
  if (ctaTitleEl) ctaTitleEl.textContent = cfg.ctaSection?.title || "Be a Part of the Navratri Celebration";


  const ctaDescEl = document.getElementById("cta-desc");
  if (ctaDescEl) ctaDescEl.textContent = cfg.ctaSection?.description || "Know a Durga Mata pandal that's not listed? Add it!";

  const ctaQuoteEl = document.getElementById("cta-quote");
  if (ctaQuoteEl) ctaQuoteEl.textContent = cfg.ctaSection?.quoteText || "“May Goddess Durga bring peace, health, and prosperity” 🔱";

  const footerDevsEl = document.getElementById("footer-developers");
  if (footerDevsEl) {
    const devName = cfg.footer?.developerNames || "@chintuvarun_3008";
    footerDevsEl.textContent = devName.startsWith("@") ? devName : `@${devName}`;
    if (footerDevsEl.tagName === "A") {
      const handle = devName.replace("@", "");
      footerDevsEl.href = `https://instagram.com/${handle}`;
    }
  }

  const footerCopyEl = document.getElementById("footer-copyright");
  if (footerCopyEl) {
    footerCopyEl.textContent = cfg.footer?.copyrightText || "Karimnagar Durga Idol Finder © 2026 | Celebrate Culture | Support Local | Keep Karimnagar Beautiful";
  }
}

// 7. Interactive Map Initialization
function initLeafletMap() {
  try {
    const mapContainer = document.getElementById("leaflet-map-container");
    if (!mapContainer) return;

    if (typeof L === "undefined") {
      console.warn("Leaflet library not loaded");
      return;
    }

    const centerLat = 18.4386;
    const centerLng = 79.1288;

    if (!leafletMap) {
      if (mapContainer._leaflet_id) {
        delete mapContainer._leaflet_id;
      }

      leafletMap = L.map("leaflet-map-container", {
        center: [centerLat, centerLng],
        zoom: 14,
        maxZoom: 20,
        zoomControl: true,
        scrollWheelZoom: true,
        attributionControl: false
      });

      // 100% Free Authentic Google Maps Tiles (Roadmap only, satellite removed per request)
      const googleRoadmapTile = L.tileLayer('https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 20,
        attribution: '&copy; Google Maps'
      });
      googleRoadmapTile.addTo(leafletMap);

      setTimeout(() => {
        if (leafletMap) leafletMap.invalidateSize();
      }, 250);
    }

    // Clear existing markers safely without recreating map canvas
    mapMarkers.forEach(m => {
      try { leafletMap.removeLayer(m); } catch (e) {}
    });
    mapMarkers = [];

    // Group pandals by coordinates (~10m)
    const groups = new Map();
    currentMandapams.forEach(item => {
      const lat = parseFloat(item.latitude);
      const lng = parseFloat(item.longitude);
      if (isNaN(lat) || isNaN(lng)) return;
      const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
      if (!groups.has(key)) {
        groups.set(key, { lat, lng, items: [] });
      }
      groups.get(key).items.push(item);
    });

    groups.forEach((group, gKey) => {
      const count = group.items.length;
      const safeId = String(gKey).replace(/[^a-zA-Z0-9_-]/g, '_');

      const trishulPinHtml = `
        <div class="trishul-pin-marker" style="position:relative; width:44px; height:52px; cursor:pointer; filter:drop-shadow(0 4px 10px rgba(126,12,28,0.55));">
          <svg xmlns="http://www.w3.org/2000/svg" width="44" height="52" viewBox="0 0 44 52">
            <defs>
              <linearGradient id="pinGradApp_${safeId}" x1="0" y1="0" x2="40" y2="52" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#dc2626"/>
                <stop offset="45%" stop-color="#b91c1c"/>
                <stop offset="100%" stop-color="#7f1d1d"/>
              </linearGradient>
              <linearGradient id="goldTrishApp_${safeId}" x1="0" y1="0" x2="0" y2="24" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#fef08a"/>
                <stop offset="50%" stop-color="#eab308"/>
                <stop offset="100%" stop-color="#ca8a04"/>
              </linearGradient>
            </defs>
            <path d="M20 1C9.5 1 1 9.5 1 20C1 33.5 18 50 19.2 51.1C19.6 51.5 20.4 51.5 20.8 51.1C22 50 39 33.5 39 20C39 9.5 30.5 1 20 1Z" 
                  fill="url(#pinGradApp_${safeId})" stroke="#ffd700" stroke-width="2"/>
            <circle cx="20" cy="20" r="13.5" fill="#ffffff" stroke="#f59e0b" stroke-width="1.8"/>
            <g transform="translate(8, 8)">
              <path d="M12 1.5 L14.2 6.5 L12.9 6.5 L12.9 15 L11.1 15 L11.1 6.5 L9.8 6.5 Z" fill="url(#goldTrishApp_${safeId})"/>
              <path d="M4.5 4 C4.2 8.5 7.8 12.8 11.1 13.5 L11.1 11.5 C8.5 11 6.5 8 6.8 5 C7.8 6.8 9.3 7.8 11.1 8.2 L11.1 6.8 C9 6.3 7.2 5 6.5 4 Z" fill="url(#goldTrishApp_${safeId})"/>
              <path d="M19.5 4 C19.8 8.5 16.2 12.8 12.9 13.5 L12.9 11.5 C15.5 11 17.5 8 17.2 5 C16.2 6.8 14.7 7.8 12.9 8.2 L12.9 6.8 C15 6.3 16.8 5 17.5 4 Z" fill="url(#goldTrishApp_${safeId})"/>
              <ellipse cx="12" cy="14.5" rx="3.8" ry="1.2" fill="#d97706"/>
              <rect x="11.1" y="14.5" width="1.8" height="7.5" fill="url(#goldTrishApp_${safeId})"/>
              <circle cx="12" cy="22.5" r="1.3" fill="#d97706"/>
            </g>
          </svg>
        </div>
      `;

      const customIcon = L.divIcon({
        className: "trishul-pin-marker",
        html: trishulPinHtml,
        iconSize: [44, 52],
        iconAnchor: [20, 51],
        popupAnchor: [0, -48]
      });

      const firstItem = group.items[0];
      const marker = L.marker([group.lat, group.lng], { icon: customIcon }).addTo(leafletMap);
      marker._pandalData = firstItem;
      marker._pandalItems = group.items;
      mapMarkers.push(marker);
    });

    // Populate map colony dropdown
    populateMapColonySelect();
  } catch (mapErr) {
    console.warn("Map init notice:", mapErr);
  }
}

// Populate Colony/Area selector for map navigation
function populateMapColonySelect() {
  const selectEl = document.getElementById("map-colony-select");
  if (!selectEl) return;
  const currentVal = selectEl.value;
  selectEl.innerHTML = `<option value="all">🗺️ All Karimnagar Areas</option>` +
    currentAreas.map(area => `<option value="${area}">${area}</option>`).join("");
  if (currentVal && (currentVal === "all" || currentAreas.includes(currentVal))) {
    selectEl.value = currentVal;
  }
}

// Map colony change handler
function handleMapColonyChange(area) {
  if (!leafletMap) return;
  if (area === "all") {
    leafletMap.flyTo([18.4386, 79.1288], 14, { duration: 1.2 });
    return;
  }
  // Find pandals in this area
  const matching = currentMandapams.filter(m => m.area === area && m.latitude && m.longitude);
  if (matching.length > 0) {
    const first = matching[0];
    leafletMap.flyTo([first.latitude, first.longitude], 16, { duration: 1.2 });
    // Open popup of first marker
    const marker = mapMarkers.find(m => m._pandalData && m._pandalData.id === first.id);
    if (marker) {
      setTimeout(() => marker.openPopup(), 1300);
    }
  } else if (typeof KARIMNAGAR_COLONY_COORDS !== "undefined" && KARIMNAGAR_COLONY_COORDS[area]) {
    const coords = KARIMNAGAR_COLONY_COORDS[area];
    leafletMap.flyTo(coords, 16, { duration: 1.2 });
  } else {
    const landmarks = window.KARIMNAGAR_LANDMARKS || {};
    const coords = landmarks[area];
    if (coords) {
      leafletMap.flyTo(coords, 16, { duration: 1.2 });
    }
  }
}

// Quick map search
async function handleMapQuickSearch(query) {
  if (!leafletMap) return;
  const q = (query || "").toLowerCase().trim();
  if (!q) return;
  const match = currentMandapams.find(m => 
    m.latitude && m.longitude &&
    ((m.name && m.name.toLowerCase().includes(q)) || 
     (m.area && m.area.toLowerCase().includes(q)) || 
     (m.address && m.address.toLowerCase().includes(q)))
  );
  if (match) {
    leafletMap.flyTo([match.latitude, match.longitude], 16, { duration: 1.2 });
    const marker = mapMarkers.find(m => m._pandalData && m._pandalData.id === match.id);
    if (marker) {
      setTimeout(() => marker.openPopup(), 1300);
    }
    return;
  }
  if (typeof KARIMNAGAR_COLONY_COORDS !== "undefined") {
    const colonyKey = Object.keys(KARIMNAGAR_COLONY_COORDS).find(k => k.toLowerCase().includes(q));
    if (colonyKey) {
      const coords = KARIMNAGAR_COLONY_COORDS[colonyKey];
      leafletMap.flyTo(coords, 16, { duration: 1.2 });
      return;
    }
  }
  if (typeof resolvePlaceToCoordinates === "function") {
    const place = await resolvePlaceToCoordinates(q);
    if (place) {
      leafletMap.flyTo([place.lat, place.lng], 16, { duration: 1.2 });
    }
  }
}

// 8. Event Listeners & Filter Handlers
function setupEventListeners() {
  const searchForm = document.getElementById("main-search-form");
  const searchInput = document.getElementById("main-search-input");

  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      searchQuery = searchInput.value;
      renderMandapamsDirectory();
      const dirSection = document.getElementById("directory-section");
      if (dirSection) dirSection.scrollIntoView({ behavior: "smooth" });
    });

    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderMandapamsDirectory();
    });
  }

  const devModal = document.getElementById("developer-popup-modal");
  if (devModal) {
    devModal.addEventListener("click", (e) => {
      if (e.target === devModal) {
        closeDeveloperPopup();
      }
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDeveloperPopup();
    }
  });
}

function filterByCategory(cat) {
  activeCategoryFilter = cat;
  document.querySelectorAll(".category-filter-btn").forEach(btn => {
    btn.classList.remove("bg-saffron-500", "text-white");
    btn.classList.add("bg-white", "text-ink-700");
  });
  const btn = document.getElementById(`cat-filter-${cat}`);
  if (btn) {
    btn.classList.add("bg-saffron-500", "text-white");
    btn.classList.remove("bg-white", "text-ink-700");
  }
  renderMandapamsDirectory();
}

function filterByArea(area) {
  activeAreaFilter = area;
  if (typeof hideGpsNotificationBanner === "function") {
    hideGpsNotificationBanner();
  }
  renderAreaPills();
  renderMandapamsDirectory();
  const dirSection = document.getElementById("directory-section");
  if (dirSection) dirSection.scrollIntoView({ behavior: "smooth" });
}

function clearAllFilters() {
  searchQuery = "";
  activeCategoryFilter = "all";
  activeAreaFilter = "all";
  if (typeof hideGpsNotificationBanner === "function") {
    hideGpsNotificationBanner();
  }
  const searchInput = document.getElementById("main-search-input");
  if (searchInput) searchInput.value = "";
  renderAreaPills();
  renderMandapamsDirectory();
}

function handleUseMyLocation() {
  const btn = document.getElementById("btn-use-location");
  const origBtnHtml = btn ? btn.innerHTML : "<span>📍 Use My Location</span>";

  if (typeof detectUserGpsLocation !== "function") {
    console.error("detectUserGpsLocation is not defined");
    return;
  }

  detectUserGpsLocation({
    onStart: () => {
      if (btn) {
        btn.innerHTML = `<span class="inline-flex items-center gap-1.5"><svg class="animate-spin w-4 h-4 text-saffron-600" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg> <span>Locating GPS...</span></span>`;
        btn.disabled = true;
      }
      if (typeof hideGpsNotificationBanner === "function") {
        hideGpsNotificationBanner();
      }
    },
    onStatus: (msg) => {
      if (btn) {
        const textSpan = btn.querySelector("span span");
        if (textSpan) textSpan.textContent = msg;
      }
    },
    onSuccess: (pos) => {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<span class="text-emerald-700 font-bold flex items-center gap-1"><span>✓</span> <span>Near You</span></span>`;
      }
      if (typeof hideGpsNotificationBanner === "function") {
        hideGpsNotificationBanner();
      }

      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const accuracy = pos.coords.accuracy;

      userLocation = { lat, lng, accuracy };

      // Update directory with distance sorting
      renderMandapamsDirectory();

      // Pan & update map if present on page
      if (typeof homeGoogleMap !== "undefined" && homeGoogleMap && window.google) {
        homeGoogleMap.panTo({ lat, lng });
        homeGoogleMap.setZoom(15);
        if (typeof homeUserLocationMarker !== "undefined" && homeUserLocationMarker) {
          if (homeUserLocationMarker.setMap) homeUserLocationMarker.setMap(null);
        }
        homeUserLocationMarker = new google.maps.Marker({
          position: { lat, lng },
          map: homeGoogleMap,
          title: "Your Current Location",
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 9,
            fillColor: "#2563eb",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 3
          }
        });
      } else if (typeof homeLeafletMap !== "undefined" && homeLeafletMap) {
        homeLeafletMap.flyTo([lat, lng], 15, { duration: 1.2 });
        if (typeof homeUserLocationMarker !== "undefined" && homeUserLocationMarker) {
          try { homeLeafletMap.removeLayer(homeUserLocationMarker); } catch (e) {}
        }
        homeUserLocationMarker = L.marker([lat, lng], {
          icon: L.divIcon({
            className: "user-loc-pin",
            html: `<div style="background:#2563eb; width:22px; height:22px; border-radius:50%; border:3px solid white; box-shadow:0 0 14px rgba(37,99,235,0.8);"></div>`,
            iconSize: [22, 22],
            iconAnchor: [11, 11]
          })
        }).addTo(homeLeafletMap);
      } else if (typeof leafletMap !== "undefined" && leafletMap) {
        leafletMap.flyTo([lat, lng], 15, { duration: 1.2 });
      }

      // Smooth scroll to directory to view nearby pandals
      const dirSection = document.getElementById("directory-section");
      if (dirSection) {
        dirSection.scrollIntoView({ behavior: "smooth" });
      }
    },
    onError: (errInfo) => {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = origBtnHtml || `<span>📍 Use My Location</span>`;
      }
      if (typeof showGpsNotificationBanner === "function") {
        showGpsNotificationBanner(errInfo, handleUseMyLocation);
      } else if (errInfo && errInfo.message) {
        alert(errInfo.message);
      }
    }
  });
}

if (typeof window !== "undefined") {
  window.handleUseMyLocation = handleUseMyLocation;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
