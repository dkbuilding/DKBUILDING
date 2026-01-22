const db = require("../database/db");
const Logger = require("../utils/logger");
const { generateSlug } = require("../utils/slugify");
const { annonceSchema } = require("../validators/schemas");

/**
 * Annonces Controller - Version Serverless (Turso + Cloudinary)
 * Architecture GovTech Zero-Cost pour DK BUILDING
 */

// Helper pour parser les colonnes JSON (SQLite/Turso stocke ça en TEXT)
const parseJSON = (data) => {
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

class AnnoncesController {
  /**
   * Récupérer toutes les annonces avec filtres (Turso Async)
   */
  static async getAll(req, res) {
    try {
      const limit = Math.min(Math.max(parseInt(req.query.limit) || 50, 1), 100);
      const offset = Math.max(parseInt(req.query.offset) || 0, 0);
      const { statut, categorie, auteur_id, orderBy, order } = req.query;

      let query = "SELECT * FROM annonces WHERE 1=1";
      const args = [];

      if (statut) {
        query += " AND statut = ?";
        args.push(statut);
      }

      if (categorie) {
        query += " AND categorie = ?";
        args.push(categorie);
      }

      if (auteur_id) {
        query += " AND auteur_id = ?";
        args.push(auteur_id);
      }

      const allowedOrderBy = [
        "date_publication",
        "created_at",
        "vue_count",
        "titre",
      ];
      const safeOrderBy = allowedOrderBy.includes(orderBy)
        ? orderBy
        : "date_publication";
      const safeOrder =
        (order || "DESC").toUpperCase() === "ASC" ? "ASC" : "DESC";

      query += ` ORDER BY ${safeOrderBy} ${safeOrder} LIMIT ? OFFSET ?`;
      args.push(limit, offset);

      // Exécution Turso
      const result = await db.execute({ sql: query, args });

      const annoncesParsed = result.rows.map((annonce) => ({
        ...annonce,
        images: parseJSON(annonce.images),
        documents: parseJSON(annonce.documents),
      }));

      res.json({
        success: true,
        data: annoncesParsed,
        count: annoncesParsed.length,
      });
    } catch (error) {
      console.error("Erreur getAll:", error);
      Logger.createLog("error", "annonce", null, req.user?.id, {
        error: error.message,
      }).catch(console.error);

      res.status(500).json({
        success: false,
        error: "Erreur système lors de la récupération",
      });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const result = await db.execute({
        sql: "SELECT * FROM annonces WHERE id = ?",
        args: [id],
      });

      const annonce = result.rows[0];

      if (!annonce) {
        return res
          .status(404)
          .json({ success: false, error: "Annonce introuvable" });
      }

      annonce.images = parseJSON(annonce.images);
      annonce.documents = parseJSON(annonce.documents);

      res.json({ success: true, data: annonce });
    } catch (error) {
      console.error("Erreur getById:", error);
      res.status(500).json({ success: false, error: "Erreur système" });
    }
  }

  static async getBySlug(req, res) {
    try {
      const { slug } = req.params;
      const result = await db.execute({
        sql: "SELECT * FROM annonces WHERE slug = ?",
        args: [slug],
      });

      const annonce = result.rows[0];

      if (!annonce) {
        return res
          .status(404)
          .json({ success: false, error: "Annonce introuvable" });
      }

      annonce.images = parseJSON(annonce.images);
      annonce.documents = parseJSON(annonce.documents);

      // Update asynchrone du compteur de vue (Fire & Forget pour la perf)
      db.execute({
        sql: "UPDATE annonces SET vue_count = vue_count + 1 WHERE id = ?",
        args: [annonce.id],
      }).catch((err) => console.error("Erreur update vue_count", err));

      res.json({ success: true, data: annonce });
    } catch (error) {
      console.error("Erreur getBySlug:", error);
      res.status(500).json({ success: false, error: "Erreur système" });
    }
  }

  static async getPublic(req, res) {
    try {
      const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);
      const offset = Math.max(parseInt(req.query.offset) || 0, 0);

      const result = await db.execute({
        sql: `SELECT * FROM annonces WHERE statut = 'publie' ORDER BY date_publication DESC LIMIT ? OFFSET ?`,
        args: [limit, offset],
      });

      const annoncesParsed = result.rows.map((annonce) => ({
        ...annonce,
        images: parseJSON(annonce.images),
        documents: parseJSON(annonce.documents),
      }));

      res.json({
        success: true,
        data: annoncesParsed,
        count: annoncesParsed.length,
      });
    } catch (error) {
      console.error("Erreur getPublic:", error);
      res.status(500).json({ success: false, error: "Erreur système" });
    }
  }

  /**
   * Création avec Cloudinary + Turso
   */
  static async create(req, res) {
    try {
      // 1. Validation Zero Trust (Zod)
      const validation = annonceSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: "Données invalides",
          details: validation.error.format(),
        });
      }

      const data = validation.data;
      const userId = req.user?.id || null;

      // 2. Génération Slug (vérif doublon)
      const slugRes = await db.execute("SELECT slug FROM annonces");
      const existingSlugs = slugRes.rows.map((a) => a.slug);
      const slug = generateSlug(data.titre, existingSlugs);

      // 3. Gestion Cloudinary (URLs directes)
      // Multer-storage-cloudinary met l'URL dans file.path
      const images = req.files?.images || req.body.images || [];
      const documents = req.files?.documents || req.body.documents || [];

      const imageUrls = Array.isArray(images)
        ? images.map((file) => file.path || file) // file.path est l'URL Cloudinary
        : [];

      const docUrls = Array.isArray(documents)
        ? documents.map((file) => file.path || file)
        : [];

      // 4. Insertion Turso
      const result = await db.execute({
        sql: `
          INSERT INTO annonces (
            titre, description, contenu, categorie, statut,
            images, documents, meta_keywords, meta_description,
            slug, auteur_id, date_publication, date_modification
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
          RETURNING id
        `,
        args: [
          data.titre,
          data.description,
          data.contenu,
          data.categorie,
          data.statut,
          JSON.stringify(imageUrls), // On stocke les URLs Cloudinary
          JSON.stringify(docUrls),
          data.meta_keywords,
          data.meta_description,
          slug,
          userId,
        ],
      });

      // Turso renvoie l'ID inséré via RETURNING
      const newId = result.rows[0]?.id || result.lastInsertRowid;

      Logger.createLog("create", "annonce", newId, userId, {
        titre: data.titre,
      }).catch(console.error);

      res.status(201).json({
        success: true,
        data: { id: newId, slug, titre: data.titre },
        message: "Annonce créée avec succès",
      });
    } catch (error) {
      console.error("Erreur create:", error);
      res.status(500).json({
        success: false,
        error: "Erreur lors de la création",
        message:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  /**
   * Mise à jour
   */
  static async update(req, res) {
    try {
      const { id } = req.params;
      const validation = annonceSchema.partial().safeParse(req.body);

      if (!validation.success) {
        return res
          .status(400)
          .json({
            success: false,
            error: "Données invalides",
            details: validation.error.format(),
          });
      }

      const data = validation.data;

      // Vérif existence
      const check = await db.execute({
        sql: "SELECT * FROM annonces WHERE id = ?",
        args: [id],
      });
      const existing = check.rows[0];

      if (!existing) {
        return res
          .status(404)
          .json({ success: false, error: "Annonce non trouvée" });
      }

      // Slug
      let slug = existing.slug;
      if (data.titre && data.titre !== existing.titre) {
        const slugRes = await db.execute({
          sql: "SELECT slug FROM annonces WHERE id != ?",
          args: [id],
        });
        const existingSlugs = slugRes.rows.map((a) => a.slug);
        slug = generateSlug(data.titre, existingSlugs);
      }

      // Fichiers (Mix entre existants et nouveaux uploads Cloudinary)
      const images = req.files?.images || req.body.images || null;
      const documents = req.files?.documents || req.body.documents || null;

      let imagePaths = existing.images ? parseJSON(existing.images) : [];
      let documentPaths = existing.documents
        ? parseJSON(existing.documents)
        : [];

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

      await db.execute({
        sql: `
          UPDATE annonces SET
            titre = COALESCE(?, titre),
            description = COALESCE(?, description),
            contenu = COALESCE(?, contenu),
            categorie = COALESCE(?, categorie),
            statut = COALESCE(?, statut),
            images = COALESCE(?, images),
            documents = COALESCE(?, documents),
            meta_keywords = COALESCE(?, meta_keywords),
            meta_description = COALESCE(?, meta_description),
            slug = COALESCE(?, slug),
            date_modification = datetime('now')
          WHERE id = ?
        `,
        args: [
          data.titre || null,
          data.description,
          data.contenu,
          data.categorie,
          data.statut,
          JSON.stringify(imagePaths),
          JSON.stringify(documentPaths),
          data.meta_keywords,
          data.meta_description,
          slug,
          id,
        ],
      });

      Logger.createLog("update", "annonce", id, req.user?.id, {
        titre: data.titre || existing.titre,
      }).catch(console.error);

      res.json({ success: true, message: "Annonce mise à jour" });
    } catch (error) {
      console.error("Erreur update:", error);
      res.status(500).json({ success: false, error: "Erreur de mise à jour" });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const check = await db.execute({
        sql: "SELECT * FROM annonces WHERE id = ?",
        args: [id],
      });
      const existing = check.rows[0];

      if (!existing) {
        return res
          .status(404)
          .json({ success: false, error: "Annonce non trouvée" });
      }

      // NOTE: Avec Cloudinary, on pourrait appeler cloudinary.uploader.destroy(public_id)
      // pour nettoyer les fichiers orphelins, mais pour l'instant on supprime juste la ref DB

      await db.execute({
        sql: "DELETE FROM annonces WHERE id = ?",
        args: [id],
      });

      Logger.createLog("delete", "annonce", id, req.user?.id, {
        titre: existing.titre,
      }).catch(console.error);

      res.json({ success: true, message: "Annonce supprimée" });
    } catch (error) {
      console.error("Erreur delete:", error);
      res
        .status(500)
        .json({ success: false, error: "Erreur lors de la suppression" });
    }
  }
}

module.exports = AnnoncesController;
