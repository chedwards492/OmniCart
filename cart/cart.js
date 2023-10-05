let btn = document.querySelector(".delete-button");

function onButtonClick() {
    alert('yup clicked');
}




/* Am gonna need to do this in a whole async function, cuz we have to receive the info before we put it into the page,
so gotta figure this out */


// this receives message directly from content-script; no going through service-worker, and works correctly
let guessedTitle;
chrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {
    if (message.message == "send-item-info") {
        console.log("SUCCESSFULY RECEIVED DATA FROM CONTENT SCRIPT here's the title: " + message.title);
        guessedTitle = message.title;
    }
    sendResponse("yup");
    return true;
})


chrome.runtime.sendMessage( {from: "cart.js"} );

// document.querySelector(".h1-title").style.color = "red";
document.querySelector(".grid-cart").insertAdjacentHTML("beforeend", 
`   <div class="grid-cart-item">
        <a href="https://www.google.com" target="_blank">'<img src="" alt="Product Image" class="item-img"></a>    
        <div class="grid-item-info-price"> <!--item title, price, link, etc.-->
            <div class="grid-item-info">
                <a href="https://www.google.com" target="_blank" class="item-title">asefsef</a>
                <div class="item-store"></div>
                <div class="grid-delete-copy">
                    <button class="delete-button" onclick="deleteCartItem(this)"></button>
                    <button class="copy-link-btn" onclick="copyLink(this)">Copy link</button>
                </div>
            </div>
            <div class="item-info-price">$100.00</div>
        </div>
    </div>
    `);
console.log("boutta add the title");
document.querySelector(".grid-cart").lastChild.querySelector("a.item-title").textContent = guessedTitle;




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