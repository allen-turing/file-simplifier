const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { version } = require('os');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // For IPC
    },
    icon: path.join(__dirname, 'path/to/your/icon.ico')
  });

  win.loadFile(path.join(__dirname, '..','..','..','dist','FileSimplifier','browser','index.html'));
}

app.whenReady().then(createWindow);

// IPC handlers for file operations
ipcMain.handle('scan-directory', async (event, dirPath) => {
  function getAllFiles(dir) {
    let results = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results = results.concat(getAllFiles(fullPath));
      } else if (entry.isFile()) {
        results.push(fullPath);
      }
    }
    return results;
  }
  try {
    return getAllFiles(dirPath);
  } catch (e) {
    return { error: e.message };
  }
});

ipcMain.handle('delete-file', async (event, filePath) => {
  try {
    fs.unlinkSync(filePath);
    return { success: true };
  } catch (e) {
    return { error: e.message };
  }
});

function moveRecursiveSync(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    for (const entry of fs.readdirSync(src)) {
      const srcPath = path.join(src, entry);
      const destPath = path.join(dest, entry);
      moveRecursiveSync(srcPath, destPath);
    }
    fs.rmdirSync(src);
  } else {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    const destFilePath = path.join(dest, path.basename(src));
    fs.renameSync(src, destFilePath);
  }
}

ipcMain.handle('move-file', async (event, src, dest) => {
  try {
    moveRecursiveSync(src, dest);
    return { success: true, message: 'File moved successfully' };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

function copyRecursiveSync(src, dest) {
  src = path.normalize(src);
  dest = path.normalize(dest);

  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    for (const entry of fs.readdirSync(src)) {
      const srcPath = path.join(src, entry);
      const destPath = path.join(dest, entry);
      copyRecursiveSync(srcPath, destPath);
    }
  } else {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }
    const destFilePath = path.join(dest, path.basename(src));
    fs.copyFileSync(src, destFilePath);
  }
}

ipcMain.handle('copy-file', async (event, src, dest) => {
  try {
    copyRecursiveSync(src, dest);
    return { success: true, message: 'File copied successfully' };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
