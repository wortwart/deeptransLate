# deeptransLate

## Cross-browser extension for DeepL translations

This extension was created as a demo project for cross-browser extensions as discussed in [c't Magazin issue 26/2017](https://www.heise.de/ct/ausgabe/2017-26-Erweiterungen-fuer-fast-alle-gaengigen-Browser-bauen-3908590.html). It works with Chrome, Firefox, Edge (*see disclaimers*), Opera, Vivaldi, and possibly some lesser-known Chromium browsers.

I'm deeply sorry for the ugly icon.

### Disclaimers

This extension uses an undocumented API. Linguee might shut it down or change it anytime. This project is rather a blueprint for an extension than an actual one (although it does something useful).

Therefore, please don't publish this extension in the stores.

After the last update MS Edge seems to have gone crazy with this extension – at least on my machine. So much about "cross-browser". I currently don't feel motivated to fix that.

### Installation

**Chromium**: Open `chrome://extensions`, click "Load unpacked extension", and select manifest.json in the "chromium-firefox" folder.

**Firefox**: Open `about:addons`, open the cogwheel menu, click "Debug add-ons" – or head straight to `about:debugging#addons`. Click the button "Load add-on temporarily" and select manifest.json in the "chromium-firefox" folder.

**Edge**: Check "Activate developer functions for extensions" in `about:flags`. Open the "..." menu and pick "Load extension". Select the "edge" folder of this repo. (The "edge" folder is identical to the "chromium-firefox" folder except one incompatible line in manifest.json.) Make the extension icon visible in the cogwheel menu.

Temporary extensions disappear in Firefox and Edge after restart. Chromium asks if you want to keep them. If you want to use the extension permanently, you can create a .crx (Chrome, Vivaldi) or .nex file (Opera) in the extension page and install it. In Firefox, head to https://addons.mozilla.org/de/developers/, create developer account, upload the code *without publishing it*, and download a .xpi file.

### How to use it

After installing, select text in a browser tab and click the extension icon or the context menu. The extension sends the text to [DeepL](https://www.deepl.com/translator) and puts the results in a bubble near the selection.

### Step by step folder

For the tutorial, the repository contains six incomplete versions of the extension, each one with more code. Before you can run them you have to copy the main extension's `icons` folder into each of them. If you want to try them in Edge you'll have to add `persistent: true` to the manifest's `background` property (starting with v2). This will stop them from working in Firefox, though.

### Updates 2017-12-22

- *Change bubble size in content.js*. This didn't work before because of static CSS dimensions.
- *Limit number of translation beams*. The DeepL API has "translations" and "beams" but I never saw more than one translation.
- The bubble only shows after we got some server response.
- Closing the bubble now works without inline JavaScript which is a security issue on some webpages.
