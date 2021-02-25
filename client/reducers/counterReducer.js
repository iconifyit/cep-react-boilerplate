const Actions = require('../actions/counter.js');


const initialState = {
    value: 0
}

function counterReducer(state = initialState, action) {
    console.log('counterReducer action', action.type)

    if (action.type === Actions.increment().type) {
        return Object.assign({}, state, {
            value: state.value + 1
        })
    }

    if (action.type === Actions.decrement().type) {
        return Object.assign({}, state, {
            value: state.value - 1 >= 0 ? state.value - 1 : 0
        })
    }

    if (action.type === Actions.reset().type) {
        return Object.assign({}, state, {
            value: 0
        })
    }

    return state;
}

module.exports = counterReducer;