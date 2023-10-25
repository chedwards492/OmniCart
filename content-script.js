document.addEventListener("click", () => {
    console.log("clicked content script!!");
});

//chrome.storage.local.clear();

/* Receive message from service worker upon command
    Guess the item, and send to cart.js */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => { 
    if (message.message = "get-item-info") {
        let callGetItem;
        (callGetItem = async function() {
            let item = await getItem();
            addCartItem(item);
        })();
    }
    sendResponse({y: true});
    return true;
});


/* Called on shortcut command. Guesses item information
    Return - object with guessed item information */
async function getItem() {
    console.log("getItem() ran");
    let title = await guessTitle();
    let image = await guessImage(title);
    let price = await guessPrice();
    return {
        title: title, image: image, price: price
    };
}

/* Adds item to underlying cartItems array. Adds item to shopping cart interface 
@return - void 
@param - item: the item to add to cart */
function addCartItem(newItem) {
    console.log("addCartItem() ran ");
    chrome.storage.local.get(["items"], (result) => {
        if (typeof(result.items) != undefined && result.items instanceof Array) {
            result.items.push(newItem);
        }
        chrome.storage.local.set(result);
    });
}

/* Here begins the process of trying to create spew logic and conditional statements "smart" enough to 
    distinguish a product title, image, and price from other text on a page. Program this last b/c it's not
    stupid important, just need some general logic. Hopefully will not have to deal with js on pages as we'll be
    working in the actual product's page, not like a page with a bunch of products on it. Want Product title, image 
    (maybe even images if it's feasible), price, link, and which website it was from. Will then use that data to 
    piece together a little object in our shopping cart with that information readiyl available*/
const PROD = "product";
const ITEM = "item";
const NAME = "name";
const TITLE = "title";
const H1 = "H1";
const H2 = "H2";
const H3 = "H3";

/* Guesses the product title 
    Returns - string of the guessed product title */
function guessTitle() {

    // get all nodes, then get just the nodes that have direct text in them
    let potentialNodes = []; 
    let aNodes = document.getElementsByTagName("*");
    for (let k = 0; k < aNodes.length; k++) {
        if (containsDirectText(aNodes[k])) {
            potentialNodes.push(aNodes[k]);
        }
    }

    // only get visible elements from the potential tNodes
    let tNodes = potentialNodes.filter(x => x.offsetWidth !== 0 || x.offsetHeight !== 0);

    for (let i = 0; i < tNodes.length; i++) {        
    // 1
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
    // 2
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
    // added
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

    // get all nodes, p&n + h1 || h2
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


    // added to separate above h1's and h2's from h3's
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

    // all nodes, p&t + h3
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

    // 3
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
    

    

    // last resort - just get first h1, h2, or h3 element you see, should go below allNodes look up
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
    Returns boolean value */
function containsDirectText(el) {
    return [...el.childNodes]
        .some(n => n.nodeType === Node.TEXT_NODE
              && n.nodeValue.trim() !== '');
  }

/* Grabs all text nodes under a node
    Param - a node
    Returns - array of text nodes under parameter node */
function textNodesUnder(el) {
    let n, a = [], walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while(n=walk.nextNode()) a.push(n);
    return a;
}

/* Guesses the product image
    Param - the returned value from guessTitle
    Returns - the src attribute of the img node, null otherwise */
function guessImage(name) {
    let imgs = document.getElementsByTagName("img");

    
    for (let i = 0; i < imgs.length; i++) {
        let img = imgs[i];
        if (isVisible(img) && ((window.scrollY + img.getBoundingClientRect().top) < 400) &&
            img.width > 400 && img.height > 400) {
            return img.src;
        }
    }

    // 1 - use retrieved title and search in imgs' src or setsrc
    for (let i = 0; i < imgs.length; i++) {
        let img = imgs[i];
        if (isVisible(img)) {
            
            /* sometimes websites don't have alt, need other methods
            some websites have srcset's, responsive images, and should probably check those first if exists, then src if exists
            didn't work on ebay, no idea why
            yeah I think this alt="" method is best, just need a couple backups, like if it's in a range of dimensions? or it's the 
            biggest img on the page, or if in a ImgContainer class or something
            */
            // string split into 4, maybe need to check how long a string is before we do this, cuz small strings could just get "ar" or something short
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
    Returns - string value of product price */
function guessPrice() {
    let aNodes = document.getElementsByTagName("*");

    /* go thru nodes, if visible, if has textContent good
        check if contains direct text, check if that direct text has a $, then check if it's near top, then check strikethru,
        then check if parent has a classname, and if it's a string, and if it includes "price"*/

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
Param - the element of significance
Returns boolean value whether param el is visible on page*/
function isVisible(el) {
    return !!( el.offsetWidth || el.offsetHeight || el.getClientRects().length);
}




/* https://stackoverflow.com/questions/13917047/how-to-get-a-content-script-to-load-after-a-pages-javascript-has-executed
to wait for js to load */ 