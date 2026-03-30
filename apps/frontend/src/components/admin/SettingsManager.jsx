import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  Shield,
  Database,
  Info,
  Phone,
  Mail,
  MapPin,
  User,
  Hash,
  Lock,
  Clock,
  LogOut,
  RefreshCw,
  Globe,
  FileText,
  Tag,
  AlertCircle,
  Download,
  Trash2,
  HardDrive,
  Calendar,
  Server,
  Code2,
  Rocket,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../lib/api";

// ──────────────────────────────────────────────
// Composants utilitaires internes
// ──────────────────────────────────────────────

const SectionCard = ({ icon: Icon, title, iconColor, children }) => (
  <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-800">
      <div
        className={`p-2 rounded-lg bg-opacity-10 ${iconColor || "text-[#F3E719] bg-[#F3E719]/10"}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <h2 className="text-lg font-bold text-white">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const InfoRow = ({ icon: Icon, label, value, mono = false }) => (
  <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-black/40 transition-colors">
    <div className="flex items-center gap-3 text-gray-400">
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      <span className="text-sm">{label}</span>
    </div>
    <span
      className={`text-white text-sm font-medium ${mono ? "font-mono" : ""} text-right max-w-[60%] truncate`}
      title={typeof value === "string" ? value : undefined}
    >
      {value}
    </span>
  </div>
);

const StatusBadge = ({ ok, label }) => (
  <span
    className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
      ok
        ? "bg-green-500/10 text-green-400 border border-green-500/20"
        : "bg-red-500/10 text-red-400 border border-red-500/20"
    }`}
  >
    <span
      className={`w-1.5 h-1.5 rounded-full ${ok ? "bg-green-400" : "bg-red-400"}`}
    />
    {label}
  </span>
);

// ──────────────────────────────────────────────
// Composant principal
// ──────────────────────────────────────────────

const SettingsManager = () => {
  const queryClient = useQueryClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // ── Fetch auth status ──
  const { data: authStatus } = useQuery({
    queryKey: ["auth-status"],
    queryFn: () => api.get("/auth/status"),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  // ── Fetch backup list ──
  const {
    data: backupsData,
    isLoading: backupsLoading,
    isError: backupsError,
  } = useQuery({
    queryKey: ["backups"],
    queryFn: () => api.get("/admin/backup/list"),
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });

  const backups = backupsData?.data || backupsData?.backups || [];

  // ── Actions ──

  const handleLogoutAll = async () => {
    setIsLoggingOut(true);
    try {
      await api.post("/auth/logout");
      toast.success("Toutes les sessions ont ete deconnectees");
    } catch {
      toast.error("Impossible de deconnecter les sessions");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleRegenerateTokens = () => {
    toast("Fonctionnalite a venir — regeneration des tokens JWT", {
      icon: "🔐",
    });
  };

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true);
    try {
      await api.post("/admin/backup");
      toast.success("Sauvegarde creee avec succes");
      queryClient.invalidateQueries({ queryKey: ["backups"] });
    } catch {
      toast.error("Impossible de creer la sauvegarde");
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const handleDeleteBackup = async (backupName) => {
    try {
      await api.delete(`/admin/backup/${encodeURIComponent(backupName)}`);
      toast.success("Sauvegarde supprimee");
      queryClient.invalidateQueries({ queryKey: ["backups"] });
    } catch {
      toast.error("Impossible de supprimer la sauvegarde");
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleCleanBackups = async () => {
    setIsCleaning(true);
    try {
      await api.post("/admin/backup/clean");
      toast.success("Anciennes sauvegardes nettoyees");
      queryClient.invalidateQueries({ queryKey: ["backups"] });
    } catch {
      toast.error("Impossible de nettoyer les sauvegardes");
    } finally {
      setIsCleaning(false);
    }
  };

  // ── Rendu ──

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Parametres</h1>
        <p className="text-gray-400">
          Configuration et informations du systeme DK BUILDING
        </p>
      </div>

      <div className="space-y-6">
        {/* ─── Section 1 : Informations entreprise ─── */}
        <SectionCard
          icon={Building2}
          title="Informations de l'entreprise"
          iconColor="text-blue-400 bg-blue-500/10"
        >
          <div className="space-y-2">
            <InfoRow icon={Building2} label="Raison sociale" value="DK BUILDING" />
            <InfoRow icon={Hash} label="SIREN" value="947 998 555" mono />
            <InfoRow
              icon={MapPin}
              label="Adresse"
              value="59 Rue Pierre Cormary, 81000 Albi"
            />
            <InfoRow icon={Phone} label="Telephone" value="+33 7 68 11 38 39" mono />
            <InfoRow icon={Mail} label="Email" value="contact@dkbuilding.fr" />
            <InfoRow icon={User} label="Dirigeant" value="Dicalou KHAMIDOV" />
          </div>
          <p className="text-xs text-gray-600 mt-4 italic">
            Ces informations sont en lecture seule. Pour les modifier, contactez
            l'administrateur systeme.
          </p>
        </SectionCard>

        {/* ─── Section 2 : Securite ─── */}
        <SectionCard
          icon={Shield}
          title="Securite"
          iconColor="text-green-400 bg-green-500/10"
        >
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
              <div className="flex items-center gap-3 text-gray-400">
                <Lock className="w-4 h-4" />
                <span className="text-sm">Authentification JWT</span>
              </div>
              <StatusBadge
                ok={authStatus?.authenticated !== false}
                label={
                  authStatus?.authenticated !== false ? "Actif" : "Inactif"
                }
              />
            </div>
            <InfoRow
              icon={Shield}
              label="Niveau de securite"
              value={authStatus?.security || "HttpOnly + Secure + SameSite"}
            />
            <InfoRow
              icon={Clock}
              label="Duree de session"
              value="30 minutes"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleRegenerateTokens}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#F3E719]/10 text-[#F3E719] border border-[#F3E719]/20 rounded-lg hover:bg-[#F3E719]/20 transition-colors text-sm font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Regenerer les tokens
            </button>
            <button
              onClick={handleLogoutAll}
              disabled={isLoggingOut}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium disabled:opacity-50"
            >
              {isLoggingOut ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              Deconnecter toutes les sessions
            </button>
          </div>
        </SectionCard>

        {/* ─── Section 3 : SEO & Metadonnees ─── */}
        <SectionCard
          icon={Globe}
          title="SEO & Metadonnees"
          iconColor="text-purple-400 bg-purple-500/10"
        >
          <div className="space-y-2 mb-4">
            <InfoRow
              icon={FileText}
              label="Titre du site"
              value="DK BUILDING | Construction & Renovation a Albi"
            />
            <InfoRow
              icon={SearchIcon}
              label="Description meta"
              value="Entreprise de construction et renovation basee a Albi. Travaux de qualite, devis gratuit."
            />
            <InfoRow
              icon={Tag}
              label="Mots-cles"
              value="construction, renovation, Albi, BTP, DK BUILDING"
            />
            <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
              <div className="flex items-center gap-3 text-gray-400">
                <Globe className="w-4 h-4" />
                <span className="text-sm">sitemap.xml</span>
              </div>
              <StatusBadge ok={true} label="Genere" />
            </div>
          </div>
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3 flex items-start gap-3">
            <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
            <p className="text-xs text-blue-300">
              Le SEO est gere via les balises meta dans{" "}
              <code className="bg-black/30 px-1.5 py-0.5 rounded text-blue-200">
                index.html
              </code>{" "}
              et les meta-tags dynamiques des pages.
            </p>
          </div>
        </SectionCard>

        {/* ─── Section 4 : Sauvegardes ─── */}
        <SectionCard
          icon={Database}
          title="Sauvegardes"
          iconColor="text-orange-400 bg-orange-500/10"
        >
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={handleCreateBackup}
              disabled={isCreatingBackup}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#F3E719] text-[#0E0E0E] rounded-lg hover:bg-[#d4c916] transition-colors text-sm font-bold disabled:opacity-50"
            >
              {isCreatingBackup ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Creer une sauvegarde
            </button>
            <button
              onClick={handleCleanBackups}
              disabled={isCleaning}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium disabled:opacity-50"
            >
              {isCleaning ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Nettoyer anciennes sauvegardes
            </button>
          </div>

          {/* Liste des sauvegardes */}
          {backupsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#F3E719]" />
            </div>
          ) : backupsError ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3 text-red-400">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm">
                Impossible de charger la liste des sauvegardes.
              </p>
            </div>
          ) : Array.isArray(backups) && backups.length > 0 ? (
            <div className="space-y-2">
              {backups.map((backup, index) => (
                <div
                  key={backup.name || index}
                  className="flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-black/40 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <HardDrive className="w-4 h-4 text-gray-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-white font-medium truncate">
                        {backup.name || backup.filename || `Sauvegarde ${index + 1}`}
                      </p>
                      <p className="text-xs text-gray-500 font-mono">
                        {backup.date || backup.createdAt || "Date inconnue"}
                        {backup.size ? ` — ${backup.size}` : ""}
                      </p>
                    </div>
                  </div>
                  {deleteConfirm === (backup.name || index) ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleDeleteBackup(backup.name || backup.filename)}
                        className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-colors font-medium"
                      >
                        Confirmer
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(backup.name || index)}
                      className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 border border-dashed border-gray-800 rounded-lg">
              <Database className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Aucune sauvegarde disponible</p>
            </div>
          )}
        </SectionCard>

        {/* ─── Section 5 : A propos du systeme ─── */}
        <SectionCard
          icon={Info}
          title="A propos du systeme"
          iconColor="text-gray-400 bg-gray-500/10"
        >
          <div className="space-y-2">
            <InfoRow icon={Tag} label="Version" value="latest" mono />
            <InfoRow icon={Code2} label="Frontend" value="React 19 + Vite 7" />
            <InfoRow icon={Server} label="Backend" value="Express 5 + Turso" />
            <InfoRow icon={Rocket} label="Deploiement" value="Vercel" />
            <InfoRow
              icon={Calendar}
              label="Derniere mise a jour"
              value={new Date().toLocaleDateString("fr-FR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            />
          </div>
          <div className="mt-4 pt-4 border-t border-gray-800">
            <p className="text-xs text-gray-600 text-center">
              DK BUILDING Administration Panel — Architecture GovTech
            </p>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default SettingsManager;
