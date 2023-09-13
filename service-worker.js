console.log("this is the service worker");



chrome.commands.onCommand.addListener((command) => {
    console.log("activated command");
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        
        // send the tab's url to popup.js so it can put it in the popup
        chrome.runtime.sendMessage({ message: "get-tab-url", url: tabs[0].url });
    });
});

/*
chrome.tabs.sendMessage(tabs[0].id, { message: "hello", url: tabs[0].url}); // send messages to content script specifically
*/
