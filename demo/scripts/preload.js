const {contextBridge, ipcRenderer} = require("electron");


contextBridge.exposeInMainWorld("API", {

    load_page: async (page_name) => {
        return await ipcRenderer.invoke("display::load_page", page_name);
    }
})