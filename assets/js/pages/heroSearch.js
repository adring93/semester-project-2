const heroInput = document.getElementById("heroSearchInput");
const heroButton = document.getElementById("heroSearchButton");
const mainInput = document.getElementById("searchInput");

if (heroInput && heroButton && mainInput) {
    heroButton.addEventListener("click", () => {
        const term = heroInput.value.trim();
        mainInput.value = term;
        const event = new Event("input");
        mainInput.dispatchEvent(event);
        mainInput.scrollIntoView({ behavior: "smooth", block: "start" });
    });
}
