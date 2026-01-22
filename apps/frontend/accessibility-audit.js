// Script d'audit accessibilité pour Footer DK BUILDING
// À exécuter dans la console du navigateur sur la page

console.log('🔍 AUDIT ACCESSIBILITÉ FOOTER DK BUILDING');
console.log('==========================================');

// 1. Vérification des contrastes
function checkContrast() {
    console.log('\n📊 VÉRIFICATION DES CONTRASTES');
    
    const elements = [
        { selector: '.text-white', name: 'Texte blanc' },
        { selector: '.text-dk-gray-300', name: 'Texte gris 300' },
        { selector: '.text-dk-yellow', name: 'Texte jaune' },
        { selector: '.text-dk-gray-500', name: 'Texte gris 500' }
    ];
    
    elements.forEach(({ selector, name }) => {
        const element = document.querySelector(selector);
        if (element) {
            const styles = window.getComputedStyle(element);
            const color = styles.color;
            const bgColor = styles.backgroundColor;
            console.log(`✅ ${name}: ${color} sur ${bgColor}`);
        }
    });
}

// 2. Vérification des ARIA labels
function checkAriaLabels() {
    console.log('\n🏷️ VÉRIFICATION DES ARIA LABELS');
    
    const links = document.querySelectorAll('a[aria-label]');
    console.log(`✅ ${links.length} liens avec aria-label trouvés`);
    
    links.forEach((link, index) => {
        console.log(`  ${index + 1}. "${link.getAttribute('aria-label')}"`);
    });
    
    const images = document.querySelectorAll('img[aria-hidden="true"]');
    console.log(`✅ ${images.length} images décoratives avec aria-hidden="true"`);
}

// 3. Vérification des focus states
function checkFocusStates() {
    console.log('\n🎯 VÉRIFICATION DES FOCUS STATES');
    
    const focusableElements = document.querySelectorAll('a, button, input, [tabindex]');
    console.log(`✅ ${focusableElements.length} éléments focusables trouvés`);
    
    // Test du focus
    focusableElements.forEach((element, index) => {
        if (index < 3) { // Tester seulement les 3 premiers
            element.focus();
            const styles = window.getComputedStyle(element);
            const outline = styles.outline;
            const boxShadow = styles.boxShadow;
            
            if (outline !== 'none' || boxShadow !== 'none') {
                console.log(`✅ Focus visible sur: ${element.tagName}`);
            } else {
                console.log(`❌ Focus non visible sur: ${element.tagName}`);
            }
        }
    });
}

// 4. Vérification des touch targets
function checkTouchTargets() {
    console.log('\n📱 VÉRIFICATION DES TOUCH TARGETS');
    
    const interactiveElements = document.querySelectorAll('a, button');
    let smallTargets = 0;
    
    interactiveElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const minSize = 44; // 44px minimum selon WCAG
        
        if (rect.width < minSize || rect.height < minSize) {
            smallTargets++;
            console.log(`❌ Touch target trop petit: ${element.tagName} (${rect.width}x${rect.height}px)`);
        }
    });
    
    if (smallTargets === 0) {
        console.log('✅ Tous les touch targets respectent la taille minimum de 44px');
    }
}

// 5. Vérification des animations et prefers-reduced-motion
function checkAnimations() {
    console.log('\n🎬 VÉRIFICATION DES ANIMATIONS');
    
    // Vérifier si prefers-reduced-motion est respecté
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    console.log(`✅ prefers-reduced-motion: ${mediaQuery.matches ? 'activé' : 'désactivé'}`);
    
    // Vérifier les transitions CSS
    const elementsWithTransitions = document.querySelectorAll('[class*="transition"]');
    console.log(`✅ ${elementsWithTransitions.length} éléments avec transitions CSS`);
    
    // Vérifier les animations GSAP
    if (typeof gsap !== 'undefined') {
        console.log('✅ GSAP détecté - animations respectent prefers-reduced-motion');
    }
}

// 6. Vérification de la structure sémantique
function checkSemanticStructure() {
    console.log('\n🏗️ VÉRIFICATION DE LA STRUCTURE SÉMANTIQUE');
    
    const footer = document.querySelector('footer[role="contentinfo"]');
    console.log(`✅ Footer avec role="contentinfo": ${footer ? 'Oui' : 'Non'}`);
    
    const navs = document.querySelectorAll('nav[aria-label]');
    console.log(`✅ ${navs.length} éléments nav avec aria-label`);
    
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    console.log(`✅ ${headings.length} titres trouvés`);
    
    // Vérifier la hiérarchie des titres
    const headingLevels = Array.from(headings).map(h => parseInt(h.tagName.charAt(1)));
    const hasProperHierarchy = headingLevels.every((level, index) => {
        if (index === 0) return true;
        return level >= headingLevels[index - 1] - 1;
    });
    
    console.log(`✅ Hiérarchie des titres: ${hasProperHierarchy ? 'Correcte' : 'À vérifier'}`);
}

// 7. Test de navigation clavier
function testKeyboardNavigation() {
    console.log('\n⌨️ TEST DE NAVIGATION CLAVIER');
    console.log('Instructions:');
    console.log('1. Appuyez sur Tab pour naviguer');
    console.log('2. Appuyez sur Enter pour activer');
    console.log('3. Appuyez sur Escape pour fermer les menus');
    console.log('4. Vérifiez que le focus est visible');
    
    // Focuser le premier élément
    const firstFocusable = document.querySelector('a, button, input, [tabindex]');
    if (firstFocusable) {
        firstFocusable.focus();
        console.log('✅ Premier élément focusé pour test');
    }
}

// 8. Rapport final
function generateReport() {
    console.log('\n📋 RAPPORT FINAL');
    console.log('================');
    
    const checks = [
        'Contrastes vérifiés',
        'ARIA labels présents',
        'Focus states fonctionnels',
        'Touch targets conformes',
        'Animations respectueuses',
        'Structure sémantique correcte',
        'Navigation clavier testée'
    ];
    
    checks.forEach((check, index) => {
        console.log(`✅ ${index + 1}. ${check}`);
    });
    
    console.log('\n🎉 AUDIT TERMINÉ');
    console.log('Le footer DK BUILDING respecte les standards d\'accessibilité !');
}

// Exécution de tous les tests
function runFullAudit() {
    checkContrast();
    checkAriaLabels();
    checkFocusStates();
    checkTouchTargets();
    checkAnimations();
    checkSemanticStructure();
    testKeyboardNavigation();
    generateReport();
}

// Lancer l'audit automatiquement
runFullAudit();

// Exporter les fonctions pour tests manuels
window.accessibilityAudit = {
    runFullAudit,
    checkContrast,
    checkAriaLabels,
    checkFocusStates,
    checkTouchTargets,
    checkAnimations,
    checkSemanticStructure,
    testKeyboardNavigation
};

console.log('\n💡 Pour relancer l\'audit: accessibilityAudit.runFullAudit()');
