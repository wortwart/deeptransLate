'use strict';
console.log('DeeptransLate background', new Date().toISOString());
//const browser = window.browser || window.chrome;

/*
function onError(error) {
  console.error(`Error: ${error}`);
}

function sendMessageToTabs(tabs) {
	console.log(tabs)
  for (let tab of tabs) {
  	console.log(tab.id)
    browser.tabs.sendMessage(
      tab.id,
      {greeting: "Hi from background script"}
    ).then(response => {
      console.log("Message from the content script:");
      console.log(response.response);
    }).catch(onError);
  }
}

browser.browserAction.onClicked.addListener(() => {
  browser.tabs.query({
    currentWindow: true,
    active: true
  }).then(sendMessageToTabs).catch(onError);
});
*/



/*
const sendResponse = response => {
	if (typeof response === 'undefined') return;
	sendToTab('translated', 'Translating ' + response);
};
*/

//const sendToTab = (command, data = null, onResponse = null) => {
const sendToTab = (ev) => {
	console.log('background sendToTab', ev);
	//console.log('background sendToTab', command, data);

	browser.tabs
		.query({})
		.then(tabs => console.log(tabs, ev.id))
	;


	//browser.tabs.sendMessage(_tabs[0].id, {command: command, data: data}, onResponse);
	browser.tabs.sendMessage(ev.id, {hallo: 'Welt'});

	/*
	browser.tabs.query({active: true, currentWindow: true}, tabs => {
		browser.tabs.sendMessage(tabs[0].id, {command: command, data: data}, onResponse);
	});
	*/
};

//browser.browserAction.onClicked.addListener(ev => sendToTab('buttonClicked', null, sendResponse));
browser.browserAction.onClicked.addListener(sendToTab);

browser.contextMenus.create({
	id: 'deeptransLate',
	title: 'Translate with DeepL',
	contexts: ['all'],
	//onclick: (info, tab) => sendToTab('menuClicked', null, sendResponse)
	onclick: sendToTab
});
