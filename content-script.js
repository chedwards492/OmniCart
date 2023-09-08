document.addEventListener("click", () => {
    console.log("clicked content script!!");


});

chrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {
    if (message.message == "hello") {
        console.log("received message!!! listener: " + message.url);
    }
    
});


/* this all works, it sends a message and receives it if it matches the 
 proper message and whatnot, but the sender object is just a random
 object, doesn't get the sender tab, not sure what to do about this,
 https://stackoverflow.com/questions/18436245/how-to-fetch-url-of-current-tab-in-my-chrome-extension-using-javascript
*/