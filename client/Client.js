// /**
//  * @author Scott Lewis <scott@atomiclotus.net>
//  * @copyright 2020 Scott Lewis
//  * @version 1.0.0
//  * @url http://github.com/iconifyit
//  * @url https://atomiclotus.net
//  *
//  * ABOUT:
//  *
//  *    This script is a very basic boilerplate for Adobe CEP extensions.
//  *
//  * NO WARRANTIES:
//  *
//  *   You are free to use, modify, and distribute this script as you see fit.
//  *   No credit is required but would be greatly appreciated.
//  *
//  *   THIS SCRIPT IS OFFERED AS-IS WITHOUT ANY WARRANTY OR GUARANTEES OF ANY KIND.
//  *   YOU USE THIS SCRIPT COMPLETELY AT YOUR OWN RISK AND UNDER NO CIRCUMSTANCES WILL
//  *   THE DEVELOPER AND/OR DISTRIBUTOR OF THIS SCRIPT BE HELD LIABLE FOR DAMAGES OF
//  *   ANY KIND INCLUDING LOSS OF DATA OR DAMAGE TO HARDWARE OR SOFTWARE. IF YOU DO
//  *   NOT AGREE TO THESE TERMS, DO NOT USE THIS SCRIPT.
//  */

// let Client,
//     contextMenuRouter;

// // ============================================================
// // These imports /must/ be first.
// // ============================================================

// const
//     {CSInterface, SystemPath, CSEvent} = require('client/lib/CSInterface/CSInterface.js')
//     , csInterface = new CSInterface()
//     , fs          = require('fs')
//     , $path       = require('path')
//     , Analytics   = require('custom/iconjar/classes/Analytics.js')
// ;

// /*{{kAES_CORE_CLASS}}*/

// // console.log('[Client.js] CSInterface', CSInterface)

// window.csInterface = csInterface
// window.kEXT_PATH   = csInterface.getSystemPath(window.SystemPath.EXTENSION);

// require('core-js/stable')
// require('regenerator-runtime/runtime')
// require('core/shared');

// extensionPath  = global.extensionPath;
// userDataFolder = global.userDataFolder;
// OS             = global.OS;
// isMac          = global.OS === Platforms.MAC;
// isWindows      = global.OS === Platforms.WIN;

// // ============================================================
// // Remaining imports.
// // ============================================================

// const
//       ncp           = require('ncp')
//     , zlib          = require('zlib')
//     , rimraf        = require('rimraf')
//     , $is           = require('is_js')
//     , Fuse          = require('fuse.js')
//     , DOMParser     = require("xmldom").DOMParser
//     , XMLSerializer = require('xmldom').XMLSerializer
//     , ReactDOM      = require('react-dom')
//     , React         = require('react')
//     , Component     = React.Component
//     , uuid          = require('uuid').v4
//     , kCLASS_PATHS  = require('classes/ClassPaths')
//     , kCLASSES      = require('classes/FilePaths.js')
//     , Session       = require('classes/Session')
//     , $             = require('jquery')
// ;

// window.$      = $;
// window.jQuery = $;
// window.$is    = $is;
// window.fs     = fs;
// window.$path  = $path;
// window.ncp    = ncp;
// window.zlib   = zlib;
// window.rimraf = rimraf;
// window.uuid = uuid;

// require('core/polyfills.js')
// require('core/Observable.js')
// require('core/functions')
// require('host/Configuration')
// require('client-helpers')
// require('client/lib/Globals')
// require('client/lib/jsx-console/jsx-console.js')

// // ============================================================
// // Pass settings to Host.jsx
// // ============================================================

// const extension = csInterface.getExtensions([csInterface.getExtensionID()])

// try {
//     // console.log('kSETTINGS TEST');

//     const __config = [
//           { key : '',  value : kEXT_PATH}
//         , { key : 'extensionId',    value : csInterface.getExtensionID().replace('.panel', '') }
//         , { key : 'userDataFolder', value : global.userDataFolder}
//         , { key : 'OS',             value : global.OS }
//         , { key : 'isMac',          value : global.OS === Platforms.MAC }
//         , { key : 'isWindows',      value : global.OS === Platforms.WIN }
//         , { key : 'atomicData',     value : global.userDataFolder + '/com.atomic' }
//         , { key : 'logFolder',      value : global.kLOG_FOLDER }
//         , { key : 'extension',      value : JSON.stringify(extension)}
//     ];

//     __config.forEach((item) => {
//         csInterface.evalScript(`$.global.${item.key} = '${item.value}';`, function(result) {
//             console.log(`Host setting ${item.key} test`, result);
//         })
//     })
// }
// catch(e) { console.error('kSETTINGS ERROR', e)}

// try {
//     jsx.file('./host/host.all.jsx', function(result) {
//         console.log('JSX result', result)
//     });
// }
// catch(e) {
//     console.error('JSX error', e)
// }

// // ============================================================
// // Define custom constants
// // ============================================================

// const BaseHelper = require('../custom/Helpers/BaseHelper.js')
//     , Hooks = require('../custom/Helpers/Hooks.js')
//     , { makeHostResponse, hostResponseError } = require('../custom/iconjar/functions.js')
//     , Plugins = require('client/lib/Plugins')
//     , Plugin  = require('client/lib/Plugin')
//     , ThemeSwitcher = require('client/lib/ThemeSwitcher/ThemeSwitcher.js')
//     , $window = $(window)
//     , FlyoutMenuImpl = require('classes/FlyoutMenuImpl.js')
//     , local = {}

// ThemeSwitcher();

// // ============================================================
// // Attach global constants to window scope.
// // ============================================================

// window.kUTF_8 = global.kUTF_8;

// if (global) {
//     for (let prop in global) {
//         if (prop.charAt(0) === 'k') {
//             window[prop] = global[prop];
//         }
//     }
// }

// /*
//  * Set ncp's concurrency limit to 0 so we can copy
//  * large IconJars efficiently.
//  */
// ncp.limit = 0;

// require('jquery-lazy');
// require(`jquery-ui/ui/widgets/tooltip`);
// require(`client/lib/jquery.addons/jquery.addons.js`);
// require(`client/lib/FlyoutMenu/FlyoutMenu.js`);
// require(`client/lib/ContextMenuRouter/ContextMenuRouter.js`);
// require(`host/HostResponse.js`);
// require('client/theme/font/icomatic.js');

// // ============================================================
// // Create Session
// // ============================================================

// const session = new Session(localStorage.getItem('kSESS_ID'), false);
// session.save();

// window.session = session;

// if (session.count() === 0) {
//     $("#app header").hide();
//     $("#page-loader").hide();
//     $("#splash").show();
//     $("#docs-link").on('click', (e) => {
//         e.preventDefault();
//         const $link = $("#docs-link");
//         csInterface.openURLInDefaultBrowser($link.attr('data-url'));
//     })
// }

// // console.log('[Client.js] typeof FlyoutMenuImpl', typeof FlyoutMenuImpl)

// /**
//  * Client Controller object.
//  * @param $
//  * @param csInterface
//  * @returns {Instance}
//  * @constructor
//  */
// class ClientController {
//     constructor($, csInterface, session) {
//         this.$ = $;
//         this.csInterface = csInterface;

//         $window.trigger('client.create.start', {
//             type : 'client.create.start',
//             data : self,
//             time : new Date()
//         });

//         /**
//          * The FlyOutMenu virtual object.
//          * @type {{state: Array}}
//          */
//         // this.flyoutMenu = {state: []};

//         /**
//          * The FlyOutMenu state.
//          * @type {{}}
//          */
//         this.menuState = {};

//         /**
//          * The extension meta data.
//          * @type {object}
//          */
//         this.extension = null;

//         /**
//          * User-defined plugins already loaded.
//          * @type {Array}
//          */
//         this.plugins = [];

//         /**
//          * The current session
//          * @type {Session}
//          */
//         this.session = session;

//         /**
//          * Extension object.
//          * @type {{
//          *     mainPath,
//          *     isAutoVisible,
//          *     minWidth,
//          *     version,
//          *     windowType,
//          *     minHeight,
//          *     basePath,
//          *     maxHeight,
//          *     name,
//          *     width,
//          *     id,
//          *     height,
//          *     maxWidth
//          * }}
//          */
//         this.extension = this.getExtension();

//         /**
//          * Plugins path.
//          * @type {string}
//          */
//         this.pluginsPath = this.extension.customPath;

//         /**
//          * Message queue.
//          * @type {*[]}
//          */
//         this.messages = [];

//         /**
//          * Error queue.
//          * @type {*[]}
//          */
//         this.errors = [];

//         this.init();

//         $window.trigger('client.create.finish', {
//             type : 'client.create.finish',
//             data : self,
//             time : new Date()
//         });
//     }

//     getContextMenuJson(contextMenuFile) {
//         var contextMenuJson;
//         try {
//             contextMenuJson = JSON.parse(
//                 fs.readFileSync(
//                     $path.join(kEXT_PATH, 'client', contextMenuFile),
//                     kUTF_8
//                 )
//             );
//         }
//         catch(e) { throw e; }
//         return contextMenuJson;
//     }

//     /**
//      * Show the Host response.
//      * @param response
//      */
//     feedback(response) {
//         const self = this;
//         console.log( '[Client.js]', self.validate(response) );
//     }

//     /**
//      * Method to validate the data returned from a JSX callback
//      * to make sure it is in the expected format. All results are
//      * returned as a string. I recommend using stringified JSON
//      * as a common format between Host and Client.
//      *
//      * To make sure the return value is predictable, use:
//      *
//      *     JSON.stringify({value : 'Your return value', error: 'If there is an error'});
//      *
//      * @param data
//      */
//     validate(result) {
//         try {

//             $window.trigger('client.validate.start', result);

//             var response = new HostResponse().parse(result);

//             $window.trigger('client.validate.response', response);

//             if (response.isError()) {
//                 $window.trigger('client.validate.response.error', result);
//                 return response.getError();
//             }

//             return response.getValue();
//         }
//         catch(e) {
//             $window.trigger('client.validate.fail', result);
//             throw e;
//         }
//         finally {
//             $window.trigger('client.validate.done', result);
//         }
//     }

//     /**
//      * Initialize the extension meta data.
//      * @returns {{
//      *      mainPath,
//      *      isAutoVisible,
//      *      minWidth,
//      *      version,
//      *      windowType,
//      *      minHeight,
//      *      basePath,
//      *      maxHeight,
//      *      name,
//      *      width,
//      *      id,
//      *      height,
//      *      maxWidth
//      * }}
//      */
//     getExtension() {

//         var extPath,
//             self = this,
//             extension,
//             pluginsPath;

//         if (! self.extension) {

//             extPath = EXT_PATH;

//             self.extension = getExtension(csInterface.getExtensionID());
//             self.extension.customPath  = EXT_PATH + '/custom';
//             self.extension.pluginsPath = self.extension.customPath;
//             self.extension.plugins     = {};
//             self.extension.userData    = USER_DATA;
//             self.extension.dataDir     = EXT_DATA;

//             if (! fs.existsSync(self.extension.dataDir)) {
//                 fs.mkdirSync(self.extension.dataDir.replace(/(\s+)/g, '\\$1'), {
//                     recursive: true
//                 });
//             }
//         }

//         return self.extension;
//     }

//     /**
//      * Gets a plugin, if it is loaded.
//      * @param pluginName
//      * @returns {null|*}
//      */
//     getPlugin(pluginName) {
//         const self = this;
//         return get(
//             get(self.getExtension(), 'plugins'),
//             pluginName
//         );
//     }

//     /**
//      * Initialize the HTML UI or update with result from a JSX script callback.
//      * @param {*} result
//      */
//     init(result) {

//         try {
//             result = new Result(result);

//             if (result.isError()) {
//                 throw new Error(result.getError());
//             }

//             this.getExtension();
//         }
//         catch(e) {
//             console.error('[Client.js] Client Instance error', e);
//         }
//         finally {
//             console.log( '[Client.js] client.init.done' );
//         }
//     }

//     /**
//      * Load the Host's plugins.
//      */
//     loadHostPlugins() {
//         try {
//             return new Promise((resolve, reject) => {
//                 try {
//                     var self = this;
//                     this.getExtension();

//                     // console.log('[Client.js] self.extension.customPath', self.extension.customPath)
//                     // console.log('[Client.js] this.extension', this.extension)

//                     this.host('loadPlugins', self.extension.customPath, (result) => {
//                         // console.log('[Client.js] Client.loadHostPlugins', result);
//                         resolve(result);
//                     });
//                 }
//                 catch(e) {
//                     console.error('[Client.js] Client loadHostPlugins Promise error', e);
//                     reject(e);
//                 }
//             });
//         }
//         catch(e) {
//             console.error('[Client.js] Client loadHostPlugins error', e);
//             throw e;
//         }
//     }

//     /**
//      * Parse plugin config file and return plugins list.
//      * @param theFilePath
//      * @returns {Array|PluginArray|HTMLCollectionOf<HTMLEmbedElement>}
//      */
//     getPlugins(theFilePath, refresh) {

//         var config,
//             result,
//             plugins,
//             configs,
//             self = this;

//         try {
//             configs = JSON.parse( fs.readFileSync(theFilePath, global.kUTF_8) ).plugins;
//             plugins = new Plugins();

//             configs.forEach(function(pluginConfig, iter) {
//                 var plugin = new Plugin(pluginConfig);
//                 plugin.setPath($path.join(self.pluginsPath, plugin.name));
//                 plugins.addPlugin(plugin);
//             });

//             return plugins;
//         }
//         catch (e) {
//             console.error( '[Client.js] client.getPlugins.error', e );
//         }
//         finally {
//             console.log( 'client.getPlugins.done' );
//         }
//     }

//     /**
//      * Checks to see if a plugin has already been loaded.
//      * @param pluginName
//      * @returns {boolean}
//      */
//     hasPlugin(pluginName) {
//         if (! $is.undefined(this.plugins) && ! $is.undefined(this.plugins.plugins)) {
//             return ( this.plugins.plugins.indexOf(pluginName) >= 0 );
//         }
//         return false;
//     }

//     /**
//      * Loads in individual plugin.
//      * @param plugin
//      */
//     loadPlugin(plugin) {

//         const self = this,
//             pluginSlug = slugify(plugin.getName());

//         if ( ! Reflect.get(self.extension.plugins, pluginSlug)) {
//             Reflect.set(self.extension.plugins, pluginSlug, plugin);
//         }

//         if (self.plugins.indexOf(pluginSlug) === -1) {
//             self.plugins.push(pluginSlug);
//         }

//         if ( ! $is.undefined(plugin.getClient()) ) {
//             plugin.getClient().map(function(script) {
//                 var filePath = $path.resolve(self.pluginsPath, plugin.getName(), script);
//                 require(filePath);
//                 return script;
//             });
//         }

//         if (! $is.undefined(plugin.getStyles())) {
//             plugin.styles.forEach(function(stylesheet) {
//                 var filePath = $path.join(self.pluginsPath, plugin.getName(), stylesheet);
//                 addStylesheet( filePath );
//             });
//         }
//     }

//     /**
//      * Load user-defined plugins.
//      * @param pluginsPath
//      */
//     loadPlugins() {
//         // console.log(`[Client.js] loadPlugins started`)
//         try {
//             return new Promise((resolve, reject) => {
//                 var plugins,
//                     self = this;

//                 try {
//                     plugins = self.getPlugins(
//                         `${kEXT_PATH}/custom/plugins.json`
//                     );

//                     // console.log(`[Client.js] plugins`, plugins)

//                     plugins.plugins.map(function(plugin) {
//                         if (plugin.getDisabled()) return;
//                         self.loadPlugin(plugin);
//                     });

//                     require('../custom/iconjar/lib/client.GZIP.js');
//                     require('../custom/iconjar/lib/client.miscellaneous.js');
//                     require('../custom/iconjar/client.js');

//                     resolve(plugins);
//                 }
//                 catch(e) {
//                     console.error('[Client.js][loadPlugins]', e);
//                     reject(e);
//                 }
//             });
//         }
//         catch(e) {
//             console.error('[Client.js]', e)
//         }
//     }

//     /**
//      * Deletes a file if it exists.
//      */
//     deleteFile(filePath) {
//         try {
//             if (fs.existsSync(filePath)) {
//                 fs.unlinkSync(filePath);
//             }
//         }
//         catch(e) {
//             console.error('[Client.js][deleteFile (error)]', e.message);
//         }
//     }

//     reload() {
//         window.location.href = 'index.html';
//     }

//     /**
//      * Call the csInterface to open session.
//      * @param {string}          method      The Host.method to call
//      * @param {string|Array}    args        The argument list to pass to the Host method.
//      * @param {Function}        callback
//      */
//     host(method, args, callback) {

//         try {
//             // console.log('Instance.prototype.host', [method, args, callback]);

//             var _callback;

//             if (args instanceof Function) {
//                 callback = args;
//                 args = '';
//             }

//             _callback = new Callback(callback);

//             /*
//              * Format the arguments list as a string. Since csInterface.evalScript relies on eval(),
//              * we need the signature to be a string with valid JS syntax. Converting the arguments list
//              * to strings requires a little 'massaging'.
//              */

//             var _arguments = args;

//             /*
//              * If the arguments list is an array, we need the items but not the brackets.
//              */
//             if (args instanceof Array) {
//                 _arguments = stringify(args).slice(1, -1);
//             }
//             /*
//              * If the argument is an object, we just need it as a string.
//              */
//             else if (args instanceof Object) {
//                 _arguments = stringify(args);
//             }
//             /*
//              * Otherwise we need to quote the string.
//              */
//             else if (! $is.empty(_arguments)) {
//                 _arguments = qt(_arguments);
//             }

//             /*
//              * Call the host method via csInterface.
//              */

//             // console.log( 'Host.' + method + '(' + _arguments + ')' );

//             csInterface.evalScript('Host.' + method + '(' + _arguments + ')', _callback);
//         }
//         catch(e) { console.error(e) }
//     }

//     /**
//      * Allows you to add methods to the Host without modifying the core code.
//      *
//      *   Example:
//      *
//      *   Host.fn('helloWorld', function() {
//      *       this.logger.info("Hello World!");
//      *   });
//      */
//     fn(name, _function, overwrite) {
//         if (this.hasOwnProperty(name) && ! overwrite) {
//             console.warn(
//                 '[Client.js] Method ' + name + ' was not added because it already exists. ' +
//                 'You can over-write the method by passing `true` in the `Client.fn` call.'
//             );
//             return;
//         }
//         this[name] = _function;
//     }

//     /**
//      * Get Client method by name.
//      * @param fn
//      * @returns {(function(...[*]=))|*}
//      */
//     getMethod(fn) {
//         var self = this;
//         if (typeof self[fn] !== 'undefined' && self[fn] instanceof Function) {
//             return self[fn];
//         }
//         return function() {
//             console.log('[Client.js] Method `' + fn + '` is not defined');
//         }
//     }

//     /**
//      * Get Client property by name.
//      * @param name
//      * @returns {string|null}
//      */
//     getProperty(name) {
//         return this.hasOwnProperty(name) ? this[name] : undefined;
//     }

//     /**
//      * Add a property to the Client object, only if it does not already exist.
//      * @param property
//      * @param value
//      * @param overwrite
//      */
//     prop(property, value) {
//         this[property] = value;
//     }
// }

// function openFile(filepath) {
//     csInterface.openURLInDefaultBrowser(filepath);
// }



// /**
//  * Load user-defined plugins
//  */
// (($) => {
//     $(() => {

//         const flyoutMenu = new FlyoutMenuImpl(false);

//         /*{{kAESP_OPTIONS}}*/

//         /*{{kAESP_INVOKE}}*/

//         $('body').attr('data:aes', typeof aesp !== 'undefined');

//         csInterface.evalScript("createHostInstance()", (result) => {
//             try {
//                 Client = new ClientController($, csInterface, session);
//                 Client.analytics = new Analytics(
//                     typeof aesp !== 'undefined' ? aesp['analytics'] : undefined
//                 );

//                 window.Client = Client;

//                 Client.loadPlugins()
//                     .then((plugins) => {
//                         flyoutMenu.build()
//                         Client.loadHostPlugins()
//                             .then((result) => {
//                                 try {
//                                     Client.host('getScreenSize', function(dims) {
//                                         Client.prop('kSCREEN_SIZE', dims);
//                                     });
//                                 }
//                                 catch(e) { console.error(`[Client.js] getScreenSize error`, e)}
//                             });
//                     })
//                     .catch((error) => {
//                         throw error;
//                     })
//             }
//             catch(e) {
//                 console.error('[Client.js]', e)
//             }
//         });

//     });
// })(jQuery);
