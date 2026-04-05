/**
 * Formate une taille de fichier en octets vers une chaîne lisible
 * @param {number} bytes - Taille en octets
 * @returns {string} Taille formatée (ex: "1.5 MB")
 */
function formatFileSize(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

module.exports = { formatFileSize };
