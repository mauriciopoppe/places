/**
 * Initializes a ConnectionDecorator with its type or a default type
 * @class Represents a decorator for a connection in the end of it,
 * or the start of it
 * @augments JCoreObject
 * @param {String} decType
 */


var ConnectionDecorator = function () {
    /**
     * The id of the ConnectionDecorator
     * @type String
     */
    this.id = UniqueID.create();
    /**
     * HTML Representation of the element
     */
    this.html = null;
    /**
     * HTML Representation of the element
     */
    this.direction = 0;

    this.zOrder = 3;
//	this.spriteClasses = [["clase1tupo1", "clase2tipo2"],[],[]]
};

ConnectionDecorator.prototype = new JCoreObject();
ConnectionDecorator.prototype.type = "ConnectionDecorator";

/**
 * Creates the HTML Representation of the ConnectionDecorator
 * @returns {ConnectionDecorator}
 */
ConnectionDecorator.prototype.createHTML = function () {
    //html
    return this.html;
};
/**
 * In charge of the painting / positioning of the figure on the
 * DOM and setting the styles
 * @returns {ConnectionDecorator}
 */
ConnectionDecorator.prototype.paint = function () {
    //sprite
//	this.html.className = "";
//	this.html.className = this.spriteClasses[this.decoratorType][this.direction]
    this.html.style.zIndex = this.zOrder;
    return this;
};
/**
 * Returns the HTML Representation of the decorator
 * @returns {String}
 */
ConnectionDecorator.prototype.getHTML = function () {
    return this.html;
};
/**
 * Returns the decorator type
 * @returns {String}
 */
ConnectionDecorator.prototype.getDecoratorType = function () {
    return this.decoratorType;
};

/**
 * Sets the decoration type
 * @param {Stirng} newType
 * @returns {ConnectionDecorator}
 */
ConnectionDecorator.prototype.setDecoratorType = function (newType) {
    return this;
};
