export function initNavDropdown() {
    const dropdownBtn = document.getElementById("dropdownHoverButton");
    const dropdownMenu = document.getElementById("dropdownHover");
    const arrow = dropdownBtn?.querySelector("svg");

    if (!dropdownBtn || !dropdownMenu) return;

    dropdownBtn.addEventListener("click", (e) => {
        if (window.innerWidth < 768) {
            e.preventDefault();
            dropdownMenu.classList.toggle("hidden");
            arrow?.classList.toggle("rotate-180");
        }
    });

    document.addEventListener("click", (e) => {
        if (!dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.add("hidden");
            arrow?.classList.remove("rotate-180");
        }
    });
}