/**
 * @class Point
 * Class to handle points in jCore library
 *
 *        var p = new Point(100,100);
 *
 * @constructor
 * Contruct method
 * @param {Number} x x-coord of the point
 * @param {Number} y y-coord of the point
 * @return {Point}
 */
var Point = function (xCoordinate, yCoordinate) {
    /**
     * @private
     * x coordinate of the point in the plane
     */
    this.x = xCoordinate;
    /**
     * @private
     * y coordinate of the point in the plane
     */
    this.y = yCoordinate;
};
/**
 * Sets the jCore type of the object
 * @type {String}
 **/
Point.prototype.type = "Point";
/**
 * Returns the X coordinate
 * @type {Number}
 **/
Point.prototype.getX = function () {
    return this.x;
};
/**
 * Returns the Y coordinate
 * @type {Number}
 **/
Point.prototype.getY = function () {
    return this.y;
};
/**
 * Adds the other point to the one that called the function
 * @param {Point} other Point to be added to the current point
 * @returns {Point}
 */
Point.prototype.add = function (other) {
    return new Point(this.x + other.x, this.y + other.y);
};
/**
 * Subtracts the other point to the one that called the function
 * @param {Point} other Point to be subtracted to the current point
 * @returns {Point}
 */
Point.prototype.subtract = function (other) {
    return new Point(this.x - other.x, this.y - other.y);
};

/**
 * Multiplies the point with a scalar k
 * @param k
 */
Point.prototype.multiply = function (k) {
    return new Point(this.x * k, this.y * k);
};

/**
 * Determine if the points are equal
 * @param {Point} other Point to be compared with the current point
 * @returns {Boolean}
 */
Point.prototype.equals = function (other) {
    return this.x === other.x && this.y === other.y;
};
/**
 * Determine the distance between two Points
 * @param {Point} other Point to be calculated from current point
 * @returns {Number}
 **/
Point.prototype.getDistance = function (other) {
    return Math.sqrt(
        (this.x - other.x) * (this.x - other.x) +
            (this.y - other.y) * (this.y - other.y)
    );
};

/**
 * Determine the squared distance between two Points
 * @param {Point} other Point to be calculated from current point
 * @returns {Number}
 **/
Point.prototype.getSquaredDistance = function (other) {
    return (this.x - other.x) * (this.x - other.x) +
        (this.y - other.y) * (this.y - other.y);
};

/**
 * Makes this a copy of the point named other
 * @param {Point} other Point to be cloned
 * @returns {Point} This point
 */
Point.prototype.clone = function () {
    return new Point(this.x, this.y);
};

// Declarations created to instantiate in NodeJS environment
if (typeof exports !== 'undefined') {
    module.exports = Point;
}
