import { useState } from 'react';

/**
 * Composant ImagePlaceholder - Placeholder avec fond jaune dégradé
 * Affiche un placeholder avec fond jaune qui se masque automatiquement quand une image est chargée
 * 
 * @param {string} src - URL de l'image à charger
 * @param {string} alt - Texte alternatif pour l'image
 * @param {string} className - Classes CSS supplémentaires pour le conteneur
 * @param {string} placeholderText - Texte à afficher dans le placeholder (défaut: "Image à venir")
 * @param {object} imageProps - Props supplémentaires à passer à l'élément img
 */
const ImagePlaceholder = ({ 
  src, 
  alt, 
  className = '', 
  placeholderText = 'Image à venir',
  imageProps = {},
  onImageLoad,
  onImageError
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLoad = () => {
    setImageLoaded(true);
    if (onImageLoad) onImageLoad();
  };

  const handleError = () => {
    setImageError(true);
    if (onImageError) onImageError();
  };

  // Déterminer si le placeholder doit être visible
  const showPlaceholder = !imageLoaded || imageError || !src;

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Placeholder avec fond jaune - toujours présent dans le DOM */}
      <div 
        className={`absolute inset-0 z-[10] w-full h-full flex items-center justify-center transition-opacity duration-300 ${
          showPlaceholder ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ 
          background: 'linear-gradient(to bottom right, rgba(243, 231, 25, 0.2), rgba(253, 224, 71, 0.2))'
        }}
        aria-hidden={!showPlaceholder}
      >
        <span className="text-dk-gray-400 text-sm xs:text-base font-medium select-none">
          {placeholderText}
        </span>
      </div>

      {/* Image réelle - affichée seulement si src existe */}
      {src && !imageError && (
        <img
          src={src}
          alt={alt || placeholderText}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            imageLoaded ? 'opacity-100 z-[20]' : 'opacity-0 z-0'
          } ${imageProps.className || ''}`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          {...Object.fromEntries(Object.entries(imageProps).filter(([key]) => key !== 'className'))}
        />
      )}
    </div>
  );
};

export default ImagePlaceholder;

