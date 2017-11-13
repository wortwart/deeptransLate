'use strict';
console.log('Content');

chrome.runtime.onMessage.addListener((msg, sender, respond) => {
	if (msg === 'menuClicked' || msg === 'buttonClicked') {
		const sel = getSelection();
		respond(sel.toString().trim());
	} else {
		console.log(msg);
		const output = [];
		msg.result.translations.forEach(tls => {
			tls.beams.forEach(tl => output.push(tl.postprocessed_sentence));
		});
		alert(output.join("\n"));
	}
});
