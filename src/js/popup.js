
dataText = document.querySelector('textarea#data');
successMsg = document.querySelector('#success-msg');
errorMsg = document.querySelector('#error-msg');

const setMessage = (msg, error=False) => {
    if (error) {
        successMsg.innerHTML = "";
        errorMsg.innerHTML = msg;
    } else {
        successMsg.innerHTML = msg;
        errorMsg.innerHTML = "";
    }
}

// Populate dataText textarea with data
(async () => {
    const data = await getStorageData();
    dataText.value = JSON.stringify(data, null, 4);
})();


document.querySelector("button#update-button").addEventListener("click", async () => {
    console.log("Updating data", dataText.value);

    // Attempt data update
    try {
        // Check valid JSON
        let val;
        try {
            val = JSON.parse(dataText.value);
        } catch {
            throw new Error("Data is not valid JSON");
        }

        const successMsg = await setStorageData(val);
        setMessage(successMsg, error=false);
    } catch (err) {
        console.log("Error when saving data", err.message);
        setMessage(err.message, error=true);
    }

});


