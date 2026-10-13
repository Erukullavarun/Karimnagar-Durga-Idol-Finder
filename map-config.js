// 100% Free Google Maps & Street View Engine for Karimnagar Durga Idol Finder
// Provides live day-to-day Google Maps, Google Satellite Hybrid, and Free Street View Navigation.
// Zero API Key required, Zero Cost, Zero 403 errors.

const KARIMNAGAR_LANDMARKS = {
  // Stadiums, Colleges & Public Grounds
  "Dr. BR Ambedkar Stadium": [18.42882, 79.12768],
  "Ambedkar Stadium": [18.42882, 79.12768],
  "Dr BR Ambedkar Stadium": [18.42882, 79.12768],
  "Ambedakar Stadium": [18.42882, 79.12768],
  "SRR College Ground": [18.42750, 79.12350],
  "SRR Government Degree College": [18.42750, 79.12350],
  "Circus Ground": [18.43720, 79.13250],
  
  // Transport & Important Chowrastas
  "Karimnagar Bus Station": [18.43380, 79.13320],
  "TSRTC Bus Stand": [18.43380, 79.13320],
  "Karimnagar Railway Station": [18.42150, 79.15580],
  "Tower Circle": [18.43860, 79.12880],
  "Clock Tower": [18.43860, 79.12880],
  "Kaman Chowrasta": [18.43500, 79.12750],
  "Collectorate Chowrasta": [18.44280, 79.13520],
  "District Collectorate": [18.44280, 79.13520],
  "Rajeev Chowk": [18.43480, 79.13500],
  "Geetha Bhavan": [18.43650, 79.13100],
  "Court Chowrasta": [18.44000, 79.12700],
  "District Court": [18.44000, 79.12700],
  "Court Road": [18.44000, 79.12700],
  
  // Colonies & Neighbourhoods
  "Mukarampura": [18.44120, 79.13150],
  "Mankammathota": [18.43350, 79.12450],
  "Sapthagiri Colony": [18.45100, 79.13200],
  "Vavilalapalli": [18.44800, 79.14100],
  "Jyothi Nagar": [18.44650, 79.12500],
  "Karkhanagadda": [18.43950, 79.13800],
  "Kashmirgadda": [18.44500, 79.13900],
  "Housing Board Colony": [18.45500, 79.13800],
  "Bhagathnagar": [18.44400, 79.12600],
  "Vidyanagar": [18.42850, 79.12550], // Vidyanagar Entrance & Main Road
  "Vidyanagar Entrance": [18.42850, 79.12550],
  "Vidya Nagar": [18.42850, 79.12550],
  "Subhashnagar": [18.43700, 79.12200],
  "Kishan Nagar": [18.44900, 79.12900],
  "Alugunoor": [18.41000, 79.15500],
  "Padmanagar": [18.42500, 79.11800],
  "Chinthakunta": [18.46000, 79.14500],
  "Ganeshnagar": [18.44200, 79.14300],
  "Gandhi Road": [18.43900, 79.13050],
  "Adarsh Nagar": [18.45200, 79.12700],
  "Bavapet": [18.43600, 79.13400],
  "Sawaran Street": [18.44050, 79.13250],
  "Sitarampur": [18.43400, 79.14200],
  "Rekurthi": [18.46500, 79.11200],
  "Kothapalli": [18.46200, 79.09500],
  
  // Landmarks, Parks & Temples
  "Lower Manair Dam (LMD)": [18.40500, 79.14800],
  "Ujwala Park": [18.40500, 79.14800],
  "Deer Park": [18.40800, 79.14600],
  "Government Civil Hospital": [18.44100, 79.13400],
  "Maha Shakthi Temple": [18.43800, 79.12900],
  "Shwetharka Ganapathi Temple": [18.44600, 79.12600],
  "Thimmapur": [18.35800, 79.16800]
};

const MAP_CONFIG = {
  // Free Live Google Maps Tile Endpoints (Streets, Colonies, Roads, Landmarks)
  GOOGLE_ROADS: "https://mt{s}.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}",
  GOOGLE_HYBRID: "https://mt{s}.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}",
  GOOGLE_SATELLITE: "https://mt{s}.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}",
  GOOGLE_TERRAIN: "https://mt{s}.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}",

  // Ultra-crisp Mobility Backup Layer (CartoDB Voyager - used by mobility & delivery apps)
  CARTO_VOYAGER: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",

  SUBDOMAINS_GOOGLE: ["0", "1", "2", "3"],
  SUBDOMAINS_CARTO: ["a", "b", "c", "d"],
  DEFAULT_CENTER: [18.4386, 79.1288], // Karimnagar Tower Circle Center
  DEFAULT_ZOOM: 14,
  MAX_ZOOM: 20
};

/**
 * Creates a ready-to-use Free Google Maps Leaflet TileLayer.
 */
function getFreeGoogleMapsLayer(layerType = "roads") {
  if (typeof L === "undefined") {
    console.error("Leaflet library (L) is not loaded yet.");
    return null;
  }

  if (layerType === "hybrid" || layerType === "satellite") {
    return L.tileLayer("https://mt1.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}", {
      maxZoom: 20,
      maxNativeZoom: 19,
      attribution: '&copy; Google Maps'
    });
  }

  if (layerType === "carto") {
    return L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      subdomains: ['a', 'b', 'c', 'd'],
      maxZoom: 20,
      maxNativeZoom: 19,
      attribution: '&copy; CARTO &copy; OpenStreetMap'
    });
  }

  // Default: Google Roads Layer (Streets, colonies, highways, landmarks - Zero API Key)
  return L.tileLayer("https://mt1.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}", {
    maxZoom: 20,
    maxNativeZoom: 19,
    attribution: '&copy; Google Maps'
  });
}

/**
 * Resolves any place name or text query to Karimnagar coordinates [lat, lng].
 * Instant local matching + free live Photon geocoder.
 */
async function resolvePlaceToCoordinates(query) {
  if (!query || typeof query !== "string") return null;
  const clean = query.trim();
  const lower = clean.toLowerCase();

  // 1. Direct local lookup in comprehensive landmarks
  for (const [name, coords] of Object.entries(KARIMNAGAR_LANDMARKS)) {
    const nl = name.toLowerCase();
    if (lower === nl || lower.includes(nl) || nl.includes(lower)) {
      return { name, lat: coords[0], lng: coords[1], source: "local" };
    }
  }

  // 2. Fuzzy words lookup (e.g. "ambedkar" and "stadium")
  const words = lower.split(/[\s,.-]+/).filter(w => w.length > 2 && w !== "karimnagar" && w !== "near");
  if (words.length > 0) {
    for (const [name, coords] of Object.entries(KARIMNAGAR_LANDMARKS)) {
      const nl = name.toLowerCase();
      if (words.every(w => nl.includes(w))) {
        return { name, lat: coords[0], lng: coords[1], source: "local_words" };
      }
    }
  }

  // 3. Free Live Geocoder (Photon biased around Karimnagar)
  try {
    const searchUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(clean)}&lat=18.4386&lon=79.1288&limit=3`;
    const res = await fetch(searchUrl);
    const data = await res.json();
    if (data && data.features && data.features.length > 0) {
      const first = data.features[0];
      const lng = first.geometry.coordinates[0];
      const lat = first.geometry.coordinates[1];
      const title = first.properties.name || clean;
      return { name: title, lat, lng, source: "photon" };
    }
  } catch (err) {
    console.warn("Live geocoder lookup error:", err);
  }

  return null;
}

/**
 * Searches Karimnagar places and landmarks for auto-complete dropdown.
 */
async function searchKarimnagarPlaces(query) {
  if (!query || typeof query !== "string") return [];
  const q = query.trim().toLowerCase();
  const results = [];

  // Local matches
  for (const [name, coords] of Object.entries(KARIMNAGAR_LANDMARKS)) {
    if (name.toLowerCase().includes(q)) {
      results.push({ name, lat: coords[0], lng: coords[1], subtitle: "Karimnagar Landmark" });
    }
  }

  // If local results are few, supplement with free Photon geocoder
  if (results.length < 5 && q.length >= 3) {
    try {
      const searchUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&lat=18.4386&lon=79.1288&limit=5`;
      const res = await fetch(searchUrl);
      const data = await res.json();
      if (data && data.features) {
        data.features.forEach(f => {
          const name = f.properties.name || f.properties.street || "";
          if (name && !results.some(r => r.name.toLowerCase() === name.toLowerCase())) {
            results.push({
              name: name,
              lat: f.geometry.coordinates[1],
              lng: f.geometry.coordinates[0],
              subtitle: f.properties.city || "Karimnagar"
            });
          }
        });
      }
    } catch (e) {}
  }

  return results.slice(0, 8);
}

/**
 * Generates direct Google Maps location URL with precise pin and label.
 */
function getDirectGooglePlaceUrl(lat, lng, name) {
  const pName = name || "Durga Pandal";
  return `https://www.google.com/maps/search/?api=1&query=${parseFloat(lat).toFixed(5)},${parseFloat(lng).toFixed(5)}+(${encodeURIComponent(pName)})`;
}

/**
 * Generates direct Google Maps Navigation URL.
 */
function getDirectGoogleNavUrl(lat, lng) {
  return `https://www.google.com/maps/dir/?api=1&destination=${parseFloat(lat).toFixed(5)},${parseFloat(lng).toFixed(5)}`;
}

/**
 * Generates direct Google Maps 360 Street View URL.
 */
function getDirectGoogleStreetViewUrl(lat, lng) {
  return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${parseFloat(lat).toFixed(5)},${parseFloat(lng).toFixed(5)}`;
}

if (typeof window !== "undefined") {
  window.KARIMNAGAR_LANDMARKS = KARIMNAGAR_LANDMARKS;
  window.MAP_CONFIG = MAP_CONFIG;
  window.getFreeGoogleMapsLayer = getFreeGoogleMapsLayer;
  window.resolvePlaceToCoordinates = resolvePlaceToCoordinates;
  window.searchKarimnagarPlaces = searchKarimnagarPlaces;
  window.getDirectGooglePlaceUrl = getDirectGooglePlaceUrl;
  window.getDirectGoogleNavUrl = getDirectGoogleNavUrl;
  window.getDirectGoogleStreetViewUrl = getDirectGoogleStreetViewUrl;
}
