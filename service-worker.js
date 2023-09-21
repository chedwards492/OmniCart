console.log("this is the service worker");

let document;


chrome.commands.onCommand.addListener((command) => {
    console.log("activated command");
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        // send the tab's url to popup.js so it can put it in the popup
        chrome.runtime.sendMessage({ message: "get-tab-url", url: tabs[0].url });

        /* I dunno if this works or even necessary
        chrome.tabs.sendMessage(tabs[0].id, { message: "get-item-info", po: "waddup"},
            (response) => {
                console.log("here is the response: " + response.response);
                document = response.response;
            }); // send messages to content script specifically
        */
        
        // send message to content script to collect data from page - SUCCESSFUL
        chrome.tabs.sendMessage(tabs[0].id, { message: "get-item-info", po: "message sent from service worker to content"});

    });
});


// function guessTitle() {
//     console.log("guessTitle ran in service worker");
//     return "yuP";
// }