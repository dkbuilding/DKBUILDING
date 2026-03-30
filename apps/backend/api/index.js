/**
 * Vercel Serverless Function Entry Point
 * Wrapper pour Express 5 qui n'est pas nativement compatible avec @vercel/node
 */
const app = require("../server");

// Express 5 app est un callable (req, res) — compatible Vercel
module.exports = (req, res) => {
  return app(req, res);
};
