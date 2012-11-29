/**
 * @fileOverview This file contains the regular shape class which represents all
 * regular shapes created in the canvas such as, rectangles, ovals, ports, and
 * handlers
 */

/**
 * Initializes a regular shape
 * This class will hold all the common behavior of regular shapes
 * like rectangles or ovals
 * @augments Shape
 * @constructor
 */

var RegularShape = function () {
    Shape.call(this);
    /**
     * color of the shape
     * @type Color
     */
    this.color = new Color();
};

RegularShape.prototype = new Shape();
RegularShape.prototype.type = "RegularShape";
RegularShape.prototype.family = "RegularShape";

//getters
/**
 * Returns the color of the shape
 * @returns {Color}
 */
RegularShape.prototype.getColor = function () {
    return this.color;
};
/**
 * Sets the color of the shape
 * @returns {RegularShape}
 * @param {Color} newColor
 */
RegularShape.prototype.setColor = function (newColor) {
    if (newColor.type && newColor.type === "Color") {
        this.color = newColor;
    }
    return this;
};
