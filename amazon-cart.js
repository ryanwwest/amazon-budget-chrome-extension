main();

//gets the price from the product page as a number
function get_price() {
    var price_div = document.getElementById("sc-subtotal-amount-activecart").children[0];
    var price_text = price_div.innerText;
    var price = Number(price_text.replace(/[^0-9.-]+/g,""));
    return price;
}

//adds the tax to the price
function taxed(price) {
    console.log(window.tax_rate);
    return price * (1 + window.tax_rate);
}

//adds an additional price information element to the page
function add_price_adjustment(label, value) {

    let rounded_row = document.createElement("tr");
    let rounded_row_label = document.createElement("td");
    rounded_row_label.className = "a-size-medium";
    rounded_row_label.textContent = label;
    let rounded_row_price = document.createElement("td");
    rounded_row_price.className = "a-span12";
    let rounded_price_span  = document.createElement("td");  
    rounded_price_span.className = "a-size-medium a-color-price priceBlockDealPriceString";  
    rounded_price_span.textContent = value;
    rounded_row_price.appendChild(rounded_price_span);

    rounded_row.appendChild(rounded_row_label);
    rounded_row.appendChild(rounded_price_span);
        
    if (document.getElementById("sc-subtotal-label-activecart") != null) {
        document.getElementById("sc-subtotal-label-activecart").parentElement.appendChild(rounded_row);
    } 
}

//adds a budget or credit card bar to the page
function add_pbar(label, balance, limit, cost) {
    let rounded_row = document.createElement("tr");
    let rounded_row_label = document.createElement("td");
    rounded_row_label.className = "a-size-medium";
    rounded_row_label.textContent = label;
    let rounded_row_price = document.createElement("td");
    rounded_row_price.className = "a-span12";
    let rounded_price_span  = document.createElement("td");  
    rounded_price_span.className = "a-size-medium a-color-price priceBlockDealPriceString";  

    percent = Math.floor((balance + cost) / limit * 100);

    bar_div = document.createElement("div");
    bar_div.className = "progress";
    bar_before = document.createElement("div");
    if (percent <= 33) {
        bar_before.setAttribute("class", "progress-bar progress-bar-striped bg-success");
    } else if (percent <= 66) {
        bar_before.setAttribute("class", "progress-bar progress-bar-striped bg-warning");
    } else {
        bar_before.setAttribute("class", "progress-bar progress-bar-striped bg-danger");
    }
    bar_before.setAttribute("role", "progressbar");
    bar_before.setAttribute("style", "width: " + Math.ceil((balance + cost) / limit * 100) + "%");
    bar_div.appendChild(bar_before);

    rounded_price_span.textContent = "$" + (balance + cost).toFixed(2) + " (" + percent.toFixed(0) + "%)";
    rounded_price_span.appendChild(bar_div);
    rounded_row_price.appendChild(rounded_price_span);

    rounded_row.appendChild(rounded_row_label);
    rounded_row.appendChild(rounded_price_span);

    if (document.getElementById("sc-subtotal-label-activecart") != null) {
        document.getElementById("sc-subtotal-label-activecart").parentElement.appendChild(rounded_row);
    }
}

// adds budget and credit card information to the product page
function main(){
    chrome.storage.local.get(['global_enable'], function(response) {
        if(response.global_enable == true)
        {
            if(get_price() != 0) {
                chrome.storage.local.get(['should_budget'], function(response) {
                    if(response.should_budget == true)
                    {
                        chrome.runtime.sendMessage({item: "budget"}, function(response) {
                            add_pbar("Budget Utilized:", response.balance, response.limit, taxed(get_price()));
                        });
                    }
                });
                chrome.storage.local.get(['should_card'], function(response)
                {
                    if(response.should_card == true)
                    {
                        chrome.runtime.sendMessage({item: "card"}, function(response) {
                            add_pbar("Credit Utilized:", response.balance, response.limit, taxed(get_price()));
                        });
                    }
                });
            }
        }
    });
    
}

var price_element = document.getElementById("activeCartViewForm");
if(price_element != null)
{
    // Options for the observer (which mutations to observe)
    var config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    var callback = function(mutationsList) {
        for(var mutation of mutationsList) {
            if (mutation.type == 'childList') {
                
                if(mutation.target == price_element)
                {
                    main();
                    break;
                }
            }
        }
    };

    // Create an observer instance linked to the callback function
    var observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(price_element, config);
}

