// Modules to control application life and create native browser window
const { app, BrowserWindow, Notification, ipcMain } = require("electron");
const path = require("path");

let mainWindow;
let counter = 0;
let isRunning = false;
let workMinutes = 0;
let restMinutes = 0;

try {
  require("electron-reloader")(module);
} catch {}

function createWindow() {
  mainWindow = new BrowserWindow({
    title: "PomoWorker",
    width: 350,
    height: 290,
    autoHideMenuBar: true,
    icon: path.join("icon.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  // Create the browser window.

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "index.html"));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// const NOTIFICATION_TITLE = "Basic Notification";
// const NOTIFICATION_BODY = "Notification from the Main process";
//
// function showNotification() {
//   setInterval(() => {
//     new Notification({
//       title: NOTIFICATION_TITLE,
//       body: NOTIFICATION_BODY,
//     }).show();
//   }, 60000);
// }

function stopTimer() {
  isRunning = false;
}

function startTimer() {
  counter = 0;
  isRunning = true;
  workTimer();
}

function workTimer() {
  return new Promise(() => {
    let timer = setInterval(() => {
      if (!isRunning) {
        clearInterval(timer);
        return;
      }
      if (counter >= 100) {
        new Notification({ title: "💧" }).show();
        clearInterval(timer);
        restTimer();
        return;
      }
      counter += 100 / (workMinutes * 60);
      mainWindow.webContents.send("update-progress", counter);
    }, 1000);
  });
}

function restTimer() {
  return new Promise(() => {
    let timer = setInterval(() => {
      if (!isRunning) {
        clearInterval(timer);
        return;
      }
      if (counter <= 0) {
        new Notification({ title: "🚀" }).show();
        clearInterval(timer);
        workTimer();
        return;
      }
      counter -= 100 / (restMinutes * 60);
      mainWindow.webContents.send("update-progress", counter);
    }, 1000);
  });
}

ipcMain.on("set-work-minutes", (e, minutes) => (workMinutes = minutes));
ipcMain.on("set-rest-minutes", (e, minutes) => (restMinutes = minutes));
ipcMain.on("start-timer", () => startTimer());
ipcMain.on("stop-timer", () => stopTimer());

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // showNotification();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
