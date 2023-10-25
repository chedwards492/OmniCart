console.log("this is the service worker");




let document;

chrome.commands.onCommand.addListener((command) => {
    console.log("activated command");
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        // send the tab's url to popup.js so it can put it in the popup
        chrome.runtime.sendMessage({ message: "get-tab-url", url: tabs[0].url });
        
        // send message to content script to collect data from page - SUCCESSFUL
        chrome.tabs.sendMessage(tabs[0].id, { message: "get-item-info", url: tabs[0].url}, (response) => {
            // nothing, just trying to get rid of error message
        });

    });


    let urlPromise = chrome.tabs.query({ currentWindow: true, active: true}, (tabs) => {
        console.log(tabs[0]);
    });
    
    
    let result;
    async function getPromise() {
        result = await urlPromise;
        console.log("result should be url " + result);
    }


    return true;
});




