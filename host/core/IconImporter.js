/**
 * IconImporter class.
 */
!(function(global) {

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

                if (logger !== undefined) logger.info('[width, height] : ' + width + ', ' + height);
            }

            items.push(item);
        }

        if (logger !== undefined) logger.info('items', items.length);

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

        /**
         * Make sure it has AI files in it
         */
        if (items.length > 0) {

            try {
                items.sort(comparator);
            }
            catch (ex) {
                if (logger !== undefined) logger.error("Sort files failed")
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

                if (logger !== undefined) logger.info('GroupId', group.identifier);

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

                if (logger !== undefined) logger.info('SetId', set.identifier);

                setLayers[sid] = setLayer;
            })

            // Add icons
            /**
             * Loop thru the counter
             */
            for (var i = 0; i < items.length; i++) {

                var item  = items[i],
                    $file = typeof item.$file !== 'undefined' ? item.$file : null;

                if (item.type !== undefined && item.type !== 0) continue;

                if (logger !== undefined) logger.info('ItemId', item.identifier);

                /**
                 * Set the active artboard rulers based on this
                 */
                doc.artboards.setActiveArtboardIndex(i);
                //app.executeMenuCommand('fitall');

                var boardName = filterName(
                    (! $file ? item : $file).name.replace(/\.svg|\.ai|\.eps|\.pdf/gi, "")
                );

                if (logger !== undefined) logger.info("Board name", boardName);

                doc.artboards[i].name = boardName;

                logger.info('[IconImporter.js] $file', $file)

                if (! $file) {
                    if (logger !== undefined) logger.error('File Not Found', item.name + ' file does not exist');
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
                            if (logger !== undefined) logger.info(stringify(item));

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
                            if (logger !== undefined) logger.error('Add Item layer', e.message);
                            itemLayer = doc.layers.add();
                        }

                        itemLayer.name = item.name;

                        logger.info('[IconImporter.js][$file]', $file.fsName)

                        theItem = itemLayer.groupItems.createFromFile($file);
                        redraw();

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
                            }
                            catch (e) {
                                if (logger !== undefined)
                                    logger.error('Position error : {err}', {err : e})
                            }
                        }
                    }

                    var ext = "." + trim($file.name.split('.').pop());

                    updateProgress(
                        progress,
                        items.length,
                        _t('Icon {i} of {n} : `{name}`', {
                            i : i+1,
                            n : items.length,
                            name : boardName + ext
                        })
                    );

                    if (logger !== undefined) {
                        logger.info(_t('Icon {i} of {n} : `{name}`', {
                            i: i+1,
                            n: items.length,
                            name: boardName + ext
                        }));
                    }

                }
                catch (ex) {
                    if (logger !== undefined)
                        logger.error('Import Error', $file.absoluteURI + ' ' + ex.message);
                }
                finally {
                    progress.close();
                }
            }

            try {
                saveFileAsAi([Folder.myDocuments, 'imported.ai'].join('/'));
            }
            catch(e) {
                logger.error('saveFileAsAi', e.message);
            }

            // progress.close();
        }

        /**
         * Saves a file in Ai format.
         * @param {string}  dest    Destination folder path
         */
        function saveFileAsAi(target) {
            var options = new IllustratorSaveOptions();
            var theDoc  = new File(target);
            options.flattenOutput = OutputFlattening.PRESERVEAPPEARANCE;
            options.pdfCompatible = true;
            app.activeDocument.saveAs(theDoc, options);
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

                if (logger !== undefined) {
                    logger.info(
                        '[svg[0].attributes("viewBox"] ' +
                        svg[0].attribute('viewBox').toString()
                    );
                }

                viewBox = svg[0].attribute('viewBox').toString();
                viewBox = viewBox.split(' ');
            }
            catch(e) {
                if (logger !== undefined)
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
    }

    global.IconImporter = IconImporter;

})(this);
