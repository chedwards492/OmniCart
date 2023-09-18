let btn = document.querySelector(".delete-button");

function onButtonClick() {
    alert('yup clicked');
}

btn.addEventListener('click', onButtonClick);



/* this alerts properly but the link does not acc get copied to my clipboard, might just be b/c it's a live server tho so idk */
function copyLink(val) {
    let copiedLink = val.parentElement.parentElement.firstElementChild.getAttribute("href");
    //alert("HELLOOOO" + copiedLink);

    navigator.clipboard.writeText(copiedLink);

    alert("copied the link: " + copiedLink);
}