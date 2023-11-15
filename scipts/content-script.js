/* Receive message from service worker upon command
    Runs guess functions and sends to cart.js */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => { 
    if (message.message = "get-item-info") {
        let link = message.url;
        let callGetItem;
        (callGetItem = async function() {
            let item = await getItem(link);
            addCartItem(item);
        })();
    }


    sendResponse({y: true});
    return true;
});


/* Called on shortcut command. Guesses item information
@return - object with guessed item information 
@param - the link to the item page sent from service worker, used as link property in returned object */
async function getItem(thisLink) {
    let title = await guessTitle();
    let image = await guessImage(title);
    let price = await guessPrice();
    let link = thisLink;
    return {
        title: title, image: image, price: price, link: link
    };
}

/* Adds item to underlying cartItems array. Adds item to shopping cart interface 
@return - void 
@param - newItem: the item object to add to cart */
function addCartItem(newItem) {
    chrome.storage.local.get(["items"], (result) => {
        if (typeof(result.items) != undefined && result.items instanceof Array) {
            result.items.push(newItem);
        }
        chrome.storage.local.set(result);
    });
}

const PROD = "product";
const ITEM = "item";
const NAME = "name";
const TITLE = "title";
const H1 = "H1";
const H2 = "H2";
const H3 = "H3";

/* Guesses the product title 
@return - string of the guessed product title */
function guessTitle() {

    let potentialNodes = []; 
    let aNodes = document.getElementsByTagName("*");
    for (let k = 0; k < aNodes.length; k++) {
        if (containsDirectText(aNodes[k])) {
            potentialNodes.push(aNodes[k]);
        }
    }

    let tNodes = potentialNodes.filter(x => x.offsetWidth !== 0 || x.offsetHeight !== 0);

    for (let i = 0; i < tNodes.length; i++) {        
        if ( ( ( (tNodes[i].className != null && (typeof tNodes[i].className == "string")) && ( (tNodes[i].className.toLowerCase().includes(PROD) && tNodes[i].className.toLowerCase().includes(TITLE)) ||
        (tNodes[i].className.toLowerCase().includes(PROD) && tNodes[i].className.toLowerCase().includes(NAME)) ||
        (tNodes[i].className.toLowerCase().includes(ITEM) && tNodes[i].className.toLowerCase().includes(TITLE)) ||
        (tNodes[i].className.toLowerCase().includes(ITEM) && tNodes[i].className.toLowerCase().includes(NAME)) ) ) ||

        ((tNodes[i].id != null && (typeof tNodes[i].id == "string")) && ( (tNodes[i].id.toLowerCase().includes(PROD) && tNodes[i].id.toLowerCase().includes(TITLE)) ||
        (tNodes[i].id.toLowerCase().includes(PROD) && tNodes[i].id.toLowerCase().includes(NAME)) ||
        (tNodes[i].id.toLowerCase().includes(ITEM) && tNodes[i].id.toLowerCase().includes(TITLE)) ||
        (tNodes[i].id.toLowerCase().includes(ITEM) && tNodes[i].id.toLowerCase().includes(NAME)) ) ) ) &&

        ( tNodes[i].tagName.toLowerCase() == H1 || 
        tNodes[i].tagName.toLowerCase() == H2 || 
        tNodes[i].tagName.toLowerCase() == H3 )) 
        {
            return tNodes[i].textContent.trim();
            
        }
    }
    
    for (let i = 0; i < tNodes.length; i++) {
        if ( ( (tNodes[i].className != null && (typeof tNodes[i].className == "string") ) && ( (tNodes[i].className.toLowerCase().includes(PROD) && tNodes[i].className.toLowerCase().includes(ITEM) && tNodes[i].className.toLowerCase().includes(NAME)) || 
                (tNodes[i].className.toLowerCase().includes(PROD) && tNodes[i].className.toLowerCase().includes(ITEM) && tNodes[i].className.toLowerCase().includes(TITLE)) ) ) ||
                ( (tNodes[i].id != null && (typeof tNodes[i].id == "string")) && ( (tNodes[i].id.toLowerCase().includes(PROD) && tNodes[i].id.toLowerCase().includes(ITEM) && tNodes[i].id.toLowerCase().includes(NAME)) || 
                (tNodes[i].id.toLowerCase().includes(PROD) && tNodes[i].id.toLowerCase().includes(ITEM) && tNodes[i].id.toLowerCase().includes(TITLE)) ) ) ) {
            if ((window.scrollY + tNodes[i].getBoundingClientRect().top) < 600) {
                return tNodes[i].textContent.trim();;
            }
                    
        }
    }
    
    for (let i = 0; i < tNodes.length; i++) {
        if ( ( ( (tNodes[i].className != null && (typeof tNodes[i].className == "string")) && ( (tNodes[i].className.toLowerCase().includes(PROD) && tNodes[i].className.toLowerCase().includes(TITLE)) ||
                (tNodes[i].className.toLowerCase().includes(PROD) && tNodes[i].className.toLowerCase().includes(NAME)) ||
                (tNodes[i].className.toLowerCase().includes(ITEM) && tNodes[i].className.toLowerCase().includes(TITLE)) ||
                (tNodes[i].className.toLowerCase().includes(ITEM) && tNodes[i].className.toLowerCase().includes(NAME)) ) ) ||

                ( (tNodes[i].id != null && (typeof tNodes[i].id == "string")) && ( (tNodes[i].id.toLowerCase().includes(PROD) && tNodes[i].id.toLowerCase().includes(TITLE)) ||
                (tNodes[i].id.toLowerCase().includes(PROD) && tNodes[i].id.toLowerCase().includes(NAME)) ||
                (tNodes[i].id.toLowerCase().includes(ITEM) && tNodes[i].id.toLowerCase().includes(TITLE)) ||
                (tNodes[i].id.toLowerCase().includes(ITEM) && tNodes[i].id.toLowerCase().includes(NAME)) ) ) ) &&

                ( tNodes[i].tagName == H1 || 
                tNodes[i].tagName == H2) ) { 
            return tNodes[i].textContent.trim();
            
        }
    }

    let potentialAllNodes = document.getElementsByTagName("*");
    let allNodes = [];
    for (let k = 0; k < potentialAllNodes.length; k++) {
        if (isVisible(potentialAllNodes[k])) {
            allNodes.push(potentialAllNodes[k]);
        }
    }
    
    for (let i = 0; i < allNodes.length; i++) {
        if ( ( ( (allNodes[i].className != null && (typeof allNodes[i].className == "string")) && 
            ( (allNodes[i].className.toLowerCase().includes(PROD) && allNodes[i].className.toLowerCase().includes(TITLE)) ||
            (allNodes[i].className.toLowerCase().includes(PROD) && allNodes[i].className.toLowerCase().includes(NAME)) ||
            (allNodes[i].className.toLowerCase().includes(ITEM) && allNodes[i].className.toLowerCase().includes(TITLE)) ||
            (allNodes[i].className.toLowerCase().includes(ITEM) && allNodes[i].className.toLowerCase().includes(NAME)) ) ) ||

            ( (allNodes[i].id != null && (typeof allNodes[i].id == "string")) && 
            ( (allNodes[i].id.toLowerCase().includes(PROD) && allNodes[i].id.toLowerCase().includes(TITLE)) ||
            (allNodes[i].id.toLowerCase().includes(PROD) && allNodes[i].id.toLowerCase().includes(NAME)) ||
            (allNodes[i].id.toLowerCase().includes(ITEM) && allNodes[i].id.toLowerCase().includes(TITLE)) ||
            (allNodes[i].id.toLowerCase().includes(ITEM) && allNodes[i].id.toLowerCase().includes(NAME)) ) ) ) &&

            (allNodes[i].tagName == H1 || 
            allNodes[i].tagName == H2) ) {

            if (allNodes[i].textContent != null) {
                if ((window.scrollY + allNodes[i].getBoundingClientRect().top) < 600) {
                    return allNodes[i].textContent.trim();
                }
            }
        }
    }

    for (let i = 0; i < tNodes.length; i++) {
        if ( ( ( (tNodes[i].className != null && (typeof tNodes[i].className == "string")) && ( (tNodes[i].className.toLowerCase().includes(PROD) && tNodes[i].className.toLowerCase().includes(TITLE)) ||
                (tNodes[i].className.toLowerCase().includes(PROD) && tNodes[i].className.toLowerCase().includes(NAME)) ||
                (tNodes[i].className.toLowerCase().includes(ITEM) && tNodes[i].className.toLowerCase().includes(TITLE)) ||
                (tNodes[i].className.toLowerCase().includes(ITEM) && tNodes[i].className.toLowerCase().includes(NAME)) ) ) ||

                ( (tNodes[i].id != null && (typeof tNodes[i].id == "string")) && ( (tNodes[i].id.toLowerCase().includes(PROD) && tNodes[i].id.toLowerCase().includes(TITLE)) ||
                (tNodes[i].id.toLowerCase().includes(PROD) && tNodes[i].id.toLowerCase().includes(NAME)) ||
                (tNodes[i].id.toLowerCase().includes(ITEM) && tNodes[i].id.toLowerCase().includes(TITLE)) ||
                (tNodes[i].id.toLowerCase().includes(ITEM) && tNodes[i].id.toLowerCase().includes(NAME)) ) ) ) &&

                (tNodes[i].tagName == H3 ) ) {
            if ((window.scrollY + tNodes[i].getBoundingClientRect().top) < 600) {
                return tNodes[i].textContent.trim();
            }
        }
    }

    for (let i = 0; i < allNodes.length; i++) {
        if ( ( ( (allNodes[i].className != null && (typeof allNodes[i].className == "string")) && 
            ( (allNodes[i].className.toLowerCase().includes(PROD) && allNodes[i].className.toLowerCase().includes(TITLE)) ||
            (allNodes[i].className.toLowerCase().includes(PROD) && allNodes[i].className.toLowerCase().includes(NAME)) ||
            (allNodes[i].className.toLowerCase().includes(ITEM) && allNodes[i].className.toLowerCase().includes(TITLE)) ||
            (allNodes[i].className.toLowerCase().includes(ITEM) && allNodes[i].className.toLowerCase().includes(NAME)) ) ) ||

            ( (allNodes[i].id != null && (typeof allNodes[i].id == "string")) && 
            ( (allNodes[i].id.toLowerCase().includes(PROD) && allNodes[i].id.toLowerCase().includes(TITLE)) ||
            (allNodes[i].id.toLowerCase().includes(PROD) && allNodes[i].id.toLowerCase().includes(NAME)) ||
            (allNodes[i].id.toLowerCase().includes(ITEM) && allNodes[i].id.toLowerCase().includes(TITLE)) ||
            (allNodes[i].id.toLowerCase().includes(ITEM) && allNodes[i].id.toLowerCase().includes(NAME)) ) ) ) &&

            (allNodes[i].tagName == H1 || 
            allNodes[i].tagName == H2) ) {

            if (allNodes[i].textContent != null) {
                if ((window.scrollY + allNodes[i].getBoundingClientRect().top) < 600) {
                    return allNodes[i].textContent.trim();
                }
            }
        }
    }

    for (let i = 0; i < tNodes.length; i++) {
        if ( ( (tNodes[i].className != null && (typeof tNodes[i].className == "string")) && 
            ( (tNodes[i].className.toLowerCase().includes(PROD) && tNodes[i].className.toLowerCase().includes(TITLE)) ||
                (tNodes[i].className.toLowerCase().includes(PROD) && tNodes[i].className.toLowerCase().includes(NAME)) ||
                (tNodes[i].className.toLowerCase().includes(ITEM) && tNodes[i].className.toLowerCase().includes(TITLE)) ||
                (tNodes[i].className.toLowerCase().includes(ITEM) && tNodes[i].className.toLowerCase().includes(NAME)) ) ) ||

                ( (tNodes[i].id != null && (typeof tNodes[i].id == "string")) && 
                ( (tNodes[i].id.toLowerCase().includes(PROD) && tNodes[i].id.toLowerCase().includes(TITLE)) ||
                (tNodes[i].id.toLowerCase().includes(PROD) && tNodes[i].id.toLowerCase().includes(NAME)) ||
                (tNodes[i].id.toLowerCase().includes(ITEM) && tNodes[i].id.toLowerCase().includes(TITLE)) ||
                (tNodes[i].id.toLowerCase().includes(ITEM) && tNodes[i].id.toLowerCase().includes(NAME)) ) ) ) {
            if ((window.scrollY + tNodes[i].getBoundingClientRect().top) < 600) {
                return tNodes[i].textContent.trim();
            }
        }
    }
    

    

    for (let i = 0; i < allNodes.length; i++) {
        if (allNodes[i].tagName == H1 || allNodes[i].tagName == H2 || allNodes[i].tagName == H3) {
            if (allNodes[i].textContent != null) {
                if ((window.scrollY + allNodes[i].getBoundingClientRect().top) < 600) {
                    return allNodes[i].textContent.trim();
                }
            }
        }
    }

    let str = "No Title Found";
    return str;
}

/* Determines whether a node contains direct text content
@returns boolean value true if node contains direct text content */
function containsDirectText(el) {
    return [...el.childNodes]
        .some(n => n.nodeType === Node.TEXT_NODE
              && n.nodeValue.trim() !== '');
  }

/* Grabs all text nodes under a node
@returns - array of text nodes under parameter node
@param - the ancestor of all text nodes to be retrieved */
function textNodesUnder(el) {
    let n, a = [], walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while(n=walk.nextNode()) a.push(n);
    return a;
}

/* Guesses the product image
@returns - the src attribute of the img node, null otherwise
@param - the returned guessed title from function guessTitle */
function guessImage(name) {
    let imgs = document.getElementsByTagName("img");

    
    for (let i = 0; i < imgs.length; i++) {
        let img = imgs[i];
        if (isVisible(img) && ((window.scrollY + img.getBoundingClientRect().top) < 400) &&
            img.width > 400 && img.height > 400) {
            return img.src;
        }
    }

    for (let i = 0; i < imgs.length; i++) {
        let img = imgs[i];
        if (isVisible(img)) {
            let str1 = name.substring(0, (name.length)/4);
            let str2 = name.substring((name.length)/4, (name.length)/2);
            let str3 = name.substring((name.length)/2, ((name.length)*(3/4)));
            let str4 = name.substring(((name.length)*(3/4)), name.length);
            if (img.getAttribute("srcset") != null) {
                if (img.getAttribute("srcset").includes(str1) || img.getAttribute("srcset").includes(str2) || 
                img.getAttribute("srcset").includes(str3) || img.getAttribute("srcset").includes(str4)) {
                    return img.src;
                }
            }
            if (img.getAttribute("alt") != null) {
                if (img.getAttribute("alt").includes(str1) || img.getAttribute("alt").includes(str2) || 
                    img.getAttribute("alt").includes(str3) || img.getAttribute("alt").includes(str4)) {
                    return img.src;
                }
            }
            
        }
    }

    
    return null;
}

/* Guesses the product price
@returns - string value of product price */
function guessPrice() {
    let aNodes = document.getElementsByTagName("*");

    let pNodes = [];
    for (let i = 0; i < aNodes.length; i++) {
        let curr = aNodes[i];
        if (isVisible(curr) && (curr.textContent != null)) {
            pNodes.push(curr);
        }
    }

    for (let i = 0; i<pNodes.length; i++) {
        let curr = pNodes[i]
        let text = [].reduce.call(curr.childNodes, function(a, b) { return a + (b.nodeType === 3 ? b.textContent : ''); }, '');
        if ( (text != null) && (text.includes("$") || text.includes("€")) && ((window.scrollY + curr.getBoundingClientRect().top) < 500) &&
        (getComputedStyle(curr).getPropertyValue("text-decoration") != "line-through") && (curr.parentElement.className != null) &&
        (typeof curr.parentElement.className == "string") && (curr.parentElement.className.toLowerCase().includes("price")) && 
        curr.textContent.trim().length > 1) {
            return curr.textContent.trim();;
        }
    }

    for (let i = 0; i<pNodes.length; i++) {
        let curr = pNodes[i];
        if (curr.textContent != null && (curr.textContent.includes("$") || curr.textContent.includes("€")) && 
            ((window.scrollY + curr.getBoundingClientRect().top) < 500) && curr.textContent.length < 10) {
            return curr.textContent.trim();
            }
    }

    for (let i = 0; i<pNodes.length; i++) {
        let curr = pNodes[i];
        let text = [].reduce.call(curr.childNodes, function(a, b) { return a + (b.nodeType === 3 ? b.textContent : ''); }, '');

        if (text != null && (text.includes("$") || text.includes("€")) ) {
            return curr.textContent.trim();
        }
    }
    return null;
}

/* Tells whether an element is visible on the page
@returns boolean value true if element is visible on page
@param - the element to check */
function isVisible(el) {
    return !!( el.offsetWidth || el.offsetHeight || el.getClientRects().length);
}