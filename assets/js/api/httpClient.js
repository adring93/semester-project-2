const API_BASE_URL = "https://v2.api.noroff.dev";
const API_KEY = "e040183d-63ee-4990-b04a-e02a2bd0ef26";

export async function apiRequest(endpoint, method = "GET", body = null, requiresAuth = false) {
    const url = API_BASE_URL + endpoint;

    const headers = {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY
    };

    if (requiresAuth) {
        const stored = localStorage.getItem("auctionhub_auth");
        if (!stored) {
            throw new Error("Not authenticated");
        }

        const parsed = JSON.parse(stored);
        if (!parsed.accessToken) {
            throw new Error("Not authenticated");
        }

        headers.Authorization = `Bearer ${parsed.accessToken}`;
    }

    const options = { method, headers };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const message = data?.errors?.[0]?.message || "Request failed";
        throw new Error(message);
    }

    return data?.data ?? data;
}
