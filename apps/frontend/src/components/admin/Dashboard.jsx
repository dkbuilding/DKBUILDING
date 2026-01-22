import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FileText,
  FolderKanban,
  Image,
  Activity,
  TrendingUp,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { api } from "../../lib/api";

const Dashboard = () => {
  // Récupération automatique avec gestion de cache (5 minutes)
  const {
    data: stats,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => api.get("/admin/stats").then((res) => res.data),
    staleTime: 1000 * 60 * 5, // Cache valide 5 min
  });

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin text-[#F3E719]" />
          <p>Analyse des données en temps réel...</p>
        </div>
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 flex items-center gap-4 text-red-400">
          <AlertCircle className="w-6 h-6" />
          <div>
            <h3 className="font-bold">Erreur de connexion</h3>
            <p className="text-sm">
              Impossible de charger les statistiques. Vérifiez votre connexion
              ou les droits administrateur.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Annonces",
      value: stats.annonces?.total || 0,
      subtitle: `${stats.annonces?.publiees || 0} publiées`,
      icon: FileText,
      color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    {
      title: "Projets",
      value: stats.projets?.total || 0,
      subtitle: `${stats.projets?.termines || 0} terminés`,
      icon: FolderKanban,
      color: "bg-green-500/10 text-green-400 border-green-500/20",
    },
    {
      title: "Médias",
      value: stats.medias?.total || 0,
      subtitle: stats.medias?.totalSizeFormatted || "0 Bytes",
      icon: Image,
      color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    },
    {
      title: "Logs récents",
      value: stats.logs?.recent || 0,
      subtitle: `${stats.logs?.total || 0} au total`,
      icon: Activity,
      color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    },
  ];

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Tableau de bord</h1>
        <p className="text-gray-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Système opérationnel • Version GovTech 1.0
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg border ${card.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <TrendingUp className="w-5 h-5 text-gray-600 group-hover:text-[#F3E719] transition-colors" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">
                {card.value}
              </h3>
              <p className="text-sm text-gray-400 font-medium">{card.title}</p>
              <p className="text-xs text-gray-500 mt-2 font-mono">
                {card.subtitle}
              </p>
            </div>
          );
        })}
      </div>

      {/* DETAIL SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Annonces Details */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            État des Annonces
          </h2>
          <div className="space-y-4">
            <StatRow label="Total" value={stats.annonces?.total} />
            <StatRow
              label="Publiées"
              value={stats.annonces?.publiees}
              color="text-green-400"
            />
            <StatRow
              label="Brouillons"
              value={stats.annonces?.brouillon}
              color="text-yellow-400"
            />
          </div>
        </div>

        {/* Projets Details */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-green-400" />
            Suivi des Chantiers
          </h2>
          <div className="space-y-4">
            <StatRow label="Total Projets" value={stats.projets?.total} />
            <StatRow
              label="Terminés"
              value={stats.projets?.termines}
              color="text-green-400"
            />
            <StatRow
              label="En cours"
              value={stats.projets?.en_cours}
              color="text-blue-400"
            />
            <StatRow
              label="⭐ Mis en avant"
              value={stats.projets?.featured}
              color="text-[#F3E719]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant utilitaire pour les lignes
const StatRow = ({ label, value, color = "text-white" }) => (
  <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg hover:bg-black/40 transition-colors">
    <span className="text-gray-400 text-sm">{label}</span>
    <span className={`font-bold font-mono ${color}`}>{value || 0}</span>
  </div>
);

export default Dashboard;
