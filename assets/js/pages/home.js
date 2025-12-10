import { fetchListings } from "../api/listingApi.js";
import { renderListingCard } from "../ui/renderListingCard.js";

const listingGrid = document.getElementById("listingGrid");
const loadingEl = document.getElementById("loading");
const noResultsEl = document.getElementById("noResults");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const resetFiltersBtn = document.getElementById("resetFiltersBtn");
const activeCountEl = document.getElementById("activeCount");

const statListingsEl = document.getElementById("statListings");
const statBidsEl = document.getElementById("statBids");
const statAvgBidsEl = document.getElementById("statAvgBids");
const statUniqueSellersEl = document.getElementById("statUniqueSellers");

const categoryButtons = document.querySelectorAll(".category-pill");

const PAGE_SIZE = 8;

let allListings = [];
let filteredListings = [];
let visibleCount = 0;
let currentCategory = null;

function setLoading(isLoading) {
    if (!loadingEl) return;
    loadingEl.classList.toggle("hidden", !isLoading);
}

function clearGrid() {
    if (!listingGrid) return;
    listingGrid.innerHTML = "";
}

function getSearchTerm() {
    if (!searchInput) return "";
    return searchInput.value.trim().toLowerCase();
}

function applyFilters() {
    const term = getSearchTerm();
    const sort = sortSelect ? sortSelect.value : "ending-soon";

    let result = [...allListings];

    if (currentCategory) {
        const tag = currentCategory.toLowerCase();
        result = result.filter((item) => {
            const tags = Array.isArray(item.tags) ? item.tags : [];
            return tags.some((t) => String(t).toLowerCase() === tag);
        });
    }

    if (term) {
        result = result.filter((item) => {
            const title = (item.title || "").toLowerCase();
            const desc = (item.description || "").toLowerCase();
            return title.includes(term) || desc.includes(term);
        });
    }

    if (sort === "ending-soon") {
        result.sort((a, b) => new Date(a.endsAt) - new Date(b.endsAt));
    } else if (sort === "newest") {
        result.sort((a, b) => new Date(b.created) - new Date(a.created));
    } else if (sort === "oldest") {
        result.sort((a, b) => new Date(a.created) - new Date(b.created));
    } else if (sort === "title") {
        result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }

    filteredListings = result;
    visibleCount = 0;
    updateNoResultsState();
    updateStats();
}

function renderNextPage() {
    if (!listingGrid) return;

    const remaining = filteredListings.length - visibleCount;
    if (remaining <= 0) {
        if (loadMoreBtn) loadMoreBtn.classList.add("hidden");
        return;
    }

    const toShow = filteredListings.slice(visibleCount, visibleCount + PAGE_SIZE);
    toShow.forEach((listing) => {
        const card = renderListingCard(listing);
        listingGrid.appendChild(card);
    });

    visibleCount += toShow.length;

    if (visibleCount >= filteredListings.length) {
        if (loadMoreBtn) loadMoreBtn.classList.add("hidden");
    } else {
        if (loadMoreBtn) loadMoreBtn.classList.remove("hidden");
    }
}

function updateNoResultsState() {
    if (!noResultsEl) return;
    const hasResults = filteredListings.length > 0;
    noResultsEl.classList.toggle("hidden", hasResults);
}

function updateStats() {
    const totalListings = filteredListings.length;
    let totalBids = 0;
    const sellerNames = new Set();

    filteredListings.forEach((item) => {
        if (Array.isArray(item.bids)) {
            totalBids += item.bids.length;
        } else if (item._count && typeof item._count.bids === "number") {
            totalBids += item._count.bids;
        }
        if (item.seller && item.seller.name) {
            sellerNames.add(item.seller.name);
        }
    });

    const avgBids = totalListings > 0 ? totalBids / totalListings : 0;

    if (statListingsEl) statListingsEl.textContent = String(totalListings);
    if (statBidsEl) statBidsEl.textContent = String(totalBids);
    if (statAvgBidsEl) statAvgBidsEl.textContent = avgBids.toFixed(1);
    if (statUniqueSellersEl) statUniqueSellersEl.textContent = String(sellerNames.size);
}

function setActiveCategoryButton() {
    categoryButtons.forEach((btn) => {
        const value = btn.getAttribute("data-category");
        if (currentCategory && value === currentCategory) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
}

async function initHomePage() {
    if (!listingGrid) return;

    setLoading(true);
    clearGrid();
    if (noResultsEl) noResultsEl.classList.add("hidden");
    if (loadMoreBtn) loadMoreBtn.classList.add("hidden");

    try {
        const response = await fetchListings();
        const data = Array.isArray(response) ? response : response.data || [];
        allListings = data;

        if (activeCountEl) {
            activeCountEl.textContent = `${allListings.length} active`;
        }

        applyFilters();
        clearGrid();
        renderNextPage();
    } catch (error) {
        if (noResultsEl) {
            noResultsEl.textContent = "Could not load listings.";
            noResultsEl.classList.remove("hidden");
        }
    } finally {
        setLoading(false);
    }
}

if (searchInput) {
    searchInput.addEventListener("input", () => {
        applyFilters();
        clearGrid();
        renderNextPage();
    });
}

if (sortSelect) {
    sortSelect.addEventListener("change", () => {
        applyFilters();
        clearGrid();
        renderNextPage();
    });
}

if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
        renderNextPage();
    });
}

if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener("click", () => {
        if (searchInput) searchInput.value = "";
        currentCategory = null;
        setActiveCategoryButton();
        applyFilters();
        clearGrid();
        renderNextPage();
    });
}

if (categoryButtons.length > 0) {
    categoryButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const value = btn.getAttribute("data-category");
            if (currentCategory === value) {
                currentCategory = null;
            } else {
                currentCategory = value;
            }
            setActiveCategoryButton();
            applyFilters();
            clearGrid();
            renderNextPage();
        });
    });
}

initHomePage();
