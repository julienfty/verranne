window.addEventListener('scroll', function() {
    const revealSection = document.querySelector('.reveal-section');
    const revealFrame = document.querySelector('.reveal-frame');
    const revealOverlay = document.querySelector('.reveal-overlay');
    const siteHeader = document.querySelector('.site-header');
    const cercleLogo = document.querySelector('.cercle-logo-conteneur');
    const revealLogo = document.querySelector('.reveal-logo');
    const boutiqueSection = document.querySelector('.boutique-section');
    const boutiqueTitle = document.querySelector('.boutique-title');

    if (!revealSection || !revealFrame || !revealOverlay || !siteHeader) return;

    const sectionRect = revealSection.getBoundingClientRect();
    const sectionHeight = revealSection.offsetHeight;
    const visibleHeight = window.innerHeight;
    
    let scrollProgress = Math.max(0, Math.min(1, -sectionRect.top / (sectionHeight - visibleHeight)));

    let currentFrameHeightVh = 100 * (1 - scrollProgress);
    revealFrame.style.height = `${Math.max(0, currentFrameHeightVh)}vh`;

    // --- FLOU & LOGO ---
    if(cercleLogo) {
        let circleProgress = Math.min(1, scrollProgress / 0.3);
        let currentBlur = 1.8 * (1 - circleProgress);
        let currentMaskSize = 40 * (1 - circleProgress);
        let currentOpacity = 1 - circleProgress;
        cercleLogo.style.setProperty('--circle-blur', `${currentBlur}px`);
        cercleLogo.style.setProperty('--mask-size', `${currentMaskSize}%`);
        cercleLogo.style.setProperty('--circle-opacity', currentOpacity);
    }

    if(revealLogo) {
        let logoOpacity = 1 - (scrollProgress / 0.45);
        revealLogo.style.opacity = Math.max(0, Math.min(1, logoOpacity));
    }

    const effectProgress = scrollProgress / 0.5;
    const currentBlurOverlay = Math.min(15, effectProgress * 15);
    const currentOpacity = Math.min(0.25, effectProgress * 0.25);
    revealOverlay.style.backdropFilter = `blur(${currentBlurOverlay}px)`;
    revealOverlay.style.webkitBackdropFilter = `blur(${currentBlurOverlay}px)`;
    revealOverlay.style.backgroundColor = `rgba(0, 0, 0, ${currentOpacity})`;
    revealOverlay.style.opacity = 1;

    const frameHeightPx = (currentFrameHeightVh / 100) * window.innerHeight;

    // --- POSITIONS ---
    if (frameHeightPx > 0) {
        siteHeader.style.top = `${frameHeightPx + 10}px`;
        if (boutiqueTitle) boutiqueTitle.style.top = `${frameHeightPx + 90}px`;
        if (boutiqueSection) boutiqueSection.style.top = `${frameHeightPx + 160}px`;
    } else {
        siteHeader.style.top = `0px`;
        if (boutiqueTitle) boutiqueTitle.style.top = `80px`;
        if (boutiqueSection) boutiqueSection.style.top = `150px`;
    }

    // --- OPACITÉS STRICTEMENT SÉQUENTIELLES ---

    // 1. SITE HEADER : Apparition au tout début (entre 0.02 et 0.25)
    let headerOp = 0;
    if (scrollProgress > 0.27) {
        headerOp = Math.min(1, (scrollProgress - 0.27) / 0.3);
    }
    siteHeader.style.setProperty('opacity', headerOp, 'important');
    siteHeader.style.pointerEvents = headerOp > 0.1 ? 'auto' : 'none';

    // 2. BOUTIQUE TITLE : Apparition au milieu (entre 0.35 et 0.55)
    let titleOp = 0;
    if (scrollProgress > 0.45) {
        titleOp = Math.min(1, (scrollProgress - 0.45) / 0.2);
    }
    if (boutiqueTitle) {
        boutiqueTitle.style.setProperty('opacity', titleOp, 'important');
        boutiqueTitle.style.pointerEvents = titleOp > 0.1 ? 'auto' : 'none';
    }

    // 3. BOUTIQUE SECTION : Apparition à la fin (entre 0.65 et 0.85)
    let sectionOp = 0;
    if (scrollProgress > 0.55) {
        sectionOp = Math.min(1, (scrollProgress - 0.55) / 0.20);
    }
    if (boutiqueSection) {
        boutiqueSection.style.setProperty('opacity', sectionOp, 'important');
        boutiqueSection.style.pointerEvents = sectionOp > 0.1 ? 'auto' : 'none';
    }

    // Force tout à 1 si on est arrivé tout en bas
    if (scrollProgress >= 1) {
        siteHeader.style.setProperty('opacity', '1', 'important');
        siteHeader.style.pointerEvents = 'auto';
        if (boutiqueTitle) {
            boutiqueTitle.style.setProperty('opacity', '1', 'important');
            boutiqueTitle.style.pointerEvents = 'auto';
        }
        if (boutiqueSection) {
            boutiqueSection.style.setProperty('opacity', '1', 'important');
            boutiqueSection.style.pointerEvents = 'auto';
        }
    }
});
// --- ANIMATION DE SCROLL FLUIDE ET PERSONNALISÉE ---
const scrollIndicator = document.querySelector('.scroll-down-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', function() {
        const targetElement = document.getElementById('section-boutique');
        if (!targetElement) return;

        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 400; // Durée en millisecondes (1000ms = 1 seconde, augmente ou diminue selon tes envies)
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
            
            window.scrollTo(0, run);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        // Fonction d'accélération/décélération pour un effet visuel plus doux et naturel
        function easeInOutQuad(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    });
}
