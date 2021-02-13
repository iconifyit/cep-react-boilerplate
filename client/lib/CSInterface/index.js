module.exports = null;

if (window && window.__adobe_cep__) {
    module.exports = (() => {
        const {CSInterface, SystemPath} = require(`./CSInterface.js`);

        console.log('[CSInterface/index.js] @ CSInterface, SystemPath @', [CSInterface, SystemPath])

        window.CSInterface = CSInterface;

        console.log('[CSInterface/index.js] window.CSInterface', window.CSInterface );

        return window.CSInterface;
    })();
}
