class ContextMenuRouter {
    constructor(menuItems, splinterTable) {
        this.menuItems = menuItems;
        this.splinterTable = splinterTable || {};
        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this);
        this.fn = this.fn.bind(this);
        this.call = this.call.bind(this);
    }

    add(name, method) {
        if (! this.splinterTable.hasOwnProperty(name)) {
            this.splinterTable[name] = method;
        }
    }

    remove(name) {
        var st = {};
        for (var key in this.splinterTable) {
            if (key !== name) {
                st[key] = this.splinterTable[key];
            }
        }
        this.splinterTable = st;
    }

    fn(name) {
        var method = ()=>{};
        if (typeof this.splinterTable[name] !== 'undefined') {
            method = this.splinterTable[name];
        }
        return method;
    }

    call(name, args) {
        this.fn(name).apply(global, args);
    }
}

module.exports = ContextMenuRouter;
