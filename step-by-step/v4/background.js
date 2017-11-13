'use strict';
console.log('Background');

const sendToTab = (msg, onResponse = null) => {
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, msg, onResponse);
  });
};

const getSelection = msg => {
	console.log(msg);
};

chrome.browserAction.onClicked.addListener(ev => sendToTab('buttonClicked', getSelection));

chrome.contextMenus.create({
  title: 'Translate with DeepL',
  contexts: ['all'],
  onclick: (info, tab) => sendToTab('menuClicked', getSelection)
});
