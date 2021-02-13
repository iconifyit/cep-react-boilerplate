var plugPlugExternalObject;

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
                        "message" : message + (type === 'error' ? '\n' + $.stack : ''),
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

                if (typeof title === 'string') {
                    text = title;
                }

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
