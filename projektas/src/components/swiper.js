export function initSwiper() {
    const slider = document.querySelector('[data-slider="projects"]');
    if (!slider) return;

    const track = slider.querySelector('[data-slider-track]');
    const prevBtn = slider.querySelector('[data-slider-prev]');
    const nextBtn = slider.querySelector('[data-slider-next]');
    const dotsWrapper = slider.parentElement.querySelector('[data-slider-dots]');

    // originalūs elementai iš HTML
    const originalSlides = Array.from(track.children);

    const state = {
        index: 0,             // dabartinis indeksas (su klonais)
        perView: 1,           // kiek kortelių rodome
        gap: 16,              // tarpas tarp kortelių
        slideWidth: 0,
        sideOffset: 0,        // kiek nuo kairės paliekam, kad centras būtų centre
        autoplayMs: 4000,
        autoplayId: null,
        realCount: originalSlides.length,
        total: 0,             // su klonais
        maxCard: 350          // kortelės nebus platesnės už šitą
    };

    // --- 1. breakpoint'ai logika ---
    function getPerView() {
        const width = window.innerWidth;
        if (width >= 1420) return 5;
        if (width >= 1030) return 4;
        if (width >= 770) return 3;
        if (width >= 370) return 2;
        return 1;
    }

    // --- 2. pastatom track'ą su klonais ---
    function buildTrack() {
        track.innerHTML = '';

        const n = state.perView;

        // klonai iš galo į pradžią
        const headClones = originalSlides.slice(-n).map((node) => {
            const c = node.cloneNode(true);
            c.dataset.clone = 'head';
            return c;
        });

        // klonai iš pradžios į galą
        const tailClones = originalSlides.slice(0, n).map((node) => {
            const c = node.cloneNode(true);
            c.dataset.clone = 'tail';
            return c;
        });

        const allSlides = [...headClones, ...originalSlides, ...tailClones];
        allSlides.forEach((el) => track.appendChild(el));

        state.total = allSlides.length;
        state.index = n; // visada pradedam nuo pirmo realaus
    }

    // --- 3. išdėstymas pagal lango plotį ---
    function layout() {
        state.perView = getPerView();

        // tarpas pagal kiek rodome
        if (state.perView <= 2) state.gap = 12;
        else if (state.perView === 3) state.gap = 16;
        else if (state.perView === 4) state.gap = 18;
        else state.gap = 18;

        // perstatom klonus pagal naują perView
        buildTrack();

        const windowEl = slider.querySelector('.slider-window');
        const containerWidth = windowEl.clientWidth;

        // bendra reikalinga vieta kortelėms
        // widthForCards = cards + gaps
        // kortelės plotį ribojam maxCard, kad dideliuose ekranuose nebūtų milžiniškos
        const rawWidth = (containerWidth - state.gap * (state.perView - 1)) / state.perView;
        const cardWidth = Math.min(rawWidth, state.maxCard);
        state.slideWidth = cardWidth;

        // jeigu kortelės mažesnės nei galėtume užpildyti langą,
        // centrui reikia padėti "šoninių" px
        const totalSlidesWidth = cardWidth * state.perView + state.gap * (state.perView - 1);
        const sideOffset = Math.max((containerWidth - totalSlidesWidth) / 2, 0);
        state.sideOffset = sideOffset;

        // pritaikom visoms (su klonais)
        const allSlides = Array.from(track.children);
        allSlides.forEach((slide) => {
            slide.style.flex = `0 0 ${cardWidth}px`;
            slide.style.width = `${cardWidth}px`;
            slide.style.minWidth = `${cardWidth}px`;
            slide.style.maxWidth = `${cardWidth}px`;
        });

        // track stiliai
        track.style.display = 'flex';
        track.style.gap = `${state.gap}px`;
        track.style.flexWrap = 'nowrap';
        track.style.transition = 'transform .45s ease';

        // dots iš naujo
        buildDots();

        // perstumiam į tinkamą poziciją
        jumpTo(state.index);
    }

    // --- 4. dots ---
    function buildDots() {
        if (!dotsWrapper) return;
        dotsWrapper.innerHTML = '';

        for (let i = 0; i < state.realCount; i++) {
            const dot = document.createElement('button');
            if (i === 0) dot.classList.add('is-active');
            dot.addEventListener('click', () => {
                goToReal(i);
                restartAutoplay();
            });
            dotsWrapper.appendChild(dot);
        }
    }

    function updateDots() {
        if (!dotsWrapper) return;
        const dots = dotsWrapper.querySelectorAll('button');
        dots.forEach((d) => d.classList.remove('is-active'));
    
        // Realiai matoma pirmos kortelės pozicija (be klonų)
        const n = state.perView;
        let realIdx = (state.index - n) % state.realCount;
    
        // Kai pasisuka per klonus, % duoda neigiamą reikšmę – pataisom:
        if (realIdx < 0) realIdx += state.realCount;
    
        dots[realIdx]?.classList.add('is-active');
    }    

    // --- 5. transform skaičiavimas ---
    function applyTransform(idx, withTransition = true) {
        const step = state.slideWidth + state.gap;
        // kiek "realios" zonos turim prieš pirmą realų
        // pradedam nuo sideOffset, o paskui slenkam po step
        const firstRealIndex = state.perView;
        const offsetSlides = idx - firstRealIndex;
        const translate = -(state.sideOffset + offsetSlides * step);

        if (!withTransition) {
            track.style.transition = 'none';
            track.style.transform = `translateX(${translate}px)`;
            void track.offsetWidth;
            track.style.transition = 'transform .45s ease';
        } else {
            track.style.transform = `translateX(${translate}px)`;
        }
        updateDots();
    }

    function jumpTo(idx) {
        state.index = idx;
        applyTransform(idx, false);
        updateDots();
    }

    function goToReal(realIdx) {
        const target = state.perView + realIdx;
        state.index = target;
        applyTransform(state.index, true);
    }

    function next() {
        state.index += 1;
        applyTransform(state.index, true);
    }

    function prev() {
        state.index -= 1;
        applyTransform(state.index, true);
    }

    // --- 6. loop per klonus ---
    track.addEventListener('transitionend', () => {
        const n = state.perView;
        // nuėjom už realios pabaigos – grąžinam į realią pradžią
        if (state.index >= n + state.realCount) {
            jumpTo(n);
        }
        // nuėjom į galinius klonus – grąžinam į realų galą
        if (state.index < n) {
            jumpTo(n + state.realCount - 1);
        }
    });

    // --- 7. autoplay ---
    function startAutoplay() {
        if (state.autoplayId) return;
        state.autoplayId = setInterval(() => {
            // jei pelė dabar virš sliderio – nieko nedarom
            if (state.isPointerOver) return;
            next();
        }, state.autoplayMs);
    }

    function stopAutoplay() {
        if (!state.autoplayId) return;
        clearInterval(state.autoplayId);
        state.autoplayId = null;
    }

    function restartAutoplay() {
        stopAutoplay();
        startAutoplay();
    }
          // --- 8. eventai ---
        nextBtn?.addEventListener('click', () => {
            next();
            restartAutoplay();
        });
    
        prevBtn?.addEventListener('click', () => {
            prev();
            restartAutoplay();
        });
    
        // vėliava: ar pelė virš sliderio
        state.isPointerOver = false;
    
        // kai tik pelė įeina į sliderį – nustatom vėliavą ir sustabdom
        slider.addEventListener('mouseenter', () => {
            state.isPointerOver = true;
            stopAutoplay();
        });
    
        // kai pelė išeina – nuimam vėliavą ir vėl paleidžiam
        slider.addEventListener('mouseleave', () => {
            state.isPointerOver = false;
            startAutoplay();
        });
    
        // papildomai: jei užvedi ant kortelės / overlay (išlendantis tekstas)
        slider.addEventListener('mouseover', (e) => {
            if (e.target.closest('.project-card') || e.target.closest('.project-meta')) {
                state.isPointerOver = true;
                stopAutoplay();
            }
        });
    
        slider.addEventListener('mouseout', (e) => {
            // išeinam iš sliderio visai
            if (!slider.contains(e.relatedTarget)) {
                state.isPointerOver = false;
                startAutoplay();
            }
        });
    
        window.addEventListener('resize', layout);

    // --- 9. init ---
    layout();
    startAutoplay();
}
