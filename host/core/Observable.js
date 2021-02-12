(function(global) {

    /**
     * @constructor
     */
    var Observable = function(){}

    /**
     * Subscribe to internal state changes.
     * @param {string}      name        Event name.
     * @param {Function}    notifier    The notifier function to call.
     */
    Observable.prototype.subscribe = function(name, notifier) {
        try {
            var self = this;
            var isSubscribed = false;

            if (typeof self.notifiers[name] === 'undefined') {
                self.notifiers[name] = [];
            }

            self.notifiers[name].map(function(_notifier) {
                if (_notifier === notifier) isSubscribed = true;
            });

            if (! isSubscribed ) self.notifiers[name].push(notifier);
        }
        catch(e) { console.error(e); throw e; }
    }

    /**
     * Subscribe to internal state changes.
     * @param {Function} notifier   The notifier function to call.
     */
    Observable.prototype.unsubscribe = function(name, notifier) {
        try {
            var self = this;

            var notifiers = [];

            if (typeof self.notifiers[name] === 'undefined') {
                return;
            }

            self.notifiers[name].map(function(_notifier) {
                if (_notifier === notifier) return;
                notifiers.push(_notifier);
            });

            self.notifiers[name] = notifiers;
        }
        catch(e) { console.error(e); throw e; }
    }

    /**
     * notifyAll subscribers.
     * @returns null
     */
    Observable.prototype.notifyAll = function() {
        var self = this;
        for (var name in self.notifiers) {
            self.notifiers[name].map(function(notifier) {
                if (logger !== undefined)
                    logger.info('IconJarView.notify calling ', notifier);
                notifier.call( self, self );
            });
        }
    }

    /**
     * notifyAll subscribers.
     * @returns null
     */
    Observable.prototype.notify = function(name, data) {
        var self = this;

        var notifiers = self.getNotifiers(name);

        if (typeof notifiers === 'undefined') {
            return;
        }

        notifiers.map(function(notifier) {
            if (logger !== undefined)
                logger.info('IconJarView.notify calling ', name);
            notifier.call( self, data );
        });
    }

    /**
     * Get all notifiers.
     * @returns {*[]}
     */
    Observable.prototype.getNotifiers = function(name) {
        var self = this,
            value = [];

        if (typeof self.notifiers === 'undefined') {
            self.notifiers = [];
        }

        if (name && typeof self.notifiers[name] === 'undefined') {
            self.notifiers[name] = [];
        }

        return name ? self.notifiers[name] : self.notifiers;
    }

    /**
     * Delete all notifiers.
     * @returns {*[]}
     */
    Observable.prototype.clearNotifiers = function(name) {
        if (name === undefined) {
            self.notifiers = [];
        }
        else {
            self.notifiers[name] = [];
        }
        return self.notifiers;
    }

    global.Observable = Observable;

})(this);
