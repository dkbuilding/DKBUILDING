const AnnoncesRepository = require("../repositories/AnnoncesRepository");
const Logger = require("../utils/logger");
const { generateSlug } = require("../utils/slugify");
const { annonceSchema } = require("../validators/schemas");
const parseJSON = require("../utils/parseJSON");
const {
  sendSuccess,
  sendCreated,
  sendNoContent,
  sendNotFound,
  sendValidationError,
  sendInternalError,
  paginationMeta,
} = require("../utils/apiResponse");

/**
 * Annonces Controller — DK BUILDING
 * Turso + Cloudinary
 */

const annoncesRepo = new AnnoncesRepository();

const parseAnnonce = (annonce) => ({
  ...annonce,
  images: parseJSON(annonce.images),
  documents: parseJSON(annonce.documents),
});

class AnnoncesController {
  /**
   * GET /api/annonces
   * Liste paginée avec filtres (protégé)
   */
  static async getAll(req, res) {
    try {
      const limit = Math.min(Math.max(parseInt(req.query.limit) || 50, 1), 100);
      const offset = Math.max(parseInt(req.query.offset) || 0, 0);
      const { statut, categorie, auteur_id, orderBy, order } = req.query;

      const rows = await annoncesRepo.getFiltered({
        statut,
        categorie,
        auteur_id,
        orderBy,
        order,
        limit,
        offset,
      });

      // Compter le total pour la pagination
      const total = await annoncesRepo.countFiltered
        ? await annoncesRepo.countFiltered({ statut, categorie, auteur_id })
        : rows.length;

      const annoncesParsed = rows.map(parseAnnonce);

      return sendSuccess(res, annoncesParsed, {
        meta: paginationMeta({ total, limit, offset }),
      });
    } catch (error) {
      console.error("Erreur getAll:", error);
      Logger.createLog("error", "annonce", null, req.user?.id, {
        error: error.message,
      }).catch(console.error);
      return sendInternalError(res, "Erreur lors de la récupération des annonces");
    }
  }

  /**
   * GET /api/annonces/:id
   */
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const annonce = await annoncesRepo.getById(id);

      if (!annonce) {
        return sendNotFound(res, "Annonce introuvable");
      }

      return sendSuccess(res, parseAnnonce(annonce));
    } catch (error) {
      console.error("Erreur getById:", error);
      return sendInternalError(res);
    }
  }

  /**
   * GET /api/annonces/slug/:slug
   */
  static async getBySlug(req, res) {
    try {
      const { slug } = req.params;
      const annonce = await annoncesRepo.getBySlug(slug);

      if (!annonce) {
        return sendNotFound(res, "Annonce introuvable");
      }

      // Fire & Forget : incrémenter le compteur de vues
      annoncesRepo.incrementViewCount(annonce.id);

      return sendSuccess(res, parseAnnonce(annonce));
    } catch (error) {
      console.error("Erreur getBySlug:", error);
      return sendInternalError(res);
    }
  }

  /**
   * GET /api/annonces/public
   */
  static async getPublic(req, res) {
    try {
      const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);
      const offset = Math.max(parseInt(req.query.offset) || 0, 0);

      const rows = await annoncesRepo.getPublic({ limit, offset });
      const annoncesParsed = rows.map(parseAnnonce);

      return sendSuccess(res, annoncesParsed, {
        meta: { count: annoncesParsed.length },
      });
    } catch (error) {
      console.error("Erreur getPublic:", error);
      return sendInternalError(res);
    }
  }

  /**
   * POST /api/annonces
   * Création (201 Created)
   */
  static async create(req, res) {
    try {
      const validation = annonceSchema.safeParse(req.body);

      if (!validation.success) {
        const details = validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
        return sendValidationError(res, details);
      }

      const data = validation.data;
      const userId = req.user?.id || null;

      const existingSlugs = await annoncesRepo.getAllSlugs();
      const slug = generateSlug(data.titre, existingSlugs);

      const images = req.files?.images || req.body.images || [];
      const documents = req.files?.documents || req.body.documents || [];

      const imageUrls = Array.isArray(images)
        ? images.map((file) => file.path || file)
        : [];
      const docUrls = Array.isArray(documents)
        ? documents.map((file) => file.path || file)
        : [];

      const now = new Date().toISOString();
      const newId = await annoncesRepo.createWithReturning({
        titre: data.titre,
        description: data.description,
        contenu: data.contenu,
        categorie: data.categorie,
        statut: data.statut,
        images: JSON.stringify(imageUrls),
        documents: JSON.stringify(docUrls),
        meta_keywords: data.meta_keywords,
        meta_description: data.meta_description,
        slug,
        auteur_id: userId,
        date_publication: now,
        date_modification: now,
      });

      Logger.createLog("create", "annonce", newId, userId, {
        titre: data.titre,
      }).catch(console.error);

      return sendCreated(res, { id: newId, slug, titre: data.titre }, "Annonce créée avec succès");
    } catch (error) {
      console.error("Erreur create:", error);
      return sendInternalError(res, "Erreur lors de la création de l'annonce");
    }
  }

  /**
   * PATCH /api/annonces/:id
   * Mise à jour partielle
   */
  static async update(req, res) {
    try {
      const { id } = req.params;
      const validation = annonceSchema.partial().safeParse(req.body);

      if (!validation.success) {
        const details = validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
        return sendValidationError(res, details);
      }

      const data = validation.data;
      const existing = await annoncesRepo.getById(id);

      if (!existing) {
        return sendNotFound(res, "Annonce non trouvée");
      }

      let slug = existing.slug;
      if (data.titre && data.titre !== existing.titre) {
        const existingSlugs = await annoncesRepo.getAllSlugs(id);
        slug = generateSlug(data.titre, existingSlugs);
      }

      const images = req.files?.images || req.body.images || null;
      const documents = req.files?.documents || req.body.documents || null;

      let imagePaths = existing.images ? parseJSON(existing.images) : [];
      let documentPaths = existing.documents ? parseJSON(existing.documents) : [];

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

      await annoncesRepo.updateWithCoalesce(id, {
        titre: data.titre || null,
        description: data.description,
        contenu: data.contenu,
        categorie: data.categorie,
        statut: data.statut,
        images: JSON.stringify(imagePaths),
        documents: JSON.stringify(documentPaths),
        meta_keywords: data.meta_keywords,
        meta_description: data.meta_description,
        slug,
      });

      Logger.createLog("update", "annonce", id, req.user?.id, {
        titre: data.titre || existing.titre,
      }).catch(console.error);

      return sendSuccess(res, null, { message: "Annonce mise à jour" });
    } catch (error) {
      console.error("Erreur update:", error);
      return sendInternalError(res, "Erreur lors de la mise à jour");
    }
  }

  /**
   * DELETE /api/annonces/:id
   * Suppression (204 No Content)
   */
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const existing = await annoncesRepo.getById(id);

      if (!existing) {
        return sendNotFound(res, "Annonce non trouvée");
      }

      await annoncesRepo.delete(id);

      Logger.createLog("delete", "annonce", id, req.user?.id, {
        titre: existing.titre,
      }).catch(console.error);

      return sendNoContent(res);
    } catch (error) {
      console.error("Erreur delete:", error);
      return sendInternalError(res, "Erreur lors de la suppression");
    }
  }
}

module.exports = AnnoncesController;
