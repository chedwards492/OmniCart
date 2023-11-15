/* Add command listener for shortcut Cmd+Shift+K */
chrome.commands.onCommand.addListener((command) => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        //send tab url to popup interface
        chrome.runtime.sendMessage({ message: "get-tab-url", url: tabs[0].url });
        // send instruction to content script to collect data from page
        chrome.tabs.sendMessage(tabs[0].id, { message: "get-item-info", url: tabs[0].url}, (response) => {
        });

    });

    let urlPromise = chrome.tabs.query({ currentWindow: true, active: true}, (tabs) => {
    });
    
    let result;
    async function getPromise() {
        result = await urlPromise;
    }

    return true;
});




