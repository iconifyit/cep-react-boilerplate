!(function(global, Utils) {

    var Import = function(filepath, options) {

        var doc
            , placed
            , theFile
            , theLayer
            , screen
        ;

        var kAPP_COORD_SYSTEM = app.coordinateSystem;

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

            // Fix path bug ...
            filepath = fixVolumePathBug(filepath);

            theFile  = new File(filepath);

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
            logger.error('Position error', e.message);
            throw new Error('Position Error ' + e.message);
        }
        finally {
            app.coordinateSystem = kAPP_COORD_SYSTEM;
        }
    }

    global.Import = Import;

})(this, Utils);
