let myLeads = [];
const inputEl = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");
const ulEl = document.getElementById("ul-el");
const deleteBtn = document.getElementById("delete-btn");
const tabBtn = document.getElementById("tab-btn");
const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"));

console.log(leadsFromLocalStorage);

if (leadsFromLocalStorage) {
  myLeads = leadsFromLocalStorage;
  render(myLeads);
}
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    main(tab.url); // Pass the URL directly to main function
  }
});
window.addEventListener("load", main);
window.addEventListener("hashchange", main);
window.addEventListener("popstate", main);
const filePath = chrome.runtime.getURL("url_log.json");

fetch(filePath)
  .then(response => response.text())
  .then(text => {
    // Process the file content here
    console.log(text);
  })
  .catch(error => console.error(error));

chrome.webNavigation.onCompleted.addListener((details) => {
  chrome.tabs.get(details.tabId, (tab) => {
    if (tab.url) {
      main(tab.url);
    }
  });
}, { url: [{ schemes: ['http', 'https'] }] });

function main(url) {
  console.log("Navigated to URL:", url);
  myLeads.push(url);
  localStorage.setItem("myLeads", JSON.stringify(myLeads));
  render(myLeads);

  fetch(filePath)
  .then(response => response.text())
  .then(text => {
    // Process the file content here
    console.log(text);
  })
  .catch(error => console.error(error));
}

function render(leads) {
  let listItems = "";
  for (let i = 0; i < leads.length; i++) {
    listItems += `<li><a href="${leads[i]}" target="_blank">${leads[i]}</a></li>`;
  }
  ulEl.innerHTML = listItems;
}

deleteBtn.addEventListener("dblclick", function () {
  localStorage.clear();
  myLeads = [];
  render(myLeads);
});

inputBtn.addEventListener("click", function() {
  myLeads.push(inputEl.value);
  inputEl.value = "";
  localStorage.setItem("myLeads", JSON.stringify(myLeads));
  render(myLeads);
});
