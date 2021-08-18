const Actions = require('../actions/illustrator.js');
const {
    HostResponse,
    Result,
    Callback,
    UserCancelledError,
    makeHostResponse,
    hostResponseError,
} = require('../lib/HostResponse');
const Host = require('../lib/HostInterface.js');


module.exports = (state = {value: ''}, action) => {
    // console.log('[illustrator reducer][action]', action.type)

    if (action.type === Actions.alert().type) {

        Host.exec('alert', 'Hi!', (result) => {
            console.log('[illustrator reducer][result]', result)
        });

        return Object.assign({}, state, {
            value: 'Hola!'
        })
    }

    // if (action.type === Actions.alert().type) {

    //     Host.exec('alert', 'Hi!', (result) => {
    //         console.log('[illustrator reducer][result]', result)
    //     });

    //     return Object.assign({}, state, {
    //         value: 'Hola!'
    //     })
    // }

    return state;
};