onload = function () {
    let mainIframe = document.getElementById('main').contentWindow.document;
    mainIframe.getElementsByClassName('top-banner')[0].style.display = "none";
    mainIframe.getElementsByClassName('main-container')[0].style.top = "0";
}