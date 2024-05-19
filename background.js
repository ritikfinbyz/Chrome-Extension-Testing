let myLeads = [];

// Load leads from local storage when the extension is loaded
chrome.storage.local.get(["myLeads"], function(result) {
    if (result.myLeads) {
        myLeads = result.myLeads;
    }
});

// Listen for updates to any tab
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.url) {
        myLeads.push(changeInfo.url);
        chrome.storage.local.set({ myLeads: myLeads });
    }
    console.log(myLeads)
});

const filePath = chrome.runtime.getURL("data/myfile.txt");

fetch(filePath)
  .then(response => response.text())
  .then(text => {
    
    console.log(text);
  })
  .catch(error => console.error(error));