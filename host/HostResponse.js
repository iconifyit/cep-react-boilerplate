var HostResponse = function(value, error) {

    this.value = value;
    this.error = error;

    if (value instanceof Error) {
        error = value;
        this.error = error.name + ' : ' + error.message;
        this.value = error.name + ' : ' + error.message;
    }
}

/**
 * Gets value of a response object.
 * @returns {string | null}
 */
HostResponse.prototype.getValue = function() {
    return this.value;
}

/**
 * Gets an error if exists.
 * @returns {string}
 */
HostResponse.prototype.getError = function() {
    return this.error;
}

/**
 * Tests if the response is an error.
 * @returns {boolean}
 */
HostResponse.prototype.isError = function() {
    return ! isEmpty(this.error);
}

/**
 * Gets the value of the host response.
 * @returns {{error: string, value: string}}
 */
HostResponse.prototype.valueOf = function() {
    return {
        "value": this.getValue(),
        "error": this.getError()
    }
}

/**
 * Converts host response to JSON string.
 * @returns {string}
 */
HostResponse.prototype.stringify = function() {
    return JSON.stringify(this.valueOf())
}

/**
 * Parse a host response.
 * @param stringValue
 * @returns {HostResponse}
 */
HostResponse.prototype.parse = function(stringValue) {

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

/**
 * Validate the response object.
 * @param jsonString
 * @returns {boolean}
 */
HostResponse.prototype.validate = function(jsonString) {
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

/**
 * Create response object.
 * @param {string}  result      The result returned by CSInterface().evalScript()
 * @param {*}       _default    Default value to return if original result is empty & only if it is empty.
 * @returns {HostResponse}
 * @constructor
 */
var Result = function(result, _default) {
    try {
        if (isEmpty(result)) {
            return new HostResponse(true);
        }
        return new HostResponse().parse(result);
    }
    catch(e) {
        new HostResponse(new Error(e.message));
    }
}

/**
 * Create a standardized callback for use with the HostResponse object.
 * @param   {Function}  callback    The original callback being wrappped in the Callback class.
 * @returns {function(...[*]=)}
 * @constructor
 */
var Callback = function(callback) {
    return function (_result) {

        /*
         * Wrap the Host.method result in a HostResponse object for a consistent interface.
         */
        _result = new Result(_result);

        /*
         * If there is an error, bug out.
         */
        if (_result.isError()) {
            throw new Error(_result.getError());
        }

        /*
         * Execute the original callback if it's a function.
         */
        if (callback instanceof Function) {
            callback(_result);
        }
    }
}

var UserCancelledError = function(message) {
    this.name = 'UserCancelledError';
    this.message = message || 'User cancelled';
};
UserCancelledError.prototype = Error.prototype;

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

module.exports.HostResponse       = HostResponse;
module.exports.makeHostResponse   = makeHostResponse;
module.exports.hostResponseError  = hostResponseError;
module.exports.Result             = Result;
module.exports.Callback           = Callback;
module.exports.UserCancelledError = UserCancelledError;
module.exports.makeHostResponse   = makeHostResponse;
module.exports.hostResponseError  = hostResponseError;

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