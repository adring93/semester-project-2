export function validateEmail(email) {
    return typeof email === "string" && email.includes("@") && email.length > 5;
}

export function validateNoroffEmail(email) {
    return (
        typeof email === "string" &&
        (email.endsWith("@stud.noroff.no") || email.endsWith("@noroff.no"))
    );
}

export function validatePassword(password) {
    return typeof password === "string" && password.length >= 8;
}

export function validateImageUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

export function validateTitle(title) {
    return typeof title === "string" && title.trim().length >= 3;
}

export function validateFutureDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date) && date > new Date();
}
