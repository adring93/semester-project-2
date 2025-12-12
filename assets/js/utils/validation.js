export function validateNoroffEmail(email) {
    if (typeof email !== "string") return false;
    const value = email.trim().toLowerCase();
    return value.endsWith("@stud.noroff.no") || value.endsWith("@noroff.no");
}

export function validatePassword(password) {
    return typeof password === "string" && password.length >= 8;
}

export function validateImageUrl(url) {
    if (typeof url !== "string") return false;
    try {
        const parsed = new URL(url.trim());
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
        return false;
    }
}

export function validateTitle(title) {
    return typeof title === "string" && title.trim().length >= 3;
}

export function validateFutureDate(dateString) {
    const date = new Date(dateString);
    return Number.isFinite(date.getTime()) && date.getTime() > Date.now();
}
