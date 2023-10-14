let btn = document.querySelector(".delete-button");
let numItems=0;
function onButtonClick() {
    alert('yup clicked');
}

if (window.addEventListener("load", () => {
    let deleteBtnArr = [];
    deleteBtnArr = document.getElementsByClassName("delete-button");
    for (btn of deleteBtnArr) {
        btn.onclick = () => {
            deleteCartItem(btn);
        };
    }
}));
// let deleteBtnArr = [];
// deleteBtnArr = document.getElementsByClassName("delete-button");
// console.log("deleteBtnArr: " + JSON.stringify(deleteBtnArr));
// console.log("here: " + JSON.stringify(document.querySelector(".delete-button")));

// deleteBtn.addEventListener("click", () => {
//     alert("delete button clicked");
// });

// deleteBtn.addEventListener("click", deleteCartItem(deleteBtn));


chrome.storage.local.get(["items"], async (result) => {
    console.log("set items");
    if (result.items == undefined) {
        chrome.storage.local.set( {items: []} );
        console.log("initialized backend array");
    }
    numItems = result.items.length;
    console.log("numItems: " + numItems);
    
});

/* Listen for "Add item" command, update cart html with new item if so */

chrome.storage.onChanged.addListener( () =>  {
    chrome.storage.local.get(["items"], (result) => {
        if (numItems <= result.items.length) {
            addCartItemToInterface(result.items[result.items.length-1]);
        }
        numItems = result.items.length;
        console.log("new numItems " + numItems);
    })
});






populateCart();


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


/* Adds html for parameter item. Does not change storage.local
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
                    <button class="delete-button"></button>
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

/* strange behavior when trying to delete. seems like the storage gets updated like it should with numItems and such, and things getting
added work fine(?) but deleting is weird and it deletes the item below itself instead. just debug */
/* Deletes specified cart item - trash can button */
function deleteCartItem(val) {
    console.log("deleteCartItem running");
    let image = val.parentElement.parentElement.parentElement.parentElement.querySelector(".item-img").getAttribute("src");
    let titleNode = val.parentElement.parentElement.parentElement.parentElement.querySelector(".item-title");
    let title = [].reduce.call(titleNode.childNodes, function(a, b) { return a + (b.nodeType === 3 ? b.textContent : ''); }, '');
    let priceNode = val.parentElement.parentElement.parentElement.parentElement.querySelector(".item-info-price");
    let price = [].reduce.call(priceNode.childNodes, function(a, b) { return a + (b.nodeType === 3 ? b.textContent : ''); }, '');
    
    let thisObj = {
        image: image,
        price: price,
        title: title
    };

    chrome.storage.local.get(["items"], (result) => {
        for (elm of result.items) {
            console.log(JSON.stringify("object in local storage: " + elm));
            console.log(JSON.stringify(elm) + " " + JSON.stringify(thisObj));
            if (JSON.stringify(elm) === JSON.stringify(thisObj)) {
                let ind = result.items.indexOf(elm);
                result.items.splice(ind, 1);
                chrome.storage.local.set(result);
                numItems--;
            }
        }
    });


    // removes from html
    // val.parentElement.parentElement.parentElement.parentElement.remove();

    // also need to get the item out of storage
    


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

/* Gets the number of items on the interface itself
Returns - integer of numebr of items just on interface
*/
function getNumItems() {
    let items = document.getElementsByClassName("grid-cart-item");
    alert(items.length);
    return items.length;
}