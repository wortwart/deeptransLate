'use strict';
console.log('DeeptransLate background', new Date().toISOString());
const ua = typeof browser === 'undefined'? chrome : browser;

const serviceURL = 'https://www.deepl.com/jsonrpc';
const translateSettings = {
	FROM_LANGUAGE_DEFAULT: 'EN', // auto, DE, EN, FR, ES, IT, NL, PL
	TO_LANGUAGE_DEFAULT: 'DE',
	FROM_LANGUAGE: 'auto',
	TO_LANGUAGE: 'DE'
};

const sendToTab = (trigger, data = null, onResponse = null) => {
	console.log('sendToTab: ' + trigger, data);
	ua.tabs.query({active: true, currentWindow: true}, tabs => {
		ua.tabs.sendMessage(tabs[0].id, {trigger: trigger, data: data}, onResponse);
	});
};

const deepLResponse = ev => {
	console.log('DeepL response:', ev.target.response);
	try {
		let resp = JSON.parse(ev.target.response);
		console.log(resp)
		sendToTab('translated', resp);
	} catch(e) {
		sendToTab('translated', 'WARNING:No valid JSON response');
	}
}

const sendToDeepL = (query, id) => {
	console.log('sendToDeepL: "' + query + '"');
	const tSettings = Object.assign({
		TEXT_TO_TRANSLATE: query,
		ID: id
	}, translateSettings);
	const xhr = new XMLHttpRequest();
	xhr.open('POST', serviceURL);
	xhr.addEventListener('load', deepLResponse);
	xhr.addEventListener('error', ev => sendToTab('translated', {warn: ev}));
	xhr.setRequestHeader('Content-Type', 'application/json');
	fetch('deepLRequest.json')
		.then(resp => resp.text())
		.then(json => {
			for (let placeholder in tSettings) {
				let re = new RegExp('\\b' + placeholder + '\\b', 'g');
				if (typeof tSettings[placeholder] === 'string')
					tSettings[placeholder] = `"${tSettings[placeholder]}"`;
				json = json.replace(re, tSettings[placeholder]);
			}
			xhr.send(json);
		})
	;
};

const getSelection = msg => {
	console.log('getSelection: "' + msg.selection + '"');
	if (typeof msg.selection === 'undefined') selection = '';
	if (msg.selection.length < 2) msg.selection = '';
	if (!msg.selection)
		sendToTab('translated', 'WARNING:no text selected');
	else
		sendToDeepL(msg.selection, msg.id);
};

ua.browserAction.onClicked.addListener(ev => sendToTab('buttonClicked', null, getSelection));

ua.contextMenus.create({
	id: 'deeptransLate',
	title: 'Translate with DeepL',
	contexts: ['all'],
	onclick: (info, tab) => sendToTab('menuClicked', null, getSelection)
});
