'use strict';
console.log('Content');

chrome.runtime.onMessage.addListener((msg, sender, respond) => {
	console.log(msg);
});
