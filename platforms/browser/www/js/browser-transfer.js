function viewLink(destination)
{
    //window.location.href = "browser.html?url="+destination;
    var ref = cordova.InAppBrowser.open( destination, '_system', 'location=yes');
}
