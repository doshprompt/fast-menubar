const path = require('path');

const {ipcMain} = require('electron');

const mb = require('menubar')({
	height: 735, // 700 + 35
    dir: __dirname,
    icon: path.join(__dirname, 'icons', 'IconTemplate.png')
});

ipcMain.on('NOTIFICATION_CLICKED', () => {
	mb.showWindow();
});

require('electron-debug')();
