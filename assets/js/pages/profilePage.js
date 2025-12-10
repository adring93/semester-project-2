import { getAuth, saveAuth } from "../storage/authStorage.js";
import { fetchProfileWithDetails, fetchProfileBids, updateProfile } from "../api/profileApi.js";

const bannerEl = document.getElementById("profileBanner");
const avatarEl = document.getElementById("profileAvatar");
const nameEl = document.getElementById("profileName");
const emailEl = document.getElementById("profileEmail");
const bioEl = document.getElementById("profileBio");
const creditsEl = document.getElementById("profileCredits");

const listingsEl = document.getElementById("profileListings");
const noListingsMessageEl = document.getElementById("noListingsMessage");

const bidsEl = document.getElementById("profileBids");
const noBidsMessageEl = document.getElementById("noBidsMessage");

const updateForm = document.getElementById("profileUpdateForm");
const updateBioInput = document.getElementById("updateBio");
const updateAvatarInput = document.getElementById("updateAvatarUrl");
const updateBannerInput = document.getElementById("updateBannerUrl");
const updateErrorEl = document.getElementById("profileUpdateError");
const updateSuccessEl = document.getElementById("profileUpdateSuccess");

function ensureAuthenticated() {
    const auth = getAuth();
    if (!auth || !auth.accessToken || !auth.name) {
        window.location.href = "auth.html";
        return null;
    }
    return auth;
}

function renderProfile(profile) {
    if (nameEl) nameEl.textContent = profile.name || "";
    if (emailEl) emailEl.textContent = profile.email || "";
    if (bioEl) bioEl.textContent = profile.bio || "No bio set yet.";

    if (creditsEl) {
        const credits = typeof profile.credits === "number" ? profile.credits : 0;
        creditsEl.textContent = `${credits} credits`;
    }

    const avatarUrl =
        profile.avatar && profile.avatar.url
            ? profile.avatar.url
            : "assets/img/placeholders/avatar-placeholder.png";

    const bannerUrl =
        profile.banner && profile.banner.url
            ? profile.banner.url
            : "assets/img/placeholders/banner-placeholder.png";

    if (avatarEl) {
        avatarEl.src = avatarUrl;
        avatarEl.alt = profile.name || "Profile avatar";
    }

    if (bannerEl) {
        bannerEl.src = bannerUrl;
        bannerEl.alt = profile.name || "Profile banner";
    }

    if (updateBioInput) updateBioInput.value = profile.bio || "";
    if (updateAvatarInput) updateAvatarInput.value = profile.avatar?.url || "";
    if (updateBannerInput) updateBannerInput.value = profile.banner?.url || "";
}

function renderListings(listings) {
    if (!listingsEl || !noListingsMessageEl) return;

    listingsEl.innerHTML = "";

    const safeListings = Array.isArray(listings) ? listings : [];

    if (safeListings.length === 0) {
        noListingsMessageEl.classList.remove("hidden");
        return;
    }

    noListingsMessageEl.classList.add("hidden");

    safeListings.forEach((listing) => {
        const li = document.createElement("li");
        li.className = "profile-list-item";

        const title = listing.title || "Untitled listing";
        const endsAt = listing.endsAt ? new Date(listing.endsAt) : null;
        const endsText = endsAt ? endsAt.toLocaleString() : "";

        li.innerHTML = `
            <a href="listing.html?id=${encodeURIComponent(listing.id)}" class="profile-list-link">
                <span class="profile-list-title">${title}</span>
                <span class="profile-list-meta">Ends: ${endsText}</span>
            </a>
        `;

        listingsEl.appendChild(li);
    });
}

function renderBids(bids) {
    if (!bidsEl || !noBidsMessageEl) return;

    bidsEl.innerHTML = "";

    const safeBids = Array.isArray(bids) ? bids : [];

    if (safeBids.length === 0) {
        noBidsMessageEl.classList.remove("hidden");
        return;
    }

    noBidsMessageEl.classList.add("hidden");

    safeBids.forEach((bid) => {
        const li = document.createElement("li");
        li.className = "profile-list-item";

        const amount = bid.amount;
        const created = bid.created ? new Date(bid.created) : null;
        const createdText = created ? created.toLocaleString() : "";

        const listingTitle =
            bid.listing && bid.listing.title
                ? bid.listing.title
                : "Listing";

        li.innerHTML = `
            <a href="listing.html?id=${encodeURIComponent(
                bid.listing?.id || ""
            )}" class="profile-list-link">
                <span class="profile-list-title">${listingTitle}</span>
                <span class="profile-list-meta">Bid: $${amount} – ${createdText}</span>
            </a>
        `;

        bidsEl.appendChild(li);
    });
}

async function loadProfile() {
    const auth = ensureAuthenticated();
    if (!auth) return;

    try {
        const profile = await fetchProfileWithDetails(auth.name);
        renderProfile(profile);
        renderListings(profile.listings || []);

        const updatedAuth = {
            ...auth,
            profile
        };
        saveAuth(updatedAuth);
    } catch (error) {
        if (bioEl) {
            bioEl.textContent = "Could not load profile.";
        }
        if (noListingsMessageEl) {
            noListingsMessageEl.textContent = "Could not load listings.";
            noListingsMessageEl.classList.remove("hidden");
        }
    }

    try {
        const bids = await fetchProfileBids(auth.name);
        renderBids(bids);
    } catch (error) {
        if (noBidsMessageEl) {
            noBidsMessageEl.textContent = "Could not load bids.";
            noBidsMessageEl.classList.remove("hidden");
        }
    }
}

async function handleProfileUpdate(event) {
    event.preventDefault();

    const auth = getAuth();
    if (!auth || !auth.name) {
        window.location.href = "auth.html";
        return;
    }

    if (updateErrorEl) updateErrorEl.textContent = "";
    if (updateSuccessEl) updateSuccessEl.textContent = "";

    const bioValue = updateBioInput ? updateBioInput.value.trim() : "";
    const avatarUrl = updateAvatarInput ? updateAvatarInput.value.trim() : "";
    const bannerUrl = updateBannerInput ? updateBannerInput.value.trim() : "";

    const body = {};

    if (bioValue) {
        body.bio = bioValue;
    }

    if (avatarUrl) {
        body.avatar = {
            url: avatarUrl,
            alt: ""
        };
    }

    if (bannerUrl) {
        body.banner = {
            url: bannerUrl,
            alt: ""
        };
    }

    if (Object.keys(body).length === 0) {
        if (updateErrorEl) {
            updateErrorEl.textContent = "Nothing to update.";
        }
        return;
    }

    try {
        const updatedProfile = await updateProfile(auth.name, body);
        renderProfile(updatedProfile);

        const updatedAuth = {
            ...auth,
            profile: updatedProfile
        };
        saveAuth(updatedAuth);

        if (updateSuccessEl) {
            updateSuccessEl.textContent = "Profile updated.";
        }
    } catch (error) {
        if (updateErrorEl) {
            updateErrorEl.textContent =
                error.message || "Could not update profile.";
        }
    }
}

if (updateForm) {
    updateForm.addEventListener("submit", handleProfileUpdate);
}

loadProfile();
