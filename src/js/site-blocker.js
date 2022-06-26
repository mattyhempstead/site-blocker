/*
    A script which runs on the DOM of blocked sites

    The purpose of this script is to redirect the page if the current site should be blocked.    
*/

/*
    Redirects current site the blocked redirect.
*/
const blockSiteRedirect = async () => {
    console.log("Blocking site", window.location.href);

    const redirectURL = new URL(chrome.runtime.getURL("html/blocker-redirect.html"));

    // Add original URL in its full
    redirectURL.searchParams.append("blockedURL", window.location.href);
    
    // Add original page <title>
    // To increase accuracy, this requires the site-blocker.js script to run on document_end
    redirectURL.searchParams.append("blockedTitle", document.title);

    const favicon = document.querySelector("link[rel*='icon']");
    redirectURL.searchParams.append("blockedFavicon", favicon.outerHTML);


    location.replace(redirectURL);
    // location.href = redirectURL;
}


// Populate dataText textarea with data
(async () => {
    let siteCurrent = document.location.href;
    console.log(siteCurrent);

    if (await isSiteBlocked(siteCurrent)) {
        await blockSiteRedirect();
    }
})();
