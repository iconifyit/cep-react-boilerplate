(function(global) {
    /**
     * Create a new RGBColor.
     * @param red
     * @param blue
     * @param green
     * @returns {A}
     * @constructor
     */
    global.Color = function(red, blue, green) {
        var _color = new RGBColor();
        _color.red = red;
        _color.blue = blue;
        _color.green = green;
        return _color;
    }

})(this);