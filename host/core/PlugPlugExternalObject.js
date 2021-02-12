/**
 * Load plugPlugLib.
 */
!(function(global) {
    try {
        plugPlugLib = new ExternalObject("lib:" + "PlugPlugExternalObject");
    }
    catch (e) {
        logger.error('[PlugPlugExternalObject]', e.message);
    }
    global.plugPlugLib = plugPlugLib;
})(this);
