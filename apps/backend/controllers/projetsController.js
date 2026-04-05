const ProjetsRepository = require("../repositories/ProjetsRepository");
const Logger = require("../utils/logger");
const { generateSlug } = require("../utils/slugify");
const { projetSchema } = require("../validators/schemas");
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
 * Projets Controller — DK BUILDING
 * Turso + Cloudinary
 */

const projetsRepo = new ProjetsRepository();

const parseProjet = (projet) => ({
  ...projet,
  images: parseJSON(projet.images),
  documents: parseJSON(projet.documents),
  videos: parseJSON(projet.videos),
  featured: Boolean(projet.featured),
});

class ProjetsController {
  /**
   * GET /api/projets
   * Liste paginée avec filtres (protégé)
   */
  static async getAll(req, res) {
    try {
      const limit = Math.min(Math.max(parseInt(req.query.limit) || 50, 1), 100);
      const offset = Math.max(parseInt(req.query.offset) || 0, 0);
      const { statut, type_projet, featured, orderBy, order } = req.query;

      const rows = await projetsRepo.getFiltered({
        statut,
        type_projet,
        featured,
        orderBy,
        order,
        limit,
        offset,
      });

      const total = await projetsRepo.countFiltered
        ? await projetsRepo.countFiltered({ statut, type_projet, featured })
        : rows.length;

      const projetsParsed = rows.map(parseProjet);

      return sendSuccess(res, projetsParsed, {
        meta: paginationMeta({ total, limit, offset }),
      });
    } catch (error) {
      console.error("Erreur getAll:", error);
      Logger.createLog("error", "projet", null, req.user?.id, {
        error: error.message,
      }).catch(console.error);
      return sendInternalError(res, "Erreur lors de la récupération des projets");
    }
  }

  /**
   * GET /api/projets/:id
   */
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const projet = await projetsRepo.getById(id);

      if (!projet) {
        return sendNotFound(res, "Projet non trouvé");
      }

      return sendSuccess(res, parseProjet(projet));
    } catch (error) {
      console.error("Erreur getById:", error);
      return sendInternalError(res);
    }
  }

  /**
   * GET /api/projets/slug/:slug
   */
  static async getBySlug(req, res) {
    try {
      const { slug } = req.params;
      const projet = await projetsRepo.getBySlug(slug);

      if (!projet) {
        return sendNotFound(res, "Projet non trouvé");
      }

      projetsRepo.incrementViewCount(projet.id);
      return sendSuccess(res, parseProjet(projet));
    } catch (error) {
      console.error("Erreur getBySlug:", error);
      return sendInternalError(res);
    }
  }

  /**
   * GET /api/projets/featured
   */
  static async getFeatured(req, res) {
    try {
      const limit = Math.min(Math.max(parseInt(req.query.limit) || 6, 1), 20);
      const rows = await projetsRepo.getFeatured(limit);
      const projetsParsed = rows.map(parseProjet);

      return sendSuccess(res, projetsParsed, {
        meta: { count: projetsParsed.length },
      });
    } catch (error) {
      console.error("Erreur getFeatured:", error);
      return sendInternalError(res);
    }
  }

  /**
   * GET /api/projets/public
   */
  static async getPublic(req, res) {
    try {
      const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 50);
      const offset = Math.max(parseInt(req.query.offset) || 0, 0);

      const rows = await projetsRepo.getPublic({ limit, offset });
      const projetsParsed = rows.map(parseProjet);

      return sendSuccess(res, projetsParsed, {
        meta: { count: projetsParsed.length },
      });
    } catch (error) {
      console.error("Erreur getPublic:", error);
      return sendInternalError(res);
    }
  }

  /**
   * POST /api/projets
   * Création (201 Created)
   */
  static async create(req, res) {
    try {
      const validation = projetSchema.safeParse(req.body);

      if (!validation.success) {
        const details = validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
        return sendValidationError(res, details);
      }

      const data = validation.data;
      const userId = req.user?.id || null;

      const existingSlugs = await projetsRepo.getAllSlugs();
      const slug = generateSlug(data.titre, existingSlugs);

      const images = req.files?.images || req.body.images || [];
      const documents = req.files?.documents || req.body.documents || [];
      const videos = req.files?.videos || req.body.videos || [];

      const imagePaths = Array.isArray(images) ? images.map((file) => file.path || file) : [];
      const documentPaths = Array.isArray(documents) ? documents.map((file) => file.path || file) : [];
      const videoPaths = Array.isArray(videos) ? videos.map((file) => file.path || file) : [];

      const newId = await projetsRepo.createWithReturning({
        titre: data.titre,
        description: data.description,
        contenu: data.contenu,
        type_projet: data.type_projet,
        client: data.client,
        lieu: data.lieu,
        date_debut: data.date_debut,
        date_fin: data.date_fin,
        statut: data.statut,
        images: JSON.stringify(imagePaths),
        documents: JSON.stringify(documentPaths),
        videos: JSON.stringify(videoPaths),
        meta_keywords: data.meta_keywords,
        meta_description: data.meta_description,
        slug,
        featured: data.featured ? 1 : 0,
      });

      Logger.createLog("create", "projet", newId, userId, {
        titre: data.titre,
      }).catch(console.error);

      return sendCreated(res, { id: newId, slug, titre: data.titre }, "Projet créé avec succès");
    } catch (error) {
      console.error("Erreur create:", error);
      Logger.createLog("error", "projet", null, req.user?.id, {
        error: error.message,
      }).catch(console.error);
      return sendInternalError(res, "Erreur lors de la création du projet");
    }
  }

  /**
   * PATCH /api/projets/:id
   * Mise à jour partielle
   */
  static async update(req, res) {
    try {
      const { id } = req.params;
      const validation = projetSchema.partial().safeParse(req.body);

      if (!validation.success) {
        const details = validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
        return sendValidationError(res, details);
      }

      const data = validation.data;
      const existing = await projetsRepo.getById(id);

      if (!existing) {
        return sendNotFound(res, "Projet non trouvé");
      }

      let slug = existing.slug;
      if (data.titre && data.titre !== existing.titre) {
        const existingSlugs = await projetsRepo.getAllSlugs(id);
        slug = generateSlug(data.titre, existingSlugs);
      }

      const images = req.files?.images || req.body.images || null;
      const documents = req.files?.documents || req.body.documents || null;
      const videos = req.files?.videos || req.body.videos || null;

      let imagePaths = existing.images ? parseJSON(existing.images) : [];
      let documentPaths = existing.documents ? parseJSON(existing.documents) : [];
      let videoPaths = existing.videos ? parseJSON(existing.videos) : [];

      if (images) {
        imagePaths = Array.isArray(images) ? images.map((file) => file.path || file) : imagePaths;
      }
      if (documents) {
        documentPaths = Array.isArray(documents) ? documents.map((file) => file.path || file) : documentPaths;
      }
      if (videos) {
        videoPaths = Array.isArray(videos) ? videos.map((file) => file.path || file) : videoPaths;
      }

      await projetsRepo.updateWithCoalesce(id, {
        titre: data.titre || null,
        description: data.description,
        contenu: data.contenu,
        type_projet: data.type_projet,
        client: data.client,
        lieu: data.lieu,
        date_debut: data.date_debut,
        date_fin: data.date_fin,
        statut: data.statut,
        images: JSON.stringify(imagePaths),
        documents: JSON.stringify(documentPaths),
        videos: JSON.stringify(videoPaths),
        meta_keywords: data.meta_keywords,
        meta_description: data.meta_description,
        slug,
        featured: data.featured !== undefined ? (data.featured ? 1 : 0) : null,
      });

      Logger.createLog("update", "projet", id, req.user?.id, {
        titre: data.titre || existing.titre,
      }).catch(console.error);

      return sendSuccess(res, null, { message: "Projet mis à jour" });
    } catch (error) {
      console.error("Erreur update:", error);
      Logger.createLog("error", "projet", req.params.id, req.user?.id, {
        error: error.message,
      }).catch(console.error);
      return sendInternalError(res, "Erreur lors de la mise à jour");
    }
  }

  /**
   * DELETE /api/projets/:id
   * Suppression (204 No Content)
   */
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const existing = await projetsRepo.getById(id);

      if (!existing) {
        return sendNotFound(res, "Projet non trouvé");
      }

      await projetsRepo.delete(id);
      Logger.createLog("delete", "projet", id, req.user?.id, {
        titre: existing.titre,
      }).catch(console.error);

      return sendNoContent(res);
    } catch (error) {
      console.error("Erreur delete:", error);
      Logger.createLog("error", "projet", req.params.id, req.user?.id, {
        error: error.message,
      }).catch(console.error);
      return sendInternalError(res, "Erreur lors de la suppression");
    }
  }
}

module.exports = ProjetsController;
