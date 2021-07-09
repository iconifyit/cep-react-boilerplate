const Actions = require('../actions/data.js');
const Database = require('../db/Database');

const initialState = {items: []}

/**
 * The reducer maps the actions to the state updates.
 * It receives the state and the action, and returns the updated state.
 */

function dataReducer(state = initialState, action) {

    if (action.type === 'GET_ALL_PETS_SUCCESS') {
        console.log('[dataReducer][Actions.GET_ALL_PETS_SUCCESS]', action);
        const newState = Object.assign({}, state, {
            items: action.items
        })
        console.log('newState', newState);
        return newState;
    }

    return state;
}

module.exports = dataReducer;