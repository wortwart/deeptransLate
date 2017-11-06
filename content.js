'use strict';
console.log('DeeptransLate content', new Date().toISOString());
const ua = typeof browser === 'undefined'? chrome : browser;

const sendSelection = respond => {
	let selection = window.getSelection().toString().trim();
	console.log('Send back "' + selection + '"')
	respond(selection);
};

ua.runtime.onMessage.addListener((request, sender, respond) => {
	if (request.trigger === 'buttonClicked') {
		console.log('Extension button clicked');
		sendSelection(respond);
	} else if (request.trigger === 'menuClicked') {
		console.log('Context menu clicked');
		sendSelection(respond);
	} else if (request.trigger === 'translated') {
		const warn = request.data.split('WARNING:');
		if (warn.length === 2)
			alert(warn[1]);
		else
			console.log(request.data);
	}
});