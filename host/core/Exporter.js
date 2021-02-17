!(function(global, FileList) {

    var ExportImageError = function(message) {
        this.name    = 'ExportImageError';
        this.message = message;
    };
    ExportImageError.prototype = Error.prototype;

    var ExportTypes = {
        JPG : 'JPG',
        SVG : 'SVG',
        PNG : 'PNG'
    };

    var Exporter = function() {
        this.doc = app.activeDocument;
    }

    // Exporter.prototype.exportAllAsSVG = function(theFolder) {
    //     // saveMultipleArtboards
    //     // artboardRange
    // }

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

                    console.info('[Export Name]', theName);

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
        console.info('theFile instanceof File : ' + (theFile instanceof File));
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

    global.ExportImageError = ExportImageError;
    global.ExportTypes      = ExportTypes;
    global.Exporter         = Exporter;

    return Exporter;

})(this, FileList);
