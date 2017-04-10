const path = require('path');

const {ipcMain} = require('electron');

const version = require('./package').version;
const mb = require('menubar')({
	height: 735, // 700 + 35
    dir: __dirname,
    icon: path.join(__dirname, 'icons', 'IconTemplate.png')
});

ipcMain.on('NOTIFICATION_CLICKED', () => mb.showWindow());

// if (!require('electron-is-dev')) {
//     const {autoUpdater, dialog} = require('electron');

//     autoUpdater.setFeedURL('http://localhost:3000/updates/latest?v=' + version);

//     mb.on('after-create-window', () => 
//         autoUpdater.on('update-downloaded', () => 
//             dialog.showMessageBox({
//                 buttons: [ 'Now', 'Later' ],
//                 icon: path.join(__dirname, 'images', 'logo-vert.png'),
//                 message: 'Update available!',
//                 detail: 'Please choose whether you would like to install the new application and restart immediately or not.',
//                 type: 'info'
//             }, response => {
//                 if (response === 0) {
//                     autoUpdater.quitAndInstall();
//                 }
//             })
//         )
//     );
// }

require('electron-debug')();
