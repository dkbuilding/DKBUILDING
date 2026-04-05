/**
 * Composant NoiseOverlay pour améliorer la netteté des vidéos
 * Utilise des techniques CSS avancées pour créer un effet de noise subtil
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.variant - Variante de l'overlay ('primary', 'svg', 'hd')
 * @param {string} props.intensity - Intensité de l'overlay ('subtle', 'medium', 'strong')
 * @param {string} props.color - Couleur de l'overlay ('default', 'warm', 'cool')
 * @param {boolean} props.animated - Active l'animation subtile
 * @param {string} props.className - Classes CSS supplémentaires
 * @param {Object} props.style - Styles inline supplémentaires
 */
const NoiseOverlay = ({ 
    variant = 'primary', 
    intensity = 'medium', 
    color = 'default', 
    animated = false,
    className = '',
    style = {},
    ...props 
}) => {
    // Construction des classes CSS
    const baseClasses = 'absolute inset-0 pointer-events-none';
    const variantClass = `noise-overlay-${variant}`;
    const intensityClass = `noise-overlay-${intensity}`;
    const colorClass = color !== 'default' ? `noise-overlay-${color}` : '';
    const animatedClass = animated ? 'noise-overlay-animated' : '';
    
    const classes = [
        baseClasses,
        variantClass,
        intensityClass,
        colorClass,
        animatedClass,
        className
    ].filter(Boolean).join(' ');

    return (
        <div 
        className={classes}
        style={style}
        {...props}
        />
    );
};

export default NoiseOverlay;
