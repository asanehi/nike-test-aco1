window.onload = function() {
    document.getElementById('button').onclick = function() {
        var account = document.getElementById('Account').value;
        var password = document.getElementById('Password').value;
        var proxy = document.getElementById('Proxy').value;
        var split = proxy.split(":");
        var ip = split[0];
        var port = split[1]; //this is a string, needs to become and int during the proxy process
        var username = split[2]
        var proxyPassword = split[3];

        //this is for reloading data back into the form
        localStorage.setItem('account', account);
        localStorage.setItem('password', password);
        localStorage.setItem('proxy', proxy); //this is only used when user wants to reload

        //used for proxy
        localStorage.setItem('ip', ip);
        localStorage.setItem('port', port);
        localStorage.setItem('username', username);
        localStorage.setItem('proxyPassword', proxyPassword);

        //used for content page 
        localStorage.setItem('total', account + "|||" + password);

        //used for loading link
        var link = document.getElementById('Link').value;
        var linksplit = link.split("nike.com/in/launch");
        var backLink = linksplit[1];
        var fullLink = "https://www.nike.com/in/launch" + backLink; //need to rebuild link in case it does not start with https
        localStorage.setItem('link', link);
        localStorage.setItem('fullLink', fullLink);

        chrome.runtime.reload();

    }

    document.getElementById('Load').onclick = function() {
        document.getElementById('Account').value = localStorage.getItem('account');
        document.getElementById('Password').value = localStorage.getItem('password');
        document.getElementById('Proxy').value = localStorage.getItem('proxy');
        document.getElementById('Link').value = localStorage.getItem('link');
    }

    document.getElementById('Login').onclick = function() {
        chrome.tabs.update({ url: localStorage.getItem('fullLink')});
        setTimeout(() => { loginNike(); }, 5000); //5 seconds to load site
    }

}

function loginNike() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        // Injects JavaScript code into a page
        chrome.tabs.executeScript(tabs[0].id, {file: "content.js"});
    });
}

//sends account information to content page
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getTotal")
      sendResponse({data: localStorage[request.key]});
    else
      sendResponse({}); // snub them.
    localStorage.removeItem('productID');
    localStorage.setItem('productID', request.productID);
});
