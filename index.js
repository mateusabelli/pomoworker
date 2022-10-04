/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */
const workInputLabel = document.getElementById("workInputLabel");
const workInput = document.getElementById("workInput");

const restInputLabel = document.getElementById("restInputLabel");
const restInput = document.getElementById("restInput");

const resetBtn = document.getElementById("resetBtn");
const startBtn = document.getElementById("startBtn");

const progressBar = document.querySelector(".progress-bar");

const trayToggle = document.getElementById('trayToggle');

workInputLabel.innerText = workInput.value;
restInputLabel.innerText = restInput.value;
resetBtn.setAttribute("disabled", "disabled");

window.electronAPI.setWorkMinutes(workInput.value);
window.electronAPI.setRestMinutes(restInput.value);

workInput.addEventListener("change", () => {
  workInputLabel.innerText = workInput.value;
  window.electronAPI.setWorkMinutes(workInput.value);
});

restInput.addEventListener("change", () => {
  restInputLabel.innerText = restInput.value;
  window.electronAPI.setRestMinutes(restInput.value);
});

startBtn.addEventListener("click", () => {
  window.electronAPI.startTimer();
  startBtn.setAttribute("disabled", "disabled");
  resetBtn.removeAttribute("disabled");
});

resetBtn.addEventListener("click", () => {
  window.electronAPI.stopTimer();
  resetBtn.setAttribute("disabled", "disabled");
  startBtn.removeAttribute("disabled");
});

trayToggle.addEventListener("change",()=>{
  window.electronAPI.toggleTrayStatus();
})

window.electronAPI.handleProgress((event, value) => {
  progressBar.style.width = `${value}%`;
  if (value <= 0) {
    progressBar.classList.replace("bg-info", "bg-primary");
  }
  if (value >= 100) {
    progressBar.classList.replace("bg-primary", "bg-info");
  }
});

// let counter = 0;
// let isRunning = false;

// async function stopTimer() {
//   isRunning = false;
//   resetBtn.setAttribute("disabled", "disabled");
//   startBtn.removeAttribute("disabled");
//   // progressBar.style.width = "0%";
// }
//
// async function startTimer() {
//   startBtn.setAttribute("disabled", "disabled");
//   resetBtn.removeAttribute("disabled");
//
//   counter = 0;
//   isRunning = true;
//   await workTimer();
// }

// async function workTimer() {
//   const timer = setInterval(async () => {
//     if (!isRunning) {
//       clearInterval(timer);
//       return;
//     } else {
//       if (counter >= 100) {
//         new Notification("💧");
//         clearInterval(timer);
//         await restTimer();
//         return;
//       } else {
//         counter += 100 / (workInput.value * 60);
//         console.log(counter);
//         progressBar.style.width = `${counter}%`;
//         progressBar.setAttribute("class", "bg-primary progress-bar");
//         return;
//       }
//     }
//   }, 1000);
// }
//
// async function restTimer() {
//   const timer = setInterval(async () => {
//     if (!isRunning) {
//       clearInterval(timer);
//       return;
//     } else {
//       if (counter <= 0) {
//         new Notification("🚀");
//         clearInterval(timer);
//         await workTimer();
//         return;
//       } else {
//         counter -= 100 / (restInput.value * 60);
//         console.log(counter);
//         progressBar.setAttribute("class", "bg-info progress-bar");
//         progressBar.style.width = `${counter}%`;
//         return;
//       }
//     }
//   }, 1000);
// }
