const ProjetsRepository = require("../repositories/ProjetsRepository");
const Logger = require("../utils/logger");
const { generateSlug } = require("../utils/slugify");
const { projetSchema } = require("../validators/schemas");
const parseJSON = require("../utils/parseJSON");

/**
 * Projets Controller - Version Serverless (Turso + Cloudinary)
 * Architecture GovTech Zero-Cost pour DK BUILDING
 *
 * Utilise ProjetsRepository pour l'accès aux données.
 * Le controller gère uniquement la logique HTTP, la validation et le parsing JSON.
 */

const projetsRepo = new ProjetsRepository();

/**
 * Parse les champs JSON d'un projet pour la réponse HTTP
 */
const parseProjet = (projet) => ({
  ...projet,
  images: parseJSON(projet.images),
  documents: parseJSON(projet.documents),
  videos: parseJSON(projet.videos),
  featured: Boolean(projet.featured),
});

class ProjetsController {
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

      const projetsParsed = rows.map(parseProjet);

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
      const projet = await projetsRepo.getById(id);

      if (!projet) {
        return res
          .status(404)
          .json({ success: false, error: "Projet non trouvé" });
      }

      res.json({ success: true, data: parseProjet(projet) });
    } catch (error) {
      console.error("Erreur getById:", error);
      res.status(500).json({ success: false, error: "Erreur système" });
    }
  }

  static async getBySlug(req, res) {
    try {
      const { slug } = req.params;
      const projet = await projetsRepo.getBySlug(slug);

      if (!projet) {
        return res
          .status(404)
          .json({ success: false, error: "Projet non trouvé" });
      }

      // Update vue count (fire & forget)
      projetsRepo.incrementViewCount(projet.id);

      res.json({ success: true, data: parseProjet(projet) });
    } catch (error) {
      console.error("Erreur getBySlug:", error);
      res.status(500).json({ success: false, error: "Erreur système" });
    }
  }

  static async getFeatured(req, res) {
    try {
      const limit = Math.min(Math.max(parseInt(req.query.limit) || 6, 1), 20);
      const rows = await projetsRepo.getFeatured(limit);
      const projetsParsed = rows.map(parseProjet);

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

      const rows = await projetsRepo.getPublic({ limit, offset });
      const projetsParsed = rows.map(parseProjet);

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

      const existingSlugs = await projetsRepo.getAllSlugs();
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
      const existing = await projetsRepo.getById(id);

      if (!existing) {
        return res
          .status(404)
          .json({ success: false, error: "Projet non trouvé" });
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
      const existing = await projetsRepo.getById(id);

      if (!existing) {
        return res
          .status(404)
          .json({ success: false, error: "Projet non trouvé" });
      }

      // Note: Avec Cloudinary, on pourrait appeler cloudinary.uploader.destroy()
      // pour nettoyer les fichiers, mais pour l'instant on supprime juste la ref DB

      await projetsRepo.delete(id);
      Logger.createLog("delete", "projet", id, req.user?.id, {
        titre: existing.titre,
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
