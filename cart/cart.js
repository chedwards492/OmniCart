let btn = document.querySelector(".delete-button");

function onButtonClick() {
    alert('yup clicked');
}


/* Receives message from content script. Saves item information  */
let guessedItem;
chrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {
    if (message.message == "send-item-info") {
        guessedItem = message.item;
    
        console.log(guessedItem);
        
        chrome.storage.local.get(["items"]).finally(result => console.log("RESULT: " + result));
        if ( (chrome.storage.local.get(["items"], (result) => {return result; })) == null) {
            console.log("could not find any items");
        }
        
        addCartItem(guessedItem);
    }
    return true;
})

/* on run, need to populate the cart with the items, and when i add an item, need to put it in storage */


// chrome.runtime.sendMessage( {from: "cart.js"} );

// document.querySelector(".h1-title").style.color = "red";
function addCartItem(item) {
    document.querySelector(".grid-cart").insertAdjacentHTML("beforeend", 
    `
    <div class="grid-cart-item">
        <a href="https://www.google.com" target="_blank">'<img src="${item.image}" alt="Product Image" class="item-img"></a>    
        <div class="grid-item-info-price"> <!--item title, price, link, etc.-->
            <div class="grid-item-info">
                <a href="https://www.google.com" target="_blank" class="item-title">${item.title}</a>
                <div class="item-store"></div>
                <div class="grid-delete-copy">
                    <button class="delete-button" onclick="deleteCartItem(this)"></button>
                    <button class="copy-link-btn" onclick="copyLink(this)">Copy link</button>
                </div>
            </div>
            <div class="item-info-price">${item.price}</div>
        </div>
    </div>
    `);
}





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