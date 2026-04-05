import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";

import { api } from "../../lib/api";
import { annonceSchema } from "../../validators/schemas";

const AnnoncesManager = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // --- REACT QUERY ---

  const {
    data: annonces = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["annonces"],
    queryFn: () => api.get("/annonces").then((res) => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (newAnnonce) => api.post("/annonces", newAnnonce),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["annonces"] });
      toast.success("Annonce créée avec succès");
      closeModal();
    },
    onError: (err) => toast.error(err.message || "Erreur lors de la création"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/annonces/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["annonces"] });
      toast.success("Annonce mise à jour");
      closeModal();
    },
    onError: (err) => toast.error(err.message || "Erreur de mise à jour"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/annonces/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["annonces"] });
      toast.success("Annonce supprimée");
    },
    onError: () => toast.error("Erreur lors de la suppression"),
  });

  // --- FORMULAIRE ---

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(annonceSchema),
    defaultValues: {
      titre: "",
      description: "",
      contenu: "",
      categorie: "actualite",
      statut: "brouillon",
      images: [],
      documents: [],
    },
  });

  const watchedImages = watch("images") || [];
  const watchedDocuments = watch("documents") || [];

  // --- UPLOAD ---

  const handleUpload = async (files, type) => {
    const toastId = toast.loading("Upload en cours...");
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("uploadType", "annonce");

        const res = await api.upload("/media/upload", formData);

        if (type === "image") {
          setValue("images", [...watchedImages, res.data.filename]);
        } else {
          setValue("documents", [...watchedDocuments, res.data.filename]);
        }
      }
      toast.success("Upload terminé", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Erreur d'upload", { id: toastId });
    }
  };

  const { getRootProps: getImageProps, getInputProps: getImageInputProps, isDragActive: isDragActiveImages } =
    useDropzone({
      onDrop: (files) => handleUpload(files, "image"),
      accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
      maxSize: 8 * 1024 * 1024,
    });

  const { getRootProps: getDocProps, getInputProps: getDocInputProps, isDragActive: isDragActiveDocs } =
    useDropzone({
      onDrop: (files) => handleUpload(files, "doc"),
      accept: {
        "application/pdf": [".pdf"],
        "application/msword": [".doc"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      },
      maxSize: 8 * 1024 * 1024,
    });

  // --- LOGIQUE UI ---

  const openModal = (annonce = null) => {
    if (annonce) {
      setEditingId(annonce.id);
      reset({
        titre: annonce.titre || "",
        description: annonce.description || "",
        contenu: annonce.contenu || "",
        categorie: annonce.categorie || "actualite",
        statut: annonce.statut || "brouillon",
        images: annonce.images || [],
        documents: annonce.documents || [],
      });
    } else {
      setEditingId(null);
      reset({
        titre: "",
        description: "",
        contenu: "",
        categorie: "actualite",
        statut: "brouillon",
        images: [],
        documents: [],
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    reset();
  };

  const onSubmit = (data) => {
    if (editingId) updateMutation.mutate({ id: editingId, data });
    else createMutation.mutate(data);
  };

  const filteredAnnonces = annonces.filter(
    (a) =>
      a.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isLoading)
    return (
      <div className="p-8 flex items-center justify-center text-white">
        <Loader2 className="animate-spin mr-2" /> Chargement des annonces...
      </div>
    );
  if (isError)
    return (
      <div className="p-8 text-red-400 flex items-center">
        <AlertCircle className="mr-2" /> Erreur de connexion au serveur.
      </div>
    );

  return (
    <div className="p-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Gestion des Annonces
          </h1>
          <p className="text-gray-400">Créez et gérez vos annonces</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-[#F3E719] text-[#0E0E0E] px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#e6d416] transition-colors shadow-lg shadow-yellow-500/20"
        >
          <Plus className="w-5 h-5" />
          Nouvelle annonce
        </button>
      </div>

      {/* SEARCH */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Rechercher une annonce..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#F3E719] transition-all"
        />
      </div>

      {/* LISTE */}
      <div className="grid grid-cols-1 gap-4">
        {filteredAnnonces.map((annonce) => (
          <div
            key={annonce.id}
            className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white">
                    {annonce.titre}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold uppercase tracking-wider ${
                      annonce.statut === "publie"
                        ? "bg-green-500/20 text-green-400"
                        : annonce.statut === "brouillon"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {annonce.statut}
                  </span>
                  <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">
                    {annonce.categorie}
                  </span>
                </div>
                <p className="text-gray-400 mb-2 line-clamp-1">
                  {annonce.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500 font-mono">
                  <span>
                    👁️ {annonce.vue_count || 0}
                  </span>
                  <span>
                    Créée:{" "}
                    {new Date(annonce.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openModal(annonce)}
                  className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm("Supprimer cette annonce ?"))
                      deleteMutation.mutate(annonce.id);
                  }}
                  className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredAnnonces.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Aucune annonce trouvée.
          </div>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-800 pb-4">
              {editingId ? "Modifier l'annonce" : "Nouvelle annonce"}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Titre */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Titre *
                </label>
                <input
                  {...register("titre")}
                  className="w-full px-4 py-3 bg-[#0E0E0E] border border-gray-700 rounded-lg text-white focus:border-[#F3E719] outline-none"
                />
                {errors.titre && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.titre.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  rows="3"
                  className="w-full px-4 py-3 bg-[#0E0E0E] border border-gray-700 rounded-lg text-white focus:border-[#F3E719] outline-none"
                />
              </div>

              {/* Contenu Markdown */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Contenu (Markdown)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-xs text-[#F3E719] hover:underline uppercase font-bold"
                  >
                    {showPreview ? "Éditer" : "Prévisualiser"}
                  </button>
                </div>
                {showPreview ? (
                  <div className="w-full px-4 py-3 bg-[#0E0E0E] border border-gray-700 rounded-lg min-h-[200px] max-h-[400px] overflow-y-auto prose prose-invert max-w-none text-sm">
                    <ReactMarkdown>
                      {watch("contenu") || "*Aucun contenu*"}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <textarea
                    {...register("contenu")}
                    rows="8"
                    placeholder="# Contenu en Markdown..."
                    className="w-full px-4 py-3 bg-[#0E0E0E] border border-gray-700 rounded-lg text-white font-mono text-sm focus:border-[#F3E719] outline-none"
                  />
                )}
              </div>

              {/* Media Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Images */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">
                    Images
                  </label>
                  <div
                    {...getImageProps()}
                    className={`border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors text-center ${
                      isDragActiveImages
                        ? "border-[#F3E719] bg-[#F3E719]/10"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <input {...getImageInputProps()} />
                    <ImageIcon className="w-6 h-6 text-gray-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">JPG, PNG, WebP (8 Mo max)</p>
                  </div>
                  <div className="mt-2 space-y-1">
                    {watchedImages.map((f, i) => (
                      <div
                        key={i}
                        className="flex justify-between text-xs text-gray-400 bg-[#0E0E0E] p-1 rounded"
                      >
                        <span className="truncate">{f}</span>
                        <X
                          className="w-4 h-4 cursor-pointer hover:text-red-400 shrink-0"
                          onClick={() =>
                            setValue(
                              "images",
                              watchedImages.filter((_, idx) => idx !== i),
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">
                    Documents
                  </label>
                  <div
                    {...getDocProps()}
                    className={`border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors text-center ${
                      isDragActiveDocs
                        ? "border-[#F3E719] bg-[#F3E719]/10"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <input {...getDocInputProps()} />
                    <Upload className="w-6 h-6 text-gray-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">PDF, DOC (8 Mo max)</p>
                  </div>
                  <div className="mt-2 space-y-1">
                    {watchedDocuments.map((f, i) => (
                      <div
                        key={i}
                        className="flex justify-between text-xs text-gray-400 bg-[#0E0E0E] p-1 rounded"
                      >
                        <span className="truncate">{f}</span>
                        <X
                          className="w-4 h-4 cursor-pointer hover:text-red-400 shrink-0"
                          onClick={() =>
                            setValue(
                              "documents",
                              watchedDocuments.filter((_, idx) => idx !== i),
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Catégorie & Statut */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Catégorie
                  </label>
                  <select
                    {...register("categorie")}
                    className="w-full px-4 py-3 bg-[#0E0E0E] border border-gray-700 rounded-lg text-white focus:border-[#F3E719] outline-none"
                  >
                    <option value="actualite">Actualité</option>
                    <option value="offre">Offre</option>
                    <option value="evenement">Événement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Statut
                  </label>
                  <select
                    {...register("statut")}
                    className="w-full px-4 py-3 bg-[#0E0E0E] border border-gray-700 rounded-lg text-white focus:border-[#F3E719] outline-none"
                  >
                    <option value="brouillon">Brouillon</option>
                    <option value="publie">Publié</option>
                    <option value="archive">Archivé</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 bg-transparent border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                  className="px-6 py-3 bg-[#F3E719] text-[#0E0E0E] rounded-lg font-bold hover:bg-[#e6d416] flex items-center gap-2"
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="animate-spin w-4 h-4" />
                  )}
                  {editingId ? "Sauvegarder" : "Créer l'annonce"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnoncesManager;
