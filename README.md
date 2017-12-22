# deeptransLate

## Cross-browser extension for DeepL translations

This extension was created as a demo project for cross-browser extensions as discussed in [c't Magazin](https://ct.de/), probably issue 25/2017. It works with Chrome, Firefox, Edge, Opera, Vivaldi, and possibly some lesser-known Chromium browsers. Edge users have to install the version in the `edge` directory (it only differs in one line in manifest.json).

I'm deeply sorry for the ugly icon.

### How to use it

You can install unpacked extensions in every browser that can run them. Start with chrome://extensions (Chrome & Co.), about:addons (Firefox) or about:flags (Edge).

After installing, select text in a browser tab and click the extension icon or the context menu. The extension sends the text to [DeepL](https://www.deepl.com/translator) and puts the results in a bubble near the selection.

### Step by step folder

For the tutorial, the repository contains six incomplete versions of the extension, each one with more code. Before you can run them you have to copy the main extension's `icons` folder into each of them. If you want to try them in Edge you'll have to add `persistent: true` to the manifest's `background` property (starting with v2). This will stop them from working in Firefox, though.

### Updates 2017-12-22

- *Change bubble size in content.js*. This didn't work before because of static CSS dimensions.
- *Limit number of translation beams*. The DeepL API has "translations" and "beams" but I never saw more than one translation.
- The bubble only shows after we got some server response.
- Closing the bubble now works without inline JavaScript which is a security issue on some webpages.

Alas, MS Edge seems to have gone batshit crazy with this extension - at least on my machine. So much about "cross-browser". If (and that's a big if) I find motivation I'll try to fix the issues that the last browser update broke.
