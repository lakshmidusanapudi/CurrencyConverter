const api = "https://api.exchangerate-api.com/v4/latest/USD";

var search = document.querySelector(".searchBox");
var convert = document.querySelector(".convert");
var fromCurrecy = document.querySelector(".from");
var toCurrecy = document.querySelector(".to");
var finalValue = document.querySelector(".finalValue");
var finalAmount = document.getElementById("finalAmount");
var resultFrom;
var resultTo;
var searchValue;

fromCurrecy.addEventListener('change', (event) => {
    resultFrom = event.target.value;
});

toCurrecy.addEventListener('change', (event) => {
    resultTo = event.target.value;
});

search.addEventListener('input', updateValue);

function updateValue(e) {
    searchValue = e.target.value;
}

convert.addEventListener("click", getResults);

function getResults() {
    finalValue.innerHTML = "Converting..";
    fetch(api)
        .then(currency => currency.json())
        .then(currencyData => {
            let fromRate = currencyData.rates[resultFrom];
            let toRate = currencyData.rates[resultTo];
            let convertedAmount = ((toRate / fromRate) * searchValue).toFixed(2);

            // Retrieve existing conversion history from local storage
            var conversionHistory = JSON.parse(localStorage.getItem('conversionHistory')) || [];

            // Add the current conversion to the history array
            var conversionData = {
                amount: searchValue,
                fromCurrency: resultFrom,
                toCurrency: resultTo,
                convertedAmount: convertedAmount
            };
            conversionHistory.push(conversionData);

            // Save the updated history array back to local storage
            localStorage.setItem('conversionHistory', JSON.stringify(conversionHistory));

            // Display the converted amount
            finalValue.innerHTML = convertedAmount;
            finalAmount.style.display = "block";
        })
        .catch(error => console.error("Error fetching data:", error));
}

function displayHistory() {
    var historyContainer = document.querySelector(".history-container");

    // Check if the historyContainer exists before accessing its properties
    if (historyContainer) {
        var conversionHistory = JSON.parse(localStorage.getItem('conversionHistory'));

        if (conversionHistory) {
            // Clear existing content in the history container
            historyContainer.innerHTML = "";

            // Display each entry in the conversion history
            conversionHistory.forEach(entry => {
                var historyEntryElement = document.createElement("div");
                historyEntryElement.textContent = "Amount: " + entry.amount +
                    ", From Currency: " + entry.fromCurrency +
                    ", To Currency: " + entry.toCurrency +
                    ", Converted Amount: " + entry.convertedAmount;
                historyContainer.appendChild(historyEntryElement);
            });
        } else {
            // Display a message when there is no conversion history available
            historyContainer.innerHTML = "No conversion history available.";
        }
    } else {
        console.error("History container not found in the DOM.");
    }
}