/**
 * @class Represents the router used for connections
 * @augments JCoreObject
 */
var Router = function () {

};

Router.prototype = new JCoreObject();
Router.prototype.type = "Router";

/**
 * Creates the route given the connection
 * @param {Connection} connection
 * @returns {Boolean}
 */
Router.prototype.createRoute = function (connection) {
    return true;
};
