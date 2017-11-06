'use strict';
console.log('DeeptransLate content', new Date().toISOString());
const browser = window.browser || window.chrome;



browser.runtime.onMessage.addListener(request => {
  console.log("Message from the background script:");
  console.log(request.greeting);
  return Promise.resolve({response: "Hi from content script"});
});

/*
const sendSelection = respond => {
	let selection = window.getSelection().toString().trim();
	if (!selection.length) return;
	respond(selection);
};

browser.runtime.onMessage.addListener((request, sender, respond) => {
	console.log(request)
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
*/