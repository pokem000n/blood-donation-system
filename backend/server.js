require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Serve frontend static files ───────────────────────────────
// Works for both local dev and Railway (project root has frontend/)
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// ── API Routes ────────────────────────────────────────────────
app.use('/api/dashboard',    require('./routes/dashboard'));
app.use('/api/donors',       require('./routes/donors'));
app.use('/api/recipients',   require('./routes/recipients'));
app.use('/api/donations',    require('./routes/donations'));
app.use('/api/inventory',    require('./routes/inventory'));
app.use('/api/requests',     require('./routes/requests'));
app.use('/api/emergency',    require('./routes/emergency'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/blood-groups', require('./routes/bloodGroups'));
app.use('/api/hospitals',    require('./routes/hospitals'));
app.use('/api/centers',      require('./routes/centers'));

// ── Fallback: serve index.html for any non-API route ─────────
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ── Start Server ──────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🩸  Blood Donation System running on port ${PORT}`);
});
