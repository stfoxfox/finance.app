/**
 * Define highWay if it hasn't already been created
 * @type {highWay|*|{}}
 */
var highWay = window.highWay || {};

/**
 * Array with the subscriptions to keep track off and auto (re)subscribe when (re)connected
 * @type Array
 */
highWay.subscriptions = [];

/**
 * Array with onconnect listeners
 * @type Array
 */
highWay.onconnectListeners = [];

/**
 * Array with onhangup listeners
 * @type Array
 */
highWay.onhangupListeners = [];

/**
 * connect to the websocket server and call onconnect and onhangup callbacks when they occur
 *
 * @returns void
 */
highWay.connect = function() {
    var connection = new autobahn.Connection({
        transports: [
            {
                'type': 'websocket',
                'url': AUTOBAHN_WS_URL
            },
            {
                'type': 'longpoll',
                'url': AUTOBAHN_HTTP_URL
            }
        ],
        //use_deferred: jQuery.Deferred,
        max_retries: -1,
        realm: 'konstruktor',
        authmethods: ["konstruktor"],
        onchallenge: function (session, method, extra) {
            if(AUTOBAHN_KEY != ''){
                return AUTOBAHN_KEY;
            } else {
                return 'anonymous';
            }
        }
    });
    connection.onopen = function(session) {
        highWay.session = session;
        highWay.onconnect();
    }
    connection.onclose = function (reason, details) {
        highWay.onhangup(reason, details);
    }
    connection.open();
    highWay.connection = connection;
};

/**
 * onhangup callback notifies all listeners about a succesful connection, subscribed to any listed in subscriptions
 *
 * @returns void
 */
highWay.onconnect = function() {
    for (var i in highWay.onconnectListeners) {
        highWay.onconnectListeners[i](highWay.session);
    }

    for (var j in highWay.subscriptions) {
        highWay.session.subscribe(highWay.subscriptions[j].topic, highWay.subscriptions[j].callback);
    }
};

/**
 * onhangup callback notifies all listeners about a hangup
 *
 * @param int code hangup code
 * @param string reason hangup text reason
 * @returns void
 */
highWay.onhangup = function(code, reason) {
    for (var i in highWay.onhangupListeners) {
        highWay.onhangupListeners[i](reason, details);
    }
};

/**
 * Wrapper around AB's session.call method
 */
highWay.call = function() {
    return highWay.session.call.apply(highWay.session, arguments);
};

/**
 * Wrapper around AB's session.subscribe method
 */
highWay.subscribe = function() {
    highWay.subscriptions.push({
        topic: arguments[0],
        callback: arguments[1]
    });

    if (highWay.session && highWay.session._websocket_connected) {
        highWay.session.subscribe.apply(highWay.session, arguments);
    }
};

/**
 * Wrapper around AB's session.unsubscribe method
 */
highWay.unsubscribe = function() {
    highWay.session.unsubscribe.apply(highWay.session, arguments);
};

/**
 * Wrapper around AB's session.publish method
 */
highWay.publish = function() {
    highWay.session.publish.apply(highWay.session, arguments);
};

highWay.isOpen = function() {
    return highWay.connection.isOpen;
};

/**
 * Connect to the websocket server
 */
highWay.connect();
