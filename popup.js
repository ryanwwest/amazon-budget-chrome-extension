function save() {
    chrome.storage.local.set({"global_enable": (document.getElementById("global").checked) ? true : false}, function(){
        console.log("test");
    });
    chrome.storage.local.set({"should_tax": (document.getElementById("tax").checked) ? true : false}, function(){
        console.log("test");
    });
    chrome.storage.local.set({"should_budget": (document.getElementById("budget").checked) ? true : false}, function(){
        console.log("test");
    });
    chrome.storage.local.set({"should_card": (document.getElementById("card").checked) ? true : false}, function(){
        console.log("test");
    });
    chrome.storage.local.set({"should_hours": (document.getElementById("hours").checked) ? true : false}, function(){
        console.log("test");
    });

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
       chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
   });
}

function global() {
    console.log("test");
    document.getElementById("tax").disabled = !document.getElementById("global").checked;
    document.getElementById("budget").disabled = !document.getElementById("global").checked;
    document.getElementById("card").disabled = !document.getElementById("global").checked;
    document.getElementById("hours").disabled = !document.getElementById("global").checked;
}

function load() {
    console.log("test");
    $("#save-alert").hide();

    chrome.storage.local.get(['global_enable'], function(result) {
        if(result.global_enable == null){
            chrome.storage.local.set({"global_enable": true}, function(){
                document.getElementById("global").checked = true;
                global();
            });
        }
        else{
            document.getElementById("global").checked = result.global_enable;
            global();
        }
    });

    chrome.storage.local.get(['should_tax'], function(result) {
        if(result.should_tax == null){
            chrome.storage.local.set({"should_tax": true}, function(){
                document.getElementById("tax").checked = true;
            });
        }
        else{
            document.getElementById("tax").checked = result.should_tax;
        }
    });

    chrome.storage.local.get(['should_budget'], function(result) {
        if(result.should_budget == null){
            chrome.storage.local.set({"should_budget": true}, function(){
                document.getElementById("budget").checked = true;
            });
        }
        else{
            document.getElementById("budget").checked = result.should_budget;
        }
    });

    chrome.storage.local.get(['should_card'], function(result) {
        if(result.should_card == null){
            chrome.storage.local.set({"should_card": true}, function(){
                document.getElementById("card").checked = true;
            });
        }
        else{
            document.getElementById("card").checked = result.should_card;
        }
    });

    chrome.storage.local.get(['should_hours'], function(result) {
        if(result.should_hours == null){
            chrome.storage.local.set({"should_hours": true}, function(){
                document.getElementById("hours").checked = true;
            });
        }
        else{
            document.getElementById("hours").checked = result.should_hours;
        }
    });

    global();

    document.getElementById("save").addEventListener('click', function() {
        console.log("Test");
        save();
        $("#save-alert").fadeIn().delay(1200).fadeOut();
    });

    document.getElementById("global").addEventListener('click', function() {
        global();
    });

}

document.addEventListener("DOMContentLoaded", function(){ load(); }, false);
