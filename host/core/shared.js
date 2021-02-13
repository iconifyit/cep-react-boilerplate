/**
 * Actions constants.
 * @type {{
 *     IMPORT : string,
 *     EXPORT : string,
 *     OPEN   : string
 * }}
 */
var Actions = {
    OPEN    : 'Open',
    IMPORT  : 'Import',
    EXPORT  : 'Export',
    ADD_SET : 'New Set'
};

/**
 * Page layout sections
 * @type {{APP: string, SEARCH_FIELD: string, ICONSETS_SELECTOR: string, LEFT_SIDEBAR: string, MAIN_CONTENT: string, ICONJARS_SELECTOR: string, SECONDARY_CONTROLS: string}}
 */
var kPAGE_SECTIONS = {
    SEARCH_FIELD       : 'search-field-block',
    LEFT_SIDEBAR       : 'left-sidebar',
    MAIN_CONTENT       : 'main-content',
    SECONDARY_CONTROLS : 'secondary-controls',
    APP                : 'app',
    ICONJARS_SELECTOR  : 'iconjars-selector',
    ICONSETS_SELECTOR  : 'iconsets-selector'
}

/**
 * Flyout menu actions router.
 * @type {{RELOAD: {action: string, text: string}, OPEN_ICONJAR: {action: string, text: string}, SHOW_IN_FINDER: {action: string, text: string}, CLEAR_ICONS: {action: string, text: string}}}
 */
var FlyoutMenuActions = {
    OPEN_ICONJAR   : {action: 'openIconJar', text : 'Open IconJar'},
    SHOW_IN_FINDER : {action: 'showInFinder', text : 'Show in Finder'},
    CLEAR_ICONS    : {action: 'clearIconsList', text : 'Clear Icons'},
    RELOAD         : {action: 'reloadExtension', text : 'Reload Extension'}
};

/**
 * Image types.
 * @type {{RASTER: string, VECTOR: string}}
 */
var ImageTypes = {
    RASTER : 'raster',
    VECTOR : 'vector'
};

/**
 * Actions that can be selected from Context Menu.
 * @type {{RENAME: string, DELETE: string, PLACE: string, ABOUT: string, OPEN: string}}
 */
var IconContextActions = {
    PLACE  : 'placeIcon',
    OPEN   : 'openIcon',
    RENAME : 'renameIcon',
    DELETE : 'deleteIcon',
    EDIT   : 'editIcon',
    ABOUT  : 'about'
};

/**
 * Global URLs object.
 * @type {{
 *     GET_SUPPORT: string,
 *     GET_ICONJAR: string
 * }}
 */
var kURLS = {
    GET_ICONJAR : 'https://a.paddle.com/v2/click/17524/112343?link=2979',
    GET_SUPPORT : 'https://atomiclotus.net/contact',
    ICON_MASON  : 'https://iconmason.com',
    BUY_ICONS   : 'https://a.paddle.com/v2/click/36599/112343?link=2978'
}

/**
 * Key constants.
 * @type {string}
 */
var kCURRENT_SET           = 'kCURRENT_SET',
    kSOURCE_KEY            = 'source',
    kCURRENT_ICONJAR       = 'kCURRENT_ICONJAR',
    kCURRENT_META_FILE     = 'kCURRENT_META_FILE',
    kCURRENT_ITEM          = 'kCURRENT_ITEM',
    kUTF_8                 = 'utf-8',
    kSRC_ATTR              = 'source-file',
    kGUID                  = 'guid',
    kDATA_GUID             = 'data-guid',
    kDATA_NAME             = 'data-name',
    kDATA_TAGS             = 'data-tags',
    kDATA_SRC              = 'data-src',
    kPLACEHOLDER_IMG       = '/client/theme/img/placeholder.png',
    kPLACEHOLDER_CLASS     = 'placeholder',
    kLAZY_CLASS            = 'lazy',
    kENTER_KEYCODE         = 13,
    kDEFAULT_WIDTH         = 32,
    kDEFAULT_HEIGHT        = 32,
    kSETS_SELECTOR_SIZE    = 1,
    kDATE_FORMAT           = "u"

/**
 * Array of Database Keys.
 * @type {string[]}
 */
var DatabaseKeys = [
    kCURRENT_SET,
    kCURRENT_ICONJAR,
    kCURRENT_META_FILE
];

/**
 * Icon property names.
 * @type {{
 *     DATE       : string,
 *     PARENT     : string,
 *     WIDTH      : string,
 *     IDENTIFIER : string,
 *     FILE       : string,
 *     HEIGHT     : string,
 *     LICENSE    : string,
 *     TYPE       : string,
 *     UNICODE    : string,
 *     TAGS       : string,
 *     NAME       : string
 * }}
 */
var IconProperties = {
    NAME       : 'name',
    LICENSE    : 'licence',
    TAGS       : 'tags',
    FILE       : 'file',
    DATE       : 'date',
    WIDTH      : 'width',
    HEIGHT     : 'height',
    PARENT     : 'parent',
    TYPE       : 'type',
    UNICODE    : 'unicode',
    IDENTIFIER : 'identifier'
};

/**
 * Context constants.
 * @type {{
 *     HOST   : string,
 *     CLIENT : string
 * }}
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
 * Get the current OS platform.
 */
function getOS() {
    var _os = '';

    if (typeof window !== 'undefined') {
        _os = window.csInterface.getOSInformation();
    }
    else if (typeof $ !== 'undefined' && $.os) {
        _os = $.os;
    }
    else if (typeof os !== 'undefined') {
        _os = os.platform();
    }

    return _os.toLowerCase().indexOf('mac') >= 0 ? Platforms.MAC : Platforms.WIN;
}
var OS = getOS();

/**
 * File Extensions constants.
 * @type {{
 *     JPG : string,
 *     PDF : string,
 *     SVG : string,
 *     GIF : string,
 *     AI  : string,
 *     PNG : string,
 *     EPS : string
 * }}
 */
var FileTypes = {

    SVG : "SVG"
  , EPS : "EPS"
  , AI  : "AI"
  , PDF : "PDF"
  , PNG : "PNG"
  , JPG : "JPG"
  , GIF : "GIF"
  ,

    toRegex : function(theType) {
        if (typeof(FileTypes[theType.toUpperCase()]) == 'string') {
            return new RegExp(theType.toLowerCase(), 'ig');
        }
    }
};

/**
 * Event constants.
 * @type {{
 *     KEY_SAVED : string,
 *     OPEN_URL  : string
 * }}
 */
var Events = {
    OPEN_URL     : 'openWebPage',
    META_UPDATED : 'metaUpdated'
};

/**
 * Get the USER_DATA folder.
 */
var userDataFolder = (function() {
    var _userDataFolder;
    if (typeof window !== 'undefined') {
        try {
            _userDataFolder = window.csInterface.getSystemPath(window.SystemPath.USER_DATA);
        }
        catch(e) {
            console.error('[shared.js] UserDataFolder error : ' + e);
        }
    }
    else {
        if (typeof Folder !== 'undefined') {
            _userDataFolder = Folder.userData.absoluteURI;
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
        _extensionPath = csInterface.getSystemPath(window.SystemPath.EXTENSION);
    }
    catch(e) {
        try {
            _extensionPath = $.fileName.split('/').slice(0, -3).join('/') + '/';
        }
        catch(e) {
            e.name = 'ExtensionPathError';
            /* Exit gracefully */
        }
    }
    return _extensionPath;
})();

/**
 * Event data for $().trigger()
 * @param type
 * @param data
 * @returns {{data: *, type: *}}
 * @constructor
 */
var EventData = function(eventType, data) {
    return {
        type : eventType,
        data : data
    };
};

/**
 * Custom error for user cancellation.
 * @param message
 * @constructor
 */
var UserCancelledError = function(message) {
    this.name = 'UserCancelledError';
    this.message = message || 'User cancelled';
};
UserCancelledError.prototype = Error.prototype;

/**
 * Custom error for un-implemented features
 * @param message
 * @constructor
 */
var NotYetImplementedError = function(message) {
    this.name    = 'NotYetImplementedError';
    this.message = message || 'Not yet implemented';
    this.stack   = $.stack;
}
NotYetImplementedError.prototype = Error.prototype;

var kNOOP = function(){}
var noop  = function(){}

/**
 * @deprecated Use Helpers.js getFormattedDate(date, withTime) instead.
 * Date formatted as 2020:01:01 11:00:00
 * @returns {string}
 */
function deprecated__getFormattedDate() {
    var date = new Date();
    var theDate = [
            date.getFullYear(),
            String((date.getUTCMonth() + 1000)).slice(-2),
            String(date.getUTCDate() + 1000).slice(-2)
        ].join('-') + ' ' +
        [
            String(date.getHours() + 100).slice(-2),
            String(date.getMinutes() + 100).slice(-2),
            String(date.getSeconds() + 100).slice(-2)
        ].join(':')
    return theDate;
}

/**
 * Properly formats a path for the current file system.
 * @param {string} path
 */
function abspath(path) {
    if (! (path instanceof String)) return path;
    if (getOS() === Platforms.MAC) {
        return decodeURI(path.replace('~/', kUSER_HOME + '/'))
    }
    if (getOS() === Platforms.WIN) {
        path = decodeURI(path);
        if (path.slice(0,3) === '\\c\\') {
            path = 'C:\\' + path.slice(3);
        }
        else if (path.slice(0,3) === '/c/') {
            path = 'C:/' + path.slice(3);
        }
        return path;
    }
    return path;
}

/**
 * Add variables to global scope.
 */
;(function(global) {

    // Object constants

    global.Actions                = Actions;
    global.ImageTypes             = ImageTypes;
    global.IconContextActions     = IconContextActions;
    global.DatabaseKeys           = DatabaseKeys;
    global.IconProperties         = IconProperties;
    global.Contexts               = Contexts;
    global.Platforms              = Platforms;
    global.FileTypes              = FileTypes;
    global.Events                 = Events;
    global.UserCancelledError     = UserCancelledError;
    global.NotYetImplementedError = NotYetImplementedError;

    // String constants

    global.kCURRENT_ITEM          = kCURRENT_ITEM;
    global.kSOURCE_KEY            = kSOURCE_KEY;
    global.kCURRENT_SET           = kCURRENT_SET;
    global.kCURRENT_ICONJAR       = kCURRENT_ICONJAR;
    global.kCURRENT_META_FILE     = kCURRENT_META_FILE;
    global.kUTF_8                 = kUTF_8;
    global.kSRC_ATTR              = kSRC_ATTR;
    global.kGUID                  = kGUID;
    global.kDATA_GUID             = kDATA_GUID;
    global.kDATA_NAME             = kDATA_NAME;
    global.kDATA_TAGS             = kDATA_TAGS;
    global.kDATA_SRC              = kDATA_SRC;
    global.kPLACEHOLDER_IMG       = kPLACEHOLDER_IMG;
    global.kPLACEHOLDER_CLASS     = kPLACEHOLDER_CLASS;
    global.kLAZY_CLASS            = kLAZY_CLASS;
    global.kENTER_KEYCODE         = kENTER_KEYCODE;
    global.kDEFAULT_WIDTH         = kDEFAULT_WIDTH;
    global.kDEFAULT_HEIGHT        = kDEFAULT_HEIGHT;
    global.kSETS_SELECTOR_SIZE    = kSETS_SELECTOR_SIZE;
    global.kDATE_FORMAT           = kDATE_FORMAT;

    global.kPAGE_SECTIONS         = kPAGE_SECTIONS;

    // Derived paths

    global.extensionPath          = extensionPath;
    global.userDataFolder         = userDataFolder;
    global.OS                     = OS;
    global.isMac                  = OS === Platforms.MAC;
    global.isWindows              = OS === Platforms.WIN;
    global.getOS                  = getOS;

    global.abspath                = abspath;

    global.kURLS                  = kURLS;

    global.kNOOP                  = kNOOP;
    global.kEXT_PATH              = extensionPath;

    if (typeof window !== 'undefined') {
        window.global = global;
    }

})(function() {
    if (typeof global !== 'undefined') return global;
    if (typeof window !== 'undefined') return window;
    return this;
}());
