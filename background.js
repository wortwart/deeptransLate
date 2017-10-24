const browser = window.browser || window.chrome;

const sendResponse = response => {
	if (typeof response === 'undefined') return;
	sendToTab('translated', 'Translating ' + response);
};

const sendToTab = (command, data = null, onResponse = null) => {
	browser.tabs.query({active: true, currentWindow: true}, tabs => {
		browser.tabs.sendMessage(tabs[0].id, {command: command, data: data}, onResponse);
	});
	require("sdk/tabs").on("ready", tab => {	// ?
	  tab.attach({
	    contentScript: "console.log({command, data});"
	  });
	});
};

browser.browserAction.onClicked.addListener(ev => sendToTab('buttonClicked', null, sendResponse));

browser.contextMenus.create({
	id: 'deeptransLate',
	title: 'Translate with DeepL',
	contexts: ['all'],
	onclick: (info, tab) => sendToTab('menuClicked', null, sendResponse)
});
