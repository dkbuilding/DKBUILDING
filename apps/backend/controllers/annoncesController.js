const AnnoncesRepository = require("../repositories/AnnoncesRepository");
const Logger = require("../utils/logger");
const { generateSlug } = require("../utils/slugify");
const { annonceSchema } = require("../validators/schemas");
const parseJSON = require("../utils/parseJSON");

/**
 * Annonces Controller - Version Serverless (Turso + Cloudinary)
 * Architecture GovTech Zero-Cost pour DK BUILDING
 *
 * Utilise AnnoncesRepository pour l'accès aux données.
 * Le controller gère uniquement la logique HTTP, la validation et le parsing JSON.
 */

const annoncesRepo = new AnnoncesRepository();

/**
 * Parse les champs JSON d'une annonce pour la réponse HTTP
 */
const parseAnnonce = (annonce) => ({
  ...annonce,
  images: parseJSON(annonce.images),
  documents: parseJSON(annonce.documents),
});

class AnnoncesController {
  /**
   * Récupérer toutes les annonces avec filtres
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

      const annoncesParsed = rows.map(parseAnnonce);

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
      const annonce = await annoncesRepo.getById(id);

      if (!annonce) {
        return res
          .status(404)
          .json({ success: false, error: "Annonce introuvable" });
      }

      res.json({ success: true, data: parseAnnonce(annonce) });
    } catch (error) {
      console.error("Erreur getById:", error);
      res.status(500).json({ success: false, error: "Erreur système" });
    }
  }

  static async getBySlug(req, res) {
    try {
      const { slug } = req.params;
      const annonce = await annoncesRepo.getBySlug(slug);

      if (!annonce) {
        return res
          .status(404)
          .json({ success: false, error: "Annonce introuvable" });
      }

      // Update asynchrone du compteur de vue (Fire & Forget pour la perf)
      annoncesRepo.incrementViewCount(annonce.id);

      res.json({ success: true, data: parseAnnonce(annonce) });
    } catch (error) {
      console.error("Erreur getBySlug:", error);
      res.status(500).json({ success: false, error: "Erreur système" });
    }
  }

  static async getPublic(req, res) {
    try {
      const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);
      const offset = Math.max(parseInt(req.query.offset) || 0, 0);

      const rows = await annoncesRepo.getPublic({ limit, offset });
      const annoncesParsed = rows.map(parseAnnonce);

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
      const existingSlugs = await annoncesRepo.getAllSlugs();
      const slug = generateSlug(data.titre, existingSlugs);

      // 3. Gestion Cloudinary (URLs directes)
      const images = req.files?.images || req.body.images || [];
      const documents = req.files?.documents || req.body.documents || [];

      const imageUrls = Array.isArray(images)
        ? images.map((file) => file.path || file)
        : [];

      const docUrls = Array.isArray(documents)
        ? documents.map((file) => file.path || file)
        : [];

      // 4. Insertion via Repository
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
        return res.status(400).json({
          success: false,
          error: "Données invalides",
          details: validation.error.format(),
        });
      }

      const data = validation.data;

      // Vérif existence
      const existing = await annoncesRepo.getById(id);

      if (!existing) {
        return res
          .status(404)
          .json({ success: false, error: "Annonce non trouvée" });
      }

      // Slug
      let slug = existing.slug;
      if (data.titre && data.titre !== existing.titre) {
        const existingSlugs = await annoncesRepo.getAllSlugs(id);
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

      res.json({ success: true, message: "Annonce mise à jour" });
    } catch (error) {
      console.error("Erreur update:", error);
      res.status(500).json({ success: false, error: "Erreur de mise à jour" });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const existing = await annoncesRepo.getById(id);

      if (!existing) {
        return res
          .status(404)
          .json({ success: false, error: "Annonce non trouvée" });
      }

      // NOTE: Avec Cloudinary, on pourrait appeler cloudinary.uploader.destroy(public_id)
      // pour nettoyer les fichiers orphelins, mais pour l'instant on supprime juste la ref DB

      await annoncesRepo.delete(id);

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
