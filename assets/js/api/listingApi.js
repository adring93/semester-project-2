import { apiRequest } from "./httpClient.js";

export async function fetchListings() {
    return apiRequest(
        "/auction/listings?_seller=true&_bids=true&sort=created&sortOrder=desc&limit=100&_active=true",
        "GET",
        null,
        false
    );
}

export async function fetchListingById(id) {
    return apiRequest(`/auction/listings/${id}?_seller=true&_bids=true`, "GET", null, false);
}

export async function createListing(body) {
    return apiRequest("/auction/listings", "POST", body, true);
}

export async function updateListing(id, body) {
    return apiRequest(`/auction/listings/${id}`, "PUT", body, true);
}

export async function deleteListing(id) {
    return apiRequest(`/auction/listings/${id}`, "DELETE", null, true);
}

export async function placeBid(listingId, amount) {
    return apiRequest(`/auction/listings/${listingId}/bids`, "POST", { amount: Number(amount) }, true);
}