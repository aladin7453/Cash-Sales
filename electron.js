const { app, BrowserWindow, dialog } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const http = require("http");
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";

let mainWindow;
let nextProcess;

const PORT = 3000;

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

function waitForServer(url, timeout = 30000) {
  const start = Date.now();

  return new Promise((resolve, reject) => {
    const check = () => {
      http
        .get(url, () => resolve())
        .on("error", () => {
          if (Date.now() - start > timeout) {
            reject(new Error("Next.js server timeout"));
          } else {
            setTimeout(check, 500);
          }
        });
    };
    check();
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 850,
    autoHideMenuBar: false,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL(`http://localhost:${PORT}`);

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function getAppRoot() {
  return app.isPackaged
    ? path.join(process.resourcesPath, "app.asar.unpacked")
    : __dirname;
}

function startNext() {
  if (nextProcess) return;
  const standaloneDir = path.join(getAppRoot(), ".next", "standalone");
  const serverPath = path.join(standaloneDir, "server.js");

  nextProcess = spawn(process.execPath, [serverPath], {
    cwd: standaloneDir,
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: "1",
      PORT: String(PORT),
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  nextProcess.stdout.on("data", (d) => log.info(`[next] ${d}`));
  nextProcess.stderr.on("data", (d) => log.error(`[next] ${d}`));
  nextProcess.on("error", (err) => log.error("Failed to start Next.js server:", err));
  nextProcess.on("exit", (code) => {
    log.info("Next.js server exited with code", code);
    nextProcess = null;
  });
}

// Auto-update setup 
function setupAutoUpdater() {
  // Only check for updates in packaged builds
  if (!app.isPackaged) return;

  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on("checking-for-update", () => {
    log.info("Checking for update...");
  });

  autoUpdater.on("update-available", (info) => {
    log.info("Update available:", info);
  });

  autoUpdater.on("update-not-available", (info) => {
    log.info("App is up to date.", info);
  });

  autoUpdater.on("error", (err) => {
    log.error("Auto-updater error:", err);
  });

  autoUpdater.on("download-progress", (progress) => {
    log.info(`Download speed: ${progress.bytesPerSecond} - ${progress.percent.toFixed(1)}%`);
  });

  autoUpdater.on("update-downloaded", (info) => {
    dialog
      .showMessageBox(mainWindow, {
        type: "info",
        title: "Update Ready",
        message: `Version ${info.version} has been downloaded.`,
        detail: "The app will restart to apply the update.",
        buttons: ["Restart Now", "Later"],
        defaultId: 0,
      })
      .then((result) => {
        if (result.response === 0) {
          autoUpdater.quitAndInstall();
        }
      });
  });

  autoUpdater.checkForUpdates();
}

app.whenReady().then(async () => {
  startNext();

  try {
    await waitForServer(`http://localhost:${PORT}`);
    createWindow();
    mainWindow.webContents.once("did-finish-load", () => {
      setupAutoUpdater();
    });
  } catch (err) {
    log.error("Server failed to start:", err);
    app.quit();
  }
});

// Kill server cleanly
app.on("window-all-closed", () => {
  if (nextProcess) {
    nextProcess.kill();
    nextProcess = null;
  }
  app.quit();
});

// macOS support
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});