/**
 * Create a new FlyoutMenu.
 * @param {array}  menuItems An array of MenuItems each having ID, Label, enabled, checked.
 * @returns {*}
 * @constructor
 */
function FlyoutMenu() {

    "use strict";

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
 * @param id
 * @param label
 * @param enabled
 * @param checked
 */
FlyoutMenu.prototype.add = function(id, label, enabled, checked) {
    this.Menu.items.push(MenuItem(id, label, enabled, checked));
    this.Menu.state[id] = {
        enabled : enabled,
        checked : checked,
        text    : label
    };
}

/**
 * Get the Menu state object.
 * @returns {*}
 */
FlyoutMenu.prototype.getState = function() {
    return this.Menu.state;
}

/**
 * Set the menu click handler.
 * @param clickHandler
 */
FlyoutMenu.prototype.setHandler = function(clickHandler) {
    csInterface.addEventListener('com.adobe.csxs.events.flyoutMenuClicked', clickHandler);
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
