
//adds global tax_rate variable
chrome.runtime.sendMessage({item: "tax_percent"}, function(response) {
window.tax_rate = response.value;
});

main();

// adds tax to the price
function taxed(price) {
console.log(window.tax_rate);
return price * (1 + window.tax_rate);
}

// gets the price from the page as a number
function get_price() {
    var price_div = document.getElementById("priceblock_dealprice")
    if (price_div == null) {
        var price_div = document.getElementById("priceblock_ourprice")
    }
    var price_text = price_div.innerText;
    var price = Number(price_text.replace(/[^0-9.-]+/g,""));
    return price;
}

// Finds the div of the price used in this Amazon product page
function get_price_div() {
    var possible_price_divs = ["priceblock_dealprice", "priceblock_ourprice"];
    var count = possible_price_divs.length;
    for (var i = 0; i < count; i++) {
        if (document.getElementById(possible_price_divs[i]) != null)
     //       possible_price_divs[i].value = "YOLO"
            return possible_price_divs[i];
    }
}

// rounds the price to the nearest dollar if 1 cent away to combat psychological effects (2.99 -> 3.00)
function rounded_price(price){
    //TODO: Make a fancier rounding algorithm
    return Math.ceil(price);
}

// adds a piece of price data to the page
function add_price_adjustment(label, value) {
    let rounded_row = document.createElement("tr");
    let rounded_row_label = document.createElement("td");
    rounded_row_label.className = "a-color-secondary a-size-base a-text-right a-nowrap";
    rounded_row_label.textContent = label;
    let rounded_row_price = document.createElement("td");
    rounded_row_price.className = "a-span12";
    let rounded_price_span  = document.createElement("span");
    rounded_price_span.className = "a-size-medium a-color-price priceBlockDealPriceString";
    rounded_price_span.textContent = value;
    rounded_row_price.appendChild(rounded_price_span);

    rounded_row.appendChild(rounded_row_label);
    rounded_row.appendChild(rounded_price_span);

    if (document.getElementById("priceblock_ourprice_row") != null) {
        document.getElementById("priceblock_ourprice_row").parentElement.appendChild(rounded_row);
    } else if(document.getElementById("dealprice_savings") != null){
        document.getElementById("dealprice_savings").parentElement.appendChild(rounded_row);
    }else if(document.getElementById("unifiedPrice_feature_div") != null){
        document.getElementById("unifiedPrice_feature_div").parentElement.appendChild(rounded_row);
    }
}

function add_col(label) {
    let rounded_row = document.createElement("tr");
    let rounded_row_label = document.createElement("td");
    rounded_row_label.className = "a-color-secondary a-size-base a-text-right a-nowrap";
    let bold = document.createElement("b");
    bold.textContent = label;

    rounded_row_label.appendChild(bold);
    
    let rounded_row_price = document.createElement("td");
    rounded_row_price.className = "a-span12";
    let rounded_price_span  = document.createElement("span");
    rounded_price_span.className = "a-size-medium a-color-price priceBlockDealPriceString";
    rounded_row_price.appendChild(rounded_price_span);

    rounded_row.appendChild(rounded_row_label);
    rounded_row.appendChild(rounded_price_span);

    let br = document.createElement("br");

    if (document.getElementById("priceblock_ourprice_row") != null) {
        document.getElementById("priceblock_ourprice_row").parentElement.appendChild(br);
        document.getElementById("priceblock_ourprice_row").parentElement.appendChild(rounded_row);
    } else if(document.getElementById("dealprice_savings") != null){
        document.getElementById("dealprice_savings").parentElement.appendChild(br);
        document.getElementById("dealprice_savings").parentElement.appendChild(rounded_row);
    }else if(document.getElementById("unifiedPrice_feature_div") != null){
        document.getElementById("unifiedPrice_feature_div").parentElement.appendChild(br);
        document.getElementById("unifiedPrice_feature_div").parentElement.appendChild(rounded_row);
    }
}

// adds a budget or credit card bar to the page
function add_pbar(label, balance, limit, cost) {
    let rounded_row = document.createElement("tr");
    let rounded_row_label = document.createElement("td");
    rounded_row_label.className = "a-color-secondary a-size-base a-text-right a-nowrap";
    rounded_row_label.textContent = label;
    let rounded_row_price = document.createElement("td");
    rounded_row_price.className = "a-span12";
    let rounded_price_span  = document.createElement("span");
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

    bar_before.textContent = "$" + (balance + cost).toFixed(2) + " (" + percent.toFixed(0) + "%)";
    rounded_price_span.appendChild(bar_div);
    rounded_row_price.appendChild(rounded_price_span);

    rounded_row.appendChild(rounded_row_label);
    rounded_row.appendChild(rounded_price_span);

    if (document.getElementById("priceblock_ourprice_row") != null) {
        document.getElementById("priceblock_ourprice_row").parentElement.appendChild(rounded_row);
    } else {
        document.getElementById("dealprice_savings").parentElement.appendChild(rounded_row);
    }
}

// replaces the original price with the price with tax added
function add_tax_to_price_onscreen(tax) {
    let price_id = get_price_div();
    let price = get_price()
    let p = document.getElementById(price_id);
    p.innerText = "$" + (price * (1 + tax)).toFixed(2) + " with tax";
    console.log("price adjusted.");
}

// calculates the amount of time needed to work to buy the product
function get_working_time(price, pay) {
    var hours = Math.round(Math.floor(price * 2/ pay))/2;
    hour_text = (hours == 1) ? "hour" : "hours";

    return "About " + hours + " " + hour_text;
}

// adds the product information to the page
function main(){

    let bootstrap = document.createElement("link");
    bootstrap.setAttribute("rel", "stylesheet");
    bootstrap.setAttribute("href", "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css");
    bootstrap.setAttribute("integrity", "sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T");
    bootstrap.setAttribute("crossorigin", "anonymous");
    document.getElementsByTagName('head')[0].appendChild(bootstrap);

    chrome.storage.local.get(['global_enable'], function(response) {
        if(response.global_enable == true)
        {
    var price_div = document.getElementById("priceblock_dealprice");
    if (price_div == null) {
        var price_div = document.getElementById("priceblock_ourprice");
    }
    var price_text = price_div.innerText;
    if (!(price_text.includes("-"))) {
      
        //add_price_adjustment("Rounded Price:", "$" + rounded_price(taxed(get_price())).toFixed(2));
        chrome.storage.local.get(['should_tax'], function(response)
        {
            if(response.should_tax == true)
            {
                window.addEventListener("load",function() {
                    chrome.runtime.sendMessage({item: "tax_percent"}, function(response) {
                        add_tax_to_price_onscreen(response.value);
                    })
                });
            }
        });

        chrome.storage.local.get(['should_hours'], function(response)
        {
            if(response.should_hours == true)
            {
                chrome.runtime.sendMessage({item: "hourly_wage"}, function(response) {
                    add_price_adjustment("Working Time:", get_working_time(taxed(get_price()), response.value));
                });
            }
        });
        
        chrome.storage.local.get(['should_budget'], function(response)
        {
            if(response.should_budget == true)
            {
                chrome.runtime.sendMessage({item: "budget"}, function(response) {
                    add_col("After Purchase:");
                    add_pbar("Budget Utilized", response.balance, response.limit, taxed(get_price()));
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
    console.log('exitting fiber main');
    }});
}

var price_element = document.getElementById("unifiedPrice_feature_div");
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
