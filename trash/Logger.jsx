/**
 * @author Scott Lewis <scott@atomiclotus.net>
 * @copyright 2018 Scott Lewis
 * @version 1.0.0
 * @url http://github.com/iconifyit
 * @url https://atomiclotus.net
 *
 * ABOUT:
 *
 *    This script creates a simple logger class.
 *
 * NO WARRANTIES:
 *
 *   You are free to use, modify, and distribute this script as you see fit.
 *   No credit is required but would be greatly appreciated.
 *
 *   THIS SCRIPT IS OFFERED AS-IS WITHOUT ANY WARRANTY OR GUARANTEES OF ANY KIND.
 *   YOU USE THIS SCRIPT COMPLETELY AT YOUR OWN RISK AND UNDER NO CIRCUMSTANCES WILL
 *   THE DEVELOPER AND/OR DISTRIBUTOR OF THIS SCRIPT BE HELD LIABLE FOR DAMAGES OF
 *   ANY KIND INCLUDING LOSS OF DATA OR DAMAGE TO HARDWARE OR SOFTWARE. IF YOU DO
 *   NOT AGREE TO THESE TERMS, DO NOT USE THIS SCRIPT.
 */
/**
 * Create a new logger instance.
 * @param name
 * @param folder
 * @constructor
 */
!(function(global, Utils, console) {
    var Logger = function(name, folder) {

        var myDocuments;

        if (Folder && Folder.myDocuments && Folder.myDocuments.absoluteURI) {
            myDocuments = Folder.myDocuments.absoluteURI;
        }

        /**
         * Default settings for the logger.
         * @type {{folder: string}}
         */
        this.defaults = {
            folder: myDocuments + "/logs"
        }

        /**
         * The log folder object.
         * @type {Folder}
         */
        this.folder = new Folder(folder || this.defaults.folder);

        /*
         * Create the log folder if it does not exist.
         */
        if (! this.folder.exists) {
            this.folder.create();
        }

        /**
         * The log file.
         * @type {File}
         */
        this.file = new File(
            this.folder.absoluteURI + "/" + name + "-" + this.dateStamp(new Date().getTime()) + ".log"
        );

        if (! this.file.exists) {
            this.create();
        }
    };

    /**
     * Creates formatted date.
     * @param date
     * @returns {string}
     */
    Logger.prototype.dateStamp = function(date, withTime) {
        function dateFormat(date) {
            var date = new Date(date);
            var theDate = [
                date.getFullYear(),
                String((date.getUTCMonth() + 1001)).slice(-2),
                String(date.getUTCDate() + 1000).slice(-2)
            ].join('-')

            if (withTime) {
                theDate += ' ' + [
                    String(date.getHours() + 1000).slice(-2),
                    String(date.getMinutes() + 1000).slice(-2),
                    String(date.getSeconds() + 1000).slice(-2)
                ].join(':')
            }

            return theDate;
        }
        return(dateFormat(date));
    }

    /**
     * Log message types.
     */
    Logger.prototype.types = {
        INFO    : 'INFO',
        WARN    : 'WARN',
        ERROR   : 'ERROR',
        INSPECT : 'INSPECT'
    }

    /**
     * Add info message to log.
     * @param message
     */
    Logger.prototype.info = function(title, message) {
        this.log(title, message, this.types.INFO);
    }

    /**
     * Add warning message to log.
     * @param message
     */
    Logger.prototype.warn = function(title, message) {
        this.log(title, message, this.types.WARN);
    }

    /**
     * Line number debug message.
     * @param lineNum
     * @param message
     */
    Logger.prototype.line = function(fileName, lineNum, message) {
        fileName = fileName.split('/').pop();
        this.log(fileName + ', ' + lineNum , message, this.types.INFO);
    }

    /**
     * Add error message to log.
     * @param message
     */
    Logger.prototype.error = function(title, message) {
        this.log(title, message, this.types.ERROR);
    }

    /**
     * Add message to log.
     * @param message
     */
    Logger.prototype.log = function(title, message, type) {

        message = typeof message === 'object' ? stringify(message) : String(message || '');
        var text = title + message;

        if (message !== undefined) {
            text = '[' + title + '] ' + message;
        }

        var typeStr = '';
        if (type === this.types.ERROR) {
            typeStr = '[' + this.types.ERROR + ']';
        }

        var dateString = this.dateStamp(new Date(), true);

        try { console.log(text) } catch(e) {}

        this.write([
            '='.repeat(21)
            , typeStr + "[" + dateString + "] " + text
        ].join("\n"));
    }

    /**
     * Single function to write all log messages.
     * @param content
     * @returns {boolean}
     */
    Logger.prototype.write = function(content) {
        var result = false;
        try {
            Utils.write_file(
                this.file.absoluteURI,
                content
            );
        }
        catch(e) {
            this.file.close();
            alert('[Logger.jsx][write] ' + e.message)
        }
        finally {
            this.file.close();
        }
        return result;
    }

    /**
     * Delete log file.
     * @returns {*|Array}
     */
    Logger.prototype.remove = function() {
        if (this.file.exists) {
            return this.file.remove();
        }
    }

    /**
     * Create the log file.
     * @param message
     */
    Logger.prototype.create = function() {
        try {
            if (! this.file.exists) {
                this.write([
                    '[Logger.jsx] Logger instance created'
                    , '[Logger.jsx] ' + '='.repeat(52)
                    , '[Logger.jsx] ' + (new Date().toLocaleString())
                    , '[Logger.jsx] ' + '='.repeat(52)
                ].join("\n"));
            }
        }
        catch(e) {
            throw new Error('[Logger.jsx][create] ' + e.message)
        }
    }

    /**
     * Prints an object to the log.
     * @param obj
     */
    Logger.prototype.inspect = function(obj) {
        for (key in obj) {
            try {
                this.log(key + ' : ' + obj[key], this.types.INSPECT);
            }
            catch(e) {
                this.log(key + ' : [' + localize({en_US: 'Internal Error'}) + ']', this.types.INSPECT);
            }

        }
    }

    /**
     * Writes log file section header.
     * @param str
     */
    Logger.prototype.header = function(str) {
        try {
            this.info('[Logger.jsx] Logger instance created');
            this.info('[Logger.jsx] ' + '='.repeat(52));
            this.info('[Logger.jsx] ' + (new Date().toLocaleString()));
            if (str) { this.info('[Logger.jsx] ' + str); }
            this.info('[Logger.jsx] ' + '='.repeat(52));
        }
        catch(e){ alert('[Host.jsx][header] ' + e.message) }
    }

    global.Logger = Logger;
})(this, Utils, console);
