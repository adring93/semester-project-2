import { fetchListingById, placeBid } from "../api/listingApi.js";
import { getAuth } from "../storage/authStorage.js";

const listingLoading = document.getElementById("listingLoading");
const listingContent = document.getElementById("listingContent");
const listingSection = document.getElementById("listingDetails");

const imgEl = document.getElementById("listingImage");
const titleEl = document.getElementById("listingTitle");
const descEl = document.getElementById("listingDescription");
const sellerEl = document.getElementById("listingSeller");
const endsEl = document.getElementById("listingEnds");
const bidCountEl = document.getElementById("listingBidCount");
const highestBidEl = document.getElementById("listingHighestBid");

const bidsList = document.getElementById("bidsList");
const noBidsMessage = document.getElementById("noBidsMessage");

const bidForm = document.getElementById("bidForm");
const bidInput = document.getElementById("bidAmount");
const bidError = document.getElementById("bidError");
const bidInfo = document.getElementById("bidInfoMessage");

let listing = null;

function getQueryId() {
    return new URLSearchParams(location.search).get("id");
}

function toggleLoading(show) {
    listingLoading.classList.toggle("hidden", !show);
    listingContent.classList.toggle("hidden", show);
}

function fmt(d) {
    const date = new Date(d);
    return Number.isNaN(date) ? "" : date.toLocaleString();
}

function highestBid(listing) {
    if (!Array.isArray(listing.bids)) return 0;
    return listing.bids.reduce((max, b) => (b.amount > max ? b.amount : max), 0);
}

function showNotFound(msg) {
    listingSection.innerHTML = `
        <div class="listing-error-box">
            <p>${msg}</p>
            <p><a href="index.html">Go back</a></p>
        </div>
    `;
}

function renderListing(data) {
    listing = data;

    const media = Array.isArray(data.media) ? data.media : [];
    const first = media[0];

    imgEl.src = first?.url || "assets/img/placeholders/listing-placeholder.png";
    imgEl.alt = first?.alt || data.title || "";

    titleEl.textContent = data.title || "Untitled listing";
    descEl.textContent = data.description || "No description provided.";

    sellerEl.textContent = data.seller?.name ? `Seller: ${data.seller.name}` : "Seller: Unknown";

    const ends = fmt(data.endsAt);
    endsEl.textContent = ends ? `Ends: ${ends}` : "";

    const count = data._count?.bids ?? data.bids?.length ?? 0;
    bidCountEl.textContent = `Total bids: ${count}`;

    const high = highestBid(data);
    highestBidEl.innerHTML = high
        ? `Current bid: <strong>$${high}</strong>`
        : "Current bid: No bids yet";
}

function renderBids(data) {
    bidsList.innerHTML = "";

    const bids = Array.isArray(data.bids)
        ? [...data.bids].sort((a, b) => new Date(b.created) - new Date(a.created))
        : [];

    if (bids.length === 0) {
        noBidsMessage.classList.remove("hidden");
        return;
    }

    noBidsMessage.classList.add("hidden");

    const auth = getAuth();
    const username = auth?.name || null;

    bids.forEach((b) => {
        const li = document.createElement("li");
        li.className = "bid-item";

        const left = document.createElement("div");
        left.className = "bid-left";

        const amount = document.createElement("div");
        amount.className = "bid-amount";
        amount.textContent = `$${b.amount}`;

        const meta = document.createElement("div");
        meta.className = "bid-meta";

        const name = b.bidder?.name || "Unknown";
        const date = fmt(b.created);

        if (username && name === username) {
            const you = document.createElement("span");
            you.className = "bid-bidder-self";
            you.textContent = name;
            you.addEventListener("click", () => (location.href = "profile.html"));
            meta.appendChild(you);
        } else {
            meta.textContent = name;
        }

        if (date) {
            const t = document.createElement("span");
            t.textContent = ` • ${date}`;
            meta.appendChild(t);
        }

        left.appendChild(amount);
        left.appendChild(meta);
        li.appendChild(left);
        bidsList.appendChild(li);
    });
}

function updateBidInfo() {
    const auth = getAuth();

    if (!auth) {
        bidInfo.textContent = "Log in with your @stud.noroff.no account to place a bid.";
        return;
    }

    if (listing?.seller?.name === auth.name) {
        bidInfo.textContent = "You cannot bid on your own listing.";
        return;
    }

    bidInfo.textContent = "Enter a bid higher than the current price.";
}

async function load() {
    const id = getQueryId();
    if (!id) return showNotFound("No listing ID provided.");

    toggleLoading(true);

    try {
        const data = await fetchListingById(id);
        if (!data?.id) return showNotFound("Listing not found.");

        renderListing(data);
        renderBids(data);
        updateBidInfo();

        toggleLoading(false);
    } catch {
        showNotFound("Could not load this listing.");
    }
}

async function submitBid(e) {
    e.preventDefault();
    bidError.textContent = "";

    const auth = getAuth();
    if (!auth) {
        bidError.textContent = "You must be logged in to bid.";
        return;
    }

    if (listing?.seller?.name === auth.name) {
        bidError.textContent = "You cannot bid on your own listing.";
        return;
    }

    if (new Date(listing.endsAt) < new Date()) {
        bidError.textContent = "This listing has already ended.";
        return;
    }

    const amount = Number(bidInput.value);
    if (!amount || amount <= highestBid(listing)) {
        bidError.textContent = "Bid must be higher than the current bid.";
        return;
    }

    try {
        await placeBid(listing.id, amount);
        bidInput.value = "";

        const updated = await fetchListingById(listing.id);
        renderListing(updated);
        renderBids(updated);
        listing = updated;
        updateBidInfo();
    } catch (err) {
        bidError.textContent = err.message || "Could not place bid.";
    }
}

if (bidForm) bidForm.addEventListener("submit", submitBid);
load();
