
var extensionPath = $.fileName.split('/').slice(0, -1).join('/') + '/';  
$.evalFile(extensionPath + 'HostResponse.js');

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
    try {
        Host = new HostController({extensionPath : extensionPath}, null);
        if (typeof Host === 'object') {
            var response = new HostResponse('[Host.jsx] Host instance was created').stringify();
            console.log('[JSX]', 'Testing writing to the console from JSX');
            return response;
        }
    }
    catch(e) {
        return new HostResponse(new Error('[Host.jsx] createHostInstance error : ' + e.message )).stringify();
    }
}