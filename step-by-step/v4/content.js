'use strict';
console.log('Content');

chrome.runtime.onMessage.addListener((msg, sender, respond) => {
	if (msg === 'menuClicked' || msg === 'buttonClicked') {
		const sel = getSelection();
		const selText = sel.toString().trim();
		console.log(selText);
		respond(selText);
	}
});
