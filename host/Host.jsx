/**
 * @author Scott Lewis <scott@atomiclotus.net>
 * @copyright 2018 Scott Lewis
 * @version 1.0.0
 * @url http://github.com/iconifyit
 * @url https://atomiclotus.net
 *
 * ABOUT:
 *
 *    This script is a very basic boilerplate for Adobe CEP extensions.
 *
 * NO WARRANTIES:
 *
 *   You are free to use, modify, and distribute this script as you see fit.
 *   No credit is required but would be greatly appreciated.
 *
 *   THIS SCRIPT IS OFFERED AS-IS WITHOUT ANY WARRANTY OR GUARANTEES OF ANY KIND.
 *   YOU USE THIS SCRIPT COMPLETELY AT YOUR OWN RISK AND UNDER NO CIRCUMSTANCES WILL
 *   THE DEVELOPER AND/OR DISTRIBUTOR OF THIS SCRIPT BE HELD LIABLE FOR DAMAGES OF
 *   ANY KIND INCLUDING LOSS OF DATA OR DAMAGE TO HARDWARE OR SOFTWARE. IF YOU DO
 *   NOT AGREE TO THESE TERMS, DO NOT USE THIS SCRIPT.
 */

// $.sleep(1);

var Host = null
    , extensionsPath = $.global.extensionPath
    , kEXT_ID = (function() {
        try {
            return $.global.extensionId;
        }
        catch(e) {
            alert('[0] ' + e.message);
        }
    })()
    , module         = { exports : null }
    , kUSER_NAME     = null
    , pathsep        = null
    , Config         = null
    , debug          = function(){}
    , logger         = undefined
;

/**
 * Determine the current user name.
 */

try {
    pathsep = '/'; // $.os.indexOf('mac') === -1 ? '\\' : '/';
    kUSER_NAME = Folder.myDocuments.fsName.split(pathsep)[2];
}
catch(e) {
    alert(e);
}

// console.log('Host Console loaded');
// console.error('Host console error test');
// console.info('Host console info test');
// console.warn('Host console warn test');

this.console = console;
$.console = console;


var USER_HOME       = $.getenv('HOME')
    , USER_DATA     = Folder.userData // $.global.extensionPath
    , ATOMIC_DATA   = USER_DATA + '/com.atomic' // $.global.atomicData
    , EXT_DATA      = ATOMIC_DATA + '/settings.json'
    , kEXT_PATH     = $.global.extensionPath
    , kSTART_FOLDER = Folder.myDocuments.absoluteURI

var kLOG_FOLDER_PATH = abspath( Folder.myDocuments + '/' + $.global.extensionId );

var passedSettings = [
    'USER_HOME : '          + USER_HOME,
    'USER_DATA : '          + USER_DATA,
    'ATOMIC_DATA : '        + ATOMIC_DATA,
    'kEXT_PATH : '          + kEXT_PATH,
    'EXT_DATA : '           + EXT_DATA,
    'kLOG_FOLDER_PATH : '   + kLOG_FOLDER_PATH,
    '$.fileName : '         + $.fileName,
    'extension : '          + $.global.extension
].join(', ');

try {
    function read_json_file(filepath) {
        var contents, result;
        try {
            if (typeof filepath === 'string') {
                filepath = filepath.replace(/(\s+)/g, '\\$1');
            }

            function read_file(filepath) {

                var content = "";

                var theFile = new File(filepath);

                if (theFile) {

                    try {
                        if (theFile.alias) {
                            while (theFile.alias) {
                                theFile = theFile.resolve().openDlg(
                                    "Choose file",
                                    "",
                                    false
                                );
                            }
                        }
                    }
                    catch(ex) {
                        alert(ex.message);
                    }

                    try {
                        theFile.open('r', undefined, undefined);
                        if (theFile !== '') {
                            content = theFile.read();
                            theFile.close();
                            return content;
                        }
                    }
                    catch(e) {
                        theFile.close();
                        throw e;
                    }
                }
                return content;
            }

            if (contents = read_file(filepath)) {
                result = JSON.parse(contents);
                if (typeof(result) !== 'object') {
                    result = null;
                }
            }
        }
        catch(e) {
            throw e;
        }
        return result;
    }

    $.global.settings = read_json_file(EXT_DATA);
}
catch(e) { alert('[1] ' + e.message) }


/**
 * @type {{
 *     APP_NAME  : string,
 *     USER      : string,
 *     HOME      : string,
 *     DOCUMENTS : string,
 *     LOGFOLDER : string
 * }}
 */
try {
    Config = new Configuration({
        APP_NAME      : $.global.extensionId,
        USER          : kUSER_NAME,
        HOME          : isMac ? '~/' : 'C:/Users/' + kUSER_NAME,
        DOCUMENTS     : abspath(Folder.myDocuments),
        LOGFOLDER     : kLOG_FOLDER_PATH,
        OS            : $.global.OS,
        IS_WIN        : $.global.isWindows,
        IS_MAC        : $.global.isMac,
        EXT_PATH      : kEXT_PATH,
        USER_DATA     : USER_DATA,
        ATOMIC_DATA   : ATOMIC_DATA,
        SETTINGS_FILE : EXT_DATA
    });
}
catch(e) { alert('[2] ' + e.message) }

/**
 * The local scope logger object.
 * @type {Logger}
 */
try {
    logger = new Logger(Config.get('APP_NAME'), Config.get('LOGFOLDER'));
}
catch(e) { alert('new Logger() error', e) }

debug = logger.info;

// logger.info('[Host.jsx]', 'Testing', '...');
logger.info('[SETTINGS]', JSON.stringify(passedSettings));

/**
 * Run the script using the Module patter.
 */
var HostController = function(Config, logger) {
    this.logger        = logger;
    this.extensionPath = '';
}

logger.info('[Host.jsx]', 'HostController class defined');

HostController.prototype.setExtensionPath = function(extensionPath) {
    this.extensionPath = extensionPath;
}

// logger.info('[Host.jsx]', 'HostController setExtensionPath defined');

HostController.prototype.getExtensionPath = function() {
    return this.extensionPath;
}

// logger.info('[Host.jsx]', 'HostController getExtensionPath defined');

HostController.prototype.loadPlugins = function(path) {

    var config,
        plugins;

    // logger.info('[Host.jsx]', 'Start Host.loadPlugins');
    // logger.info('[Host.jsx]', [path, 'plugins.json'].join('/'));

    // logger.info('[Host.jsx]', '[setExtensionPath] ' + stringify(path));
    // logger.info('[Host.jsx]', 'typeof HostResponse : ' + typeof HostResponse);
    // logger.info('[Host.jsx]', path.split('/').slice(0, -1).join('/') );

    this.setExtensionPath(path.split('/').slice(0, -1).join('/'));

    try {

        // logger.info('[Host.jsx] file exists', new File([path, 'plugins.json'].join('/')).exists )

        config = Utils.read_file([path, 'plugins.json'].join('/'));

        // logger.info('[Host.jsx] content', config)

        if (typeof config === 'string') {
            config = JSON.parse(config);
        }

        if (typeof config === 'object' && typeof config.plugins !== 'undefined') {

            plugins = config.plugins;

            // logger.info('[Host.jsx]', 'Host.loadPlugins : ' + stringify(plugins));
            // logger.info('[Host.jsx]', 'Loading ' + plugins.length + ' plugins');

            plugins.forEach(function(plugin, i) {
                if (typeof plugin !== 'object') {
                    // logger.info('[Host.jsx]', 'Plugin is not an object');
                    return;
                }
                // logger.info('[Host.jsx]', 'Checking plugin (' + (i + 1) + ' of ' + plugins.length + ') : ' + plugin.name );

                var isDisabled = isTrue(plugin.disabled);

                // logger.info('[Host.jsx]', 'Is ' + plugin.name + ' disabled? ' + (isDisabled ? 'Yes, skipping' : 'No, continuing'));

                if (isDisabled) return;

                var join_path = function(segments) {
                    return segments.join('/');
                }

                for (var x = 0; x < plugin.host.length; x++) {
                    try {
                        var fileName = plugin.host[x]
                            , pluginPath = join_path([path, plugin.name, fileName])
                            , pluginFile = null;

                        // logger.info('[Host.jsx]', 'Host.loadPlugins pluginPath ' + pluginPath);

                        var className = fileName.split('/').pop().replace(/\.jsx|\.js/, '');

                        var fileExists = false;
                        if (new File(pluginPath).exists) {
                            fileExists = true;
                            if (pluginFile = new File(pluginPath)) {
                                $.evalFile(pluginFile.fsName);
                            }
                            // logger.info('[Host.jsx]', 'Host.loadPlugins pluginFile.exists ' + fileExists);
                            // logger.info('[Host.jsx][' + className + '][className]', typeof this[className]);
                        }
                    }
                    catch(e) {
                        logger.error(String('[Host.jsx][' + fileName + '] ' + e.message));
                    }
                }
            });
        }

        return makeHostResponse('[Host.jsx] Host plugins loaded');
    }
    catch(e) {
        logger.error('[Host.jsx][loadPlugins] ' + e);
        return hostResponseError('[Host.jsx][Host.loadPlugins] ' + e);
    }
}

// logger.info('[Host.jsx]', 'HostController loadPlugins defined');

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

// logger.info('[Host.jsx]', 'HostController fn defined');

/**
 * To be called from Client to create the Host instance.
 * @returns {string}
 */
function createHostInstance() {

    // logger.info('[Host.jsx][createHostInstance]', 'call');

    try {
        Host = new HostController(Config, logger);
        if (typeof Host === 'object') {
            var response = new HostResponse('[Host.jsx] Host instance was created').stringify();
            // logger.info('[Host.jsx]', response);
            return response;
        }
    }
    catch(e) {
        logger.error('[Host.jsx]', 'createHostInstance error : ' + e);
        return new HostResponse(new Error('[Host.jsx] createHostInstance error : ' + e.message )).stringify();
    }
}

logger.info('[Host.jsx]', 'createHostInstance defined');

/**
 * Use this to interface from client side.
 * Example: csxScript('log("some text", "info")')
 * @param message        
 * @param type
 */      
function csxLogger(message, type) {
    try {
        logger.info( '[Host.jsx] ' + message );
        return 'ok';
    }
    catch(e) {
        return e;
    }                        
}
