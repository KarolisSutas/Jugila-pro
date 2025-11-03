export function initScrollReveal() {
    const aboutSection = document.querySelector('.about-intro');
    if (!aboutSection) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    aboutSection.classList.add('in-view');
                    // jei nenori kartotinio paleidimo — atjungi
                    observer.unobserve(aboutSection);
                }
            });
        },
        {
            threshold: 0.25, // kai 25% sekcijos matosi ekrane
        }
    );

    observer.observe(aboutSection);
}
