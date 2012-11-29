/**
 * Initializes a SourceSpriteDecorator with its type or a default type
 * @class Represents a decorator source for a connection in the end of it
 * @augments JCoreObject
 * @param {Connection} conn
 * @param {int} width
 */
var SourceSpriteConnectionDecorator = function (conn, type) {
    /**
     * This parameter is a connection object
     * @type object connection
     * @default connection
     */
    this.parent = conn;
    /**
     * This parameter is a type of target decorator
     * @type string ej. 'message', 'Conditional', 'Association'
     * @default type decorator
     */
    this.decoratorType = (!type) ? null : type;
    /**
     * This parameter is an array to see if the end point
     * is UP, RIGHT, BOTTOM and LEFT
     * @type array
     * @default {'0':'up', '1':'right', '2':'bottom', '3':'left'}
     */
    this.spriteDirection = {'0' : 'up', '1' : 'right',
        '2' : 'bottom', '3' : 'left'};

    this.height = 11;

    this.width = 11;

    ConnectionDecorator.call(this);
    return this;
};

SourceSpriteConnectionDecorator.prototype = new ConnectionDecorator();
SourceSpriteConnectionDecorator.prototype.type = "ConnectionDecorator";

/**
 * In charge of the painting / positioning of the figure on the
 * DOM and setting the styles
 * @returns {ConnectionDecorator}
 */
SourceSpriteConnectionDecorator.prototype.paint = function (point, direction) {
//    var f;
    if (this.getHTML() === null) {
        this.createHTML();
    }
    if (this.decoratorType === null) {
        this.html = null;
        return this;
    }
    this.html.className = "";
    this.html.className = "bpmn_zoom con_100_source_" + this.decoratorType +
        '_' + this.spriteDirection[direction];
//    f = ((direction % 2 === 0) ? ((direction === 0) ? 2 : direction % 2)
//          : direction % 2);
//    this.html.style.top = (point.y - Math.round(
//          parseInt(this.html.style.height, 10) *
//          (f / 2)) + ((f === 0) ? 0 : 1)) + 'px';
//
//    f = ((direction === 1) ? direction : (direction % 2) + 1);
//    this.html.style.left = (point.x - Math.round(
//          parseInt(this.html.style.width, 10) *
//          (f / 2)) + ((f === 0) ? 0 : 1)) + 'px';

    switch (direction) {
        case 0:
            this.html.style.top = (point.y - this.height) + "px";
            this.html.style.left = (point.x - Math.round(this.width / 2) + 1) +
                "px";
            break;
        case 1:
            this.html.style.top = (point.y - Math.round(this.height / 2)) +
                "px";
            this.html.style.left = (point.x) + "px";
            break;
        case 2:
            this.html.style.top = (point.y) + "px";
            this.html.style.left = (point.x - Math.round(this.width / 2) + 1) +
                "px";
            break;
        case 3:
            this.html.style.top = (point.y - Math.round(this.height / 2)) +
                "px";
            this.html.style.left = (point.x - this.width) + "px";
            break;
    }

    this.parent.html.appendChild(this.html);
    return this;
};
/**
 * Creates the HTML Representation of the SourceSpriteConnectionDecorator
 * @returns {ConnectionDecorator.html}
 */
SourceSpriteConnectionDecorator.prototype.createHTML = function () {
    this.html = document.createElement('div');
    this.html.id = this.id;
    this.html.style.position = "absolute";
    this.html.style.left = "0px";
    this.html.style.top = "0px";
    this.html.style.height = this.height + "px";
    this.html.style.width = this.width + "px";
    this.html.style.zIndex = "2";
    return this.html;
};
/**
 * Returns the HTML Representation of the decorator
 * @returns {String}
 */
SourceSpriteConnectionDecorator.prototype.getHTML = function () {
    if (this.html === null) {
        this.createHTML();
    }
    return this.html;
};
