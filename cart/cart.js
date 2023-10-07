let btn = document.querySelector(".delete-button");

function onButtonClick() {
    alert('yup clicked');
}

// let cartItems = [{title: "thing1", image: "something.png", price: "$69.69"}, {title: "thing2", image: "something2.png", price: "900.99"}];
/* workflow:
onStartup, need to populate the cart with all our items, should be an array cartItems of {title, image, price} objects
when user hotkeys and adds item to cartItems[].*/


// chrome.storage.local.get(["items"], async (result) => {
//     console.log("POOPPPPyyyyy: " + JSON.stringify(result));
//     if (result.items == undefined) {
//         await chrome.storage.local.set( {items: []} )
//     }
// });

/* Problem I got is that I need cartItems to be an array that can be accessed globally, but I need it to not be initialized everytime I open the cart interface, cuz
it's resetting it to undefined and deleting all the items from it, so maybe call from different script, or on a specific event..? idk */


chrome.storage.local.get(["items"], async (result) => {
    console.log("result: " + JSON.stringify(result) + " yu " + result.items);
    if (result.items == undefined) {
        chrome.storage.local.set( {items: []} );
        console.log("initialized backend array");
    }
});

populateCart();

//chrome.storage.local.remove("items");

/* Receives message from content script. Saves item information  */
let guessedItem;
chrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {
    if (message.message == "send-item-info") {
        guessedItem = message.item;
        addCartItemToInterface(guessedItem); // could maybe replace this with a storage.onChanged event, but then i'd have to check
    }
    sendResponse({x: true});
    return true;
});


/* GOT IT working for the most part. It still can't call it when cart.js is not running, cuz i send something to it when command is pressed. I think I could do like, when 
command is pressed, fine, call addCartItem() to add it the storage. Then in cart.js, I have a storage.onChanged listener, that just adds any object that has not yet been 
added. Seems difficult to get around this idk */


/* Populates items into cart interface from storage. Called on startup
@return - void */
async function populateCart() {
    console.log("populateCart() ran");
    let arr;
    await chrome.storage.local.get(["items"], async (result) => {
        arr = await result.items
        console.log("populateCart() arr: " + result.items);
        if (arr.length != 0) {
            for (let item of arr) {
                addCartItemToInterface(item);
            }
        }
    });
}


/* Adds html for parameter item. Only called in popoulateCart()
@return - void
@param - item: the item to add to the cart */
function addCartItemToInterface(item) {
    console.log("addCartItemToInteface() ran");
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