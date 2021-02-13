// ========================================================================
// NOTE : I'm fairly certain this entire file is deprecated and not in use.
// ========================================================================

/**
 * CSInterface object.
 */
if (typeof window.csInterface !== 'undefined') {
    window.csInterface.evalScript("$.getenv('HOME')", function(result) {
        HOME = result;
    })
}

/**
 * Global counter.
 * @type {number}
 */
var counter = counter || 0;

/**
 * Get the USER_DATA folder.
 */
var userDataFolder = (function() {
    var _userDataFolder;
    try {
        console.log(
            'csInterface.getSystemPath(SystemPath.USER_DATA)',
            window.csInterface.getSystemPath(SystemPath.USER_DATA)
        );
        console.log(
            window.location.href
        )
        _userDataFolder = window.csInterface.getSystemPath(SystemPath.USER_DATA);
    }
    catch(e) {
        try {
            _userDataFolder = Folder.userData;
        }
        catch(e) {
            alert('logger.info : ' + e);
        }
    }
    return _userDataFolder;
})();

/**
 * Get the extension path.
 */
var extensionPath = (function() {
    var _extensionPath;
    try {
        console.log(
            'csInterface.getSystemPath(SystemPath.EXTENSION)',
            window.csInterface.getSystemPath(SystemPath.EXTENSION)
        );
        _extensionPath = window.csInterface.getSystemPath(SystemPath.EXTENSION);
    }
    catch(e) {
        try {
            var _extensionPath = $.fileName.split('/').slice(0, -3).join('/') + '/';
        }
        catch(e) { /* Exit gracefully */ }
    }
    return _extensionPath;
})();

/**
 * Event constants.
 * @type {{KEY_SAVED: string, OPEN_URL: string}}
 */
var Events = {
    KEY_SAVED : 'key_saved',
    OPEN_URL  : 'open_url',
    SLCT      : 'slct'
};

/**
 * Context constants.
 * @type {{HOST: string, CLIENT: string}}
 */
var Contexts = {
    HOST    : 'HOST',
    CLIENT  : 'CLIENT',
    JS      : 'JS',
    JSX     : 'JSX',
    UNKNOWN : 'UNKNOWN',
    ERR     : 'ERROR'
};

/**
 * Operating system constants.
 * @type {{
 *     UNKNOWN : string,
 *     WIN     : string,
 *     MAC     : string
 * }}
 */
var Platforms = {
    MAC     : 'mac',
    WIN     : 'windows',
    UNKNOWN : 'unknown'
};

/**
 * Mode constants.
 * @type {{
 *   TEST : string,
 *   LIVE : string
 * }}
 */
var Modes = {
    TEST : 'test',
    LIVE : 'live'
};

/**
 * File Extensions constants.
 * @type {{JPG: string, PDF: string, SVG: string, GIF: string, AI: string, PNG: string, EPS: string}}
 */
var FileTypes = {

    SVG : "SVG",
    EPS : "EPS",
    AI  : "AI",
    PDF : "PDF",
    PNG : "PNG",
    JPG : "JPG",
    GIF : "GIF",

    toRegex : function(theType) {
        if (typeof(FileTypes[theType.toUpperCase()]) == 'string') {
            return new RegExp(theType.toLowerCase(), 'ig');
        }
    }
};

var EXTENSION_ID = 'com.atomic.ai-icontools.panel';

/**
 * Global Config object.
 * @type {{
 *     EXTENSION_ID   : string, // The CEP Extension ID from csxs/manifest.xml
 *     EXTENSION_VERS : string, // The extension version
 *     APP_NAME       : string, // The extension name 
 *     EXTENSION_PATH : string, // The fully-qualified path to the Extension code 
 *     USER_DATA      : string, // The folder where user data is stored (os-dependent) 
 *     PRESETS        : string, // The path to the presets/settings folder 
 *     LOG_FOLDER     : string, // Absolute path to location of extension log files 
 *     SETTINGS_FILE  : string, // Absolute path to the extension settings file 
 *     MODE           : string, // Current execution mode of the extension (Dev, Test, Prod) 
 *     DEBUG          : boolean // Whether or not debug is enabled 
 * }}
 */
Config = {
    EXTENSION_ID     : EXTENSION_ID,
    EXTENSION_VERS   : '0.0.0',
    APP_NAME         : EXTENSION_ID,
    EXTENSION_PATH   : extensionPath,
    USER_DATA        : userDataFolder + '/' + EXTENSION_ID,
    PRESETS          : userDataFolder + '/' + EXTENSION_ID + '/presets',
    LOG_FOLDER       : userDataFolder + '/' + EXTENSION_ID + '/logs',
    SETTINGS_FILE    : userDataFolder + '/' + EXTENSION_ID + '/settings.json',

    MODE             : Modes.TEST,
    DEBUG            : true
};
