'use strict';
console.log('Background');

const sendToTab = (msg, onResponse = null) => {
	console.log(msg)
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, msg, onResponse);
  });
};

const serviceResponse = ev => {
	console.log(ev);
};

const getSelection = text => {
	if (typeof text === 'undefined') return;
	const xhr = new XMLHttpRequest();
	xhr.open('POST', 'https://www.deepl.com/jsonrpc');
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.addEventListener('load', serviceResponse);
	fetch('deepLRequest')
		.then(resp => resp.text())
		.then(json => {
			json = json.replace('TEXT_TO_TRANSLATE', `"${text}"`);
			xhr.send(json);
		})
	;
};

chrome.browserAction.onClicked.addListener(ev => sendToTab('buttonClicked', getSelection));

chrome.contextMenus.create({
  title: 'Translate with DeepL',
  contexts: ['all'],
  onclick: (info, tab) => sendToTab('menuClicked', getSelection)
});
