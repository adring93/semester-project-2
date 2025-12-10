const STORAGE_KEY = "auctionhub_auth";
export function getApiKey() {
    return "e040183d-63ee-4990-b04a-e02a2bd0ef26";
}

export function saveAuth(authData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
}

export function getAuth() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function clearAuth() {
    localStorage.removeItem(STORAGE_KEY);
}
