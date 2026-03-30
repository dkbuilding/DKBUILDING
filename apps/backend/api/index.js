// Raw Node.js handler — no Express
module.exports = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({
    ok: true,
    path: req.url,
    method: req.method,
    nodeVersion: process.version,
    expressVersion: require("express/package.json").version,
    hasDB: !!process.env.TURSO_DATABASE_URL,
  }));
};
