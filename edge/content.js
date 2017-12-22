'use strict';
const debug = false;
const bubbleSize = {width: 320, height: 66};
const arrowSize = {width: 40, height: 10};
const maxShownTranslations = 3;

if (debug)
	console.info(`DeeptransLate content: ${new Date().toISOString()}`);
const ua = typeof browser === 'undefined'? chrome : browser;
let lastId = 0;

// Dynamic CSS
const style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = `
.dl {
	width: ${bubbleSize.width - 10}px;
	height: ${bubbleSize.height - 10}px;
}
.dlExt > div {
	width: calc(${bubbleSize.width - 20}px - 1em);
	max-height: ${bubbleSize.height - 10}px;
}
.dlExt ol {
	height: ${bubbleSize.height - 18}px;
}`;
document.querySelector('head').appendChild(style);

const createBubble = (rect, id) => {
	let bLeft = window.scrollX + rect.left + rect.width/2 - bubbleSize.width/2;
	let bTop = window.scrollY + rect.top - bubbleSize.height - arrowSize.height;
	let arrowLeft = (bubbleSize.width - arrowSize.width)/2;
	if (bLeft < 0) {
		arrowLeft += bLeft;
		bLeft = 0;
	} else if (bLeft + bubbleSize.width > window.innerWidth) {
		const bLeftOld = bLeft;
		bLeft = window.innerWidth - 20 - bubbleSize.width;
		arrowLeft += bLeftOld - bLeft;
	}
	document.body.innerHTML += `
	<div class="dlExt" id="dl${id}" style="left: ${bLeft}px; top: ${bTop}px;">
		<span class="dlExtClose">X</span>
		<span class="dlArrow" style="left: ${arrowLeft}px"></span>
	</div>`;
	document.querySelector('#dl' + id + '>.dlExtClose').addEventListener('click', ev => {
		ev.target.parentNode.remove();
	});
};

const embed_translation = resp => {
	const bubble = document.getElementById('dl' + resp.id);
	if (bubble === null) return;
	bubble.setAttribute('data-translateFrom', resp.result.source_lang);
	bubble.setAttribute('data-translateTo', resp.result.target_lang);
	let html = `<div><ol>`;
	resp.result.translations.forEach(el => {
		html += `<li><ol>`;
		const limit = el.beams.length < maxShownTranslations?
			el.beams.length :
			maxShownTranslations;
		for (let i = 0; i < limit; i++)
			html += `<li data-score="${el.beams[i].score}">${el.beams[i].postprocessed_sentence}</li>`;
		html += `</ol></li>`;
	});
	html += `</ol></div>`;
	bubble.insertAdjacentHTML('afterbegin', html);
	bubble.style.display = 'block';
}

const sendSelection = respond => {
	const sel = window.getSelection();
	const selText = sel.toString().trim();
	if (selText.length < 2) selText = '';
	if (!selText)
		return alert(`No text selected!`);
	const sRange = sel.getRangeAt(0);
	const sRect = sRange.getBoundingClientRect();
	createBubble(sRect, ++lastId);
	if (debug)
		console.info(`Send back "${selText}"`);
	respond({selection: selText, id: lastId});
};

ua.runtime.onMessage.addListener((msg, sender, respond) => {
	// Error handling
	if (msg.data) {
		let warning;
		if (typeof msg.data === 'string') {
			let warn = msg.data.split('WARNING:');
			if (warn.length === 2)
				warning = warn[1];
		} else if (msg.data.warning) {
			warning = msg.data.warning;
		}
		if (warning) {
			console.warn(warning, msg);
			return alert(`DeeptransLate problem: ${warning}`);
		}
	}

	if (msg.trigger === 'buttonClicked') {
		if (debug)
			console.info('DeeptransLate: extension button clicked');
		sendSelection(respond);
	} else if (msg.trigger === 'menuClicked') {
		if (debug)
			console.info('DeeptransLate: context menu clicked');
		sendSelection(respond);
	} else if (msg.trigger === 'translated') {
		embed_translation(msg.data);
	}
});
