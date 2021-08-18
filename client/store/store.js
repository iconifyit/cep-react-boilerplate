const { configureStore, combineReducers } = require('@reduxjs/toolkit');
const counterReducer = require('../reducers/counterReducer.js');
const dataReducer = require('../reducers/dataReducer.js');
const illustratorReducer = require('../reducers/illustrator');
const thunk = require('redux-thunk').default;
const { createStore, compose, applyMiddleware } = require('redux');

// const store = createStore(dataReducer, {items: []}, applyMiddleware(thunk))

const initialState = {
    data : {
        items : [],
        open : false,
    },
};

// const xstore = configureStore({ 
//     reducer: combineReducers({
//         data: dataReducer, 
//         illustrator: illustratorReducer,
//     })
// }, compose(applyMiddleware(thunk)))


const store = createStore(
    combineReducers({
        data: dataReducer, 
        illustrator: illustratorReducer,
    }), 
    initialState, 
    compose(applyMiddleware(thunk))
);

console.log('[store.js] 2', store)

module.exports = store;

