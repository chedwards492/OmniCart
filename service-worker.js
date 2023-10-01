console.log("this is the service worker");

let document;

chrome.commands.onCommand.addListener((command) => {
    console.log("activated command");
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        // send the tab's url to popup.js so it can put it in the popup
        chrome.runtime.sendMessage({ message: "get-tab-url", url: tabs[0].url });
        
        // send message to content script to collect data from page - SUCCESSFUL
        chrome.tabs.sendMessage(tabs[0].id, { message: "get-item-info", po: "message sent from service worker to content"}, (response) => {
            // nothing, just trying to get rid of error message
        });

    });
});

/* this is the code that gets message from cart.js in order to get its tab.id, and then use that and so content script can send to
cart.js, but I j commented it out and cart.js still got it so ig useless. Gonna keep it here just in case, but seems that the 
content script can send messages directly to cart.js */
// let cartid;
// chrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {
//     if (message.from == "cart.js") {
//         cartid = sender.tab.id;
//         console.log("RECEIVED MESSAGE FROM CART.JS");
//     }
//     if (message.message == "send-item-info" && cartid != null) {
//         console.log("in service worker, receieved msg from cart.js & content-script");
//         console.log("now sending content-script data to cart.js");
//         chrome.tabs.sendMessage(cartid, message);
//     }
// })

// function guessTitle() {
//     console.log("guessTitle ran in service worker");
//     return "yuP";
// }