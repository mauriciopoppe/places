/**
 * @class Geometry
 * A class that encapsulates most geometry functions used
 *
 * @singleton
 * @return Geometry Object
 */
var Geometry = {
    /**
     * @private
     * The number pi
     * @type {Number}
     */
    pi : Math.acos(-1),
    /**
     * @private
     * Member used for the correctness in comparison of float numbers
     * @type {Number}
     */
    eps : 1e-8,
    /**
     * Calculates the cross product of a 2-dimensional vectors
     * @param {Point} p1 First Point Object
     * @param {Point} p2 Second Point Object
     * @return {Number}
     */
    cross : function (p1, p2) {
        return p1.x * p2.y - p1.y * p2.x;
    },
    /**
     * Calculates the area of a parallelogram given three points, these three
     * points are the points that conforms the triangle that is half of the
     * parallelogram
     * @param {Point} p1
     * @param {Point} p2
     * @param {Point} p3
     * @return {Number}
     */
    area : function (p1, p2, p3) {
        var auxP2 = p2.clone(),
            auxP3 = p3.clone();
        return this.cross(auxP2.subtract(p1), auxP3.subtract(p1));
    },
    /**
     * Determines whether the point P is on segment AB
     * @param {Point} P
     * @param {Point} A
     * @param {Point} B
     * @return {Boolean}
     */
    onSegment : function (P, A, B) {
        return (Math.abs(this.area(A, B, P)) < this.eps &&
            P.x >= Math.min(A.x, B.x) && P.x <= Math.max(A.x, B.x) &&
            P.y >= Math.min(A.y, B.y) && P.y <= Math.max(A.y, B.y));
    },
    /**
     * Determines if segment AB intersects with segment CD
     * @param {Point} A
     * @param {Point} B
     * @param {Point} C
     * @param {Point} D
     * @return {Boolean}
     */
    segmentIntersection : function (A, B, C, D, strict) {

        var area1 = this.area(C, D, A),
            area2 = this.area(C, D, B),
            area3 = this.area(A, B, C),
            area4 = this.area(A, B, D);
        if (((area1 > 0 && area2 < 0) || (area1 < 0 && area2 > 0)) &&
                ((area3 > 0 && area4 < 0) || (area3 < 0 && area4 > 0))) {
            return true;
        }
        if (strict) {
            if (area1 === 0 && this.onSegment(A, C, D)) {
                return true;
            } else if (area2 === 0 && this.onSegment(B, C, D)) {
                return true;
            } else if (area3 === 0 && this.onSegment(C, A, B)) {
                return true;
            } else if (area4 === 0 && this.onSegment(D, A, B)) {
                return true;
            }
        }
        return false;

    },
    segmentIntersectionPoint: function (A, B, C, D) {
        return A.add((B.subtract(A))
            .multiply(this.cross(C.subtract(A), D.subtract(A)) /
                this.cross(B.subtract(A), D.subtract(C))));
    },
    /**
     * Determines whether a point is in a given rectangle or not given its
     * upperLeft and bottomRight corner
     * @param {Point} point
     * @param {Point} upperLeft
     * @param {Point} bottomRight
     * @return {Boolean}
     */
    pointInRectangle : function (point, upperLeft, bottomRight) {
        return (point.x >= upperLeft.x && point.x <= bottomRight.x &&
            point.y >= upperLeft.y && point.y <= bottomRight.y);
    },
    /**
     * Determines whether a point is in a circle or not given its center and
     * radius
     * @param {Point} point
     * @param {Point} center
     * @param {Number} radius
     * @returns {Boolean}
     */
    pointInCircle : function (point, center, radius) {
        return center.getDistance(point) <= radius;
    },
    /**
     * Determine whether a point is inside a rhombus or not given its center
     * and its points in clockwise order
     * @param {Point} point
     * @param {Array} rhombus
     * @param {Point} center
     * @return {Boolean}
     */
    pointInRhombus : function (point, rhombus, center) {
        var i,
            j = rhombus.length - 1,
            totalIntersections = 0;
        for (i = 0; i < rhombus.length; j = i, i += 1) {
            if (this.segmentIntersection(center, point,
                    rhombus[j], rhombus[i], true) &&
                    this.onSegment(point, rhombus[j], rhombus[i]) === false) {
                return false;
            }
        }
        return true;
    }
};

// This code publish object to be used with nodejs environment
if (typeof exports !== 'undefined') {
    module.exports = Geometry;
    var Point = require('./point.js');
}
