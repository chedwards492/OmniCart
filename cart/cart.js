//chrome.storage.local.clear();
let numItems=0;
let callPopulateCart;
(callPopulateCart = async function() {
    await populateCart();


    if (window.addEventListener("load", () => {
        console.log("loaded");
        let deleteBtnArr = [];
        deleteBtnArr = document.getElementsByClassName("delete-button");
        for (let i = 0; i < deleteBtnArr.length; i++) {
            console.log("adding delete functionality to: " + deleteBtnArr[i].parentElement.parentElement.querySelector(".item-title").textContent);
            let temp = deleteBtnArr[i];
            temp.onclick = () => {

                deleteCartItem(temp);
            };
        }
    }));
})();

function printsl() {
    chrome.storage.local.get(["items"], (result) => {
        console.log(result.items);
    })
}





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
        console.log("result.items " + JSON.stringify(result.items));
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

/* there's definitely some indexing issue with delete stuff, cuz when it gets down to the last item, it's null, and occasionally
I try to delete the top element and it deletes the one just below, might wanna think about scrapping the current process cuz there's
gotta be a better way to go about this? idk 

****DO THIS***  Might wanna think about inserting the elements in a different way, like maybe create the grid-cart-item element using 
document.createElement or whatever so that we have that object, then insertAdjacentHtml, and then you'll have all the item info
plus the actual item itself, and you can just find the btn within that object and set the function or whatever yeah do this 
*/


/* Adds html for parameter item. Does not change storage.local
@return - void
@param - item: the item to add to the cart */
async function addCartItemToInterface(item) {
    console.log("addCartItemToInteface() ran");
    const parent = document.createElement("div");
    parent.setAttribute("class", "grid-cart-item");
    document.querySelector(".grid-cart").appendChild(parent);
    await parent.insertAdjacentHTML("beforeend", 
    `
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
    `);

    console.log("parent: " + JSON.stringify(parent));
    addDeleteFunctionality(parent);
    getSum();
    getNumItems();
}

/* Adds the deleteCartItem function to buttons that do not have defined functionality */
// function addDeleteFunctionality() {
//     let temp = [];
//     let deleteBtnArr = [];
//     temp = document.getElementsByClassName("delete-button");
//     for (btn of temp) {
//         if (!!( btn.offsetWidth || btn.offsetHeight || btn.getClientRects().length)) {
//             deleteBtnArr.push(btn);
//         }
//     }
//     console.log("deleteBtnArr.length: " + deleteBtnArr.length);
//     for (let i = 0; i < deleteBtnArr.length; i++) {
//         console.log("onclick: " + deleteBtnArr[i].onclick);
//         console.log("deleteBtnArr[i]: " + deleteBtnArr[i]);
//         if (deleteBtnArr[i].onclick == null) {
//             console.log("adding delete functionality to: " + deleteBtnArr[i].parentElement.parentElement.querySelector(".item-title").textContent);
//             deleteBtnArr[i].onclick = () => {
//                 deleteCartItem(deleteBtnArr[i]);
//             };
//         }
//     }
// }

function addDeleteFunctionality(el) {
    let btn = el.querySelector(".delete-button");
    console.log("adding delete functionality to: " + btn.parentElement.parentElement.querySelector(".item-title").textContent);
    btn.onclick = () => {
        deleteCartItem(btn);
    }
}


/* this alerts properly but the link does not acc get copied to my clipboard, might just be b/c it's a live server tho so idk 
    https://stackoverflow.com/questions/52054635/copy-clipboard-function-working-locally-but-not-working-server */
function copyLink(val) {
    let copiedLink = val.parentElement.parentElement.firstElementChild.getAttribute("href");
    //alert("HELLOOOO" + copiedLink);

    navigator.clipboard.writeText(copiedLink);

    alert("copied the link: " + copiedLink);
}

/* delete has issues when you add some stuff to cart, close the tab, then open it back up and try deleting things, parentElement 
undefined is the consistent error */

/* Deletes specified cart item - trash can button */
async function deleteCartItem(val) {
    // if (val == undefined || val == null) {
    //     await location.reload();
    //     deleteCartItem(val);
    // }
    console.log("val: " + val + "json val: " + JSON.stringify(val));
    console.log("val.parentElement" + val.parentElement);
    console.log("val.parentElement.parentElement" + JSON.stringify(val.parentElement.parentElement));
    console.log("deleteCartItem ran, val: " + val.parentElement.parentElement.querySelector(".item-title").textContent);
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

    val.parentElement.parentElement.parentElement.parentElement.remove();

    chrome.storage.local.get(["items"], (result) => {
        console.log("result.items: " + JSON.stringify(result.items));
        console.log("thisObj: " + JSON.stringify(thisObj));
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
    getSum();
    getNumItems();
}

/* table this cuz I need a way to get the price out of the item */
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
    let numItems = document.querySelector(".num-items");
    numItems.textContent = "Number of Items: " + items.length;
}