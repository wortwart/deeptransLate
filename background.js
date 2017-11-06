'use strict';
console.log('DeeptransLate background', new Date().toISOString());
const ua = typeof browser === 'undefined'? chrome : browser;

const serviceURL = 'https://www.deepl.com/jsonrpc';
const translateSettings = {
	FROM_LANGUAGE_DEFAULT: 'EN', // auto, DE, EN, FR, ES, IT, NL, PL
	TO_LANGUAGE_DEFAULT: 'DE',
	FROM_LANGUAGE: 'auto',
	TO_LANGUAGE: 'DE',
	TEXT_TO_TRANSLATE: ''
};

const sendToTab = (trigger, data = null, onResponse = null) => {
	console.log('sendToTab: ' + trigger);
	ua.tabs.query({active: true, currentWindow: true}, tabs => {
		ua.tabs.sendMessage(tabs[0].id, {trigger: trigger, data: data}, onResponse);
	});
};

const deepLResponse = response => {
	console.log('DeepL response:', response);
	translateSettings.TEXT_TO_TRANSLATE = '';	// reset
	sendToTab('translated', response);
}

const sendToDeepL = query => {
	console.log('sendToDeepL: "' + query + '"');
	translateSettings.TEXT_TO_TRANSLATE = query;
	const xhr = new XMLHttpRequest();
	xhr.open('POST', serviceURL);
	xhr.addEventListener('load', deepLResponse);
	xhr.setRequestHeader('Content-Type', 'application/json');
	fetch('deepLRequest.json')
		.then(resp => resp.text())
		.then(text => {
			for (let placeholder in translateSettings) {
				let re = new RegExp('\\b' + placeholder + '\\b', 'g');
				text = text.replace(re, '"' + translateSettings[placeholder] + '"');
			}
			console.log(text);
			xhr.send(text)
		})
	;
};

const getSelection = selection => {
	console.log('getSelection: "' + selection + '"');
	if (typeof selection === 'undefined') selection = '';
	if (selection.length < 2) selection = '';
	if (!selection)
		sendToTab('translated', 'WARNING:no text selected');
	else
		sendToDeepL(selection);
};

ua.browserAction.onClicked.addListener(ev => sendToTab('buttonClicked', null, getSelection));

ua.contextMenus.create({
	id: 'deeptransLate',
	title: 'Translate with DeepL',
	contexts: ['all'],
	onclick: (info, tab) => sendToTab('menuClicked', null, getSelection)
});
