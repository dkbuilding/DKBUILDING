const db = require("../database/db");
const Logger = require("../utils/logger");
const { generateSlug } = require("../utils/slugify");
const { projetSchema } = require("../validators/schemas");

/**
 * Projets Controller - Version Serverless (Turso + Cloudinary)
 * Architecture GovTech Zero-Cost pour DK BUILDING
 */

// Helper pour parser les colonnes JSON
const parseJSON = (data) => {
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

class ProjetsController {
  static async getAll(req, res) {
    try {
      const limit = Math.min(Math.max(parseInt(req.query.limit) || 50, 1), 100);
      const offset = Math.max(parseInt(req.query.offset) || 0, 0);
      const { statut, type_projet, featured, orderBy, order } = req.query;

      let query = "SELECT * FROM projets WHERE 1=1";
      const args = [];

      if (statut) {
        query += " AND statut = ?";
        args.push(statut);
      }

      if (type_projet) {
        query += " AND type_projet = ?";
        args.push(type_projet);
      }

      if (featured !== undefined) {
        query += " AND featured = ?";
        args.push(featured === "true" ? 1 : 0);
      }

      const allowedOrderBy = [
        "date_debut",
        "date_fin",
        "created_at",
        "vue_count",
        "titre",
      ];
      const safeOrderBy = allowedOrderBy.includes(orderBy)
        ? orderBy
        : "created_at";
      const safeOrder =
        (order || "DESC").toUpperCase() === "ASC" ? "ASC" : "DESC";

      query += ` ORDER BY ${safeOrderBy} ${safeOrder} LIMIT ? OFFSET ?`;
      args.push(limit, offset);

      const result = await db.execute({ sql: query, args });

      const projetsParsed = result.rows.map((projet) => ({
        ...projet,
        images: parseJSON(projet.images),
        documents: parseJSON(projet.documents),
        videos: parseJSON(projet.videos),
        featured: Boolean(projet.featured),
      }));

      res.json({
        success: true,
        data: projetsParsed,
        count: projetsParsed.length,
      });
    } catch (error) {
      console.error("Erreur getAll:", error);
      Logger.createLog("error", "projet", null, req.user?.id, {
        error: error.message,
      }).catch(console.error);
      res.status(500).json({ success: false, error: "Erreur système" });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const result = await db.execute({
        sql: "SELECT * FROM projets WHERE id = ?",
        args: [id],
      });

      const projet = result.rows[0];

      if (!projet) {
        return res
          .status(404)
          .json({ success: false, error: "Projet non trouvé" });
      }

      projet.images = parseJSON(projet.images);
      projet.documents = parseJSON(projet.documents);
      projet.videos = parseJSON(projet.videos);
      projet.featured = Boolean(projet.featured);

      res.json({ success: true, data: projet });
    } catch (error) {
      console.error("Erreur getById:", error);
      res.status(500).json({ success: false, error: "Erreur système" });
    }
  }

  static async getBySlug(req, res) {
    try {
      const { slug } = req.params;
      const result = await db.execute({
        sql: "SELECT * FROM projets WHERE slug = ?",
        args: [slug],
      });

      const projet = result.rows[0];

      if (!projet) {
        return res
          .status(404)
          .json({ success: false, error: "Projet non trouvé" });
      }

      projet.images = parseJSON(projet.images);
      projet.documents = parseJSON(projet.documents);
      projet.videos = parseJSON(projet.videos);
      projet.featured = Boolean(projet.featured);

      // Update vue count (fire & forget)
      db.execute({
        sql: "UPDATE projets SET vue_count = vue_count + 1 WHERE id = ?",
        args: [projet.id],
      }).catch((err) => console.error("Erreur update vue_count", err));

      res.json({ success: true, data: projet });
    } catch (error) {
      console.error("Erreur getBySlug:", error);
      res.status(500).json({ success: false, error: "Erreur système" });
    }
  }

  static async getFeatured(req, res) {
    try {
      const limit = Math.min(Math.max(parseInt(req.query.limit) || 6, 1), 20);
      const result = await db.execute({
        sql: `SELECT * FROM projets WHERE featured = 1 AND statut = 'termine' ORDER BY created_at DESC LIMIT ?`,
        args: [limit],
      });

      const projetsParsed = result.rows.map((projet) => ({
        ...projet,
        images: parseJSON(projet.images),
        documents: parseJSON(projet.documents),
        videos: parseJSON(projet.videos),
        featured: Boolean(projet.featured),
      }));

      res.json({
        success: true,
        data: projetsParsed,
        count: projetsParsed.length,
      });
    } catch (error) {
      console.error("Erreur getFeatured:", error);
      res.status(500).json({ success: false, error: "Erreur système" });
    }
  }

  static async getPublic(req, res) {
    try {
      const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 50);
      const offset = Math.max(parseInt(req.query.offset) || 0, 0);

      const result = await db.execute({
        sql: `SELECT * FROM projets WHERE statut = 'termine' ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        args: [limit, offset],
      });

      const projetsParsed = result.rows.map((projet) => ({
        ...projet,
        images: parseJSON(projet.images),
        documents: parseJSON(projet.documents),
        videos: parseJSON(projet.videos),
        featured: Boolean(projet.featured),
      }));

      res.json({
        success: true,
        data: projetsParsed,
        count: projetsParsed.length,
      });
    } catch (error) {
      console.error("Erreur getPublic:", error);
      res.status(500).json({ success: false, error: "Erreur système" });
    }
  }

  static async create(req, res) {
    try {
      const validation = projetSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: "Données invalides",
          details: validation.error.format(),
        });
      }

      const data = validation.data;
      const userId = req.user?.id || null;

      const slugRes = await db.execute("SELECT slug FROM projets");
      const existingSlugs = slugRes.rows.map((p) => p.slug);
      const slug = generateSlug(data.titre, existingSlugs);

      // Cloudinary URLs
      const images = req.files?.images || req.body.images || [];
      const documents = req.files?.documents || req.body.documents || [];
      const videos = req.files?.videos || req.body.videos || [];

      const imagePaths = Array.isArray(images)
        ? images.map((file) => file.path || file)
        : [];
      const documentPaths = Array.isArray(documents)
        ? documents.map((file) => file.path || file)
        : [];
      const videoPaths = Array.isArray(videos)
        ? videos.map((file) => file.path || file)
        : [];

      const result = await db.execute({
        sql: `
          INSERT INTO projets (
            titre, description, contenu, type_projet, client, lieu,
            date_debut, date_fin, statut, images, documents, videos,
            meta_keywords, meta_description, slug, featured
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          RETURNING id
        `,
        args: [
          data.titre,
          data.description,
          data.contenu,
          data.type_projet,
          data.client,
          data.lieu,
          data.date_debut,
          data.date_fin,
          data.statut,
          JSON.stringify(imagePaths),
          JSON.stringify(documentPaths),
          JSON.stringify(videoPaths),
          data.meta_keywords,
          data.meta_description,
          slug,
          data.featured ? 1 : 0,
        ],
      });

      const newId = result.rows[0]?.id || result.lastInsertRowid;

      Logger.createLog("create", "projet", newId, userId, {
        titre: data.titre,
      }).catch(console.error);

      res.status(201).json({
        success: true,
        data: { id: newId, slug, titre: data.titre },
        message: "Projet créé avec succès",
      });
    } catch (error) {
      console.error("Erreur create:", error);
      Logger.createLog("error", "projet", null, req.user?.id, {
        error: error.message,
      }).catch(console.error);
      res.status(500).json({
        success: false,
        error: "Erreur lors de la création",
        message:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const validation = projetSchema.partial().safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: "Données invalides",
          details: validation.error.format(),
        });
      }

      const data = validation.data;
      const checkStmt = await db.execute({
        sql: "SELECT * FROM projets WHERE id = ?",
        args: [id],
      });
      const existing = checkStmt.rows[0];

      if (!existing) {
        return res
          .status(404)
          .json({ success: false, error: "Projet non trouvé" });
      }

      let slug = existing.slug;
      if (data.titre && data.titre !== existing.titre) {
        const slugRes = await db.execute({
          sql: "SELECT slug FROM projets WHERE id != ?",
          args: [id],
        });
        const existingSlugs = slugRes.rows.map((p) => p.slug);
        slug = generateSlug(data.titre, existingSlugs);
      }

      const images = req.files?.images || req.body.images || null;
      const documents = req.files?.documents || req.body.documents || null;
      const videos = req.files?.videos || req.body.videos || null;

      let imagePaths = existing.images ? parseJSON(existing.images) : [];
      let documentPaths = existing.documents
        ? parseJSON(existing.documents)
        : [];
      let videoPaths = existing.videos ? parseJSON(existing.videos) : [];

      if (images) {
        imagePaths = Array.isArray(images)
          ? images.map((file) => file.path || file)
          : imagePaths;
      }
      if (documents) {
        documentPaths = Array.isArray(documents)
          ? documents.map((file) => file.path || file)
          : documentPaths;
      }
      if (videos) {
        videoPaths = Array.isArray(videos)
          ? videos.map((file) => file.path || file)
          : videoPaths;
      }

      await db.execute({
        sql: `
          UPDATE projets SET
            titre = COALESCE(?, titre),
            description = COALESCE(?, description),
            contenu = COALESCE(?, contenu),
            type_projet = COALESCE(?, type_projet),
            client = COALESCE(?, client),
            lieu = COALESCE(?, lieu),
            date_debut = COALESCE(?, date_debut),
            date_fin = COALESCE(?, date_fin),
            statut = COALESCE(?, statut),
            images = COALESCE(?, images),
            documents = COALESCE(?, documents),
            videos = COALESCE(?, videos),
            meta_keywords = COALESCE(?, meta_keywords),
            meta_description = COALESCE(?, meta_description),
            slug = COALESCE(?, slug),
            featured = COALESCE(?, featured),
            updated_at = datetime('now')
          WHERE id = ?
        `,
        args: [
          data.titre || null,
          data.description,
          data.contenu,
          data.type_projet,
          data.client,
          data.lieu,
          data.date_debut,
          data.date_fin,
          data.statut,
          JSON.stringify(imagePaths),
          JSON.stringify(documentPaths),
          JSON.stringify(videoPaths),
          data.meta_keywords,
          data.meta_description,
          slug,
          data.featured !== undefined ? (data.featured ? 1 : 0) : null,
          id,
        ],
      });

      Logger.createLog("update", "projet", id, req.user?.id, {
        titre: data.titre || existing.titre,
      }).catch(console.error);

      res.json({ success: true, message: "Projet mis à jour" });
    } catch (error) {
      console.error("Erreur update:", error);
      Logger.createLog("error", "projet", req.params.id, req.user?.id, {
        error: error.message,
      }).catch(console.error);
      res
        .status(500)
        .json({ success: false, error: "Erreur lors de la mise à jour" });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const existing = await db.execute({
        sql: "SELECT * FROM projets WHERE id = ?",
        args: [id],
      });

      if (!existing.rows[0]) {
        return res
          .status(404)
          .json({ success: false, error: "Projet non trouvé" });
      }

      // Note: Avec Cloudinary, on pourrait appeler cloudinary.uploader.destroy()
      // pour nettoyer les fichiers, mais pour l'instant on supprime juste la ref DB

      await db.execute({ sql: "DELETE FROM projets WHERE id = ?", args: [id] });
      Logger.createLog("delete", "projet", id, req.user?.id, {
        titre: existing.rows[0].titre,
      }).catch(console.error);

      res.json({ success: true, message: "Projet supprimé" });
    } catch (error) {
      console.error("Erreur delete:", error);
      Logger.createLog("error", "projet", req.params.id, req.user?.id, {
        error: error.message,
      }).catch(console.error);
      res
        .status(500)
        .json({ success: false, error: "Erreur lors de la suppression" });
    }
  }
}

module.exports = ProjetsController;
