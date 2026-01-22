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
  Video,
  Loader2,
  AlertCircle,
  Star,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";

import { api } from "../../lib/api";
import { projetSchema } from "../../validators/schemas";

const ProjetsManager = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // --- REACT QUERY ---

  const {
    data: projets = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["projets"],
    queryFn: () => api.get("/projets").then((res) => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (newProjet) => api.post("/projets", newProjet),
    onSuccess: () => {
      queryClient.invalidateQueries(["projets"]);
      toast.success("Projet créé avec succès");
      closeModal();
    },
    onError: (err) => toast.error(err.message || "Erreur lors de la création"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/projets/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["projets"]);
      toast.success("Projet mis à jour");
      closeModal();
    },
    onError: (err) => toast.error(err.message || "Erreur de mise à jour"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/projets/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["projets"]);
      toast.success("Projet supprimé");
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
    resolver: zodResolver(projetSchema),
    defaultValues: {
      titre: "",
      description: "",
      contenu: "",
      type_projet: "charpente",
      client: "",
      lieu: "",
      statut: "en_cours",
      featured: false,
      images: [],
      documents: [],
      videos: [],
    },
  });

  const watchedImages = watch("images") || [];
  const watchedDocuments = watch("documents") || [];
  const watchedVideos = watch("videos") || [];

  // --- UPLOAD ---

  const handleUpload = async (files, type) => {
    const toastId = toast.loading("Upload en cours...");
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("uploadType", "projet");

        const res = await api.upload("/media/upload", formData);

        if (type === "image")
          setValue("images", [...watchedImages, res.data.filename]);
        else if (type === "doc")
          setValue("documents", [...watchedDocuments, res.data.filename]);
        else if (type === "video")
          setValue("videos", [...watchedVideos, res.data.filename]);
      }
      toast.success("Upload terminé", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Erreur d'upload", { id: toastId });
    }
  };

  const { getRootProps: getImageProps, getInputProps: getImageInputProps } =
    useDropzone({
      onDrop: (files) => handleUpload(files, "image"),
      accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    });

  const { getRootProps: getDocProps, getInputProps: getDocInputProps } =
    useDropzone({
      onDrop: (files) => handleUpload(files, "doc"),
      accept: { "application/pdf": [".pdf"] },
    });

  const { getRootProps: getVideoProps, getInputProps: getVideoInputProps } =
    useDropzone({
      onDrop: (files) => handleUpload(files, "video"),
      accept: { "video/*": [".mp4", ".webm"] },
      maxSize: 50 * 1024 * 1024, // 50MB max pour vidéo
    });

  // --- LOGIQUE UI ---

  const openModal = (projet = null) => {
    if (projet) {
      setEditingId(projet.id);
      reset({
        titre: projet.titre,
        description: projet.description || "",
        contenu: projet.contenu || "",
        type_projet: projet.type_projet || "charpente",
        client: projet.client || "",
        lieu: projet.lieu || "",
        statut: projet.statut,
        featured: projet.featured || false,
        images: projet.images || [],
        documents: projet.documents || [],
        videos: projet.videos || [],
      });
    } else {
      setEditingId(null);
      reset({
        titre: "",
        description: "",
        contenu: "",
        type_projet: "charpente",
        client: "",
        lieu: "",
        statut: "en_cours",
        featured: false,
        images: [],
        documents: [],
        videos: [],
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    reset();
  };

  const onSubmit = (data) => {
    if (editingId) updateMutation.mutate({ id: editingId, data });
    else createMutation.mutate(data);
  };

  const filteredProjets = projets.filter(
    (p) =>
      p.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.client?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isLoading)
    return (
      <div className="p-8 flex items-center justify-center text-white">
        <Loader2 className="animate-spin mr-2" /> Chargement des projets
        sécurisés...
      </div>
    );
  if (isError)
    return (
      <div className="p-8 text-red-400 flex items-center">
        <AlertCircle className="mr-2" /> Erreur de connexion au serveur
        sécurisé.
      </div>
    );

  return (
    <div className="p-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Gestion des Projets
          </h1>
          <p className="text-gray-400">Réalisations et chantiers clients</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-[#F3E719] text-[#0E0E0E] px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#e6d416] transition-colors shadow-lg shadow-yellow-500/20"
        >
          <Plus className="w-5 h-5" />
          Nouveau projet
        </button>
      </div>

      {/* SEARCH */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Rechercher par titre, client..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#F3E719] transition-all"
        />
      </div>

      {/* LISTE */}
      <div className="grid grid-cols-1 gap-4">
        {filteredProjets.map((projet) => (
          <div
            key={projet.id}
            className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white">
                    {projet.titre}
                  </h3>
                  {projet.featured && (
                    <Star className="w-5 h-5 text-[#F3E719] fill-[#F3E719]" />
                  )}
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold uppercase tracking-wider ${
                      projet.statut === "termine"
                        ? "bg-green-500/20 text-green-400"
                        : projet.statut === "en_cours"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {projet.statut}
                  </span>
                  <span className="px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    {projet.type_projet}
                  </span>
                </div>
                <p className="text-gray-400 mb-2 line-clamp-1">
                  {projet.description}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-mono">
                  {projet.client && <span>🏢 {projet.client}</span>}
                  {projet.lieu && <span>📍 {projet.lieu}</span>}
                  <span>👁️ {projet.vue_count || 0}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openModal(projet)}
                  className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm("Supprimer ce projet ?"))
                      deleteMutation.mutate(projet.id);
                  }}
                  className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredProjets.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Aucun projet trouvé.
          </div>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-800 pb-4">
              {editingId ? "Modifier le projet" : "Nouveau projet"}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  {/* Titre */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Titre du projet *
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

                  {/* Client & Lieu */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Client
                      </label>
                      <input
                        {...register("client")}
                        className="w-full px-4 py-3 bg-[#0E0E0E] border border-gray-700 rounded-lg text-white focus:border-[#F3E719] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Lieu
                      </label>
                      <input
                        {...register("lieu")}
                        className="w-full px-4 py-3 bg-[#0E0E0E] border border-gray-700 rounded-lg text-white focus:border-[#F3E719] outline-none"
                      />
                    </div>
                  </div>

                  {/* Type & Statut */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Type
                      </label>
                      <select
                        {...register("type_projet")}
                        className="w-full px-4 py-3 bg-[#0E0E0E] border border-gray-700 rounded-lg text-white focus:border-[#F3E719] outline-none"
                      >
                        <option value="charpente">Charpente Métallique</option>
                        <option value="bardage">Bardage</option>
                        <option value="couverture">Couverture</option>
                        <option value="photovoltaique">Photovoltaïque</option>
                        <option value="terrassement">Terrassement</option>
                        <option value="autre">Autre</option>
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
                        <option value="en_cours">En cours</option>
                        <option value="termine">Terminé</option>
                        <option value="annule">Annulé</option>
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description courte
                    </label>
                    <textarea
                      {...register("description")}
                      rows="3"
                      className="w-full px-4 py-3 bg-[#0E0E0E] border border-gray-700 rounded-lg text-white focus:border-[#F3E719] outline-none"
                    />
                  </div>

                  {/* Featured Toggle */}
                  <div className="flex items-center gap-3 bg-[#0E0E0E] p-4 rounded-lg border border-gray-800">
                    <input
                      type="checkbox"
                      id="featured"
                      {...register("featured")}
                      className="w-5 h-5 accent-[#F3E719]"
                    />
                    <label
                      htmlFor="featured"
                      className="text-white font-medium cursor-pointer"
                    >
                      Mettre ce projet en avant (Page d'accueil)
                    </label>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Contenu Markdown */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Détails (Markdown)
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
                      <div className="w-full px-4 py-3 bg-[#0E0E0E] border border-gray-700 rounded-lg min-h-[200px] prose prose-invert max-w-none text-sm">
                        <ReactMarkdown>{watch("contenu")}</ReactMarkdown>
                      </div>
                    ) : (
                      <textarea
                        {...register("contenu")}
                        rows="8"
                        className="w-full px-4 py-3 bg-[#0E0E0E] border border-gray-700 rounded-lg text-white font-mono text-sm focus:border-[#F3E719] outline-none"
                        placeholder="# Détails techniques..."
                      />
                    )}
                  </div>

                  {/* Media Uploads Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Images */}
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-xs font-medium text-gray-400 mb-2">
                        Photos
                      </label>
                      <div
                        {...getImageProps()}
                        className="border border-dashed border-gray-700 rounded p-4 hover:border-[#F3E719] cursor-pointer text-center"
                      >
                        <input {...getImageInputProps()} />
                        <ImageIcon className="w-6 h-6 text-gray-500 mx-auto" />
                      </div>
                      <div className="mt-2 space-y-1">
                        {watchedImages.map((f, i) => (
                          <div
                            key={i}
                            className="flex justify-between text-xs text-gray-400 bg-[#0E0E0E] p-1 rounded"
                          >
                            <span className="truncate">{f}</span>
                            <X
                              className="w-4 h-4 cursor-pointer hover:text-red-400"
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

                    {/* Videos */}
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-xs font-medium text-gray-400 mb-2">
                        Vidéos (MP4)
                      </label>
                      <div
                        {...getVideoProps()}
                        className="border border-dashed border-gray-700 rounded p-4 hover:border-[#F3E719] cursor-pointer text-center"
                      >
                        <input {...getVideoInputProps()} />
                        <Video className="w-6 h-6 text-gray-500 mx-auto" />
                      </div>
                      <div className="mt-2 space-y-1">
                        {watchedVideos.map((f, i) => (
                          <div
                            key={i}
                            className="flex justify-between text-xs text-gray-400 bg-[#0E0E0E] p-1 rounded"
                          >
                            <span className="truncate">{f}</span>
                            <X
                              className="w-4 h-4 cursor-pointer hover:text-red-400"
                              onClick={() =>
                                setValue(
                                  "videos",
                                  watchedVideos.filter((_, idx) => idx !== i),
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Docs */}
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-400 mb-2">
                        Documents (PDF)
                      </label>
                      <div
                        {...getDocProps()}
                        className="border border-dashed border-gray-700 rounded p-4 hover:border-[#F3E719] cursor-pointer text-center"
                      >
                        <input {...getDocInputProps()} />
                        <Upload className="w-6 h-6 text-gray-500 mx-auto" />
                      </div>
                      <div className="mt-2 space-y-1">
                        {watchedDocuments.map((f, i) => (
                          <div
                            key={i}
                            className="flex justify-between text-xs text-gray-400 bg-[#0E0E0E] p-1 rounded"
                          >
                            <span className="truncate">{f}</span>
                            <X
                              className="w-4 h-4 cursor-pointer hover:text-red-400"
                              onClick={() =>
                                setValue(
                                  "documents",
                                  watchedDocuments.filter(
                                    (_, idx) => idx !== i,
                                  ),
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
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
                  {editingId ? "Sauvegarder" : "Créer le projet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjetsManager;
