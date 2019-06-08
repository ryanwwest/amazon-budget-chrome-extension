// This is a simple mock api where, if fully implemented, this would connect to 
// companies such as Capital One to retrieve credit card information and sales tax info,
// and companies like Intuit (Mint) to retrieve personal budget information. We didn't
// implement this far due to timing constraints of the hackathon.
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.item == "card") {
            sendResponse({balance:2200.59, limit: 2500});
        }
        if (request.item == "budget") 
        {
            sendResponse({balance: 102.39, limit: 500});
        }
        if (request.item == "hourly_wage")
        {
            sendResponse({value: 7.25});
        }
        if (request.item == "tax_percent")
        {
            sendResponse({value: 0.07});
        }
    }
);
