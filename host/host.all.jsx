try  {
    var polyfills = {loaded: true};

    var Host = null
        , extensionsPath = ''
        , module         = { exports : null }
        , kUSER_NAME     = null
        , pathsep        = null
        , Config         = null
        , debug          = function(){}
        , logger         = undefined
    ;

    /**
     * Adds replaceAll method to String
     * @param search
     * @param replacement
     * @returns {string}
     */
    if (! String.prototype.replaceAll) {
        String.prototype.replaceAll = function(search, replacement) {
            var target = this;
            return target.replace(new RegExp(search, 'g'), replacement);
        };
    }

    /**
     * Adds trim function to the String class.
     * @returns {string}
     */
    if (! String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        };
    }

    /**
     * Adds String().repeat method to String's prototype.
     */
    if (! String.prototype.repeat) {
        String.prototype.repeat = function(n) {
            return new Array(++n).join(this);
        }
    }

    /**
     * Adds a method to star out a string (like a password).
     * @returns {string}
     */
    if (! String.prototype.obfuscate) {
        String.prototype.obfuscate = function() {
            return this.replace(/./g, "*");
        };
    }

    /**
     * Capitalize first letter of each word.
     */
    if (! String.prototype.toTitleCase) {
        String.prototype.toTitleCase = function() {
            return this.replace(/\w\S*/g, function(txt){
                return txt.charAt(0).toUpperCase() + txt.substr(1);
            });
        };
    }

    /**
     * Add method to test if a number is between two values.
     */
    if (! Number.prototype.between) {
        Number.prototype.between = function(a, b, inclusive) {
            var min = Math.min(a, b),
                max = Math.max(a, b);
            return inclusive ? this >= min && this <= max : this > min && this < max;
        }
    }

    /*
 * Array polyfills.
 */

    if (! Array.prototype.map) {
        /**
         * Add map method to Array prototype.
         * @param fn
         */
        Array.prototype.map = function(fn) {
            for (var i = 0; i < this.length; i++) {
                this[i] = fn.call(this, this[i]);
            }
            return this;
        }
    }

    /**
     * Array.prototype.forEach() polyfill
     * @author Chris Ferdinandi
     * @license MIT
     */
    if (! Array.prototype.forEach) {
        Array.prototype.forEach = function (callback, thisArg) {
            thisArg = thisArg || null;
            for (var i = 0; i < this.length; i++) {
                callback.call(thisArg, this[i], i, this);
            }
        };
    }

    /**
     * Add Array.indexOf support if not supported natively.
     */
    if (! Array.prototype.indexOf) {
        /**
         * Gets the index of an element in an array.
         * @param what
         * @param i
         * @returns {*}
         */
        Array.prototype.indexOf = function(what, i) {
            i = i || 0;
            var L = this.length;
            while (i < L) {
                if(this[i] === what) return i;
                ++i;
            }
            return -1;
        };
    }

    /**
     * Add Array.remove support.
     * @returns {Array}
     */
    if (! Array.prototype.remove) {
        Array.prototype.remove = function() {
            var what, a = arguments, L = a.length, ax;
            while (L && this.length) {
                what = a[--L];
                while ((ax = this.indexOf(what)) !== -1) {
                    this.splice(ax, 1);
                }
            }
            return this;
        };
    }


    /**
     * Array filter polyfill.
     */
    if (! Array.prototype.filter) {
        Array.prototype.filter = function(func, thisArg) {
            'use strict';
            if ( ! ((typeof func === 'Function' || typeof func === 'function') && this) )
                throw new TypeError();

            var len = this.length >>> 0,
                res = new Array(len), // preallocate array
                t = this, c = 0, i = -1;

            var kValue;
            if (thisArg === undefined){
                while (++i !== len){
                    // checks to see if the key was set
                    if (i in this){
                        kValue = t[i]; // in case t is changed in callback
                        if (func(t[i], i, t)){
                            res[c++] = kValue;
                        }
                    }
                }
            }
            else{
                while (++i !== len){
                    // checks to see if the key was set
                    if (i in this){
                        kValue = t[i];
                        if (func.call(thisArg, t[i], i, t)){
                            res[c++] = kValue;
                        }
                    }
                }
            }

            res.length = c; // shrink down array to proper size
            return res;
        };
    }

    /**
     * Polyfill for Object.keys
     *
     * @see: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/keys
     */
    if (! Object.keys) {
        Object.keys = (function () {
            var hasOwnProperty = Object.prototype.hasOwnProperty,
                hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
                dontEnums = [
                    'toString',
                    'toLocaleString',
                    'valueOf',
                    'hasOwnProperty',
                    'isPrototypeOf',
                    'propertyIsEnumerable',
                    'constructor'
                ],
                dontEnumsLength = dontEnums.length;

            return function (obj) {
                if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object');

                var result = [];

                for (var prop in obj) {
                    if (hasOwnProperty.call(obj, prop)) result.push(prop);
                }

                if (hasDontEnumBug) {
                    for (var i=0; i < dontEnumsLength; i++) {
                        if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i]);
                    }
                }
                return result;
            }
        })()
    }

    if (! Object.create) {
        Object.create = function (proto, propertiesObject) {
            if (typeof proto !== 'object' && typeof proto !== 'function') {
                throw new TypeError('Object prototype may only be an Object: ' + proto);
            } else if (proto === null) {
                throw new Error("This browser's implementation of Object.create is a shim and doesn't support 'null' as the first argument.");
            }

            if (typeof propertiesObject != 'undefined') {
                throw new Error("This browser's implementation of Object.create is a shim and doesn't support a second argument.");
            }

            function F() {}
            F.prototype = proto;

            return new F();
        };
    }

    /**
     * Object.assign() polyfill
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
     */
    if (! Object.assign) {
        // Must be writable: true, enumerable: false, configurable: true
        Object.assign = {
            value: function assign(target, varArgs) { // .length of function is 2
                'use strict';
                if (target == null) { // TypeError if undefined or null
                    throw new TypeError('Cannot convert undefined or null to object');
                }

                var to = Object(target);

                for (var index = 1; index < arguments.length; index++) {
                    var nextSource = arguments[index];

                    if (nextSource != null) { // Skip over if undefined or null
                        for (var nextKey in nextSource) {
                            // Avoid bugs when hasOwnProperty is shadowed
                            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                to[nextKey] = nextSource[nextKey];
                            }
                        }
                    }
                }
                return to;
            },
            writable: true,
            configurable: true
        };
    }

    /**
     * Object.entries() polyfill
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
     */
    if (! Object.entries) {
        Object.entries = function( obj ){
            var ownProps = Object.keys( obj ),
                i = ownProps.length,
                resArray = new Array(i); // preallocate the Array
            while (i--)
                resArray[i] = [ownProps[i], obj[ownProps[i]]];

            return resArray;
        };
    }

    try {
        /**
         * Adds JSON library support for engines that do not include it natively.
         */
        "object" != typeof JSON && (JSON = {}), function () {
            "use strict";

            function f(t) {
                return 10 > t ? "0" + t : t
            }

            function quote(t) {
                return escapable.lastIndex = 0, escapable.test(t) ? '"' + t.replace(escapable, function (t) {
                    var e = meta[t];
                    return "string" == typeof e ? e : "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4)
                }) + '"' : '"' + t + '"'
            }

            function str(t, e) {
                var n, r, o, f, u, i = gap, p = e[t];
                switch (p && "object" == typeof p && "function" == typeof p.toJSON && (p = p.toJSON(t)),
                "function" == typeof rep && (p = rep.call(e, t, p)), typeof p) {
                    case"string":
                        return quote(p);
                    case"number":
                        return isFinite(p) ? String(p) : "null";
                    case"boolean":
                    case"null":
                        return String(p);
                    case"object":
                        if (!p) return "null";
                        if (gap += indent, u = [], "[object Array]" === Object.prototype.toString.apply(p)) {
                            for (f = p.length, n = 0; f > n; n += 1) u[n] = str(n, p) || "null";
                            return o = 0 === u.length ? "[]" : gap ? "[\n" + gap + u.join(",\n" + gap) + "\n" + i + "]" : "[" + u.join(",") + "]", gap = i, o
                        }
                        if (rep && "object" == typeof rep) for (f = rep.length, n = 0; f > n; n += 1) "string" == typeof rep[n] && (r = rep[n], o = str(r, p), o && u.push(quote(r) + (gap ? ": " : ":") + o));
                        else for (r in p) Object.prototype.hasOwnProperty.call(p, r) && (o = str(r, p), o && u.push(quote(r) + (gap ? ": " : ":") + o));
                        return o = 0 === u.length ? "{}" : gap ? "{\n" + gap +
                            u.join(",\n" + gap) + "\n" + i + "}" : "{" + u.join(",") + "}", gap = i, o
                }
            }

            "function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function () {
                return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" +
                    f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
            }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function () {
                return this.valueOf()
            });
            var cx, escapable, gap, indent, meta, rep;
            "function" != typeof JSON.stringify &&
            (escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                meta = {
                    "\b": "\\b",
                    "  ": "\\t",
                    "\n": "\\n",
                    "\f": "\\f",
                    "\r": "\\r",
                    '"': '\\"',
                    "\\": "\\\\"
                }, JSON.stringify = function (t, e, n) {
                var r;
                if (gap = "", indent = "", "number" == typeof n) for (r = 0; n > r; r += 1) indent += " "; else "string" == typeof n && (indent = n);
                if (rep = e,
                e && "function" != typeof e && ("object" != typeof e || "number" != typeof e.length)) throw new Error("JSON.stringify");
                return str("", {"": t})
            }),
            "function" != typeof JSON.parse && (cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                JSON.parse = function (text, reviver) {
                    function walk(t, e) {
                        var n, r, o = t[e];
                        if (o && "object" == typeof o) for (n in o) Object.prototype.hasOwnProperty.call(o, n) &&
                        (r = walk(o, n), void 0 !== r ? o[n] = r : delete o[n]);
                        return reviver.call(t, e, o)
                    }

                    var j;
                    if (text = String(text), cx.lastIndex = 0, cx.test(text) &&
                    (text = text.replace(cx, function (t) {
                        return "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4)
                    })),
                        /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
                            .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")
                            .replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return j = eval("(" + text + ")"), "function" == typeof reviver ? walk({"": j}, "") : j;
                    throw new SyntaxError("JSON.parse")
                })
        }();
    }
    catch(e) {alert(e)}


    /**
     * @author Scott Lewis <scott@vectoricons.net>
     * @license The MIT License (MIT)
     * @copyright 2017 Scott Lewis
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */

    /**
     * Lets get started.
     * @type {boolean}
     */
// $.localize = true;

    /**
     * @type {Logger}
     */
// var logger = (function(logger) {
//     if (logger !== undefined) return logger;
//     return new Logger($.fileName, "~/Downloads/");
// })(logger);

    /**
     * Our base object.
     * @type {{}}
     */
    var Utils = new Object();

    /**
     * Turn off displaying alerts.
     */
    Utils.displayAlertsOff = function() {
        userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;
    };

    /**
     * Turn on displaying alerts.
     */
    Utils.displayAlertsOn = function() {
        try {
            userInteractionLevel = UserInteractionLevel.DISPLAYALERTS;
        }
        catch(e) {/* Exit Gracefully */}
    }

    /**
     * Get a value from an object or array.
     * @param   {object|array}    subject
     * @param   {string}          key
     * @param   {*}               dfault
     * @returns {*}
     */
    Utils.get = function( subject, key, dfault ) {
        var value = dfault;
        if (subject.hasOwnProperty(key)) {
            value = subject[key];
        }
        return value;
    };

    /**
     * Extends {Object} target with properties from {Object} source.
     * No new properties are added to the object meaning only properties that
     * exist in both source and target will be updated.
     * @param target
     * @param source
     * @returns {*}
     */
    Utils.update = function(target, source) {
        for (key in source) {
            if (target.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
        return target;
    };

    /**
     * Extends {Object} target with properties from {Object} source.
     * Any values that are already set will not be updated. New properities
     * will be added to the object.
     * @param target
     * @param source
     * @returns {*}
     */
    Utils.extend = function(target, source) {
        for (key in source) {
            if (target.get(key, false)) {
                continue;
            }
            target[key] = source[key];
        }
        return target;
    };

    /**
     * Open a file dialog.
     * @param   {File} file           The file object
     * @param   {String} title        The dialog title
     * @param   {String} file_filter  The file filter pattern
     * @returns {*}
     */
    Utils.chooseFile = function(oFile, title, file_filter) {
        if (! oFile instanceof File) var oFile = new File();
        if (! title) var title  = 'Choose File';
        if (! filter) var filter = "*";
        return oFile.openDlg(
            title,
            file_filter,
            false
        );
    };

    /**
     * Open a folder select dialog.
     * @param label
     * @param start
     * @returns {*}
     */
    Utils.chooseFolder = function(label, start) {
        return Folder.selectDialog(label);
    }

    /**
     * Gets the screen dimensions and bounds.
     * @returns {{left: *, top: *, right: *, bottom: *}}
     */
    Utils.getScreenSize = function() {
        var screen;

        for (i=0; i<$.screens.length; i++) {
            if ($.screens[i].primary == true) {
                screen = $.screens[i];
                screen.width = screen.right - screen.left;
                screen.height = screen.bottom - screen.top;
            }
        }
        return screen;
    };

    /**
     * Create a new dialog, centered on screen.
     * @param type
     * @param width
     * @param height
     * @param title
     * @returns {window}
     */
    Utils.window = function(type, title, width, height) {
        var dialog = new Window(
            type, title,
            [0, 0, width, height]
        );
        dialog.center();
        return dialog;
    };

    /**
     * Saves the file in AI format.
     * @param {document} doc            The document object to save
     * @param {string}   path           The file destination path
     * @param {int}      compatibility  The Adobe Illustrator format (version)
     * @return void
     */
    Utils.saveFileAsAi = function( doc, path, compatibility ) {
        if (app.documents.length > 0) {
            var theDoc  = new File(path);
            var options = new IllustratorSaveOptions();
            if (typeof(compatibility) == 'undefined') {
                compatibility = Compatibility.ILLUSTRATOR19;
            }
            options.compatibility = compatibility;
            options.flattenOutput = OutputFlattening.PRESERVEAPPEARANCE;
            options.pdfCompatible = true;
            doc.saveAs(theDoc, options);
        }
    };

    /**
     *
     * @param {string}  str
     * @returns {XML|string|void}
     */
    Utils.trim = function(str) {
        return str.replace(/^\s+|\s+$/g, '');
    };

    /**
     * Logging for this script.
     * @param {string} message      The logging text
     * @return void
     * @deprecated
     */
    Utils.logger = function(message, line, filename) {
        alert('Utils logger has been deprecated. Use the Logger.jsx class instead');
        // if (! CONFIG) {
        //     CONFIG = {
        //         LOG_FOLDER    : "/var/log/",
        //         LOG_FILE_PATH : "/var/log/extendscript-utils-" + Utils.dateFormat(new Date().getTime()) + ".log"
        //     }
        // }
        //
        // message = message + "\n" + $.error + "\n\nSTACK TRACE: \n\n" + $.stack;
        //
        // try {
        //     Utils.folder( CONFIG.LOG_FOLDER );
        //     Utils.write_file(CONFIG.LOG_FILE_PATH, "[" + new Date().toUTCString() + "] " + message);
        // }
        // catch(ex) {
        //     alert([line, filename, message].join(' - '));
        // }
    };

    /**
     * Logging for this script.
     * @param {string}  path        The file path
     * @param {string}  txt         The text to write
     * @param {bool}    replace     Replace the file
     * @return void
     */
    Utils.write_file = function( path, txt, replace ) {
        try {
            var file = new File( path );
            if (replace && file.exists) {
                file.remove();
                file = new File( path );
            }
            file.open("e", "TEXT", "????");
            file.seek(0,2);
            $.os.search(/windows/i)  != -1 ? file.lineFeed = 'windows'  : file.lineFeed = 'macintosh';
            file.writeln(txt);
            file.close();
        }
        catch(ex) {
            try { file.close(); }
            catch(ex) {/* Exit Gracefully*/}
        }
    };

    /**
     * Writes a file and calls a callback.
     * @param   {string}    path        The file path
     * @param   {string}    txt         The text to write
     * @param   {function}  callback    The callback to execute.
     * @returns {*}                     The result of the callback.
     */
    Utils.write_and_call = function( path, txt, callback ) {
        try {
            var file = new File( path );
            if (file.exists) {
                file.remove();
                file = new File( path );
            }
            file.open("e", "TEXT", "????");
            file.seek(0,2);
            $.os.search(/windows/i)  != -1 ? file.lineFeed = 'windows'  : file.lineFeed = 'macintosh';
            file.writeln(txt);
            file.close();
            return callback.call(this, file);
        }
        catch(ex) {
            try {
                file.close();
            }
            catch(ex) {/* Exit Gracefully*/}
            throw ex;
        }
    };

    /**
     *
     * @param {string}  path
     * @param {object}  json
     * @param {bool}    replace
     */
    Utils.write_json_file = function( path, json, replace ) {
        try {
            Utils.write_file(path, Utils.objectToString(json), replace);
        }
        catch(e) {
            throw e;
        }
    };

    /**
     * Reads the contents of a file.
     * @param   {string}  filepath
     * @returns {string}
     */
    Utils.read_file = function( filepath ) {

        var content = "";

        var theFile = new File(filepath);

        if (theFile) {

            try {
                if (theFile.alias) {
                    while (theFile.alias) {
                        theFile = theFile.resolve().openDlg(
                            LANG.CHOOSE_FILE,
                            "",
                            false
                        );
                    }
                }
            }
            catch(ex) {
                dialog.presetsMsgBox.text = ex.message;
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
    };

    /**
     *
     * @param {string}  filepath
     * @returns {*}
     */
    Utils.read_json_file = function(filepath) {
        var contents, result;
        try {
            alert(filepath);
            if (typeof filepath === 'string') {
                filepath = filepath.replace(/(\s+)/g, '\\$1');
            }
            if ( contents = Utils.read_file( filepath ) ) {
                alert(contents);
                result = JSON.parse(contents);
                if ( typeof(result) !== 'object') {
                    result = null;
                }
            }
        }
        catch(e) {
            throw e;
        }
        return result;
    };

    /**
     * Replace Mac's tilde home alias with full path.
     * @param {string}      path    The path to de-mac.
     * @returns {string}
     */
    Utils.expand_path = function(path, root_path) {
        return path.replace('~/', root_path);
    };

    /**
     * Get saved configuration JSON.
     * @param {String}  config_file     Path to the config file.
     * @returns {{}}
     */
    Utils.get_config = function(config_file) {
        var configFile = new File(config_file);
        var config = {};
        try {
            if (configFile.exists) {
                config = JSON.parse(
                    Utils.read_file(configFile)
                );
            }
        }
        catch(e) {
            logger.error($.localize(e.message));
        }
        return config;
    };

    /**
     *
     * @param {string}  filepath
     * @param {bool}    mustconfirm
     */
    Utils.deleteFile = function( filepath, mustconfirm ) {
        try {
            if (mustconfirm && ! confirm(LANG.CONFIRM_DELETE_PRESET)) {
                return;
            }
            new File(filepath).remove();
        }
        catch(e) {
            throw new Error($.line + ' - ' + $.fileName + ' - ' + $.error);
        }
    };

    /**
     * Initialize a folder.
     * @param {string}  path
     */
    Utils.folder = function( path ) {
        var theFolder = new Folder( path );
        if (! theFolder.exists) {
            theFolder.create();
        }
        return theFolder;
    };

    /**
     * Get all files in sub-folders.
     * @param   {string}  srcFolder
     * @returns {Array}
     */
    Utils.getFilesInSubfolders = function( srcFolder ) {

        var allFiles, theFolders, svgFileList;

        if ( ! srcFolder instanceof Folder) return;

        allFiles    = srcFolder.getFiles();
        theFolders  = [];
        svgFileList = [];

        for (var x=0; x < allFiles.length; x++) {
            if (allFiles[x] instanceof Folder) {
                theFolders.push(allFiles[x]);
            }
        }

        if (theFolders.length == 0) {
            svgFileList = srcFolder.getFiles(/\.svg$/i);
        }
        else {
            for (var x=0; x < theFolders.length; x++) {
                fileList = theFolders[x].getFiles(/\.svg$/i);
                for (var n = 0; n<fileList.length; n++) {
                    svgFileList.push(fileList[n]);
                }
            }
        }
        return svgFileList;
    };

    /**
     * Get the basename of a file path.
     * @param path
     * @returns {*}
     */
    Utils.basename = function(path) {
        var basename = null;
        try {
            basename = path.split('/').pop();
        }
        catch(e) {
            throw new Error($.line + ' - ' + $.fileName + ' - ' + $.error)
        }
        return basename;
    };

    /**
     * Format the date in YYYY-MM-DD format
     * @param {string}  date  The date in timestring format
     * @return {string} date string in YYYY-MM-DD format (2015-10-06)
     */
    Utils.dateFormat = function(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    };

    /**
     * Stringify an object.
     * @param   {object}  obj
     * @returns {string}
     */
    Utils.objectToString = function(obj) {
        var items = [];
        for (key in obj) {
            var value = obj[key];
            if (typeof(value) == "array") {
                for (var i=0; i<value.length; i++) {
                    value[i] = '"' + value[i] + '"';
                }
                value = '[' + value.join(',') + ']';
            }
            else if (typeof(value) == 'object') {
                value = objectToString(value);
            }
            items.push('"' + key + '": "' + value + '"');
        }
        return "{" + items.join(',') + "}";
    };

    /**
     * Align objects to nearest pixel.
     * @param {array}   sel     Selection array
     */
    Utils.alignToNearestPixel = function(sel) {

        try {
            if (typeof sel != "object") {
                throw new Error($.line + ' - ' + $.fileName + ' - ' + LANG.NO_SELECTION);
            }
            else {
                for (i = 0 ; i < sel.length; i++) {
                    sel[i].left = Math.round(sel[i].left);
                    sel[i].top = Math.round(sel[i].top);
                }
                redraw();
            }
        }
        catch(e) {
            throw new Error($.line + ' - ' + $.fileName + ' - ' + $.error);
        }
    };

    /**
     * Cleans up the filename/artboardname.
     * @param   {String}    name    The name to filter and reformat.
     * @returns  {String}            The cleaned up name.
     */
    Utils.filterName = function(name) {
        return decodeURIComponent(name).replace(' ', '-');
    }

    /**
     * Test if all parents are visible & unlocked.
     * @param {object} item
     * @returns {boolean}
     */
    Utils.isVisibleAndUnlocked = function(item) {
        return ! Utils.anyParentLocked(item) && ! Utils.anyParentHidden(item);
    };

    /**
     * Derived from P. J. Onori's Iconic SVG Exporter.jsx
     * @param {object} item
     * @returns {boolean}
     */
    Utils.anyParentLocked = function(item) {
        while ( item.parent ) {
            if ( item.parent.locked ) {
                return true;
            }
            item = item.parent;
        }
        return false;
    };

    /**
     * Derived from P. J. Onori's Iconic SVG Exporter.jsx
     * @param {object} item
     * @returns {boolean}
     */
    Utils.anyParentHidden = function(item) {
        while ( item.parent ) {
            if ( item.parent.hidden ) {
                return true;
            }
            item = item.parent;
        }
        return false;
    };

    /**
     * Groups selected items.
     * @returns void
     */
    Utils.groupSelection = function() {
        try {
            app.executeMenuCommand('group');
        }
        catch(e) {
            alert(localize({en_US: "Items could not be grouped (line: %1, file: %2)"}, $.line, $.fileName));
        }
    };

    /**
     * Display a new progress bar.
     * @param maxvalue
     * @returns {*}
     */
    Utils.showProgressBar = function(maxvalue) {

        var top, right, bottom, left;

        if ( bounds = Utils.getScreenSize() ) {
            left = Math.abs(Math.ceil((bounds.width/2) - (450/2)));
            top = Math.abs(Math.ceil((bounds.height/2) - (100/2)));
        }

        var progress = new Window("palette", 'Progress', [left, top, left + 450, top + 120]);
        progress.pnl = progress.add("panel", [10, 10, 440, 100], 'Progress');
        progress.pnl.progBar = progress.pnl.add("progressbar", [20, 45, 410, 60], 0, maxvalue);
        progress.pnl.progBarLabel = progress.pnl.add("statictext", [20, 20, 320, 35], "0 of " + maxvalue);

        progress.show();

        Utils.progress = progress;
    };

    /**
     * Hides and destroys the progress bar.
     */
    Utils.hideProgressBar = function() {
        Utils.progress.hide();
        Utils.progress = null;
    }

    /**
     * Updates the progress bar.
     * @param progress
     * @returns {*}
     */
    Utils.updateProgress = function(message) {
        Utils.progress.pnl.progBar.value++;
        var val = Utils.progress.pnl.progBar.value;
        var max = Utils.progress.pnl.progBar.maxvalue;
        Utils.progress.pnl.progBarLabel.text = val + ' of ' + max + ' - ' + message;
        $.sleep(10);
        Utils.progress.update();
    };

    /**
     * Updates the progress bar.
     * @param progress
     * @returns {*}
     */
    Utils.updateProgressMessage = function(message) {
        var val = Utils.progress.pnl.progBar.value;
        var max = Utils.progress.pnl.progBar.maxvalue;
        Utils.progress.pnl.progBarLabel.text = val + ' of ' + max + ' - ' + message;
        $.sleep(10);
        Utils.progress.update();
    };

    /**
     * Alias for localize function.
     * @param str
     * @param vars
     * @returns {*}
     */
    Utils.i18n = function(str, vars) {
        return localize({en_US: str}, vars);
    };

    /**
     * Converts a string, array, or object to dash-separated string.
     * @param   {string|array|object}   subject    A string, array, or object to convert to a slug.
     * @returns {string}                           The cleaned up name.
     */
    Utils.slugger = function(subject) {
        if (typeof(subject) == "array") {
            return subject.join('-');
        }
        else if (typeof(subject) == "object") {
            var bits = [];
            for (key in subject) {
                if (typeof(subject[key]) != "string") continue;
                bits.push(subject[key].toLowerCase());
            }
            return bits.join('-');
        }
        else if (typeof(subject) == "string") {
            return decodeURIComponent(subject).replace(' ', '-');
        }
        return subject;
    };

    /**
     * Gets the artboard index of the current selection. This is a brute-force approach
     * and not the ideal solution but it's the best we can currently do.
     * @author  carlos canto 09/28/2013
     * @see     http://forums.adobe.com/message/5721205?tstart=0#5721205
     * @param   {GroupItem}     The selection for which see want the artboard.
     * @returns {integer}       Returns the index of the artboard.
     */
    Utils.getArtboardOfGroupItem = function(groupItem) {

        var index = -1;
        var doc   = app.activeDocument;

        // Loop through each artboard.
        for(i=0; i<doc.artboards.length; i++) {

            // Activate each artboard.
            doc.artboards.setActiveArtboardIndex(i);

            // Select all items on the artboard.
            doc.selectObjectsOnActiveArtboard();

            // Test our original selection to see if it is now selected.
            index = doc.artboards.getActiveArtboardIndex();

            if (groupItem.selected) {
                return doc.artboards.getActiveArtboardIndex();
            }

            // We didn't find our object, keep going.
            doc.selection = null;
        }

        return index;
    };

    /**
     * Get the index of an artboard by its name.
     * @param {string} name
     * @returns {number}
     */
    Utils.getArtboardIndexByName = function(name) {
        var doc = app.activeDocument;
        if (artboard = doc.artboards.getByName(name)) {
            for (i = 0; i < doc.artboards.length; i++) {
                if (doc.artboards[i] == artboard) {
                    return i;
                }
            }
        }
        return -1;
    };

    /**
     * Get the artboard index using the name of the items on the artboard.
     * @param itemName
     * @returns {number}
     */
    Utils.getArtboardIndexItemByName = function(itemName) {

        var index = -1;
        var doc   = app.activeDocument;

        // Loop through each artboard.
        for(i = 0; i < doc.artboards.length; i++) {

            // Activate each artboard.
            doc.artboards.setActiveArtboardIndex(i);

            // Select all items on the artboard.
            doc.selectObjectsOnActiveArtboard();

            logger.info("Checking artboard " + i + " for item " + itemName);

            if (doc.selection.length) {
                logger.info("Selected items on artboard " + i);
                if (typeof(doc.selection.name) != "undefined") {
                    logger.inf("Found named selection on artboard " + i);
                    if (doc.selection.name.toUpperCase() == itemName.toUpperCase()) {
                        logger.info("Found item " + itemName + " on artboard " + i);
                        return doc.artboards.getActiveArtboardIndex();
                    }
                }
            }

            // We didn't find our object, keep going.
            doc.selection = null;
        }

        return index;
    }

    /**
     * Set active artboard by name.
     * @param {string} name
     */
    Utils.setActiveArtboardByName = function(name) {
        var doc = app.activeDocument;
        doc.artboards.setActiveArtboardIndex(Utils.getArtboardIndexByName(name));
    };

    /**
     * Get a unique universal identifier.
     * RFC4122 version 4 compliant.
     * @returns {string}
     */
    Utils.generateUUID = function() {
        var d = new Date().getTime();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    };

    /**
     * Get a unique universal identifier.
     * RFC4122 version 4 compliant.
     * @returns {string}
     */
    Utils.shortUUID = function() {
        return Utils.generateUUID().split('-').shift();
    };

    /**
     * @experimental
     * Rename artboard groupItems by artboard name
     */
    Utils.renameGroupItemsByArtboardNames = function() {
        var doc = app.activeDocument;
        for (i = 0; i < doc.artboards.length; i++) {
            doc.artboards.setActiveArtboardIndex(i);
            var ab = doc.artboards[doc.artboards.getActiveArtboardIndex()];
            doc.selectObjectsOnActiveArtboard();
            app.executeMenuCommand('group');
            selection.name = ab.name.indexOf("Artboard ") != -1 ? "Group " + i : ab.name;
        }
    };

    /**
     * Opens a folder in the Finder. If `thePath` is not defined,
     * the active document in Illustrator will be used. If no documents
     * are open, it will error out.
     * @param {string} thePath
     */
    Utils.showInFinder = function(thePath) {
        if (typeof(thePath) == 'undefined' && app.documents.length > 0) {
            thePath = app.activeDocument.path;
        }
        try {
            new Folder(thePath).execute();
        }
        catch(e) {
            alert(e);
        }
    };

    /**
     * Split single paths into individual path commands.
     * @param paths
     * @returns {Array}
     */
    Utils.splitSvgPath = function(paths) {

        var splitPaths = [];

        if (! (paths instanceof Array)) {
            paths = [paths];
        }

        paths.map(function(path) {
            var commands = path.split('M')
            commands.shift()
            splitPaths = splitPaths.concat(commands)
        })

        splitPaths.map(function(path) {
            return "M " + path;
        })

        return splitPaths;
    }

    /*
  M = moveto
  L = lineto
  H = horizontal lineto
  V = vertical lineto
  C = curveto
  S = smooth curveto
  Q = quadratic Bézier curve
  T = smooth quadratic Bézier curveto
  A = elliptical Arc
  Z = closepath

  Example:

        M1.5,9.744l10.5-9l10.5,9
        M12,5.244L3.377,12.61C3.153,12.818,3.018,13.105,3,13.41v8.855 c0.002,0.539,0.439,0.976,0.978,0.978H9.75
        v-7.01c0.001-0.27,0.219-0.489,0.489-0.49h3.522c0.27,0.001,0.488,0.22,0.489,0.49 v7.01
         h5.772c0.539-0.002,0.976-0.438,0.978-0.977v-8.855c-0.018-0.305-0.153-0.592-0.377-0.8L12,5.244z
*/

    /**
     * Tokenize a string.
     * @param   {string}    str
     * @param   {Array}     tokens
     * @returns {Array}
     */
    Utils.tokenize = function(str, tokens) {

        var s,
            peek,
            commands = [];

        str = str.trim()

        for (var index = 0; index < str.length; index++) {

            s += str[index];
            peek = str[index + 1]

            if (tokens.indexOf(peek) !== -1) {
                commands.push(s.trim());
                s = ''
            }
        }
        return commands;
    }

    module.exports = Utils;

    /**
     * @author Scott Lewis <scott@atomiclotus.net>
     * @copyright 2018 Scott Lewis
     * @version 1.0.0
     * @url http://github.com/iconifyit
     * @url https://atomiclotus.net
     *
     * ABOUT:
     *
     *    This script creates a simple logger class.
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
    /**
     * Create a new logger instance.
     * @param name
     * @param folder
     * @constructor
     */
    var Logger = function(name, folder) {

        var myDocuments;

        if (Folder && Folder.myDocuments && Folder.myDocuments.absoluteURI) {
            myDocuments = Folder.myDocuments.absoluteURI;
        }

        /**
         * Default settings for the logger.
         * @type {{folder: string}}
         */
        this.defaults = {
            folder: myDocuments + "/logs"
        }

        /**
         * The log folder object.
         * @type {Folder}
         */
        this.folder = new Folder(folder || this.defaults.folder);

        /*
     * Create the log folder if it does not exist.
     */
        if (! this.folder.exists) {
            this.folder.create();
        }

        /**
         * Format date into a filename-friendly format.
         * @param date
         * @returns {string}
         */
        function dateFormat(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [year, month, day].join('-');
        }

        /**
         * The log file.
         * @type {File}
         */
        this.file = new File(
            this.folder.absoluteURI + "/" + name + "-" + dateFormat(new Date().getTime()) + ".log"
        );

        if (! this.file.exists) {
            this.create();
        }

        // alert(this.file.absoluteURI);
    };

    /**
     * Log message types.
     */
    Logger.prototype.types = {
        INFO    : 'INFO',
        WARN    : 'WARN',
        ERROR   : 'ERROR',
        INSPECT : 'INSPECT'
    }

    /**
     * Add info message to log.
     * @param message
     */
    Logger.prototype.info = function(title, message) {
        this.log(title, message, this.types.INFO);
    }

    /**
     * Add warning message to log.
     * @param message
     */
    Logger.prototype.warn = function(title, message) {
        this.log(title, message, this.types.WARN);
    }

    /**
     * Line number debug message.
     * @param lineNum
     * @param message
     */
    Logger.prototype.line = function(fileName, lineNum, message) {
        fileName = fileName.split('/').pop();
        this.log(fileName + ', ' + lineNum , message, this.types.INFO);
    }

    /**
     * Add error message to log.
     * @param message
     */
    Logger.prototype.error = function(title, message) {
        this.log(title, message, this.types.ERROR);
    }

    /**
     * Add message to log.
     * @param message
     */
    Logger.prototype.log = function(title, message, type) {

        message = typeof message === 'object' ? stringify(message) : String(message || '');
        var text = title + message;

        if (message !== undefined) {
            text = '[' + title + '] ' + message;
        }

        var typeStr = '';
        if (type === this.types.ERROR) {
            typeStr = '[' + this.types.ERROR + ']';
        }

        var date = new Date();
        var dateString = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

        this.write([
            '='.repeat(25)
            , typeStr + "[" + dateString + "] " + text
        ].join("\n"));
    }

    /**
     * Single function to write all log messages.
     * @param content
     * @returns {boolean}
     */
    Logger.prototype.write = function(content) {
        var result = false;
        try {
            Utils.write_file(
                this.file.absoluteURI,
                content
            );
        }
        catch(e) {
            this.file.close();
            alert('[Logger.jsx][write] ' + e.message)
        }
        finally {
            this.file.close();
        }
        return result;
    }

    /**
     * Delete log file.
     * @returns {*|Array}
     */
    Logger.prototype.remove = function() {
        if (this.file.exists) {
            return this.file.remove();
        }
    }

    /**
     * Create the log file.
     * @param message
     */
    Logger.prototype.create = function() {
        try {
            if (! this.file.exists) {
                this.write([
                    '[Logger.jsx] Logger instance created'
                    , '[Logger.jsx] ' + '='.repeat(52)
                    , '[Logger.jsx] ' + (new Date().toLocaleString())
                    , '[Logger.jsx] ' + '='.repeat(52)
                ].join("\n"));
            }
        }
        catch(e) {
            throw new Error('[Logger.jsx][create] ' + e.message)
        }
    }

    /**
     * Prints an object to the log.
     * @param obj
     */
    Logger.prototype.inspect = function(obj) {
        for (key in obj) {
            try {
                this.log(key + ' : ' + obj[key], this.types.INSPECT);
            }
            catch(e) {
                this.log(key + ' : [' + localize({en_US: 'Internal Error'}) + ']', this.types.INSPECT);
            }

        }
    }

    /**
     * Writes log file section header.
     * @param str
     */
    Logger.prototype.header = function(str) {
        try {
            this.info('[Logger.jsx] Logger instance created');
            this.info('[Logger.jsx] ' + '='.repeat(52));
            this.info('[Logger.jsx] ' + (new Date().toLocaleString()));
            if (str) { this.info('[Logger.jsx] ' + str); }
            this.info('[Logger.jsx] ' + '='.repeat(52));
        }
        catch(e){ alert('[Host.jsx][header] ' + e.message) }
    }

    var Helpers = {loaded : true};
    /**
     * @author    Scott Lewis <scott@atomiclotus.net>
     * @copyright 2018 Astute Graphics
     * @version   1.0.0
     * @url       https://astutegraphics.com
     * @url       https://atomiclotus.net
     *
     * ABOUT:
     *
     *    Helper functions for general use.
     *
     * CREDITS:
     *
     *   This extension is based on the CEP Boilerplate extension by Scott Lewis
     *   at Atomic Lotus, LLC.
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

    /**
     * Context constants.
     * @type {{HOST: string, CLIENT: string}}
     */
    var Contexts = {
        HOST   : 'HOST',
        CLIENT : 'CLIENT'
    };

    /**
     * Test if this class supports the Ai Object type. Before you can use
     * this method, define an array in the global scope named `supportedTypes`.
     * The underscore indicates the array is meant to be private.
     * @param   {string}    theType
     * @returns {boolean}
     * @private
     */
    function isSupported(theType) {
        if (typeof(supportedTypes) == 'undefined') {
            throw "You must create a global array named `supportedTypes` with the supported type names";
        }
        return supportedTypes.indexOf(theType.toLowerCase()) >= 0;
    }

    /**
     * Check the type of an object.
     * @param   {*}         theItem
     * @param   {string}    theType
     * @returns {boolean}
     * @private
     */
    function isType(theItem, theType) {
        return strcmp(typeof(theItem), theType);
    }

    /**
     * Check the typename of an AI Object.
     * @param   {*}         theItem
     * @param   {string}    theTypename
     * @returns {boolean}
     * @private
     */
    function isTypename(theItem, theTypename) {
        if (strcmp(theItem.typename, 'undefined')) return false;
        return strcmp(theItem.typename, theTypename);
    }

    /**
     * Get the typename of an object if it is set.
     * @param   {object}    theItem
     * @returns {string|null}
     */
    function getTypename(theItem) {
        if (isDefined(theItem.typename)) return theItem.typename;
        return "undefined";
    }

    /**
     * Is the item an array?
     * @param theItem
     * @returns {boolean}
     */
    function isArray(theItem) {
        return theItem instanceof Array;
    }

    /**
     * Is theItem an object?
     * @param   {*} theItem
     * @returns {*}
     * @private
     */
    function isObject(theItem) {
        return isType(theItem, 'object');
    }

    /**
     * Is theItem a function?
     * @param   {*}         theItem
     * @returns {boolean}
     * @private
     */
    function isFunction(theItem) {
        return theItem instanceof Function;
    }

    /**
     * Is theItem a string?
     * @param   {*}         theItem
     * @returns {boolean}
     */
    function isString(theItem) {
        return isType(theItem, 'string');
    }

    /**
     * Is theItem a number?
     * @param   {*}         theItem
     * @returns {boolean}
     */
    function isNumber(theItem) {
        return ! isNaN(theItem);
    }

    /**
     * Validate a JSON string.
     * @author  Thanks to https://stackoverflow.com/users/244374/matt-h
     * @url     https://stackoverflow.com/a/20392392/11357814
     * @param   {string}    jsonString  The stringified object to test.
     * @returns {boolean}
     */
    function isJSON(jsonString) {
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
     * Determine if a value is true-ish.
     * USE ONLY with strings, ints, and booleans.
     * @param   {string|boolean|integer} what
     * @returns {boolean}
     */
    function isTrue(what) {

        if (what === true) return true;

        if (isString(what)) {
            var variants = [
                'yes', 'oui', 'ja', 'da',
                'si', 'yeah', 'yep', 'yup',
                'fuck yes', 'fuck yeah', 'fuckin a',
                'you know it', 'of course'
            ];
            what = what.toLowerCase();
            if (what === "true")     return true;
            if (variants.indexOf(what) != -1) return true;
        }

        if (! isNaN(what)) {
            if (parseInt(what) > 0) return true;
        }

        return false;
    }

    /**
     * Determine if a value is false-ish.
     * USE ONLY with strings, ints, and booleans.
     * @param   {string|boolean|integer} what
     * @returns {boolean}
     */
    function isFalse(what) {

        if (what === false) return true;

        if (isString(what)) {
            var variants = [
                'no', 'non', 'nein', 'nyet',
                'nope', 'nah', 'not a chance', 'nay',
                'fuck no', 'false', 'no way', '0'
            ];
            what = what.toLowerCase();
            if (variants.indexOf(what) != -1) return true;
        }

        if (! isNaN(what)) {
            if (parseInt(what) === 0) return true;
        }

        return false;
    }

    /**
     * Is theString an error (Starts with the word 'Error')?
     * @param   {string}    theString
     * @returns {boolean}
     */
    function isErrorString(theString) {
        return theString.substr(0, 5).toLowerCase() == 'error';
    }

    /**
     * Is theItem a GroupItem?
     * @param   {*}         theItem
     * @returns {boolean}
     * @private
     */
    function isGroupItem(theItem) {
        return isTypename(theItem, 'GroupItem');
    }

    /**
     * Is theItem a PathItem?
     * @param   {*}         theItem
     * @returns {boolean}
     * @private
     */
    function isPathItem(theItem) {
        return isTypename(theItem, 'PathItem');
    }

    /**
     * Is theItem a CompoundPathItem?
     * @param   {GroupItem} theItem
     * @returns {boolean}
     * @private
     */
    function isCompoundPathItem(theItem) {
        return isTypename(theItem, 'CompoundPathItem');
    }

    /**
     * Test if a value is defined.
     * @param   {string}    property
     * @returns {boolean}
     * @private
     */
    function isDefined(theItem) {
        return typeof(theItem) != 'undefined';
    }

    /**
     * Is the value null or empty?
     * @param theItem
     * @returns {boolean}
     */
    function isNull(theItem) {
        if (theItem === null) return true;
        if (! isDefined(theItem)) return true;
        if (isEmpty(theItem)) return true;
        return false;
    }

    /**
     * If theItem is defined, return it, otherwise set it to theDefault value.
     * @param   {*}     theItem
     * @param   {*)     theDefault
     * @returns {boolean|*}
     */
    function isDefinedOr(theItem, theDefault) {
        if (typeof(theItem) != 'undefined') {
            return theItem;
        }
        return theDefault;
    }

    /**
     * If theItem is not empty, return it, otherwise set it to theDefault value.
     * @param   {*}     theItem
     * @param   {*)     theDefault
     * @returns {boolean|*}
     */
    function isEmptyOr(theItem, theDefault) {
        if (! isEmpty(theItem)) {
            return theItem;
        }
        return theDefault;
    }

    /**
     * Tests if the current OS is Macintosh.
     * @returns {boolean}
     */
    function isMac() {
        return Folder.fs.toLowerCase().indexOf('mac') !== -1;
    }

    /**
     * Tests if the current OS is Windows.
     * @returns {boolean}
     */
    function isWindows() {
        return Folder.fs.toLowerCase().indexOf('mac') === -1;
    }

    /**
     * Gets the name of the current operating system.
     * @returns {String|string}
     */
    function os() {
        return Folder.fs.toLowerCase();
    }

    /**
     * Get the current timestamp.
     * @returns {number}
     * @private
     */
    function now() {
        return (new Date()).getTime();
    }

    /**
     * Get a value from an object or array.
     * @param {object|array}    subject     The object or array to search
     * @param {string}          key         The object property to find
     * @param {*}               _default    The default value to return if property is not found
     * @returns {*}                         The found or default value
     */
    function get( subject, key, _default ) {
        var value = _default;
        if (typeof(subject[key]) !== 'undefined') {
            value = subject[key];
        }
        return value;
    }

    /**
     * Ensures a URL ends with a trailing slash.
     * @param url
     * @returns {*}
     */
    function slash(url) {
        if (url.charAt(url.length-1) != '/') {
            url += '/';
        }
        return url;
    };

    /**
     * Appends a string to a base string using a divider.
     * @param   {string} base
     * @param   {string} add
     * @param   {string} divider
     * @returns {string}
     */
    function pack(base, add, divider) {
        if (base.charAt(base.length-1) != divider) {
            base += divider;
        }
        return base + add;
    }

    /**
     * Case-insensitive string comparison.
     * @param   {string}  aText
     * @param   {string}  bText
     * @returns {boolean}
     */
    function strcmp(aText, bText) {
        return aText.toLowerCase() === bText.toLowerCase();
    }

    /**
     * Trap function execution in a try/catch block.
     * @param   {function}    func
     * @returns {*}
     */
    function trap(func, customError) {
        try {
            return func();
        }
        catch(e) {
            return customError || e.message ;
        }
    }

    /**
     * Format date into a filename-friendly format.
     * @param   {string}  date
     * @returns {string} "YYYY-MM-DD"
     */
    function dateFormat(date, separator) {
        if (! isDefined(separator)) {
            separator = "-";
        }
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day   = '' + d.getDate(),
            year  = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join(separator);
    }

    /**
     * Test of a variable is completely empty.
     * @param   {*}         data
     * @returns {boolean}
     */
    function isEmpty(data) {
        if (typeof(data) == 'number' || typeof(data) == 'boolean') {
            return false;
        }
        if (typeof(data) == 'undefined' || data === null) {
            return true;
        }
        if (typeof(data.length) != 'undefined') {
            return data.length == 0;
        }
        var count = 0;
        for (var i in data) {
            if (data.hasOwnProperty(i)) count ++;
        }
        return count == 0;
    }

    /**
     * Convert XML document to string.
     * @param   {XmlDocument} xmlData
     * @returns {string}
     */
    function xmlToString(xmlData) {
        //IE
        if ( window.ActiveXObject ) {
            return xmlData.xml;
        }
        // Everyone else.
        return (new XMLSerializer()).serializeToString(xmlData);
    }

    /**
     * Trim newline chars from a long string.
     * @param   {string}    theText
     * @returns {string}
     */
    function trimNewLines(theText) {
        return theText.replace(/\r?\n/g, "");
    }

    /**
     * Trims a string.
     * @param   {string}  str     The string to trim
     * @returns  {XML|string|void}
     */
    function trim(str) {
        return str.replace(/^\s+|\s+$/g, '');
    }

    /**
     * Get the file extension portion of a file name.
     * @param theFileName
     * @returns {string}
     */
    function getFileExtension(theFileName) {
        return theFileName.toLowerCase().split(".").pop();
    }

    /**
     * Get the base name of a file path or file name.
     * @param theFileName
     * @returns {void | string}
     */
    function getBaseName(theFileName) {
        var justTheName = theFileName.split("/").pop();
        return justTheName.replace("." + getFileExtension(justTheName), "");
    }

    /**
     * Get only the last folder in a path.
     * @param thePath
     */
    function getFolderName(thePath) {
        return thePath.split('/').pop();
    }

    /**
     * Get the parent folder of a path representing a file or folder.
     * @param thePath
     * @returns {*|string}
     */
    function getParentFolder(thePath) {
        var folders = thePath.split('/');
        return folders[folders.length - 2];
    }

    /**
     * Conditionally add a layer and set name.
     * @param i
     * @param layerName
     */
    function maybeAddLayer(i, layerName) {
        var doc = app.activeDocument;
        try {
            if (i == 0) {
                doc.layers[0].name = layerName;
            }
            else {
                doc.layers.add().name = layerName;
            }
        }
        catch(ex) {
            logger.error("Layer `" + layerName + "` not created : " + ex.message );
        }
    }

    /**
     * Center and resize artwork per configuration.
     * @param theItem
     * @param CONFIG
     */
    function centerAndResizeItem(theItem, CONFIG) {
        try {
            theItem.position = [
                Math.floor((CONFIG.ARTBOARD_WIDTH  - theItem.width) / 2),
                Math.floor((CONFIG.ARTBOARD_HEIGHT - theItem.height) / 2) * -1
            ];
            if (typeof(theItem.resize) == "function" && CONFIG.SCALE != 100) {
                theItem.resize(CONFIG.SCALE, CONFIG.SCALE, true, true, true, true, CONFIG.SCALE);
            }
        }
        catch(ex) {
            try {
                theItem.position = [0, 0];
            }
            catch(ex) {/*Exit Gracefully*/}
        }
    }

    /**
     * Sort file list if sorting is selected.
     * @param   {array}   fileList
     * @param   {object}  CONFIG
     * @param   {Logger}  logger
     * @returns {array}
     */
    function maybeSortFileList(fileList, CONFIG, logger) {
        if (CONFIG.SORT_ARTBOARDS == true) {
            try {
                fileList.sort(comparator);
            }
            catch(ex) {
                logger.error(Strings.SORT_FILELIST_FAILED);
            }
        }
        return fileList;
    }

    /**
     * Get artboard name from file and folder names.
     * @param theFolder
     * @param theFile
     * @returns {string|XML|void}
     */
    function getBoardName(theFolder, theFile) {

        var bits      = theFolder.name.split('-');
        var boardName = theFile.name.replace(/\.svg|\.ai|\.eps|\.pdf/gi, "");

        /**
         * If the file is in a subfolder, prepend the
         * subfolder name to the board name.
         */
        if (Folder(theFile.path).absoluteURI != Folder(theFolder).absoluteURI) {
            boardName = Folder(theFile.path).name + '-' + boardName;
        }

        boardName = Utils.slugify(boardName);

        bits = boardName.split("--");
        if (bits.length > 1 && ! isNaN(bits[0])) {
            boardName = trim(bits[1]);
        }

        return boardName;
    }

    /**
     * Private method to open the log file.
     * @param {Logger} logger
     */
    function doOpenLogFile(logger) {
        try {
            logger.info("LOG FILE : " + logger.file.absoluteURI);
            logger.open();
        }
        catch(ex) {
            logger.error(ex);
        }
    }

    /**
     * Creates a web shortcut then opens it in the default browser.
     * @param address
     * @private
     */
    function doOpenWebAddress( address, logger ) {
        try {
            Utils.write_exec(
                Folder.temp + '/' + now() + '-shortcut.url',
                '[InternetShortcut]' + '\r' + 'URL=' + encodeURI(address) + '\r'
            );
        }
        catch(e) {
            logger.error(e);
            prompt(
                Utils.i18n(
                    "The web address could not be automatically opened but you " +
                    "can copy & paste the address below to your browser."
                ),
                address
            );
        }
    };

    /**
     * Set the PathPoints in an AI PathItem from SVG path value.
     * @param {PathItem}    path
     * @param {string}      svg
     *
     * @author Malcolm McLean <malcolm@astutegraphics.co.uk>
     */
    function setPathItemFromSVG(path, svg)
    {
        var i;
        var pp;
        var pointArray = svgToPathPointArray(svg);

        while(path.pathPoints.length > 1)
        {
            path.pathPoints[0].remove();
        }
        path.pathPoints[0].anchor = pointArray[0].anchor;
        path.pathPoints[0].leftDirection = pointArray[0].leftDirection;
        path.pathPoints[0].rightDirection = pointArray[0].rightDirection;

        for(i=1;i<pointArray.length;i++)
        {
            pp = path.pathPoints.add();
            pp.anchor = pointArray[i].anchor;
            pp.leftDirection = pointArray[i].leftDirection;
            pp.rightDirection = pointArray[i].rightDirection;
            pp.pointType = PointType.CORNER;
        }
    }

    /**
     * Copies path points from one path to another.
     * @param targetPath
     * @param sourcePath
     */
    function copyPathPoints(targetPath, sourcePath) {

        var i,
            pp,
            pointArray,
            targetPPKey,
            sourcePPKey;

        targetPPKey = targetPath.selected ? "selectedPathPoints" : "pathPoints";
        sourcePPKey = sourcePath.selected ? "selectedPathPoints" : "pathPoints";

        while (targetPath[targetPPKey].length > 1) {
            targetPath[targetPPKey][0].remove();
        }

        pointArray = sourcePath[sourcePPKey];

        targetPath[targetPPKey][0].anchor         = pointArray[0].anchor;
        targetPath[targetPPKey][0].leftDirection  = pointArray[0].leftDirection;
        targetPath[targetPPKey][0].rightDirection = pointArray[0].rightDirection;

        for(i=1; i < pointArray.length; i++) {
            try {
                pp = targetPath[targetPPKey].add();
                pp.anchor         = pointArray[i].anchor;
                pp.leftDirection  = pointArray[i].leftDirection;
                pp.rightDirection = pointArray[i].rightDirection;
                pp.pointType      = PointType.CORNER;
            }
            catch(e) {
                Utils.dump("[copyPathPoints()#targetPath[targetPPKey].add()] " + e.message);
            }
        }
    }

    /**
     * Converts SVG Path value to cubic bezier points.
     * @param   {string}    svg
     * @returns {Array}
     *
     * @author Malcolm McLean <malcolm@astutegraphics.co.uk>
     */
    function svgToPathPointArray(svg)
    {
        var result = [];
        var splits = svg.split("C");
        var i;
        var point = {};
        var start = splits[0].slice(1, splits[0].length);
        var starts = start.split(",");
        if(starts.length != 2)
        {
            return [];
        }
        point.anchor = [parseFloat(starts[0]), parseFloat(starts[1])];
        result.push(point);
        point = {};
        for(i=1; i < splits.length;i++)
        {
            point = {};
            segs = splits[i].split(",");
            if(segs.length != 6)
            {
                return [];
            }
            result[i-1].rightDirection = [parseFloat(segs[0]), parseFloat(segs[1])];
            point.leftDirection = [parseFloat(segs[2]), parseFloat(segs[3])];
            point.anchor = [parseFloat(segs[4]), parseFloat(segs[5])];
            result.push(point);
        }
        if(svg.indexOf("Z") >= 0)
        {
            result[0].leftDirection = point.leftDirection;
            point = {};
            if(result.length > 1)
            {
                result.pop();
            }
        }
        else
        {
            result[0].leftDirection = result[0].anchor;
            result[result.length-1].rightDirection = result[result.length-1].anchor;
        }

        return result;

    }

    /**
     * Converts AI PathItem PathPoints to SVG path value.
     * @param   {PathItem}  path
     * @returns {*}
     *
     * @author Malcolm McLean <malcolm@astutegraphics.co.uk>
     */
    function pathItemToSVG(path)
    {
        var i;
        var answer = "";
        var ppa;
        var ppb;

        if(path.pathPoints.length == 0)
            return "";


        answer = "M" + path.pathPoints[0].anchor[0].toFixed(2) + "," + path.pathPoints[0].anchor[1].toFixed(2);


        for(i=0;i<path.pathPoints.length-1;i++)
        {
            ppa = path.pathPoints[i];
            ppb = path.pathPoints[i+1];
            answer += "C";
            answer += ppa.rightDirection[0].toFixed(2);
            answer += ",";
            answer += ppa.rightDirection[1].toFixed(2);
            answer += ",";
            answer += ppb.leftDirection[0].toFixed(2);
            answer += ",";
            answer += ppb.leftDirection[1].toFixed(2);
            answer += ",";
            answer += ppb.anchor[0].toFixed(2);
            answer += ",";
            answer += ppb.anchor[1].toFixed(2);
        }

        if(path.closed)
        {
            ppa = path.pathPoints[path.pathPoints.length-1];
            ppb = path.pathPoints[0];
            answer += "C";
            answer += ppa.rightDirection[0].toFixed(2);
            answer += ",";
            answer += ppa.rightDirection[1].toFixed(2);
            answer += ",";
            answer += ppb.leftDirection[0].toFixed(2);
            answer += ",";
            answer += ppb.leftDirection[1].toFixed(2);
            answer += ",";
            answer += ppb.anchor[0].toFixed(2);
            answer += ",";
            answer += ppb.anchor[1].toFixed(2);
            answer += "Z";
        }

        return answer;
    }

    /**
     * Replace tokens in a string with key => value paired vars.
     * @param theText
     * @param theVars
     * @returns {*}
     * @private
     */
    function txt(theText, theVars) {
        for (token in theVars) {
            theText = theText.replace(
                new RegExp("{" + token + "}","g"),
                theVars[token]
            );
        }
        return theText;
    }

    /**
     * Make sure at least one file type is selected.
     * @returns {bool}
     */
    function hasOneFileType() {
        return CONFIG.FILETYPE_SVG || CONFIG.FILETYPE_AI || CONFIG.FILETYPE_EPS || CONFIG.FILETYPE_PDF;
    }

    /**
     * Cleans up the filename/artboardname.
     * @param   {String}    name    The name to filter and reformat.
     * @returns  {String}            The cleaned up name.
     */
    function filterName(name) {
        return decodeURIComponent(name).replace(' ', '-');
    }

    /**
     * Saves a file in Ai format.
     * @param {string}  dest    Destination folder path
     */
    function saveFileAsAi(dest) {
        if (app.documents.length > 0) {
            var options = new IllustratorSaveOptions();
            var theDoc  = new File(dest);
            options.flattenOutput = OutputFlattening.PRESERVEAPPEARANCE;
            options.pdfCompatible = true;
            app.activeDocument.saveAs(theDoc, options);
        }
    }

    /**
     * Align objects to nearest pixel.
     * @param   {object}  selection     The selection object
     * @returns  {void}
     */
    function alignToNearestPixel(sel) {

        try {
            if (typeof selection != "object") {
                logger.info(Strings.NO_SELECTION);
            }
            else {
                for (i = 0 ; i < selection.length; i++) {
                    selection[i].left = Math.round(selection[i].left);
                    selection[i].top  = Math.round(selection[i].top);
                }
                redraw();
            }
        }
        catch(ex) {
            logger.error(ex);
        }
    }

    /**
     * Trims a string.
     * @param   {string}  str     The string to trim
     * @returns  {XML|string|void}
     * @deprecated Use String.trim() instead.
     */
    function trim(str) {
        return str.replace(/^\s+|\s+$/g, '');
    }

    /**
     * Centers objects on artboards
     * @returns {void}
     */
    function centerObjects() {
        doc = app.activeDocument;

        var doc  = app.activeDocument;
        var progress = showProgressBar(doc.artboards.length);

        for (i=0; i<doc.artboards.length; i++) {

            doc.artboards.setActiveArtboardIndex(i);

            var activeAB = doc.artboards[doc.artboards.getActiveArtboardIndex()];
            var right    = activeAB.artboardRect[2];
            var bottom   = activeAB.artboardRect[3];

            doc.selectObjectsOnActiveArtboard();

            for (x = 0 ; x < selection.length; x++) {
                try {
                    selection[x].position = [
                        Math.round((right - selection[x].width)/2),
                        Math.round((bottom + selection[x].height)/2)
                    ];
                }
                catch(e) {
                    logger.error('ERROR - ' + e.message);
                }
                updateProgress(
                    progress,
                    CONFIG.ARTBOARD_COUNT,
                    Strings.CENTERING_OBJ + i + " of " + CONFIG.ARTBOARD_COUNT + ": `" + activeAB.name + "`"
                );
            }
            redraw();
        }

        progress.close();
    }

    /**
     * Get board name prefix.
     * @param theFile
     * @param srcFolder
     * @returns {string}
     */
    function getArtboardNamePrefix(theFile, srcFolder) {

        var prefix = Folder(theFile.path).absoluteURI.replace(
            Folder(srcFolder).absoluteURI, ""
        );

        var sep = '$';

        prefix = prefix.split('/').join(sep);

        if (prefix.charAt(0) == sep) {
            prefix = prefix.substring(1);
        }

        return prefix; // prefix.split('-').join('');
    }

    /**
     * Callback for sorting the file list.
     * @param   {File}  a
     * @param   {File}  b
     * @returns {number}
     */
    function comparator(a, b) {
        var nameA = filterName(a.name.toUpperCase());
        var nameB = filterName(b.name.toUpperCase());
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        // names must be equal
        return 0;
    }


    /**
     * Show the progress bar.
     * @param   {int}     maxvalue  The maximum value of the progress counter
     * @returns  {object}            The progress bar object
     */
    function showProgressBar(maxvalue) {

        var top, left;

        if ( bounds = Utils.getScreenSize() ) {
            left = Math.abs(Math.ceil((bounds.width/2) - (450/2)));
            top = Math.abs(Math.ceil((bounds.height/2) - (100/2)));
        }

        var progress = new Window("palette", 'Progress', [left, top, left + 450, top + 110]);

        progress.pnl              = progress.add("panel",           [10, 10, 440, 100], "Script Progress");
        progress.pnl.progBarLabel = progress.pnl.add("statictext",  [20, 20, 320, 35], "0%");
        progress.pnl.progBar      = progress.pnl.add("progressbar", [20, 45, 410, 60], 0, maxvalue);

        progress.show();

        return progress;
    }

    /**
     * Update the progress bar
     * @param {object}  progress    A progress bar object
     * @param {int}     maxvalue    The maximum value of the progress counter
     * @param {string}  message     The progress bar message
     * @returns {void}
     */
    function updateProgress(progress, maxvalue, message) {

        progress.pnl.progBarLabel.text = message;
        progress.pnl.progBar.value++;
        $.sleep(10);
        progress.update();
        return progress;
    }

    /**
     * Shortcut for JSON.stringify
     * @param   {object}    what    The object to stringify.
     * @returns {string}
     */
    function stringify(what) {
        return JSON.stringify(what);
    }

    /**
     * Appends a string to a base string using a divider.
     * @param   {string} base
     * @param   {string} add
     * @param   {string} divider
     * @returns {string}
     * @deprecated
     */
    function pack(base, add, divider) {
        divider = typeof(divider) == 'undefined' ? '/' : divider;
        if (base.charAt(base.length-1) != divider) {
            base += divider;
        }
        return base + add;
    }

    /**
     * Appends a string to a base string using a divider.
     * @param   {string} path
     * @param   {string} subpath
     * @param   {string} separator
     * @returns {string}
     */
    function path(path, subpath, separator) {
        separator = typeof(separator) == 'undefined' ? '/' : separator;
        if (path.charAt(path.length-1) != separator) {
            path += separator;
        }
        return path + subpath;
    }

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

    /**
     * Build a path from an arbitrary number of segments.
     * @param parts
     * @returns {String | String | String | string}
     */
    function toPath(parts) {
        var segments = [];
        parts.map(function(part) {
            if (part.charAt(part.length -1) === '/') {
                part = part.slice(0, -1);
            }
            segments = segments.concat(part.split('/'));
        })
        return segments.join('/');
    }

    /**
     * Gets the app context.
     * @returns {string}
     */
    function getContext() {
        if (typeof CSInterface == 'undefined') {
            return Contexts.HOST;
        }
        return Contexts.CLIENT;
    }

    /**
     * Read a file.
     * @param theFilePath
     * @returns {*}
     */
    function readFileData(theFilePath) {
        var result;
        try {
            if (getContext() == Contexts.HOST) {
                var theFile = new File(theFilePath);
                if (theFile.exists) {
                    try {
                        result = {data : theFile.read(), err : 0};
                    }
                    catch(e) {
                        result = {data : null, err : e.message};
                    }
                }
            }

            // We are in the Client context.

            else {
                result = window.cep.fs.readFile(theFilePath);
            }

            if (result.err !== 0) {
                throw new Error("ReadFileError : " + result.err);
            }
            return result.data;
        }
        catch(e) {
            throw new Error(e.message, e.stack);
        }

        return result.data;
    }

    /**
     * Get an extension object. Defaults to current extension.
     * @param extensionId
     * @returns {*}
     */
    function getExtension( extensionId ) {
        var extension,
            extensions;

        if (typeof(extensionId) == 'undefined') {
            extensionId = csInterface.getExtensionId();
        }

        extensions = csInterface.getExtensions( [extensionId] );

        if ( extensions.length == 1 ) {

            extension = extensions[0];
            var extPath = csInterface.getSystemPath(SystemPath.EXTENSION);
            extension.basePath = slash( extension.basePath );

            if (get(extension, 'basePath', false)) {

                extension.customPath = extension.basePath + 'custom';

                xmlString   = readFileData(path(extension.basePath, 'CSXS/manifest.xml'));
                theManifest = $.parseXML(xmlString);
                var $ext    = $('Extension[Id="' + extension.id + '"]', theManifest).eq(0);

                extension.version = $ext.attr('Version');
            }
        }

        return {
            id            : get( extension, 'id', '' ),
            name          : get( extension, 'width', '' ),
            version       : get( extension, 'version', ''),

            basePath      : slash( get( extension, 'basePath', '' ) ),
            mainPath      : slash( get( extension, 'mainPath', '' ) ),

            windowType    : get( extension, 'width', '' ),
            isAutoVisible : get( extension, 'width', '' ),

            height        : get( extension, 'height', '' ),
            width         : get( extension, 'width', '' ),
            maxHeight     : get( extension, 'width', '' ),
            maxWidth      : get( extension, 'width', '' ),
            minHeight     : get( extension, 'width', '' ),
            minWidth      : get( extension, 'width', '' )
        };
    }

    /**
     * Returns only primitive values.
     * @returns {object}
     */
    var ConfigValues = function(Config) {
        var values = {};
        for (var key in Config) {
            if (typeof Config[key] !== 'function') {
                if (key !== 'ACCOUNT') {
                    values[key] = Config[key];
                }
            }
        }
        return values;
    }

    /**
     * Loads user-defined plugins.
     * @param pluginsPath
     */
    function loadPlugins(pluginsPath, context) {

        var config,
            plugins;

        try {
            config = JSON.parse(readFileData(pluginsPath + '/plugins.json'));

            plugins = config.plugins;

            logger.info(stringify(plugins));

            plugins.map(function(plugin) {
                alert(plugin.name);
                if (! isDefined(plugin)) return;
                if (isString(plugin[context])) {
                    try {
                        evalFile(plugin[context]);
                    }
                    catch(e) {
                        error(e + '[' + plugin[context] + ']')
                    }
                }
                else if (isArray(plugin[context])) {
                    plugin[context].map(function(script) {
                        try {
                            evalFile([pluginsPath, plugin.name, script].join('/'));
                        }
                        catch(e) {
                            error(e + '[' + script + ']');
                        }
                    });
                }
            });
        }
        catch(e) {
            error('[loadPlugins] ' + e);
        }
    }

    function evalFile(theFile) {
        try {
            if (getContext() == Contexts.HOST) {
                $.evalFile(theFile);
            }
            else {
                var data = readFileData(theFile);
                eval(data);
            }
        }
        catch(e) {
            throw e;
        }
    }

    /**
     * Replace tokens in a string with key => value paired vars.
     * @param theText
     * @param theVars
     * @returns {*}
     * @private
     */
    function _t(theText, theVars) {
        for (var token in theVars) {
            theText = theText.replace(
                new RegExp("{" + token + "}","g"),
                theVars[token]
            );
        }
        return theText;
    }

    /**
     * Send error message to all outputs.
     * @param message
     * @param vars
     */
    function error(message, vars) {
        message = typeof(vars) != 'undefined' ? _t(message, vars) : message ;
        trap(function() { logger.error(message); }, null);
    }

    /**
     * Send info message to all outputs.
     * @param message
     * @param vars
     */
    function info(message, vars) {
        message = typeof(vars) != 'undefined' ? _t(message, vars) : message ;
        trap(function() { logger.error(message); }, null);
    }

    /**
     * Write to a file.
     * @param path
     * @param content
     * @returns {*}
     */
    function fwrite(path, content, choose) {
        try {
            var file = new File(path);

            if (choose) {
                file = file.saveDlg("Save new file");
            }

            file.encoding = "UTF8";

            file.open("w");
            if (file.error != "")
                throw file.error;

            file.write(content);
            if (file.error != "")
                throw file.error;

            file.close();
            if (file.error != "")
                throw file.error;
        }
        catch(e) {
            try {file.close()}catch(e){}
            throw e;
        }
        return true;
    }

    /**
     * Shows a Save dialog and writes content to selected file.
     * @param content
     * @returns {string|*}
     */
    function fsave(content, fname) {
        return fwrite(Config.LOGFOLDER + '/' + fname, content, true);
    }

    /**
     * Round to whole fixed decimals.
     * @param num
     * @param decimals
     * @returns {number|*}
     */
    function round(num, decimals) {
        num = num || 0;
        if (typeof num === 'number') {
            return parseFloat(num.toFixed(decimals));
        } else {
            return roundArray(num, decimals);
        }
    }

    /**
     * Group layers into sub-layers based on a substring of the layer names.
     * For instance, 'Icon-set-01-some-keywords-here'.
     * groupLayers('Icon-set-01');
     * The result will be to create a new parent layer named 'Icon-Set-01' and
     * to group any layer whose name starts with 'Icon-Set-01' under that layer.
     * @param nameStem
     */
    function groupLayers(nameStem) {

        var doc = app.activeDocument;
        var parent, layer;

        try {
            parent = doc.layers.getByName(nameStem);
        }
        catch(e) {
            parent = doc.layers.add();
            parent.name = nameStem;
        }

        var matches = [];
        try {
            for (var i = 0; i < doc.layers.length; i++) {
                var layer = doc.layers[i];
                if (layer.name.indexOf(nameStem) !== -1) {
                    if (layer.name.length > nameStem.length) {
                        matches.push(layer);
                    }
                }
            }
            for (var i = 0; i  < matches.length; i++) {
                var layer = matches[i];
                layer.move(parent, ElementPlacement.PLACEATEND);
            }
        }
        catch(e) {alert(e)}
    }

    /**
     * Wrappedr for CEP's evalFile.
     * @param theFilePath
     * @returns {*}
     */
    function include(theFilePath) {
        if (getContext() === Contexts.HOST) {
            try {
                if ((new File(theFilePath)).exists) {
                    $.evalFile( theFilePath );
                    return (new File(theFilePath)).name;
                }
                else {
                    return theFilePath + ' does not exist';
                }
            }
            catch(e) { throw e }
        }
        throw new Error(
            '`include` is only available in Host context. ' +
            'Use `addScript` in Client context.'
        );
    }

    /**
     * Shortcut for JSON.stringify
     * @param   {object}    what    The object to stringify.
     * @returns {string}
     */
    function stringify(what) {
        return JSON.stringify(what);
    }

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

    function safeFileName(fileName, fileExt) {
        if (getFileExtension(fileName) !== fileExt) {
            fileName += '.' + fileExt;
        }
        return slugify(fileName);
    }

    /**
     * Filters an array for only unique items.
     * @param _array
     * @returns {string}
     */
    function array_unique(_array) {
        var unique = [];
        (_array || []).map(function(item) {
            if (unique.indexOf(item) === -1) {
                unique.push(item);
            }
        })
        return unique.join(',');
    }

    /**
     * Loads PlugPlugExternalObject if it is not already loaded.
     */
    var plugPlugExternalObject;
    function maybeLoadPlugPlugLib() {
        if (! plugPlugExternalObject) {

            try {
                plugPlugLib = new ExternalObject ("lib:" + "PlugPlugExternalObject");
            }
            catch (e) {
                logger.error('[PlugPlugExternalObject]', e.message);
            }
        }
    }

    (function(global) {
        global.plugPlugExternalObject = plugPlugExternalObject;
        global.maybeLoadPlugPlugLib   = maybeLoadPlugPlugLib;
    })(this, plugPlugExternalObject, maybeLoadPlugPlugLib);

    /**
     * Opens url in default browser via CSXSEvent.
     * @param url
     */
    function openInDefaultBrowser(url) {
        maybeLoadPlugPlugLib();
        if (typeof CSXSEvent === 'object') {
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
                logger.info(src + ' added');
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

    })(this, JSON);

    /**
     * @author Scott Lewis <scott@atomiclotus.net>
     * @copyright 2018 Scott Lewis
     * @version 1.0.0
     * @url http://github.com/iconifyit
     * @url https://atomiclotus.net
     *
     * ABOUT:
     *
     *    This script is a basic Configuration object.
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
    /**
     * Creates a new Configuration option with the values from options.
     * @param {Object} options
     * @constructor
     */
    function Configuration(options) {

        "use strict";

        this.values = {};

        /**
         * Get a value from an object or array.
         * @param   {object|array}    subject
         * @param   {string}          key
         * @param   {*}               dfault
         * @returns {*}
         */
        this.get = function(key, dfault) {
            var value = dfault;
            if (typeof(this.values[key]) !== 'undefined') {
                value = this.values[key];
            }
            return value;
        };

        /**
         * Get a value from an object or array.
         * @param   {object|array}    subject
         * @param   {string}          key
         * @param   {*}               dfault
         * @returns {*}
         */
        this.set = function(key, value) {
            this.values[key] = value;
        };

        /**
         * Gets the values table.
         * @returns {{}}
         */
        this.getValues = function() {
            return this.values;
        }

        /**
         * Extends {Object} target with properties from {Object} source.
         * @param target
         * @param source
         */
        this.extend = function(source) {
            for (var key in source) {
                if (this.get(key, false)) continue;
                this.set(key, source[key]);
            }
        };

        /**
         * Updates {Object} target with properties from {Object} source.
         * Any previously set values will be over-written.
         * @param {Object}  source      The source object with new values.
         * @param {Boolean} overwrite   Whether or not new values should replace old values.
         */
        this.update = function(source, overwrite) {
            if (typeof(overwrite) == undefined) {
                overwrite = true;
            }
            for (var key in source) {
                if (typeof(this.values[key]) != 'undefined') {
                    if (! overwrite && this.get(key, false)) {
                        continue;
                    }
                    this.set(key, source[key]);
                }
            }
        };

        this.extend(options);
    };

    /**
     * Creates a new response object for interacting with responses from csInterface.evalScript calls.
     * @param value
     * @param error
     * @constructor
     */
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

// alert('[HostResponse.js] loaded')

    /**
     * @type {{
     *    CHOOSE_FOLDER: string,
     *    NO_SELECTION: string,
     *    LABEL_DIALOG_WINDOW: string,
     *    LABEL_ARTBOARD_WIDTH: string,
     *    LABEL_ARTBOARD_HEIGHT: string,
     *    LABEL_COL_COUNT: string,
     *    LABEL_ROW_COUNT: string,
     *    LABEL_ARTBOARD_SPACING: string,
     *    LABEL_SCALE: string,
     *    LABEL_FILE_NAME: string,
     *    LABEL_FILETYPES: string,
     *    LABEL_LOGGING: string,
     *    FILETYPE_SVG: string,
     *    FILETYPE_AI: string,
     *    FILETYPE_EPS: string,
     *    FILETYPE_PDF: string,
     *    BUTTON_CANCEL: string,
     *    BUTTON_OK: string,
     *    DOES_NOT_EXIST: string,
     *    LAYER_NOT_CREATED: string,
     *    LABEL_SRC_FOLDER: string,
     *    LABEL_CHOOSE_FOLDER: string,
     *    LABEL_INPUT: string,
     *    LABEL_SIZE: string,
     *    LABEL_OUTPUT: string,
     *    SORT_FILELIST_FAILED: string,
     *    LABEL_SORT_ARTBOARDS: string,
     *    PROGRESS: string,
     *    IMPORTING_FILE: string,
     *    ERROR: string,
     *    ERROR_IN_FILE: string,
     *    CENTERING_OBJ: string
     * }}
     */
    var Strings = {
        CHOOSE_FOLDER          : 'Please choose your Folder of files to merge',
        NO_SELECTION           : 'No selection',
        LABEL_DIALOG_WINDOW    : 'Merge SVG Files',
        LABEL_ARTBOARD_WIDTH   : 'Artboard Width:',
        LABEL_ARTBOARD_HEIGHT  : 'Artboard Height:',
        LABEL_COL_COUNT        : 'Columns:',
        LABEL_ROW_COUNT        : 'Rows:',
        LABEL_ARTBOARD_SPACING : 'Artboard Spacing:',
        LABEL_SCALE            : 'Scale:',
        LABEL_FILE_NAME        : 'File Name:',
        LABEL_FILETYPES        : 'File Types:',
        LABEL_LOGGING          : 'Logging?',
        FILETYPE_SVG           : 'SVG',
        FILETYPE_AI            : 'AI',
        FILETYPE_EPS           : 'EPS',
        FILETYPE_PDF           : 'PDF',
        BUTTON_CANCEL          : 'Cancel',
        BUTTON_OK              : 'Ok',
        DOES_NOT_EXIST         : ' does not exist',
        LAYER_NOT_CREATED      : 'Could not create layer. ',
        LABEL_SRC_FOLDER       : 'Source Folder',
        LABEL_CHOOSE_FOLDER    : 'Choose Folder',
        LABEL_INPUT            : 'Input',
        LABEL_SIZE             : 'Size',
        LABEL_OUTPUT           : 'Output',
        SORT_FILELIST_FAILED   : 'Could not sort the file list',
        LABEL_SORT_ARTBOARDS   : 'Sort Artboards?',
        PROGRESS               : 'Progress',
        IMPORTING_FILE         : 'Importing file ',
        ERROR                  : 'Error',
        ERROR_IN_FILE          : 'Error in `doc.groupItems.createFromFile` with file `',
        CENTERING_OBJ          : "Centering object ",
        SELECT_ONE_FILETYPE    : "Please select at least one file type."
    };

// if (logger !== undefined) logger.info('host/core/Strings.js loaded');

    /**
     * FileListError class.
     * @param message
     * @param stack
     * @constructor
     */
    var FileListError = function(message, stack) {
        this.name    = "FileListError";
        this.message = message || "Unknown FileListError";
        this.stack   = stack;
    };
    FileListError.prototype = Error.prototype;

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

    /**
     * Class to get list of files. If you pass a file type or types array, the class
     * will return the list immediately. If you pass only the source folder, an interface
     * with several methods is returned.
     * @param rootFolder
     * @param fileTypes
     * @returns {*}
     * @constructor
     */
    var FileList = function(rootFolder, fileTypes) {

        if (typeof rootFolder == 'string') {
            rootFolder = new Folder(rootFolder);
        }

        if (typeof fileTypes != 'undefined') {
            return _getFiles(true, fileTypes);
        }

        /**
         * Get all files in subfolders.
         * @param {Folder}  srcFolder     The root folder from which to merge SVGs.
         * @returns {Array}     Array of nested files.
         */
        function getFilesInSubfolders( srcFolder, recurse, fileTypes ) {

            if (typeof recurse != 'boolean') {
                recurse = false;
            }

            if (typeof fileTypes == 'string') {
                fileTypes = [fileTypes];
            }

            if ( ! (srcFolder instanceof Folder)) return;

            var theFolders  = getSubFolders(srcFolder),
                theFileList = getFilesInFolder(srcFolder, fileTypes);

            if (! recurse || theFolders.length == 0) {
                theFileList = Array.prototype.concat.apply([], getFilesInFolder(srcFolder, fileTypes));
            }
            else {
                for (var x=0; x < theFolders.length; x++) {
                    theFileList = Array.prototype.concat.apply(theFileList, getFilesInFolder(theFolders[x], fileTypes));
                }
            }

            return theFileList;
        }

        /**
         * Get all nested subfolders in theFolder.
         * @param theFolder
         * @returns {*}
         */
        function getSubFolders(theFolder) {
            var subFolders = [];
            var myFileList = theFolder.getFiles();
            for (var i = 0; i < myFileList.length; i++) {
                var myFile = myFileList[i];
                if (myFile instanceof Folder) {
                    subFolders.push(myFile);
                    subFolders = Array.prototype.concat.apply(
                        subFolders,
                        getSubFolders(myFile)
                    );
                }
            }
            return subFolders;
        }

        /**
         * Gets the files in a specific source folder.
         *
         * NOTE: You may notice that in the code below we do not use the Illustrator File method
         * `theFolder.getFiles(/\.svg$/i)` to scan the folder for a specific file type, even though
         * it would be more efficient. The reason is that from time-to-time the MacOS will not correctly
         * identify the file type and the list comes back empty when it is, in fact, not empty. To prevent
         * the script from randomly stop  working and require a system restart, we use a slightly less
         * efficient but more reliable method to identify the file extension.
         *
         * @param {Folder}  The folder object
         * @returns {Array}
         */
        function getFilesInFolder(theFolder, fileTypes) {

            var theFile,
                theExt,
                fileList = [];

            // Make sure we are working with an array if a type is provided.

            if (typeof fileTypes == 'string') {
                fileTypes = [fileTypes];
            }

            fileList = theFolder.getFiles();

            if (typeof fileTypes.length != 'undefined' && fileTypes.length > 0) {
                var filtered = [];
                for (var t = 0; t < fileTypes.length; t++) {
                    var fileType = fileTypes[t];

                    for (var i = 0; i < fileList.length; i++) {

                        theFile = fileList[i];
                        theExt  = theFile.name.split(".").pop();

                        if ( theExt.trim().toUpperCase() == fileType.trim().toUpperCase() ) {
                            filtered.push(theFile);
                        }
                    }
                }
                fileList = filtered;
            }

            return fileList;
        }

        /**
         * Get the file type from file extension.
         * @param theFile
         * @returns {string}
         */
        function getFileType(theFile) {
            return theFile.name.split(".").pop().trim().toUpperCase();
        }

        /**
         * List files except excluded types.
         * @param rootFolder
         * @param recurse
         * @param exclude
         * @returns {any}
         */
        function getAllFilesExcept(rootFolder, recurse, exclude) {

            if (typeof exclude == 'undefineed') {
                return new Error('Array of excluded types required in FileList.getAllFilesExcept');
            }

            var files = getFilesInSubfolders(rootFolder, recurse);

            var filtered = [];
            for (var i = 0; i < files.length; i++) {
                if (excluded.indexOf( getFileType(files[i]) ) == -1) {
                    filtered.push(files[i]);
                }
            }
            return filtered;
        }

        /**
         * Get the file list.
         * @param recurse
         * @param fileTypes
         * @returns {Array}
         * @private
         */
        function _getFiles(recurse, fileTypes) {
            if (typeof recurse != 'boolean') recurse = false;
            return getFilesInSubfolders(rootFolder, recurse, fileTypes);
        }

        /**
         * Public interface.
         */
        return {
            getFiles : function(recurse, fileTypes) {
                return _getFiles(recurse, fileTypes);
            },
            getAllFilesExcept : function(recurse, excludeTypes) {
                return getAllFilesExcept(rootFolder, recurse, excludeTypes);
            },
            getFolders : function(recurse) {
                if (typeof recurse != 'boolean') recurse = false;
                return getSubFolders(recurse);
            }
        }
    };

// if (logger !== undefined) logger.info('host/core/FileList.js loaded');

    var ExportImageError = function(message) {
        this.name    = 'ExportImageError';
        this.message = message;
    };
    ExportImageError.prototype = Error.prototype;
    global.ExportImageError = ExportImageError;

    var ExportTypes = {
        JPG : 'JPG',
        SVG : 'SVG',
        PNG : 'PNG'
    };

    var Exporter = function() {
        this.doc = app.activeDocument;
    }

    Exporter.prototype.exportAllAsSVG = function(theFolder) {
        // saveMultipleArtboards
        // artboardRange
    }

    Exporter.prototype.exportRangeAsSVG = function(theFile, theRange) {

        // theFolder = new Folder(theFolder);
        //
        // if (! theFolder.exists) {
        //     try {
        //         theFolder.create();
        //     }
        //     catch(e) {
        //         throw new Error('Folder ' + theFolder.name + ' does not exist and could not be created.');
        //     }
        // }

        if (typeof theRange !== 'string') {
            theRange = '';
        }

        var options;
        options = new ExportOptionsSVG();
        options.embedRasterImages     = false;
        options.cssProperties         = SVGCSSPropertyLocation.PRESENTATIONATTRIBUTES;
        options.fontSubsetting        = SVGFontSubsetting.None;
        options.documentEncoding      = SVGDocumentEncoding.UTF8;
        options.saveMultipleArtboards = true;
        options.artboardRange         = theRange;
        options.coordinatePrecision   = 3;

        this.doc.exportFile(new File(theFile), ExportType.SVG, options);
    }

    Exporter.prototype.export = function(theFolder, theType, sizes) {
        try {
            var func = 'exportAs' + theType.toUpperCase();

            if (this[func] === undefined) return;
            if (! (this[func] instanceof Function)) return;

            if (! theFolder instanceof Folder) {
                theFolder = new Folder(theFolder);
                if (! theFolder.exists) {
                    try {
                        theFolder.create();
                    }
                    catch(e) {
                        throw new Error('Folder ' + theFolder.name + ' does not exist and could not be created.');
                    }
                }
            }

            theType = theType.toUpperCase();

            if (theType === ExportTypes.SVG) {
                doExport(theFolder,100, '');
                // fixFileNames(theFolder, FileTypes.SVG);
            }
            else {
                for (var i = 0; i < sizes.length; i++) {
                    var div = Number(sizes[i] / 100).toFixed(1);
                    doExport(theFolder, sizes[i], '@' + div);
                    // fixFileNames(theFolder, FileTypes.PNG);
                }
            }

            function doExport(theFolder, scale, sfx) {
                var artboard;

                for (var i = this.doc.artboards.length - 1; i >= 0; i--) {
                    this.doc.artboards.setActiveArtboardIndex(i);
                    artboard = this.doc.artboards[i];

                    // Test_skin-tone-01@hand-gesture-bird-middle-finger.svg

                    var parts   = artboard.name.split('_');
                    var theName = parts.slice(1, parts.length-1).join('-');

                    logger.info('[Export Name]', theName);

                    var theFile = new File(
                        theFolder.fsName + "/" + theName + sfx + "." + theType.toLowerCase()
                    );

                    this[func].call(this, theFile, scale);
                }
            }

            function fixFileNames(theFolder, fileType) {
                var fileList = new FileList(theFolder, fileType);
                fileList.forEach(function(path) {
                    var theFile = new File(path);
                    if (theFile.exists) {
                        var fileName = theFile.name;
                        var newName = fileName.split('@').pop();
                        theFile.rename(newName);
                    }
                });
            }
        }
        catch(e) { throw e; }
    }

    Exporter.prototype.insureFile = function(theFile) {
        logger.info('theFile instanceof File : ' + (theFile instanceof File));
        if (! theFile instanceof File) {
            return new File(theFile);
        }
        return theFile;
    }

    Exporter.prototype.exportAsSVG = function(theFile) {

        theFile = this.insureFile(theFile);

        var options;
        options = new ExportOptionsSVG();
        options.embedRasterImages   = false;
        options.cssProperties       = SVGCSSPropertyLocation.PRESENTATIONATTRIBUTES;
        options.fontSubsetting      = SVGFontSubsetting.None;
        options.documentEncoding    = SVGDocumentEncoding.UTF8;
        options.coordinatePrecision = 4;

        this.doc.exportFile(new File(theFile), ExportType.SVG, options);
    }

    Exporter.prototype.exportAsPNG = function(theFile, scale) {

        theFile = this.insureFile(theFile);

        var options;
        options = new ExportOptionsPNG24();
        options.antiAliasing     = true;
        options.transparency     = false;
        options.artBoardClipping = true;
        options.verticalScale    = scale;
        options.horizontalScale  = scale;

        this.doc.exportFile(new File(theFile), ExportType.PNG24, options);
    }

    Exporter.prototype.exportAsJPG = function(theFile, scale) {

        theFile = this.insureFile(theFile);

        var options;
        options = new ExportOptionsJPEG();
        options.antiAliasing     = true;
        options.artBoardClipping = true;
        options.horizontalScale  = scale;
        options.verticalScale    = scale;

        this.doc.exportFile(new File(theFile), ExportType.JPEG, options);
    }

    var Import = function(filepath, options) {

        var doc
            , placed
            , theFile
            , theLayer
            , screen
        ;

        const kAPP_COORD_SYSTEM = app.coordinateSystem;

        app.coordinateSystem = CoordinateSystem.DOCUMENTCOORDINATESYSTEM;

        screen = Utils.getScreenSize();

        function opt(key, fallback) {
            if (typeof options === 'undefined') return fallback;
            if (typeof options[key] === 'undefined') return fallback;
            if (isEmpty(options[key])) return fallback;
            return options[key];
        }

        if (! app.documents.length) {
            throw new Error('You must open a document in order to import an item');
        }

        doc = app.activeDocument;

        try {

            theFile  = new File(filepath);

            if (! theFile.exists) {
                throw new Error(filepath + ' does not exist');
            }

            theLayer = doc.layers.add();
            placed   = theLayer.groupItems.createFromFile(theFile);

            theLayer.name   = opt('name', theFile.name);
            placed.name     = opt('name', theFile.name);

            var center = [0, 0];

            if (typeof doc !== 'undefined'
                && typeof doc.activeView !== 'undfined'
                && typeof doc.activeView.centerPoint !== 'undefined') {

                center = doc.activeView.centerPoint;
            }

            placed.position = opt('position', [
                center[0] - Math.floor(placed.width / 2),
                center[1] - Math.floor(placed.height / 2)
            ]);

            redraw();
        }
        catch (e) {
            // logger.error('Position error ', e.message);
            throw new Error('Position Error ' + e.message);
        }
        finally {
            app.coordinateSystem = kAPP_COORD_SYSTEM;
        }
    }

    /**
     * Iterator class.
     * @type {{
     *    prototype: {
     *        items: Array,
     *        index: number,
     *        constructor: Iterator.constructor,
     *        first: Iterator.first,
     *        last: Iterator.last,
     *        hasNext: Iterator.hasNext,
     *        nextIndex: Iterator.nextIndex,
     *        next: Iterator.next, hasPrevious:
     *        Iterator.hasPrevious, previousIndex:
     *        Iterator.previousIndex,
     *        previous: Iterator.previous,
     *        current: Iterator.current,
     *        reset: Iterator.reset,
     *        each: Iterator.each,
     *        add: Iterator.add,
     *        insertAt: Iterator.insertAt,
     *        insertBefore: Iterator.insertBefore,
     *        insertAfter: Iterator.insertAfter,
     *        remove: Iterator.remove,
     *        removeAt: Iterator.removeAt,
     *        pop: Iterator.pop,
     *        shift: Iterator.shift,
     *        getItem: Iterator.getItem,
     *        getItems: Iterator.getItems,
     *        isInBounds: Iterator.isInBounds,
     *        checkBounds: Iterator.checkBounds,
     *        hasIndex: Iterator.hasIndex
     *     }
     * }}
     */
    function Iterator(items) {

        if (items instanceof Object) {
            this.items = items;
        }
        else if (null == items || typeof(items) == "undefined") {
            this.items = [];
        }
        else {
            throw new Error(localize({en_US: "Iterator requires an array"}));
        }

    }

    /**
     * {array}  The iterable items.
     */
    Iterator.prototype.items = [];

    /**
     * {number}
     */
    Iterator.prototype.index = 0;

    /**
     * Reset the pointer to the first item, return the first item.
     * @returns {*}
     */
    Iterator.prototype.first = function() {
        this.reset();
        return this.next();
    }

    /**
     * Position the cursor at the last position, return the last item.
     * @returns {*}
     */
    Iterator.prototype.last = function() {
        this.index = this.items.length-1;
        return this.items[this.index];
    }

    /**
     * Test if there is a next item in the collection from the current index.
     * @returns {boolean}
     */
    Iterator.prototype.hasNext = function() {
        return this.getIndex() < this.items.length;
    }

    /**
     * Get the next index relative to the current position.
     * @returns {number}
     */
    Iterator.prototype.nextIndex = function() {
        return this.getIndex() + 1;
    }

    /**
     * Get the current index.
     * @returns {number}
     */
    Iterator.prototype.getIndex = function() {
        return this.index;
    }

    /**
     * Get the next item after the current item.
     * @returns {*}
     */
    Iterator.prototype.next = function() {
        return this.items[this.index++];
    }

    /**
     * Test if there is an item before the current item.
     * @returns {boolean}
     */
    Iterator.prototype.hasPrevious = function() {
        try {
            var test = this.items[this.previousIndex()];
            return (typeof(test) !== "undefined");
        }
        catch(e) {
            return false;
        }
    }

    /**
     * Test if there is an index before the current position.
     * @returns {number}
     */
    Iterator.prototype.previousIndex = function() {
        return this.getIndex() - 1;
    }

    /**
     * Get the previous item from the collection.
     * @returns {*}
     */
    Iterator.prototype.previous = function() {
        return this.items[this.index--];
    }

    /**
     * Get the current item from the collection.
     * @returns {*}
     */
    Iterator.prototype.current = function() {
        return this.items[this.index];
    }

    /**
     * Reset the pointer to the start of the collection.
     */
    Iterator.prototype.reset = function() {
        this.index = 0;
        return this.getItems();
    }

    /**
     * Loop through the collection from start to finish.
     * @param callback
     */
    Iterator.prototype.each = function(callback) {
        try {
            this.reset();
            while (this.hasNext()) {
                callback.apply(this.current(), [this.current(), this.getIndex()]);
                this.next();
            }
            return true;
        }
        catch(e) {
            // $.writeln(e);
            // logger.info(e);
        }
    }

    /**
     * Add an item to the collection.
     * @param item
     */
    Iterator.prototype.add = function(item) {
        this.items.push(item);
    }

    /**
     * Insert an item into the collection at a given position.
     * @param item
     * @param idx
     * @returns {*}
     */
    Iterator.prototype.insertAt = function(item, idx) {
        if (this.checkBounds(idx)) {
            this.items = [].concat(
                this.items.slice(0, idx-1),
                new Array().push(item),
                this.items.slice(idx+1, this.items.length)
            );
            return this.getItems();
        }
    }

    /**
     * Insert an item into the collection before a given position.
     * @param item
     * @param idx
     * @returns {*}
     */
    Iterator.prototype.insertBefore = function(item, idx) {
        if (this.checkBounds(idx)) {
            return this.insertAt(item, idx-1);
        }
    }

    /**
     * Insert an item into the collection after a given position.
     * @param item
     * @param idx
     * @returns {*}
     */
    Iterator.prototype.insertAfter = function(item, idx) {
        if (this.checkBounds(idx)) {
            return this.insertAt(item, idx+1);
        }
    }

    /**
     * Remove an item from the collection. `item` may be an integer (index) or an object literal.
     * @param {*}   item
     * @returns {*|Array}
     */
    Iterator.prototype.remove = function(item) {
        if (item instanceof Number) {
            this.removeAt(parseInt(item));
        }
        else {
            for (var i=0; i<this.items.length; i++) {
                if (this.getItem(i).toSource() == item.toSource()) {
                    this.removeAt(i);
                }
            }
        }
        return this.getItems();
    }

    /**
     * Remove an item at a given position.
     * @param idx
     * @returns {*}
     */
    Iterator.prototype.removeAt = function(idx) {
        if (this.checkBounds(idx)) {
            return this.items = [].concat(
                this.items.slice(0, idx-1),
                this.items.slice(idx+1, this.items.length)
            );
            return this.getItems();
        }
    }

    /**
     * Return the last item off of the collection.
     * @returns {*}
     */
    Iterator.prototype.pop = function() {
        return this.items[this.items.length-1];
    }

    /**
     * Return the first item from the collection.
     * @returns {*}
     */
    Iterator.prototype.shift = function() {
        return this.items[0];
    }

    /**
     * Get an item by index/position in the collection.
     * @param idx
     * @returns {*}
     */
    Iterator.prototype.getItem = function(idx) {
        if (this.checkBounds(idx)) {
            return this.items[i];
        }
    }

    /**
     * Get all items from the collection.
     * @returns {Array}
     */
    Iterator.prototype.getItems = function() {
        return this.items;
    }

    /**
     * Test whether a give index is valid.
     * @param idx
     * @returns {*|boolean}
     */
    Iterator.prototype.isInBounds = function(idx) {
        return this.hasIndex(idx) && idx <= this.items.lenth + 1;
    }

    /**
     * Check if an index is valid (exists and is in bounds).
     * @param idx
     * @returns {boolean}
     */
    Iterator.prototype.checkBounds = function(idx) {
        if (! this.isInBounds(idx)) {
            throw new Error( localize( {en_US: "Index [%1] is out of bounds"}, idx) );
        }
        return true;
    }

    /**
     * Test if the collection has an item at the given position.
     * @param idx
     * @returns {boolean}
     */
    Iterator.prototype.hasIndex = function(idx) {
        if (isNaN(idx)) return false;
        if (this.items.length < 0) return false;
        if (idx < 0) return false;
        if (idx > this.items.length) return false;
    }

    /**
     * Gets the size of the iterable collection.
     * @returns {Number}
     */
    Iterator.prototype.size = function() {
        return this.items.length;
    }

    if (logger !== undefined) logger.info('host/core/Iterator.js loaded');

    try {
        global.ArtboardsIterator = getArtboardsIterator();
    }
    catch(ex) {
        logger.error('[ArtboardIterator.js][ERROR][ArtboardsIterator] : ' + e.message);
    }

    /**
     * FileListError class.
     * @param message
     * @param stack
     * @constructor
     */
    var ArtboardsIteratorError = function(message, stack) {
        this.name    = "ArtboardsIteratorError";
        this.message = message || "Unknown ArtboardsIteratorError";
        this.stack   = stack || $.stack || null;
    };
    ArtboardsIteratorError.prototype = Error.prototype;


    function getArtboardsIterator() {
        var ArtboardsIterator = false;

        try {
            ArtboardsIterator = new Iterator(artboards);
        }
        catch(e) {
            alert("[1] " + e);
        }

        try {
            if (ArtboardsIterator instanceof Iterator) {
                ArtboardsIterator.next = function() {
                    ArtboardsIterator.index++;
                    artboards.setActiveArtboardIndex(ArtboardsIterator.getIndex());
                    // app.executeMenuCommand('fitall');
                    return ArtboardsIterator.items[ArtboardsIterator.getIndex()];
                }

                ArtboardsIterator.previous = function() {
                    ArtboardsIterator.index--;
                    artboards.setActiveArtboardIndex(ArtboardsIterator.getIndex());
                    // app.executeMenuCommand('fitall');
                    return ArtboardsIterator.items[ArtboardsIterator.getIndex()];
                }

                ArtboardsIterator.current = function() {
                    artboards.setActiveArtboardIndex(ArtboardsIterator.getIndex());
                    // app.executeMenuCommand('fitall');
                    return ArtboardsIterator.items[ArtboardsIterator.index];
                }

                ArtboardsIterator.reset = function() {
                    ArtboardsIterator.index = 0;
                    artboards.setActiveArtboardIndex(ArtboardsIterator.getIndex());
                    // app.executeMenuCommand('fitall');
                    return ArtboardsIterator.getItems();
                }

                ArtboardsIterator.last = function() {
                    ArtboardsIterator.index = ArtboardsIterator.items.length-1;
                    artboards.setActiveArtboardIndex(ArtboardsIterator.getIndex());
                    // app.executeMenuCommand('fitall');
                    return ArtboardsIterator.items[ArtboardsIterator.getIndex()];
                }
            }
        }
        catch(e) {
            throw new ArtboardsIteratorError(e.message);
        }

        return ArtboardsIterator;
    }

    if (logger !== undefined) logger.info('[ArtboardIterator.js] loaded');

    /**
     * Create a textFrame label object.
     * @param theName
     * @param theColor
     * @param thePosition
     * @returns {*}
     * @constructor
     */
    var ArtboardLabel = function(theText, artboard) {

        function Color(red, blue, green) {
            var _color = new RGBColor();
            _color.red = red;
            _color.blue = blue;
            _color.green = green;
            return _color;
        }

        try {
            var doc = app.activeDocument;

            var theLabel = doc.textFrames.add();

            theLabel.contents = theText;

            var charAttributes    = theLabel.textRange.characterAttributes;
            var parAttributes     = theLabel.paragraphs[0].paragraphAttributes;
            var parCharAttributes = theLabel.paragraphs[0].characterAttributes;

            charAttributes.size      = 10;
            charAttributes.fillColor = new Color(0, 0, 0);

            parAttributes.justification = Justification.LEFT;

            theLabel.position = [
                ((artboard.artboardRect[2] - artboard.artboardRect[0]) / 2) - (theLabel.width / 2),
                ((artboard.artboardRect[3] - artboard.artboardRect[1]) / 2) + (theLabel.height / 2)
            ];

            return theLabel;
        }
        catch(e) { logger.error( '[Host.jsx] Label Error', e.message ) }
    }

    /**
     * IconImporter class.
     */

    /**
     * IconImporter class imports icons to artboards.
     * @param meta
     * @constructor
     */
    var IconImporter = function(meta) {

        var doc
            , fileList
            , srcFolder
            , theItem
            , width
            , height
            , items  = []
            , sets   = []
            , groups = []
        ;

        srcFolder = new Folder(meta.folder);

        if ( srcFolder == null ) return;

        meta = ensureTags(meta);

        /*
     * The next line creates a clone of the meta object.
     */
        meta = JSON.parse(JSON.stringify(meta));

        width    = 100;
        height   = 100;
        fileList = [];

        for (var key in meta.items) {
            var item = meta.items[key];

            if (typeof item === 'function') continue;

            width  = Math.max(width, item.width);
            height = Math.max(height, item.height);

            var theFile = new File(item.filepath);

            if (theFile.exists) {

                item.$file = theFile;

                /*
             * Update item width & height from viewBox values.
             */
                var viewBox = getViewBox(item, theFile);

                if (viewBox.length === 4) {
                    width  = Math.max(viewBox[2] - viewBox[0], width);
                    height = Math.max(viewBox[3] - viewBox[1], height);
                }

                logger.info('[width, height] : ' + width + ', ' + height);
            }

            items.push(item);
        }

        logger.info('items', items.length);

        /**
         * Make sure it has AI files in it
         */
        if (items.length > 0) {

            try {
                items.sort(comparator);
            }
            catch (ex) {
                logger.error("Sort files failed")
            }

            /**
             * Set the script to work with artboard rulers
             */
            app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;

            /**
             * Add new multi-page document
             */
            doc = app.documents.add(
                DocumentColorSpace.RGB,
                width,
                height,
                items.length,
                DocumentArtboardLayout.GridByRow,
                parseInt(width / 4),
                Math.round(Math.sqrt(items.length))
            );

            var progress = showProgressBar(items.length);

            /*
         * Add groups layers.
         */
            var sets        = meta.sets,
                groups      = meta.groups,
                setLayers   = {},
                groupLayers = {};

            var idx = 0;

            groups.map(function(group) {
                var groupLayer;

                if (idx === 0) {
                    groupLayer = doc.layers[0];
                }
                else {
                    groupLayer = doc.layers.add();
                }
                groupLayer.name = group.name;

                groupLayers[group.identifier] = groupLayer;

                logger.info('GroupId', group.identifier);

                idx++;
            })

            sets.map(function(set) {
                var sid = set.identifier,
                    gid = set.parent,
                    setLayer,
                    groupLayer;

                if (typeof groupLayers[gid] !== 'undefined') {
                    groupLayer = groupLayers[gid];
                }

                if (groupLayer) {
                    setLayer = groupLayer.layers.add();
                }
                else {
                    setLayer = doc.layers[0];
                }

                setLayer.name = set.name;

                logger.info('SetId', set.identifier);

                setLayers[sid] = setLayer;
            })

            // Add icons
            /**
             * Loop thru the counter
             */
            for (var i = 0; i < items.length; i++) {

                var item  = items[i],
                    $file = typeof item.$file !== 'undefined' ? item.$file : null;

                logger.info('ItemId', item.identifier);

                /**
                 * Set the active artboard rulers based on this
                 */
                doc.artboards.setActiveArtboardIndex(i);
                //app.executeMenuCommand('fitall');

                var boardName = filterName(
                    (! $file ? item : $file).name.replace(/\.svg|\.ai|\.eps|\.pdf/gi, "")
                );

                logger.info("Board name", boardName);

                doc.artboards[i].name = boardName;

                if (! $file) {
                    logger.error('File Not Found', item.name + ' file does not exist');
                    new ArtboardLabel(item.file, doc.artboards[i]);
                    continue;
                }

                // var artboard = doc.artboards[i];

                /**
                 * Create group from SVG
                 */
                try {
                    if ($file.exists) {

                        var itemLayer, setLayer;

                        try {
                            logger.info(stringify(item));

                            if (typeof setLayers[item.parent] !== 'undefined') {
                                setLayer = setLayers[item.parent];
                            }
                            if (setLayer) {
                                itemLayer = setLayer.layers.add();
                            }
                            else {
                                itemLayer = doc.layers.add();
                            }
                        }
                        catch(e) {
                            logger.error('Add Item layer', e.message);
                            itemLayer = doc.layers.add();
                        }

                        itemLayer.name = item.name;

                        theItem = itemLayer.groupItems.createFromFile($file);

                        /**
                         * Move relative to this artboards rulers
                         */
                        try {

                            theItem.position = [0, 0];

                            app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;
                            doc.artboards[i].rulerOrigin = [0,0];

                            theItem.position = [
                                Math.floor((width - theItem.width) / 2),
                                Math.floor((height - theItem.height) / 2) * -1
                            ];

                            alignToNearestPixel(doc.selection);
                            doc.selection = null;

                            redraw();
                        }
                        catch (ex) {
                            try {
                                // theItem.position = [0, 0];
                            } catch (e) { logger.error('Position error : {err}', {err : e}) }
                        }
                    }

                    var ext = "." + trim($file.name.split('.').pop());

                    updateProgress(
                        progress,
                        items.length,
                        _t('Icon {i} of {n} : `{name}`', {
                            i : i,
                            n : items.length,
                            name : boardName + ext
                        })
                    );

                    logger.info(_t('Icon {i} of {n} : `{name}`', {
                        i : i,
                        n : items.length,
                        name : boardName + ext
                    }));

                }
                catch (ex) {
                    logger.error('Import Error', $file.absoluteURI + ' ' + ex.message);
                }
            }

            progress.close();

        }

        /**
         * Update item width & height from viewBox values.
         * @param item
         * @param theFile
         * @returns {*}
         */
        function getViewBox(item, theFile) {

            var code, regex, viewBox, matches;

            viewBox = [0, 0, 256, 256];

            try {
                code = Utils.read_file(theFile.absoluteURI, "utf-8");

                var svg = new XML(code);

                logger.info(
                    '[svg[0].attributes("viewBox"] ' +
                    svg[0].attribute('viewBox').toString()
                );

                viewBox = svg[0].attribute('viewBox').toString();
                viewBox = viewBox.split(' ');
            }
            catch(e) {
                logger.error('[ERROR] ' + e.message);
            }

            return viewBox;
        }

        /**
         * Convert IconJar tags to filename
         * @param {string}      tags  Comma-separated list of tags.
         * @returns {string}
         */
        function tagsToNameSlug(tags) {
            tags = tags.toLowerCase();
            return tags.split(',').join('-').replace(' ','-');
        }

        /**
         * Get the set name from the meta object.
         * @param {object} meta
         * @returns {string}
         */
        function getSetName(meta) {
            for (var key in meta.sets) {
                return (meta.sets[key].name).toLowerCase().replace(' ', '-');
                break;
            }
            return '';
        };

        /**
         * Convert file name to tags.
         * @param {string} fileName The file name to convert to tags.
         * @returns {string}
         */
        function filenameToTags(fileName) {
            return fileName
                .toLowerCase()
                .replace('.svg', '')
                .replace(' ', '-')
                .split('-')
                .join(',');
        };

        /**
         * Ensure all items have tags.
         * @param {object} meta The meta object.
         * @return {object} the updated meta object
         */
        function ensureTags(meta) {
            for (i=0; i<meta.items.length; i++) {
                var item = meta.items[i];
                if (Utils.trim(item.tags) == '') {
                    meta.items[i].tags = filenameToTags(item.file);
                }
            }
            return meta;
        };

        /**
         * Callback for sorting the file list.
         * @param   {File}  a
         * @param   {File}  b
         * @returns {number}
         */
        function comparator(a, b) {
            var nameA = Utils.slugger(a.name.toUpperCase());
            var nameB = Utils.slugger(b.name.toUpperCase());
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            // names must be equal
            return 0;
        }
    }

    if (logger !== undefined) {
        logger.info('host/core/IconImporter.js loaded (' + typeof this.IconImporter + ')');
    }

    /**
     * @constructor
     */
    var Observable = function(){}

    /**
     * Subscribe to internal state changes.
     * @param {string}      name        Event name.
     * @param {Function}    notifier    The notifier function to call.
     */
    Observable.prototype.subscribe = function(name, notifier) {
        try {
            var self = this;
            var isSubscribed = false;

            if (typeof self.notifiers[name] === 'undefined') {
                self.notifiers[name] = [];
            }

            self.notifiers[name].map(function(_notifier) {
                if (_notifier === notifier) isSubscribed = true;
            });

            if (! isSubscribed ) self.notifiers[name].push(notifier);
        }
        catch(e) { logger.error(e); throw e; }
    }

    /**
     * Subscribe to internal state changes.
     * @param {Function} notifier   The notifier function to call.
     */
    Observable.prototype.unsubscribe = function(name, notifier) {
        try {
            var self = this;

            var notifiers = [];

            if (typeof self.notifiers[name] === 'undefined') {
                return;
            }

            self.notifiers[name].map(function(_notifier) {
                if (_notifier === notifier) return;
                notifiers.push(_notifier);
            });

            self.notifiers[name] = notifiers;
        }
        catch(e) { logger.error(e); throw e; }
    }

    /**
     * notifyAll subscribers.
     * @returns null
     */
    Observable.prototype.notifyAll = function() {
        var self = this;
        for (var name in self.notifiers) {
            self.notifiers[name].map(function(notifier) {
                logger.info('IconJarView.notify calling ', notifier);
                notifier.call( self, self );
            });
        }
    }

    /**
     * notifyAll subscribers.
     * @returns null
     */
    Observable.prototype.notify = function(name, data) {
        var self = this;

        var notifiers = self.getNotifiers(name);

        if (typeof notifiers === 'undefined') {
            return;
        }

        notifiers.map(function(notifier) {
            logger.info('IconJarView.notify calling ', name);
            notifier.call( self, data );
        });
    }

    /**
     * Get all notifiers.
     * @returns {*[]}
     */
    Observable.prototype.getNotifiers = function(name) {
        var self = this,
            value = [];

        if (typeof self.notifiers === 'undefined') {
            self.notifiers = [];
        }

        if (name && typeof self.notifiers[name] === 'undefined') {
            self.notifiers[name] = [];
        }

        return name ? self.notifiers[name] : self.notifiers;
    }

    /**
     * Delete all notifiers.
     * @returns {*[]}
     */
    Observable.prototype.clearNotifiers = function(name) {
        if (name === undefined) {
            self.notifiers = [];
        }
        else {
            self.notifiers[name] = [];
        }
        return self.notifiers;
    }

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

    var kPAGE_SECTIONS = {
        SEARCH_FIELD       : 'search-field-block',
        LEFT_SIDEBAR       : 'left-sidebar',
        MAIN_CONTENT       : 'main-content',
        SECONDARY_CONTROLS : 'secondary-controls',
        APP                : 'app',
        ICONJARS_SELECTOR  : 'iconjars-selector',
        ICONSETS_SELECTOR  : 'iconsets-selector'
    }

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
        GET_ICONJAR : 'https://geticonjar.com/',
        GET_SUPPORT : 'https://atomiclotus.net/contact',
        ICONJAR_EXT : 'https://atomiclotus.net/IconJar-for-Ai',
        BUY_ICONS   : 'https://roundicons.com/?ref=VECTORICONS20'
    }

    /**
     * Key constants.
     * @type {string}
     */
// var kCURRENT_SET           = 'current-set',
//     kSOURCE_KEY            = 'source',
//     kCURRENT_ICONJAR       = 'current-iconjar',
//     kCURRENT_META_FILE     = 'current-meta-file',
//     kCURRENT_ITEM          = 'current-item',
//     kUTF_8                 = 'utf-8',
//     kSRC_ATTR              = 'source-file',
//     kGUID                  = 'data-guid',
//     kPLACEHOLDER_IMG       = './theme/img/placeholder.png',
//     kPLACEHOLDER_CLASS     = 'placeholder',
//     kLAZY_CLASS            = 'lazy',
//     kENTER_KEYCODE         = 13,
//     kDEFAULT_WIDTH         = 64,
//     kDEFAULT_HEIGHT        = 64,
//     kSETS_SELECTOR_SIZE    = 5;
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
        kDEFAULT_WIDTH         = 64,
        kDEFAULT_HEIGHT        = 64,
        kSETS_SELECTOR_SIZE    = 5,
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

        return _os.toLowerCase() === 'darwin' ? Platforms.MAC : Platforms.WIN;
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
                logger.error('[shared.js] UserDataFolder error : ' + e);
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
     * Add variables to global scope.
     */
// ;(function(global) {
//
//     // Object constants
//
//     global.Actions                = Actions;
//     global.ImageTypes             = ImageTypes;
//     global.IconContextActions     = IconContextActions;
//     global.DatabaseKeys           = DatabaseKeys;
//     global.IconProperties         = IconProperties;
//     global.Contexts               = Contexts;
//     global.Platforms              = Platforms;
//     global.FileTypes              = FileTypes;
//     global.Events                 = Events;
//     global.UserCancelledError     = UserCancelledError;
//     global.NotYetImplementedError = NotYetImplementedError;
//
//     // String constants
//
//     global.kCURRENT_ITEM          = kCURRENT_ITEM;
//     global.kSOURCE_KEY            = kSOURCE_KEY;
//     global.kCURRENT_SET           = kCURRENT_SET;
//     global.kCURRENT_ICONJAR       = kCURRENT_ICONJAR;
//     global.kCURRENT_META_FILE     = kCURRENT_META_FILE;
//     global.kUTF_8                 = kUTF_8;
//     global.kSRC_ATTR              = kSRC_ATTR;
//     global.kGUID                  = kGUID;
//     global.kDATA_GUID             = kDATA_GUID;
//     global.kDATA_NAME             = kDATA_NAME;
//     global.kDATA_TAGS             = kDATA_TAGS;
//     global.kDATA_SRC              = kDATA_SRC;
//     global.kPLACEHOLDER_IMG       = kPLACEHOLDER_IMG;
//     global.kPLACEHOLDER_CLASS     = kPLACEHOLDER_CLASS;
//     global.kLAZY_CLASS            = kLAZY_CLASS;
//     global.kENTER_KEYCODE         = kENTER_KEYCODE;
//     global.kDEFAULT_WIDTH         = kDEFAULT_WIDTH;
//     global.kDEFAULT_HEIGHT        = kDEFAULT_HEIGHT;
//     global.kSETS_SELECTOR_SIZE    = kSETS_SELECTOR_SIZE;
//     global.kDATE_FORMAT           = kDATE_FORMAT;
//
//     global.kPAGE_SECTIONS         = kPAGE_SECTIONS;
//
//     // Derived paths
//
//     global.extensionPath          = extensionPath;
//     global.userDataFolder         = userDataFolder;
//     global.OS                     = OS;
//     global.isMac                  = OS === Platforms.MAC;
//     global.isWindows              = OS === Platforms.WIN;
//
//     global.kURLS                  = kURLS;
//
//     global.kNOOP                  = kNOOP;
//     global.kEXT_PATH              = extensionPath;
//
//     if (typeof window !== 'undefined') {
//         window.global = global;
//     }
//
// })(
//     typeof global === 'undefined'
//         ? ( typeof window === 'undefined' ? this : window )
//         : global
// );

    /**
     * Load plugPlugLib.
     */
    try {
        plugPlugLib = new ExternalObject("lib:" + "PlugPlugExternalObject");
    }
    catch (e) {
        logger.error('[PlugPlugExternalObject]', e.message);
    }
    /*!
 * is.js 0.8.0
 * Author: Aras Atasaygin
 */
    (function(n,t){if(typeof define==="function"&&define.amd){define(function(){return n.is=t()})}else if(typeof exports==="object"){module.exports=t()}else{n.is=t()}})(this,function(){var n={};n.VERSION="0.8.0";n.not={};n.all={};n.any={};var t=Object.prototype.toString;var e=Array.prototype.slice;var r=Object.prototype.hasOwnProperty;function a(n){return function(){return!n.apply(null,e.call(arguments))}}function u(n){return function(){var t=c(arguments);var e=t.length;for(var r=0;r<e;r++){if(!n.call(null,t[r])){return false}}return true}}function o(n){return function(){var t=c(arguments);var e=t.length;for(var r=0;r<e;r++){if(n.call(null,t[r])){return true}}return false}}var i={"<":function(n,t){return n<t},"<=":function(n,t){return n<=t},">":function(n,t){return n>t},">=":function(n,t){return n>=t}};function f(n,t){var e=t+"";var r=+(e.match(/\d+/)||NaN);var a=e.match(/^[<>]=?|/)[0];return i[a]?i[a](n,r):n==r||r!==r}function c(t){var r=e.call(t);var a=r.length;if(a===1&&n.array(r[0])){r=r[0]}return r}n.arguments=function(n){return t.call(n)==="[object Arguments]"||n!=null&&typeof n==="object"&&"callee"in n};n.array=Array.isArray||function(n){return t.call(n)==="[object Array]"};n.boolean=function(n){return n===true||n===false||t.call(n)==="[object Boolean]"};n.char=function(t){return n.string(t)&&t.length===1};n.date=function(n){return t.call(n)==="[object Date]"};n.domNode=function(t){return n.object(t)&&t.nodeType>0};n.error=function(n){return t.call(n)==="[object Error]"};n["function"]=function(n){return t.call(n)==="[object Function]"||typeof n==="function"};n.json=function(n){return t.call(n)==="[object Object]"};n.nan=function(n){return n!==n};n["null"]=function(n){return n===null};n.number=function(e){return n.not.nan(e)&&t.call(e)==="[object Number]"};n.object=function(n){return Object(n)===n};n.regexp=function(n){return t.call(n)==="[object RegExp]"};n.sameType=function(e,r){var a=t.call(e);if(a!==t.call(r)){return false}if(a==="[object Number]"){return!n.any.nan(e,r)||n.all.nan(e,r)}return true};n.sameType.api=["not"];n.string=function(n){return t.call(n)==="[object String]"};n.undefined=function(n){return n===void 0};n.windowObject=function(n){return n!=null&&typeof n==="object"&&"setInterval"in n};n.empty=function(t){if(n.object(t)){var e=Object.getOwnPropertyNames(t).length;if(e===0||e===1&&n.array(t)||e===2&&n.arguments(t)){return true}return false}return t===""};n.existy=function(n){return n!=null};n.falsy=function(n){return!n};n.truthy=a(n.falsy);n.above=function(t,e){return n.all.number(t,e)&&t>e};n.above.api=["not"];n.decimal=function(t){return n.number(t)&&t%1!==0};n.equal=function(t,e){if(n.all.number(t,e)){return t===e&&1/t===1/e}if(n.all.string(t,e)||n.all.regexp(t,e)){return""+t===""+e}if(n.all.boolean(t,e)){return t===e}return false};n.equal.api=["not"];n.even=function(t){return n.number(t)&&t%2===0};n.finite=isFinite||function(t){return n.not.infinite(t)&&n.not.nan(t)};n.infinite=function(n){return n===Infinity||n===-Infinity};n.integer=function(t){return n.number(t)&&t%1===0};n.negative=function(t){return n.number(t)&&t<0};n.odd=function(t){return n.number(t)&&t%2===1};n.positive=function(t){return n.number(t)&&t>0};n.under=function(t,e){return n.all.number(t,e)&&t<e};n.under.api=["not"];n.within=function(t,e,r){return n.all.number(t,e,r)&&t>e&&t<r};n.within.api=["not"];var l={affirmative:/^(?:1|t(?:rue)?|y(?:es)?|ok(?:ay)?)$/,alphaNumeric:/^[A-Za-z0-9]+$/,caPostalCode:/^(?!.*[DFIOQU])[A-VXY][0-9][A-Z]\s?[0-9][A-Z][0-9]$/,creditCard:/^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/,dateString:/^(1[0-2]|0?[1-9])([\/-])(3[01]|[12][0-9]|0?[1-9])(?:\2)(?:[0-9]{2})?[0-9]{2}$/,email:/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,eppPhone:/^\+[0-9]{1,3}\.[0-9]{4,14}(?:x.+)?$/,hexadecimal:/^(?:0x)?[0-9a-fA-F]+$/,hexColor:/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,ipv4:/^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/,ipv6:/^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i,nanpPhone:/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,socialSecurityNumber:/^(?!000|666)[0-8][0-9]{2}-?(?!00)[0-9]{2}-?(?!0000)[0-9]{4}$/,timeString:/^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/,ukPostCode:/^[A-Z]{1,2}[0-9RCHNQ][0-9A-Z]?\s?[0-9][ABD-HJLNP-UW-Z]{2}$|^[A-Z]{2}-?[0-9]{4}$/,url:/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i,usZipCode:/^[0-9]{5}(?:-[0-9]{4})?$/};function d(t,e){n[t]=function(n){return e[t].test(n)}}for(var s in l){if(l.hasOwnProperty(s)){d(s,l)}}n.ip=function(t){return n.ipv4(t)||n.ipv6(t)};n.capitalized=function(t){if(n.not.string(t)){return false}var e=t.split(" ");for(var r=0;r<e.length;r++){var a=e[r];if(a.length){var u=a.charAt(0);if(u!==u.toUpperCase()){return false}}}return true};n.endWith=function(t,e){if(n.not.string(t)){return false}e+="";var r=t.length-e.length;return r>=0&&t.indexOf(e,r)===r};n.endWith.api=["not"];n.include=function(n,t){return n.indexOf(t)>-1};n.include.api=["not"];n.lowerCase=function(t){return n.string(t)&&t===t.toLowerCase()};n.palindrome=function(t){if(n.not.string(t)){return false}t=t.replace(/[^a-zA-Z0-9]+/g,"").toLowerCase();var e=t.length-1;for(var r=0,a=Math.floor(e/2);r<=a;r++){if(t.charAt(r)!==t.charAt(e-r)){return false}}return true};n.space=function(t){if(n.not.char(t)){return false}var e=t.charCodeAt(0);return e>8&&e<14||e===32};n.startWith=function(t,e){return n.string(t)&&t.indexOf(e)===0};n.startWith.api=["not"];n.upperCase=function(t){return n.string(t)&&t===t.toUpperCase()};var F=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];var p=["january","february","march","april","may","june","july","august","september","october","november","december"];n.day=function(t,e){return n.date(t)&&e.toLowerCase()===F[t.getDay()]};n.day.api=["not"];n.dayLightSavingTime=function(n){var t=new Date(n.getFullYear(),0,1);var e=new Date(n.getFullYear(),6,1);var r=Math.max(t.getTimezoneOffset(),e.getTimezoneOffset());return n.getTimezoneOffset()<r};n.future=function(t){var e=new Date;return n.date(t)&&t.getTime()>e.getTime()};n.inDateRange=function(t,e,r){if(n.not.date(t)||n.not.date(e)||n.not.date(r)){return false}var a=t.getTime();return a>e.getTime()&&a<r.getTime()};n.inDateRange.api=["not"];n.inLastMonth=function(t){return n.inDateRange(t,new Date((new Date).setMonth((new Date).getMonth()-1)),new Date)};n.inLastWeek=function(t){return n.inDateRange(t,new Date((new Date).setDate((new Date).getDate()-7)),new Date)};n.inLastYear=function(t){return n.inDateRange(t,new Date((new Date).setFullYear((new Date).getFullYear()-1)),new Date)};n.inNextMonth=function(t){return n.inDateRange(t,new Date,new Date((new Date).setMonth((new Date).getMonth()+1)))};n.inNextWeek=function(t){return n.inDateRange(t,new Date,new Date((new Date).setDate((new Date).getDate()+7)))};n.inNextYear=function(t){return n.inDateRange(t,new Date,new Date((new Date).setFullYear((new Date).getFullYear()+1)))};n.leapYear=function(t){return n.number(t)&&(t%4===0&&t%100!==0||t%400===0)};n.month=function(t,e){return n.date(t)&&e.toLowerCase()===p[t.getMonth()]};n.month.api=["not"];n.past=function(t){var e=new Date;return n.date(t)&&t.getTime()<e.getTime()};n.quarterOfYear=function(t,e){return n.date(t)&&n.number(e)&&e===Math.floor((t.getMonth()+3)/3)};n.quarterOfYear.api=["not"];n.today=function(t){var e=new Date;var r=e.toDateString();return n.date(t)&&t.toDateString()===r};n.tomorrow=function(t){var e=new Date;var r=new Date(e.setDate(e.getDate()+1)).toDateString();return n.date(t)&&t.toDateString()===r};n.weekend=function(t){return n.date(t)&&(t.getDay()===6||t.getDay()===0)};n.weekday=a(n.weekend);n.year=function(t,e){return n.date(t)&&n.number(e)&&e===t.getFullYear()};n.year.api=["not"];n.yesterday=function(t){var e=new Date;var r=new Date(e.setDate(e.getDate()-1)).toDateString();return n.date(t)&&t.toDateString()===r};var D=n.windowObject(typeof global=="object"&&global)&&global;var h=n.windowObject(typeof self=="object"&&self)&&self;var v=n.windowObject(typeof this=="object"&&this)&&this;var b=D||h||v||Function("return this")();var g=h&&h.document;var m=b.is;var w=h&&h.navigator;var y=(w&&w.appVersion||"").toLowerCase();var x=(w&&w.userAgent||"").toLowerCase();var A=(w&&w.vendor||"").toLowerCase();n.android=function(){return/android/.test(x)};n.android.api=["not"];n.androidPhone=function(){return/android/.test(x)&&/mobile/.test(x)};n.androidPhone.api=["not"];n.androidTablet=function(){return/android/.test(x)&&!/mobile/.test(x)};n.androidTablet.api=["not"];n.blackberry=function(){return/blackberry/.test(x)||/bb10/.test(x)};n.blackberry.api=["not"];n.chrome=function(n){var t=/google inc/.test(A)?x.match(/(?:chrome|crios)\/(\d+)/):null;return t!==null&&f(t[1],n)};n.chrome.api=["not"];n.desktop=function(){return n.not.mobile()&&n.not.tablet()};n.desktop.api=["not"];n.edge=function(n){var t=x.match(/edge\/(\d+)/);return t!==null&&f(t[1],n)};n.edge.api=["not"];n.firefox=function(n){var t=x.match(/(?:firefox|fxios)\/(\d+)/);return t!==null&&f(t[1],n)};n.firefox.api=["not"];n.ie=function(n){var t=x.match(/(?:msie |trident.+?; rv:)(\d+)/);return t!==null&&f(t[1],n)};n.ie.api=["not"];n.ios=function(){return n.iphone()||n.ipad()||n.ipod()};n.ios.api=["not"];n.ipad=function(n){var t=x.match(/ipad.+?os (\d+)/);return t!==null&&f(t[1],n)};n.ipad.api=["not"];n.iphone=function(n){var t=x.match(/iphone(?:.+?os (\d+))?/);return t!==null&&f(t[1]||1,n)};n.iphone.api=["not"];n.ipod=function(n){var t=x.match(/ipod.+?os (\d+)/);return t!==null&&f(t[1],n)};n.ipod.api=["not"];n.linux=function(){return/linux/.test(y)};n.linux.api=["not"];n.mac=function(){return/mac/.test(y)};n.mac.api=["not"];n.mobile=function(){return n.iphone()||n.ipod()||n.androidPhone()||n.blackberry()||n.windowsPhone()};n.mobile.api=["not"];n.offline=a(n.online);n.offline.api=["not"];n.online=function(){return!w||w.onLine===true};n.online.api=["not"];n.opera=function(n){var t=x.match(/(?:^opera.+?version|opr)\/(\d+)/);return t!==null&&f(t[1],n)};n.opera.api=["not"];n.phantom=function(n){var t=x.match(/phantomjs\/(\d+)/);return t!==null&&f(t[1],n)};n.phantom.api=["not"];n.safari=function(n){var t=x.match(/version\/(\d+).+?safari/);return t!==null&&f(t[1],n)};n.safari.api=["not"];n.tablet=function(){return n.ipad()||n.androidTablet()||n.windowsTablet()};n.tablet.api=["not"];n.touchDevice=function(){return!!g&&("ontouchstart"in h||"DocumentTouch"in h&&g instanceof DocumentTouch)};n.touchDevice.api=["not"];n.windows=function(){return/win/.test(y)};n.windows.api=["not"];n.windowsPhone=function(){return n.windows()&&/phone/.test(x)};n.windowsPhone.api=["not"];n.windowsTablet=function(){return n.windows()&&n.not.windowsPhone()&&/touch/.test(x)};n.windowsTablet.api=["not"];n.propertyCount=function(t,e){if(n.not.object(t)||n.not.number(e)){return false}var a=0;for(var u in t){if(r.call(t,u)&&++a>e){return false}}return a===e};n.propertyCount.api=["not"];n.propertyDefined=function(t,e){return n.object(t)&&n.string(e)&&e in t};n.propertyDefined.api=["not"];n.inArray=function(t,e){if(n.not.array(e)){return false}for(var r=0;r<e.length;r++){if(e[r]===t){return true}}return false};n.inArray.api=["not"];n.sorted=function(t,e){if(n.not.array(t)){return false}var r=i[e]||i[">="];for(var a=1;a<t.length;a++){if(!r(t[a],t[a-1])){return false}}return true};function j(){var t=n;for(var e in t){if(r.call(t,e)&&n["function"](t[e])){var i=t[e].api||["not","all","any"];for(var f=0;f<i.length;f++){if(i[f]==="not"){n.not[e]=a(n[e])}if(i[f]==="all"){n.all[e]=u(n[e])}if(i[f]==="any"){n.any[e]=o(n[e])}}}}}j();n.setNamespace=function(){b.is=m;return this};n.setRegexp=function(n,t){for(var e in l){if(r.call(l,e)&&t===e){l[e]=n}}};return n});
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

// var Host = null
//     , extensionsPath = ''
//     , module         = { exports : null }
//     , kUSER_NAME     = null
//     , pathsep        = null
//     , Config         = null
//     , debug          = function(){}
//     , logger         = undefined
//     ;

    /**
     * Declare the target app.
     */

// #include "polyfills.js";        // alert('1/12 - polyfills : ' + typeof polyfills);
// #include "JSON.jsx";            // alert('3/12 - JSON : ' + typeof JSON);
// #include "Utils.jsx";           // alert('4/12 - Utils : ' + typeof Utils);
// #include "Logger.jsx";          // alert('2/12 - Logger : ' + typeof Logger);
// #include "core/Helpers.js";     // alert('5/12 - Helpers : ' + typeof Helpers);
// #include "core/functions.js";   // alert('6/12 - functions : ' + typeof FieldTypes);
// #include "Configuration.jsx";   // alert('7/12 - Configuration : ' + typeof Configuration);
// #include "HostResponse.js";     // alert('8/12 - HostResponse : ' + typeof HostResponse);
// #include "core/Strings.js";     // alert('9/12 - Strings : ' + typeof Strings);
// #include "core/FileList.js";    // alert('10/12 - FileList : ' + typeof FileList);
// #include "core/Exporter.js";    // alert('11/12 - Exporter : ' + typeof Exporter);
// #include "core/Import.js";      // alert('12/12 - Import : ' + typeof Import);
//
// #include 'core/Iterator.js'
// #include 'core/ArtboardsIterator.js'
// #include 'core/ArtboardLabel.js'
// #include 'core/FileList.js'
// #include 'core/IconImporter.js'
// #include 'core/Observable.js'
//
// #include 'core/shared.js'
// #include 'core/PlugPlugExternalObject.js'
// #include '../node_modules/is_js/is.min.js'

// alert('Imports loaded');

    /**
     * Determine the current user name.
     */

    try {
        pathsep = '/'; // $.os.indexOf('mac') === -1 ? '\\' : '/';
        kUSER_NAME = Folder.myDocuments.fsName.split(pathsep)[2];
    }
    catch(e) {
        // throw new Error(e);
        alert(e);
    }

// alert('kUSER_NAME : ' + kUSER_NAME)

    /**
     * @type {{
     *      APP_NAME: string,
     *     USER: *,
     *     HOME: *,
     *     DOCUMENTS: *
     * }}
     */
    try {
        Config = Configuration({
            APP_NAME  : 'cep-iconjar-for-ai',
            USER      : kUSER_NAME,
            HOME      : '~/',
            DOCUMENTS : Folder.myDocuments,
            LOGFOLDER : '/Users/scott/Library/Application Support/com.atomic/cep-iconjar-for-ai/logs' // Folder.myDocuments + '/cep-iconjar-for-ai/logs'
        });
    }
    catch(e) { alert(e) }

// alert('Config : ' + typeof Config )

    /**
     * The local scope logger object.
     * @type {Logger}
     */
    try {
        logger = Logger(Config.get('APP_NAME'), Config.get('LOGFOLDER'));
    }
    catch(e) { alert('new Logger() error', e) }

    debug = logger.info;

    logger.info('[Host.jsx]', 'Testing', '...');

// alert(typeof debug);

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

    logger.info('[Host.jsx]', 'HostController setExtensionPath defined');

    HostController.prototype.getExtensionPath = function() {
        return this.extensionPath;
    }

    logger.info('[Host.jsx]', 'HostController getExtensionPath defined');

    HostController.prototype.loadPlugins = function(path) {

        var config,
            plugins;

        // if (typeof path === 'string') {
        //     path = path.replace(/(\s+)/g, '\\$1');
        // }

        logger.info('[Host.jsx]', 'Start Host.loadPlugins');
        logger.info('[Host.jsx]', [path, 'plugins.json'].join('/'));

        logger.info('[Host.jsx]', '[setExtensionPath] ' + stringify(path));
        logger.info('[Host.jsx]', 'typeof HostResponse : ' + typeof HostResponse);
        logger.info('[Host.jsx]', path.split('/').slice(0, -1).join('/') );

        this.setExtensionPath(path.split('/').slice(0, -1).join('/'));

        try {

            logger.info('[Host.jsx] file exists', new File([path, 'plugins.json'].join('/')).exists )

            config = Utils.read_file([path, 'plugins.json'].join('/'));

            logger.info('[Host.jsx] content', config)

            if (typeof config === 'string') {
                config = JSON.parse(config);
            }

            if (typeof config === 'object' && typeof config.plugins !== 'undefined') {

                plugins = config.plugins;

                logger.info('[Host.jsx]', 'Host.loadPlugins : ' + stringify(plugins));
                logger.info('[Host.jsx]', 'Loading ' + plugins.length + ' plugins');

                plugins.forEach(function(plugin, i) {
                    if (typeof plugin !== 'object') {
                        logger.info('[Host.jsx]', 'Plugin is not an object');
                        return;
                    }
                    logger.info('[Host.jsx]', 'Checking plugin (' + (i + 1) + ' of ' + plugins.length + ') : ' + plugin.name );

                    var isDisabled = isTrue(plugin.disabled);

                    logger.info('[Host.jsx]', 'Is ' + plugin.name + ' disabled? ' + (isDisabled ? 'Yes, skipping' : 'No, continuing'));

                    if (isDisabled) return;

                    var join_path = function(segments) {
                        return segments.join('/');
                    }

                    for (var x = 0; x < plugin.host.length; x++) {
                        var fileName = plugin.host[x];
                        try {
                            var pluginPath = join_path([path, plugin.name, fileName]);
                            var pluginFile = new File(pluginPath);
                            logger.info('[Host.jsx]', 'Host.loadPlugins pluginPath ' + pluginPath);
                            logger.info('[Host.jsx]', 'Host.loadPlugins pluginFile.exists ' + pluginFile.exists);
                            $.evalFile(pluginFile)
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

    logger.info('[Host.jsx]', 'HostController loadPlugins defined');

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
        this.logger.info('[Host.jsx] Added method ' + name + ' to Host prototype');
        // Instance.prototype[name] = function() {
        //     return _function.call(Instance, arguments);
        // };
        HostController.prototype[name] = _function;
    }

    logger.info('[Host.jsx]', 'HostController fn defined');

    /**
     * To be called from Client to create the Host instance.
     * @returns {string}
     */
    function createHostInstance() {
        logger.info('[Host.jsx]', 'createHostInstance called');
        try {
            Host = new HostController(Config, logger);
            if (typeof Host === 'object') {
                var response = new HostResponse('[Host.jsx] Host instance was created').stringify();
                logger.info('[Host.jsx]', response);
                return response;
            }
        }
        catch(e) {
            logger.info('[Host.jsx]', 'createHostInstance error : ' + e);
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

    logger.info('[Host.jsx]', 'csxLogger defined');

    logger.info('[Host.jsx]', 'Host file finished loading');

}
catch(e) {alert(e)}

// $.evalFile('/Library/Application Support/Adobe/CEP/extensions/cep-iconjar-for-ai.dev/host/Host.jsx');
