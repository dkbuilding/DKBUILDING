import React, { useRef, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Clock, Tag, Loader2, AlertCircle } from 'lucide-react';
import { useArticleAPI } from '../hooks/useNewsAPI';
import ReactMarkdown from 'react-markdown';
import { ImagePlaceholder, Footer } from '../components/ui';
import { calculateArticleReadingTime } from '../utils/readingTime';

const NewsDetail = () => {
  const { id } = useParams();
  const { article, loading, error } = useArticleAPI(parseInt(id));
  const footerRef = useRef(null);

  // Calculer le temps de lecture réel - TOUJOURS appeler les hooks avant les early returns
  const readingTime = useMemo(() => {
    return calculateArticleReadingTime(article);
  }, [article]);

  // Images désactivées - utilisation de placeholders uniquement
  const imageUrl = null;

  // Fonction helper pour formater la date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Date invalide';
      }
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Erreur de formatage de date:', error);
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dk-black flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-dk-yellow animate-spin mx-auto mb-4" />
            <p className="text-dk-gray-300 text-lg">Chargement de l'article...</p>
          </div>
        </div>
        <Footer ref={footerRef} />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-dk-black flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-foundation-bold text-white mb-2">Article non trouvé</h1>
            <p className="text-dk-gray-300 mb-6">{error || "L'article demandé n'existe pas ou n'est plus disponible."}</p>
            <Link
              to="/#news"
              className="btn-primary touch-target font-foundation-black inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour aux actualités
            </Link>
          </div>
        </div>
        <Footer ref={footerRef} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dk-black">
      {/* Header avec image - seulement si image présente */}
      <div className={`relative ${imageUrl ? 'h-[60vh] min-h-[400px]' : 'h-auto pt-32'} overflow-hidden`}>
        {imageUrl && (
          <div className="absolute inset-0">
            <ImagePlaceholder
              src={imageUrl}
              alt={article.title}
              placeholderText="Image à venir"
              imageProps={{
                className: "w-full h-full object-cover"
              }}
            />
          </div>
        )}
        
        {/* Overlay gradient - seulement si image présente */}
        {imageUrl && (
          <div className="absolute inset-0 bg-gradient-to-t from-dk-black via-dk-black/80 to-transparent" />
        )}
        
        {/* Contenu du header */}
        <div className="relative z-10 h-full flex flex-col justify-end">
          <div className="container-custom section-padding pb-16">
            {/* Bouton retour */}
            <Link
              to="/#news"
              className="mb-6 inline-flex items-center text-dk-yellow hover:text-yellow-300 transition-colors duration-300 group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-foundation-bold">Retour</span>
            </Link>

            {/* Catégorie et date */}
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-dk-yellow text-dk-black px-4 py-2 rounded-full text-sm font-foundation-bold uppercase tracking-wider">
                {article.category || 'Actualité'}
              </span>
              <div className="flex items-center text-dk-gray-300 text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                {formatDate(article.date)}
              </div>
              <div className="flex items-center text-dk-gray-300 text-sm">
                <Clock className="w-4 h-4 mr-2" />
                {readingTime}
              </div>
            </div>

            {/* Titre */}
            <h1 className="text-4xl xs:text-5xl sm:text-6xl lg:text-7xl font-foundation-black text-white mb-4">
              {article.title}
            </h1>

            {/* Extrait */}
            {article.excerpt && (
              <p className="text-xl text-dk-gray-300 max-w-3xl leading-relaxed">
                {article.excerpt}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container-custom section-padding py-16">
        <article className="max-w-4xl mx-auto">
          {/* Contenu markdown */}
          {article.content && (
            <div className="prose prose-invert prose-lg max-w-none mb-12">
              <ReactMarkdown
                components={{
                  h1: ({node: _node, ...props}) => <h1 className="text-4xl font-foundation-bold text-white mb-6" {...props} />,
                  h2: ({node: _node, ...props}) => <h2 className="text-3xl font-foundation-bold text-white mb-4 mt-8" {...props} />,
                  h3: ({node: _node, ...props}) => <h3 className="text-2xl font-foundation-bold text-white mb-3 mt-6" {...props} />,
                  p: ({node: _node, ...props}) => <p className="text-dk-gray-300 text-lg leading-relaxed mb-4" {...props} />,
                  img: ({node: _node, ...props}) => {
                    // Images désactivées - affichage du placeholder uniquement
                    return (
                      <div className="my-8 rounded-lg overflow-hidden">
                        <ImagePlaceholder
                          src={null}
                          alt={props.alt || article.title}
                          placeholderText="Image à venir"
                          imageProps={{
                            className: "w-full h-auto max-h-[600px] object-cover"
                          }}
                        />
                      </div>
                    );
                  },
                  a: ({node: _node, ...props}) => <a className="text-dk-yellow hover:text-yellow-300 underline" {...props} />,
                  ul: ({node: _node, ...props}) => <ul className="list-disc list-inside text-dk-gray-300 mb-4 space-y-2" {...props} />,
                  ol: ({node: _node, ...props}) => <ol className="list-decimal list-inside text-dk-gray-300 mb-4 space-y-2" {...props} />,
                  li: ({node: _node, ...props}) => <li className="text-lg" {...props} />,
                  strong: ({node: _node, ...props}) => <strong className="font-foundation-bold text-white" {...props} />,
                  em: ({node: _node, ...props}) => <em className="italic" {...props} />,
                  blockquote: ({node: _node, ...props}) => <blockquote className="border-l-4 border-dk-yellow pl-4 italic text-dk-gray-300 my-4" {...props} />,
                  code: ({node: _node, ...props}) => <code className="bg-dk-gray-900 px-2 py-1 rounded text-dk-yellow" {...props} />,
                  pre: ({node: _node, ...props}) => <pre className="bg-dk-gray-900 p-4 rounded-lg overflow-x-auto mb-4" {...props} />,
                }}
              >
                {article.content}
              </ReactMarkdown>
            </div>
          )}

          {/* Métadonnées */}
          <div className="border-t border-dk-gray-800 pt-8 mt-12">
            <div className="flex flex-wrap items-center gap-6 text-sm text-dk-gray-400">
              <div className="flex items-center">
                <Tag className="w-4 h-4 mr-2" />
                <span>Catégorie: {article.category || 'Actualité'}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Publié le {formatDate(article.date)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>{readingTime} de lecture</span>
              </div>
            </div>
          </div>

          {/* Bouton retour */}
          <div className="mt-12 text-center">
            <Link
              to="/#news"
              className="btn-primary touch-target font-foundation-black inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour aux actualités
            </Link>
          </div>
        </article>
      </div>

      {/* Footer */}
      <Footer ref={footerRef} />
    </div>
  );
};

export default NewsDetail;

