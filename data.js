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
const DEFAULT_MANDAPAMS = [
  {
    "id": "m-1791882042794",
    "name": "Lakhimpur ka Rani",
    "teluguName": "లక్ష్మీపూర్ కా రాణి",
    "area": "Laxmipur shivalayam",
    "address": "F37J 79J Shivalayam, Lakshmipur, Telangana 505451",
    "category": "famous",
    "categories": [
      "famous",
      "unique",
      "must-visit"
    ],
    "mapsUrl": "https://maps.app.goo.gl/Z6fxE2jdKMusmeWa8?g_st=ac",
    "googleMapsUrl": "https://maps.app.goo.gl/Z6fxE2jdKMusmeWa8?g_st=ac",
    "latitude": 18.4386,
    "longitude": 79.1288,
    "description": "Sacred Durga Mata idol at Shivalayam, Lakshmipur, Karimnagar.",
    "instagramHandle": "",
    "instagramUrl": "",
    "reelsCount": 0,
    "committee": "Laxmipur Durga Samithi",
    "photos": [
      {
        "url": "assets/images/hero-durga.jpg",
        "caption": "Lakhimpur ka Rani Main Idol",
        "isPublished": true
      }
    ],
    "priority": 1,
    "isMustVisit": true,
    "isVerified": true,
    "status": "approved",
    "imageUrl": "assets/images/hero-durga.jpg",
    "photoUrl": "assets/images/hero-durga.jpg",
    "createdAt": "2026-10-13T09:00:42.794Z",
    "approvedAt": "2026-10-13T09:01:22.920Z"
  },
  {
    "id": "collectorate-road-chandi-mata",
    "name": "Sri Sri Durga Parameshwari Sena",
    "teluguName": "శ్రీ శ్రీ దుర్గా పరమేశ్వరి సేన",
    "area": "Collectorate Road",
    "address": "Near Collectorate Circle, Court Crossroad, Karimnagar",
    "category": "must-visit",
    "categories": [
      "must-visit",
      "famous"
    ],
    "mapsUrl": "https://maps.google.com/?q=18.4312,79.1245",
    "googleMapsUrl": "https://maps.google.com/?q=18.4312,79.1245",
    "latitude": 18.4312,
    "longitude": 79.1245,
    "theme": "Mayura Vahana Saraswati & Durga Fusion",
    "description": "Renowned for its peaceful spiritual ambient chanting, majestic tiger throne, and massive crowd for Kumkumarchana.",
    "committee": "Swarajya Yuvasena Collectorate",
    "instagram": "@collectorate_durga_krm",
    "instagramHandle": "@collectorate_durga_krm",
    "instagramUrl": "https://instagram.com/collectorate_durga_krm",
    "reelsCount": 3,
    "photos": [
      {
        "url": "assets/images/hero_durga.jpg",
        "caption": "Sri Sri Durga Parameshwari Sena Main Idol",
        "isPublished": true
      }
    ],
    "priority": 2,
    "isMustVisit": true,
    "isVerified": true,
    "status": "approved",
    "imageUrl": "assets/images/hero_durga.jpg",
    "photoUrl": "assets/images/hero_durga.jpg",
    "createdAt": "2026-10-02T10:00:00.000Z",
    "approvedAt": "2026-10-02T11:00:00.000Z"
  },
  {
    "id": "geetha-bhavan-annapurna",
    "name": "Sri Annapurna Devi Utsava Samithi",
    "teluguName": "శ్రీ అన్నపూర్ణా దేవి ఉత్సవ సమితి",
    "area": "Geetha Bhavan",
    "address": "Geetha Bhavan Cross Roads, Karimnagar",
    "category": "must-visit",
    "categories": [
      "must-visit",
      "grand"
    ],
    "mapsUrl": "https://maps.google.com/?q=18.4370,79.1310",
    "googleMapsUrl": "https://maps.google.com/?q=18.4370,79.1310",
    "latitude": 18.437,
    "longitude": 79.131,
    "theme": "Golden Akshaya Vessel & Annadanam Mandapam",
    "description": "Offering daily Maha Annaprasadam to over 5,000 devotees with grand floral decorations changed every morning.",
    "committee": "Geetha Bhavan Mitra Mandali",
    "instagram": "@geethabhavan_durga_festival",
    "instagramHandle": "@geethabhavan_durga_festival",
    "instagramUrl": "https://instagram.com/geethabhavan_durga_festival",
    "reelsCount": 4,
    "photos": [
      {
        "url": "assets/images/hero_durga.jpg",
        "caption": "Sri Annapurna Devi Utsava Samithi",
        "isPublished": true
      }
    ],
    "priority": 3,
    "isMustVisit": true,
    "isVerified": true,
    "status": "approved",
    "imageUrl": "assets/images/hero_durga.jpg",
    "photoUrl": "assets/images/hero_durga.jpg",
    "createdAt": "2026-10-03T09:00:00.000Z",
    "approvedAt": "2026-10-03T10:00:00.000Z"
  },
  {
    "id": "ramnagar-vaishno-devi",
    "name": "Maa Vaishno Devi Cave Mandapam",
    "teluguName": "మా వైష్ణో దేవి కేవ్ మండపం",
    "area": "Ramnagar",
    "address": "Near Water Tank, Main Road, Ramnagar, Karimnagar",
    "category": "unique",
    "categories": [
      "unique",
      "must-visit"
    ],
    "mapsUrl": "https://maps.google.com/?q=18.4410,79.1450",
    "googleMapsUrl": "https://maps.google.com/?q=18.4410,79.1450",
    "latitude": 18.441,
    "longitude": 79.145,
    "theme": "Realistic Trikuta Mountain Cave Experience",
    "description": "Walk through a 150-feet artificial mist cave with waterfalls recreating the holy pilgrimage of Jammu Vaishno Devi.",
    "committee": "Ramnagar Yuva Mandali",
    "instagram": "@ramnagar_vaishnodevi_krm",
    "instagramHandle": "@ramnagar_vaishnodevi_krm",
    "instagramUrl": "https://instagram.com/ramnagar_vaishnodevi_krm",
    "reelsCount": 7,
    "photos": [
      {
        "url": "assets/images/hero_durga.jpg",
        "caption": "Maa Vaishno Devi Cave Mandapam",
        "isPublished": true
      }
    ],
    "priority": 4,
    "isMustVisit": true,
    "isVerified": true,
    "status": "approved",
    "imageUrl": "assets/images/hero_durga.jpg",
    "photoUrl": "assets/images/hero_durga.jpg",
    "createdAt": "2026-10-03T11:00:00.000Z",
    "approvedAt": "2026-10-03T12:00:00.000Z"
  },
  {
    "id": "mukarampura-simhavahini",
    "name": "Mukarampura Simhavahini Durga",
    "teluguName": "ముకరంపుర సింహవాహిని దుర్గ",
    "area": "Mukarampura",
    "address": "Near Old Market, Beside Hanuman Temple, Mukarampura, Karimnagar",
    "category": "traditional",
    "categories": [
      "traditional",
      "famous"
    ],
    "mapsUrl": "https://maps.google.com/?q=18.4415,79.1360",
    "googleMapsUrl": "https://maps.google.com/?q=18.4415,79.1360",
    "latitude": 18.4415,
    "longitude": 79.136,
    "theme": "Kolkata Clay Style Mahishasura Mardini",
    "description": "Crafted exclusively with eco-friendly natural river clay by artisan sculptors, depicting the dramatic victory over Mahishasura.",
    "committee": "Jai Bhavani Youth Mukarampura",
    "instagram": "@mukarampura_bhavani_youth",
    "instagramHandle": "@mukarampura_bhavani_youth",
    "instagramUrl": "https://instagram.com/mukarampura_bhavani_youth",
    "reelsCount": 2,
    "photos": [
      {
        "url": "assets/images/hero_durga.jpg",
        "caption": "Mukarampura Simhavahini Durga",
        "isPublished": true
      }
    ],
    "priority": 5,
    "isMustVisit": false,
    "isVerified": true,
    "status": "approved",
    "imageUrl": "assets/images/hero_durga.jpg",
    "photoUrl": "assets/images/hero_durga.jpg",
    "createdAt": "2026-10-02T12:00:00.000Z",
    "approvedAt": "2026-10-02T13:00:00.000Z"
  },
  {
    "id": "sapthagiri-colony-navadurga",
    "name": "Sapthagiri Nava Durga Youth",
    "teluguName": "సప్తగిరి నవదుర్గ యూత్",
    "area": "Sapthagiri Colony",
    "address": "Park Street, 3rd Lane, Sapthagiri Colony, Karimnagar",
    "category": "unique",
    "categories": [
      "unique"
    ],
    "mapsUrl": "https://maps.google.com/?q=18.4520,79.1230",
    "googleMapsUrl": "https://maps.google.com/?q=18.4520,79.1230",
    "latitude": 18.452,
    "longitude": 79.123,
    "theme": "9 Forms of Durga 3D Diorama Stage",
    "description": "Featuring moving mechanical dioramas showing Shailaputri, Brahmacharini, Chandraghanta, Kushmanda, Skandamata, Katyayani, Kalaratri, Mahagauri, and Siddhidatri.",
    "committee": "Sapthagiri Youth Association",
    "instagram": "@sapthagiri_durga_club",
    "instagramHandle": "@sapthagiri_durga_club",
    "instagramUrl": "https://instagram.com/sapthagiri_durga_club",
    "reelsCount": 3,
    "photos": [
      {
        "url": "assets/images/hero_durga.jpg",
        "caption": "Sapthagiri Nava Durga Youth",
        "isPublished": true
      }
    ],
    "priority": 6,
    "isMustVisit": false,
    "isVerified": true,
    "status": "approved",
    "imageUrl": "assets/images/hero_durga.jpg",
    "photoUrl": "assets/images/hero_durga.jpg",
    "createdAt": "2026-10-03T14:00:00.000Z",
    "approvedAt": "2026-10-03T15:00:00.000Z"
  },
  {
    "id": "sub-101",
    "name": "Sri Maha Chandi Navaratri Utsavam",
    "teluguName": "శ్రీ మహా చండీ నవరాత్రి ఉత్సవం",
    "area": "Civil Hospital Road",
    "address": "Near Government Head Hospital, Civil Hospital Road, Karimnagar",
    "category": "unique",
    "categories": [
      "unique"
    ],
    "mapsUrl": "https://maps.google.com/?q=18.4365,79.1265",
    "googleMapsUrl": "https://maps.google.com/?q=18.4365,79.1265",
    "latitude": 18.4365,
    "longitude": 79.1265,
    "theme": "Kavacham Alankaram with 1008 Diya Deepam",
    "description": "Community pandal setup with 1008 oil lamps lighted daily at twilight by women devotees.",
    "committee": "Youth Friends Group",
    "instagram": "@civilhospital_durga",
    "instagramHandle": "@civilhospital_durga",
    "instagramUrl": "https://instagram.com/civilhospital_durga",
    "reelsCount": 1,
    "photos": [
      {
        "url": "assets/images/hero_durga.jpg",
        "caption": "Sri Maha Chandi Navaratri Utsavam",
        "isPublished": true
      }
    ],
    "priority": 7,
    "isMustVisit": false,
    "isVerified": true,
    "status": "approved",
    "imageUrl": "assets/images/hero_durga.jpg",
    "photoUrl": "assets/images/hero_durga.jpg",
    "createdAt": "2026-10-04T08:00:00.000Z",
    "approvedAt": "2026-10-04T09:00:00.000Z"
  },
  {
    "id": "bhagyanagar-bhavani-mata",
    "name": "Bhagyanagar Bhavani Youth",
    "teluguName": "భాగ్యనగర్ భవానీ యూత్",
    "area": "Bhagyanagar",
    "address": "Main Road, Near Arch, Bhagyanagar, Karimnagar",
    "category": "grand",
    "categories": [
      "grand",
      "famous"
    ],
    "mapsUrl": "https://maps.google.com/?q=18.4440,79.1150",
    "googleMapsUrl": "https://maps.google.com/?q=18.4440,79.1150",
    "latitude": 18.444,
    "longitude": 79.115,
    "theme": "Glowing Crystal & Glass Palace Theme",
    "description": "Over 50,000 LED lights creating a sparkling crystal cave entrance leading to the divine sanctum of Bhavani Mata.",
    "committee": "Bhagyanagar Utsav Committee",
    "instagram": "@bhagyanagar_durga_krm",
    "instagramHandle": "@bhagyanagar_durga_krm",
    "instagramUrl": "https://instagram.com/bhagyanagar_durga_krm",
    "reelsCount": 3,
    "photos": [
      {
        "url": "assets/images/hero_durga.jpg",
        "caption": "Bhagyanagar Bhavani Youth",
        "isPublished": true
      }
    ],
    "priority": 8,
    "isMustVisit": false,
    "isVerified": true,
    "status": "approved",
    "imageUrl": "assets/images/hero_durga.jpg",
    "photoUrl": "assets/images/hero_durga.jpg",
    "createdAt": "2026-10-03T16:00:00.000Z",
    "approvedAt": "2026-10-03T17:00:00.000Z"
  },
  {
    "id": "kothirampur-kamakshi",
    "name": "Sri Kamakshi Ammavaru Mandapam",
    "teluguName": "శ్రీ కామాక్షి అమ్మవారు మండపం",
    "area": "Kothirampur",
    "address": "Behind Zilla Parishad High School, Kothirampur, Karimnagar",
    "category": "traditional",
    "categories": [
      "traditional"
    ],
    "mapsUrl": "https://maps.google.com/?q=18.4280,79.1410",
    "googleMapsUrl": "https://maps.google.com/?q=18.4280,79.1410",
    "latitude": 18.428,
    "longitude": 79.141,
    "theme": "South Indian Temple Gopuram Setup",
    "description": "Replica of Kanchi Kamakshi temple courtyard with Carnatic classical concerts every evening during Navaratri.",
    "committee": "Kothirampur Boys Sena",
    "instagram": "@kothirampur_cha_raja",
    "instagramHandle": "@kothirampur_cha_raja",
    "instagramUrl": "https://instagram.com/kothirampur_cha_raja",
    "reelsCount": 2,
    "photos": [
      {
        "url": "assets/images/hero_durga.jpg",
        "caption": "Sri Kamakshi Ammavaru Mandapam",
        "isPublished": true
      }
    ],
    "priority": 9,
    "isMustVisit": false,
    "isVerified": true,
    "status": "approved",
    "imageUrl": "assets/images/hero_durga.jpg",
    "photoUrl": "assets/images/hero_durga.jpg",
    "createdAt": "2026-10-03T18:00:00.000Z",
    "approvedAt": "2026-10-03T19:00:00.000Z"
  }
];

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

// 100% Free Authentic Google Maps Tile Layers Factory (Roadmap & Terrain only, satellite removed)
function createGoogleTileLayers() {
  const roadmap = L.tileLayer('https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20,
    attribution: '&copy; Google Maps'
  });
  const terrain = L.tileLayer('https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20,
    attribution: '&copy; Google Maps Terrain'
  });
  return { roadmap, terrain };
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

// Neutral non-branded user silhouette placeholder (Used when handler DP is not set)
window.NEUTRAL_DP_PLACEHOLDER = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <circle cx="32" cy="32" r="32" fill="#f1f5f9"/>
  <circle cx="32" cy="24" r="11" fill="#94a3b8"/>
  <path d="M14 54c0-9.9 8.1-18 18-18s18 8.1 18 18" fill="#94a3b8"/>
</svg>`);

// Exact Developer Profile (Erukulla Varun @chintuvarun_3008)
window.DEVELOPER_INSTAGRAM = {
  name: "Erukulla Varun",
  handle: "chintuvarun_3008",
  username: "chintuvarun_3008",
  url: "https://instagram.com/chintuvarun_3008",
  dp: "assets/images/developer-varun.jpg"
};
window.DEVELOPER_DP = "assets/images/developer-varun.jpg";

// Helper to get exact Handler DP for a pandal (Strictly no website logos, Durga photos, or developer DP)
function getHandlerProfileDp(mandapam) {
  if (!mandapam) return window.NEUTRAL_DP_PLACEHOLDER;
  const rawDp = (mandapam.handlerDp || mandapam.profilePic || mandapam.dpUrl || '').trim();
  // Ensure we NEVER return website logo, Durga photo, or developer photo as a handler's DP
  if (rawDp && !rawDp.includes('logo.jpg') && !rawDp.includes('hero-durga') && !rawDp.includes('developer-varun')) {
    return rawDp;
  }
  return window.NEUTRAL_DP_PLACEHOLDER;
}

// Multi-image helper for community members / handlers if they uploaded multiple DPs
function getCommunityProfilePics(mandapam) {
  if (!mandapam) return [window.NEUTRAL_DP_PLACEHOLDER];
  const pics = [];
  const checkAndAdd = (url) => {
    if (url && typeof url === 'string') {
      const u = url.trim();
      if (u && !u.includes('logo.jpg') && !u.includes('hero-durga') && !u.includes('developer-varun') && !pics.includes(u)) {
        pics.push(u);
      }
    }
  };
  checkAndAdd(mandapam.handlerDp);
  checkAndAdd(mandapam.profilePic);
  checkAndAdd(mandapam.dpUrl);
  if (Array.isArray(mandapam.profilePics)) {
    mandapam.profilePics.forEach(p => checkAndAdd(p));
  }
  if (pics.length === 0) {
    pics.push(window.NEUTRAL_DP_PLACEHOLDER);
  }
  return pics;
}

// Public pandals getter: Strictly approved pandals only
function getMandapams() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.MANDAPAMS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.filter(m => m && m.id && !String(m.id).startsWith("kd-") && !String(m.name || '').includes("Mankammathota Durga Samithi") && ((m.isVerified === true || m.status === 'approved') && m.status !== 'pending'));
      }
    }
  } catch (e) {
    console.error("Error reading mandapams from localStorage:", e);
  }
  return DEFAULT_MANDAPAMS.filter(m => (m.isVerified === true || m.status === 'approved') && m.status !== 'pending');
}

// Unfiltered getter reserved for admin dashboard
function getAllMandapamsForAdmin() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.MANDAPAMS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return DEFAULT_MANDAPAMS;
}

// Safe storage with error safety and high-capacity quota protection
function safeSaveMandapams(mandapams) {
  if (!Array.isArray(mandapams)) return;
  try {
    const sanitized = mandapams.map(m => {
      if (!m || !Array.isArray(m.photos)) return m;
      const cleanPhotos = m.photos.map(p => {
        const url = (typeof p === 'string') ? p : (p.url || '');
        if (url && typeof url === 'string' && url.startsWith('data:image/') && url.length > 5000) {
          return typeof p === 'string' ? 'assets/images/hero-durga.jpg' : { ...p, url: 'assets/images/hero-durga.jpg' };
        }
        return p;
      });
      return { ...m, photos: cleanPhotos };
    });
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

// Google Maps Explorer & Navigation URL Helper: Returns the exact submitted location URL
function getGoogleMapsUrl(item) {
  if (!item) return "";

  // Priority: Always return the exact submitted Google Maps URL
  const raw = item.mapsUrl || item.googleMapsUrl;
  if (raw && typeof raw === "string" && raw.trim()) {
    const trimmed = raw.trim();
    return (trimmed.startsWith("http://") || trimmed.startsWith("https://")) ? trimmed : `https://${trimmed}`;
  }

  // If coordinates are explicitly available and not the generic Karimnagar center
  let lat = item.latitude || (item.coordinates && item.coordinates.lat);
  let lng = item.longitude || (item.coordinates && item.coordinates.lng);
  if (lat && lng && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng))) {
    const pLat = parseFloat(lat);
    const pLng = parseFloat(lng);
    if (pLat !== 18.4386 || pLng !== 79.1288) {
      return `https://www.google.com/maps/dir/?api=1&destination=${pLat.toFixed(5)},${pLng.toFixed(5)}`;
    }
  }

  // Never return default coordinates or automatically substituted landmark locations
  return "";
}

// Google Street View 360 Panorama Helper
function getGoogleStreetViewUrl(item) {
  if (!item) return "";
  let lat = item.latitude || (item.coordinates && item.coordinates.lat);
  let lng = item.longitude || (item.coordinates && item.coordinates.lng);
  if (!lat || !lng || isNaN(parseFloat(lat)) || isNaN(parseFloat(lng))) return "";
  if (parseFloat(lat) === 18.4386 && parseFloat(lng) === 79.1288) return "";
  return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${parseFloat(lat).toFixed(5)},${parseFloat(lng).toFixed(5)}`;
}

// Photo Gallery Helpers
function buildGalleryPhotosArray() {
  allGalleryPhotos = [];
  const verifiedList = getMandapams().filter(m => (m.isVerified === true || m.status === 'approved') && m.status !== 'pending');
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
// Robust GPS Location Detection Engine with Two-Tier Fallback & Specific Error Handling
// --------------------------------------------------------------------------
let isGpsDetectionRunning = false;

function detectUserGpsLocation(callbacks = {}) {
  const { onStart, onSuccess, onError, onStatus } = callbacks;

  // 1. Guard against concurrent in-flight requests
  if (isGpsDetectionRunning) {
    if (onStatus) onStatus("GPS detection in progress...");
    return;
  }

  // 2. Check browser geolocation support
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    if (onError) {
      onError({
        code: 0,
        type: "unsupported",
        title: "Geolocation Not Supported",
        message: "Your web browser does not support GPS location detection. You can browse pandals by selecting an area from the list below.",
        canRetry: false
      });
    }
    return;
  }

  // 3. Check for secure context (HTTPS / localhost / 127.0.0.1)
  const isSecure = (typeof window !== "undefined") && (
    window.isSecureContext ||
    location.hostname === "localhost" ||
    location.hostname === "127.0.0.1" ||
    location.protocol === "https:"
  );

  if (!isSecure) {
    if (onError) {
      onError({
        code: 0,
        type: "insecure",
        title: "HTTPS Connection Required",
        message: "Browser security requires a secure HTTPS connection to access device GPS. Please browse using HTTPS or choose an area from the list below.",
        canRetry: false
      });
    }
    return;
  }

  isGpsDetectionRunning = true;
  if (onStart) onStart();
  if (onStatus) onStatus("Acquiring GPS location...");

  function mapGpsError(err) {
    const code = err ? err.code : 0;
    if (code === 1) { // PERMISSION_DENIED
      return {
        code: 1,
        type: "permission_denied",
        title: "Location Permission Denied",
        message: "Location permission was blocked. To find Durga pandals near you, please allow location access in your browser settings (tap the lock 🔒 or site settings icon in the address bar and enable Location), or choose an area from the list below.",
        canRetry: true
      };
    }
    if (code === 2) { // POSITION_UNAVAILABLE
      return {
        code: 2,
        type: "position_unavailable",
        title: "GPS Position Unavailable",
        message: "Your device was unable to determine its current GPS position. Please make sure device location/GPS is turned ON and try again, or choose an area from the list below.",
        canRetry: true
      };
    }
    if (code === 3) { // TIMEOUT
      return {
        code: 3,
        type: "timeout",
        title: "GPS Request Timed Out",
        message: "GPS took too long to respond before retrieving coordinates. You can tap 'Retry GPS' below or choose an area from the list.",
        canRetry: true
      };
    }
    return {
      code: code,
      type: "unknown",
      title: "Could Not Detect GPS Location",
      message: (err && err.message) ? err.message : "Unable to acquire current location. Please choose an area from the list below.",
      canRetry: true
    };
  }

  // Tier 1: Try high-accuracy GPS with 10s timeout
  const tier1Options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60000
  };

  // Tier 2: Low-accuracy / Wi-Fi / cellular fallback with 12s timeout
  const tier2Options = {
    enableHighAccuracy: false,
    timeout: 12000,
    maximumAge: 300000
  };

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      isGpsDetectionRunning = false;
      if (onSuccess) onSuccess(pos);
    },
    (err1) => {
      // If user explicitly denied permission, do not retry Tier 2
      if (err1 && err1.code === 1) {
        isGpsDetectionRunning = false;
        if (onError) onError(mapGpsError(err1));
        return;
      }

      // If timeout or unavailable, attempt Tier 2 standard network location fallback
      if (onStatus) onStatus("Connecting to network positioning...");
      navigator.geolocation.getCurrentPosition(
        (fallbackPos) => {
          isGpsDetectionRunning = false;
          if (onSuccess) onSuccess(fallbackPos);
        },
        (err2) => {
          isGpsDetectionRunning = false;
          if (onError) onError(mapGpsError(err2 || err1));
        },
        tier2Options
      );
    },
    tier1Options
  );
}

function showGpsNotificationBanner(errorInfo, onRetry) {
  if (typeof document === "undefined") return;

  let container = document.getElementById("gps-status-banner-container");
  if (!container) {
    const heroSearch = document.getElementById("main-search-form");
    if (heroSearch && heroSearch.parentNode && heroSearch.parentNode.parentNode) {
      container = document.createElement("div");
      container.id = "gps-status-banner-container";
      container.className = "mt-3 max-w-xl";
      heroSearch.parentNode.parentNode.appendChild(container);
    }
  }

  if (!container) {
    if (errorInfo && errorInfo.message) alert(errorInfo.message);
    return;
  }

  const icon = errorInfo.type === "permission_denied" ? "🔒"
    : errorInfo.type === "insecure" ? "🛡️"
    : errorInfo.type === "timeout" ? "⏳"
    : "📍";

  container.innerHTML = `
    <div id="gps-status-banner" class="rounded-2xl border border-amber-300 bg-amber-50/95 p-3.5 shadow-soft backdrop-blur text-left transition-all">
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-start gap-2.5 min-w-0">
          <span class="text-lg shrink-0 mt-0.5">${icon}</span>
          <div class="min-w-0">
            <h4 class="font-bold text-xs sm:text-sm text-ink-900 leading-snug">${errorInfo.title || "Location Notice"}</h4>
            <p class="text-xs text-ink-700 leading-relaxed mt-1">${errorInfo.message}</p>
          </div>
        </div>
        <button type="button" onclick="hideGpsNotificationBanner()" class="h-6 w-6 rounded-full bg-amber-100 hover:bg-amber-200 text-ink-600 grid place-items-center text-xs shrink-0 cursor-pointer" title="Dismiss">✕</button>
      </div>
      <div class="mt-3 pt-2.5 border-t border-amber-200/70 flex flex-wrap items-center gap-2">
        ${errorInfo.canRetry ? `
        <button type="button" id="btn-gps-banner-retry" class="px-3 py-1.5 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-xs shadow-soft transition cursor-pointer flex items-center gap-1.5">
          <span>🔄</span> <span>Retry GPS</span>
        </button>` : ''}
        <button type="button" onclick="scrollToAreaSelection()" class="px-3 py-1.5 rounded-xl bg-white hover:bg-cream-100 text-saffron-800 border border-saffron-300 font-bold text-xs transition cursor-pointer flex items-center gap-1.5">
          <span>📍</span> <span>Browse Areas Below</span>
        </button>
      </div>
    </div>
  `;

  if (errorInfo.canRetry && typeof onRetry === "function") {
    const retryBtn = document.getElementById("btn-gps-banner-retry");
    if (retryBtn) {
      retryBtn.onclick = (e) => {
        e.preventDefault();
        hideGpsNotificationBanner();
        onRetry();
      };
    }
  }
}

function hideGpsNotificationBanner() {
  if (typeof document === "undefined") return;
  const banner = document.getElementById("gps-status-banner");
  if (banner) banner.remove();
}

function scrollToAreaSelection() {
  if (typeof document === "undefined") return;
  hideGpsNotificationBanner();
  const el = document.getElementById("area-filter-pills") || document.getElementById("area-pills-container") || document.getElementById("directory-section");
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

if (typeof window !== "undefined") {
  window.detectUserGpsLocation = detectUserGpsLocation;
  window.showGpsNotificationBanner = showGpsNotificationBanner;
  window.hideGpsNotificationBanner = hideGpsNotificationBanner;
  window.scrollToAreaSelection = scrollToAreaSelection;
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
