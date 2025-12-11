import { fetchListingById, placeBid, deleteListing } from "../api/listingApi.js";
import { getAuth } from "../storage/authStorage.js";

const listingLoading = document.getElementById("listingLoading");
const listingContent = document.getElementById("listingContent");
const listingDetailsSection = document.getElementById("listingDetails");

const listingImage = document.getElementById("listingImage");
const listingTitle = document.getElementById("listingTitle");
const listingDescription = document.getElementById("listingDescription");
const listingSeller = document.getElementById("listingSeller");
const listingEnds = document.getElementById("listingEnds");
const listingBidCount = document.getElementById("listingBidCount");
const listingHighestBid = document.getElementById("listingHighestBid");

const bidsList = document.getElementById("bidsList");
const noBidsMessage = document.getElementById("noBidsMessage");

const bidForm = document.getElementById("bidForm");
const bidAmountInput = document.getElementById("bidAmount");
const bidError = document.getElementById("bidError");
const bidInfoMessage = document.getElementById("bidInfoMessage");

const deleteBtn = document.getElementById("deleteListingBtn");

let currentListing = null;

function getListingIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

function setLoading(isLoading) {
    if (listingLoading) {
        listingLoading.classList.toggle("hidden", !isLoading);
    }
    if (listingContent) {
        listingContent.classList.toggle("hidden", isLoading);
    }
}

function formatDate(value) {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString();
}

function getHighestBidAmount(listing) {
    if (!listing || !Array.isArray(listing.bids) || listing.bids.length === 0) {
        return 0;
    }
    return listing.bids.reduce((max, bid) => {
        return bid.amount > max ? bid.amount : max;
    }, 0);
}

function renderNotFound(message) {
    if (!listingDetailsSection) return;

    if (listingLoading) listingLoading.classList.add("hidden");
    if (listingContent) listingContent.classList.add("hidden");

    listingDetailsSection.innerHTML = `
        <div class="listing-error-box">
            <p>${message || "Listing not found."}</p>
            <p><a href="index.html">Go back to listings</a></p>
        </div>
    `;
}

function renderListing(listing) {
    currentListing = listing;

    if (listingImage) {
        const media = Array.isArray(listing.media) ? listing.media : [];
        const first = media[0];
        if (first && first.url) {
            listingImage.src = first.url;
            listingImage.alt = first.alt || listing.title || "Listing image";
        } else {
            listingImage.src = "assets/img/placeholders/listing-placeholder.png";
            listingImage.alt = "Listing placeholder";
        }
    }

    if (listingTitle) listingTitle.textContent = listing.title || "Untitled listing";

    if (listingDescription) {
        listingDescription.textContent =
            listing.description || "No description provided for this listing.";
    }

    if (listingSeller) {
        const name = listing.seller && listing.seller.name ? listing.seller.name : "Unknown seller";
        listingSeller.textContent = `Seller: ${name}`;
    }

    if (listingEnds) {
        const endsText = formatDate(listing.endsAt);
        listingEnds.textContent = endsText ? `Ends: ${endsText}` : "";
    }

    const count = listing._count && typeof listing._count.bids === "number"
        ? listing._count.bids
        : Array.isArray(listing.bids)
        ? listing.bids.length
        : 0;

    if (listingBidCount) {
        listingBidCount.textContent = `Total bids: ${count}`;
    }

    const highest = getHighestBidAmount(listing);
    if (listingHighestBid) {
        if (highest > 0) {
            listingHighestBid.innerHTML = `Current bid: <span class="listing-meta-current">$${highest}</span>`;
        } else {
            listingHighestBid.textContent = "Current bid: No bids yet";
        }
    }

    const auth = getAuth();
    const isSeller =
        auth &&
        auth.name &&
        listing.seller &&
        listing.seller.name === auth.name;

    if (deleteBtn) {
        deleteBtn.classList.toggle("hidden", !isSeller);
    }
}

function renderBids(listing) {
    if (!bidsList || !noBidsMessage) return;

    bidsList.innerHTML = "";

    const bids = Array.isArray(listing.bids)
        ? listing.bids.slice().sort((a, b) => {
              return new Date(a.created) - new Date(b.created);
          })
        : [];

    if (bids.length === 0) {
        noBidsMessage.classList.remove("hidden");
        return;
    }

    noBidsMessage.classList.add("hidden");

    const auth = getAuth();
    const authName = auth && auth.name ? auth.name : null;

    bids.forEach((bid) => {
        const li = document.createElement("li");
        li.className = "bid-item";

        const left = document.createElement("div");
        left.className = "bid-left";

        const amountEl = document.createElement("div");
        amountEl.className = "bid-amount";
        amountEl.textContent = `$${bid.amount}`;

        const bidderName = bid.bidder && bid.bidder.name ? bid.bidder.name : "Unknown";
        const createdText = formatDate(bid.created);

        const metaEl = document.createElement("div");
        metaEl.className = "bid-meta";

        if (authName && bidderName === authName) {
            const span = document.createElement("span");
            span.textContent = bidderName;
            span.className = "bid-bidder-self";
            span.addEventListener("click", () => {
                window.location.href = "profile.html";
            });
            metaEl.appendChild(span);
        } else {
            metaEl.textContent = bidderName;
        }

        if (createdText) {
            const timeSpan = document.createElement("span");
            timeSpan.textContent = ` • ${createdText}`;
            metaEl.appendChild(timeSpan);
        }

        left.appendChild(amountEl);
        left.appendChild(metaEl);

        li.appendChild(left);
        bidsList.appendChild(li);
    });
}

function updateBidInfoMessage() {
    if (!bidInfoMessage) return;

    const auth = getAuth();
    if (!auth || !auth.name) {
        bidInfoMessage.textContent = "Log in with your @stud.noroff.no account to place a bid.";
        return;
    }

    if (!currentListing || !currentListing.seller) {
        bidInfoMessage.textContent = "";
        return;
    }

    if (currentListing.seller.name === auth.name) {
        bidInfoMessage.textContent = "You are the seller of this listing and cannot bid on it.";
        return;
    }

    bidInfoMessage.textContent = "Enter an amount higher than the current bid to place your bid.";
}

async function loadListing() {
    const id = getListingIdFromUrl();

    if (!id) {
        renderNotFound("No listing ID provided.");
        return;
    }

    setLoading(true);

    try {
        const listing = await fetchListingById(id);
        if (!listing || !listing.id) {
            renderNotFound("Listing could not be found.");
            return;
        }

        renderListing(listing);
        renderBids(listing);
        updateBidInfoMessage();
        setLoading(false);
    } catch (error) {
        renderNotFound("Could not load this listing.");
    }
}

async function handleBidSubmit(event) {
    event.preventDefault();

    if (!bidError) return;

    bidError.textContent = "";

    const auth = getAuth();
    if (!auth || !auth.accessToken) {
        bidError.textContent = "You must be logged in to place a bid.";
        return;
    }

    if (!currentListing) {
        bidError.textContent = "Listing is not loaded yet.";
        return;
    }

    if (currentListing.seller && currentListing.seller.name === auth.name) {
        bidError.textContent = "You cannot bid on your own listing.";
        return;
    }

    const now = new Date();
    const ends = currentListing.endsAt ? new Date(currentListing.endsAt) : null;
    if (ends && now > ends) {
        bidError.textContent = "This listing has already ended.";
        return;
    }

    const rawAmount = bidAmountInput ? bidAmountInput.value : "";
    const amount = Number(rawAmount);

    if (!amount || Number.isNaN(amount) || amount <= 0) {
        bidError.textContent = "Please enter a valid bid amount.";
        return;
    }

    const highest = getHighestBidAmount(currentListing);
    if (amount <= highest) {
        bidError.textContent = `Bid must be higher than the current bid ($${highest}).`;
        return;
    }

    try {
        await placeBid(currentListing.id, amount);
        bidAmountInput.value = "";
        bidError.textContent = "";

        const updated = await fetchListingById(currentListing.id);
        if (updated && updated.id) {
            renderListing(updated);
            renderBids(updated);
            currentListing = updated;
            updateBidInfoMessage();
        }
    } catch (error) {
        bidError.textContent = error.message || "Could not place bid.";
    }
}

async function handleDeleteClick() {
    if (!currentListing || !currentListing.id) return;

    const auth = getAuth();
    if (!auth || !auth.accessToken || !auth.name) {
        alert("You must be logged in as the seller to delete this listing.");
        return;
    }

    if (!currentListing.seller || currentListing.seller.name !== auth.name) {
        alert("Only the seller can delete this listing.");
        return;
    }

    const confirmed = confirm("Delete this listing? This can not be undone.");
    if (!confirmed) return;

    try {
        await deleteListing(currentListing.id);
        window.location.href = "index.html";
    } catch (error) {
        if (bidError) {
            bidError.textContent = error.message || "Could not delete listing.";
        } else {
            alert(error.message || "Could not delete listing.");
        }
    }
}

if (bidForm) {
    bidForm.addEventListener("submit", handleBidSubmit);
}

if (deleteBtn) {
    deleteBtn.addEventListener("click", handleDeleteClick);
}

loadListing();
