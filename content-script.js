

document.addEventListener("click", () => {
    console.log("clicked content script!!");


});

/* Receive message from service worker to collect item data - S */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => { 
    if (message.message == "get-item-info") {
        console.log(message.po);
        //sendResponse({ response: document }); not sure if works or necessary
    }
    return true;
});

function test() {
    //console.log("wtf going on");
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
const H1 = "h1";
const H2 = "h2";
const H3 = "h3";

/*
function guessTitle() {
    console.log("guessTitle ran");
    return "bloop";
    /*
    // var str = "No Title Found";
    // return str;
    // array with all textnodes
    let tNodes = textNodesUnder(document.querySelector("body"));
    let allNodes = document.querySelector("body").getElementsByTagName("*");
    // iterate over tNodes
    for (let i = 0; i < tNodes.length; i++) {
        let currNode = tNodes[i];
        if (tNodes[i].className == null) {
            
        }
        // 1
        if ( ( ( (tNodes[i].className.contains(PROD) && tNodes[i].className.contains(TITLE)) ||
            (tNodes[i].className.contains(PROD) && tNodes[i].className.contains(NAME)) ||
            (tNodes[i].className.contains(ITEM) && tNodes[i].className.contains(TITLE)) ||
            (tNodes[i].className.contains(ITEM) && tNodes[i].className.contains(NAME)) ) ||

            ( (tNodes[i].id.contains(PROD) && tNodes[i].id.contains(TITLE)) ||
            (tNodes[i].id.contains(PROD) && tNodes[i].id.contains(NAME)) ||
            (tNodes[i].id.contains(ITEM) && tNodes[i].id.contains(TITLE)) ||
            (tNodes[i].id.contains(ITEM) && tNodes[i].id.contains(NAME)) ) ) &&

            ( tNodes[i].tagName.toLowerCase() == H1 || 
            tNodes[i].tagName.toLowerCase() == H1 || 
            tNodes[i].tagName.toLowerCase() == H1 )
            ) {
            return tNodes[i];
        // 2
        } else if ( (tNodes[i].className.contains(PROD) && tNodes[i].className.contains(ITEM) && tNodes[i].className.contains(NAME)) || 
                (tNodes[i].className.contains(PROD) && tNodes[i].className.contains(ITEM) && tNodes[i].className.contains(TITLE)) ||
                (tNodes[i].id.contains(PROD) && tNodes[i].id.contains(ITEM) && tNodes[i].id.contains(NAME)) || 
                (tNodes[i].id.contains(PROD) && tNodes[i].id.contains(ITEM) && tNodes[i].id.contains(TITLE)) ) {
            return tNodes[i];
        // 3
        } else if ( ( (tNodes[i].className.contains(PROD) && tNodes[i].className.contains(TITLE)) ||
        (tNodes[i].className.contains(PROD) && tNodes[i].className.contains(NAME)) ||
        (tNodes[i].className.contains(ITEM) && tNodes[i].className.contains(TITLE)) ||
        (tNodes[i].className.contains(ITEM) && tNodes[i].className.contains(NAME)) ) ||

        ( (tNodes[i].id.contains(PROD) && tNodes[i].id.contains(TITLE)) ||
        (tNodes[i].id.contains(PROD) && tNodes[i].id.contains(NAME)) ||
        (tNodes[i].id.contains(ITEM) && tNodes[i].id.contains(TITLE)) ||
        (tNodes[i].id.contains(ITEM) && tNodes[i].id.contains(NAME)) ) ) {
            return tNodes[i];
        }
        // else get all nodes, find something with p & i & t... and take first text node you find
        else {
            for (let j = 0; j < allNodes.length; j++) {
                let currNode2 = allNodes[j];

                if ( (allNodes[j].className.contains(PROD) && allNodes[j].className.contains(ITEM) && allNodes[j].className.contains(NAME)) || 
                (allNodes[j].className.contains(PROD) && allNodes[j].className.contains(ITEM) && allNodes[j].className.contains(TITLE)) ||
                (allNodes[j].id.contains(PROD) && allNodes[j].id.contains(ITEM) && allNodes[j].id.contains(NAME)) || 
                (allNodes[j].id.contains(PROD) && allNodes[j].id.contains(ITEM) && allNodes[j].id.contains(TITLE)) ) {
                    let potNodes = textNodesUnder(allNodes[j]);
                    return potNodes[0];

                } else if ( ( (allNodes[j].className.contains(PROD) && allNodes[j].className.contains(TITLE)) ||
                (allNodes[j].className.contains(PROD) && allNodes[j].className.contains(NAME)) ||
                (allNodes[j].className.contains(ITEM) && allNodes[j].className.contains(TITLE)) ||
                (allNodes[j].className.contains(ITEM) && allNodes[j].className.contains(NAME)) ) ||
        
                ( (allNodes[j].id.contains(PROD) && allNodes[j].id.contains(TITLE)) ||
                (allNodes[j].id.contains(PROD) && allNodes[j].id.contains(NAME)) ||
                (allNodes[j].id.contains(ITEM) && allNodes[j].id.contains(TITLE)) ||
                (allNodes[j].id.contains(ITEM) && allNodes[j].id.contains(NAME)) ) ) {
                    let potNodes = textNodesUnder(allNodes[j]);
                    return potNodes[0];

                }
            }
        }
    }
    let str = "No Title Found";
    return "No Title Found.";
}*/


function textNodesUnder(el) {
    let n, a = [], walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while(n=walk.nextNode()) a.push(n);
    return a;
}


/*
For Product Image:
usually has alt attribute with a string that contains the product's title
*/


/* https://stackoverflow.com/questions/13917047/how-to-get-a-content-script-to-load-after-a-pages-javascript-has-executed
to wait for js to load */ 