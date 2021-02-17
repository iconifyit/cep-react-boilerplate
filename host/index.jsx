
var extensionPath = $.fileName.split('/').slice(0, -1).join('/') + '/';  

var JSON = require(__dirname + '/core/JSON.jsx');
var polyfills = require(__dirname + '/core/polyfills.js');
var HostResponse = require(__dirname + '/HostResponse.js');

$.extensionPath = extensionPath;
$.global.JSON = JSON;
$.global.HostResponse = HostResponse;
$.global.Host;

/**
 * Run the script using the Module patter.
 */
var HostController = function(Config) {
    this.extensionPath = Config.extensionPath;
}

/**
 * Allows you to add methods to the Host without modifying the core code.
 *
 *   Example:
 *
 *   Host.fn('helloWorld', function() {
 *       this.logger.info("Hello World!");
 *   });
 */
HostController.prototype.fn = function(name, _function) {
    HostController.prototype[name] = _function;
}

/**
 * To be called from Client to create the Host instance.
 * @returns {string}
 */
function createHostInstance() {
    var HostResponse = $.global.HostResponse;
    var HostController = $.global.HostController;
    var makeHostResponse = $.global.makeHostResponse;
    var hostResponseError = $.global.hostResponseError;
    try {
        console.log('Testing writing to the console from JSX');
    } catch(e){}
    try {
        Host = new HostController({extensionPath : extensionPath}, null);
        $.global.Host = Host;
        console.log('typeof Host', typeof Host)
        if (typeof Host === 'object') {
            var response = makeHostResponse('Host instance was created');
            console.log('[typeof app]', typeof app)
            console.log('[typeof app.activeDocument]', typeof app.activeDocument)
            return JSON.stringify(response);
        }
    }
    catch(e) {
        return JSON.stringify(hostResponseError(
            new Error('createHostInstance error : ' + e.message ))
        )
    }
}

(function(global) {
    global.createHostInstance = createHostInstance;
    global.HostController = HostController;
})(
    typeof module !== 'undefined' && typeof module.exports !== 'undefined' 
    ? module.exports 
    : {}
);

(function(global) {
    global.createHostInstance = createHostInstance;
    global.HostController = HostController;
})($ && $.global ? $.global : {});
