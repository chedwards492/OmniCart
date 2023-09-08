console.log("this is the service worker");


chrome.commands.onCommand.addListener((command) => {
    console.log("activated command");

    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        console.log("the tab url: " + tabs[0].url);
        chrome.tabs.sendMessage(tabs[0].id, { message: "hello", url: tabs[0].url});
    });
});


