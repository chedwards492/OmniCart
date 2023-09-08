
browser.runtime.onMessage.addListener(handleMessage);

function handleMessage(request, sender, sendResponse) {
    console.log("message from content script : " + request.msg);

    sendResponse( { response: "response from service worker" });
}



// let p1 = new Promise( (resolve, reject) => {
//     reject(0);
//     resolve(1);
    
// })

// p1.then( message => {
//     console.log("poop" + message);
// })
// p1.catch( message => {
//     console.log("numba" + message);
// })