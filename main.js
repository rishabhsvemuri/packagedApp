const { app, BrowserWindow, ipcMain} = require('electron/main')
const { exec } = require('child_process');
const path = require('node:path');
const { Plot } = require('./plots/plot.js');
const fs = require('node:fs').promises;
const writePath = path.join(__dirname, 'written.R');
let savePath;
let mainWindow;
let plots = new Map();
let items = [];

function createWindow () {
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  mainWindow.loadFile('index.html')
  clearPath();
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('save-path', (event, pathText) => {
  savePath = pathText.toString();
});

// display png in window and download pdf
ipcMain.on('run-script', (event) => {
  writeScript();
  const command = `Rscript "${writePath}"`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing R script: ${error.message}`);
      return;
    }
    if (stdout) {
      mainWindow.webContents.send('refresh-pdf', savePath);
    }
   });
})

ipcMain.on('add-item', (event, newItem, category) => {
    items.push({ name: newItem, category: null });
    mainWindow.webContents.send('item-added', newItem);
});

ipcMain.on('update-category', (event, itemName, category, itemId) => {
  plots.set(itemId, new Plot(category.toString()+'('));
});

ipcMain.on('update-item', (event, itemId, field, val) => {
  var curr = plots.get(itemId)
  curr[field] = val;
});

async function writeScript() {
  await clearPath();
  await startScript();
  await writeCommands();
  await closeScript();
}

async function startScript() {
  const pather = 'pdf(\"' + savePath + '\")\n'
  await fs.appendFile(writePath, pather, err => {
    if (err) {
      console.error(err);
    }
  });
}

async function writeCommands() {
  for (let [id, plot] of plots) {
    var command = plot.maker.toString();
    for (const property in plot)
    {
      if (plot[property] != undefined && property.toString() != 'maker') {
        const line = plot[property].toString() + ', ';
        command += line;
      }
    }
    command += ')\n';
    console.log(command);
    await fs.appendFile(writePath, command, err => {
      if (err) {
        console.err(err);
      }
    })
  }
}

async function closeScript() {
  await fs.appendFile(writePath, 'dev.off()\n', err => {
    if (err) {
      console.error(err);
    }
  });
}

async function clearPath() {
  await fs.writeFile(writePath, '', err => {
    if (err) {
      console.error(err);
    }
  });
}