

document.addEventListener("click", () => {
    console.log("clicked content script!!");


});

/* Receive message from service worker to collect item data - S */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => { 
    if (message.message == "get-item-info") {
        console.log(message.po);
        //sendResponse({ response: document }); not sure if works or necessary
    }

    let x = guessTitle();
    console.log("guessTitle() return: " + x);
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

/* PROBLEM IS that textnodes don't have classes, tagnames, etc. I think
so maybe need a diff way to get all elements with some text */

function guessTitle() {

    
    // let tNodes = textNodesUnder(document.querySelector("body"));
    let tNodes = []; 
    let allNodes = document.querySelector("body").getElementsByTagName("*");
    let x = 0;

    // get all nodes, then get just the nodes that have direct text in them
    let aNodes = document.getElementsByTagName("*");
    for (let k = 0; k < aNodes.length; k++) {
        if (containsDirectText(aNodes[k])) {
            tNodes.push(aNodes[k]);
        }
    }


    // iterate over tNodes - this needs to be changed so that it iterates three different times, each time loosening the requirements for a potential title
    for (let i = 0; i < tNodes.length; i++) {
        if (x==0) {
            console.log("tNodes.length: " + tNodes.length);
            x=1;
        }
        
    // 1
        if ( ( ( (tNodes[i].className != null && (typeof tNodes[i].className == "string")) && ( (tNodes[i].className.includes(PROD) && tNodes[i].className.includes(TITLE)) ||
        (tNodes[i].className.includes(PROD) && tNodes[i].className.includes(NAME)) ||
        (tNodes[i].className.includes(ITEM) && tNodes[i].className.includes(TITLE)) ||
        (tNodes[i].className.includes(ITEM) && tNodes[i].className.includes(NAME)) ) ) ||

        ((tNodes[i].id != null && (typeof tNodes[i].id == "string")) && ( (tNodes[i].id.includes(PROD) && tNodes[i].id.includes(TITLE)) ||
        (tNodes[i].id.includes(PROD) && tNodes[i].id.includes(NAME)) ||
        (tNodes[i].id.includes(ITEM) && tNodes[i].id.includes(TITLE)) ||
        (tNodes[i].id.includes(ITEM) && tNodes[i].id.includes(NAME)) ) ) ) &&

        ( tNodes[i].tagName.toLowerCase() == H1 || 
        tNodes[i].tagName.toLowerCase() == H2 || 
        tNodes[i].tagName.toLowerCase() == H3 )) 
        {
            console.log("1");
            return tNodes[i];
        }
    }
    // 2
    for (let i = 0; i < tNodes.length; i++) {
        if ( ( (tNodes[i].className != null && (typeof tNodes[i].className == "string") ) && ( (tNodes[i].className.includes(PROD) && tNodes[i].className.includes(ITEM) && tNodes[i].className.includes(NAME)) || 
                (tNodes[i].className.includes(PROD) && tNodes[i].className.includes(ITEM) && tNodes[i].className.includes(TITLE)) ) ) ||
                ( (tNodes[i].id != null && (typeof tNodes[i].id == "string")) && ( (tNodes[i].id.includes(PROD) && tNodes[i].id.includes(ITEM) && tNodes[i].id.includes(NAME)) || 
                (tNodes[i].id.includes(PROD) && tNodes[i].id.includes(ITEM) && tNodes[i].id.includes(TITLE)) ) ) ) {
            return tNodes[i];
        }
    }
    // added
    for (let i = 0; i < tNodes.length; i++) {
        if ( ( ( (tNodes[i].className != null && (typeof tNodes[i].className == "string")) && ( (tNodes[i].className.includes(PROD) && tNodes[i].className.includes(TITLE)) ||
                (tNodes[i].className.includes(PROD) && tNodes[i].className.includes(NAME)) ||
                (tNodes[i].className.includes(ITEM) && tNodes[i].className.includes(TITLE)) ||
                (tNodes[i].className.includes(ITEM) && tNodes[i].className.includes(NAME)) ) ) ||

                ( (tNodes[i].id != null && (typeof tNodes[i].id == "string")) && ( (tNodes[i].id.includes(PROD) && tNodes[i].id.includes(TITLE)) ||
                (tNodes[i].id.includes(PROD) && tNodes[i].id.includes(NAME)) ||
                (tNodes[i].id.includes(ITEM) && tNodes[i].id.includes(TITLE)) ||
                (tNodes[i].id.includes(ITEM) && tNodes[i].id.includes(NAME)) ) ) ) &&

                ( tNodes[i].tagName == H1 || 
                tNodes[i].tagName == H2 || 
                tNodes[i].tagName == H3 ) ) { 
            console.log("2");
            return tNodes[i].textContent;
        }
    }
    // 3
    for (let i = 0; i < tNodes.length; i++) {
        if ( ( (tNodes[i].className != null && (typeof tNodes[i].className == "string")) && ( (tNodes[i].className.includes(PROD) && tNodes[i].className.includes(TITLE)) ||
                (tNodes[i].className.includes(PROD) && tNodes[i].className.includes(NAME)) ||
                (tNodes[i].className.includes(ITEM) && tNodes[i].className.includes(TITLE)) ||
                (tNodes[i].className.includes(ITEM) && tNodes[i].className.includes(NAME)) ) ) ||

                ( (tNodes[i].id != null && (typeof tNodes[i].id == "string")) && ( (tNodes[i].id.includes(PROD) && tNodes[i].id.includes(TITLE)) ||
                (tNodes[i].id.includes(PROD) && tNodes[i].id.includes(NAME)) ||
                (tNodes[i].id.includes(ITEM) && tNodes[i].id.includes(TITLE)) ||
                (tNodes[i].id.includes(ITEM) && tNodes[i].id.includes(NAME)) ) ) ) {
            return tNodes[i].textContent;
        }
    }

        // else get all nodes, find something with p & i & t... and take first text node you find
    /*for (let j = 0; j < allNodes.length; j++) {
        let currNode2 = allNodes[j];

        if ( ( (allNodes[j].className != null) && 
        ( (allNodes[j].className.includes(PROD) && allNodes[j].className.includes(ITEM) && allNodes[j].className.includes(NAME)) || 
        (allNodes[j].className.includes(PROD) && allNodes[j].className.includes(ITEM) && allNodes[j].className.includes(TITLE)) ) ) ||
        ( (allNodes[j].id != null) && ( (allNodes[j].id.includes(PROD) && allNodes[j].id.includes(ITEM) && allNodes[j].id.includes(NAME)) || 
        (allNodes[j].id.includes(PROD) && allNodes[j].id.includes(ITEM) && allNodes[j].id.includes(TITLE)) ) ) ) {
            let potNodes = textNodesUnder(allNodes[j]);
            if (potNodes[0] != null) {
                return potNodes[0];
            }
            break;
        } else if ( ( (allNodes[j].className != null) && ( (allNodes[j].className.includes(PROD) && allNodes[j].className.includes(TITLE)) ||
        (allNodes[j].className.includes(PROD) && allNodes[j].className.includes(NAME)) ||
        (allNodes[j].className.includes(ITEM) && allNodes[j].className.includes(TITLE)) ||
        (allNodes[j].className.includes(ITEM) && allNodes[j].className.includes(NAME)) ) ) ||

        ( (allNodes[j].id != null) && ( (allNodes[j].id.includes(PROD) && allNodes[j].id.includes(TITLE)) ||
        (allNodes[j].id.includes(PROD) && allNodes[j].id.includes(NAME)) ||
        (allNodes[j].id.includes(ITEM) && allNodes[j].id.includes(TITLE)) ||
        (allNodes[j].id.includes(ITEM) && allNodes[j].id.includes(NAME)) ) ) ) {
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


/*
For Product Image:
usually has alt attribute with a string that includes the product's title
*/


/* https://stackoverflow.com/questions/13917047/how-to-get-a-content-script-to-load-after-a-pages-javascript-has-executed
to wait for js to load */ 