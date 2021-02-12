var Helpers = {loaded : true};

!(function(global) {

    /**
     * Context constants.
     * @type {{HOST: string, CLIENT: string}}
     */
    var Contexts = {
        HOST   : 'HOST',
        CLIENT : 'CLIENT'
    };

    global.Contexts = Contexts;

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

    global.isSupported = isSupported;

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

    global.isTypename = isTypename;

    /**
     * Get the typename of an object if it is set.
     * @param   {object}    theItem
     * @returns {string|null}
     */
    function getTypename(theItem) {
        if (isDefined(theItem.typename)) return theItem.typename;
        return "undefined";
    }

    global.getTypename = getTypename;

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
     * @param   {*}         theItem
     * @returns {boolean}
     */
    function isNumber(theItem) {
        return ! isNaN(theItem);
    }

    global.isNumber = isNumber;

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
     * Is theItem a GroupItem?
     * @param   {*}         theItem
     * @returns {boolean}
     * @private
     */
    function isGroupItem(theItem) {
        return isTypename(theItem, 'GroupItem');
    }

    global.isGroupItem = isGroupItem;

    /**
     * Is theItem a PathItem?
     * @param   {*}         theItem
     * @returns {boolean}
     * @private
     */
    function isPathItem(theItem) {
        return isTypename(theItem, 'PathItem');
    }

    global.isPathItem = isPathItem;

    /**
     * Is theItem a CompoundPathItem?
     * @param   {GroupItem} theItem
     * @returns {boolean}
     * @private
     */
    function isCompoundPathItem(theItem) {
        return isTypename(theItem, 'CompoundPathItem');
    }

    global.isCompoundPathItem = isCompoundPathItem;

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
     * Tests if the current OS is Macintosh.
     * @returns {boolean}
     */
    function isMac() {
        return Folder.fs.toLowerCase().indexOf('mac') !== -1;
    }

    global.isMac = isMac;

    /**
     * Tests if the current OS is Windows.
     * @returns {boolean}
     */
    function isWindows() {
        return Folder.fs.toLowerCase().indexOf('mac') === -1;
    }

    global.isWindows = isWindows;

    /**
     * Gets the name of the current operating system.
     * @returns {String|string}
     */
    function os() {
        return Folder.fs.toLowerCase();
    }

    global.os = os;

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
        if (typeof(subject[key]) !== 'undefined') {
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
     * Format date into a filename-friendly format.
     * @param   {string}  date
     * @returns {string} "YYYY-MM-DD"
     */
    function dateFormat(date, separator) {
        return (function(d) {
            return [
                String(d.getMonth() + 1001).slice(-2),
                String(d.getDate() + 1000).slice(-2),
                d.getFullYear()
            ].join(separator !== undefined ? separator : '-')
        })(new Date(date));
    }

    global.dateFormat = dateFormat;


    /**
     * Get formatted date as 2020-09-01 00:00:00
     * @param theDate
     * @param withTime
     * @returns {string}
     */
    function getFormattedDate(theDate, withTime) {
        var date = typeof theDate !== 'undefined' ? new Date(theDate) : new Date();

        var theDate = [
                date.getFullYear(),
                String((date.getUTCMonth() + 1000)).slice(-2),
                String(date.getUTCDate() + 1000).slice(-2)
            ].join('-')

        if (withTime) {
            theDate += (' ' + [
                String(date.getHours() + 100).slice(-2),
                String(date.getMinutes() + 100).slice(-2),
                String(date.getSeconds() + 100).slice(-2)
            ].join(':'))
        }

        return theDate;
    }

    global.getFormattedDate = getFormattedDate;

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

    global.isEmpty = isEmpty;

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
     * Trims a string.
     * @param   {string}  str     The string to trim
     * @returns  {XML|string|void}
     */
    function trim(str) {
        return str.replace(/^\s+|\s+$/g, '');
    }

    global.trim = trim;

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
     * Get only the last folder in a path.
     * @param thePath
     */
    function getFolderName(thePath) {
        return thePath.split('/').pop();
    }

    global.getFolderName = getFolderName;

    /**
     * Get the parent folder of a path representing a file or folder.
     * @param thePath
     * @returns {*|string}
     */
    function getParentFolder(thePath) {
        var folders = thePath.split('/');
        return folders[folders.length - 2];
    }

    global.getParentFolder = getParentFolder;

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

    global.maybeAddLayer = maybeAddLayer;

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

    global.centerAndResizeItem = centerAndResizeItem;

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

    global.maybeSortFileList = maybeSortFileList;

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

    global.getBoardName = getBoardName;

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

    global.doOpenLogFile = doOpenLogFile;

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

    global.doOpenWebAddress = doOpenWebAddress;

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

    global.setPathItemFromSVG = setPathItemFromSVG;

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

    global.copyPathPoints = copyPathPoints;

    /**
     * Converts SVG Path value to cubic bezier points.
     * @param   {string}    svg
     * @returns {Array}
     *
     * @author Malcolm McLean <malcolm@astutegraphics.co.uk>
     */
    function svgToPathPointArray(svg) {
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

    global.svgToPathPointArray = svgToPathPointArray;

    /**
     * Converts AI PathItem PathPoints to SVG path value.
     * @param   {PathItem}  path
     * @returns {*}
     *
     * @author Malcolm McLean <malcolm@astutegraphics.co.uk>
     */
    function pathItemToSVG(path) {
        var i;
        var answer = "";
        var ppa;
        var ppb;

        if(path.pathPoints.length == 0)
            return "";


        answer = "M" + path.pathPoints[0].anchor[0].toFixed(2) + "," + path.pathPoints[0].anchor[1].toFixed(2);


        for(i=0;i<path.pathPoints.length-1;i++) {
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

        if (path.closed) {
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

    global.pathItemToSVG = pathItemToSVG;

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

    global.txt = txt;

    /**
     * Make sure at least one file type is selected.
     * @returns {bool}
     */
    function hasOneFileType() {
        return CONFIG.FILETYPE_SVG || CONFIG.FILETYPE_AI || CONFIG.FILETYPE_EPS || CONFIG.FILETYPE_PDF;
    }

    global.hasOneFileType = hasOneFileType;

    /**
     * Cleans up the filename/artboardname.
     * @param   {String}    name    The name to filter and reformat.
     * @returns  {String}            The cleaned up name.
     */
    function filterName(name) {
        return decodeURIComponent(name).replace(' ', '-');
    }

    global.filterName = filterName;

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

    global.saveFileAsAi = saveFileAsAi;

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

    global.alignToNearestPixel = alignToNearestPixel;

    /**
     * Trims a string.
     * @param   {string}  str     The string to trim
     * @returns  {XML|string|void}
     * @deprecated Use String.trim() instead.
     */
    function trim(str) {
        return str.replace(/^\s+|\s+$/g, '');
    }

    global.trim = trim;

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

    global.centerObjects = centerObjects;

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

    global.getArtboardNamePrefix = getArtboardNamePrefix;

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

    global.comparator = comparator;


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

    global.showProgressBar = showProgressBar;

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

    global.updateProgress = updateProgress;

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

    global.pack = pack;

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

    global.path = path;


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

    global.toPath = toPath;

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

    global.getContext = getContext;

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

    global.readFileData = readFileData;

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

    global.getExtension = getExtension;

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

    global.ConfigValues = ConfigValues;

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

            console.info(stringify(plugins));

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

    global.loadPlugins = loadPlugins;

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

    global.evalFile = evalFile;

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

    global._t = _t;

    /**
     * Send error message to all outputs.
     * @param message
     * @param vars
     */
    function error(message, vars) {
        message = typeof(vars) != 'undefined' ? _t(message, vars) : message ;
        trap(function() { console.error(message);}, null);
        trap(function() { csInterface.evalScript( 'Host.logger.error("' + message + '")' ); }, null);
        trap(function() { Host.logger.error(message); }, null);
    }

    global.error = error;

    /**
     * Send info message to all outputs.
     * @param message
     * @param vars
     */
    function info(message, vars) {
        message = typeof(vars) != 'undefined' ? _t(message, vars) : message ;
        trap(function() { console.log(message);}, null);
        trap(function() { csInterface.evalScript( 'Host.logger.info("' + message + '")' ); }, null);
        trap(function() { Host.info.error(message); }, null);
    }

    global.info = info;

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

    global.fwrite = fwrite;

    /**
     * Shows a Save dialog and writes content to selected file.
     * @param content
     * @returns {string|*}
     */
    function fsave(content, fname) {
        return fwrite(Config.LOGFOLDER + '/' + fname, content, true);
    }

    global.fsave = fsave;

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

    global.round = round;

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

    global.groupLayers = groupLayers;

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

    global.include = include;

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

    function safeFileName(fileName, fileExt) {
        if (getFileExtension(fileName) !== fileExt) {
            fileName += '.' + fileExt;
        }
        return slugify(fileName);
    }

    global.safeFileName = safeFileName;

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
     * Loads PlugPlugExternalObject if it is not already loaded.
     */
    // var plugPlugExternalObject;
    // function maybeLoadPlugPlugLib() {
    //     if (! plugPlugExternalObject) {
    //
    //         try {
    //             plugPlugLib = new ExternalObject ("lib:" + "PlugPlugExternalObject");
    //         }
    //         catch (e) {
    //             logger.error('[PlugPlugExternalObject]', e.message);
    //         }
    //     }
    // }

    // global.plugPlugExternalObject = plugPlugExternalObject;
    // global.maybeLoadPlugPlugLib   = maybeLoadPlugPlugLib;

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

    global.openInDefaultBrowser = openInDefaultBrowser;

    /**
     * Bug fix for the issue described at the link below.
     * @link https://community.adobe.com/t5/indesign/extendscript-oddity-with-file-folder-on-mac-os-x/m-p/3887816?page=1#M165105
     */
    function fixVolumePathBug(filepath) {
        if ($.os.toLowerCase().indexOf('mac') === -1) return filepath;

        var $HOME = slash(new Folder('~/').fsName);

        if (filepath.indexOf($HOME) > 0) {
            var parts = filepath.split($HOME);
            filepath = $HOME + parts.pop();
        }

        return filepath;
    }

    global.fixVolumePathBug = fixVolumePathBug;

})(this);
