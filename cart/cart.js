let btn = document.querySelector(".delete-button");

function onButtonClick() {
    alert('yup clicked');
}


// this receives message directly from content-script; no going through service-worker, and works correctly
chrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {
    if (message.message == "send-item-info") {
        console.log("SUCCESSFULY RECEIVED DATA FROM CONTENT SCRIPT here's the title: " + message.title);
    }
    sendResponse("yup");
    return true;
})


chrome.runtime.sendMessage( {from: "cart.js"} );





/* this alerts properly but the link does not acc get copied to my clipboard, might just be b/c it's a live server tho so idk 
    https://stackoverflow.com/questions/52054635/copy-clipboard-function-working-locally-but-not-working-server */
function copyLink(val) {
    let copiedLink = val.parentElement.parentElement.firstElementChild.getAttribute("href");
    //alert("HELLOOOO" + copiedLink);

    navigator.clipboard.writeText(copiedLink);

    alert("copied the link: " + copiedLink);
}

/* Deletes specified cart item - trash can button */
function deleteCartItem(val) {
    val.parentElement.parentElement.parentElement.parentElement.remove();

}

/* table this cuz I need a way to get the price out of the item */
function getSum() {
    let prices = document.getElementsByClassName("item-info-price");
    let sum = 0;
    for (let i = 0; i < prices.length; i++) {
        sum += prices[i].textContent;
    }
    alert(prices[0].textContent);
    return sum;
}

// works
function getNumItems() {
    let items = document.getElementsByClassName("grid-cart-item");
    alert(items.length);
    return items.length;
}

function generateItem() {

}