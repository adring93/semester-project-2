import { apiRequest } from "./httpClient.js";

const BASE_PATH = "/auction/profiles";

export async function fetchProfileWithDetails(name) {
    return apiRequest(
        `${BASE_PATH}/${name}?_listings=true&_wins=true`,
        "GET",
        null,
        true
    );
}

export async function fetchProfileBids(name) {
    return apiRequest(
        `${BASE_PATH}/${name}/bids?_listings=true`,
        "GET",
        null,
        true
    );
}

export async function updateProfile(name, body) {
    return apiRequest(`${BASE_PATH}/${name}`, "PUT", body, true);
}
