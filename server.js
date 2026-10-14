import express from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import compression from 'compression';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = process.env.DATA_DIR || __dirname;
const DATA_FILE = process.env.DATA_FILE || path.join(DATA_DIR, 'portal-database.json');
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(DATA_DIR, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

if (!fs.existsSync(DATA_FILE) && fs.existsSync(path.join(__dirname, 'portal-database.json'))) {
  try {
    fs.copyFileSync(path.join(__dirname, 'portal-database.json'), DATA_FILE);
  } catch (e) {
    console.warn("Could not copy initial portal-database.json to DATA_DIR:", e);
  }
}

app.use(compression());
app.use(cors({ origin: true, credentials: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Private-Network", "true");
  if (req.path.startsWith('/api')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ extended: true, limit: '200mb' }));

// Serve uploaded idol photos
app.use('/uploads', express.static(UPLOADS_DIR, { maxAge: '7d' }));

// Static Assets with Cache-Control headers and clean URL extensions (.html)
app.use(express.static(path.join(__dirname), {
  extensions: ['html', 'htm'],
  maxAge: '1d',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html') || filePath.endsWith('.htm')) {
      res.setHeader('Cache-Control', 'no-cache');
    } else if (filePath.match(/\.(jpg|jpeg|png|gif|svg|webp|ico|css|js)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
  }
}));

// Helper to save base64 images to uploads/ folder to keep database and localStorage lightweight
function processAndSavePhotos(photos, mandapamId) {
  if (!Array.isArray(photos)) return [];
  const safeId = String(mandapamId).replace(/[^a-zA-Z0-9_-]/g, '_');
  return photos.map((p, idx) => {
    let url = (typeof p === 'string') ? p : (p.url || '');
    const caption = (typeof p === 'object' && p.caption) ? p.caption : '';

    if (url && typeof url === 'string' && url.startsWith('data:image/')) {
      try {
        const matches = url.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
        if (matches) {
          let ext = matches[1].toLowerCase();
          if (ext === 'jpeg') ext = 'jpg';
          const buffer = Buffer.from(matches[2], 'base64');
          const fileName = `idol_${safeId}_${idx + 1}_${Date.now()}.${ext}`;
          const filePath = path.join(UPLOADS_DIR, fileName);
          fs.writeFileSync(filePath, buffer);
          url = `uploads/${fileName}`;
        }
      } catch (err) {
        console.error('Error saving uploaded photo to file:', err);
      }
    }

    if (typeof p === 'string') {
      return url;
    }
    return { ...p, url: url, caption: caption };
  });
}

// Helper to save a single base64 image (such as handler Instagram DP) to uploads/ folder
function processAndSaveSingleImage(imgData, prefix, mandapamId) {
  if (!imgData || typeof imgData !== 'string') return '';
  const safeId = String(mandapamId || 'item').replace(/[^a-zA-Z0-9_-]/g, '_');
  if (imgData.startsWith('data:image/')) {
    try {
      const matches = imgData.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (matches) {
        let ext = matches[1].toLowerCase();
        if (ext === 'jpeg') ext = 'jpg';
        const buffer = Buffer.from(matches[2], 'base64');
        const fileName = `${prefix}_${safeId}_${Date.now()}.${ext}`;
        const filePath = path.join(UPLOADS_DIR, fileName);
        fs.writeFileSync(filePath, buffer);
        return `uploads/${fileName}`;
      }
    } catch (err) {
      console.error(`Error saving ${prefix} to file:`, err);
    }
  }
  return imgData;
}

const INITIAL_AREAS = [
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
  "Sitarampur"
];

function readDB() {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      if (data && Array.isArray(data.mandapams)) {
        return data;
      }
    } catch (e) {
      console.error('Error parsing portal-database.json:', e);
    }
  }
  return {
    mandapams: [],
    areas: INITIAL_AREAS,
    config: null,
    updatedAt: new Date().toISOString()
  };
}

function writeDB(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing to portal-database.json:', err);
    return false;
  }
}

// --------------------------------------------------------------------------
// Public API Endpoints (Index Panel & Live Website)
// --------------------------------------------------------------------------

// Get only approved pandals for public index & map
app.get('/api/mandapams', (req, res) => {
  const db = readDB();
  const approved = (db.mandapams || []).filter(m => m.isVerified === true || m.status === 'approved');
  res.json({ success: true, count: approved.length, mandapams: approved });
});

// Get single pandal by ID
app.get('/api/mandapams/:id', (req, res) => {
  const db = readDB();
  const id = req.params.id;
  const item = (db.mandapams || []).find(m => String(m.id) === String(id));
  if (!item || (!item.isVerified && item.status !== 'approved')) {
    return res.status(404).json({ success: false, message: 'Pandal not found' });
  }
  res.json({ success: true, mandapam: item });
});

// Helper to extract exact coords from Google Maps URL if present
function extractCoordsFromMapsUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) {
    const lat = parseFloat(atMatch[1]);
    const lng = parseFloat(atMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
  }
  const paramMatch = url.match(/[?&](?:q|query|ll|destination)=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (paramMatch) {
    const lat = parseFloat(paramMatch[1]);
    const lng = parseFloat(paramMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
  }
  const slashMatch = url.match(/\/(?:dir|place)\/[^/]*\/(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (slashMatch) {
    const lat = parseFloat(slashMatch[1]);
    const lng = parseFloat(slashMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
  }
  return null;
}

// Community submit Durga Pandal (Submitted with isVerified = false, pending admin approval)
app.post('/api/mandapams', (req, res) => {
  try {
    const db = readDB();
    const id = req.body.id || `m-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const isApproved = req.body.isVerified === true || req.body.status === 'approved';
    const processedPhotos = processAndSavePhotos(req.body.photos || [], id);
    const submittedUrl = (req.body.mapsUrl || req.body.googleMapsUrl || '').trim();

    let lat = null;
    let lng = null;
    if (req.body.latitude !== undefined && req.body.latitude !== null && !isNaN(parseFloat(req.body.latitude))) {
      const pLat = parseFloat(req.body.latitude);
      if (pLat !== 18.4386) lat = pLat;
    }
    if (req.body.longitude !== undefined && req.body.longitude !== null && !isNaN(parseFloat(req.body.longitude))) {
      const pLng = parseFloat(req.body.longitude);
      if (pLng !== 79.1288) lng = pLng;
    }
    if ((!lat || !lng) && submittedUrl) {
      const extracted = extractCoordsFromMapsUrl(submittedUrl);
      if (extracted) {
        lat = extracted.lat;
        lng = extracted.lng;
      }
    }

    const submittedHandlerDp = (req.body.handlerDp || req.body.profilePic || req.body.instagramDpUrl || '').trim();
    const savedHandlerDp = processAndSaveSingleImage(submittedHandlerDp, 'dp', id);

    const newEntry = {
      id: id,
      name: req.body.name || 'Durga Mandapam',
      teluguName: req.body.teluguName || '',
      area: req.body.area || 'Karimnagar',
      address: req.body.address || '',
      category: req.body.category || 'famous',
      categories: req.body.categories || [req.body.category || 'famous'],
      mapsUrl: submittedUrl,
      googleMapsUrl: submittedUrl,
      latitude: lat,
      longitude: lng,
      description: req.body.description || '',
      instagramHandle: req.body.instagramHandle || req.body.instagram || '',
      instagramUrl: req.body.instagramUrl || (req.body.instagramHandle ? `https://instagram.com/${req.body.instagramHandle.replace('@', '')}` : ''),
      handlerDp: savedHandlerDp,
      photos: processedPhotos,
      priority: parseInt(req.body.priority) || 10,
      isMustVisit: req.body.isMustVisit === true || req.body.category === 'must-visit',
      isVerified: isApproved, // Admin can set true directly, community submits default false
      status: isApproved ? 'approved' : 'pending',
      createdAt: req.body.createdAt || new Date().toISOString()
    };

    // Also ensure area exists in db.areas if specified
    if (newEntry.area && typeof newEntry.area === 'string' && newEntry.area.trim()) {
      const trimmedArea = newEntry.area.trim();
      if (!Array.isArray(db.areas)) {
        db.areas = [...INITIAL_AREAS];
      }
      if (!db.areas.includes(trimmedArea)) {
        db.areas.push(trimmedArea);
      }
    }

    // Replace if exists, else unshift
    const existingIndex = db.mandapams.findIndex(m => String(m.id) === String(newEntry.id));
    if (existingIndex !== -1) {
      db.mandapams[existingIndex] = { ...db.mandapams[existingIndex], ...newEntry };
    } else {
      db.mandapams.unshift(newEntry);
    }
    writeDB(db);

    console.log(`[SERVER] Saved mandapam "${newEntry.name}" (ID: ${newEntry.id}) - Status: ${newEntry.status}`);

    res.status(201).json({
      success: true,
      message: 'Durga Pandal saved successfully!',
      mandapam: newEntry
    });
  } catch (err) {
    console.error('Error saving mandapam:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get areas list
app.get('/api/areas', (req, res) => {
  const db = readDB();
  res.json({ success: true, areas: db.areas || INITIAL_AREAS });
});

// Get site configuration and all data (public endpoint: strictly approved pandals only)
app.get('/api/site-data', (req, res) => {
  const db = readDB();
  const approvedPandals = (db.mandapams || []).filter(m => (m.isVerified === true || m.status === 'approved') && m.status !== 'pending');
  res.json({
    success: true,
    data: {
      ...db,
      mandapams: approvedPandals
    }
  });
});

// Admin-specific full site data endpoint
app.get('/api/admin/site-data', (req, res) => {
  const db = readDB();
  res.json({ success: true, data: db });
});

// Analytics: Page View Tracking for per-page visibility stats
app.post('/api/analytics/pageview', (req, res) => {
  try {
    const { path: pPath } = req.body || {};
    if (!pPath) return res.json({ success: false });
    const cleanPath = String(pPath).split('?')[0] || '/';
    const db = readDB();
    db.pageViews = db.pageViews || {};
    db.pageViews[cleanPath] = (db.pageViews[cleanPath] || 0) + 1;
    db.totalViews = (db.totalViews || 0) + 1;
    writeDB(db);
    res.json({ success: true, pathViews: db.pageViews[cleanPath], total: db.totalViews });
  } catch (err) {
    res.json({ success: false });
  }
});

app.get('/api/analytics/stats', (req, res) => {
  const db = readDB();
  res.json({
    success: true,
    totalViews: db.totalViews || 0,
    pageViews: db.pageViews || {}
  });
});

// --------------------------------------------------------------------------
// Admin API Endpoints (Admin Panel Control)
// --------------------------------------------------------------------------

// Get ALL pandals (both pending and approved) for Admin Portal
app.get('/api/admin/mandapams', (req, res) => {
  const db = readDB();
  res.json({ success: true, count: db.mandapams.length, mandapams: db.mandapams });
});

// Approve a pandal (sets isVerified = true, status = approved)
app.put('/api/admin/mandapams/:id/approve', (req, res) => {
  try {
    const db = readDB();
    const id = req.params.id;
    let idx = db.mandapams.findIndex(m => String(m.id) === String(id));

    if (idx === -1) {
      // If pandal wasn't found in server DB, upsert from req.body if provided
      if (req.body && req.body.name) {
        const processedPhotos = processAndSavePhotos(req.body.photos || [], id);
        const newApprovedEntry = {
          ...req.body,
          id: id,
          photos: processedPhotos,
          isVerified: true,
          status: 'approved',
          approvedAt: new Date().toISOString(),
          createdAt: req.body.createdAt || new Date().toISOString()
        };
        db.mandapams.unshift(newApprovedEntry);
        idx = 0;
      } else {
        return res.status(404).json({ success: false, message: 'Mandapam not found' });
      }
    } else {
      db.mandapams[idx].isVerified = true;
      db.mandapams[idx].status = 'approved';
      db.mandapams[idx].approvedAt = new Date().toISOString();
      if (req.body && req.body.photos && Array.isArray(req.body.photos)) {
        db.mandapams[idx].photos = processAndSavePhotos(req.body.photos, id);
      }
      if (req.body && req.body.handlerDp) {
        db.mandapams[idx].handlerDp = processAndSaveSingleImage(req.body.handlerDp, 'dp', id);
      }
    }

    writeDB(db);
    console.log(`[SERVER] Approved & Published mandapam "${db.mandapams[idx].name}" (ID: ${id})`);
    res.json({ success: true, message: 'Mandapam approved successfully!', mandapam: db.mandapams[idx] });
  } catch (err) {
    console.error('Error approving mandapam:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update / Edit pandal
app.put('/api/admin/mandapams/:id', (req, res) => {
  try {
    const db = readDB();
    const id = req.params.id;
    let idx = db.mandapams.findIndex(m => String(m.id) === String(id));

    const photos = req.body.photos ? processAndSavePhotos(req.body.photos, id) : undefined;
    const updateData = { ...req.body, updatedAt: new Date().toISOString() };
    if (photos) updateData.photos = photos;
    if (req.body.handlerDp !== undefined) {
      updateData.handlerDp = processAndSaveSingleImage(req.body.handlerDp, 'dp', id);
    }

    if (idx === -1) {
      updateData.id = id;
      db.mandapams.unshift(updateData);
      idx = 0;
    } else {
      db.mandapams[idx] = { ...db.mandapams[idx], ...updateData };
    }

    if (db.mandapams[idx].area && typeof db.mandapams[idx].area === 'string' && db.mandapams[idx].area.trim()) {
      const trimmedArea = db.mandapams[idx].area.trim();
      if (!Array.isArray(db.areas)) {
        db.areas = [...INITIAL_AREAS];
      }
      if (!db.areas.includes(trimmedArea)) {
        db.areas.push(trimmedArea);
      }
    }

    writeDB(db);
    res.json({ success: true, message: 'Mandapam updated successfully!', mandapam: db.mandapams[idx] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Endpoint to upload or set exact Instagram DP for a pandal handler
app.post('/api/mandapams/:id/handler-dp', (req, res) => {
  try {
    const db = readDB();
    const id = req.params.id;
    const idx = db.mandapams.findIndex(m => String(m.id) === String(id));
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Mandapam not found' });
    }
    const dpData = req.body.dp || req.body.handlerDp || req.body.image;
    if (!dpData) {
      return res.status(400).json({ success: false, message: 'No DP image provided' });
    }
    const savedDp = processAndSaveSingleImage(dpData, 'dp', id);
    db.mandapams[idx].handlerDp = savedDp;
    if (req.body.instagramHandle) {
      db.mandapams[idx].instagramHandle = req.body.instagramHandle;
      db.mandapams[idx].instagramUrl = `https://instagram.com/${req.body.instagramHandle.replace('@', '')}`;
    }
    writeDB(db);
    res.json({ success: true, handlerDp: savedDp, mandapam: db.mandapams[idx] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete / Remove pandal
app.delete('/api/admin/mandapams/:id', (req, res) => {
  const db = readDB();
  const id = req.params.id;
  const initialLen = db.mandapams.length;
  db.mandapams = db.mandapams.filter(m => String(m.id) !== String(id));
  if (db.mandapams.length === initialLen) {
    return res.status(404).json({ success: false, message: 'Mandapam not found' });
  }
  writeDB(db);
  res.json({ success: true, message: 'Mandapam deleted successfully!' });
});

// Add / Remove areas for admin
app.post('/api/admin/areas', (req, res) => {
  const db = readDB();
  const { area } = req.body;
  if (!area || !area.trim()) {
    return res.status(400).json({ success: false, message: 'Area name required' });
  }
  if (!db.areas.includes(area.trim())) {
    db.areas.push(area.trim());
    writeDB(db);
  }
  res.json({ success: true, areas: db.areas });
});

app.delete('/api/admin/areas/:name', (req, res) => {
  const db = readDB();
  const areaName = decodeURIComponent(req.params.name);
  db.areas = db.areas.filter(a => a !== areaName);
  writeDB(db);
  res.json({ success: true, areas: db.areas });
});

// Save all / Sync
app.post('/api/save-all', (req, res) => {
  try {
    const { config, mandapams, areas } = req.body;
    const current = readDB();

    let finalMandapams = current.mandapams || [];
    if (Array.isArray(mandapams) && mandapams.length > 0) {
      const map = new Map();
      (current.mandapams || []).forEach(m => map.set(String(m.id), m));
      mandapams.forEach(m => {
        if (m && m.id) {
          const processed = (m.photos && Array.isArray(m.photos))
            ? { ...m, photos: processAndSavePhotos(m.photos, m.id) }
            : m;
          const existing = map.get(String(m.id));
          map.set(String(m.id), existing ? { ...existing, ...processed } : processed);
        }
      });
      finalMandapams = Array.from(map.values());
    }

    const updated = {
      config: config || current.config,
      mandapams: finalMandapams,
      areas: Array.isArray(areas) ? areas : current.areas,
      updatedAt: new Date().toISOString()
    };
    writeDB(updated);
    res.json({ success: true, message: 'Database updated successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --------------------------------------------------------------------------
// SEO: Dynamic Sitemap.xml & Robots.txt
// --------------------------------------------------------------------------
app.get('/sitemap.xml', (req, res) => {
  const db = readDB();
  const approved = (db.mandapams || []).filter(m => m.isVerified === true || m.status === 'approved');
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const lastmod = new Date().toISOString().split('T')[0];

  const staticUrls = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${baseUrl}/map.html`, priority: '0.9', changefreq: 'daily' },
    { loc: `${baseUrl}/unique.html`, priority: '0.9', changefreq: 'daily' },
    { loc: `${baseUrl}/gallery.html`, priority: '0.8', changefreq: 'daily' },
    { loc: `${baseUrl}/about.html`, priority: '0.7', changefreq: 'weekly' },
    { loc: `${baseUrl}/submit.html`, priority: '0.8', changefreq: 'weekly' }
  ];

  const pandalUrls = approved.map(m => ({
    loc: `${baseUrl}/pandal.html?id=${encodeURIComponent(m.id)}`,
    priority: '0.8',
    changefreq: 'daily'
  }));

  const allUrls = [...staticUrls, ...pandalUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

app.get('/robots.txt', (req, res) => {
  const txt = `User-agent: *
Allow: /
Disallow: /admin.html
Disallow: /admin
Disallow: /api/admin/

Sitemap: https://karimnagardurga.in/sitemap.xml
`;
  res.header('Content-Type', 'text/plain');
  res.send(txt);
});

// Health check endpoint for Render Web Service
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'karimnagar-durga-idol-finder', timestamp: new Date().toISOString() });
});

// --------------------------------------------------------------------------
// Page Routes
// --------------------------------------------------------------------------
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/map', (req, res) => res.sendFile(path.join(__dirname, 'map.html')));
app.get('/unique', (req, res) => res.sendFile(path.join(__dirname, 'unique.html')));
app.get('/gallery', (req, res) => res.sendFile(path.join(__dirname, 'gallery.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, 'about.html')));
app.get('/submit', (req, res) => res.sendFile(path.join(__dirname, 'submit.html')));
app.get('/pandal', (req, res) => res.sendFile(path.join(__dirname, 'pandal.html')));
app.get('/pandal.html', (req, res) => res.sendFile(path.join(__dirname, 'pandal.html')));
app.get('/pandal/:id', (req, res) => res.sendFile(path.join(__dirname, 'pandal.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));

// --------------------------------------------------------------------------
// 24/7 Keep-Alive Service (Prevents 1-2 hour sleep/cold-start freezes on Render)
// --------------------------------------------------------------------------
const PING_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes (Keeps Render free-tier hot 24/7)
setInterval(() => {
  try {
    const urls = [
      `http://localhost:${PORT}/health`,
      'https://karimnagar-durga-idol-finder.onrender.com/health'
    ];
    if (process.env.RENDER_EXTERNAL_URL) {
      urls.push(`${process.env.RENDER_EXTERNAL_URL}/health`);
    }
    urls.forEach(url => {
      fetch(url).catch(() => {});
    });
  } catch (e) {}
}, PING_INTERVAL_MS);

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🌺  Karimnagar Durga Idol Finder Server is running!`);
  console.log(`🌐 Website URL:  http://localhost:${PORT}`);
  console.log(`⚙️  Admin Panel:  http://localhost:${PORT}/admin.html`);
  console.log(`====================================================`);
});
