const counterReducer = require('../reducers/counterReducer.js');
const { configureStore } = require('@reduxjs/toolkit')

const store = configureStore({ reducer: counterReducer })

console.log(store.getState())

module.exports = store;