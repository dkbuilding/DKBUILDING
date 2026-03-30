/**
 * Vercel Serverless Function Entry Point
 */
let app;
let loadError = null;

try {
  app = require("../server");
} catch (err) {
  loadError = err;
  console.error("FATAL: server.js failed to load:", err.message);
  console.error(err.stack);
}

module.exports = (req, res) => {
  if (loadError) {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 500;
    return res.end(JSON.stringify({
      error: "Server failed to load",
      message: loadError.message,
      stack: loadError.stack?.split("\n").slice(0, 5),
    }));
  }
  return app(req, res);
};
