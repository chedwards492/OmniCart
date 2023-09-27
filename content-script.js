

document.addEventListener("click", () => {
    console.log("clicked content script!!");


});

/* Receive message from service worker to collect item data - S */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => { 
    if (message.message == "get-item-info") {
        console.log(message.po);
        //sendResponse({ response: document }); not sure if works or necessary
    }

    let name = guessTitle();
    console.log("guessTitle() return: " + name);

    let y = guessImage(name);
    console.log("guessImage() return: " + y);
    return true;
});

function test() {
    //console.log("wtf going on");
    console.log("test() ran");
}

/* Here begins the process of trying to create spew logic and conditional statements "smart" enough to 
    distinguish a product title, image, and price from other text on a page. Program this last b/c it's not
    stupid important, just need some general logic. Hopefully will not have to deal with js on pages as we'll be
    working in the actual product's page, not like a page with a bunch of products on it. Want Product title, image 
    (maybe even images if it's feasible), price, link, and which website it was from. Will then use that data to 
    piece together a little object in our shopping cart with that information readiyl available*/

/* Try to find a potential Product Title */

const PROD = "product";
const ITEM = "item";
const NAME = "name";
const TITLE = "title";
const H1 = "H1";
const H2 = "H2";
const H3 = "H3";

/* Need to include a second case where we look for tags like h1, h2, h3 that don't have direct text, but contain some text in them like 
a span or something. ebay has a good example of this and why it's not working*/

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
            console.log("1");
            return tNodes[i].textContent;
        }
    }
    // 2
    for (let i = 0; i < tNodes.length; i++) {
        if ( ( (tNodes[i].className != null && (typeof tNodes[i].className == "string") ) && ( (tNodes[i].className.toLowerCase().includes(PROD) && tNodes[i].className.toLowerCase().includes(ITEM) && tNodes[i].className.toLowerCase().includes(NAME)) || 
                (tNodes[i].className.toLowerCase().includes(PROD) && tNodes[i].className.toLowerCase().includes(ITEM) && tNodes[i].className.toLowerCase().includes(TITLE)) ) ) ||
                ( (tNodes[i].id != null && (typeof tNodes[i].id == "string")) && ( (tNodes[i].id.toLowerCase().includes(PROD) && tNodes[i].id.toLowerCase().includes(ITEM) && tNodes[i].id.toLowerCase().includes(NAME)) || 
                (tNodes[i].id.toLowerCase().includes(PROD) && tNodes[i].id.toLowerCase().includes(ITEM) && tNodes[i].id.toLowerCase().includes(TITLE)) ) ) ) {
            console.log("2");
            return tNodes[i].textContent;
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
            console.log("added");
            return tNodes[i].textContent;
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
            console.log("added");
            return tNodes[i].textContent;
        }
    }
    // 3
    for (let i = 0; i < tNodes.length; i++) {
        if ( ( (tNodes[i].className != null && (typeof tNodes[i].className == "string")) && ( (tNodes[i].className.toLowerCase().includes(PROD) && tNodes[i].className.toLowerCase().includes(TITLE)) ||
                (tNodes[i].className.toLowerCase().includes(PROD) && tNodes[i].className.toLowerCase().includes(NAME)) ||
                (tNodes[i].className.toLowerCase().includes(ITEM) && tNodes[i].className.toLowerCase().includes(TITLE)) ||
                (tNodes[i].className.toLowerCase().includes(ITEM) && tNodes[i].className.toLowerCase().includes(NAME)) ) ) ||

                ( (tNodes[i].id != null && (typeof tNodes[i].id == "string")) && ( (tNodes[i].id.toLowerCase().includes(PROD) && tNodes[i].id.toLowerCase().includes(TITLE)) ||
                (tNodes[i].id.toLowerCase().includes(PROD) && tNodes[i].id.toLowerCase().includes(NAME)) ||
                (tNodes[i].id.toLowerCase().includes(ITEM) && tNodes[i].id.toLowerCase().includes(TITLE)) ||
                (tNodes[i].id.toLowerCase().includes(ITEM) && tNodes[i].id.toLowerCase().includes(NAME)) ) ) ) {
            console.log("3");
            return tNodes[i].textContent;
        }
    }
    // last resort - just get first h1, h2, or h3 element you see, should go below allNodes look up
    for (let i = 0; i < tNodes.length; i++) {
        if (tNodes[i].tagName == H1 || tNodes[i].tagName == H2 || tNodes[i].tagName == H3) {
            console.log("last resort, h1, h2, or h3");
            return tNodes[i].textContent;
        }
    }
/* Not sure if this bit is necessary, cuz I'm returning the text content of whatever element it finds, and that includes all the 
    child nodes' text content as well. Table this though cuz I'd just be doing more exhaustive guessing, not worth it rn

    let allNodes = document.querySelector("body").getElementsByTagName("*");

    for (let j = 0; j < allNodes.length; j++) {
        if ( ( (allNodes[j].className != null) && 
        ( (allNodes[j].className.toLowerCase().includes(PROD) && allNodes[j].className.toLowerCase().includes(ITEM) && allNodes[j].className.toLowerCase().includes(NAME)) || 
        (allNodes[j].className.toLowerCase().includes(PROD) && allNodes[j].className.toLowerCase().includes(ITEM) && allNodes[j].className.toLowerCase().includes(TITLE)) ) ) ||
        ( (allNodes[j].id != null) && ( (allNodes[j].id.toLowerCase().includes(PROD) && allNodes[j].id.toLowerCase().includes(ITEM) && allNodes[j].id.toLowerCase().includes(NAME)) || 
        (allNodes[j].id.toLowerCase().includes(PROD) && allNodes[j].id.toLowerCase().includes(ITEM) && allNodes[j].id.toLowerCase().includes(TITLE)) ) ) ) {
            let potNodes = textNodesUnder(allNodes[j]);
            if (potNodes[0] != null) {
                return potNodes[0];
            }
            break;
        } else if ( ( (allNodes[j].className != null) && ( (allNodes[j].className.toLowerCase().includes(PROD) && allNodes[j].className.toLowerCase().includes(TITLE)) ||
        (allNodes[j].className.toLowerCase().includes(PROD) && allNodes[j].className.toLowerCase().includes(NAME)) ||
        (allNodes[j].className.toLowerCase().includes(ITEM) && allNodes[j].className.toLowerCase().includes(TITLE)) ||
        (allNodes[j].className.toLowerCase().includes(ITEM) && allNodes[j].className.toLowerCase().includes(NAME)) ) ) ||

        ( (allNodes[j].id != null) && ( (allNodes[j].id.toLowerCase().includes(PROD) && allNodes[j].id.toLowerCase().includes(TITLE)) ||
        (allNodes[j].id.toLowerCase().includes(PROD) && allNodes[j].id.toLowerCase().includes(NAME)) ||
        (allNodes[j].id.toLowerCase().includes(ITEM) && allNodes[j].id.toLowerCase().includes(TITLE)) ||
        (allNodes[j].id.toLowerCase().includes(ITEM) && allNodes[j].id.toLowerCase().includes(NAME)) ) ) ) {
            let potNodes = textNodesUnder(allNodes[j]);
            return potNodes[0];
        }
    }*/
    let str = "No Title Found";
    return str;
}

function containsDirectText(el) {
    return [...el.childNodes]
        .some(n => n.nodeType === Node.TEXT_NODE
              && n.nodeValue.trim() !== '');
  }


function textNodesUnder(el) {
    let n, a = [], walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while(n=walk.nextNode()) a.push(n);
    return a;
}

function guessImage(name) {
    console.log(name + " typeof " + typeof name);
    console.log(name.length);
    let imgs = document.getElementsByTagName("img");

    // console.log("width: " + x.clientWidth + " height: " + x.clientHeight);
    // console.log("width: " + x.naturalWidth + " height: " + x.naturalHeight);
    
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
            console.log(str1 + "  " + str2 + "  " + str3 + "  " + str4);
            if (img.getAttribute("alt").includes(str1) || img.getAttribute("alt").includes(str2) || 
                img.getAttribute("alt").includes(str3) || img.getAttribute("alt").includes(str4) ||
                img.getAttribute("alt").includes("Picture 1 of 11")) {
                console.log(str1 + "  " + str2 + "  " + str3 + "  " + str4);
                console.log("FOUND IT: " + img.src);
            
        }
        }
    }
}

function isVisible(el) {
    return !!( el.offsetWidth || el.offsetHeight || el.getClientRects().length);
}

/*
For Product Image:
usually has alt attribute with a string that toLowerCase().includes the product's title
*/


/* https://stackoverflow.com/questions/13917047/how-to-get-a-content-script-to-load-after-a-pages-javascript-has-executed
to wait for js to load */ 