export function renderListingCard(listing) {
    const card = document.createElement("article");
    card.className = "listing-card";

    const media = Array.isArray(listing.media) && listing.media.length > 0 ? listing.media[0] : null;
    const imageUrl =
        media && typeof media.url === "string" && media.url.trim().length > 0
            ? media.url
            : "assets/img/placeholders/listing-placeholder.jpg";

    const title = listing.title || "Untitled listing";

    const bidCount = listing._count && typeof listing._count.bids === "number" ? listing._count.bids : 0;

    const bids = Array.isArray(listing.bids) ? listing.bids : [];
    const highestBid = bids.reduce((max, bid) => (bid.amount > max ? bid.amount : max), 0);

    let timeLeftText = "Ended";
    if (listing.endsAt) {
        const ends = new Date(listing.endsAt);
        const now = new Date();
        const diffMs = ends.getTime() - now.getTime();

        if (diffMs > 0) {
            const diffMinutes = Math.floor(diffMs / 60000);
            const hours = Math.floor(diffMinutes / 60);
            const minutes = diffMinutes % 60;

            if (hours > 0) {
                timeLeftText = `${hours} h ${minutes} min left`;
            } else {
                timeLeftText = `${minutes} min left`;
            }
        }
    }

    const bidsText = bidCount === 0 ? "No bids yet" : `${bidCount} bids`;
    const currentBidText = highestBid > 0 ? `$${highestBid}` : "$0";

    card.innerHTML = `
        <div class="listing-card-image">
            <img src="${imageUrl}" alt="${title}">
        </div>
        <div class="listing-card-body">
            <h3 class="listing-card-title">${title}</h3>
            <div class="listing-card-meta">
                <div class="listing-meta-group">
                    <span class="listing-meta-label">Bids</span>
                    <span class="listing-meta-value">${bidsText}</span>
                </div>
                <div class="listing-meta-group">
                    <span class="listing-meta-label">Current bid</span>
                    <span class="listing-meta-value">${currentBidText}</span>
                </div>
                <div class="listing-meta-group">
                    <span class="listing-meta-label">Time left</span>
                    <span class="listing-meta-value listing-meta-badge">${timeLeftText}</span>
                </div>
            </div>
            <button class="btn btn-secondary listing-card-button" data-listing-id="${listing.id}">
                View listing
            </button>
        </div>
    `;

    const button = card.querySelector(".listing-card-button");
    if (button) {
        button.addEventListener("click", () => {
            if (!listing.id) return;
            window.location.href = `listing.html?id=${listing.id}`;
        });
    }

    return card;
}
