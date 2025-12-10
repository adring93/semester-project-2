# AuctionHub – Semester Project 2

AuctionHub is a front-end auction web application built with **HTML**, **CSS** and **vanilla JavaScript**, using the **Noroff Auction House API v2**.

This project is part of **Semester Project 2** in the Front-end development course at Noroff.

---

## Table of contents

- [Features](#features)
  - [Pages](#pages)
  - [Listing features](#listing-features)
  - [Filtering, search and stats](#filtering-search-and-stats)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Running the project locally](#running-the-project-locally)
- [API usage](#api-usage)
- [Validation and UX](#validation-and-ux)
- [Known limitations](#known-limitations)
- [Future improvements](#future-improvements)

---

## Features

### Pages

**`index.html` – Home / Live auctions**

- Hero section with large search field (filters the auctions below)
- Popular categories row (Electronics, Vehicles, Jewelry, Home, Art, Fashion)
  - Clicking a category filters the listings by tag
- Live auctions section:
  - Search field (instant filtering)
  - Sort dropdown (ending soon, newest, oldest, title)
  - Reset filters button
  - Grid of listing cards with:
    - Image
    - Title
    - Bid count
    - Current bid
    - Time left
    - “View listing” button
  - “Load more auctions” button (simple pagination)
- Stats section at the bottom:
  - Active listings
  - Total bids on shown items
  - Average bids per listing
  - Unique sellers
  - Values are calculated based on the currently loaded/filtered data

**`auth.html` – Login / Register**

- Single page with two tabs:
  - **Login**
  - **Register**
- Only **Noroff student emails** are accepted:
  - `@stud.noroff.no` and `@noroff.no`
- Username rules:
  - Only letters, numbers and underscore
- Password rules:
  - Minimum 8 characters
- On successful register:
  - User is automatically logged in
  - Profile data is fetched and stored
  - User is redirected to `index.html`

**`create-listing.html` – Create new auction**

- Form fields:
  - Title (required)
  - Description (optional)
  - Image URL (optional, must be a valid, public image URL)
  - Tags (optional, comma-separated)
  - Ends at (required, must be in the future)
- Client-side validation:
  - Shows clear error messages below the form if something is wrong
- On success:
  - Listing is created through the Auction API
  - User is redirected to the new listing page

**`listing.html` – Single listing**

- Two-column layout:
  - Left side:
    - Big image
    - Title
    - Description
    - Seller name
    - Time left
    - Bid count
    - Highest bid
  - Right side:
    - Bids list (latest first)
      - Bidder name
      - Amount
      - Date and time
    - “Place a bid” form
- Bid rules:
  - User must be logged in
  - You cannot bid on your **own** listing
  - Bid must be higher than current highest bid
  - Error message shown if rule is broken
- Global header shows:
  - Logged-in username
  - Credits
  - Logout button

**`profile.html` – User profile**

- Banner image + avatar
- Username, email, credits and bio
- “Your listings” section:
  - List of your own listings with:
    - Title
    - End date/time
    - Link to each listing
- “Your bids” section:
  - Shows listings you have bid on
  - Each item links to the relevant listing
- “Update profile” form:
  - Bio
  - Avatar URL
  - Banner URL
  - Updates are sent to the API and reflected in the header/profile

---

## Listing features

- Fetches listings from:
  - `GET /auction/listings`
- Uses query parameters:
  - `_seller=true`
  - `_bids=true`
  - `_active=true`
  - `sort=created`
  - `sortOrder=desc`
  - `limit=100`
- Bidding:
  - `POST /auction/listings/{id}/bids`
- Single listing:
  - `GET /auction/listings/{id}?_seller=true&_bids=true`

---

## Filtering, search and stats

- **Category filter**:
  - Click on a category card to filter listings by tag
- **Hero search**:
  - Top search bar filters listings by title/description when you click “Search”
- **Live auctions search**:
  - Lower search field filters instantly as you type
- **Sorting**:
  - Ending soon
  - Newest
  - Oldest
  - Title (A–Z)
- **Stats section** (client-side):
  - Active listings = number of currently shown listings
  - Total bids on shown items
  - Average bids per listing
  - Unique sellers (from the currently loaded data)

---

## Tech stack

- **HTML5**
- **CSS3**
  - Shared styles: `base.css`, `layout.css`, `components.css`
  - Page-specific styles: `auth.css`, `home.css`, `listing.css`, `profile.css`, `create-listing.css`
- **Vanilla JavaScript (ES modules)**
  - Split into `api`, `pages`, `storage`, `ui`, `utils`
- **Noroff Auction House API v2**

---

## Project structure

```text
assets/
  css/
    common/
      base.css
      layout.css
      components.css
    pages/
      auth.css
      home.css
      listing.css
      profile.css
      create-listing.css

  js/
    api/
      httpClient.js
      authApi.js
      listingApi.js
      profileApi.js
    pages/
      authPage.js
      home.js
      listingPage.js
      createListingPage.js
      profilePage.js
    storage/
      authStorage.js
    ui/
      renderHeader.js
      renderListingCard.js
      renderBids.js
    utils/
      validation.js

index.html
auth.html
create-listing.html
listing.html
profile.html

Semester Project 2 – Front-end Development  
Noroff 2025  
Made by Adrian I.