const {
    CSInterface,
    csInterface,
    SystemPath,
    CSEvent,
    CSXSWindowType
} = CSLib;

// const darkTheme  = require('theme/css/topcoat-desktop-dark.min.css')
//     , lightTheme = require('theme/css/topcoat-desktop-light.min.css')
//     , styles     = require('theme/css/styles.css')
//     , fontCss    = require('theme/font/stylesheet.css')
// ;

/**
 * JSX.js makes life a lot easier. You do not need to restart your CC app to enable 
 * changes to the JSX context. You also DO NOT load the jsx code via the manifest.xml. 
 * If you need to load more jsx files, you can either do it here or, better, 
 * in index.jsx (there are examples in that file already).
 */
try {
    jsx.file('host.all.jsx', (result) => {
        console.log('[JSX] Load host/host.all.jsx', result)
        csInterface.evalScript('createHostInstance()', (result) => {
            console.log('createHostInstance', result);
        })
    });
}
catch(e) {
    console.error('[JSX]', e)
}

/**
 * Load the ThemeSwitcher.
 */
// ThemeSwitcher();

/**
 * Create the context menu router with a splinter table of menuId to callback.
 */
const contextMenuRouter = new ContextMenuRouter(
    ContextMenuJSON, 
    {
        menuItem1 : () => {
            console.log('Call context menu Item One')
        },
        menuItem2 : () => {
            console.log('Call context menu Item Two')
        },
        menuItem3 : () => {
            console.log('Call context menu Item Three')
        }
    }
)

module.exports = {
    // darkTheme,
    // lightTheme,
    // styles,
    // fontCss,
    // ThemeSwitcher,
    
    contextMenuRouter,
}