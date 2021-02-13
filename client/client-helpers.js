const ReactDOM = require('react-dom');
console.log('client-helpers.js loaded');

(function(global) {
    
    global.ClientHelpers = true;

    const $is     = require('is_js')
        , $path   = require('path')
        , fs      = require('fs')
        , uuidv4  = require('uuid').v4
        , Icon    = require('../custom/iconjar/classes/entities/Icon.js')
        , IconSet = require('../custom/iconjar/classes/entities/IconSet.js')

    /**
     * @deprecated
     * Converts a string, array, or object to dash-separated string.
     * @param   {string|array|object}   subject    A string, array, or object to convert to a slug.
     * @returns {string}                           The cleaned up name.
     */
    function slugger(subject) {
        return slugify(subject);
    }

    global.slugger = slugger;

    /**
     * Splits a string on special characters and converts into tags.
     * @param   {string}    str     The tokenized string to convert to tags.
     * @returns {[]}
     */
    function tagify(str) {

        var clean = [],  _tagsConfig,  delimiters,
            pattern,     separator,    concatenator,
            minlength,   maxlength;

        try {
            _tagsConfig = get(global, 'tagsConfig', {});

            minlength    = get(_tagsConfig, 'minlength', 3);
            maxlength    = get(_tagsConfig, 'maxlength', 64);
            delimiters   = get(
                _tagsConfig,
                'delimiters',
                [" ", "@", "--", "-", "$", "!", ".", ",", "{", "}", "[", "]", "_"]
            );
            separator    = get(_tagsConfig, 'separator', '-');
            concatenator = get(_tagsConfig, 'concatenator', '~');

            if (delimiters = get(_tagsConfig, 'delimiters', delimiters)) {
                pattern = delimiters.join('|')
                    .replace(new RegExp(/\$/g), "\\$")
                    .replace(new RegExp(/\./g), "\\.")
                    .replace(new RegExp(/\{/g), "\\{")
                    .replace(new RegExp(/\}/g), "\\}")
                    .replace(new RegExp(/\[/g), "\\[")
                    .replace(new RegExp(/\]/g), "\\]");
                pattern = new RegExp(pattern, 'ig');
            }

            // RegExp = /\.|_|\s|@|\$|--/g

            var tags = str
                .toLowerCase()
                .replace(pattern, separator)
                .split(separator);


            tags.forEach(function(tag) {
                if ($is.empty(tag))    return;
                if (! $is.string(tag)) return;
                if ($is.number(tag))   return;
                if (tag.length < minlength) return;
                if (tag.length > maxlength) return;
                clean.push(
                    tag.trim().split(concatenator).join(' ')
                );
            });
        }
        catch(e) { console.error(e) }
        return clean.join(' ,');
    }

    global.tagify = tagify;

    /**
     * Returns comma-delimited string of tags from file name.
     * @param fileName
     * @returns {string}
     */
    function tagsFromFileName(fileName) {
        return tagify(
            $path.basename(fileName).replace('.' + getFileExtension(fileName), '')
        );
    }

    global.tagsFromFileName = tagsFromFileName;

    /**
     * gets SVG dimensions from XMLDOM.
     * @param svgNode
     * @returns {{width: (*|string), height: (*|string)}}
     */
    function getSvgDimensions(svgNode) {
        var viewBox = svgNode.getAttribute('viewBox'),
            width   = svgNode.getAttribute('width'),
            height  = svgNode.getAttribute('height');

        if ($is.empty(width) || $is.empty(height)) {
            var points = viewBox.split(' ');
            width  = points[2];
            height = points[3];
        }
        return {width : width, height : height}
    }

    global.getSvgDimensions = getSvgDimensions;

    /**
     * Creates an Icon Meta object from a file path.
     * @param file
     * @returns {{date: *, identifier: string, licence: *, parent: *, file: string, name: string, width: *, unicode: string, type: *, tags: *, height: *}}
     */
    function iconMetaFromFile(file, data) {

        var fileName, baseName,
            svgDoc,   svgNode,   svgDims,
            width,    height;

        fileName = $path.basename(file);
        baseName = fileName.split('.', 0, -1).join('.');

        svgDoc = new DOMParser().parseFromString(
            fs.readFileSync(file, kUTF_8),
            "text/xml"
        );

        svgNode = svgDoc.getElementsByTagName('svg')[0];
        svgDims = getSvgDimensions(svgNode);

        width   = get(svgDims, 'width', kDEFAULT_WIDTH);
        width   = isNaN(width)  ? 0 : width;

        height  = get(svgDims, 'height', kDEFAULT_HEIGHT);
        height  = isNaN(height) ? 0 : height;

        return {
            "identifier" : generateUUID().toUpperCase(),
            "name"       : ucWords($path.basename(fileName).replace(".svg", "").split('-').join(' ')),
            "licence"    : get(data, 'licence'),
            "tags"       : tagsFromFileName(fileName),
            "file"       : fileName,
            "date"       : getFormattedDate(new Date(), true),
            "width"      : width,
            "height"     : height,
            "parent"     : get(data, 'parent'),
            "type"       : get(data, 'type'),
            "unicode"    : ""
        };
    }

    global.iconMetaFromFile = iconMetaFromFile;

    /**
     * Create Meta data for icon files from folder of icons.
     * @param source
     * @returns {[]}
     */
    function metaObjectFromIconsFolder(source) {
        return metaObjectFromIconsList(source, listFiles(source, 'svg'));
    }

    global.metaObjectFromIconsFolder = metaObjectFromIconsFolder;

    /**
     * Create Meta data for icon files from folder of icons.
     * @param source
     * @returns {[]}
     */
    function metaObjectFromIconsList(source, icons) {

        const items  = [];

        let parent = {
            "date"       : getFormattedDate(new Date(), true),
            "licence"    : "",
            "name"       : "Default Set",
            "sort"       : 1,
            "identifier" : uuidv4().toUpperCase()
        }

        const sets = {},
              parents = [];

        icons.forEach((icon, i) => {
            let dirKey = smush($path.dirname(icon));

            log('client-helpers', 'dirKey', dirKey);

            if (typeof sets[dirKey] === 'undefined') {
                let n = String(parents.length + 10001).slice(-3);
                sets[dirKey] = {
                    "date"       : getFormattedDate(new Date(), true),
                    "licence"    : "",
                    "name"       : `Set ${n}`,
                    "sort"       : 1,
                    "identifier" : uuidv4().toUpperCase()
                };
                parent = sets[dirKey];
                parents.push(parent);
            }
            else {
                parent = sets[dirKey];
            }

            log('client-helpers', 'parents', parents);
            log('client-helpers', 'sets', sets);

            item = iconMetaFromFile(
                $path.join(source, $path.basename(icon)),
                {parent : parent.identifier}
            );
            items.push(item);
        });

        parents.sort();

        return {
            identifier : uuidv4(),
            source     : abspath(source),
            name       : $path.basename(source),
            sets       : parents,
            items      : items,
            groups     : []
        };
    }

    global.metaObjectFromIconsList = metaObjectFromIconsList;

    /**
     * Remove spaces and make string lowercase.
     * @param {*} text 
     */
    function smush(text) {
        return text.replace(/\s/g, '').toLowerCase();
    }

    global.smush = smush;

    /**
     * Makes a delimited slug human-readable.
     * @param subject
     * @returns {*}
     */
    function humanize(subject, delim) {
        var _delim = delim;
        if (delim instanceof Array) {
            _delim = new RegExp(delim.join('|'));
        }
        return subject.split(_delim).map(function(word) {
            return ucWords(word);
        }).join(' ');
    }

    global.humanize = humanize;

    /**
     * Get a unique universal identifier.
     * RFC4122 version 4 compliant.
     * @returns {string}
     */
    function generateUUID() {
        var d = new Date().getTime();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    global.generateUUID = generateUUID;

    /**
     * Get a unique universal identifier.
     * RFC4122 version 4 compliant.
     * @returns {string}
     */
    function shortUUID() {
        return generateUUID().split('-').shift();
    }

    global.shortUUID = shortUUID;

    /**
     * Returns a random integer between min (inclusive) and max (inclusive).
     * The value is no lower than min (or the next integer greater than min
     * if min isn't an integer) and no greater than max (or the next integer
     * lower than max if max isn't an integer).
     * Using Math.round() will give you a non-uniform distribution!
     */
    function getRandomInt(min, max, omit) {

        var x, num;

        if (typeof(omit) == 'number')    omit = [omit];
        if (typeof(omit) == 'undefined') omit = [];
        min = Math.ceil(min);
        max = Math.floor(max);
        num = Math.floor(Math.random() * (max - min + 1)) + min;
        x = 0;
        while (omit.indexOf(num) != -1 && x <= 9999) {
            x++;
            num = Math.floor(Math.random() * (max - min + 1)) + min;
        }
        return num;
    }

    global.getRandomInt = getRandomInt;

    /**
     * Add leading zeros to a number.
     * @param {integer} value
     * @param {integer} width
     * @returns {string}
     */
    function padNumber(value, width) {
        return ( value + 100000 ).toString().slice( width * -1 );
    }

    global.padNumber = padNumber;

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
     * Shortcut for JSON.parse
     * @param what
     * @returns {any}
     */
    function parse(what) {
        return JSON.parse(what);
    }

    global.parse = parse;

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
     * Creates a file system safe filename.
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
     * Capitalize only the first letter of each word in a string.
     * @param str
     * @returns {string}
     */
    function ucWords(str) {
        return str.toLowerCase().replace(/\b[a-z]/g, function(letter) {
            return letter.toUpperCase();
        });
    }

    global.ucWords = ucWords;

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

    global.array_unique = array_unique;

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
        }
        return roundArray(num, decimals);
    }

    global.round = round;

    /**
     * Replace tokens in a string with key => value paired vars.
     * @param theText
     * @param theVars
     * @returns {*}
     * @private
     */
    function theme(theText, theVars) {
        for (var token in theVars) {
            theText = theText.replace(
                new RegExp("{" + token + "}","g"),
                theVars[token]
            );
        }
        return theText;
    }

    global.theme = theme;

    /**
     * Get an extension object. Defaults to current extension.
     * @param extensionId
     * @returns {*}
     */
    function getExtension( extensionId ) {
        var extension,
            extensions;

        if (typeof(extensionId) == 'undefined') {
            extensionId = window.csInterface.getExtensionId();
        }

        extensions = window.csInterface.getExtensions( [extensionId] );

        if ( extensions.length == 1 ) {

            extension = extensions[0];
            var extPath = window.csInterface.getSystemPath(SystemPath.EXTENSION);
            extension.basePath = slash( extension.basePath );

            if (get(extension, 'basePath', false)) {

                extension.customPath = extension.basePath + 'custom';

                // xmlString   = readFileData(toPath(extension.basePath, 'CSXS/manifest.xml'));
                // theManifest = $.parseXML(xmlString);
                // var $ext    = $('Extension[Id="' + extension.id + '"]', theManifest).eq(0);
                //
                // extension.version = $ext.attr('Version');
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

    global.getExtension = getExtension;

    /**
     * Expand relative Mac path to full path.
     * @param path
     * @returns {*}
     */
    const abspath = (path) => {
        if (! $is.string(path)) return path;
        if (path.indexOf('~/') >= 0) {
            return decodeURI(path.replace('~/', kUSER_HOME + '/'))
        }
        if (getOS() === Platforms.WIN) {
            path = decodeURI(path);
            if (path.slice(0,3) === '\\c\\') {
                path = 'C:\\' + path.slice(3);
                console.log('[client-helpers.js][abspath] path',     path);
                console.log('[client-helpers.js][abspath] path 0-3', path.slice(0,3));
            }
            else if (path.slice(0,3) === '/c/') {
                path = 'C:/' + path.slice(3);
                console.log('[client-helpers.js][abspath] path',     path);
                console.log('[client-helpers.js][abspath] path 0-3', path.slice(0,3));
            }
            return path;
        }
        return path;
    }

    global.abspath = abspath;

    /**
     *
     * @param {string} fallback  The fallback path if no stored path.
     */
    const getStartFolder = (fallback) => {
        let __startFolder = abspath(fallback)
            , kLAST_FOLDER  = retrieve('kLAST_FOLDER');

        if (! $is.undefined(global.startFolder)) {
            __startFolder = global.startFolder;
        }

        console.log('@ kLAST_FOLDER @', kLAST_FOLDER)

        if (! $is.undefined(kLAST_FOLDER) && ! $is.empty(kLAST_FOLDER)) {
            if (fs.existsSync(kLAST_FOLDER)) {
                __startFolder = kLAST_FOLDER;
            }
        }

        return __startFolder;
    }

    global.getStartFolder = getStartFolder;

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
     * Get the file extension portion of a file name.
     * @param theFileName
     * @returns {string}
     */
    function getFileExtension(theFileName) {
        return theFileName.toLowerCase().split(".").pop();
    }

    global.getFileExtension = getFileExtension;

    /**
     * Get the base name of a file path or file name.
     * @param theFileName
     * @returns {void | string}
     */
    function getBaseName(theFileName) {
        var justTheName = theFileName.split("/").pop();
        return justTheName.replace("." + getFileExtension(justTheName), "");
    }

    global.getBaseName = getBaseName;

    /**
     * List files of a given type in a folder.
     * @param folder
     * @param type
     * @returns {*}
     */
    function listFiles(folder, type) {
        const getFiles = (srcPath, type) => {
            return fs
                .readdirSync(srcPath)
                .filter((file) => {
                    if ($path.extname(file).toLowerCase() !== '.' + type.toLowerCase()) return false;
                    return fs.statSync($path.join(srcPath, file)).isFile()
                });
        }
        return getFiles(folder, type.toLowerCase());;
    }

    global.listFiles = listFiles;


    function listFilesRecursively(src, result, ext) {
        let items = fs.readdirSync(src)
      
        result = result || []
      
        items.forEach(function(file) {
            let __path = $path.join(src, file);
            if (fs.statSync(__path).isDirectory()) {
                result = listFilesRecursively(__path, result, ext)
            } 
            else {
                if ($path.extname(file).toLowerCase() === ext ) {
                    result.push($path.join(src, file))
                }
            }
        })
      
        return result;
    }

    global.listFilesRecursively = listFilesRecursively;

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

    global.xmlToString = xmlToString;

    /**
     * Trim newline chars from a long string.
     * @param   {string}    theText
     * @returns {string}
     */
    function trimNewLines(theText) {
        return theText.replace(/\r?\n/g, "");
    }

    global.trimNewLines = trimNewLines;

    /**
     * Tests if the event keycode is the enter key.
     * @param e
     * @returns {boolean}
     */
    function isEnterKey(e) {
        return e.keyCode === 13;
    }

    global.isEnterKey = isEnterKey;

    /**
     * Test of a variable is completely empty.
     * @param   {*}         data
     * @returns {boolean}
     */
    function isEmpty(data) {
        if (typeof data === 'number' || typeof data === 'boolean') {
            return false;
        }
        if (typeof data === 'undefined' || data === null) {
            return true;
        }
        if (typeof data.length !== 'undefined') {
            return data.length === 0;
        }
        var count = 0;
        for (var i in data) {
            if (data.hasOwnProperty(i)) count ++;
        }
        return count == 0;
    }

    global.isEmpty = isEmpty;

    /**
     * Test if a value is defined.
     * @param   {string}    property
     * @returns {boolean}
     * @private
     */
    function isDefined(theItem) {
        return typeof(theItem) != 'undefined';
    }

    global.isDefined = isDefined;

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

    global.isNull = isNull;

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

    global.isDefinedOr = isDefinedOr;

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

    global.isEmptyOr = isEmptyOr;

    /**
     * Get the current timestamp.
     * @returns {number}
     * @private
     */
    function now() {
        return (new Date()).getTime();
    }

    global.now = now;

    /**
     * Get a value from an object or array.
     * @param {object|array}    subject     The object or array to search
     * @param {string}          key         The object property to find
     * @param {*}               _default    The default value to return if property is not found
     * @returns {*}                         The found or default value
     */
    function get( subject, key, _default ) {
        var value = _default;
        if (! subject) return _default;
        if (typeof subject[key] !== 'undefined') {
            value = subject[key];
        }
        return value;
    }

    global.get = get;

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
    }

    global.slash = slash;

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

    global.pack = pack;

    /**
     * Case-insensitive string comparison.
     * @param   {string}  aText
     * @param   {string}  bText
     * @returns {boolean}
     */
    function strcmp(aText, bText) {
        return aText.toLowerCase() === bText.toLowerCase();
    }

    global.strcmp = strcmp;

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

    global.trap = trap;


    /**
     * Is the item an array?
     * @param theItem
     * @returns {boolean}
     */
    function isArray(theItem) {
        return theItem instanceof Array;
    }

    global.isArray = isArray;

    /**
     * Is theItem an object?
     * @param   {*} theItem
     * @returns {*}
     * @private
     */
    function isObject(theItem) {
        return isType(theItem, 'object');
    }

    global.isObject = isObject;

    /**
     * Is theItem a function?
     * @param   {*}         theItem
     * @returns {boolean}
     * @private
     */
    function isFunction(theItem) {
        return theItem instanceof Function;
    }

    global.isFunction = isFunction;

    /**
     * Is theItem a string?
     * @param   {*}         theItem
     * @returns {boolean}
     */
    function isString(theItem) {
        return isType(theItem, 'string');
    }

    global.isString = isString;

    /**
     * Is theItem a number?
     * @param   {*}         value
     * @returns {boolean}
     */
    function isNumber(value) {
        return ! isNaN(String(value));
    }

    global.isNumber = isNumber;

    /**
     * Tests if a value is an integer.
     * @param value
     * @returns {boolean}
     */
    function isInt(value) {
        if (! isNumber(value)) return false;
        var test = String(value);
        return test.indexOf('.') === -1;
    }

    global.isInt = isInt;

    /**
     * Tests if a value is a float.
     * @param value
     * @returns {boolean}
     */
    function isFloat(value) {
        if (! isNumber(value)) return false;
        var test = String(value);
        return test.indexOf('.') > 0;
    }

    global.isFloat = isFloat;

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

    global.isJSON = isJSON;

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

    global.isTrue = isTrue;

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

    global.isFalse = isFalse;

    /**
     * Is theString an error (Starts with the word 'Error')?
     * @param   {string}    theString
     * @returns {boolean}
     */
    function isErrorString(theString) {
        return theString.substr(0, 5).toLowerCase() == 'error';
    }

    global.isErrorString = isErrorString;

    /**
     * Test if an item appears in an array.
     * @param needle
     * @param haystack
     * @returns {boolean}
     */
    function inArray(needle, haystack) {
        return haystack.indexOf(needle) !== -1;
    }

    global.inArray = inArray;

    /**
     * Test if the haystack contains the needle.
     * @param haystack
     * @param needle
     * @returns {boolean}
     */
    function has(haystack, needle) {
        /*
         * Does the needle appear in the array?
         */
        if (isArray(haystack)) {
            return inArray(needle, haystack);
        }
        /*
         * Or does it appear as an object property?
         */
        else if (isObject(haystack)) {
            return isDefined(haystack[needle]);
        }
        /*
         * Or are the needle and haystack identical?
         */
        return haystack === needle;
    }

    global.has = has;

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

    global.isType = isType;

    /**
     * Read a file.
     * @param theFilePath
     * @returns {*}
     */
    function readFileData(theFilePath) {
        var result;
        try {
            result = window.cep.fs.readFile(theFilePath);

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

    global.readFileData = readFileData;

    /**
     * Turns a file with file:// protocol into a regular path.
     * @param path
     * @returns {*}
     */
    function fromFile(path) {
        if (typeof path !== 'string') return path;
        if (path.replace(/\s/g, '') === '') return path;
        return path.replace(/file:\/\//g, '');
    }

    global.fromFile = fromFile;

    /**
     * Adds 'file://' protocol to a file path.
     * @param path
     * @returns {string|*}
     */
    function toFile(path) {
        if (typeof path !== 'string') return path;
        if (path.replace(/\s/g, '') === '') return path;
        if (path.indexOf('file://') !== -1) return path;
        return 'file://' + path;
    }

    global.toFile = toFile;

    /**
     * Quote a string.
     * @param str
     * @returns {string}
     */
    var qt = function(str) {
        return '\'' + str + '\'';
    }

    global.qt = qt;


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

    global.addScript = addScript;

    /**
     * Updates only existing values on `target` with values from `source`.
     * @param   {object}    target      The target object (this will be updated and returned)
     * @param   {object}    source      The new values to add to target.
     * @param   {bool}      allowNulls  Allow values to be nulled.
     * @param   {array}     ignore      Array of fields to ignore.
     * @returns {target}
     */
    function update(target, source, allowNulls, ignore) {
        allowNulls = allowNulls === undefined ? true : false;
        ignore = isEmpty(ignore) ? [] : ignore;
        for (var key in source) {
            if (ignore.indexOf(key) !== -1) continue;
            if (! allowNulls && isEmpty(source[key])) continue;
            target[key] = source[key];
        }
        return target;
    }

    global.update = update;

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
            if (typeof target[key] === 'undefined' || overwrite) {
                target[key] = source[key];
            }
        }
        return target;
    }

    global.merge = merge;

    /**
     * Extends a child with properties & methods from the parent.
     * @param Parent
     * @param Child
     */
    function extend(Parent, Child) {
        try {
            var __prototype__ = merge(Child.prototype || {},  Parent.prototype, true);

            Object.setPrototypeOf ?
                Object.setPrototypeOf(Child, __prototype__) :
                Child.__proto__ = __prototype__;
        }
        catch(e) { throw e }

        return Child;
    }

    global.extend = extend;

    /**
     * Shortcut to CSInterface.systemPath.
     * @param name
     * @returns {The}
     */
    function syspath(name) {
        var cs;
        if (typeof cs === 'undefined') {
            cs = new CSInterface();
        }
        return cs.getSystemPath(name);
    }

    global.syspath = syspath;

    /**
     * Create a directory if it does not already exist.
     * @param fs
     * @param dirpath
     * @requires fs
     */
    function fs$mkdir(fs, dirpath) {
        if (typeof fs === 'undefined') {
            throw new Error('The node fs package is required to use `maybemkdir`');
        }
        if (! fs.existsSync(dirpath)){
            fs.mkdirSync(dirpath);
        }
    }

    global.fs$mkdir = fs$mkdir;

    /**
     * Read and parse a JSON file.
     * @param fs
     * @param filepath
     * @returns {any}
     * @requires fs
     */
    function fs$readjson(fs, filepath) {
        if (typeof fs === 'undefined') {
            throw new Error('The node fs package is required to use `maybemkdir`');
        }
        try {
            if (fs.existsSync(filepath)) {
                return JSON.parse( fs.readFileSync(filepath) );
            }
        }
        catch(e) {
            console.info('Could not load custom settings')
            console.error(e.message);
        }
    }

    global.fs$readjson = fs$readjson;

    /**
     * Gets the stored kSTART_FOLDER from localStorage.
     * @param fs
     * @param dbFieldName
     * @returns {string}
     * @requires fs
     */
    function fs$storedStartFolder(fs, dbFieldName) {
        if (typeof fs === 'undefined') {
            throw new Error('The node fs package is required to use `maybemkdir`');
        }
        var storedStartFolder;
        try {
            storedStartFolder = window.localStorage.getItem(dbFieldName);
            if (! fs.existsSync(storedStartFolder)) storedStartFolder = null;
        }
        catch(e) {
            console.log(e);
        }
        return storedStartFolder;
    }

    global.fs$storedStartFolder = fs$storedStartFolder;
    global.fs$storedStartFolder = fs$storedStartFolder;

    /**
     * Creates a jQuery-wrapped <select/> element.
     * @param   {strin}     name        The name/ID of the select element.
     * @param   {string}    valueField  The name of the field to use for the <option/> value
     * @param   {string}    textField   The name of the field to use for the <option/> text
     * @param   {object[]}  items       An array of data objects to use for the selector options.
     * @param   {string}    selected    The value of the selected option.
     * @param   {string}    chooseText  The text for the first option.
     * @param   {string}    size        The size of the selector.
     * @returns {*|jQuery|HTMLElement}
     */
    function $makeSelector(name, valueField, textField, items, selectedValue, chooseText, size) {
        try {
            var $option,
                $selector = $('<select></select>');

            console.log('$makeSelector items', items);

            $selector.attr({
                id   : name,
                name : name,
                size : 4
            });

            // $option = $('<option/>')
            //     .attr('value', '')
            //     .text(chooseText)
            //     .appendTo($selector);

            // $option = $('<option disabled></option>')
            //     .text('──────────')
            //     .appendTo($selector);

            for (var i = 0; i < items.length; i++) {
                var item = items[i];

                $option = $('<option/>')
                    .attr('value', get(item, valueField))
                    .text(get(item, textField))
                    .appendTo($selector);

                if (get(item, valueField) === selectedValue) {
                    $option.attr('selected', 'selected');
                }
            }
            return $selector;
        }
        catch(e) { throw e; }
    }

    global.$makeSelector = $makeSelector;

    /**
     * Wrapper for storage engine.
     * @returns {Storage}
     */
    function getStorage() {
        return window.localStorage;
    }

    global.getStorage = getStorage;

    /**
     * Gets/Sets a new session ID.
     * @returns {string}
     */
// function getSessionId() {
//     var kSESS_ID, sessId;
//
//     if ($storage.has('kSESS_ID')) {
//         kSESS_ID = $storage.getItem('kSESS_ID');
//     }
//     else {
//         sessId = $storage.getItem('kSESS_ID');
//
//         console.log('sessId test', $is.empty(sessId) || $is.null(sessId));
//
//         if ($is.empty(sessId) || $is.null(sessId)) {
//             sessId = generateUUID();
//             $storage.setItem('kSESS_ID',sessId);
//         }
//         kSESS_ID = sessId;
//     }
//     return kSESS_ID;
// }

    /**
     * Wrapper for saving to storage.
     * @param key
     * @param value
     */
    function store(key, value) {
        if (typeof value !== 'string' && typeof value !== 'number') {
            value = stringify(value);
        }
        getStorage().setItem(key, value);
    }

    global.store = store;

    /**
     * Shortcut for localStorage.getItem()
     * @param key
     * @param fallback
     * @returns {string}
     */
    function retrieve(key, fallback) {
        var result = fallback,
            value  = getStorage().getItem(key);
        if (! isEmpty(value)) {
            result = value;
        }
        return result;
    }

    global.retrieve = retrieve;

    function getFormattedDate(date, withTime) {
        function dateFormat(date) {
            var date = new Date(date);
            var theDate = [
                date.getFullYear(),
                String((date.getUTCMonth() + 1001)).slice(-2),
                String(date.getUTCDate() + 1000).slice(-2)
            ].join('-')

            if (withTime) {
                theDate += ' ' + [
                    String(date.getHours() + 1000).slice(-2),
                    String(date.getMinutes() + 1000).slice(-2),
                    String(date.getSeconds() + 1000).slice(-2)
                ].join(':')
            }

            return theDate;
        }
        return(dateFormat(date));
    }

    global.getFormattedDate = getFormattedDate;

    function isIconjar(iconjar) {
        return (
            fs.statSync(iconjar).isDirectory() === false
            && $path.extname(iconjar) === '.iconjar'
        )
    }

    global.isIconjar = isIconjar;

    function isZip(iconjar) {
        return (
            fs.statSync(iconjar).isDirectory() === false
            && $path.extname(iconjar) === '.zip'
        )
    }

    global.isZip = isZip;

    function isFolder(iconjar) {
        return fs.statSync(iconjar).isDirectory();
    }

    global.isFolder = isFolder;

    function host$console(event) {
        console.log(event.data)
    }

    global.host$console = host$console;

    function log(file, label, message) {
        var _label = typeof message !== 'undefined' ? `[${label}]` : '';
        var _message = typeof message !== 'undefined' ? message : '';
        console.log(`[${file}]${_label}`, _message)
    }

    global.log = log;

    function error(file, label, message) {
        var _label = typeof message !== 'undefined' ? `[${label}]` : '';
        var _message = typeof message !== 'undefined' ? message : '';
        console.error(`[${file}]${_label}`, _message)
    }

    global.error = error;

    function my_eval(file, key) {
        log(file, key, eval(key))
    }

    global.my_eval = my_eval;

    function isSupportedArchiveType(source) {
        if ($path.extname(source) !== '.iconjar'
            && $path.extname(source) !== '.zip'
            && ! isFolder(abspath(source))) {

            
            return false;
        }
        return true;
    }

    global.isSupportedArchiveType = isSupportedArchiveType;

    /**
     * Get a unique file name that avoids name colllisions with existing files.
     * @param targetFolder
     * @param fileName
     * @returns {string|*}
     */
    function getUniqueFileName(source, target) {

        let fileName = $path.basename(source)
          , ext = $path.extname(source)
          , stem = fileName.replace(ext, '');

        if (fs.existsSync(target)) {
            fileName = `${stem}-${uuidv4().slice(0,5)}${ext}`;
        }

        return fileName;
    }

    global.getUniqueFileName = getUniqueFileName;

    /**
     * Append child node to selected node.
     */
    function append(id, element) {
        if (typeof element === 'string') {
            element = document.createElement(element);
        }
        return document.getElementById(id).appendChild(element);
    }

    global.append = append;


    function getItemByProperty(items, prop) {
        const filtered = items.filter((item) => {
            return item[prop].toLowerCase() === prop.toLowerCase();
        });
        if (typeof filtered.length !== 'undefined' && filtered.length > 0) {
            return filtered[0];
        }
        return null;
    }

    global.getItemByProperty = getItemByProperty;

    /**
     * Choose folder through app.
     */
    function chooseFolder() {
        return new Promise((resolve, reject) => {
            csInterface.evalScript('Folder.selectDialog()', function(result) {
                console.log('Choose Folder', result);
                if (String(result).toLowerCase().indexOf('error') !== -1) {
                    reject(result);
                }
                resolve(result);
            });
        });
    }

    /**
     * Choose folder through app.
     */
    function chooseFolderSync(callback) {
        return new Promise((resolve, reject) => {
            csInterface.evalScript('Folder.selectDialog()', callback);
        });
    }

    global.chooseFolderSync = chooseFolderSync;


    function confirm(message) {
        csInterface.evalScript(`confirm("${message}");`, callback);
    }

    global.confirm = confirm;

    function host$try(code) {
        csInterface.evalScript(`
            try {
                ${code}
            } catch(e) { return e; }
        `, callback);
    }

    global.host$try = host$try;

    function noop(msg){
        console.log('[noop]' + (msg !== undefined ? ` : ${msg}` : ''))
    }

    global.noop = noop;

    function replaceNodeWithReactComponent(element, reactComponent) {
        const parent = document.createElement('div');
        ReactDOM.render(reactComponent, parent, () => {
            element.replaceWith(...Array.from(parent.childNodes));
        });
    }

    global.replaceNodeWithReactComponent = replaceNodeWithReactComponent;

    /**
     * Test if a method name is a reserved name.
     */
    function isReservedMethodName(fn) {
        const methods = [
            'isMounted',
            'constructor',
            'getDerivedStateFromProps',
            'render',
            'componentDidMount',
            'componentWillUpdate',
            'getSnapshotBeforeUpdate',
            'setState',
            'UNSAFE_componentWillUpdate',
            'UNSAFE_componentWillReceiveProps',
            'componentWillUnmount',
            'getDerivedStateFromError',
            'componentDidCatch',
            'forceUpdate',
            'UNSAFE_componentWillMount',
            'propertyIsEnumerable',
            'removeComponent',
            'toString',
            'toLocaleString',
            'isPrototypeOf',
            'hasOwnProperty',
            'cloneAndReplaceKey',
            'cloneElement',
            'cloneElementWithValidation',
            'Component',
            'ComponentDummy',
            'countChildren',
            'createContext',
            'createElement',
            'createElementWithValidation',
            'createFactoryWithValidation',
            'createRef',
            'defineKeyPropWarningGetter',
            'defineRefPropWarningGetter',
            'describeComponentFrame',
            'escape',
            'escapeUserProvidedKey',
            'forEachChildren',
            'forEachSingleChild',
            'forwardRef',
            'getComponentKey',
            'getComponentName',
            'getCurrentComponentErrorInfo',
            'getDeclarationErrorAddendum',
            'getIteratorFn',
            'getPooledTraverseContext',
            'getSourceInfoErrorAddendum',
            'getSourceInfoErrorAddendumForProps',
            'getWrappedName',
            'hasValidKey',
            'hasValidRef',
            'isValidElement',
            'isValidElementType',
            'lazy',
            'mapChildren',
            'mapIntoWithKeyPrefixInternal',
            'mapSingleChildIntoContext',
            'memo',
            'onlyChild',
            'printWarning',
            'PureComponent',
            'refineResolvedLazyComponent',
            'releaseTraverseContext',
            'resolveDispatcher',
            'setCurrentlyValidatingElement',
            'toArray',
            'traverseAllChildren',
            'traverseAllChildrenImpl',
            'useCallback',
            'useContext',
            'useDebugValue',
            'useEffect',
            'useImperativeHandle',
            'useLayoutEffect',
            'useMemo',
            'useReducer',
            'useRef',
            'useState',
            'validateChildKeys',
            'validateExplicitKey',
            'validateFragmentProps',
            'validatePropTypes',
            'warnIfStringRefCannotBeAutoConverted',
            'warnNoop',
            'replaceState'
        ]

        return methods.indexOf(fn) >= 0;
    }

    global.isReservedMethodName = isReservedMethodName;

    /**
     * Automatically bind methods to this object.
     */
    function bindGlobalThis(_this) {
        let props = new Set()
        let self = _this;

        while (self = Object.getPrototypeOf(self)) {
            Object.getOwnPropertyNames(self).forEach((fn) => {
                if (self[fn] instanceof Function) {
                    props.add(fn)
                }
            }) 
        }

        [...props.keys()].forEach((fn) => {
            if (isReservedMethodName(fn)) return false;
            _this[fn] = _this[fn].bind(_this);
        })
    }

    global.bindGlobalThis = bindGlobalThis;

    function getMethods(toCheck) {
        var props = [];
        var obj = toCheck;
        do {
            props = props.concat(Object.getOwnPropertyNames(obj));
        } while (obj = Object.getPrototypeOf(obj));
    
        return props.sort().filter(function(prop, i, arr) { 
            if (isReservedMethodName(prop)) return false;
            if (String(prop).charAt(0) === '_') return false;
            if (prop != arr[i+1] && typeof toCheck[prop] === 'function') return true;
        });
    }

    global.getMethods = getMethods;

    const getGroupFromPath = (dirs) => {
        let group;
        if (dirs.length > 1) {
            group = dirs[0];
        }
        return group;
    }

    global.getGroupFromPath = getGroupFromPath;
    
    const getSetFromPath = (dirs) => {
        /*
        * We need at least one set, so if all icons are in the root folder, create a default set.
        */
        if (dirs.length === 0) return 'default';
    
        /*
        * Use the full path to the parent folder so it is unique.
        */
        set = dirs.slice(1).join('@');
    
        return set;
    }

    global.getSetFromPath = getSetFromPath;

})(typeof window !== 'undefined' ? window : this);
