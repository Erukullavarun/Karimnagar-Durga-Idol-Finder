// Main Frontend Application Logic for Karimnagar Durga Idol Finder

let currentSiteConfig = getSiteConfig();
let currentMandapams = getMandapams().filter(m => m.isVerified === true || m.status === 'approved');
let currentAreas = getAreasList();

let activeCategoryFilter = "all";
let activeAreaFilter = "all";
let searchQuery = "";
let userLocation = null;
let leafletMap = null;
let mapMarkers = [];

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  // 1. Initial immediate render from local cache so page is never blank
  initApp();

  // 2. Pull server data and fresh approved pandals from backend
  syncIndexData();
  setupEventListeners();

  // 3. Real-time cross-tab & cross-browser synchronization
  if (typeof listenDataChange === "function") {
    listenDataChange(() => {
      syncIndexData();
    });
  }

  // Multi-browser live polling: updates immediately when admin approves in another browser (Edge/Chrome/Mobile)
  setInterval(() => {
    syncIndexData();
  }, 4000);

  window.addEventListener("focus", () => {
    syncIndexData();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      syncIndexData();
    }
  });
});

function syncIndexData() {
  fetch(getApiUrl("/api/mandapams?_t=" + Date.now()))
    .then(r => r.json())
    .then(res => {
      if (res && res.success && Array.isArray(res.mandapams)) {
        // Authoritative list of approved pandals directly from server
        currentMandapams = res.mandapams;
        safeSaveMandapams(res.mandapams);
      } else {
        currentMandapams = getMandapams().filter(m => m.isVerified === true || m.status === 'approved');
      }
      if (window._userActiveMapSearch) {
        return;
      }
      renderAllViews();
    })
    .catch(() => {
      pullServerData(() => {
        currentMandapams = getMandapams().filter(m => m.isVerified === true || m.status === 'approved');
        if (window._userActiveMapSearch) return;
        renderAllViews();
      });
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
  initLeafletMap();
}

function initApp() {
  currentSiteConfig = getSiteConfig();
  currentMandapams = getMandapams().filter(m => m.isVerified === true || m.status === 'approved');
  currentAreas = getAreasList();
  renderAllViews();
}

// Optional developer modal (only opens if explicitly triggered)
function openDeveloperPopup() {
  const modal = document.getElementById("developer-popup-modal");
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
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

          <div class="pt-3 border-t border-cream-200 mt-3 flex items-center gap-2" onclick="event.stopPropagation()">
            <a href="pandal.html?id=${encodeURIComponent(item.id)}" class="px-3.5 py-2.5 rounded-xl bg-saffron-50 text-saffron-700 border border-saffron-200 text-xs font-bold hover:bg-saffron-100 transition min-h-[42px] flex items-center justify-center">
              View Details
            </a>
            <a href="${mapUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary !py-2.5 !px-3.5 text-xs flex-1 flex items-center justify-center gap-1.5 font-bold shadow-sm min-h-[42px]">
              <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.134 2 5 5.134 5 9C5 13.9 10.4 19.8 11.45 20.89C11.75 21.2 12.25 21.2 12.55 20.89C13.6 19.8 19 13.9 19 9C19 5.134 15.866 2 12 2Z" fill="#EA4335"/>
                <circle cx="12" cy="8.8" r="2.7" fill="#FFFFFF"/>
              </svg>
              <span>Maps</span>
            </a>
            <button type="button" onclick="handleWhatsAppShareItem('${item.name}', '${item.area}', '${mapUrl}', '${item.id}')" class="h-10 w-10 min-w-[40px] min-h-[40px] rounded-xl bg-emerald-50 text-[#25D366] hover:bg-[#25D366] hover:text-white border border-emerald-300 grid place-items-center text-xs shadow-soft transition cursor-pointer" title="Share on WhatsApp">
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
            </button>
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

// Helper to match typed search query to a Karimnagar location, colony, or coordinates
function findLocationMatch(query) {
  if (!query || typeof query !== "string") return null;
  const q = query.trim().toLowerCase();
  if (!q) return null;

  // 1. Raw GPS coordinates: e.g. "18.4386, 79.1288" or "18.4386 79.1288"
  const rawMatch = q.match(/^([+-]?\d{1,2}\.\d+)[,\s]+([+-]?\d{1,3}\.\d+)$/);
  if (rawMatch) {
    const lat = parseFloat(rawMatch[1]);
    const lng = parseFloat(rawMatch[2]);
    if (!isNaN(lat) && !isNaN(lng) && lat >= 17.5 && lat <= 19.5 && lng >= 78.0 && lng <= 80.5) {
      return {
        name: `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`,
        lat: lat,
        lng: lng,
        isCoords: true
      };
    }
  }

  // 2. Karimnagar Colony presets matching
  const coordsObj = window.KARIMNAGAR_COLONY_COORDS || (typeof KARIMNAGAR_COLONY_COORDS !== "undefined" ? KARIMNAGAR_COLONY_COORDS : null);
  if (coordsObj) {
    // Exact match
    for (const [colony, coords] of Object.entries(coordsObj)) {
      if (colony.toLowerCase() === q) {
        return { name: colony, lat: coords[0], lng: coords[1] };
      }
    }

    // Common synonyms & aliases
    const aliases = {
      "tower": "Tower Circle",
      "circle": "Tower Circle",
      "clock tower": "Tower Circle",
      "old clock tower": "Tower Circle",
      "collector": "Collectorate Chowrasta",
      "collectorate": "Collectorate Chowrasta",
      "collector office": "Collectorate Chowrasta",
      "bus stand": "Karimnagar Bus Stand",
      "rtc bus stand": "Karimnagar Bus Stand",
      "railway": "Karimnagar Railway Station",
      "railway station": "Karimnagar Railway Station",
      "train": "Karimnagar Railway Station",
      "hospital": "Civil Hospital",
      "civil hospital": "Civil Hospital",
      "circus": "Circus Ground",
      "circus ground": "Circus Ground",
      "kaman": "Kaman Chowrasta",
      "kaman chowrasta": "Kaman Chowrasta",
      "geetha bhavan": "Geetha Bhavan",
      "githa bhavan": "Geetha Bhavan",
      "sapthagiri": "Sapthagiri Colony",
      "mukarampura": "Mukarampura",
      "mankamma": "Mankammathota",
      "mankammathota": "Mankammathota",
      "court": "Court Road",
      "court road": "Court Road",
      "housing board": "Housing Board Colony",
      "bhagath": "Bhagathnagar",
      "bhagathnagar": "Bhagathnagar",
      "kishan nagar": "Kishan Nagar",
      "kishannagar": "Kishan Nagar",
      "sawaran": "Sawaran Street",
      "sawaran street": "Sawaran Street",
      "sitarampur": "Sitarampur",
      "lmd": "Lower Manair Dam (LMD)",
      "dam": "Lower Manair Dam (LMD)",
      "ujwala": "Ujwala Park",
      "ujwala park": "Ujwala Park",
      "deer park": "Deer Park",
      "kothapalli": "Kothapalli",
      "rekurthi": "Rekurthi",
      "alugunoor": "Alugunoor",
      "alugunur": "Alugunoor",
      "subhash": "Subhashnagar",
      "subhash nagar": "Subhashnagar",
      "subhashnagar": "Subhashnagar",
      "padmanagar": "Padmanagar",
      "padma nagar": "Padmanagar",
      "chinthakunta": "Chinthakunta",
      "ganesh nagar": "Ganeshnagar",
      "ganeshnagar": "Ganeshnagar",
      "ramnagar": "Ramnagar",
      "ram nagar": "Ramnagar",
      "kashmirgadda": "Kashmirgadda",
      "kashmir gadda": "Kashmirgadda",
      "karkhanagadda": "Karkhanagadda",
      "vidyanagar": "Vidyanagar",
      "vijayanagar": "Vijayanagar"
    };

    for (const [alias, canonical] of Object.entries(aliases)) {
      if (q === alias || q.includes(alias)) {
        if (coordsObj[canonical]) {
          return { name: canonical, lat: coordsObj[canonical][0], lng: coordsObj[canonical][1] };
        }
      }
    }

    // Substring match in colony names
    for (const [colony, coords] of Object.entries(coordsObj)) {
      if (colony.toLowerCase().includes(q)) {
        return { name: colony, lat: coords[0], lng: coords[1] };
      }
    }
  }

  return null;
}

function clearLocationSearch() {
  searchQuery = "";
  const inp = document.getElementById("main-search-input");
  if (inp) inp.value = "";
  renderMandapamsDirectory();
}

// 5. Render All Durga Pandals Directory (Rich Interactive Grid with Nearest Distance Sorting)
function renderMandapamsDirectory() {
  const container = document.getElementById("mandapams-grid");
  const countEl = document.getElementById("directory-count");
  if (!container) return;

  const locMatch = findLocationMatch(searchQuery);
  const effectiveRefLocation = locMatch ? { lat: locMatch.lat, lng: locMatch.lng, name: locMatch.name } : userLocation;

  let filtered = currentMandapams.filter(item => {
    // If user searched a location name or coordinates, do not filter out pandals by text mismatch;
    // instead show all pandals sorted by nearest distance!
    // If user typed a non-location term (e.g. pandal name or deity), filter by text:
    if (searchQuery.trim() && !locMatch) {
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

  // Calculate distances if reference location is known (from typed location or GPS)
  if (effectiveRefLocation && typeof effectiveRefLocation.lat === "number" && typeof effectiveRefLocation.lng === "number") {
    filtered.forEach(item => {
      if (item.latitude && item.longitude) {
        item.distanceKm = calculateDistance(effectiveRefLocation.lat, effectiveRefLocation.lng, item.latitude, item.longitude);
        item.distanceRefName = effectiveRefLocation.name || null;
      } else {
        item.distanceKm = 9999;
        item.distanceRefName = null;
      }
    });
    // Sort strictly nearest first
    filtered.sort((a, b) => (a.distanceKm || 9999) - (b.distanceKm || 9999));
  } else {
    filtered.sort((a, b) => (a.priority || 99) - (b.priority || 99));
  }

  if (countEl) {
    countEl.textContent = `${filtered.length} Pandals`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center bg-white rounded-3xl border border-cream-300 p-8 shadow-soft space-y-3">
        <span class="text-4xl block">🔱</span>
        <h3 class="font-display font-bold text-lg text-ink-900">No Durga Pandals Found</h3>
        <p class="text-xs text-ink-600 max-w-md mx-auto leading-relaxed">
          Try selecting another category or area, or submit your local colony Durga pandal details to get it listed upon admin approval.
        </p>
        <div class="pt-2">
          <a href="submit.html" class="btn-primary text-xs inline-flex items-center gap-1.5 !py-2.5 !px-5 shadow-md">
            <span>+ Add Durga Mandapam</span>
          </a>
        </div>
      </div>
    `;
    return;
  }

  // Location banner when user searched an exact location or colony
  let locationBannerHtml = "";
  if (locMatch) {
    locationBannerHtml = `
      <div class="col-span-full mb-2 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div class="flex items-center gap-3">
          <span class="text-2xl sm:text-3xl">📍</span>
          <div>
            <h4 class="font-display font-bold text-sm sm:text-base text-ink-900 leading-tight">
              Showing Nearest Pandals to <span class="text-saffron-700 underline font-extrabold">${locMatch.name}</span>
            </h4>
            <p class="text-xs text-amber-800 mt-0.5">
              Ranked in order of closest walking & driving proximity in Karimnagar.
            </p>
          </div>
        </div>
        <button type="button" onclick="clearLocationSearch()" class="shrink-0 text-xs font-bold text-saffron-700 hover:text-white hover:bg-saffron-600 bg-white px-3.5 py-2 rounded-xl border border-amber-300 shadow-xs transition cursor-pointer">
          ✕ Clear / Show All
        </button>
      </div>
    `;
  }

  container.innerHTML = locationBannerHtml + filtered.map(item => {
    const photo = (item.photos && item.photos.length > 0) ? (typeof item.photos[0] === 'string' ? item.photos[0] : item.photos[0].url) : "assets/images/hero-durga.jpg";
    const mapUrl = getGoogleMapsUrl(item);
    const isMv = item.isMustVisit || item.category === 'must-visit' || (item.categories && item.categories.includes('must-visit'));
    
    let distanceBadge = '';
    if (typeof item.distanceKm === 'number' && item.distanceKm < 999) {
      if (item.distanceRefName) {
        if (item.distanceKm < 1) {
          distanceBadge = `<span class="chip bg-emerald-600 text-white font-bold text-[10px] shadow-xs">📍 ${Math.round(item.distanceKm * 1000)}m from ${item.distanceRefName}</span>`;
        } else {
          distanceBadge = `<span class="chip bg-emerald-600 text-white font-bold text-[10px] shadow-xs">📍 ${item.distanceKm.toFixed(1)} km from ${item.distanceRefName}</span>`;
        }
      } else {
        if (item.distanceKm < 1) {
          distanceBadge = `<span class="chip bg-emerald-600 text-white font-bold text-[10px] shadow-xs">📍 ${Math.round(item.distanceKm * 1000)}m away</span>`;
        } else {
          distanceBadge = `<span class="chip bg-emerald-600 text-white font-bold text-[10px] shadow-xs">📍 ${item.distanceKm.toFixed(1)} km away</span>`;
        }
      }
    }

    return `
      <div class="group flex flex-col overflow-hidden rounded-2xl border border-cream-300/90 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift cursor-pointer" onclick="openPandalDetailsModal('${item.id}')">
        <div class="relative aspect-[4/3] overflow-hidden bg-cream-100">
          <img src="${photo}" alt="${item.name}" loading="lazy" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" onerror="this.src='assets/images/hero-durga.jpg'" />
          <div class="absolute left-2.5 top-2.5 flex flex-wrap items-center gap-1.5">
            ${isMv ? '<span class="chip bg-amber-500 text-ink-900 font-extrabold text-[10px]">★ Must Visit</span>' : ''}
            ${distanceBadge}
          </div>
          <div class="absolute right-2.5 bottom-2.5">
            <span class="chip bg-black/60 backdrop-blur text-white text-[10px] font-semibold">🔍 View Details</span>
          </div>
        </div>
        <div class="flex flex-1 flex-col p-2.5 sm:p-4 justify-between">
          <div>
            <h3 class="font-display text-xs sm:text-[15px] font-bold leading-tight text-ink-900 group-hover:text-saffron-700 transition-colors line-clamp-1">${item.name}</h3>
            ${item.teluguName ? `<p class="font-telugu text-[11px] sm:text-xs text-saffron-700 mt-0.5 font-medium line-clamp-1">${item.teluguName}</p>` : ''}
            <p class="mt-1 sm:mt-1.5 flex items-center gap-1 text-[11px] sm:text-xs text-ink-600">
              <svg class="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 text-saffron-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              <span class="truncate">${item.area}</span>
            </p>
            <p class="mt-1 text-[11px] text-ink-500 line-clamp-1 sm:line-clamp-2 leading-relaxed hidden sm:block">${item.description || item.address || 'Explore darshan timings and location.'}</p>
          </div>

          <!-- Direct Map & WhatsApp Actions & View Details -->
          <div class="pt-2 border-t border-cream-200 mt-2 flex items-center gap-1.5" onclick="event.stopPropagation()">
            <a href="pandal.html?id=${encodeURIComponent(item.id)}" class="flex-1 py-1.5 sm:py-2 px-1 rounded-xl bg-saffron-50 hover:bg-saffron-100 text-saffron-700 border border-saffron-200 text-[11px] sm:text-xs font-bold text-center transition min-h-[34px] sm:min-h-[38px] flex items-center justify-center">
              Details
            </a>
            <a href="${mapUrl}" target="_blank" rel="noopener noreferrer" class="flex-1 py-1.5 sm:py-2 px-1 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white text-[11px] sm:text-xs font-bold text-center transition min-h-[34px] sm:min-h-[38px] flex items-center justify-center gap-1 shadow-xs">
              <svg class="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.134 2 5 5.134 5 9C5 13.9 10.4 19.8 11.45 20.89C11.75 21.2 12.25 21.2 12.55 20.89C13.6 19.8 19 13.9 19 9C19 5.134 15.866 2 12 2Z" fill="#EA4335"/>
                <circle cx="12" cy="8.8" r="2.7" fill="#FFFFFF"/>
              </svg>
              <span>Maps</span>
            </a>
            <button type="button" onclick="handleWhatsAppShareItem('${item.name}', '${item.area}', '${mapUrl}', '${item.id}')" class="h-[34px] w-[34px] sm:h-[38px] sm:w-[38px] min-w-[34px] rounded-xl bg-emerald-50 text-[#25D366] hover:bg-[#25D366] hover:text-white border border-emerald-300 grid place-items-center text-xs shadow-soft transition cursor-pointer" title="Share on WhatsApp">
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
            </button>
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

    if (leafletMap) {
      try { leafletMap.remove(); } catch (e) {}
      leafletMap = null;
    }

    if (mapContainer._leaflet_id) {
      mapContainer._leaflet_id = null;
    }

    const centerLat = 18.4386;
    const centerLng = 79.1288;

    leafletMap = L.map("leaflet-map-container", {
      center: [centerLat, centerLng],
      zoom: 14,
      maxZoom: 20,
      zoomControl: true,
      scrollWheelZoom: true,
      attributionControl: false
    });

    // Authentic Google Maps Roadmap & Satellite Layers
    const googleRoadLayer = L.tileLayer('https://mt{s}.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}', {
      subdomains: ['0', '1', '2', '3'],
      maxZoom: 20,
      attribution: '&copy; Google Maps'
    }).addTo(leafletMap);

    const osmLayer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    });

    const satelliteLayer = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 19,
      attribution: "Tiles &copy; Esri"
    });

    try {
      L.control.layers({
        "🗺️ Google Roadmap": googleRoadLayer,
        "📍 OpenStreetMap": osmLayer,
        "🛰️ Google Satellite": satelliteLayer
      }, null, { position: 'topright' }).addTo(leafletMap);
    } catch (e) {}

    setTimeout(() => {
      if (leafletMap) leafletMap.invalidateSize();
    }, 250);

    mapMarkers = [];

    // Filter valid approved pandals
    const validPandals = currentMandapams.filter(item => {
      const lat = parseFloat(item.latitude);
      const lng = parseFloat(item.longitude);
      return !isNaN(lat) && !isNaN(lng) && lat >= 8.0 && lat <= 37.5 && lng >= 68.0 && lng <= 97.5;
    });

    // Group pandals at same location
    const groups = new Map();
    validPandals.forEach(item => {
      const lat = parseFloat(item.latitude);
      const lng = parseFloat(item.longitude);
      const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
      if (!groups.has(key)) {
        groups.set(key, { lat, lng, items: [] });
      }
      groups.get(key).items.push(item);
    });

    groups.forEach(group => {
      const count = group.items.length;
      const badgeHtml = count > 1
        ? `<span style="position:absolute; top:-4px; right:-6px; background:#d4af37; color:#770e17; font-weight:800; font-size:10px; width:18px; height:18px; border-radius:50%; display:grid; place-items:center; border:2px solid #fff; box-shadow:0 2px 5px rgba(0,0,0,0.3);">${count}</span>`
        : '';

      const trishulIcon = L.divIcon({
        className: "trishul-marker-icon",
        html: `<div style="position:relative; background:linear-gradient(135deg, #b8232e, #770e17); color:#fff; width:36px; height:36px; border-radius:50%; display:grid; place-items:center; font-size:18px; border:2.5px solid #d4af37; box-shadow:0 4px 14px rgba(126,12,28,0.55); cursor:pointer;">
          🔱${badgeHtml}
        </div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const marker = L.marker([group.lat, group.lng], { icon: trishulIcon }).addTo(leafletMap);

      let header = "";
      if (count > 1) {
        header = `<div style="background:linear-gradient(135deg, #770e17, #b8232e); color:#fff; padding:8px 12px; border-radius:10px 10px 0 0; margin:-2px -2px 10px -2px; font-size:12px; font-weight:bold; display:flex; justify-content:space-between; align-items:center;">
          <span>🔱 ${count} Durga Mata Pandals</span>
          <span style="background:#d4af37; color:#770e17; padding:2px 8px; border-radius:999px; font-size:11px; font-weight:800;">Same Spot</span>
        </div>`;
      }

      const listContent = group.items.map((item, idx) => {
        const mapUrl = getGoogleMapsUrl(item);
        return `
          <div style="${idx > 0 ? 'margin-top:10px; padding-top:10px; border-top:1px dashed #eaab9d;' : ''}">
            <a href="pandal.html?id=${encodeURIComponent(item.id)}" style="display:block; text-decoration:none;">
              <h4 style="font-weight:800; font-size:14px; color:#140b0d; margin:0 0 3px 0; display:flex; align-items:center; gap:5px;">
                <span style="color:#b8232e;">🔱</span> ${item.name}
              </h4>
            </a>
            ${item.teluguName ? `<p style="font-size:12px; color:#770e17; font-weight:bold; margin:0 0 4px 0;">${item.teluguName}</p>` : ''}
            <p style="font-size:11px; color:#655257; font-weight:600; margin:0 0 8px 0;">📍 ${item.area}${item.address ? ' • ' + item.address : ''}</p>
            <div style="display:flex; flex-direction:column; gap:5px;">
              <a href="pandal.html?id=${encodeURIComponent(item.id)}" style="display:block; background:#fdf4f2; border:1px solid #eaab9d; color:#770e17; text-align:center; padding:6px; border-radius:8px; font-size:11px; font-weight:bold; text-decoration:none;">
                🔱 View Full Details
              </a>
              <a href="${mapUrl}" target="_blank" rel="noopener noreferrer" style="display:block; background:linear-gradient(135deg, #b8232e, #770e17); color:white; text-align:center; padding:6px; border-radius:8px; font-size:11px; font-weight:bold; text-decoration:none;">
                🚗 Google Maps Directions ➔
              </a>
            </div>
          </div>
        `;
      }).join("");

      const popupHtml = `
        <div style="font-family:system-ui, -apple-system, sans-serif; width:240px; max-height:360px; overflow-y:auto; padding:2px;">
          ${header}
          ${listContent}
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker._pandalData = group.items[0];
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
  renderAreaPills();
  renderMandapamsDirectory();
  const dirSection = document.getElementById("directory-section");
  if (dirSection) dirSection.scrollIntoView({ behavior: "smooth" });
}

function clearAllFilters() {
  searchQuery = "";
  activeCategoryFilter = "all";
  activeAreaFilter = "all";
  const searchInput = document.getElementById("main-search-input");
  if (searchInput) searchInput.value = "";
  renderAreaPills();
  renderMandapamsDirectory();
}

function handleUseMyLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  const btn = document.getElementById("btn-use-location");
  if (btn) btn.innerHTML = "<span>⏳ Acquiring exact GPS...</span>";

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      userLocation = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      };
      const acc = Math.round(pos.coords.accuracy || 0);
      if (btn) btn.innerHTML = `<span>✓ GPS Active (±${acc}m)</span>`;
      renderMandapamsDirectory();
      const dirSection = document.getElementById("directory-section");
      if (dirSection) dirSection.scrollIntoView({ behavior: "smooth" });
    },
    (err) => {
      console.warn("Location error:", err);
      alert("Could not detect your exact GPS location. Please choose an area from the list.");
      if (btn) btn.innerHTML = "<span>📍 Use My Location</span>";
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
  );
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
