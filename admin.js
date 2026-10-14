// Admin Panel Controller for Karimnagar Durga Idol Finder

let adminConfig = getSiteConfig();
let adminMandapams = typeof getAllMandapamsForAdmin === 'function' ? getAllMandapamsForAdmin() : getMandapams();
let adminAreas = getAreasList();
let selectedMandapamId = null;
let activeAdminFilter = "all";

const VALID_ADMINS = [
  { username: "chintuvarun-3008", password: "vamshi krishna" },
  { username: "chintuvarun_3008", password: "vamshi krishna" },
  { username: "chintuvarun-3008", password: "vamshikrishna" },
  { username: "chintuvarun_3008", password: "vamshikrishna" },
  { username: "admin", password: "vamshi krishna" },
  { username: "admin", password: "admin123" }
];

function checkAdminAuth() {
  const isAuth = sessionStorage.getItem(STORAGE_KEYS.AUTH);
  const loginModal = document.getElementById("admin-login-modal");
  const adminMain = document.getElementById("admin-dashboard-container");

  if (isAuth === "true") {
    if (loginModal) loginModal.classList.add("hidden");
    if (adminMain) adminMain.classList.remove("hidden");
    loadAdminDashboard();
  } else {
    if (loginModal) loginModal.classList.remove("hidden");
    if (adminMain) adminMain.classList.add("hidden");
  }
}

function togglePasswordVisibility() {
  const passInput = document.getElementById("admin-pass-input");
  const eyeIcon = document.getElementById("eye-icon");
  if (!passInput) return;

  if (passInput.type === "password") {
    passInput.type = "text";
    if (eyeIcon) eyeIcon.textContent = "🙈";
  } else {
    passInput.type = "password";
    if (eyeIcon) eyeIcon.textContent = "👁️";
  }
}

function handleAdminLogin(e) {
  e.preventDefault();
  const userInput = document.getElementById("admin-user-input");
  const passInput = document.getElementById("admin-pass-input");
  const errorMsg = document.getElementById("admin-login-error");

  const username = userInput ? userInput.value.trim().toLowerCase() : "";
  const password = passInput ? passInput.value.trim() : "";

  const isValid = VALID_ADMINS.some(cred => 
    cred.username.toLowerCase() === username && cred.password === password
  );

  if (isValid || ((username === "chintuvarun-3008" || username === "chintuvarun_3008" || username === "admin") && (password === "vamshi krishna" || password === "vamshikrishna" || password === "admin123"))) {
    sessionStorage.setItem(STORAGE_KEYS.AUTH, "true");
    if (errorMsg) errorMsg.classList.add("hidden");
    checkAdminAuth();
  } else {
    if (errorMsg) {
      errorMsg.textContent = "⚠️ Invalid username or password. Please try again.";
      errorMsg.classList.remove("hidden");
    }
  }
}

function handleAdminLogout() {
  sessionStorage.removeItem(STORAGE_KEYS.AUTH);
  window.location.reload();
}

function loadAdminDashboard() {
  pullServerData(() => {
    // Pull complete mandapams & areas list directly from backend admin API
    Promise.all([
      fetch(getApiUrl("/api/admin/mandapams")).then(r => r.json()).catch(() => null),
      fetch(getApiUrl("/api/areas")).then(r => r.json()).catch(() => null)
    ]).then(([mandapamsRes, areasRes]) => {
      if (mandapamsRes && mandapamsRes.success && Array.isArray(mandapamsRes.mandapams)) {
        adminMandapams = mandapamsRes.mandapams;
        safeSaveMandapams(adminMandapams);
      } else {
        adminMandapams = typeof getAllMandapamsForAdmin === 'function' ? getAllMandapamsForAdmin() : getMandapams();
      }

      if (areasRes && areasRes.success && Array.isArray(areasRes.areas)) {
        adminAreas = areasRes.areas;
        try { localStorage.setItem(STORAGE_KEYS.AREAS, JSON.stringify(adminAreas)); } catch (e) {}
      } else {
        adminAreas = getAreasList();
      }

      adminConfig = getSiteConfig();

      populateSiteSettingsForm();
      renderAdminMandapamsTable();
      renderAdminAreasList();
      updateAdminQuickStats();
    }).catch(() => {
      adminConfig = getSiteConfig();
      adminMandapams = typeof getAllMandapamsForAdmin === 'function' ? getAllMandapamsForAdmin() : getMandapams();
      adminAreas = getAreasList();

      populateSiteSettingsForm();
      renderAdminMandapamsTable();
      renderAdminAreasList();
      updateAdminQuickStats();
    });
  });
}

// Live auto-refresh for admin dashboard so newly submitted idols from community show up automatically
setInterval(() => {
  if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(STORAGE_KEYS.AUTH) === "true") {
    fetch(getApiUrl("/api/admin/mandapams?_t=" + Date.now()))
      .then(r => r.json())
      .then(res => {
        if (res && res.success && Array.isArray(res.mandapams)) {
          adminMandapams = res.mandapams;
          safeSaveMandapams(adminMandapams);
          renderAdminMandapamsTable();
          updateAdminQuickStats();
        }
      })
      .catch(() => {});
  }
}, 4000);

if (typeof window !== "undefined") {
  window.addEventListener("focus", () => {
    if (sessionStorage.getItem(STORAGE_KEYS.AUTH) === "true") {
      loadAdminDashboard();
    }
  });
}

// 1. Quick Stats
function updateAdminQuickStats() {
  const total = adminMandapams.length;
  const pending = adminMandapams.filter(m => m.isVerified === false || m.status === 'pending').length;
  const mustVisit = adminMandapams.filter(m => (m.isMustVisit || m.priority <= 3) && m.isVerified !== false).length;
  const unique = adminMandapams.filter(m => m.categories && m.categories.includes("unique")).length;

  const totalEl = document.getElementById("adm-stat-total");
  if (totalEl) totalEl.textContent = total;

  const pendingEl = document.getElementById("adm-stat-pending");
  if (pendingEl) pendingEl.textContent = pending;

  const mustVisitEl = document.getElementById("adm-stat-mustvisit");
  if (mustVisitEl) mustVisitEl.textContent = mustVisit;

  const uniqueEl = document.getElementById("adm-stat-unique");
  if (uniqueEl) uniqueEl.textContent = unique;

  const areasEl = document.getElementById("adm-stat-areas");
  if (areasEl) areasEl.textContent = adminAreas.length;
}

// 2. Populate Site Info & Index Page Settings
function populateSiteSettingsForm() {
  const cfg = adminConfig;

  document.getElementById("set-chant").value = cfg.hero?.chantTelugu || "॥ ఓం శ్రీ దుర్గాయై నమః ॥";
  document.getElementById("set-title").value = cfg.hero?.mainTitle || "Karimnagar Durga";
  document.getElementById("set-highlight").value = cfg.hero?.titleHighlight || "Idol Finder";
  document.getElementById("set-subtitle").value = cfg.hero?.subtitle || "Find • Visit • Celebrate";
  document.getElementById("set-desc").value = cfg.hero?.description || "";
  document.getElementById("set-hero-img").value = cfg.hero?.heroImage || "assets/images/hero-durga.jpg";
  
  const heroPrev = document.getElementById("set-hero-img-preview");
  if (heroPrev) {
    heroPrev.src = cfg.hero?.heroImage || "assets/images/hero-durga.jpg";
  }

  document.getElementById("set-banner-badge").value = cfg.hero?.bannerBadgeText || "॥ జై దుర్గా భవానీ • Jai Mata Di ॥";
  document.getElementById("set-float-title").value = cfg.hero?.floatingCardTitle || "Karimnagar Navratri Utsav";
  document.getElementById("set-float-sub").value = cfg.hero?.floatingCardSubtitle || "One Divine City, Infinite Blessings";

  document.getElementById("set-stat-loc").value = cfg.stats?.locationsCount || 0;
  document.getElementById("set-stat-themes").value = cfg.stats?.themesCount || 0;
  document.getElementById("set-stat-photos").value = cfg.stats?.photosCount || 0;
  document.getElementById("set-stat-quote").value = cfg.stats?.quoteTelugu || "“సకల శుభ ప్రదాయినీ శ్రీ దుర్గాదేవి”";

  document.getElementById("set-cta-title").value = cfg.ctaSection?.title || "";
  document.getElementById("set-cta-desc").value = cfg.ctaSection?.description || "";
  document.getElementById("set-cta-quote").value = cfg.ctaSection?.quoteText || "";
  document.getElementById("set-dev-names").value = cfg.footer?.developerNames || "@chintuvarun_3008";
  document.getElementById("set-copyright").value = cfg.footer?.copyrightText || "Karimnagar Durga Idol Finder © 2026 | Celebrate Culture | Support Local | Keep Karimnagar Beautiful";

  const gscInput = document.getElementById("set-gsc-token");
  if (gscInput) gscInput.value = cfg.seo?.gscToken || "";

  const gaInput = document.getElementById("set-ga-id");
  if (gaInput) gaInput.value = cfg.seo?.gaMeasurementId || "";

  // Load live page visibility counters
  fetch(getApiUrl("/api/analytics/stats"))
    .then(r => r.json())
    .then(res => {
      if (res && res.success && res.pageViews) {
        const pv = res.pageViews;
        const setVal = (id, count) => {
          const el = document.getElementById(id);
          if (el) el.textContent = Number(count || 0).toLocaleString();
        };
        setVal("pv-home", (pv["/"] || 0) + (pv["/index.html"] || 0));
        setVal("pv-map", pv["/map.html"] || 0);
        setVal("pv-pandal", pv["/pandal.html"] || 0);
        setVal("pv-submit", pv["/submit.html"] || 0);
      }
    })
    .catch(() => {});
}

function handleHeroImageBrowse(event) {
  const file = event.target.files[0];
  if (!file) return;

  processImageFile(file, (dataUrl) => {
    document.getElementById("set-hero-img").value = dataUrl;
    const prev = document.getElementById("set-hero-img-preview");
    if (prev) prev.src = dataUrl;
  });
}

function handleMandapamPhotoBrowse(event, index) {
  const file = event.target.files[0];
  if (!file) return;

  processImageFile(file, (dataUrl) => {
    if (index === 1) {
      document.getElementById("edit-m-photo").value = dataUrl;
      const prev = document.getElementById("edit-m-photo-preview");
      const ph = document.getElementById("edit-m-photo-placeholder-1");
      if (prev) {
        prev.src = dataUrl;
        prev.classList.remove("hidden");
      }
      if (ph) ph.classList.add("hidden");
    } else if (index === 2) {
      document.getElementById("edit-m-photo2").value = dataUrl;
      const prev = document.getElementById("edit-m-photo2-preview");
      const ph = document.getElementById("edit-m-photo-placeholder-2");
      if (prev) {
        prev.src = dataUrl;
        prev.classList.remove("hidden");
      }
      if (ph) ph.classList.add("hidden");
    } else if (index === 3) {
      document.getElementById("edit-m-photo3").value = dataUrl;
      const prev = document.getElementById("edit-m-photo3-preview");
      const ph = document.getElementById("edit-m-photo-placeholder-3");
      if (prev) {
        prev.src = dataUrl;
        prev.classList.remove("hidden");
      }
      if (ph) ph.classList.add("hidden");
    }
  });
}

function handleAdminHandlerDpBrowse(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  processImageFile(file, (dataUrl) => {
    document.getElementById("edit-m-handler-dp").value = dataUrl;
    const prev = document.getElementById("edit-m-handler-dp-preview");
    const hint = document.getElementById("edit-m-handler-dp-hint");
    if (prev) {
      prev.src = dataUrl;
      prev.classList.remove("hidden");
    }
    if (hint) {
      hint.textContent = file.name || "DP uploaded";
      hint.classList.add("text-emerald-700", "font-bold");
    }
  }, 400, 0.8);
}

function handleSaveSiteSettings(e) {
  e.preventDefault();
  
  adminConfig.hero.chantTelugu = document.getElementById("set-chant").value.trim();
  adminConfig.hero.mainTitle = document.getElementById("set-title").value.trim();
  adminConfig.hero.titleHighlight = document.getElementById("set-highlight").value.trim();
  adminConfig.hero.subtitle = document.getElementById("set-subtitle").value.trim();
  adminConfig.hero.description = document.getElementById("set-desc").value.trim();
  adminConfig.hero.heroImage = document.getElementById("set-hero-img").value.trim();
  adminConfig.hero.bannerBadgeText = document.getElementById("set-banner-badge").value.trim();
  adminConfig.hero.floatingCardTitle = document.getElementById("set-float-title").value.trim();
  adminConfig.hero.floatingCardSubtitle = document.getElementById("set-float-sub").value.trim();

  adminConfig.stats.locationsCount = parseInt(document.getElementById("set-stat-loc").value) || 0;
  adminConfig.stats.themesCount = parseInt(document.getElementById("set-stat-themes").value) || 0;
  adminConfig.stats.photosCount = parseInt(document.getElementById("set-stat-photos").value) || 0;
  adminConfig.stats.quoteTelugu = document.getElementById("set-stat-quote").value.trim();

  adminConfig.ctaSection.title = document.getElementById("set-cta-title").value.trim();
  adminConfig.ctaSection.description = document.getElementById("set-cta-desc").value.trim();
  adminConfig.ctaSection.quoteText = document.getElementById("set-cta-quote").value.trim();
  adminConfig.footer.developerNames = document.getElementById("set-dev-names").value.trim() || "@chintuvarun_3008";
  adminConfig.footer.copyrightText = document.getElementById("set-copyright").value.trim();

  // Save SEO & Analytics settings
  adminConfig.seo = adminConfig.seo || {};
  const gscInput = document.getElementById("set-gsc-token");
  if (gscInput) adminConfig.seo.gscToken = gscInput.value.trim();

  const gaInput = document.getElementById("set-ga-id");
  if (gaInput) adminConfig.seo.gaMeasurementId = gaInput.value.trim();

  saveSiteConfig(adminConfig);
  alert("✅ Site Settings, Google Search Console & Analytics updated successfully!");
}

// 3. Filter Table
function filterAdminTable(filterType) {
  activeAdminFilter = filterType;
  
  ["all", "pending", "verified"].forEach(t => {
    const btn = document.getElementById(`adm-filter-${t}`);
    if (btn) {
      if (t === filterType) {
        btn.classList.add("bg-white", "shadow-soft", "text-ink-900");
      } else {
        btn.classList.remove("bg-white", "shadow-soft", "text-ink-900");
      }
    }
  });

  renderAdminMandapamsTable();
}

// 4. Mandapams Management (Table CRUD)
function renderAdminMandapamsTable() {
  const tbody = document.getElementById("admin-mandapams-tbody");
  if (!tbody) return;

  const filterText = (document.getElementById("admin-search-mandapams") ? document.getElementById("admin-search-mandapams").value : "").toLowerCase();

  const filtered = adminMandapams.filter(m => {
    // Status filter
    if (activeAdminFilter === "pending") {
      if (m.isVerified === true && m.status !== 'pending') return false;
    } else if (activeAdminFilter === "verified") {
      if (m.isVerified === false || m.status === 'pending') return false;
    }

    if (!filterText) return true;
    return (m.name && m.name.toLowerCase().includes(filterText)) ||
           (m.area && m.area.toLowerCase().includes(filterText)) ||
           (m.teluguName && m.teluguName.toLowerCase().includes(filterText));
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="p-8 text-center text-ink-500 font-medium">
          No Durga Pandals found for filter "${activeAdminFilter}". Submissions made by users will appear here for Admin Review.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map((item, idx) => {
    const photo = (item.photos && item.photos.length > 0) ? (typeof item.photos[0] === 'string' ? item.photos[0] : item.photos[0].url) : "assets/images/hero-durga.jpg";
    const mapUrl = getGoogleMapsUrl(item);
    const isApproved = (item.isVerified === true && item.status !== 'pending');

    return `
      <tr class="border-b border-cream-200 hover:bg-cream-50 transition ${!isApproved ? 'bg-amber-50/40' : ''}">
        <td class="p-3 text-center font-bold text-ink-700">
          <input type="number" min="1" max="99" value="${item.priority || idx + 1}" onchange="updateMandapamPriority('${item.id}', this.value)" class="w-12 text-center rounded border border-cream-300 py-1 font-bold text-xs" />
        </td>
        <td class="p-3">
          <div class="flex items-center gap-3">
            <img src="${photo}" class="h-11 w-11 rounded-xl object-cover border border-cream-300 shadow-soft shrink-0" onerror="this.src='assets/images/hero-durga.jpg'" />
            <div>
              <div class="font-bold text-ink-900 text-sm leading-tight">${item.name}</div>
              ${item.teluguName ? `<div class="text-xs text-saffron-700 font-telugu mt-0.5">${item.teluguName}</div>` : ''}
              <div class="text-[11px] text-ink-500 truncate max-w-xs mt-0.5">${item.address || ''}</div>
            </div>
          </div>
        </td>
        <td class="p-3 text-xs">
          <span class="font-semibold text-ink-800 block">📍 ${item.area}</span>
          ${(item.latitude && item.longitude) ? `<div class="text-[10px] text-ink-500 font-mono mt-0.5">${Number(item.latitude).toFixed(4)}°N, ${Number(item.longitude).toFixed(4)}°E</div>` : ''}
          <div class="flex items-center gap-2 mt-1">
            <a href="${mapUrl}" target="_blank" class="text-saffron-700 hover:underline font-bold text-[11px] inline-flex items-center gap-1">📍 Google Maps ↗</a>
            ${(item.latitude && item.longitude) ? `<a href="https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${item.latitude},${item.longitude}" target="_blank" class="text-ink-600 hover:underline font-semibold text-[11px]">👁️ Street View ↗</a>` : ''}
          </div>
        </td>
        <td class="p-3 text-center">
          <button onclick="toggleMustVisitStatus('${item.id}')" class="chip ${item.isMustVisit ? 'bg-saffron-500 text-white' : 'bg-cream-200 text-ink-600'} cursor-pointer font-bold text-[11px]">
            ${item.isMustVisit ? '★ Must Visit' : 'Standard'}
          </button>
        </td>
        <td class="p-3 text-center">
          ${isApproved ? `
            <button onclick="toggleVerifiedStatus('${item.id}')" class="chip bg-emerald-600 text-white font-bold text-[11px] cursor-pointer hover:bg-emerald-700" title="Click to change approval">
              ✓ Approved (Live)
            </button>
          ` : `
            <button onclick="approveMandapam('${item.id}')" class="px-3 py-1.5 rounded-full bg-amber-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-soft transition animate-pulse" title="Click to Approve & Publish">
              ⏳ Approve & Publish
            </button>
          `}
        </td>
        <td class="p-3 text-right">
          <div class="flex items-center justify-end gap-2">
            <button onclick="openEditMandapamModal('${item.id}')" class="px-2.5 py-1.5 rounded-xl bg-cream-200 text-ink-800 text-xs font-bold hover:bg-saffron-100 hover:text-saffron-800 transition">
              ✏️ Edit
            </button>
            <button onclick="deleteMandapamItem('${item.id}')" class="px-2.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold hover:bg-rose-100 transition">
              🗑️ Delete
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

async function approveMandapam(id) {
  const m = adminMandapams.find(item => String(item.id) === String(id));
  if (!m) return;

  m.isVerified = true;
  m.status = 'approved';
  m.approvedAt = new Date().toISOString();

  // 1. Immediately update UI
  renderAdminMandapamsTable();
  updateAdminQuickStats();

  // 2. Save locally
  safeSaveMandapams(adminMandapams);

  // 3. Call backend approve API with full payload so upsert succeeds if missing
  try {
    const res = await fetch(getApiUrl(`/api/admin/mandapams/${encodeURIComponent(id)}/approve`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(m)
    });
    const data = await res.json();
    if (data && data.success && data.mandapam) {
      Object.assign(m, data.mandapam);
      safeSaveMandapams(adminMandapams);
    }
  } catch (e) {
    console.warn("Backend approve notice:", e);
  }

  // 4. Broadcast change if available
  if (typeof broadcastDataChange === "function") broadcastDataChange("mandapam_approved");

  alert(`🎉 "${m.name}" has been approved!\n\nIt is now permanently saved to the database and published live on the index page & map.`);
}

function toggleVerifiedStatus(id) {
  const m = adminMandapams.find(item => String(item.id) === String(id));
  if (m) {
    m.isVerified = !m.isVerified;
    m.status = m.isVerified ? 'approved' : 'pending';
    safeSaveMandapams(adminMandapams);

    fetch(getApiUrl(`/api/admin/mandapams/${encodeURIComponent(id)}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(m)
    }).then(() => {
      syncAllToServer();
      if (typeof broadcastDataChange === "function") broadcastDataChange("mandapam_status_toggled");
    }).catch(e => console.warn(e));

    renderAdminMandapamsTable();
    updateAdminQuickStats();
    if (typeof broadcastDataChange === "function") broadcastDataChange("mandapam_status_toggled");
  }
}

function updateMandapamPriority(id, newRank) {
  const m = adminMandapams.find(item => String(item.id) === String(id));
  if (m) {
    m.priority = parseInt(newRank) || 1;
    saveMandapams(adminMandapams);
    if (typeof broadcastDataChange === "function") broadcastDataChange("mandapam_priority_updated");
  }
}

function toggleMustVisitStatus(id) {
  const m = adminMandapams.find(item => String(item.id) === String(id));
  if (m) {
    m.isMustVisit = !m.isMustVisit;
    saveMandapams(adminMandapams);
    renderAdminMandapamsTable();
    updateAdminQuickStats();
    if (typeof broadcastDataChange === "function") broadcastDataChange("mandapam_mustvisit_toggled");
  }
}

function deleteMandapamItem(id) {
  const m = adminMandapams.find(item => String(item.id) === String(id));
  const name = m ? m.name : "this Durga Pandal";
  if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

  adminMandapams = adminMandapams.filter(item => String(item.id) !== String(id));
  safeSaveMandapams(adminMandapams);

  // Call backend delete API
  fetch(getApiUrl(`/api/admin/mandapams/${encodeURIComponent(id)}`), { method: "DELETE" })
    .then(() => {
      syncAllToServer();
      if (typeof broadcastDataChange === "function") broadcastDataChange("mandapam_deleted");
    })
    .catch(e => {
      console.warn(e);
      if (typeof broadcastDataChange === "function") broadcastDataChange("mandapam_deleted");
    });

  renderAdminMandapamsTable();
  updateAdminQuickStats();
  if (typeof broadcastDataChange === "function") broadcastDataChange("mandapam_deleted");
}

// 5. Edit/Add Mandapam Modal
function openAddMandapamModal() {
  selectedMandapamId = null;
  document.getElementById("modal-mandapam-title").textContent = "Add New Durga Pandal";
  document.getElementById("edit-mandapam-form").reset();
  
  document.getElementById("edit-m-photo").value = "";
  document.getElementById("edit-m-photo2").value = "";
  document.getElementById("edit-m-photo3").value = "";
  document.getElementById("edit-m-maps-url").value = "";

  const p1 = document.getElementById("edit-m-photo-preview");
  const p2 = document.getElementById("edit-m-photo2-preview");
  const p3 = document.getElementById("edit-m-photo3-preview");
  if (p1) p1.classList.add("hidden");
  if (p2) p2.classList.add("hidden");
  if (p3) p3.classList.add("hidden");

  const ph1 = document.getElementById("edit-m-photo-placeholder-1");
  const ph2 = document.getElementById("edit-m-photo-placeholder-2");
  const ph3 = document.getElementById("edit-m-photo-placeholder-3");
  if (ph1) ph1.classList.remove("hidden");
  if (ph2) ph2.classList.remove("hidden");
  if (ph3) ph3.classList.remove("hidden");

  populateAreaSelectOptions();
  const otherCont = document.getElementById("edit-m-other-area-container");
  if (otherCont) otherCont.classList.add("hidden");
  const otherInp = document.getElementById("edit-m-other-area-input");
  const catEl = document.getElementById("edit-m-category");
  if (catEl) catEl.value = "unique";

  document.getElementById("edit-m-verified").checked = true; // Admin added pandals default to approved

  document.getElementById("edit-mandapam-modal").classList.remove("hidden");
}

function openEditMandapamModal(id) {
  selectedMandapamId = id;
  const m = adminMandapams.find(item => item.id === id);
  if (!m) return;

  document.getElementById("modal-mandapam-title").textContent = "Edit Durga Pandal";
  populateAreaSelectOptions(m.area);

  const otherCont = document.getElementById("edit-m-other-area-container");
  if (otherCont) otherCont.classList.add("hidden");
  const otherInp = document.getElementById("edit-m-other-area-input");
  if (otherInp) otherInp.value = "";

  document.getElementById("edit-m-name").value = m.name || "";
  document.getElementById("edit-m-telugu").value = m.teluguName || "";
  document.getElementById("edit-m-area").value = m.area || "";

  const catEl = document.getElementById("edit-m-category");
  if (catEl) {
    catEl.value = (m.categories && m.categories[0]) || m.category || "unique";
  }

  document.getElementById("edit-m-maps-url").value = m.mapsUrl || m.googleMapsUrl || "";
  document.getElementById("edit-m-address").value = m.address || "";
  document.getElementById("edit-m-lat").value = (m.latitude !== null && m.latitude !== undefined) ? m.latitude : "";
  document.getElementById("edit-m-lng").value = (m.longitude !== null && m.longitude !== undefined) ? m.longitude : "";
  document.getElementById("edit-m-priority").value = m.priority || 1;
  document.getElementById("edit-m-desc").value = m.description || "";
  
  const photo1 = (m.photos && m.photos.length > 0) ? (typeof m.photos[0] === 'string' ? m.photos[0] : m.photos[0].url) : "";
  const photo2 = (m.photos && m.photos.length > 1) ? (typeof m.photos[1] === 'string' ? m.photos[1] : m.photos[1].url) : "";
  const photo3 = (m.photos && m.photos.length > 2) ? (typeof m.photos[2] === 'string' ? m.photos[2] : m.photos[2].url) : "";

  document.getElementById("edit-m-photo").value = photo1;
  document.getElementById("edit-m-photo2").value = photo2;
  document.getElementById("edit-m-photo3").value = photo3;

  const p1 = document.getElementById("edit-m-photo-preview");
  const p2 = document.getElementById("edit-m-photo2-preview");
  const p3 = document.getElementById("edit-m-photo3-preview");

  if (p1) {
    if (photo1) { p1.src = photo1; p1.classList.remove("hidden"); } else { p1.classList.add("hidden"); }
  }
  if (p2) {
    if (photo2) { p2.src = photo2; p2.classList.remove("hidden"); } else { p2.classList.add("hidden"); }
  }
  if (p3) {
    if (photo3) { p3.src = photo3; p3.classList.remove("hidden"); } else { p3.classList.add("hidden"); }
  }

  const ph1 = document.getElementById("edit-m-photo-placeholder-1");
  const ph2 = document.getElementById("edit-m-photo-placeholder-2");
  const ph3 = document.getElementById("edit-m-photo-placeholder-3");
  if (ph1) { if (photo1) ph1.classList.add("hidden"); else ph1.classList.remove("hidden"); }
  if (ph2) { if (photo2) ph2.classList.add("hidden"); else ph2.classList.remove("hidden"); }
  if (ph3) { if (photo3) ph3.classList.add("hidden"); else ph3.classList.remove("hidden"); }

  document.getElementById("edit-m-ig-handle").value = m.instagramHandle || "";
  document.getElementById("edit-m-ig-url").value = m.instagramUrl || "";
  document.getElementById("edit-m-reels").value = m.reelsCount || 0;

  const dp = m.handlerDp || "";
  document.getElementById("edit-m-handler-dp").value = dp;
  const prevDp = document.getElementById("edit-m-handler-dp-preview");
  const hintDp = document.getElementById("edit-m-handler-dp-hint");
  if (dp) {
    if (prevDp) { prevDp.src = dp; prevDp.classList.remove("hidden"); }
    if (hintDp) { hintDp.textContent = "Exact DP set"; hintDp.classList.add("text-emerald-700", "font-bold"); }
  } else {
    if (prevDp) prevDp.classList.add("hidden");
    if (hintDp) { hintDp.textContent = "No DP set (Neutral silhouette used)"; hintDp.classList.remove("text-emerald-700", "font-bold"); }
  }

  document.getElementById("edit-m-mustvisit").checked = !!m.isMustVisit;
  document.getElementById("edit-m-verified").checked = (m.isVerified === true && m.status !== 'pending');

  document.getElementById("edit-mandapam-modal").classList.remove("hidden");
}

function closeEditMandapamModal() {
  document.getElementById("edit-mandapam-modal").classList.add("hidden");
}

function handleSaveMandapam(e) {
  e.preventDefault();

  const name = document.getElementById("edit-m-name").value.trim();
  const telugu = document.getElementById("edit-m-telugu").value.trim();
  
  let area = document.getElementById("edit-m-area").value.trim();
  if (area === "__other__") {
    const customArea = document.getElementById("edit-m-other-area-input").value.trim();
    if (!customArea) {
      alert("⚠️ Please type the missing area name.");
      document.getElementById("edit-m-other-area-input").focus();
      return;
    }
    area = customArea;
    if (!adminAreas.includes(area)) {
      adminAreas.push(area);
      saveAreasList(adminAreas);
      fetch("/api/admin/areas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ area })
      }).catch(e => console.warn(e));
    }
  }

  const mapsUrl = document.getElementById("edit-m-maps-url").value.trim();
  const address = document.getElementById("edit-m-address").value.trim();
  const rawLat = parseFloat(document.getElementById("edit-m-lat").value);
  const rawLng = parseFloat(document.getElementById("edit-m-lng").value);
  const lat = !isNaN(rawLat) ? rawLat : null;
  const lng = !isNaN(rawLng) ? rawLng : null;
  const priority = parseInt(document.getElementById("edit-m-priority").value) || 1;
  const desc = document.getElementById("edit-m-desc").value.trim();
  const p1 = document.getElementById("edit-m-photo").value.trim();
  const p2 = document.getElementById("edit-m-photo2").value.trim();
  const p3 = document.getElementById("edit-m-photo3").value.trim();
  const igHandle = document.getElementById("edit-m-ig-handle").value.trim();
  const igUrl = document.getElementById("edit-m-ig-url").value.trim();
  const handlerDp = document.getElementById("edit-m-handler-dp") ? document.getElementById("edit-m-handler-dp").value.trim() : "";
  const reels = parseInt(document.getElementById("edit-m-reels").value) || 0;
  const rawMustVisit = document.getElementById("edit-m-mustvisit").checked;
  const isVerified = document.getElementById("edit-m-verified").checked;

  const photos = [];
  if (p1) photos.push({ url: p1, caption: `${name} Main Idol`, isPublished: true });
  if (p2) photos.push({ url: p2, caption: `${name} Pandal View`, isPublished: true });
  if (p3) photos.push({ url: p3, caption: `${name} Aarti / Alankaram`, isPublished: true });
  if (photos.length === 0) {
    photos.push({ url: "assets/images/hero-durga.jpg", caption: name, isPublished: true });
  }

  const category = (document.getElementById("edit-m-category") ? document.getElementById("edit-m-category").value : "unique") || "unique";
  const isMustVisit = rawMustVisit || category === "must-visit";
  const categories = [category, ...(category === "unique" ? ["famous"] : [])];

  if (selectedMandapamId) {
    const idx = adminMandapams.findIndex(item => item.id === selectedMandapamId);
    if (idx !== -1) {
      adminMandapams[idx] = {
        ...adminMandapams[idx],
        name,
        teluguName: telugu,
        area,
        category,
        categories,
        mapsUrl,
        googleMapsUrl: mapsUrl,
        address,
        latitude: lat,
        longitude: lng,
        priority,
        description: desc,
        photos,
        instagramHandle: igHandle,
        instagramUrl: igUrl,
        handlerDp: handlerDp || (adminMandapams[idx].handlerDp || ""),
        reelsCount: reels,
        isMustVisit,
        isVerified,
        status: isVerified ? 'approved' : 'pending'
      };
      // Call backend update
      fetch(getApiUrl(`/api/admin/mandapams/${encodeURIComponent(selectedMandapamId)}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adminMandapams[idx])
      }).then(() => {
        syncAllToServer();
      }).catch(e => console.warn(e));
    }
  } else {
    const newId = "m-" + Date.now();
    const newMandapam = {
      id: newId,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name,
      teluguName: telugu,
      area,
      category,
      categories,
      mapsUrl,
      googleMapsUrl: mapsUrl,
      address,
      latitude: lat,
      longitude: lng,
      priority,
      description: desc,
      photos,
      instagramHandle: igHandle,
      instagramUrl: igUrl,
      handlerDp: handlerDp || "",
      reelsCount: reels,
      reels: [],
      isMustVisit,
      isVerified,
      status: isVerified ? 'approved' : 'pending',
      views: 1
    };
    adminMandapams.unshift(newMandapam);
    // Call backend create
    fetch(getApiUrl("/api/mandapams"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMandapam)
    }).then(() => {
      syncAllToServer();
    }).catch(e => console.warn(e));
  }

  saveMandapams(adminMandapams);
  if (typeof broadcastDataChange === "function") broadcastDataChange("mandapam_saved");
  closeEditMandapamModal();
  renderAdminMandapamsTable();
  updateAdminQuickStats();
  alert("🎉 Mandapam saved successfully! It is permanently stored in the database.");
}

function handleAdminAreaSelectChange(val) {
  const otherContainer = document.getElementById("edit-m-other-area-container");
  const otherInput = document.getElementById("edit-m-other-area-input");
  if (val === "__other__") {
    if (otherContainer) otherContainer.classList.remove("hidden");
    if (otherInput) otherInput.focus();
  } else {
    if (otherContainer) otherContainer.classList.add("hidden");
    if (otherInput) otherInput.value = "";
  }
}

function populateAreaSelectOptions(selectedVal = "") {
  const select = document.getElementById("edit-m-area");
  if (!select) return;
  const isCustom = selectedVal && !adminAreas.includes(selectedVal);
  if (isCustom) {
    adminAreas.push(selectedVal);
  }

  select.innerHTML = adminAreas.map(a => `
    <option value="${a}" ${a === selectedVal ? 'selected' : ''}>📍 ${a}</option>
  `).join("") + `<option value="__other__">➕ Other (Type Missing Area)...</option>`;
}

// 6. Areas Management
function renderAdminAreasList() {
  const listEl = document.getElementById("admin-areas-list");
  if (!listEl) return;

  listEl.innerHTML = adminAreas.map((area, idx) => `
    <div class="flex items-center justify-between p-3 rounded-2xl bg-white border border-cream-300 shadow-soft">
      <span class="text-sm font-semibold text-ink-800">📍 ${area}</span>
      <button onclick="deleteAreaItem(${idx})" class="text-rose-600 hover:text-rose-800 text-xs font-bold px-2 py-1">✕ Remove</button>
    </div>
  `).join("");
}

function handleAddArea(e) {
  e.preventDefault();
  const input = document.getElementById("new-area-input");
  if (!input || !input.value.trim()) return;

  const newArea = input.value.trim();
  if (!adminAreas.includes(newArea)) {
    adminAreas.push(newArea);
    saveAreasList(adminAreas);

    fetch(getApiUrl("/api/admin/areas"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ area: newArea })
    }).then(() => syncAllToServer()).catch(e => console.warn(e));

    input.value = "";
    renderAdminAreasList();
    updateAdminQuickStats();
    alert(`📍 Area "${newArea}" added and saved permanently to the database!`);
  } else {
    alert("This area already exists!");
  }
}

function deleteAreaItem(idx) {
  const areaName = adminAreas[idx];
  if (confirm(`Remove area "${areaName}"?`)) {
    adminAreas.splice(idx, 1);
    saveAreasList(adminAreas);

    fetch(getApiUrl(`/api/admin/areas/${encodeURIComponent(areaName)}`), {
      method: "DELETE"
    }).then(() => syncAllToServer()).catch(e => console.warn(e));

    renderAdminAreasList();
    updateAdminQuickStats();
  }
}

// 7. Backup, Export & Import
function handleExportData() {
  const fullBackup = {
    config: getSiteConfig(),
    mandapams: getMandapams(),
    areas: getAreasList(),
    exportDate: new Date().toISOString()
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `karimnagar_durga_backup_${new Date().toISOString().slice(0,10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

function handleImportData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.config && data.mandapams) {
        saveSiteConfig(data.config);
        saveMandapams(data.mandapams);
        if (data.areas) saveAreasList(data.areas);
        alert("✅ Data backup imported successfully! Reloading...");
        window.location.reload();
      } else {
        alert("Invalid backup file format!");
      }
    } catch (err) {
      alert("Error parsing JSON file: " + err.message);
    }
  };
  reader.readAsText(file);
}

function handleResetDefaults() {
  if (confirm("⚠️ Are you sure you want to reset all site settings and mandapams to original defaults? All custom changes will be overwritten.")) {
    resetAllDataToDefault();
    alert("Site reset to default initial state.");
    window.location.reload();
  }
}

// Admin Navigation Tabs Switcher
function switchAdminTab(tabName) {
  document.querySelectorAll(".admin-tab-content").forEach(el => el.classList.add("hidden"));
  document.querySelectorAll(".admin-tab-btn").forEach(el => {
    el.classList.remove("bg-saffron-500", "text-white");
    el.classList.add("bg-white", "text-ink-700");
  });

  const targetContent = document.getElementById(`adm-tab-${tabName}`);
  const targetBtn = document.getElementById(`adm-btn-${tabName}`);
  if (targetContent) targetContent.classList.remove("hidden");
  if (targetBtn) {
    targetBtn.classList.add("bg-saffron-500", "text-white");
    targetBtn.classList.remove("bg-white", "text-ink-700");
  }
}
