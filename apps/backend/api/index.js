/**
 * Vercel Serverless Function Entry Point
 * Express 5 adapter pour @vercel/node
 */
const app = require("../server");

module.exports = (req, res) => app(req, res);
