/**
 * Create a new FlyoutMenu.
 * @param {array}  menuItems An array of MenuItems each having ID, Label, enabled, checked.
 * @returns {*}
 * @constructor
 */
function FlyoutMenu() {

    "use strict";


    this.version = "0.2";

    /**
     * The root menu.
     * @type {jQuery|HTMLElement}
     */
    this.Menu = {
        state : {},
        items : []
    };
};

/**
 * Add a divider item.
 */
FlyoutMenu.prototype.divider = function() {
    this.Menu.items.push(MenuDivider());
}

/**
 * Add a MenuItem
 * @param menuId
 * @param label
 * @param enabled
 * @param checked
 */
FlyoutMenu.prototype.add = function(menuId, label, enabled, checked, checkable) {
    this.Menu.items.push(MenuItem(menuId, label, enabled, checked));
    this.Menu.state[menuId] = {
        enabled : enabled,
        checked : checked,
        text    : label,
        checkable : checked || checkable
    };
}

/**
 * Get the Menu state object.
 * @returns {*}
 */
FlyoutMenu.prototype.getState = function(menuId) {
    if (typeof this.Menu.state[menuId] !== 'undefined') {
        return this.Menu.state[menuId]
    }
    return this.Menu.state;
}

/**
 * Get the Menu state object.
 * @returns {*}
 */
FlyoutMenu.prototype.setState = function(menuId, key, value) {
    this.Menu.state[menuId][key] = value;
}

/**
 * Set the menu click handler.
 * @param clickHandler
 */
FlyoutMenu.prototype.setHandler = function(clickHandler) {
    const self = this;
    csInterface.addEventListener('com.adobe.csxs.events.flyoutMenuClicked', (e) => {
        const menuId = e.data.menuId;
        const menuName = e.data.menuName;
        console.log('e', e);
        let menuState;
        console.log('this.getState(menuId)', self.getState(menuId))
        if (menuState = self.getState(menuId)) {
            console.log('Got menu state', menuState)
            if (menuState.checkable) {
                console.log('It is checkable', menuName, ! menuState.checked)
                self.setState(menuId, 'checked', ! menuState.checked);
                csInterface.updatePanelMenuItem(menuName, true, menuState.checked);
            }
        }
        clickHandler(e);
    });

    // csInterface.updatePanelMenuItem("Checkable Menu Item", true, checkableMenuItem_isChecked);
}

/**
 * Coerce menu to string.
 * @returns {*|jQuery}
 */
FlyoutMenu.prototype.toString = function() {
    var items = this.Menu.items.join('\n');
    return `<Menu>${items}</Menu>`;
}

/**
 * Coerce menu to string.
 * @returns {*|jQuery}
 */
FlyoutMenu.prototype.getItemsXml = function() {
    return this.Menu.items.join('\n');
}

/**
 * Set the context menu.
 */
FlyoutMenu.prototype.build = function() {
    csInterface.setPanelFlyoutMenu(this.toString());
}

/**
 * Build a MenuItem string.
 * @param   {string} id        The unique ID for the menu item.
 * @param   {string} label     The visible text for the menu item.
 * @param   {bool}   enabled   Whether or not the menu item is disabled/enabled.
 * @param   {bool}   checked   Whether or not the menu item is checked.
 * @returns {string}
 * @constructor
 */
function MenuItem(id, label, enabled, checked) {
    if (typeof id === 'undefined') {
        throw 'MenuItem must have an id';
    }
    if (typeof label === 'undefined') {
        throw 'MenuItem must have a label';
    }
    if (typeof enabled === 'undefined') {
        enabled = true;
    }
    if (typeof checked === 'unedefined') {
        checked = false;
    }
    // console.log('[FlyoutMenu.js]', `<MenuItem Id="${id}" Label="${label}" Enabled="${enabled}" Checked="${checked}" />`);
    return `<MenuItem Id="${id}" Label="${label}" Enabled="${enabled}" Checked="${checked}" />`;
}

/**
 * Create a menu divider item.
 * @returns {*|jQuery}
 * @constructor
 */
function MenuDivider() {
    return '<MenuItem Label="---" />';
}

module.exports = FlyoutMenu;
