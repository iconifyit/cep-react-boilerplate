const ReactDOM            = require('react-dom')
    , React               = require('react')
    , App                 = require('client/components/App.js')
    , {contextMenuRouter} = require('./cs-internals.js')
;

const jsxConsole        = require('client/lib/jsx-console/jsx-console.js');
const FlyoutMenuImpl    = require('client/lib/FlyoutMenu/FlyoutMenuImpl.js');

// ThemeSwitcher       : 'client/lib/ThemeSwitcher/ThemeSwitcher.js',
// CSLib               : 'client/lib/CSInterface/CSInterface.js',
// jsxConsole          : 'client/lib/jsx-console/jsx-console.js',
// flyoutMenuImpl      : 'client/lib/FlyoutMenu/FlyoutMenuImpl.js',
// ContextMenuRouter   : 'client/lib/ContextMenuRouter/ContextMenuRouter.js',
// ContextMenuJSON     : 'client/lib/ContextMenuRouter/ContextMenuExample.json',
// darkTheme           : 'client/theme/css/topcoat-desktop-dark.min.css',
// lightTheme          : 'client/theme/css/topcoat-desktop-light.min.css',
// styles              : 'client/theme/css/styles.css',
// fontCss             : 'client/theme/font/stylesheet.css'

console.log('jsxConsole', jsxConsole);

const macaddress = require('macaddress');

macaddress.all().then(addresses => console.log('MAC', addresses));

const addContextMenu = () => {
    if (csInterface) {
        csInterface.setContextMenuByJSON(
            JSON.stringify(contextMenuRouter.menuItems), 
            (menuId) => {
                contextMenuRouter.call(menuId);
                csInterface.setContextMenu('');
            }
        )
    }
};

/**
 * Render the panel HTML.
 * Add your own components in /cep-barebones/client/components/
 */
ReactDOM.render(
    <App />,
    document.getElementById('root'), 
    addContextMenu
);