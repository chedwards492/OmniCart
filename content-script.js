document.addEventListener("click", () => {
    console.log("clicked content script!!");


});



/* Here begins the process of trying to create a spew logic and conditional statements "smart" enough to 
    distinguish a product title, image, and price from other text on a page. Program this last b/c it's not
    stupid important, just need some general logic. Hopefully will not have to deal with js on pages as we'll be
    working in the actual product's page, not like a page with a bunch of products on it. Want Product title, image 
    (maybe even images if it's feasible), price, link, and which website it was from. Will then use that data to 
    piece together a little object in our shopping cart with that information readiyl available*/

/* Try to find a potential Product Title */

// first collect all h1's and try those
let h1s = document.getElementsByTagName("h1"); // an HTMLCollection, can't use push() pop() join() but like an array in every other way
// iterate over h1s
for (let i = 0; i < h1s.length; i++) {
    let currh1 = h1s[i];

    // the first and most definitive conditions, if it's h1 and has product/item and title/name in it's class or id
    if ( ((currh1.className.includes("product") || currh1.className.includes("item"))
        || (currh1.id.includes("product") || currh1.id.includes("item")))
        && ((currh1.className.includes("title") || currh1.className.includes("name")) 
        || (currh1.id.includes("title") || currh1.id.includes("name")))) {
        // save the text of it in maybe an array of potential elements
    }
    else if (currh1.className.includes("product") || currh1.className.includes("item") 
        || currh1.className.includes("name") || currh1.className.includes("title")
        || currh1.id.includes("product") || currh1.id.includes("item") 
        || currh1.id.includes("name") || currh1.id.includes("title") ) {

        }

    
    
}


/*
For Product Name:
h1 element or some close descendant of an h1 element
"product" || "item" && "name" || "title"


For Product Image:
usually has alt attribute with a string that contains the product's title
*/