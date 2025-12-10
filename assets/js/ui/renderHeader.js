import { getAuth, clearAuth } from "../storage/authStorage.js";

function initHeaderAuth() {
    const userInfo = document.getElementById("userInfo");
    const userNameEl = document.getElementById("userName");
    const userCreditsEl = document.getElementById("userCredits");
    const authActions = document.getElementById("authActions");
    const logoutBtn = document.getElementById("logoutBtn");

    if (!userInfo || !authActions) {
        return;
    }

    const auth = getAuth();

    if (auth && auth.accessToken) {
        userInfo.classList.remove("hidden");
        authActions.classList.add("hidden");

        const displayName =
            auth.name ||
            (auth.profile && auth.profile.name) ||
            "";

        const credits =
            (auth.profile && typeof auth.profile.credits === "number"
                ? auth.profile.credits
                : typeof auth.credits === "number"
                ? auth.credits
                : null);

        if (userNameEl) {
            userNameEl.textContent = displayName;
        }

        if (userCreditsEl) {
            userCreditsEl.textContent =
                credits !== null ? `${credits} credits` : "";
        }

        if (logoutBtn) {
            logoutBtn.addEventListener("click", () => {
                clearAuth();
                window.location.href = "index.html";
            });
        }
    } else {
        userInfo.classList.add("hidden");
        authActions.classList.remove("hidden");
        if (userNameEl) userNameEl.textContent = "";
        if (userCreditsEl) userCreditsEl.textContent = "";
    }
}

initHeaderAuth();
