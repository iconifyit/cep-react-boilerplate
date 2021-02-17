/*
 * Usage:
 *
 * You can load this class either via html <script/> tag:
 *     <script src="path/to/jsx-console.js"></script>
 *
 * Or Using require:
 *     const jsxConsole = require('/path/to/jsx-console/jsx-console.js');
 *
 * Then, in your JSX code, use the console object the same as you would the browser console class.
 *
 * console.log('Some log message')
 * console.warning('You should be careful')
 * console.info('This is pretty useful')
 * console.error('Oops. Something went wrong')
 *
 * NOTE: You must include the CSInterface class first.
 */

/**
 * JSX error class
 */
class JsxError extends Error {
    /**
     * Accepts the same arguments as JS native Error class.
     * @param args
     */
    constructor(...args) {
        super(...args)
        Error.captureStackTrace(this, JsxError)
    }
}

/**
 * The JSX console class. This loads in the JS/Client portion of your extension. The JSX/Host portion is eval'ed so
 * there is nothing else to include.
 */
class JsxConsole {
    constructor() {

        csInterface.evalScript(this.jsxConsoleCode(), function(result) {
            console.log('JsxConsole loaded?')
        })

        csInterface.removeEventListener('jsx.console', this.handler);
        csInterface.addEventListener('jsx.console', this.handler);

        this.handler  = this.handler.bind(this);
    }

    jsxConsoleCode() {
        return `var plugPlugExternalObject;
            !(function(global) {
                try {
            
                    if (! global.plugPlugExternalObject) {
                        try {
                            global.plugPlugExternalObject = new ExternalObject('lib:' + 'PlugPlugExternalObject');
                        }
                        catch (e) { throw e }
                    }
            
                    var Types = {
                        LOG   : 'log',
                        INFO  : 'info',
                        ERROR : 'error',
                        WARN  : 'warn',
                        DEBUG : 'debug'
                    };
            
                    function __getTimeString() {
                        var date = new Date();
                        return [
                            String(date.getHours() + 1000).slice(-2),
                            String(date.getMinutes() + 1000).slice(-2),
                            String(date.getSeconds() + 1000).slice(-2)
                        ].join(':');
                    }
            
                    var console = {
            
                        dispatch : function(type, message) {
                            try {
                                var event  = new CSXSEvent();
                                event.type = 'jsx.console';
                                event.data = JSON.stringify({
                                    "type"    : type,
                                    "message" : message + (type === 'error' ? '\\n' + $.stack : ''),
                                    "stack"   : $.stack
                                });
                                event.dispatch()
                            }
                            catch(e) { throw e }
                        },
            
                        log : function(title, message, type) {
            
                            var text = '[empty message]';
            
                            if (typeof type === 'undefined') {
                                type = Types.LOG;
                            }
            
                            title = '[HOST] ' + (typeof title === 'string' ? title : '');
            
                            if (typeof message === 'object') {
                                message = stringify(message);
                            }
            
                            if (typeof message === 'string') {
                                text = title  + ' : ' + message;
                            }
            
                            var dateString = __getTimeString();
            
                            return console.dispatch(type, '[' + type + '][' + dateString + '] ' + text);
                        },
            
                        info : function(title, message) {
                            console.log(title, message, Types.INFO)
                        },
            
                        error : function(title, message) {
                            console.log(title, message, Types.ERROR)
                        },
            
                        debug : function(title, message) {
                            console.log(title, message, Types.DEBUG)
                        },
            
                        warn : function(title, message) {
                            console.log(title, message, Types.WARN)
                        }
                    }
            
                    global.console = console;
                }
                catch(e) {alert(e)}
            })(this);
        `
    }

    handler(event) {
        const validate = (fn) => {
            if (typeof fn !== 'string') {
                throw new Error('Invalid console method called');
            }
            fn = fn.toLowerCase();
            const methods = [
                'log',
                'error',
                'info',
                'warn',
                'debug'
            ];
            if (methods.indexOf(fn) >= 0) {
                return fn;
            }
            throw new Error('Invalid console method called');
        }

        const data = event.data;

        let fn;
        if (fn = validate(data.type)) {
            switch(fn) {
                case 'error':
                    console.error(new JsxError(data.message));
                    break;
                case 'log':
                    console.log(data.message);
                    break;
                case 'info':
                    console.info(data.message);
                    break;
                case 'warn':
                    console.warn(data.message);
                    break;
                case 'debug':
                    console.debug(data.message);
                    break;
            }
        }
        else {
            throw new Error('Invalid console method called');
        }
    }
}

module.exports = new JsxConsole();
