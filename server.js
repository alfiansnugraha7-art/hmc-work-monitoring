import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API Health Check & PostgreSQL Status Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'HMC GROUP Command & Work Monitoring Center',
    timestamp: new Date().toISOString(),
    postgresConfigured: true,
    dbHost: process.env.PGHOST || 'localhost',
    dbName: process.env.PGDATABASE || 'hmc_work_monitoring'
  });
});

// Serve static files from dist
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Fallback route for SPA
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>HOLDING WORK MONITORING - System Starting</title>
        <meta http-equiv="refresh" content="2">
        <style>
          body { font-family: sans-serif; background: #0f172a; color: white; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
          .card { text-align: center; background: #1e293b; padding: 2rem; border-radius: 1rem; border: 1px solid #334155; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>⚡ System Building & Loading...</h2>
          <p>Halaman sedang disiapkan. Otomatis refresh dalam 2 detik...</p>
        </div>
      </body>
      </html>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  HOLDING WORK MONITORING - Corporate Command Center`);
  console.log(`  Server running on http://localhost:${PORT}`);
  console.log(`====================================================`);
});
