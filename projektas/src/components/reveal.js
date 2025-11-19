export function initScrollReveal() {
    const sections = document.querySelectorAll('.about-intro');
    if (!sections.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.25 }
    );

    sections.forEach(section => observer.observe(section));
}
