!(function(global) {
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

    global.ArtboardLabel = ArtboardLabel;

})(this);
