'use strict';
console.info('DeeptransLate content', new Date().toISOString());
const ua = typeof browser === 'undefined'? chrome : browser;
const bubbleSize = {width: 320, height: 60};
const arrowSize = {width: 40, height: 10};
let lastId = 0;

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
		<span class="dlExtClose" onclick="javascript: this.parentNode.remove();">X</span>
		<span class="dlArrow" style="left: ${arrowLeft}px"></span>
	</div>`;
};

const embed_translation = resp => {
	const bubble = document.getElementById('dl' + resp.id);
	if (bubble === null) return;
	bubble.setAttribute('data-translateFrom', resp.result.source_lang);
	bubble.setAttribute('data-translateTo', resp.result.target_lang);
	let html = `<div><ol>`;
	resp.result.translations.forEach(el => {
		html += `<li><ol>`;
		el.beams.forEach(beam => {
			html += `<li data-score="${beam.score}">${beam.postprocessed_sentence}</li>`;
		});
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
		console.info('DeeptransLate: extension button clicked');
		sendSelection(respond);
	} else if (msg.trigger === 'menuClicked') {
		console.info('DeeptransLate: context menu clicked');
		sendSelection(respond);
	} else if (msg.trigger === 'translated') {
		embed_translation(msg.data);
	}
});
