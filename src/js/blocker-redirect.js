/*
    A script which runs on the redirected blocker page.

    The purpose of this page is to provide a mechanism for the user to temporarily view a youtube URL.
*/
console.log("Site Blocker - block redirect");

const TEMPORARY_ACCESS_COUNTDOWN = 10;  // 10 seconds
const TEMPORARY_ACCESS_LENGTH = 60 * 60;  // 1 hour


/**
 * Restores the favicon from the blocked page.
 */
const setFavicon = () => {
    const blockedFavicon = searchParams.get("blockedFavicon");
    console.log("Blocked Favicon: " + blockedFavicon);

    document.head.innerHTML += blockedFavicon;
}

/**
 * Restores to title from the blocked page prefixed with [Blocked]
 */
const setTitle = () => {
    const blockedTitle = searchParams.get("blockedTitle");
    console.log("Blocked Title: " + blockedTitle);

    document.title = "[Blocked] " + blockedTitle;
    document.querySelector("#blocked-title").innerHTML = blockedTitle;
}


/**
 * Updates the page to display the blocked URL.
 */
const setURL = () => {
    console.log("Blocked URL: " + blockedURL.href);

    // Update link to original URL
    const blockedURLLink = document.querySelector("#blocked-url-link");
    blockedURLLink.innerHTML = blockedURL.href;
    blockedURLLink.href = blockedURL.href;

}



document.querySelector("button#btn-temp-access-start").addEventListener("click", async () => {
    document.querySelector("button#btn-temp-access-start").hidden = true;

    // Perform countdown
    document.querySelector("#txt-temp-access-countdown").hidden = false;
    for (let i=TEMPORARY_ACCESS_COUNTDOWN; i>0; i--) {
        document.querySelector("#txt-temp-access-countdown").innerHTML = i;
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    document.querySelector("#txt-temp-access-countdown").hidden = true;

    // Unhide final access button
    document.querySelector("button#btn-temp-access-end").hidden = false;
});


document.querySelector("button#btn-temp-access-end").addEventListener("click", async () => {
    const urlPattern = {
        hostname: blockedURL.hostname,
        pathname: blockedURL.pathname,
        protocol: blockedURL.protocol,
        search: blockedURL.search, // query params may not be a perfect match always
    };

    await addTemporaryAccess(urlPattern, TEMPORARY_ACCESS_LENGTH);

    // Finish by opening URL
    location.replace(blockedURL.href);
});


const searchParams = new URLSearchParams(window.location.search);
const blockedURL = new URL(searchParams.get("blockedURL"));

setFavicon();
setTitle();
setURL();
