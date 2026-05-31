# AuctionHub: Semester Project 2

AuctionHub is a front-end auction web application built with HTML, CSS and vanilla JavaScript, using the Noroff Auction House API v2.

This project was developed as part of Semester Project 2 in the Front-end Development course at Noroff.

## Live Site

https://auctionshub.netlify.app/

## Repository

https://github.com/adring93/semester-project-2

## Project Overview

AuctionHub allows users to browse active auctions, search and filter listings, view individual auction pages, register, log in, create listings, place bids and manage their profile.

The project was built with vanilla JavaScript and split into reusable modules for API handling, page logic, storage, UI rendering and validation.

## Portfolio 2 Improvements

For Portfolio 2, I reviewed the project and chose to improve the auction listing cards and marketplace presentation.

The original version already had a strong visual direction, so I did not want to redesign the whole project. I first tested the idea of adding a Featured Auctions section, but after reviewing the result, I felt it pushed the live listings too far down the page and made the user experience worse.

Instead, I improved the existing listing cards because quick browsing and product discovery are the most important parts of an auction marketplace.

The main improvements were:

* Improved auction listing card presentation
* Added a cleaner image area
* Added a bid count badge on the listing image
* Improved current bid and time left layout
* Added stronger hover states
* Improved visual hierarchy inside each card
* Made the cards feel more polished and marketplace-like
* Kept the live listings high on the page instead of adding a large extra section above them

This improvement made the page feel more professional while keeping the original user flow intact.

## Features

### Home Page

* Hero section with search
* Popular category filters
* Live auctions grid
* Instant search
* Sorting by ending soon, newest, oldest and title
* Reset filters button
* Load more auctions button
* Stats section showing:

  * Active listings
  * Total bids on shown items
  * Average bids per listing
  * Unique sellers

### Authentication Page

* Login and register tabs
* Noroff email validation
* Username validation
* Password validation
* Automatic login after successful registration

### Create Listing Page

* Create auction listing form
* Title, description, image URL, tags and end date fields
* Client-side validation
* Redirects to the new listing page after successful creation

### Listing Page

* Single auction detail view
* Image, title, description and seller information
* Current highest bid
* Time left
* Bids list
* Place bid form
* Prevents users from bidding on their own listing
* Requires bids to be higher than the current highest bid

### Profile Page

* User avatar and banner
* Username, email, credits and bio
* User listings
* User bids
* Update profile form

## Tech Stack

* HTML5
* CSS3
* Vanilla JavaScript
* JavaScript ES modules
* Noroff Auction House API v2
* Netlify

## Project Structure

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
```

## API Usage

The project uses the Noroff Auction House API v2.

Main endpoints used:

* Get auction listings
* Get a single listing
* Create a listing
* Place a bid
* Register user
* Login user
* Get profile
* Update profile

## Testing

The project was manually tested by checking:

* Home page loads listings correctly
* Search filters listings
* Category filters work
* Sorting works
* Load more works
* Single listing pages open correctly
* Login works with valid Noroff credentials
* Register works with valid Noroff credentials
* Create listing form validates input
* Bidding rules work
* Profile page loads user information
* Profile update form works
* The live Netlify deployment works

## Future Improvements

Future improvements could include:

* Image carousel on individual listing pages
* Better loading skeletons
* More advanced filtering
* Watchlist functionality
* Better seller profile pages
* More detailed bid history
* Improved empty states

## Author

Adrian Ingvartsen
Frontend Development Student at Noroff

GitHub: https://github.com/adring93
