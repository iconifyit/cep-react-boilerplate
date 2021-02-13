!(function(global, Iterator, artboards) {
    try {

        // alert('app : ' + typeof app);
        // alert('app.activeDocument : ' + typeof activeDocument);
        // alert('app.activeDocument.artboards : ' + typeof activeDocument.artboards);
        // alert('_artboards : ' + typeof _artboards);

        artboards = activeDocument.artboards;
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

})(this, Iterator, []);
