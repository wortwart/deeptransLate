'use strict';
console.log('Content');

chrome.runtime.onMessage.addListener((msg, sender, respond) => {
	if (msg === 'menuClicked' || msg === 'buttonClicked') {
		const sel = getSelection();
		respond(sel.toString().trim());
	}
});
