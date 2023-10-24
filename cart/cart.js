let numItems=0;
populateCart();
//getSum();
let btn = document.querySelector(".delete-button");
function onButtonClick() {
    alert('yup clicked');
}


if (window.addEventListener("load", () => {
    console.log("loaded");
    let deleteBtnArr = [];
    deleteBtnArr = document.getElementsByClassName("delete-button");
    for (let i = 0; i < deleteBtnArr.length; i++) {
        console.log("adding delete functionality to: " + deleteBtnArr[i].parentElement.parentElement.querySelector(".item-title").textContent);
        deleteBtnArr[i].onclick = () => {
            deleteCartItem(deleteBtnArr[i]);
        };
    }
}));



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
    console.log("Storage Changed.");
    chrome.storage.local.get(["items"], (result) => {
        if (numItems <= result.items.length) {
            addCartItemToInterface(result.items[result.items.length-1]);
        }
        numItems = result.items.length;
        console.log("new numItems " + numItems);
    })
});





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
                numItems++;
            }
        }
    });
}


/* Adds html for parameter item. Does not change storage.local
@return - void
@param - item: the item to add to the cart */
async function addCartItemToInterface(item) {
    console.log("addCartItemToInteface() ran");
    await document.querySelector(".grid-cart").insertAdjacentHTML("beforeend", 
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
//asdf
    let temp = [];
    let deleteBtnArr = [];
    temp = document.getElementsByClassName("delete-button");
    console.log("deleteBtnArr: " + deleteBtnArr);
    for (btn of temp) {
        if (!!( btn.offsetWidth || btn.offsetHeight || btn.getClientRects().length)) {
            deleteBtnArr.push(btn);
        }
    }
    for (let i = 0; i < deleteBtnArr.length; i++) {
        if (typeof btn.onclick != "deleteCartItem") {
            console.log("adding delete functionality to: " + deleteBtnArr[i].parentElement.parentElement.querySelector(".item-title").textContent);
            deleteBtnArr[i].onclick = () => {
                deleteCartItem(deleteBtnArr[i]);
            };
        }
    }   
    //getSum();
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
    // console.log("val.parentElement" + val.parentElement);
    // console.log("val.parentElement.parentElement" + JSON.stringify(val.parentElement.parentElement));
    // console.log("deleteCartItem ran, val: " + val.parentElement.parentElement.querySelector(".item-title").textContent);
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

    console.log("1");

    val.parentElement.parentElement.parentElement.parentElement.remove();

    console.log("2");

    chrome.storage.local.get(["items"], (result) => {
        console.log("result.items: " + JSON.stringify(result.items));
        console.log("thisObj: " + JSON.stringify(thisObj));
        console.log("3");
        for (elm of result.items) {
            console.log("elm: " + JSON.stringify(elm));
            if (JSON.stringify(elm) === JSON.stringify(thisObj)) {
                console.log("4");
                let ind = result.items.indexOf(elm);
                result.items.splice(ind, 1);
                chrome.storage.local.set(result);
            }
        }
    });
    //getSum();
}

/* Calculates and updates the sum total. 
This is an inexpensive procedure but it could be made more efficient.
Runs whenever anything is deleted or added to cart. */
function getSum() {
    let prices = document.getElementsByClassName("item-info-price");
    let sum = 0;
    for (let i = 0; i < prices.length; i++) {
        sum += parseInt(prices[i].textContent.match(/(\d+)/));
    }
    let total = document.querySelector(".sum-total");
    total.textContent = "Total: $" + sum;
}

/* Gets the number of items on the interface itself
Returns - integer of numebr of items just on interface
*/
function getNumItems() {
    let items = document.getElementsByClassName("grid-cart-item");
    alert(items.length);
    return items.length;
}