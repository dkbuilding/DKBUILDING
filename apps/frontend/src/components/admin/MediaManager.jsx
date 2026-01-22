import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Upload,
  Trash2,
  Download,
  Image as ImageIcon,
  File,
  Video,
  Loader2,
  Search,
  AlertCircle,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { api } from "../../lib/api";

const MediaManager = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Fetching des médias
  const {
    data: mediaFiles = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["media"],
    queryFn: () => api.get("/media/list").then((res) => res.data),
  });

  // 2. Mutation Upload
  const uploadMutation = useMutation({
    mutationFn: (formData) => api.upload("/media/upload", formData),
    onSuccess: (data) => {
      toast.success(`Fichier uploadé : ${data.data.filename}`);
      queryClient.invalidateQueries(["media"]);
    },
    onError: (err) => toast.error(`Erreur upload: ${err.message}`),
  });

  // 3. Mutation Delete
  const deleteMutation = useMutation({
    mutationFn: (filename) => api.delete(`/media/${filename}`),
    onSuccess: () => {
      toast.success("Fichier supprimé définitivement");
      queryClient.invalidateQueries(["media"]);
    },
    onError: () => toast.error("Impossible de supprimer le fichier"),
  });

  // Gestion du Dropzone
  const onDrop = async (acceptedFiles) => {
    const toastId = toast.loading(
      `Upload de ${acceptedFiles.length} fichier(s)...`,
    );

    // On upload les fichiers un par un pour mieux gérer les erreurs
    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        await uploadMutation.mutateAsync(formData);
      } catch (e) {
        console.error(e);
      }
    }
    toast.dismiss(toastId);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".webp"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc", ".docx"],
      "video/*": [".mp4", ".mov"],
    },
    maxSize: 50 * 1024 * 1024, // 50MB (augmenté pour les vidéos)
  });

  // Filtrage local
  const filteredFiles = mediaFiles.filter((file) =>
    file.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getFileIcon = (type) => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-8 h-8 text-blue-400" />;
      case "video":
        return <Video className="w-8 h-8 text-purple-400" />;
      default:
        return <File className="w-8 h-8 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin text-[#F3E719]" />
          <p>Chargement de la médiathèque...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 flex items-center gap-4 text-red-400">
          <AlertCircle className="w-6 h-6" />
          <div>
            <h3 className="font-bold">Erreur de connexion</h3>
            <p className="text-sm">Impossible de charger la médiathèque.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Médiathèque</h1>
          <p className="text-gray-400">
            Stockage centralisé ({mediaFiles.length} fichiers)
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-[#F3E719] outline-none transition-all"
          />
        </div>
      </div>

      {/* DROPZONE */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all mb-8 relative overflow-hidden group ${
          isDragActive
            ? "border-[#F3E719] bg-[#F3E719]/10"
            : "border-gray-700 hover:border-gray-500 bg-[#1a1a1a]"
        }`}
      >
        <input {...getInputProps()} />
        <div className="relative z-10">
          <Upload
            className={`w-12 h-12 mx-auto mb-4 transition-colors ${isDragActive ? "text-[#F3E719]" : "text-gray-400 group-hover:text-white"}`}
          />
          {isDragActive ? (
            <p className="text-[#F3E719] font-bold">Relâchez pour uploader !</p>
          ) : (
            <div>
              <p className="text-white font-medium mb-1">
                Glissez vos fichiers ici
              </p>
              <p className="text-gray-500 text-sm">
                JPG, PNG, PDF, MP4 (Max 50MB)
              </p>
            </div>
          )}
        </div>
        {uploadMutation.isPending && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20 backdrop-blur-sm">
            <Loader2 className="w-8 h-8 text-[#F3E719] animate-spin" />
          </div>
        )}
      </div>

      {/* GRID VIEW */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredFiles.map((file, index) => (
          <div
            key={index}
            className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4 group hover:border-gray-600 transition-all relative"
          >
            {/* Aperçu */}
            <div className="aspect-square bg-black/40 rounded mb-3 flex items-center justify-center overflow-hidden relative">
              {file.type === "image" ? (
                <img
                  src={`${import.meta.env.VITE_API_URL || "http://localhost:3001"}/media/${file.filename}`}
                  alt={file.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                getFileIcon(file.type)
              )}

              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <a
                  href={`${import.meta.env.VITE_API_URL || "http://localhost:3001"}/media/${file.filename}`}
                  target="_blank"
                  download
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                  title="Télécharger"
                  rel="noreferrer"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  onClick={() => {
                    if (confirm(`Supprimer ${file.name} ?`))
                      deleteMutation.mutate(file.filename);
                  }}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Infos Méta */}
            <div className="space-y-1">
              <h3
                className="text-white text-xs font-semibold truncate"
                title={file.name}
              >
                {file.name}
              </h3>
              <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono">
                <span>
                  {file.extension?.toUpperCase().replace(".", "") || "FILE"}
                </span>
                <span>{file.sizeFormatted || "0 B"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <div className="text-center py-12 text-gray-500 border border-dashed border-gray-800 rounded-lg">
          {searchTerm
            ? "Aucun fichier trouvé pour cette recherche."
            : "Aucun fichier dans la médiathèque."}
        </div>
      )}
    </div>
  );
};

export default MediaManager;
