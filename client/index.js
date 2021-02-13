const ReactDOM      = require('react-dom')
    , React         = require('react')
    , {CSInterface, SystemPath, CSEvent} = require('client/lib/CSInterface/CSInterface.js')
    , csInterface = new CSInterface()
    , fs          = require('fs')
    , path       = require('path')
;

require('client/lib/jsx-console/jsx-console.js')

window.csInterface = csInterface
window.kEXT_PATH   = csInterface.getSystemPath(window.SystemPath.EXTENSION);

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

const App = require('client/components/App.js');

ReactDOM.render(<App />, document.getElementById('app'));