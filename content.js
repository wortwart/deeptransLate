const browser =
	window.browser ||
	window.chrome ||
	window.msBrowser
;

const sendSelection = respond => {
	let selection = window.getSelection().toString().trim();
	if (!selection.length) return;
	respond(selection);
};

browser.runtime.onMessage.addListener((request, sender, respond) => {
	if (request.command === 'buttonClicked') {
		console.log('Button!');
		sendSelection(respond);
	} else if (request.command === 'menuClicked') {
		console.log('Context Menu!');
		sendSelection(respond);
	} else if (request.command === 'translated') {
		console.log(request.data);
	}
});
