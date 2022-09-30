/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  setWorkMinutes: (minutes) => ipcRenderer.send("set-work-minutes", minutes),
  setRestMinutes: (minutes) => ipcRenderer.send("set-rest-minutes", minutes),
  startTimer: () => ipcRenderer.send("start-timer"),
  stopTimer: () => ipcRenderer.send("stop-timer"),

  handleProgress: (callback) => ipcRenderer.on('update-progress', callback)
});
