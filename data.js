// Default Initial Configuration for Karimnagar Durga Idol Finder
const DEFAULT_SITE_CONFIG = {
  header: {
    siteName: "Karimnagar Durga Idol Finder",
    siteLocation: "Karimnagar",
    tagline: "Find • Visit • Celebrate",
    logoImage: "assets/images/logo.jpg",
    contactEmail: "contact@karimnagardurgafinder.com"
  },
  hero: {
    chantTelugu: "॥ ఓం శ్రీ దుర్గాయై నమః ॥",
    mainTitle: "Karimnagar Durga",
    titleHighlight: "Idol Finder",
    subtitle: "Find • Visit • Celebrate",
    description: "Find all sacred Durga Devi pandals, Navratri mandapams, and Bathukamma celebrations across Karimnagar. Explore divine idol themes, view photos, get GPS directions and celebrate Navratri with bliss.",
    bannerBadgeText: "॥ జై దుర్గా భవానీ • Jai Mata Di ॥",
    floatingCardTitle: "Karimnagar Navratri Utsav",
    floatingCardSubtitle: "One Divine City, Infinite Blessings",
    heroImage: "assets/images/hero-durga.jpg"
  },
  stats: {
    locationsCount: 0,
    themesCount: 0,
    photosCount: 0,
    locationLabel: "Karimnagar",
    homeSublabel: "Our Sacred City",
    quoteTelugu: "“సకల శుభ ప్రదాయినీ శ్రీ దుర్గాదేవి”",
    quoteSub: "॥ శ్రీ మాత్రే నమః ॥"
  },
  mapSection: {
    eyebrow: "Interactive Navratri Map",
    title: "Durga Pandals & Mandapams",
    titleHighlight: "in Karimnagar",
    description: "Find every verified Durga Mata pandal and Navratri mandapam across Karimnagar. View live photos, special alankarams, and get turn-by-turn GPS driving directions directly in Google Maps.",
    defaultCenter: [18.4386, 79.1288], // Karimnagar City Center
    defaultZoom: 14
  },
  mustVisitSection: {
    eyebrow: "Must Visit",
    title: "Must Visit Durga Pandals",
    description: "The top priority Durga mandapams and magnificent pandals you shouldn't miss this Navratri festival season across Karimnagar.",
    badgeText: "Priority Pandals"
  },
  uniqueSection: {
    eyebrow: "Special Alankarams",
    title: "Unique Durga Idols & Themes",
    description: "Explore creatively themed Navadurga avatars, golden & silver alankarams, eco-friendly idols, and creative themes across Karimnagar."
  },
  gallerySection: {
    eyebrow: "Navratri Gallery",
    title: "Moments from Across Karimnagar",
    description: "Photos from various Durga pandals, Bathukamma celebrations, Maha Aartis, and Dandiya nights."
  },
  areasSection: {
    eyebrow: "Areas",
    title: "Browse by Area in Karimnagar",
    description: "Jump straight to any Karimnagar colony or neighbourhood to explore nearby pandals."
  },
  ctaSection: {
    title: "Be a Part of the Navratri Celebration",
    description: "Know a Durga Mata pandal or Navratri mandapam that's not listed? Help us add it. Every submission is reviewed and approved by the admin before it appears on the live map and index directory.",
    quoteText: "“May Goddess Durga bring peace, health, and prosperity to every home in Karimnagar” 🔱",
    namasteImage: "assets/images/logo.jpg"
  },
  footer: {
    developerNames: "@chintuvarun_3008",
    developerInstagram: "https://instagram.com/chintuvarun_3008",
    copyrightText: "Karimnagar Durga Idol Finder © 2026 | Celebrate Culture | Support Local | Keep Karimnagar Beautiful",
    version: "v4.0.0"
  }
};

// No default mock pandals on index page - populated ONLY when submitted and approved by admin!
const DEFAULT_MANDAPAMS = [];

const DEFAULT_AREAS = [
  "Tower Circle",
  "Mukarampura",
  "Mankammathota",
  "Collectorate Chowrasta",
  "Karkhanagadda",
  "Jyothi Nagar",
  "Sapthagiri Colony",
  "Vavilalapalli",
  "Geetha Bhavan",
  "Court Road",
  "Ramnagar",
  "Vidyanagar",
  "Kashmirgadda",
  "Kaman Chowrasta",
  "Housing Board Colony",
  "Bhagyanagar",
  "Rekurthi",
  "Padmanagar",
  "Chinthakunta",
  "Ganeshnagar",
  "Alugunoor",
  "Subhashnagar",
  "Kishan Nagar",
  "Gandhi Road",
  "Adarsh Nagar",
  "Bavapet",
  "Bhagathnagar",
  "Sawaran Street",
  "Sitarampur",
  "Kothapalli",
  "Lower Manair Dam (LMD)",
  "Thimmapur"
];

// Karimnagar Colony GPS Coordinates for instant Google Maps fly-to navigation
window.KARIMNAGAR_COLONY_COORDS = window.KARIMNAGAR_COLONY_COORDS || {
  "Vijayanagar": [18.4280, 79.1290],
  "Vidyanagar": [18.4280, 79.1290],
  "Tower Circle": [18.4386, 79.1288],
  "Mukarampura": [18.4412, 79.1315],
  "Mankammathota": [18.4335, 79.1245],
  "Collectorate Chowrasta": [18.4428, 79.1352],
  "Karkhanagadda": [18.4395, 79.1380],
  "Jyothi Nagar": [18.4465, 79.1250],
  "Sapthagiri Colony": [18.4510, 79.1320],
  "Vavilalapalli": [18.4480, 79.1410],
  "Geetha Bhavan": [18.4365, 79.1310],
  "Court Road": [18.4400, 79.1270],
  "Ramnagar": [18.4320, 79.1360],
  "Vidyanagar": [18.4280, 79.1290],
  "Kashmirgadda": [18.4450, 79.1390],
  "Kaman Chowrasta": [18.4350, 79.1275],
  "Housing Board Colony": [18.4550, 79.1380],
  "Bhagyanagar": [18.4310, 79.1220],
  "Padmanagar": [18.4250, 79.1180],
  "Chinthakunta": [18.4600, 79.1450],
  "Ganeshnagar": [18.4420, 79.1430],
  "Alugunoor": [18.4100, 79.1550],
  "Subhashnagar": [18.4370, 79.1220],
  "Kishan Nagar": [18.4490, 79.1290],
  "Gandhi Road": [18.4390, 79.1305],
  "Adarsh Nagar": [18.4520, 79.1270],
  "Bavapet": [18.4360, 79.1340],
  "Bhagathnagar": [18.4440, 79.1260],
  "Sawaran Street": [18.4405, 79.1325],
  "Sitarampur": [18.4340, 79.1420],
  "Rekurthi": [18.4650, 79.1120],
  "Kothapalli": [18.4620, 79.0950],
  "Lower Manair Dam (LMD)": [18.4050, 79.1480],
};
var KARIMNAGAR_COLONY_COORDS = window.KARIMNAGAR_COLONY_COORDS;

// 100% Free Authentic Google Maps Tile Layers Factory
function createGoogleTileLayers() {
  const roadmap = L.tileLayer('https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20,
    attribution: '&copy; Google Maps'
  });
  const hybrid = L.tileLayer('https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20,
    attribution: '&copy; Google Maps Satellite'
  });
  const terrain = L.tileLayer('https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20,
    attribution: '&copy; Google Maps Terrain'
  });
  return { roadmap, hybrid, terrain };
}

// LocalStorage Keys
const STORAGE_KEYS = {
  CONFIG: "karimnagar_durga_site_config_v2",
  MANDAPAMS: "karimnagar_durga_mandapams_v2",
  AREAS: "karimnagar_durga_areas_v2",
  AUTH: "karimnagar_durga_admin_auth_v2",
  LIKES: "karimnagar_durga_photo_likes_v2"
};

let allGalleryPhotos = [];
let activeLightboxIndex = 0;

// API Base URL Resolver: connects to Render backend or local server automatically
function getApiUrl(endpoint) {
  if (!endpoint) return "";
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    return endpoint;
  }
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : "/" + endpoint;

  // 1. Check if user configured a remote backend URL (e.g. Render backend)
  if (typeof window !== "undefined") {
    const configuredApi = window.BACKEND_API_URL || localStorage.getItem("karimnagar_backend_url");
    if (configuredApi && typeof configuredApi === "string" && configuredApi.startsWith("http")) {
      return configuredApi.replace(/\/+$/, "") + cleanEndpoint;
    }
    // 2. If running from local desktop file:/// or origin is not http/https
    if (window.location.protocol === "file:" || !window.location.origin || window.location.origin === "null") {
      return "http://localhost:3000" + cleanEndpoint;
    }
  }

  return cleanEndpoint;
}

// Media URL Resolver: ensures relative paths work under both file:/// desktop mode and http/https web deployment
function resolveMediaUrl(url) {
  if (!url || typeof url !== "string") return "assets/images/hero-durga.jpg";
  url = url.trim();
  if (url.startsWith("data:") || url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  if (typeof window !== "undefined" && (window.location.protocol === "file:" || !window.location.origin || window.location.origin === "null")) {
    if (url.startsWith("/")) {
      return url.substring(1);
    }
  }
  return url;
}
if (typeof window !== "undefined") {
  window.resolveMediaUrl = resolveMediaUrl;
}

function getSiteConfig() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Error reading siteConfig from localStorage:", e);
  }
  return DEFAULT_SITE_CONFIG;
}

function saveSiteConfig(config) {
  try {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  } catch (e) {
    console.warn("Storage warning on saveSiteConfig:", e);
  }
  syncAllToServer();
}

// Ensure coordinates are strictly within valid Indian geographic boundaries (lat: 8 to 37.5, lng: 68 to 97.5)
function sanitizePandalCoords(item) {
  if (!item) return item;
  let lat = parseFloat(item.latitude);
  let lng = parseFloat(item.longitude);
  const isValid = !isNaN(lat) && !isNaN(lng) && lat >= 8.0 && lat <= 37.5 && lng >= 68.0 && lng <= 97.5;

  if (!isValid) {
    const url = item.mapsUrl || item.googleMapsUrl || '';
    let extracted = null;
    if (url && typeof url === 'string') {
      let m = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (!m) m = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
      if (!m) m = url.match(/[?&](?:q|destination|query|ll)=(-?\d+\.\d+)[,+](-?\d+\.\d+)/i);
      if (!m) m = url.match(/\/dir\/.*?\/(-?\d+\.\d+)[,+](-?\d+\.\d+)/i);
      if (!m) m = url.match(/\b(1[789]\.\d{3,})[,+\s]+(7[89]\.\d{3,})\b/);
      if (m) {
        const eLat = parseFloat(m[1]), eLng = parseFloat(m[2]);
        if (eLat >= 8.0 && eLat <= 37.5 && eLng >= 68.0 && eLng <= 97.5) {
          extracted = { lat: eLat, lng: eLng };
        }
      }
    }

    if (extracted) {
      item.latitude = extracted.lat;
      item.longitude = extracted.lng;
    } else if (item.area && typeof window !== "undefined" && window.KARIMNAGAR_COLONY_COORDS && window.KARIMNAGAR_COLONY_COORDS[item.area]) {
      item.latitude = window.KARIMNAGAR_COLONY_COORDS[item.area][0];
      item.longitude = window.KARIMNAGAR_COLONY_COORDS[item.area][1];
    } else {
      item.latitude = 18.4386;
      item.longitude = 79.1288;
    }
  }
  return item;
}

function getMandapams() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.MANDAPAMS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed
          .filter(m => m && m.id && !String(m.id).startsWith("kd-") && !String(m.name || '').includes("Mankammathota Durga Samithi"))
          .map(sanitizePandalCoords);
      }
    }
  } catch (e) {
    console.error("Error reading mandapams from localStorage:", e);
  }
  return DEFAULT_MANDAPAMS;
}

// Safe storage with error safety
function safeSaveMandapams(mandapams) {
  if (!Array.isArray(mandapams)) return;
  try {
    const sanitized = mandapams.map(sanitizePandalCoords);
    localStorage.setItem(STORAGE_KEYS.MANDAPAMS, JSON.stringify(sanitized));
  } catch (quotaErr) {
    console.warn("LocalStorage storage notice:", quotaErr);
  }
}

function saveMandapams(mandapams) {
  safeSaveMandapams(mandapams);
  syncAllToServer();
}

function getAreasList() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.AREAS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Error reading areas from localStorage:", e);
  }
  return DEFAULT_AREAS;
}

function saveAreasList(areas) {
  try {
    localStorage.setItem(STORAGE_KEYS.AREAS, JSON.stringify(areas));
  } catch (e) {
    console.warn("Storage warning on saveAreasList:", e);
  }
  syncAllToServer();
}

// Google Maps Explorer & Navigation URL Helper: Direct turn-by-turn GPS destination navigation
function getGoogleMapsUrl(item) {
  if (!item) return "https://www.google.com/maps/dir/?api=1&destination=18.4386,79.1288";

  // If submitter provided an exact custom Google Maps link, preserve and prioritize that exact URL
  const explicitUrl = (item.mapsUrl && typeof item.mapsUrl === "string" && item.mapsUrl.startsWith("http")) ? item.mapsUrl :
                      (item.googleMapsUrl && typeof item.googleMapsUrl === "string" && item.googleMapsUrl.startsWith("http")) ? item.googleMapsUrl : null;

  const sanitized = sanitizePandalCoords(item);
  const lat = sanitized.latitude;
  const lng = sanitized.longitude;

  // If valid coordinates exist, direct turn-by-turn navigation directly to the exact spot!
  if (lat && lng && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng)) && parseFloat(lat) >= 8.0 && parseFloat(lng) >= 68.0) {
    return `https://www.google.com/maps/dir/?api=1&destination=${parseFloat(lat).toFixed(6)},${parseFloat(lng).toFixed(6)}`;
  }

  if (explicitUrl) {
    return explicitUrl;
  }

  const queryName = encodeURIComponent(`${item.name || 'Durga Mandapam'} ${item.area || ''} Karimnagar`.trim());
  return `https://www.google.com/maps/dir/?api=1&destination=${queryName}`;
}

// Dedicated directions URL helper: Always navigates from visitor's current location to the pandal
function getGoogleDirectionsUrl(item) {
  if (!item) return "https://www.google.com/maps/dir/?api=1&destination=18.4386,79.1288";
  const sanitized = sanitizePandalCoords(item);
  const lat = sanitized.latitude;
  const lng = sanitized.longitude;

  if (lat && lng && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng)) && parseFloat(lat) >= 8.0 && parseFloat(lng) >= 68.0) {
    return `https://www.google.com/maps/dir/?api=1&destination=${parseFloat(lat).toFixed(6)},${parseFloat(lng).toFixed(6)}`;
  }

  const queryName = encodeURIComponent(`${item.name || 'Durga Mandapam'} ${item.area || ''} Karimnagar`.trim());
  return `https://www.google.com/maps/dir/?api=1&destination=${queryName}`;
}

// Google Street View 360 Panorama Helper
function getGoogleStreetViewUrl(item) {
  if (!item) return "https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=18.4386,79.1288";
  const sanitized = sanitizePandalCoords(item);
  const lat = sanitized.latitude;
  const lng = sanitized.longitude;

  return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${parseFloat(lat).toFixed(6)},${parseFloat(lng).toFixed(6)}`;
}

// Photo Gallery Helpers
function buildGalleryPhotosArray() {
  allGalleryPhotos = [];
  const verifiedList = getMandapams().filter(m => m.isVerified !== false && m.status !== 'pending');
  verifiedList.forEach(m => {
    if (m.photos && Array.isArray(m.photos)) {
      m.photos.forEach((p, pIdx) => {
        const photoUrl = (typeof p === 'string') ? p : (p.url || p.image_url || "assets/images/hero-durga.jpg");
        const photoKey = `${m.id}_photo_${pIdx}`;
        allGalleryPhotos.push({
          key: photoKey,
          url: resolveMediaUrl(photoUrl),
          caption: (typeof p === 'object' && p.caption) ? p.caption : `${m.name} Sacred Darshan`,
          mandapamId: m.id,
          mandapamName: m.name,
          area: m.area,
          defaultLikes: (pIdx * 7) + 18
        });
      });
    }
  });
}

function sanitizeFileName(name) {
  return (name || "Karimnagar_Durga").replace(/[^a-zA-Z0-9_-]/g, "_") + ".jpg";
}

function getPhotoLikesMap() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.LIKES);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Error reading photo likes:", e);
  }
  return {};
}

function savePhotoLikesMap(likesMap) {
  localStorage.setItem(STORAGE_KEYS.LIKES, JSON.stringify(likesMap));
}

function isPhotoLiked(photoKey) {
  const map = getPhotoLikesMap();
  return !!(map[photoKey] && map[photoKey].liked);
}

function getPhotoLikeCount(photoKey, defaultLikes = 12) {
  const map = getPhotoLikesMap();
  if (map[photoKey] && typeof map[photoKey].count === 'number') {
    return map[photoKey].count;
  }
  return defaultLikes;
}

function togglePhotoLike(photoKey, defaultLikes = 12) {
  const map = getPhotoLikesMap();
  const current = map[photoKey] || { count: defaultLikes, liked: false };
  if (current.liked) {
    current.liked = false;
    current.count = Math.max(0, current.count - 1);
  } else {
    current.liked = true;
    current.count += 1;
  }
  map[photoKey] = current;
  savePhotoLikesMap(map);
  return current;
}

// Direct HD Image Downloader
function triggerPhotoDownload(imageUrl, fileName = "Karimnagar_Durga_Photo.jpg") {
  if (!imageUrl) return;
  if (imageUrl.startsWith("data:") || imageUrl.startsWith("assets/") || imageUrl.startsWith("./")) {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  fetch(imageUrl)
    .then(res => res.blob())
    .then(blob => {
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
    })
    .catch(err => {
      console.warn("Blob fetch failed, falling back to direct open:", err);
      const link = document.createElement("a");
      link.href = imageUrl;
      link.target = "_blank";
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
}

function resetAllDataToDefault() {
  localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(DEFAULT_SITE_CONFIG));
  localStorage.setItem(STORAGE_KEYS.MANDAPAMS, JSON.stringify(DEFAULT_MANDAPAMS));
  localStorage.setItem(STORAGE_KEYS.AREAS, JSON.stringify(DEFAULT_AREAS));
  localStorage.removeItem(STORAGE_KEYS.LIKES);
}

// Client-side image compression to Base64 Data URL (optimized for speed and low storage footprint)
function processImageFile(file, callback, maxWidth = 900, quality = 0.75) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxWidth) {
          width = Math.round((width * maxWidth) / height);
          height = maxWidth;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/jpeg", quality);
      callback(dataUrl);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// Sync with Backend Server asynchronously
function syncAllToServer() {
  try {
    const payload = {
      config: getSiteConfig(),
      mandapams: getMandapams(),
      areas: getAreasList()
    };
    fetch(getApiUrl("/api/save-all"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).catch(e => console.warn("Backend server sync notice:", e));
  } catch (err) {
    // Ignore offline errors
  }
}

// Pull latest data from Backend server on init
function pullServerData(callback) {
  fetch(getApiUrl("/api/site-data"))
    .then(r => r.json())
    .then(res => {
      if (res && res.success && res.data) {
        if (Array.isArray(res.data.mandapams)) {
          // Authoritative server state: update local cache directly without resurrecting deleted items
          safeSaveMandapams(res.data.mandapams);
        }
        if (res.data.areas && Array.isArray(res.data.areas) && res.data.areas.length > 0) {
          try {
            localStorage.setItem(STORAGE_KEYS.AREAS, JSON.stringify(res.data.areas));
          } catch (e) {}
        }
        if (res.data.config) {
          try {
            localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(res.data.config));
          } catch (e) {}
        }
      }
      if (callback) callback();
    })
    .catch(e => {
      if (callback) callback();
    });
}

// Cross-tab real-time sync broadcaster
function broadcastDataChange(type = "mandapams_changed") {
  try {
    if (typeof BroadcastChannel !== "undefined") {
      const bc = new BroadcastChannel("karimnagar_durga_sync");
      bc.postMessage({ type, timestamp: Date.now() });
      setTimeout(() => bc.close(), 100);
    }
  } catch (e) {}
  try {
    localStorage.setItem("karimnagar_durga_last_sync", String(Date.now()));
  } catch (e) {}
}

function listenDataChange(callback) {
  if (typeof window === "undefined" || !callback) return;
  try {
    if (typeof BroadcastChannel !== "undefined") {
      const bc = new BroadcastChannel("karimnagar_durga_sync");
      bc.onmessage = (ev) => {
        if (ev && ev.data) callback(ev.data);
      };
    }
  } catch (e) {}
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEYS.MANDAPAMS || e.key === "karimnagar_durga_last_sync" || e.key === STORAGE_KEYS.CONFIG) {
      callback({ type: "storage_event", key: e.key });
    }
  });
  window.addEventListener("focus", () => {
    callback({ type: "window_focus" });
  });
}

// Open Instagram in native app on Mobile, or browser tab on Desktop
function openInstagramApp(handleOrUrl = 'chintuvarun_3008') {
  if (!handleOrUrl) handleOrUrl = 'chintuvarun_3008';

  // Clean handle: extract username
  let username = String(handleOrUrl)
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
    .replace(/[\/@?#].*$/, '')
    .replace('@', '')
    .trim();
  if (!username) username = 'chintuvarun_3008';

  const appScheme = `instagram://user?username=${username}`;
  const webUrl = `https://www.instagram.com/${username}/`;

  // Detect mobile devices (Android / iOS)
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || navigator.vendor || window.opera);

  if (isMobile) {
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isAndroid) {
      // Direct intent for Android to guarantee opening Instagram app
      window.location.href = `intent://instagram.com/_u/${username}/#Intent;package=com.instagram.android;scheme=https;end`;
    } else if (isIOS) {
      // iOS custom URL scheme
      window.location.href = appScheme;
      setTimeout(() => {
        window.location.href = webUrl;
      }, 1500);
    } else {
      window.location.href = appScheme;
      setTimeout(() => {
        window.open(webUrl, '_blank');
      }, 1500);
    }
  } else {
    // Desktop: open clean web profile in new tab
    window.open(webUrl, '_blank', 'noopener,noreferrer');
  }
}

// --------------------------------------------------------------------------
// Automatic Page View Tracking & SEO/Analytics Helper
// --------------------------------------------------------------------------
(function initAnalyticsAndTracking() {
  if (typeof window === "undefined") return;

  // 1. Record Page View for Per-Page Visibility Counters
  try {
    const rawPath = window.location.pathname || "/";
    const cleanPath = rawPath.endsWith("/") ? rawPath + "index.html" : rawPath;
    const apiUrl = (typeof getApiUrl === "function") ? getApiUrl("/api/analytics/pageview") : "/api/analytics/pageview";
    fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: cleanPath })
    }).catch(() => {});
  } catch (e) {}

  // 2. Dynamic Google Search Console & GA4 Activation from Site Config
  try {
    const cfg = (typeof getSiteConfig === "function") ? getSiteConfig() : (window.SITE_CONFIG || {});
    const gscToken = cfg?.seo?.gscToken;
    const gaId = cfg?.seo?.gaMeasurementId;

    if (gscToken) {
      let meta = document.querySelector('meta[name="google-site-verification"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'google-site-verification';
        document.head.appendChild(meta);
      }
      meta.content = gscToken;
    }

    if (gaId && gaId.startsWith('G-')) {
      if (!document.getElementById('ga4-script')) {
        const s = document.createElement('script');
        s.id = 'ga4-script';
        s.async = true;
        s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
        document.head.appendChild(s);

        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', gaId);
      }
    }
  } catch (e) {}
})();
