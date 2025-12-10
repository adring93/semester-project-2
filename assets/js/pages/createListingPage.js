import { createListing } from "../api/listingApi.js";
import { getAuth } from "../storage/authStorage.js";

const form = document.getElementById("createListingForm");
const titleInput = document.getElementById("listingTitle");
const descriptionInput = document.getElementById("listingDescription");
const mediaInput = document.getElementById("listingMedia");
const tagsInput = document.getElementById("listingTags");
const endsAtInput = document.getElementById("listingEndsAt");

const errorEl = document.getElementById("createListingError");
const successEl = document.getElementById("createListingSuccess");
const submitBtn = document.getElementById("createListingSubmit");

function ensureAuthenticated() {
    const auth = getAuth();
    if (!auth || !auth.accessToken) {
        window.location.href = "auth.html";
    }
}

function toIsoStringFromLocal(inputValue) {
    if (!inputValue) return null;
    const date = new Date(inputValue);
    if (Number.isNaN(date.getTime())) return null;
    return date.toISOString();
}

function setButtonLoading(isLoading) {
    if (!submitBtn) return;
    if (isLoading) {
        submitBtn.dataset.originalText = submitBtn.textContent;
        submitBtn.textContent = "Please wait...";
        submitBtn.disabled = true;
    } else {
        submitBtn.textContent = submitBtn.dataset.originalText || submitBtn.textContent;
        submitBtn.disabled = false;
    }
}

async function handleSubmit(event) {
    event.preventDefault();

    if (!form) return;

    if (errorEl) errorEl.textContent = "";
    if (successEl) successEl.textContent = "";

    const title = titleInput ? titleInput.value.trim() : "";
    const description = descriptionInput ? descriptionInput.value.trim() : "";
    const mediaUrl = mediaInput ? mediaInput.value.trim() : "";
    const tagsValue = tagsInput ? tagsInput.value.trim() : "";
    const endsAtRaw = endsAtInput ? endsAtInput.value : "";

    if (!title) {
        if (errorEl) errorEl.textContent = "Title is required.";
        return;
    }

    const endsAtIso = toIsoStringFromLocal(endsAtRaw);
    if (!endsAtIso) {
        if (errorEl) errorEl.textContent = "Please choose a valid end date.";
        return;
    }

    const now = new Date();
    const endDate = new Date(endsAtIso);
    if (endDate <= now) {
        if (errorEl) errorEl.textContent = "End date must be in the future.";
        return;
    }

    let media = [];
    if (mediaUrl) {
        media.push({
            url: mediaUrl,
            alt: title
        });
    }

    let tags = [];
    if (tagsValue) {
        tags = tagsValue
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0);
    }

    const body = {
        title,
        description: description || undefined,
        tags: tags.length > 0 ? tags : undefined,
        media: media.length > 0 ? media : undefined,
        endsAt: endsAtIso
    };

    setButtonLoading(true);

    try {
        const created = await createListing(body);
        if (successEl) {
            successEl.textContent = "Listing created successfully.";
        }
        if (created && created.id) {
            setTimeout(() => {
                window.location.href = `listing.html?id=${encodeURIComponent(created.id)}`;
            }, 800);
        }
    } catch (error) {
        if (errorEl) {
            errorEl.textContent = error.message || "Could not create listing.";
        }
    } finally {
        setButtonLoading(false);
    }
}

ensureAuthenticated();

if (form) {
    form.addEventListener("submit", handleSubmit);
}
