const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const koffi = require('koffi')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  const vulkan = koffi.load('libvulkan.so.1')
  const VkInstanceCreateInfo = koffi.struct('VkInstanceCreateInfo', {
    sType: 'int',
    pNext: 'void*',
    flags: 'uint32_t',
    pApplicationInfo: 'void*',
    enabledLayerCount: 'uint32_t',
    ppEnabledLayerNames: 'char*',
    enabledExtensionCount: 'uint32_t',
    ppEnabledExtensionNames: 'char*'
  })
  const VkInstance = koffi.pointer('VkInstance', koffi.opaque(), 1)
  const vkCreateInstance = vulkan.func('int vkCreateInstance(VkInstanceCreateInfo*, void*, _Out_ VkInstance*)')
  const instance_handle = [0]
  const result = vkCreateInstance({
    sType: 1,
    pNext: null,
    flags: 0,
    pApplicationInfo: null,
    enabledLayerCount: 0,
    ppEnabledLayerNames: null,
    enabledExtensionCount: 0,
    ppEnabledExtensionNames: null
  }, null, instance_handle)
  if (result === 0) {
    console.log('Successfully created Vulkan instance!', instance_handle[0])
  } else {
    console.warn('Failed to create Vulkan instance with error code', result)
  }

  // Create the browser window.
  win = new BrowserWindow({width: 1000, height: 700})

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  win.setMenu(null)

  // Open the DevTools.
  // win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
