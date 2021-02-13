const ReactDOM          = require('react-dom')
    , React             = require('react')
    , {CSInterface, SystemPath, CSEvent} = require('client/lib/CSInterface/CSInterface.js')
    , csInterface       = new CSInterface()
    , fs                = require('fs')
    , path              = require('path')
    , FlyoutMenuImpl    = require('client/lib/FlyoutMenu/FlyoutMenuImpl.js')
    , ThemeSwitcher     = require('client/lib/ThemeSwitcher/ThemeSwitcher.js')
    , App = require('client/components/App.js');
;

/**
 * This library allows you to write to the CEF/brower console from the JSX context. 
 * All of your logging in a single place.
 */
require('client/lib/jsx-console/jsx-console.js')

/**
 * Attach csInterface to the global window object.
 */
window.csInterface = csInterface

/**
 * Global shortcut to the Extension Path.
 */
window.kEXT_PATH   = csInterface.getSystemPath(window.SystemPath.EXTENSION);

/**
 * JSX.js makes life a lot easier. You do not need to restart your CC app to enable 
 * changes to the JSX context. You also DO NOT load the jsx code via the manifest.xml. 
 * If you need to load more jsx files, you can either do it here or, better, 
 * in index.jsx (there are examples in that file already).
 */
try {
    jsx.file('host.all.jsx', (result) => {
        console.log('[JSX] Load host/host.all.jsx')
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
ThemeSwitcher();

/**
 * Create the Flyout menu.
 * Update the menu in /cep-barebones/client/lib/FlyoutMenu/FlyoutMenuImpl.js
 */
new FlyoutMenuImpl(true);

/**
 * Render the panel HTML.
 * Add your own components in /cep-barebones/client/components/
 */
ReactDOM.render(<App />, document.getElementById('app'));