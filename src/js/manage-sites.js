/*
    A script providing an interface to manage blocked sites & temporary access.
*/
console.log("Site Blocker - manage sites");


const getStorageData = async () => {
    const val = await chrome.storage.sync.get("data");

    let data;
    if ("data" in val) {
        data = val["data"];
    } else {
        // Use default
        data = {
            blocked_sites: [],
            temporary_access: []
        };
    }
    return data;
}


const setStorageData = async (data) => {

    if ("blocked_sites" in data) {
        for (site of data.blocked_sites) {
            try {
                // console.log(site);
                let urlPat = new URLPattern(site);
            } catch {
                throw new Error("Invalid URLPattern site");
            }
        }
    } else {
        throw new Error("Data JSON is missing 'blocked_sites' field");
    }

    if ("temporary_access" in data) {
        // TODO: check this JSON is valid

        // Clear out all expired site temp access
        data.temporary_access = data.temporary_access.filter(site => {
            return (new Date().getTime() < site.expiry);
        });

    } else {
        throw new Error("Data JSON is missing 'temporary_access' field");
    }

    await chrome.storage.sync.set({"data": data});
    return "Successfully Updated Data";
}


/**
 * Adds temporary access for a specific URL.
 * 
 * If item already has temporary access, this will reset the timer to the specified length in seconds.
 * 
 * @param urlPattern a JSON URLPattern with (hostname,pathname,protocol)
 * @param length the length of the temporary access in seconds
 */
const addTemporaryAccess = async (urlPattern, length) => {
    console.log("Giving temporary access to", urlPattern, "for", length, "seconds");

    const data = await getStorageData();

    // Remove the same url_pattern if it already exists
    data.temporary_access = data.temporary_access.filter(site => {
        return (JSON.stringify(site.url_pattern) != JSON.stringify(urlPattern));
    })

    // Add url_pattern and expiry date
    const dataTempAccess = {
        url_pattern: urlPattern,
        expiry: new Date().getTime() + 1000*length
    }
    data.temporary_access.push(dataTempAccess);

    await setStorageData(data);

}


/**
 * Returns true if the given site should be blocked, else false.
 * 
 * @param url a given URL in href string form
 */
const isSiteBlocked = async (url) => {
    const data = await getStorageData();

    for (site of data.temporary_access) {

        // Skip if expired
        if (new Date().getTime() > site.expiry) {
            continue;
        }

        // Check url match
        let urlPat = new URLPattern(site.url_pattern);
        if (urlPat.test(url)) {
            return false;
        }
    }

    for (site of data.blocked_sites) {
        let urlPat = new URLPattern(site);
        // console.log(urlPat);

        if (urlPat.test(url)) {
            return true;
        }
    }

    return false;
}

