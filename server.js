import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle client-side routing by serving index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Use port from environment or default to 8080
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Scout Analytics Dashboard running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`Supabase URL configured: ${process.env.VITE_SUPABASE_URL ? 'Yes' : 'No'}`);
});