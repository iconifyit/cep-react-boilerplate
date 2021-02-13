const
      fs = require('fs')
    , path = require('path')
    , Observable = require(`client/lib/Observable.js`)
    , FlyoutMenu = require(`client/lib/FlyoutMenu/FlyoutMenu.js`)
    , exec = require('child_process').exec

const csInterface = window.csInterface;


const FlyoutMenuItems = {
    ABOUT            : 'aboutExtension',
    RELOAD_PANEL     : 'reloadExtension',
    DISABLED         : 'disabled',
    CHECKABLE        : 'checkable'
}


class FlyoutMenuImpl extends Observable {

    constructor(buildNow) {
        super();
        this.menuState = {};
        this.buildNow = buildNow;
        this.initFlyoutMenu();
        if (buildNow === true) {
            this.build();
        }
    }

    /**
     * Writes a class-specific log for easy debugging.
     * @param {string}  fn          The function name calling the log.
     * @param {*}       message     The log message.
     */
    log(fn, message) {
        console.log(`[LOG][${this.constructor.name}][${fn}]`, message);
    }

    /**
     * Writes a class-specific error for easy debugging.
     * @param {string}  fn          The function name calling the log.
     * @param {*}       message     The log message.
     */
    error(fn, e) {
        console.error(`[ERROR][${this.constructor.name}][${fn}]`, e);
    }

    toggleMenuCheckedState(menuId) {
        const self = this;
        if (! self.menuState) {
            self.menuState = {};
        }
        if (! self.menuState[menuId]) {
            self.menuState[menuId] = {
                checked : false,
                enabled : true
            }
        }
        self.menuState[menuId].checked = ((menuId) => {
            const itemState = self.menuState[menuId];
            if (typeof itemState === 'undefined') return false;
            return ! itemState.checked;
        })(menuId);
    }

    initFlyoutMenu() {

        let flyoutMenu,
            self = this;

        try {
            // id, label, enabled, checked
            flyoutMenu = new FlyoutMenu();
            flyoutMenu.add(FlyoutMenuItems.ABOUT,           'About Extension',      true, false, false);
            flyoutMenu.add(FlyoutMenuItems.DISABLED,        'Disabled Menu Item',   false, false, false);
            flyoutMenu.add(FlyoutMenuItems.CHECKABLE,       'Checkable Menu Item',  true, true, true);
            flyoutMenu.add(FlyoutMenuItems.RELOAD_PANEL,    'Reload Extension',     true, false, false);

            flyoutMenu.setHandler((e) => {
                self.flyoutMenuClickedHandler(e);
            });

            this.flyoutMenu = flyoutMenu;
        }
        catch (e) {
            console.error( '[FlyoutMenuImpl.js] init error', e );
        }
    }

    build() {
        this.flyoutMenu.build();
        this.menuState = this.flyoutMenu.getState();
    }

    getMenuItemsXml() {
        return this.flyoutMenu.getItemsXml();
    }

    flyoutMenuClickedHandler(event) {

        var self = this,
            menuId,
            itemState,
            iconJar;

        try {
            menuId = event.data.menuId;
            switch (menuId) {
                case FlyoutMenuItems.ABOUT:
                    csInterface.openURLInDefaultBrowser('https://github.com/iconifyit/cep-barebones');
                    break;
                case FlyoutMenuItems.DISABLED:
                    break; 
                case FlyoutMenuItems.CHECKABLE:
                    self.menuState = self.flyoutMenu.getState();
                    break;                        
                case FlyoutMenuItems.RELOAD_PANEL:
                    self.reload();
                    break;

                default:
                    break;
            }
        }
        catch(e) { console.error(e) }
    }

    reload() {
        try {
            window.cep.process.removeAllListeners();
        }
        catch (e) {}
        window.location.href = "index.html";
    }
}

module.exports = FlyoutMenuImpl;
