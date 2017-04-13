const open = require('open');
const path = require('path');

const { ipcRenderer, remote } = require('electron');

const osLocale = require('os-locale');
const isOnline = require('is-online');
const rp = require('request-promise');

const {NotificationCenter} = require('node-notifier');
const notifier = new NotificationCenter({
    customPath: __dirname + '/vendor/fast.com .app/Contents/MacOS/fast.com '
});

const OOKLA_TEST_URL = 'https://www.speedtest.net';
const FAST_URL = 'https://fast.com';

const check = () => {
    isOnline().then(online => {
        if (!online) {
            getElementsByClassName(document, 'logo-block')[0].style.display = 'none';
            getElementsByClassName(document, 'error-block')[0].style.display = 'inline-block';
        } else {
            getElementsByClassName(document, 'logo-block')[0].style.display = 'inline-block';
            getElementsByClassName(document, 'error-block')[0].style.display = 'none';

            osLocale().then(locale => {
                loadPageAsync(FAST_URL, locale.replace('_', '-'));
            });
        }
    });
}

let appLocationTimer;
let appLocationScripts;
let newLocationStylesheets;
function loadPageAsync(url, language) {
    clearTimeout(appLocationTimer);

    appLocationTimer = setTimeout(function() {
        removeNodes(appLocationScripts);
        removeNodes(newLocationStylesheets);

        rp({
            url: url,
            headers: {
                'accept-language': language
            }
        }).then(htmlString => {
            let parser = new DOMParser();
            let originalDoc = document;
            let newDocument = parser.parseFromString(htmlString, 'text/html');
            let newScripts = importNodes(newDocument, originalDoc, 'script', 'src', url);
            let newStylesheets = importNodes(newDocument, originalDoc, 'link', 'href', url);

            setTimeout(function() {
                injectNodes(newStylesheets, originalDoc, 'head');
                importBody(newDocument, originalDoc);

                injectNodes(newScripts, originalDoc, 'body');

                appLocationScripts = newScripts;
                newLocationStylesheets = newStylesheets;

                replaceLinks(originalDoc, 'span', 'target-language-path', url);

                // hide loading indicator
                setTimeout(() => {
                    getElementsByClassName(originalDoc, 'splash-screen')[0].style.display = 'none';
                }, 250);

                getElementById(originalDoc, 'test-help-btn').addEventListener('click', () => {
                    let helpContent = getElementById(originalDoc, 'help-content');
                    let windowContent = getElementsByClassName(originalDoc, 'window-content')[0];
                    
                    if (helpContent.style.display === 'block') {
                        window.scrollTo(0, 0)
                    } else {
                        setTimeout(function() {
                            helpContent.scrollIntoView();
                        });
                    }
                });

                addClassNameListener('#speed-progress-indicator', newClasses => {
                    if (newClasses.indexOf('in-progress') === -1 && isHidden(document)) {
                        notifier.notify({
                            title: 'Speedtest Complete!',
                            message: 'Your Speed: ' + getElementById(document, 'speed-value').innerText + ' ' + getElementById(document, 'speed-units').innerText,
                            timeout: true
                        }).on('click', () => ipcRenderer.send('NOTIFICATION_CLICKED'));
                    }
                });
            }, 250);
        }).catch(check);
    });
}

getElementsByClassName(document, 'retry')[0].addEventListener('click', check); // refresh, reload

getElementsByClassName(document, 'exit')[0].addEventListener('click', () => remote.app.quit());

getElementsByClassName(document, 'ookla')[0].addEventListener('click', () => open(OOKLA_TEST_URL));

check();
