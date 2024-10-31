// region import

const electron = require("electron"); // import electron lib
const {app, BrowserWindow, screen} = require("electron"); // import from electron
const path = require("path"); // import path lib
const fs = require("fs"); // import fs lib

// end region


function load_page(event, _page) { // function that reads a file and send it text to client
    return fs.readFileSync(
        path.join(__dirname, "../assets/pages", _page),
        "utf8"
    );
}


function get_settings() { // function that finds a settings.json file and send it text if file is exist
    if (fs.existsSync(path.join(__dirname, "../preferences/settings.json"))) { // if file exist
        const file = JSON.parse( // read file 'settings.json'
            fs.readFileSync(
                path.join(
                    __dirname,
                    "../preferences/settings.json"),
                "utf-8"));
        return [true, file];
    } else { // otherwise
        return [false, false];
    }
}

function delay(ms) { // synchronous setTimeout function
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    });
}

function crash(message) { // function that writes a crash reports
    const date = new Date(); // the name of file generates by current date
    fs.writeFileSync(
        path.join(__dirname, "../preferences/crashes", `${date.getTime()}.txt`),
        message,
    );
}

function createWindow() { // function that creates a main window
    const _screen = screen.getPrimaryDisplay();
    const {width, height} = _screen.workAreaSize; // the size of user display

    const window = new BrowserWindow({ // create window
        width: width,
        height: height,
        title: "OPIE",
        icon: path.join(__dirname, "../assets/images/ico/opie-ide-logo.ico"),
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js") // path to file with API
        }
    });
    window.loadFile(path.join(__dirname, "index.html")).then(() => {
    }); // load html file

}

app.whenReady().then(async function () {
    electron.ipcMain.handle("display::load_page", load_page); // handle API query from frontend with function in backend


    const settings_array = await get_settings(); // get settings text
    if (settings_array[0] === false) {
        const win1 = new BrowserWindow({
            width: 600,
            height: 600,
        })
        await delay(2000);
        win1.destroy();
        await crash("File 'settings.json' not defined");
        return 0;
    }
    // const settings_json = settings_array[1];

    createWindow();


})