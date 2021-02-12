!(function(global) {

    if (! global.ClientHelpers) {
        throw new Error('client-helpers.js is required to initialize Globals.js');
    }

    global.Globals = true;

    var fs      = require('fs')
        , $path = require('path');

    global.kEXTENSION = {};

    try {
        global.kEXTENSION = window.csInterface.getExtensions().filter((extension) => {
            return extension.id === window.csInterface.getExtensionID();
        }).pop();
    }
    catch(e) { console.error('[Globals.js]', e) }

    /**
     * @type {string}
     */
    global.kSTORED_START_FOLDER_KEY = window.csInterface.getExtensionID() + '--startFolder';

    /**
     * @type {string}
     */
    global.kMY_DOCUMENTS = syspath(window.SystemPath.MY_DOCUMENTS);

    /**
     * @type {string}
     */
    global.kUSER_DATA = syspath(window.SystemPath.USER_DATA);

    /**
     * @deprecated  Use kUSER_DATA instead.
     * @type {string}
     */
    global.USER_DATA = global.kUSER_DATA;

    /**
     * @type {string}
     */
    global.kEXT_PATH = syspath(window.SystemPath.EXTENSION);

    /**
     * @deprecated
     * @type {string}
     */
    global.EXT_PATH = global.kEXT_PATH;

    /**
     * Client lib path
     * @type {string}
     */
    global.kCLIENT_LIB_PATH       = kEXT_PATH + '/client/lib'

    /**
     * Client Theme path
     * @type {string}
     */
    global.kCLIENT_THEME_PATH     = kEXT_PATH + '/client/theme'

    /**
     * Client theme JS path
     * @type {string}
     */
    global.kCLIENT_THEME_JS_PATH  = kEXT_PATH + '/client/theme/js'

    /**
     * Client theme CSS path
     * @type {string}
     */
    global.kCLIENT_THEME_CSS_PATH = kEXT_PATH + '/client/theme/css'

    /**
     * @type {string}
     */
    global.kPLUGINS_PATH = global.kEXT_PATH + '/custom';

    /**
     * @type {string}
     */
    global.kUSER_DOCS = syspath(window.SystemPath.MY_DOCUMENTS);

    /**
     * @deprecated Use kUSER_DOCS instead.
     * @type {string}
     */
    global.USER_DOCS = global.kUSER_DOCS;

    /**
     * @type {string}
     */
    global.kUSER_HOME = $path.dirname(global.kUSER_DOCS);

    /**
     * @deprecated Use kUSER_HOME instead.
     * @type {string}
     */
    global.USER_HOME = global.kUSER_HOME;

    /**
     * @type {string}
     */
    global.kATOMIC_DATA = $path.join(global.kUSER_DATA, 'com.atomic');

    /**
     * @deprecated Use kATOMIC_DATA instead.
     * @type {string}
     */
    global.ATOMIC_DATA = global.kATOMIC_DATA;

    /**
     * @type {string}
     */
    global.kEXT_DATA = $path.join(global.kATOMIC_DATA, window.csInterface.getExtensionID());

    /**
     * @deprecated Use kEXT_DATA instead.
     * @type {string}
     */
    global.EXT_DATA = global.kEXT_DATA;

    /**
     * @type {string}
     */
    global.kDATA_DIR_NAME = 'data';

    /**
     * @type {string}
     */
    global.kDATA_FOLDER = $path.join(kEXT_DATA, kDATA_DIR_NAME);

    /**
     * @type {string}
     */
    global.kFREEBIES_PATH = syspath(window.SystemPath.EXTENSION) + '/freebies';

    /**
     * Database engine name.
     * @type {string}
     */
    global.kDB_ENGINE = 'data';

    /**
     * The root data storage folder.
     * @type {string}
     */
    global.kDATA_STORE = $path.join(global.kEXT_DATA, global.kDB_ENGINE);

    /**
     * @type {string}
     */
    global.kEXT_SETTINGS = $path.join(global.kATOMIC_DATA, 'settings.json');

    /**
     * @deprecated Use kEXT_SETTINGS instead.
     * @type {string}
     */
    global.EXT_SETTINGS = global.kEXT_SETTINGS;

    /**
     * @type {string}
     */
    global.kSTART_FOLDER = global.kUSER_DOCS;

    /**
     * @deprecated User kSTART_FOLDER instead.
     * @type {string}
     */
    global.startFolder = global.kSTART_FOLDER;

    /**
     * @type {string}
     */
    global.kLOG_FOLDER = $path.join(global.kEXT_DATA, 'logs');

    /**
     * @deprecated User kLOG_FOLDER instead.
     * @type {string}
     */
    global.logFolder = global.kLOG_FOLDER;

    /*
     * Create extension's required directories.
     */

    // fs__mkdir(fs, global.kATOMIC_DATA);
    // fs__mkdir(fs, global.kEXT_DATA);
    // fs__mkdir(fs, global.kLOG_FOLDER);
    // fs__mkdir(fs, $path.join(global.kEXT_DATA, global.kDATA_DIR_NAME));

    fs$mkdir(fs, global.kATOMIC_DATA);
    fs$mkdir(fs, global.kEXT_DATA);
    fs$mkdir(fs, global.kLOG_FOLDER);
    fs$mkdir(fs, $path.join(global.kEXT_DATA, global.kDATA_DIR_NAME));

    /*
     * Get custom settings.
     */
    global.custom_settings = fs$readjson(fs, global.kEXT_SETTINGS);

    global.ICONFINDER_API_KEY = "70uoahMKKqZyJdv5xevJqETI2BarQRqK2kEQeXJF432PlP0X0teUIXqcyIbpAZam";
    global.ICONFINDER_CLIENT_ID = "gEn3aHrkV2kICGuAQQstMd1cuvMTQ1vw48fCaLn9BsprlHVjRWIC2HSwfaqFYl8m";


    // console.log('[Globals.js] global.custom_settings', global.custom_settings);

    global.installFreeIcons = false;

    if (typeof global.custom_settings !== 'undefined') {

        /*
         * Get start folder from user config.
         */
        if (typeof global.custom_settings.installFreeIcons !== 'undefined') {
            global.kINSTALL_FREE_ICONS = global.custom_settings.installFreeIcons;
        }

        /*
         * Get start folder from user config.
         */
        if (typeof global.custom_settings.startFolder !== 'undefined') {
            global.kSTART_FOLDER = global.custom_settings.startFolder;

            // deprecated
            global.startFolder = global.kSTART_FOLDER;
        }

        /*
         * Get log folder from user config.
         */
        if (typeof global.custom_settings.logFolder !== 'undefined') {
            global.kLOG_FOLDER = global.custom_settings.logFolder;

            // deprecated
            global.logFolder = global.kLOG_FOLDER;
        }

        /*
         * Get the stored start folder.
         */
        var storedStartFolder = fs$storedStartFolder(fs, global.kSTORED_START_FOLDER_KEY);

        if (typeof storedStartFolder !== 'undefined'
                && storedStartFolder !== null
                && storedStartFolder !== 'null' ) {

            global.kSTART_FOLDER = storedStartFolder;

            // deprecated
            global.startFolder = global.kSTART_FOLDER;
        }

        /*
         * Get search config from user config.
         */
        global.searchConfig = null;

        if (typeof global.custom_settings.searchConfig !== 'undefined') {
            global.searchConfig = global.custom_settings.searchConfig;
        }

        /*
         * Get tags config from user config.
         */
        global.tagsConfig = null;

        if (typeof global.custom_settings.tagsConfig !== 'undefined') {
            global.tagsConfig = global.custom_settings.tagsConfig;
        }
    }

    const _kSETTINGS = {};

    Object.keys(global).forEach(function(key) {
         if (key.charAt(0) === 'k') {
             _kSETTINGS[key] = global[key];
            console.log('[Globals.js] ' + key, _kSETTINGS[key]);
         }
    });

    global.kSETTINGS = _kSETTINGS;

    console.log(JSON.stringify(_kSETTINGS))

})(window, typeof window.csInterface !== 'undefined' ? csInterface : new window.CSInterface());
