/**
 * ContextMenuRouter
 * @param splinterTable
 * @constructor
 */
const ContextMenuRouter = function(splinterTable) {
    this.splinterTable = splinterTable || {};
}

ContextMenuRouter.prototype.add = function(name, method) {
    if (! this.splinterTable.hasOwnProperty(name)) {
        this.splinterTable[name] = method;
    }
}

ContextMenuRouter.prototype.remove = function(name) {
    var st = {};
    for (var key in this.splinterTable) {
        if (key !== name) {
            st[key] = this.splinterTable[key];
        }
    }
    this.splinterTable = st;
}

ContextMenuRouter.prototype.fn = function(name) {
    var method = noop;
    if (typeof this.splinterTable[name] !== 'undefined') {
        method = this.splinterTable[name];
    }
    return method;
}

ContextMenuRouter.prototype.call = function(name, args) {
    console.log('[ContextMenuRouter.js] Call context menu item ' + this.fn(name));
    this.fn(name).apply(global, args);
}

window.ContextMenuRouter = ContextMenuRouter;

if (typeof global !== 'undefined') {
    global.ContextMenuRouter = ContextMenuRouter;
}

module.exports = ContextMenuRouter;
