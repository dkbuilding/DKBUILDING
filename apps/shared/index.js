/**
 * @dkbuilding/shared — Barrel export
 * Package partagé frontend/backend pour DK BUILDING.
 */

const schemas = require("./validators/schemas");
const constants = require("./constants");

module.exports = { ...schemas, ...constants };
