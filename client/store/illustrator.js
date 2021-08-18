const { configureStore } = require('@reduxjs/toolkit');

module.exports = configureStore({ 
    reducer: require('../reducers/illustrator.js') 
});