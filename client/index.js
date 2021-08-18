const ReactDOM            = require('react-dom')
    , React               = require('react')
    , App                 = require('./components/App.js')
    , AdobeExtension      = require('./components/AdobeExtension/AdobeExtension.js')  
;

const 
    { Provider } = require('react-redux')
    , store = require('./store/store.js')
;

console.log('MacAddress', MacAddress);

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