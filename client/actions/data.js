const Database = require('../db/Database');
const PetsModel = require('../models/Pets');

// const db = Database.get()
// console.log('Database', db);

/**
 * The actions trigger the action being called.
 * Actions act as the glue between the UI and the logic, typically a Model 
 * but can also be the application itself in the case of Adobe CEP extensions.
 */

const getPetsSuccess = (items) => {
    return {
        type: 'GET_ALL_PETS_SUCCESS',
        items
    }
}

const getPets = () => {
    return async (dispatch) => {      
        const _model = await PetsModel;
        const pets = await _model.getAll();
        console.log('Pets.getPets', pets);
        return dispatch(getPetsSuccess(pets));
    };
}  

module.exports = {
    getPets : getPets
}