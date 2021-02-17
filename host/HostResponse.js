var JSON = require(__dirname + '/core/JSON.jsx');
var polyfills = require(__dirname + '/core/polyfills.js');

class HostResponse {
    constructor(value, error) {
        this.value = value;
        this.error = error;
    
        if (value instanceof Error) {
            error = value;
            this.error = error.name + ' : ' + error.message;
            this.value = error.name + ' : ' + error.message;
        }

        this.getValue   = this.getValue.bind(this);
        this.getError   = this.getError.bind(this);
        this.isError    = this.isError.bind(this);
        this.valueOf    = this.valueOf.bind(this);
        this.stringify  = this.stringify.bind(this);
        this.validate   = this.validate.bind(this);
        this.parse      = this.parse.bind(this);
    }

    getValue() {
        return this.value;
    }

    getError() {
        return this.error;
    }

    isError() {
        return (typeof this.error !== 'undefined');
    }

    valueOf() {
        return {
            "value": this.getValue(),
            "error": this.getError()
        }
    }

    stringify() {
        return JSON.stringify(this.valueOf())
    }

    validate(jsonString) {
        try {
            var o = JSON.parse(jsonString);
    
            // Handle non-exception-throwing cases:
            // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
            // but... JSON.parse(null) returns null, and typeof null === "object",
            // so we must check for that, too. Thankfully, null is falsey, so this suffices:
            if (o && typeof o === "object") {
                return true;
            }
        }
        catch(e){}
    
        return false;
    }

    parse(stringValue) {

        // console.log('HostResponse.parse(stringValue)', stringValue);
    
        var obj, error, value;
    
        obj = {
            value : null,
            error : "Parse error. " + stringValue + " is not a valid JSON string"
        };
    
        if (this.validate(stringValue)) {
            obj = JSON.parse(stringValue);
            error = '';
            value = obj.value;
        }
    
        this.error = obj.error;
        this.value = obj.value;
    
        return this;
    }
}

class Result {
    constructor(result, _default) {
        try {
            if (typeof result !== 'undefined') {
                return new HostResponse(true);
            }
            return new HostResponse().parse(result);
        }
        catch(e) {
            new HostResponse(new Error(e.message));
        }
    }
}

class UserCancelledError extends Error {
    consructor(message) {
        this.name = 'UserCancelledError';
        this.message = message || 'User cancelled';
    }
}

class HostResponseError extends Error {
    consructor(message) {
        this.name = 'HostResponseError';
        this.message = message || 'Host response error';
    }
}

/**
 * Create a standardized callback for use with the HostResponse object.
 * @param   {Function}  callback    The original callback being wrappped in the Callback class.
 * @returns {function(...[*]=)}
 * @constructor
 */
class Callback {
    constructor(callback) {
        return function (_result) {

            /*
             * Wrap the Host.method result in a HostResponse object for a consistent interface.
             */
            _result = new Result(_result);
    
            /*
             * If there is an error, bug out.
             */
            if (_result.isError()) {
                throw new HostResponseError(_result.getError());
            }
    
            /*
             * Execute the original callback if it's a function.
             */
            if (callback instanceof Function) {
                callback(_result);
            }
        }
    }
}

/**
 * Shortcut to create HostResponse JSON object.
 * @param value
 * @param error
 * @returns {string}
 */
function makeHostResponse(value, error) {
    return new HostResponse(value, error).stringify();
}

/**
 * Shortcut to create HostResponse error JSON object.
 * @param message
 * @returns {string}
 */
function hostResponseError(message) {
    return makeHostResponse(
        new Error(message)
    );
}

(function(global) {
    global.HostResponse       = HostResponse;
    global.makeHostResponse   = makeHostResponse;
    global.hostResponseError  = hostResponseError;
    global.Result             = Result;
    global.Callback           = Callback;
    global.UserCancelledError = UserCancelledError;
    global.makeHostResponse   = makeHostResponse;
    global.hostResponseError  = hostResponseError;
})(
    typeof module !== 'undefined' && typeof module.exports !== 'undefined' 
    ? module.exports 
    : {}
);

(function(global) {
    global.HostResponse       = HostResponse;
    global.makeHostResponse   = makeHostResponse;
    global.hostResponseError  = hostResponseError;
    global.Result             = Result;
    global.Callback           = Callback;
    global.UserCancelledError = UserCancelledError;
    global.makeHostResponse   = makeHostResponse;
    global.hostResponseError  = hostResponseError;
})($ && $.global ? $.global : {});