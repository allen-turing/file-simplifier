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
    }
  });

  win.loadFile(path.join(__dirname, 'dist/FileSimplifier/browser/index.html'));
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
    console.error('scan-directory error:', e);
    return { error: e.message };
  }
});

ipcMain.handle('delete-file', async (event, filePath) => {
  try {
    fs.unlinkSync(filePath);
    return { success: true };
  } catch (e) {
    console.error('delete-file error:', e);
    return { error: e.message };
  }
});

function moveRecursiveSync(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) {
      console.log("Creating directory:", dest);
      fs.mkdirSync(dest, { recursive: true });
    }
    for (const entry of fs.readdirSync(src)) {
      const srcPath = path.join(src, entry);
      const destPath = path.join(dest, entry);
      console.log("Moving from:", srcPath, "to", destPath);
      moveRecursiveSync(srcPath, destPath);
    }
    fs.rmdirSync(src);
  } else {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      console.log("Creating parent directory for file:", destDir);
      fs.mkdirSync(destDir, { recursive: true });
    }
    const destFilePath = path.join(dest, path.basename(src));
    console.log("Not a Directory so Moving file:", src, "to", destFilePath);
    fs.renameSync(src, destFilePath);
  }
}

ipcMain.handle('move-file', async (event, src, dest) => {
  try {
    moveRecursiveSync(src, dest);
    console.log('Move operation successful:', src, 'to', dest);
    return { success: true, message: 'File moved successfully' };
  } catch (e) {
    console.error('move-file error:', e, 'src:', src, 'dest:', dest);
    return { success: false, error: e.message };
  }
});

function copyRecursiveSync(src, dest) {
  src = path.normalize(src);
  dest = path.normalize(dest);

  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    console.log("This is a directory:", src, "to", dest);
    if (!fs.existsSync(dest)) {
        console.log("Creating directory:", dest);
        fs.mkdirSync(dest, { recursive: true });
    }
    for (const entry of fs.readdirSync(src)) {
      const srcPath = path.join(src, entry);
      const destPath = path.join(dest, entry);
      console.log("Copying from:", srcPath, "to", destPath);
      copyRecursiveSync(srcPath, destPath);
    }
  } else {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
        console.log("Creating parent directory for file:", destDir);
        fs.mkdirSync(destDir, { recursive: true });
    }
    const destFilePath = path.join(dest, path.basename(src));
    console.log("Not a Directory so Copying file:", src, "to", destFilePath);
    fs.copyFileSync(src, destFilePath);
  }
}

ipcMain.handle('copy-file', async (event, src, dest) => {
  try {
    copyRecursiveSync(src, dest);
    console.log('Copy operation successful:', src, 'to', dest);
    return { success: true, message: 'File copied successfully' };
  } catch (e) {
    console.error('copy-file error:', e, 'src:', src, 'dest:', dest);
    return { success: false, error: e.message };
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
