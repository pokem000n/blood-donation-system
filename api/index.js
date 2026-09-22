const express = require('express');
const cors    = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// API Routes 
app.use('/api/dashboard',    require('../backend/routes/dashboard'));
app.use('/api/donors',       require('../backend/routes/donors'));
app.use('/api/recipients',   require('../backend/routes/recipients'));
app.use('/api/donations',    require('../backend/routes/donations'));
app.use('/api/inventory',    require('../backend/routes/inventory'));
app.use('/api/requests',     require('../backend/routes/requests'));
app.use('/api/emergency',    require('../backend/routes/emergency'));
app.use('/api/appointments', require('../backend/routes/appointments'));
app.use('/api/blood-groups', require('../backend/routes/bloodGroups'));
app.use('/api/hospitals',    require('../backend/routes/hospitals'));
app.use('/api/centers',      require('../backend/routes/centers'));

// Export for Vercel (do NOT call app.listen here)
module.exports = app;
