export function renderBids(bids, container) {
    container.innerHTML = "";

    if (!bids || bids.length === 0) {
        return;
    }

    bids.forEach(bid => {
        const li = document.createElement("li");
        li.className = "bid-item";

        const name = bid.bidder?.name || "Unknown";
        const amount = bid.amount;
        const dateObj = new Date(bid.created);
        const date = dateObj.toLocaleDateString();
        const time = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        li.innerHTML = `
            <a href="profile.html?user=${name}" class="bid-user">${name}</a>
            <span>$${amount}</span>
            <span>${date}, ${time}</span>
        `;

        container.appendChild(li);
    });
}
