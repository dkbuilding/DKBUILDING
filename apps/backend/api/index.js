// Minimal test to diagnose Vercel crash
const app = require("express")();
app.all("/(.*)", (req, res) => {
  res.json({
    ok: true,
    path: req.path,
    method: req.method,
    hasDB: !!process.env.TURSO_DATABASE_URL,
    nodeVersion: process.version,
  });
});
module.exports = app;
