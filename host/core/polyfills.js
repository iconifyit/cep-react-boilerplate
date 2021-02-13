var polyfills = {loaded: true};

/**
 * Adds replaceAll method to String
 * @param search
 * @param replacement
 * @returns {string}
 */
if (! String.prototype.replaceAll) {
    String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.replace(new RegExp(search, 'g'), replacement);
    };
}

/**
 * Adds trim function to the String class.
 * @returns {string}
 */
if (! String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
}

/**
 * Adds String().repeat method to String's prototype.
 */
if (! String.prototype.repeat) {
    String.prototype.repeat = function(n) {
        return new Array(++n).join(this);
    }
}

/**
 * Adds a method to star out a string (like a password).
 * @returns {string}
 */
if (! String.prototype.obfuscate) {
    String.prototype.obfuscate = function() {
        return this.replace(/./g, "*");
    };
}

/**
 * Capitalize first letter of each word.
 */
if (! String.prototype.toTitleCase) {
    String.prototype.toTitleCase = function() {
        return this.replace(/\w\S*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1);
        });
    };
}

/**
 * Add method to test if a number is between two values.
 */
if (! Number.prototype.between) {
    Number.prototype.between = function(a, b, inclusive) {
        var min = Math.min(a, b),
            max = Math.max(a, b);
        return inclusive ? this >= min && this <= max : this > min && this < max;
    }
}

/*
 * Array polyfills.
 */

if (! Array.prototype.map) {
    /**
     * Add map method to Array prototype.
     * @param fn
     */
    Array.prototype.map = function(fn) {
        for (var i = 0; i < this.length; i++) {
            this[i] = fn.call(this, this[i]);
        }
        return this;
    }
}

/**
 * Array.prototype.forEach() polyfill
 * @author Chris Ferdinandi
 * @license MIT
 */
if (! Array.prototype.forEach) {
    Array.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || null;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

/**
 * Add Array.indexOf support if not supported natively.
 */
if (! Array.prototype.indexOf) {
    /**
     * Gets the index of an element in an array.
     * @param what
     * @param i
     * @returns {*}
     */
    Array.prototype.indexOf = function(what, i) {
        i = i || 0;
        var L = this.length;
        while (i < L) {
            if(this[i] === what) return i;
            ++i;
        }
        return -1;
    };
}

/**
 * Add Array.remove support.
 * @returns {Array}
 */
if (! Array.prototype.remove) {
    Array.prototype.remove = function() {
        var what, a = arguments, L = a.length, ax;
        while (L && this.length) {
            what = a[--L];
            while ((ax = this.indexOf(what)) !== -1) {
                this.splice(ax, 1);
            }
        }
        return this;
    };
}


/**
 * Array filter polyfill.
 */
if (! Array.prototype.filter) {
    Array.prototype.filter = function(func, thisArg) {
        'use strict';
        if ( ! ((typeof func === 'Function' || typeof func === 'function') && this) )
            throw new TypeError();

        var len = this.length >>> 0,
            res = new Array(len), // preallocate array
            t = this, c = 0, i = -1;

        var kValue;
        if (thisArg === undefined){
            while (++i !== len){
                // checks to see if the key was set
                if (i in this){
                    kValue = t[i]; // in case t is changed in callback
                    if (func(t[i], i, t)){
                        res[c++] = kValue;
                    }
                }
            }
        }
        else{
            while (++i !== len){
                // checks to see if the key was set
                if (i in this){
                    kValue = t[i];
                    if (func.call(thisArg, t[i], i, t)){
                        res[c++] = kValue;
                    }
                }
            }
        }

        res.length = c; // shrink down array to proper size
        return res;
    };
}

/**
 * Polyfill for Object.keys
 *
 * @see: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/keys
 */
if (! Object.keys) {
    Object.keys = (function () {
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
            dontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ],
            dontEnumsLength = dontEnums.length;

        return function (obj) {
            if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object');

            var result = [];

            for (var prop in obj) {
                if (hasOwnProperty.call(obj, prop)) result.push(prop);
            }

            if (hasDontEnumBug) {
                for (var i=0; i < dontEnumsLength; i++) {
                    if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i]);
                }
            }
            return result;
        }
    })()
}

if (! Object.create) {
    Object.create = function (proto, propertiesObject) {
        if (typeof proto !== 'object' && typeof proto !== 'function') {
            throw new TypeError('Object prototype may only be an Object: ' + proto);
        } else if (proto === null) {
            throw new Error("This browser's implementation of Object.create is a shim and doesn't support 'null' as the first argument.");
        }

        if (typeof propertiesObject != 'undefined') {
            throw new Error("This browser's implementation of Object.create is a shim and doesn't support a second argument.");
        }

        function F() {}
        F.prototype = proto;

        return new F();
    };
}

/**
 * Object.assign() polyfill
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 */
if (! Object.assign) {
    // Must be writable: true, enumerable: false, configurable: true
    Object.assign = {
        value: function assign(target, varArgs) { // .length of function is 2
            'use strict';
            if (target == null) { // TypeError if undefined or null
                throw new TypeError('Cannot convert undefined or null to object');
            }

            var to = Object(target);

            for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index];

                if (nextSource != null) { // Skip over if undefined or null
                    for (var nextKey in nextSource) {
                        // Avoid bugs when hasOwnProperty is shadowed
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        },
        writable: true,
        configurable: true
    };
}

/**
 * Object.entries() polyfill
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
 */
if (! Object.entries) {
    Object.entries = function( obj ){
        var ownProps = Object.keys( obj ),
            i = ownProps.length,
            resArray = new Array(i); // preallocate the Array
        while (i--)
            resArray[i] = [ownProps[i], obj[ownProps[i]]];

        return resArray;
    };
}