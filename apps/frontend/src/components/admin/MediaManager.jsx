import React, { useState, useMemo } from "react";
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
  X,
  Copy,
  CheckCircle2,
  Eye,
  FileText,
  HardDrive,
  Filter,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { api } from "../../lib/api";

// ──────────────────────────────────────────────
// Constantes
// ──────────────────────────────────────────────

const FILTER_TYPES = [
  { id: "all", label: "Tous", icon: Filter },
  { id: "image", label: "Images", icon: ImageIcon },
  { id: "video", label: "Videos", icon: Video },
  { id: "document", label: "Documents", icon: FileText },
];

const TYPE_BADGE_STYLES = {
  image: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  video: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  document: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  default: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

function getFileType(file) {
  if (file.type === "image" || file.resource_type === "image") return "image";
  if (file.type === "video" || file.resource_type === "video") return "video";
  const ext = (file.extension || file.format || "").toLowerCase().replace(".", "");
  if (["jpg", "jpeg", "png", "webp", "gif", "svg", "avif"].includes(ext))
    return "image";
  if (["mp4", "mov", "avi", "webm", "mkv"].includes(ext)) return "video";
  return "document";
}

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function getFileUrl(file) {
  if (file.secure_url) return file.secure_url;
  if (file.url) return file.url;
  return `/api/media/${file.filename}`;
}

// ──────────────────────────────────────────────
// Modal de detail
// ──────────────────────────────────────────────

const DetailModal = ({ file, onClose }) => {
  const [copied, setCopied] = useState(false);
  const fileUrl = getFileUrl(file);
  const fileType = getFileType(file);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(fileUrl);
      setCopied(true);
      toast.success("URL copiee dans le presse-papiers");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Impossible de copier l'URL");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a1a] rounded-xl border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h3 className="text-white font-bold truncate pr-4">{file.name}</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview */}
        <div className="bg-black/40 flex items-center justify-center min-h-[300px] max-h-[400px] overflow-hidden">
          {fileType === "image" ? (
            <img
              src={fileUrl}
              alt={file.name}
              className="max-w-full max-h-[400px] object-contain"
            />
          ) : fileType === "video" ? (
            <video
              src={fileUrl}
              controls
              className="max-w-full max-h-[400px]"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-gray-500 py-12">
              <File className="w-16 h-16" />
              <p className="text-sm">Apercu non disponible</p>
            </div>
          )}
        </div>

        {/* Infos */}
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/20 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Nom du fichier</p>
              <p className="text-sm text-white font-medium truncate">
                {file.name || file.filename}
              </p>
            </div>
            <div className="bg-black/20 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Type</p>
              <p className="text-sm text-white font-medium capitalize">
                {fileType}
              </p>
            </div>
            <div className="bg-black/20 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Taille</p>
              <p className="text-sm text-white font-medium font-mono">
                {file.sizeFormatted || formatBytes(file.bytes || file.size)}
              </p>
            </div>
            <div className="bg-black/20 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Extension</p>
              <p className="text-sm text-white font-medium font-mono uppercase">
                {(file.extension || file.format || "N/A").replace(".", "")}
              </p>
            </div>
          </div>

          {/* URL */}
          <div className="bg-black/20 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-2">URL</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs text-gray-300 bg-black/30 px-3 py-2 rounded-lg truncate font-mono">
                {fileUrl}
              </code>
              <button
                onClick={handleCopyUrl}
                className={`p-2 rounded-lg transition-colors shrink-0 ${
                  copied
                    ? "bg-green-500/10 text-green-400"
                    : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
                title="Copier l'URL"
              >
                {copied ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 p-4 border-t border-gray-800">
          <a
            href={fileUrl}
            target="_blank"
            download
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Telecharger
          </a>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────
// Modal de confirmation de suppression
// ──────────────────────────────────────────────

const DeleteConfirmModal = ({ file, onConfirm, onCancel, isDeleting }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
    onClick={onCancel}
  >
    <div
      className="bg-[#1a1a1a] rounded-xl border border-gray-800 w-full max-w-md p-6"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-red-500/10 rounded-full">
          <Trash2 className="w-6 h-6 text-red-400" />
        </div>
        <div>
          <h3 className="text-white font-bold">Supprimer le fichier</h3>
          <p className="text-sm text-gray-400">Cette action est irreversible</p>
        </div>
      </div>
      <p className="text-gray-300 text-sm mb-6">
        Etes-vous sur de vouloir supprimer{" "}
        <span className="text-white font-medium">{file.name}</span> ? Le fichier
        sera definitivement supprime de Cloudinary.
      </p>
      <div className="flex items-center gap-3 justify-end">
        <button
          onClick={onCancel}
          className="px-4 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm"
        >
          Annuler
        </button>
        <button
          onClick={onConfirm}
          disabled={isDeleting}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium disabled:opacity-50"
        >
          {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
          Supprimer
        </button>
      </div>
    </div>
  </div>
);

// ──────────────────────────────────────────────
// Composant principal
// ──────────────────────────────────────────────

const MediaManager = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileToDelete, setFileToDelete] = useState(null);

  // 1. Fetching des medias
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
      toast.success(`Fichier uploade : ${data.data.filename}`);
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
    onError: (err) => toast.error(`Erreur upload: ${err.message}`),
  });

  // 3. Mutation Delete
  const deleteMutation = useMutation({
    mutationFn: (filename) => api.delete(`/media/${filename}`),
    onSuccess: () => {
      toast.success("Fichier supprime definitivement");
      queryClient.invalidateQueries({ queryKey: ["media"] });
      setFileToDelete(null);
    },
    onError: () => {
      toast.error("Impossible de supprimer le fichier");
      setFileToDelete(null);
    },
  });

  // Gestion du Dropzone
  const onDrop = async (acceptedFiles) => {
    const toastId = toast.loading(
      `Upload de ${acceptedFiles.length} fichier(s)...`,
    );

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
    maxSize: 50 * 1024 * 1024,
  });

  // ── Statistiques calculees ──
  const stats = useMemo(() => {
    const counts = { image: 0, video: 0, document: 0 };
    let totalSize = 0;

    mediaFiles.forEach((file) => {
      const type = getFileType(file);
      counts[type] = (counts[type] || 0) + 1;
      totalSize += file.bytes || file.size || 0;
    });

    return { counts, totalSize };
  }, [mediaFiles]);

  // ── Filtrage ──
  const filteredFiles = useMemo(() => {
    return mediaFiles.filter((file) => {
      const matchesSearch = file.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType =
        activeFilter === "all" || getFileType(file) === activeFilter;
      return matchesSearch && matchesType;
    });
  }, [mediaFiles, searchTerm, activeFilter]);

  // ── Copier URL ──
  const handleCopyUrl = async (file, e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(getFileUrl(file));
      toast.success("URL copiee");
    } catch {
      toast.error("Impossible de copier l'URL");
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-10 h-10 text-blue-400" />;
      case "video":
        return <Video className="w-10 h-10 text-purple-400" />;
      default:
        return <File className="w-10 h-10 text-orange-400" />;
    }
  };

  const getTypeBadge = (type) => {
    const style = TYPE_BADGE_STYLES[type] || TYPE_BADGE_STYLES.default;
    const label =
      type === "image"
        ? "IMAGE"
        : type === "video"
          ? "VIDEO"
          : "DOC";
    return (
      <span
        className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${style}`}
      >
        {label}
      </span>
    );
  };

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin text-[#F3E719]" />
          <p>Chargement de la mediatheque...</p>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (isError) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 flex items-center gap-4 text-red-400">
          <AlertCircle className="w-6 h-6" />
          <div>
            <h3 className="font-bold">Erreur de connexion</h3>
            <p className="text-sm">Impossible de charger la mediatheque.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* HEADER */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Mediatheque</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="text-gray-400">
                {mediaFiles.length} fichier{mediaFiles.length > 1 ? "s" : ""}
              </span>
              <span className="text-gray-700">|</span>
              <span className="flex items-center gap-1.5 text-gray-500">
                <HardDrive className="w-3.5 h-3.5" />
                {formatBytes(stats.totalSize)}
              </span>
              <span className="text-gray-700">|</span>
              <span className="text-blue-400">
                {stats.counts.image} image{stats.counts.image > 1 ? "s" : ""}
              </span>
              <span className="text-purple-400">
                {stats.counts.video} video{stats.counts.video > 1 ? "s" : ""}
              </span>
              <span className="text-orange-400">
                {stats.counts.document} document{stats.counts.document > 1 ? "s" : ""}
              </span>
            </div>
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

        {/* Filtres par type */}
        <div className="flex flex-wrap gap-2">
          {FILTER_TYPES.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.id;
            const count =
              filter.id === "all"
                ? mediaFiles.length
                : stats.counts[filter.id] || 0;
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#F3E719] text-[#0E0E0E]"
                    : "bg-[#1a1a1a] text-gray-400 border border-gray-800 hover:border-gray-600 hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {filter.label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? "bg-[#0E0E0E]/20 text-[#0E0E0E]"
                      : "bg-gray-800 text-gray-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
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
            <p className="text-[#F3E719] font-bold">Relachez pour uploader !</p>
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

      {/* GRID VIEW — responsive : 2 mobile, 3 tablette, 4 desktop, 6 grand ecran */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {filteredFiles.map((file, index) => {
          const fileType = getFileType(file);
          return (
            <div
              key={file.filename || index}
              onClick={() => setSelectedFile(file)}
              className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 group hover:border-[#F3E719]/40 hover:shadow-lg hover:shadow-[#F3E719]/5 hover:scale-[1.02] transition-all duration-200 cursor-pointer relative"
            >
              {/* Badge type */}
              <div className="absolute top-2 right-2 z-10">
                {getTypeBadge(fileType)}
              </div>

              {/* Apercu */}
              <div className="aspect-square bg-black/40 rounded-lg mb-3 flex items-center justify-center overflow-hidden relative">
                {fileType === "image" ? (
                  <img
                    src={getFileUrl(file)}
                    alt={file.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  getFileIcon(fileType)
                )}

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(file);
                    }}
                    className="p-2 bg-[#F3E719] text-[#0E0E0E] rounded-full hover:bg-[#d4c916] transition-colors"
                    title="Voir les details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleCopyUrl(file, e)}
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                    title="Copier l'URL"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <a
                    href={getFileUrl(file)}
                    target="_blank"
                    download
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                    title="Telecharger"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFileToDelete(file);
                    }}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Infos Meta */}
              <div className="space-y-1">
                <h3
                  className="text-white text-xs font-semibold truncate"
                  title={file.name}
                >
                  {file.name}
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-gray-600 font-mono uppercase">
                    {(file.extension || file.format || "").replace(".", "") || "FILE"}
                  </span>
                  <span className="text-[11px] text-gray-400 font-mono font-medium">
                    {file.sizeFormatted || formatBytes(file.bytes || file.size)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredFiles.length === 0 && (
        <div className="text-center py-16 border border-dashed border-gray-800 rounded-xl">
          <div className="mb-4">
            {activeFilter === "all" && !searchTerm ? (
              <Upload className="w-16 h-16 mx-auto text-gray-700" />
            ) : (
              <Search className="w-16 h-16 mx-auto text-gray-700" />
            )}
          </div>
          <h3 className="text-white font-medium mb-2">
            {searchTerm
              ? "Aucun resultat"
              : activeFilter !== "all"
                ? `Aucun fichier de type "${FILTER_TYPES.find((f) => f.id === activeFilter)?.label || activeFilter}"`
                : "Mediatheque vide"}
          </h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            {searchTerm
              ? `Aucun fichier ne correspond a "${searchTerm}". Essayez un autre terme.`
              : activeFilter !== "all"
                ? "Uploadez des fichiers de ce type via la zone de depot ci-dessus."
                : "Glissez vos fichiers dans la zone ci-dessus ou cliquez pour parcourir."}
          </p>
        </div>
      )}

      {/* MODALS */}
      {selectedFile && (
        <DetailModal
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
        />
      )}

      {fileToDelete && (
        <DeleteConfirmModal
          file={fileToDelete}
          isDeleting={deleteMutation.isPending}
          onConfirm={() => deleteMutation.mutate(fileToDelete.filename)}
          onCancel={() => setFileToDelete(null)}
        />
      )}
    </div>
  );
};

export default MediaManager;
