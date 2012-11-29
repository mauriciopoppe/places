/**
 * This file contains the jCore Object that holds the common behavior and
 * constants among all the elements in the designer
 */

/**
 * This class will contain all the common behaviors and constants among all
 * the elements in the designer
 * @constructor
 */

JCoreObject = function () {
    /**
     * Properties for a jCore Element according to the applied zoom
     * @type array
     */
    this.elementProperties = [{}, {}, {}, {}, {}];


};

/** Object in charge of drawing lines and regular shapes */
JCoreObject.prototype.graphics = new Graphics();
/**
 * Determine the minimum sum that can be applied
 */
JCoreObject.prototype.minZoom = 50;
/**
 * Determine the number of zoom scales available
 */
JCoreObject.prototype.zoomScales = 5;

/**
 * Determine the zoom increasing factor
 */

JCoreObject.prototype.zoomIncreaseFactor = 25;

/**
 * Static variable among the designer that assigns a value that represents
 * the TOP direction
 * @type number
 */
JCoreObject.prototype.TOP = 0;
/**
 * Static variable among the designer that assigns a value that represents
 * the RIGHT direction
 * @type number
 */
JCoreObject.prototype.RIGHT = 1;
/**
 * Static variable among the designer that assigns a value that represents
 * the BOTTOM direction
 * @type number
 */
JCoreObject.prototype.BOTTOM = 2;
/**
 * Static variable among the designer that assigns a value that represents
 * the LEFT direction
 * @type number
 */
JCoreObject.prototype.LEFT = 3;
/**
 * Static variable among the designer that assigns a value that represents the
 * VERTICAL orientation
 * @type {Number}
 */
JCoreObject.prototype.VERTICAL = 0;
/**
 * Static variable among the designer that assigns a value that represents the
 * HORIZONTAL orientation
 * @type {Number}
 */
JCoreObject.prototype.HORIZONTAL = 1;


/**
 * Creates an id for an element given its type
 * @param {String} typeDesc
 * @returns {String}
 */

JCoreObject.prototype.createID = function (typeDesc) {
    var id = "";
    return id;

};
/**
 * Returns the jCore element properties
 * @returns array
 */

JCoreObject.prototype.getElementProperties = function () {
    return this.elementProperties;

};
/**
 * Sets the jCore element properties
 * @param {array} newProperties
 * @returns {jCoreObject}
 */

JCoreObject.prototype.setElementProperties = function (newProperties) {
    this.elementProperties = newProperties;
    return this;

};
var poolHead = 45;

var poolColor = "#000000";
var participantColor   = "#a0a0a0";
var overContainerColor = "#67FF01";

