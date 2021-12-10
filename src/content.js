console.log("Chrome extension Content")

chrome.runtime.sendMessage({
    action: 'updateIcon',
    value: location.href
});
