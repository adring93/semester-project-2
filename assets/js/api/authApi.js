import { apiRequest } from "./httpClient.js";

export function registerUser(body) {
    return apiRequest("/auth/register", "POST", body);
}

export function loginUser(body) {
    return apiRequest("/auth/login", "POST", body);
}

export function fetchProfile(name) {
    return apiRequest(
        `/auction/profiles/${encodeURIComponent(name)}?_listings=true&_wins=true`,
        "GET",
        null,
        true
    );
}
