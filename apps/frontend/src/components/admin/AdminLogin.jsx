import React, { useState, useEffect, useRef } from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import logoStructure from '../../assets/images/logos/Logo — DK BUILDING — Structure.png';
import { api } from '@/lib/api';

const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await api.post('/auth/login', { password });

      if (result.success) {
        toast.success('Acces autorise');
        if (onLogin) onLogin();
      } else {
        throw new Error('Authentification echouee');
      }
    } catch (error) {
      toast.error(error.message || 'Identifiants invalides');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center relative overflow-hidden">
      {/* Grid de fond — structure métallique */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `
          linear-gradient(90deg, #F3E719 1px, transparent 1px),
          linear-gradient(180deg, #F3E719 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
      }} />

      {/* Ligne diagonale décorative */}
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-[#F3E719]/20 via-transparent to-transparent"
        style={{ transform: 'translateX(-120px)' }} />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#F3E719]/10 to-transparent"
        style={{ transform: 'translateY(-200px)' }} />

      {/* Marquage de sécurité — haut gauche */}
      <div className={`absolute top-8 left-8 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-[#F3E719] rounded-full animate-pulse" />
          <span className="text-[11px] tracking-[0.3em] uppercase text-white/30 font-mono">
            Système sécurisé
          </span>
        </div>
      </div>

      {/* Version — bas droite */}
      <div className={`absolute bottom-8 right-8 transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <span className="text-[10px] tracking-[0.2em] uppercase text-white/15 font-mono">
          v2.0 — JWT-HS512
        </span>
      </div>

      {/* Carte de login */}
      <div className={`relative w-full max-w-[420px] mx-4 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

        {/* Barre supérieure jaune — marquage chantier */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#F3E719] to-transparent mb-8" />

        {/* Logo + Titre */}
        <div className="text-center mb-10">
          <div className={`inline-block mb-6 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
            <img
              src={logoStructure}
              alt="DK BUILDING"
              className="w-14 h-14 mx-auto"
            />
          </div>

          <h1 className="text-[22px] font-bold text-white tracking-tight mb-1">
            DK BUILDING
          </h1>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="h-px w-8 bg-white/10" />
            <span className="text-[10px] tracking-[0.35em] uppercase text-white/25 font-mono">
              Administration
            </span>
            <div className="h-px w-8 bg-white/10" />
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <label
              htmlFor="admin-password"
              className="block text-[11px] tracking-[0.2em] uppercase text-white/40 mb-3 font-mono"
            >
              Mot de passe
            </label>

            <div className="relative">
              {/* Bordure animée au focus */}
              <div className={`absolute -inset-px transition-all duration-300 ${
                isFocused
                  ? 'bg-gradient-to-r from-[#F3E719]/40 via-[#F3E719]/20 to-[#F3E719]/40'
                  : 'bg-white/5'
              }`} style={{ clipPath: 'inset(0 round 6px)' }} />

              <div className="relative flex items-center">
                <Lock className={`absolute left-4 w-4 h-4 transition-colors duration-300 ${
                  isFocused ? 'text-[#F3E719]' : 'text-white/20'
                }`} />
                <input
                  ref={inputRef}
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  required
                  placeholder="••••••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-[#111111] text-white placeholder-white/15 text-sm tracking-wider focus:outline-none rounded-md relative z-10"
                  autoFocus
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !password}
            className="group/btn w-full relative overflow-hidden py-4 bg-[#F3E719] text-[#0A0A0A] font-bold text-sm tracking-wide rounded-md transition-all duration-300 hover:shadow-[0_0_30px_rgba(243,231,25,0.15)] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0A0A0A] border-t-transparent rounded-full animate-spin" />
                  <span>Authentification...</span>
                </>
              ) : (
                <>
                  <span>Accéder au tableau de bord</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </>
              )}
            </span>

            {/* Effet de balayage au hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-700" />
          </button>
        </form>

        {/* Séparateur */}
        <div className="h-[1px] w-full bg-white/5 mt-8 mb-6" />

        {/* Info sécurité — minimaliste */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 bg-emerald-500/60 rounded-full" />
          <span className="text-[10px] tracking-[0.15em] text-white/20 font-mono">
            Chiffrement de bout en bout — Session 30 min
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
