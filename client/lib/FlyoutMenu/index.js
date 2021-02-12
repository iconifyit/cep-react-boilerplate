module.exports = null;

if (window && window.__adobe_cep__) {
    module.exports = (() => {
        window.FlyoutMenu = require('./FlyoutMenu.js');
        console.log('[FlyoutMenu/index.js] window.FlyoutMenu', window.FlyoutMenu );
        return window.FlyoutMenu;
    })();
}
