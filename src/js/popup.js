
data = document.querySelector('textarea#data');
updateMsg = document.querySelector('#update-msg');


chrome.storage.sync.get("data", function(items){
    console.log(items);

    let val;
    if ("data" in items) {
        val = items["data"];
    } else {
        val = {
            sites: [

            ]
        };
    }
    data.value = JSON.stringify(val, null, 4);
});


document.querySelector("button#update-button").addEventListener("click", () => {

    console.log("updating data", data.value);

    let val;
    try {
        val = JSON.parse(data.value);

    } catch {
        updateMsg.innerText = "Data is not valid JSON";
        return;
    }

    if ("sites" in val) {
        for (site of val.sites) {
            try {
                console.log(site);
                let urlPat = new URLPattern(site);
            } catch {
                updateMsg.innerText = "Invalid URLPattern site";
                return;
            }
        }
    } else {
        updateMsg.innerText = "Data JSON is missing 'sites' field";
        return;
    }

    chrome.storage.sync.set({"data": val}, () => {

        console.log("yay updated");
        updateMsg.innerText = "Successfully Updated";
    });

});


