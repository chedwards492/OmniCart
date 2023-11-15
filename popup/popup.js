let numItems=0;
let callPopulateCart;


(callPopulateCart = async function() {
    await populateCart();

    if (window.addEventListener("load", () => {
        let copyBtnArr = [];
        let deleteBtnArr = [];
        copyBtnArr = document.getElementsByClassName("copy-link-button");
        deleteBtnArr = document.getElementsByClassName("delete-button");
        for (let i = 0; i < deleteBtnArr.length; i++) {
            let tempCopy = copyBtnArr[i];
            tempCopy.onclick = () => {
                deleteCartItem(tempCopy);
            };
            let tempDelete = deleteBtnArr[i];
            tempDelete.onclick = () => {
                deleteCartItem(tempDelete);
            };
        }
    }));
})();




/* Initialize storage and counter of items */
chrome.storage.local.get(["items"], async (result) => {
    if (result.items == undefined) {
        chrome.storage.local.set( {items: []} );
    }
    numItems = result.items.length;
    
});

/* Listen for "Add item" command, update cart html with new item if so */
chrome.storage.onChanged.addListener( () =>  {
    chrome.storage.local.get(["items"], (result) => {
        if (numItems <= result.items.length) {
            addCartItemToInterface(result.items[result.items.length-1]);
        }
        numItems = result.items.length;
    })
});





/* Populates items into cart interface from storage. Called on startup
@return - void */
async function populateCart() {
    let arr;
    await chrome.storage.local.get(["items"], async (result) => {
        arr = await result.items
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
    const parent = document.createElement("div");
    parent.setAttribute("class", "grid-cart-item");
    document.querySelector(".grid-cart").appendChild(parent);
    await parent.insertAdjacentHTML("beforeend", 
    `
    <a href="${item.link}" target="_blank"><img src="${item.image}" alt="Product Image" class="item-img"></a>    
    <div class="grid-item-info-price"> <!--item title, price, link, etc.-->
        <div class="grid-item-info">
            <a href="${item.link}" target="_blank" class="item-title">${item.title}</a>
            <div class="item-store"></div>
            <div class="grid-delete-copy">
                <button class="delete-button"></button>
                <button class="copy-link-button">Copy link</button>
            </div>
        </div>
        <div class="item-info-price">${item.price}</div>
    </div>
    `);

    addButtonFunctionality(parent);
    getSum();
    getNumItems();
}


/* Adds copy and delete functionality to corresponding buttons 
@param - wrapper element of buttons */
function addButtonFunctionality(el) {
    let copyBtn = el.querySelector(".copy-link-button");
    copyBtn.onclick = () => {
        copyLink(copyBtn);
    }
    let deleteBtn = el.querySelector(".delete-button");
    deleteBtn.onclick = () => {
        deleteCartItem(deleteBtn);
    }
}


/* Copies item link to clipboard 
@param - the button of the specific item that was clicked */
function copyLink(val) {
    let copiedLink = val.parentElement.parentElement.firstElementChild.getAttribute("href");
    navigator.clipboard.writeText(copiedLink);
}

/* Deletes specified cart item, called by clicking trash can icon button
@param - wrapper element of trash can button */
async function deleteCartItem(val) {
    let image = val.parentElement.parentElement.parentElement.parentElement.querySelector(".item-img").getAttribute("src");
    let titleNode = val.parentElement.parentElement.parentElement.parentElement.querySelector(".item-title");
    let title = [].reduce.call(titleNode.childNodes, function(a, b) { return a + (b.nodeType === 3 ? b.textContent : ''); }, '');
    let priceNode = val.parentElement.parentElement.parentElement.parentElement.querySelector(".item-info-price");
    let price = [].reduce.call(priceNode.childNodes, function(a, b) { return a + (b.nodeType === 3 ? b.textContent : ''); }, '');
    let link = val.parentElement.parentElement.parentElement.parentElement.querySelector(".item-title").href;

    let thisObj = {
        image: image,
        link: link,
        price: price,
        title: title
    };

    val.parentElement.parentElement.parentElement.parentElement.remove();

    chrome.storage.local.get(["items"], (result) => {
        for (elm of result.items) {
            if (JSON.stringify(elm) === JSON.stringify(thisObj)) {
                let ind = result.items.indexOf(elm);
                result.items.splice(ind, 1);
                chrome.storage.local.set(result);
            }
        }
    });
    getSum();
    getNumItems();
}

/* Calculate sum of products in cart to be displayed under summary */
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
@return - integer of numebr of items just on interface
*/
function getNumItems() {
    let items = document.getElementsByClassName("grid-cart-item");
    let numItems = document.querySelector(".num-items");
    numItems.textContent = "Number of Items: " + items.length;
}

