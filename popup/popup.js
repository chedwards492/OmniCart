const setBadgeElement = document.querySelector(".box2 p");

document.addEventListener("click", () => {
    console.log("clicked the popup");
});

window.addEventListener('DOMContentLoaded', () => {

})

// listen for the current tab url sent from service worker
chrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {
    if (message.message == "get-tab-url") {
        console.log("received message!!! curr tab's url: " + message.url);
        setBadgeElement.textContent = message.url;
    }
    
});

