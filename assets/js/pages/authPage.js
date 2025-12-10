import { registerUser, loginUser, fetchProfile } from "../api/authApi.js";
import { saveAuth } from "../storage/authStorage.js";

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const loginPanel = document.getElementById("loginPanel");
const registerPanel = document.getElementById("registerPanel");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginError = document.getElementById("loginError");
const registerError = document.getElementById("registerError");

const loginSubmit = document.getElementById("loginSubmit");
const registerSubmit = document.getElementById("registerSubmit");

function showTab(tab) {
    if (tab === "login") {
        loginTab.classList.add("active");
        loginTab.setAttribute("aria-selected", "true");
        registerTab.classList.remove("active");
        registerTab.setAttribute("aria-selected", "false");
        loginPanel.classList.remove("hidden");
        registerPanel.classList.add("hidden");
    } else {
        registerTab.classList.add("active");
        registerTab.setAttribute("aria-selected", "true");
        loginTab.classList.remove("active");
        loginTab.setAttribute("aria-selected", "false");
        registerPanel.classList.remove("hidden");
        loginPanel.classList.add("hidden");
    }

    loginError.classList.add("hidden");
    registerError.classList.add("hidden");
}

function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.dataset.originalText = button.textContent;
        button.textContent = "Please wait...";
        button.disabled = true;
    } else {
        button.textContent = button.dataset.originalText || button.textContent;
        button.disabled = false;
    }
}

function isNoroffStudentEmail(email) {
    return typeof email === "string" && email.toLowerCase().endsWith("@stud.noroff.no");
}

loginTab.addEventListener("click", () => showTab("login"));
registerTab.addEventListener("click", () => showTab("register"));

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    loginError.classList.add("hidden");

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!isNoroffStudentEmail(email)) {
        loginError.textContent = "Email must be a valid @stud.noroff.no address.";
        loginError.classList.remove("hidden");
        return;
    }

    setButtonLoading(loginSubmit, true);

    try {
        const authData = await loginUser({ email, password });

        saveAuth(authData);

        const profile = await fetchProfile(authData.name);

        saveAuth({ ...authData, profile });

        window.location.href = "index.html";
    } catch (error) {
        loginError.textContent = error.message;
        loginError.classList.remove("hidden");
    } finally {
        setButtonLoading(loginSubmit, false);
    }
});

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    registerError.classList.add("hidden");

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;

    const namePattern = /^[A-Za-z0-9_]+$/;
    if (!namePattern.test(name)) {
        registerError.textContent = "Username may only contain letters, numbers and underscore.";
        registerError.classList.remove("hidden");
        return;
    }

    if (!isNoroffStudentEmail(email)) {
        registerError.textContent = "Email must be a valid @stud.noroff.no address.";
        registerError.classList.remove("hidden");
        return;
    }

    if (password.length < 8) {
        registerError.textContent = "Password must be at least 8 characters.";
        registerError.classList.remove("hidden");
        return;
    }

    setButtonLoading(registerSubmit, true);

    try {
        await registerUser({ name, email, password });

        const authData = await loginUser({ email, password });

        saveAuth(authData);

        const profile = await fetchProfile(authData.name);

        saveAuth({ ...authData, profile });

        window.location.href = "index.html";
    } catch (error) {
        registerError.textContent = error.message;
        registerError.classList.remove("hidden");
    } finally {
        setButtonLoading(registerSubmit, false);
    }
});
