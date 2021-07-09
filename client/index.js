const ReactDOM            = require('react-dom')
    , React               = require('react')
    , App                 = require('./components/App.js')
    , AdobeExtension      = require('./components/AdobeExtension/AdobeExtension.js')  
;

// require('client/lib/jsx-console/jsx-console.js');
// require('client/lib/FlyoutMenu/FlyoutMenuImpl.js');

const 
    { Provider } = require('react-redux')
    , store = require('./store/store.js')
;


console.log('MacAddress', MacAddress);

// TODO: I'm not sure this is the best place for this.
// const addContextMenu = () => {
//     const {csInterface} = CSLib;
//     if (csInterface) {
//         csInterface.setContextMenuByJSON(
//             JSON.stringify(contextMenuRouter.menuItems), 
//             (menuId) => {
//                 contextMenuRouter.call(menuId);
//                 csInterface.setContextMenu('');
//             }
//         )
//     }
// };

/**
 * Render the panel HTML.
 * Add your own components in /cep-barebones/client/components/
 */
ReactDOM.render(
   <Provider store={store}>
        <App />
        <AdobeExtension />
   </Provider>,
    document.getElementById('root')
);