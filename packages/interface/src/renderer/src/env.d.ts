/// <reference types="vite/client" />

declare interface Electron {
  ipcRenderer: import('electron').IpcRenderer
}

declare const electron: Electron
