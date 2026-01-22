import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Footer from '../../components/ui/Footer';
import ShapeTop from '../../components/ui/ShapeTop';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { useMarkdownContent } from '../../hooks/useMarkdownContent';

gsap.registerPlugin(ScrollTrigger);

const PolitiqueConfidentialite = () => {
  const pageRef = useRef(null);
  const footerRef = useRef(null);
  const { content, loading, error } = useMarkdownContent('/legal/PolitiqueConfidentialite.md');

  // Animation du header (breadcrumb, bouton, titre) - se déclenche immédiatement
  useEffect(() => {
    if (!pageRef.current) return;
    
    const ctx = gsap.context(() => {
      // Animation d'entrée du header
      const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.8 }});
      
      tl.from(".breadcrumb-nav", { y: 20, opacity: 0, duration: 0.6 })
        .from(".page-title", { y: 30, opacity: 0 }, "-=0.2");
    }, pageRef);

    return () => ctx.revert();
  }, []);

  // Animation du contenu - se déclenche quand le contenu est chargé
  useEffect(() => {
    if (!pageRef.current || !content) return;
    
    const ctx = gsap.context(() => {
      // Animation d'entrée des sections de contenu
      const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.8 }});
      
      tl.from(".content-section", { y: 20, opacity: 0 }, "-=0.4");

      // Animation au scroll pour les sections
      gsap.utils.toArray(".content-section").forEach((section) => {
        gsap.fromTo(section, 
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    }, pageRef);

    return () => ctx.revert();
  }, [content]);

  // Fonction pour transformer le contenu Markdown et ajouter des wrappers de section
  const processMarkdownContent = (markdown) => {
    // Diviser le contenu par les h2 (##)
    const sections = markdown.split(/(?=^## )/gm);
    
    return sections.map((section) => {
      if (!section.trim()) return null;
      
      // Détecter les sections spéciales qui nécessitent un fond spécial
      const isResponsableSection = section.includes('## Responsable du traitement');
      const isContactSection = section.includes('## Contact');
      const hasLastUpdate = section.includes('**Dernière mise à jour :**');
      
      // Extraire le titre h2 pour déterminer le style
      const h2Match = section.match(/^## (.+)$/m);
      const sectionTitle = h2Match ? h2Match[1] : '';
      
      // Séparer la section contact de la dernière mise à jour si présente
      let mainContent = section;
      let lastUpdateContent = '';
      
      if (hasLastUpdate) {
        const parts = section.split(/^---$/m);
        if (parts.length > 1) {
          mainContent = parts[0];
          lastUpdateContent = parts.slice(1).join('---');
        }
      }
      
      // Wrapper avec classe content-section pour les animations GSAP
      return (
        <div key={sectionTitle}>
          <div className="content-section mb-12">
            {isResponsableSection ? (
              <div>
                <h2 className="text-3xl font-foundation-black text-gray-900 mb-6 uppercase">{sectionTitle}</h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={markdownComponents}
                  >
                    {mainContent.replace(/^## .+$/m, '')}
                  </ReactMarkdown>
                </div>
              </div>
            ) : isContactSection ? (
              <div>
                <h2 className="text-3xl font-foundation-black text-white mb-6 uppercase">{sectionTitle}</h2>
                <div className="bg-dk-yellow p-6 rounded-lg">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={markdownComponents}
                  >
                    {mainContent.replace(/^## .+$/m, '')}
                  </ReactMarkdown>
                </div>
              </div>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {mainContent}
              </ReactMarkdown>
            )}
          </div>
          
          {/* Section dernière mise à jour */}
          {lastUpdateContent && (
            <div className="content-section">
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    ...markdownComponents,
                    p: ({ children }) => (
                      <p className="text-gray-600 text-sm">{children}</p>
                    ),
                  }}
                >
                  {lastUpdateContent}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      );
    });
  };

  // Fonction pour transformer les numéros de téléphone en liens tel:
  const transformPhoneNumbers = (text) => {
    if (typeof text !== 'string') return text;
    
    // Pattern pour détecter les numéros de téléphone français (avec ou sans +33)
    // Format: +33 X XX XX XX XX ou 0X XX XX XX XX
    const phonePattern = /(\+33\s*[1-9](?:\s*\d{2}){4}|0[1-9](?:\s*\d{2}){4})/g;
    
    const parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = phonePattern.exec(text)) !== null) {
      // Vérifier le contexte avant le match pour exclure les identifiants d'entreprise
      const contextBefore = text.substring(Math.max(0, match.index - 30), match.index).toLowerCase();
      
      // Exclure si c'est un numéro de TVA Intracommunautaire (précédé de "FR")
      if (text.substring(Math.max(0, match.index - 2), match.index) === 'FR') {
        continue;
      }
      
      // Exclure si c'est dans un contexte d'identifiant d'entreprise
      if (contextBefore.includes('tva') || 
          contextBefore.includes('siret') || 
          contextBefore.includes('siren') || 
          contextBefore.includes('intracommunautaire') || 
          contextBefore.includes('r.c.s.') || 
          contextBefore.includes('r.c.s') ||
          contextBefore.includes('siret :') ||
          contextBefore.includes('siren :') ||
          contextBefore.includes('tva :')) {
        continue;
      }
      
      // Vérifier que ce n'est pas un identifiant d'entreprise (SIRET/SIREN)
      const phoneNumber = match[0];
      const cleanPhone = phoneNumber.replace(/\s+/g, '');
      
      // Si c'est un numéro de 9 ou 14 chiffres sans espaces, c'est probablement un SIREN/SIRET
      // Un numéro de téléphone français a généralement 10 chiffres (sans le +33)
      if (cleanPhone.length === 9 || cleanPhone.length === 14) {
        continue;
      }
      
      // Ajouter le texte avant le numéro
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      // Créer le lien tel: avec le numéro nettoyé (sans espaces)
      const telLink = cleanPhone.startsWith('0') ? `tel:+33${cleanPhone.substring(1)}` : `tel:${cleanPhone}`;
      
      parts.push(
        <a key={`phone-${match.index}`} href={telLink} className="underline">
          {phoneNumber}
        </a>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Ajouter le reste du texte
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    return parts.length > 0 ? parts : text;
  };

  // Fonction pour transformer le texte et appliquer les styles à "DK BUILDING"
  const transformDKBuilding = (children) => {
    // Fonction récursive pour transformer les chaînes
    const transformString = (str) => {
      if (typeof str !== 'string') return str;
      const parts = str.split(/(DK BUILDING)/gi);
      return parts.map((part, idx) => {
        if (part.toUpperCase() === 'DK BUILDING') {
          return (
            <span key={`dk-building-${idx}`} className="font-foundation text-dk-yellow font-bold">
              {part}
            </span>
          );
        }
        return part;
      });
    };

    // Si c'est une chaîne simple
    if (typeof children === 'string') {
      return transformString(children);
    }
    
    // Si c'est un tableau
    if (Array.isArray(children)) {
      return children.flatMap((child, idx) => {
        if (typeof child === 'string') {
          return transformString(child);
        }
        // Si c'est un élément React, on clone et transforme les enfants
        if (child && typeof child === 'object' && 'props' in child && child.props?.children) {
          return {
            ...child,
            key: child.key || `transformed-${idx}`,
            props: {
              ...child.props,
              children: transformDKBuilding(child.props.children),
            },
          };
        }
        return child;
      });
    }
    
    // Si c'est un élément React avec des enfants
    if (children && typeof children === 'object' && 'props' in children && children.props?.children) {
      return {
        ...children,
        props: {
          ...children.props,
          children: transformDKBuilding(children.props.children),
        },
      };
    }
    
    return children;
  };

  // Fonction pour personnaliser les composants Markdown
  const markdownComponents = {
    h1: ({ children }) => (
      <h1 className="page-title text-4xl md:text-6xl font-foundation-black text-dk-yellow mb-6 uppercase">
        {transformDKBuilding(children)}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-foundation-black text-gray-900 mb-6 uppercase">{transformDKBuilding(children)}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-foundation-bold text-gray-900 mb-3">{transformDKBuilding(children)}</h3>
    ),
    p: ({ children }) => {
      const text = String(children);
      // Transformer les numéros de téléphone en liens tel: avant de transformer DK BUILDING
      const transformedChildren = typeof children === 'string' 
        ? transformPhoneNumbers(children)
        : Array.isArray(children)
        ? children.map(child => typeof child === 'string' ? transformPhoneNumbers(child) : child)
        : children;
      
      if (text.includes('**Email :**') || text.includes('**Téléphone :**') || text.includes('**Adresse :**') || text.includes('**Délégué à la protection des données :**')) {
        return (
          <p className="text-gray-700 mb-2">{transformDKBuilding(transformedChildren)}</p>
        );
      }
      return (
        <p className="mb-4 text-gray-700">{transformDKBuilding(transformedChildren)}</p>
      );
    },
    a: ({ href, children }) => {
      const isEmail = href?.startsWith('mailto:');
      const isPhone = href?.startsWith('tel:');
      return (
        <a
          href={href}
          className="underline"
          {...(isEmail || isPhone ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
        >
          {transformDKBuilding(children)}
        </a>
      );
    },
    ul: ({ children }) => (
      <ul className="list-disc pl-6 mb-4 text-gray-700">{transformDKBuilding(children)}</ul>
    ),
    li: ({ children }) => (
      <li className="mb-2">{transformDKBuilding(children)}</li>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold">{transformDKBuilding(children)}</strong>
    ),
    hr: () => (
      <hr className="my-8 border-gray-300" />
    ),
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">Erreur: {error}</div>
      </div>
    );
  }

  // Extraire le titre et la description du Markdown
  const lines = content.split('\n');
  const title = lines[0].replace(/^# /, '');
  const description = lines[2] || '';

  // Contenu sans le titre et la description (déjà affichés dans le Hero)
  const markdownContent = lines.slice(3).join('\n');
  
  // Traiter le contenu pour ajouter les wrappers de section
  const processedContent = processMarkdownContent(markdownContent);

  return (
    <div ref={pageRef} className="min-h-screen">
      <main className="pt-20 transition-all duration-300 relative bg-black">
        {/* SVG ShapeTop en haut - fixé au milieu avec fondu noir en bas */}
        <div className="absolute top-0 left-0 right-0 flex justify-center items-start pointer-events-none overflow-hidden" style={{ zIndex: 1, height: '475px' }}>
          <div className="scale-150 origin-top relative" style={{ width: '2698px', maxWidth: 'none' }}>
            <ShapeTop color="#F3E719" opacity={0.16} />
            {/* Overlay avec gradient noir pour créer le fondu - adapté à la fin du ShapeTop */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, transparent 0%, transparent 50%, rgba(0,0,0,0.1) 70%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0.6) 92%, rgba(0,0,0,0.9) 97%, rgba(0,0,0,1) 100%)'
              }}
            />
          </div>
        </div>
        
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-black via-gray-900 to-black py-32 md:py-40 lg:py-48 relative overflow-hidden min-h-fit h-full">
          
          <div className="container mx-auto px-6 relative z-10">
            {/* Breadcrumb */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-3">
              <Breadcrumb
                className="breadcrumb-nav"
                items={[
                  { label: 'Accueil', path: '/' },
                  { label: 'Politique de confidentialité', path: '/legal/politique-confidentialite' },
                ]}
              />
            </div>
            
            <h1 className="page-title text-4xl md:text-6xl font-foundation-black text-dk-yellow mb-6 uppercase">
              {title}
            </h1>
            <p className="text-xl text-white max-w-3xl font-foundation font-foundation-bold">
              {description}
            </p>
          </div>
        </section>

        {/* Contenu principal */}
        <section className="py-16 dk-perspective-grid">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="prose prose-lg max-w-none dk-perspective-content">
              {processedContent}
            </div>
          </div>
        </section>
      </main>

      <Footer ref={footerRef} className="transition-all duration-300" />
    </div>
  );
};

export default PolitiqueConfidentialite;
