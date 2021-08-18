
const {
    CSInterface,
    csInterface,
    SystemPath,
    CSEvent,
    CSXSWindowType
} = CSLib;

const {
    HostResponse,
    Result,
    Callback,
    UserCancelledError,
    makeHostResponse,
    hostResponseError,
} = require('../lib/HostResponse');

/**
 * Client Controller object.
 * @param $
 * @param csInterface
 * @returns {Instance}
 * @constructor
 */
 class HostInterface {
    constructor(csInterface) {
        this.csInterface = csInterface;
    }

    /**
     * Call the csInterface to open session.
     * @param {string}          method      The Host.method to call
     * @param {string|Array}    args        The argument list to pass to the Host method.
     * @param {Function}        callback
     */
    exec(method, args, callback) {
        try {
            // console.log('Instance.prototype.host', [method, args, callback]);

            var _callback;

            if (args instanceof Function) {
                callback = args;
                args = '';
            }

            _callback = new Callback(callback);

            /*
             * Format the arguments list as a string. Since csInterface.evalScript relies on eval(),
             * we need the signature to be a string with valid JS syntax. Converting the arguments list
             * to strings requires a little 'massaging'.
             */

            var _arguments = args;

            /*
             * If the arguments list is an array, we need the items but not the brackets.
             */
            if (args instanceof Array) {
                _arguments = stringify(args).slice(1, -1);
            }
            /*
             * If the argument is an object, we just need it as a string.
             */
            else if (args instanceof Object) {
                _arguments = stringify(args);
            }
            /*
             * Otherwise we need to quote the string.
             */
            else if (_arguments) {
                _arguments = '\'' + _arguments + '\'';
            }

            /*
             * Call the host method via csInterface.
             */

            // console.log( 'Host.' + method + '(' + _arguments + ')' );

            csInterface.evalScript('Host.' + method + '(' + _arguments + ')', _callback);
        }
        catch(e) { console.error(e) }
    }
}

module.exports = new HostInterface(csInterface);