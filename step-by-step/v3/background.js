'use strict';
console.log('Background');

const sendToTab = (trigger) => {
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, trigger);
  });
};

chrome.browserAction.onClicked.addListener(ev => sendToTab('buttonClicked'));

chrome.contextMenus.create({
  title: 'Translate with DeepL',
  onclick: (info, tab) => sendToTab('menuClicked')
});
