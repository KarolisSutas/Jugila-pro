export function initNavDropdown() {
    const dropdownBtn = document.getElementById("dropdownHoverButton");
    const dropdownMenu = document.getElementById("dropdownHover");

    if (!dropdownBtn || !dropdownMenu) return;

    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
        dropdownBtn.addEventListener("click", (e) => {
            e.preventDefault();
            dropdownMenu.classList.toggle("hidden");
        });

        document.addEventListener("click", (e) => {
            if (!dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.add("hidden");
            }
        });
    }
}
