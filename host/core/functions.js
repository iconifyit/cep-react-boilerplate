/**
 * Dialog field types.
 * @type {{
 *     CHECKBOX : string,
 *     BUTTON   : string,
 *     LABEL    : string,
 *     RADIO    : string,
 *     TEXT     : string,
 *     LIST     : string
 * }}
 */
(function(global) {
    var FieldTypes = {
        TEXT     : 'edittext',
        LABEL    : 'statictext',
        LIST     : 'listbox',
        CHECKBOX : 'checkbox',
        BUTTON   : 'button',
        RADIO    : 'radiobutton',
        PANEL    : 'panel',
        GROUP    : 'group'
    };

    global.FieldTypes = FieldTypes;
})(this);

var kEVENT_OPEN_URL = 'com.atomic.openWebPage';
(function(global, kEVENT_OPEN_URL) {

    global.kEVENT_OPEN_URL = kEVENT_OPEN_URL;
})(this, kEVENT_OPEN_URL);

/**
 * Get a unique universal identifier.
 * RFC4122 version 4 compliant.
 * @returns {string}
 */
(function(global) {
    function generateUUID() {
        var d = new Date().getTime();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16).toUpperCase();
        });
    }
    global.generateUUID = generateUUID;
})(this);

/**
 * File Extensions constants.
 * @type {{JPG: string, PDF: string, SVG: string, GIF: string, AI: string, PNG: string, EPS: string}}
 */
(function(global) {
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

    global.FileTypes = FileTypes;
})(this);

/**
 * Image types.
 * @type {{RASTER: string, VECTOR: string}}
 */
(function(global) {
    var ImageTypes = {
        RASTER : 'raster',
        VECTOR : 'vector'
    }

    global.ImageTypes = ImageTypes;
})(this);

/**
 * Dialog types.
 * @type {{
 *    DIALOG  : string,
 *    PALETTE : string,
 *    CUSTOM  : string,
 *    MODAL   : string
 * }}
 */
(function(global) {
    var WindowTypes = {
        DIALOG  : "dialog",
        PALETTE : "palette",
        MODAL   : "modal",
        CUSTOM  : "custom"
    }

    global.WindowTypes = WindowTypes;
})(this);

/**
 * Console object wrapper for the logger.
 * @type {Console | console}
 */
var console = console || (function() {
    try {
        var Console  = function(){}
        var callback = function(logger) {
            return function() {
                var args = [].slice.call(arguments);
                logger.info(args.join(' '));
            }
        }(logger);

        Console.prototype.log   = callback;
        Console.prototype.info  = callback;
        Console.prototype.error = callback;

        return new Console();
    }
    catch(e) {
        var Console  = function(){}
        var callback = function(){}
        Console.prototype.log   = callback;
        Console.prototype.info  = callback;
        Console.prototype.error = callback;
        return new Console();
    }
})();

/**
 * setTimeout polyfile for JSX.
 */
var setTimeout = function(callback, duration) {
    $.sleep(duration);
    if (typeof callback === 'string') {
        eval(callback);
    }
    else {
        callback();
    }
}

/**
 * Extends one object with members from another.
 * @param   {object}    Parent
 * @param   {object}    Child
 * @returns {*}
 */
function extend(Parent, Child) {
    try {
        var __prototype__ = merge(Child.prototype || {},  Parent.prototype, true);

        Object.setPrototypeOf ?
            Object.setPrototypeOf(Child, __prototype__) :
            Child.__proto__ = __prototype__;
    }
    catch(e) { alert( e) }
}

/**
 * Merges `target` with values from `source`.
 * @param   {object}    target      The target object (this will be updated and returned)
 * @param   {object}    source      The new values to add to target.
 * @param   {boolean}   overwrite   If false, value of target.key will be preserved.
 * @returns {target}
 */
function merge(target, source, overwrite) {
    overwrite = overwrite === undefined ? true : false;
    for (var key in source) {
        if (target.hasOwnProperty(key) && ! overwrite) continue;
        target[key] = source[key];
    }
    return target;
}

/**
 * Merges `target` with values from `source`.
 * @param   {object}    source      The object to be cloned.
 * @returns {object}
 */
if (typeof clone === 'undefined') {
    (function(global) {
        function clone(source) {
            var obj = {};
            for (var key in source) {
                obj[key] = source[key];
            }
            return obj;
        }
        global.clone = clone;
    })(this);
}

/**
 * Inherit from a superclass
 * @param subClass
 * @param superClass
 * @private
 */
function _inherits(SuperClass, SubClass) {
    if (typeof SuperClass !== "function" && SuperClass !== null) {
        throw new Error("Super expression must either be null or a function, not " + typeof SuperClass);
    }
    SubClass.prototype = Object.create(SuperClass && SuperClass.prototype, {
        constructor: {
            value        : SubClass,
            enumerable   : false,
            writable     : true,
            configurable : true
        }
    });
    if (SuperClass) {
        Object.setPrototypeOf ?
            Object.setPrototypeOf(SubClass, SuperClass) :
            SubClass.__proto__ = SuperClass;
    }
}

/**
 * Noop function.
 */
var noop = function noop() {};

/**
 * Dynamically add a script tag to a page.
 * @param src
 */
function addScript(src, fn) {
    var s = document.createElement('script');
    s.setAttribute('src', src);
    if (src.indexOf('.jsx') !== -1) {
        // s.type = 'text/jsx';
    }
    s.onload = function(e) {
        if (src.indexOf('.jsx') !== -1) {
            console.info(src + ' added');
        }

        if (typeof fn === 'function') {
            fn.call(null, {event: e, script: s});
        }
    };
    document.body.appendChild(s);
}

/**
 * Dynamically add a script tag to a page.
 * @param src
 */
function addStylesheet(src, fn) {
    var s = document.createElement('link');
    s.setAttribute('rel', 'stylesheet');
    s.setAttribute('href', src);
    s.onload = function(e) {
        // console.log('s.onload', e);
        // console.info('Stylesheet ' + src + ' added');
        if (typeof fn === 'function') {
            fn.call(null, {event: e, script: s});
        }
    };
    document.body.appendChild(s);
}

/**
 * Queue a script to load on DOM.ready
 * @param src
 * @param fn
 */
function enqueue(src, fn) {
    $(function() {
        if (typeof src === 'string') {
            addScript(src, fn);
        }
        else if (typeof src.length !== 'undefined' && src.length > 0) {
            for (var i = 0; i < src.length; i++) {
                addScript(src[i], i < src.length ? null : fn);
            }
        }
    });
}

(function(global, JSON) {
    /**
     * Shortcut for JSON.stringify
     * @param   {object}    what    The object to stringify.
     * @returns {string}
     */
    function stringify(what) {
        return JSON.stringify(what);
    }

    global.stringify = stringify;

    /**
     * Convert a string to dash-separated URL slug.
     * @param   {string}    s   A string or array to be sluggified.
     * @returns {string|*}
     */
    function slugify(subject) {
        if (subject.join !== undefined) {
            return subject.join('-').toLowerCase();
        }
        if (subject.toLowerCase !== undefined && subject.replace !== undefined) {
            return decodeURIComponent(subject)
                .replace(/\s/g, '-')
                .toLowerCase();
        }
        return subject;
    }

    global.slugify = slugify;

    /**
     * Create safe file name with no spaces and with a file extension.
     * @param fileName
     * @param fileExt
     * @returns {string|*}
     */
    function safeFileName(fileName, fileExt) {
        if (getFileExtension(fileName) !== fileExt) {
            fileName += '.' + fileExt;
        }
        return slugify(fileName);
    }

    global.safeFileName = safeFileName;

    /**
     * Create a parth from an arbitrary number of segments.
     * @returns {String | String | String | string}
     */
    function toPath() {
        var parts = [];
        if (arguments[0] instanceof Array) {
            parts = arguments[0];
        }
        else {
            parts = Array.prototype.slice.call(arguments);
        }
        var segments = [];
        parts.map(function(part) {
            if (part.charAt(part.length -1) === '/') {
                part = part.slice(0, -1);
            }
            segments = segments.concat(part.split('/'));
        })
        return segments.join('/');
    }

    global.toPath = toPath;

    /**
     * Create a unique file name.
     * @param targetFolder
     * @param fileName
     * @returns {string}
     */
    function getUniqueFileName(targetFolder, fileName) {

        var newFile, newFileName;

        newFile = targetFolder + "/" + fileName;

        var ext = fileName.split('.').pop();
        ext = '.' + ext;

        if (new File(newFile).exists) {
            newFileName =  fileName.replace(ext, '') + '@' + Utils.shortUUID() + ext;
            newFile = targetFolder + "/" + newFileName;
        }

        return newFile;
    }

    global.getUniqueFileName = getUniqueFileName;

    /**
     * Opens link in default browser via CSXSEvent callback.
     * @param url
     */
    function openInDefaultBrowser(url) {
        if (CSXSEvent instanceof Function) {
            var event  = new CSXSEvent();
            logger.info('[CSXSEvent]', typeof event);
            event.type = 'com.atomic.openWebPage';
            event.data = String(url);
            event.dispatch()
        }
        else {
            alert('CSXSEvent is not defined. Link cannot be opened.');
        }
    }

    global.openInDefaultBrowser = openInDefaultBrowser;

    function centerItem(theItem) {
        try {
            var doc = app.activeDocument,
                artboard = doc.artboards[doc.artboards.getActiveArtboardIndex()];

            if (! artboard) {
                doc.artboards.setActiveArtboardIndex(0);
            }

            var left   = artboard.artboardRect[0],
                top    = artboard.artboardRect[1],
                right  = artboard.artboardRect[2],
                bottom = artboard.artboardRect[3];

            theItem.position = [
                Math.round((right - theItem.width)/2),
                Math.round((bottom + theItem.height)/2)
            ];
        }
        catch(ex) {
            try {
                theItem.position = [0, 0];
            }
            catch(ex) {/*Exit Gracefully*/}
        }
    }

    global.centerItem = centerItem;

    function asciiToHex(str) {
        var arr1 = [];
        for (var n = 0, l = str.length; n < l; n ++) {
            var hex = Number(str.charCodeAt(n)).toString(16);
            arr1.push(hex);
        }
        return arr1.join('');
    }

    global.asciiToHex = asciiToHex;

    /**
     * Formats a file name using date.
     * @param withTime
     * @returns {string}
     */
    function formatDate(withTime, yearFirst) {
        var date = new Date()

        function pad(n, len) {
            len = len === undefined ? 2 : len ;
            return String(n + Math.pow(10, len)).slice(-len)
        }

        var ts = [
            pad( date.getMonth() + 1 ),
            pad( date.getDate() ),
            date.getFullYear()
        ];

        if (yearFirst) {
            ts.reverse();
        }

        ts = ts.join('-');

        if (withTime) {
            ts += '-' + [
                pad( date.getHours() ),
                pad( date.getMinutes() ),
                pad( date.getSeconds() ),
                pad( date.getMilliseconds(), 3 )
            ].join('-')
        }

        return ts;
    }

    global.formatDate = formatDate;

})(this, JSON);
