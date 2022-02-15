


chrome.storage.sync.get("data", function(items){
    if (!("data" in items)) {
        return;
    }
    let val = items["data"];

    if (!("sites" in val)) {
        return;
    }


    let siteCurrent = document.location.href;
    console.log(siteCurrent);

    for (site of val.sites) {
        let urlPat = new URLPattern(site);
        console.log(urlPat);

        if (urlPat.test(siteCurrent)) {
            alert("SITE BLOCKER\nProcrastination Warning!");
        }

    }
});

