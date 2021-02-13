
var extensionPath = $.fileName.split('/').slice(0, -1).join('/') + '/';  
// $.evalFile(extensionPath + 'core/Utils.jsx');
// $.evalFile(extensionPath + 'core/Console.jsx');
// $.evalFile(extensionPath + 'core/Logger.jsx');
$.evalFile(extensionPath + 'HostResponse.js');

/**
 * Loads PlugPlugExternalObject if it is not already loaded.
 */
// var plugPlugExternalObject;
// if (! plugPlugExternalObject) {
//     try {
//         plugPlugExternalObject = new ExternalObject ("lib:" + "PlugPlugExternalObject");
//     }
//     catch (e) {
//         console.error('[PlugPlugExternalObject]', e.message);
//     }
// }


// /**
//  * The local scope logger object.
//  * @type {Logger}
//  */
// try {
//     logger = new Logger(Folder.userData.absoluteURI + '/logs', 'CEP-Barebones');
// }
// catch(e) { alert('new Logger() error', e) }

// debug = logger.info;

// // logger.info('[Host.jsx]', 'Testing', '...');
// logger.info('[SETTINGS]', JSON.stringify(passedSettings));

/**
 * Run the script using the Module patter.
 */
var HostController = function(Config) {
    // this.logger = logger;
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
    // this.logger.info('[Host.jsx] Added method ' + name + ' to Host prototype');
    HostController.prototype[name] = _function;
}

/**
 * To be called from Client to create the Host instance.
 * @returns {string}
 */
function createHostInstance() {

    // logger.info('[Host.jsx][createHostInstance]', 'call');

    try {
        Host = new HostController({extensionPath : extensionPath}, null);
        if (typeof Host === 'object') {
            var response = new HostResponse('[Host.jsx] Host instance was created').stringify();
            console.log('[JSX]', 'Testing writing to the console from JSX');
            return response;
        }
    }
    catch(e) {
        // console.error('[Host.jsx]', 'createHostInstance error : ' + e);
        return new HostResponse(new Error('[Host.jsx] createHostInstance error : ' + e.message )).stringify();
    }
}

// logger.info('[Host.jsx]', 'createHostInstance defined');