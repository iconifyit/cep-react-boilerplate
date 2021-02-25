const ReactDOM            = require('react-dom')
    , React               = require('react')
    , { Provider }        = require('react-redux')
    , { createStore }     = require('redux')
    , App                 = require('client/components/App.js')
    , {contextMenuRouter} = require('./cs-internals.js')
;

const Counter = require('components/Counter.js');
const store = require('client/store/store.js');

/**
 * Render the panel HTML.
 * Add your own components in /cep-barebones/client/components/
 */
ReactDOM.render(
    <Provider store={store}>
        <App>
            <Counter store={store} />
        </App>
    </Provider>,
    document.getElementById('app'), () => {
        csInterface.setContextMenuByJSON(
            JSON.stringify(contextMenuRouter.menuItems), 
            (menuId) => {
                contextMenuRouter.call(menuId);
                csInterface.setContextMenu('');
            }
        )
    }
);
