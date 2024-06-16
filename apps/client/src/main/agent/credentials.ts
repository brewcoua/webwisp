import { BrowserWindow, ipcMain, safeStorage } from 'electron'

import Credentials from '../../common/Credentials'

export async function loadCredentials(window: BrowserWindow): Promise<Credentials> {
  const electronStore = await import('electron-store')

  const store = new electronStore.default<Credentials>({
    name: 'credentials',
    clearInvalidConfig: true
  })

  // First, try to load credentials from the store and decrypt them
  let credentials = {
    apiKey: store.get('apiKey'),
    organizationId: store.get('organizationId'),
    projectId: store.get('projectId')
  }

  if (credentials.apiKey) {
    // Decrypt all
    credentials = Object.keys(credentials).reduce(
      (acc, key) => {
        acc[key] = credentials[key]
          ? safeStorage.decryptString(Buffer.from(credentials[key].data))
          : ''
        return acc
      },
      {} as {
        apiKey: string
        organizationId: string
        projectId: string
      }
    )
  }

  return new Promise((resolve) => {
    window.webContents.send('credentials:load', credentials)
    ipcMain.once('credentials:save', (_, credentials: Credentials) => {
      Object.keys(credentials).forEach((key) => {
        store.set(key, credentials[key] ? safeStorage.encryptString(credentials[key]) : '')
      })
      resolve(credentials)
    })
  })
}
