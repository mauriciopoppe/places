/**
 * Constructs a segment given two points
 * @class A class that represents a segment and lots of operations related to it
 * @augments JCoreObject
 * @param {Point} startPoint
 * @param {Point} endPoint
 */

var Segment = function (startPoint, endPoint, parent) {
    /**
     * The id of the segment
     * @type String
     */
    this.id = UniqueID.create();
    /**
     * The html representation of the segment
     * @type String
     */
    this.html = null;
    /**
     * The parent of the segment if there is one
     * @type Object
     */
    this.parent = parent;
    /**
     * The start point of the segment
     * @type {Point}
     */
    this.startPoint = startPoint;
    /**
     * The end point of the segment
     * @type {Point}
     */
    this.endPoint = endPoint;
    /**
     * Marks true if the segment is Moving of the segment
     * @type {Boolean}
     */
    this.moving = false;
    /**
     * zOrder of the segment
     * @type {Integer}
     */
    this.zOrder = Shape.prototype.MAX_ZINDEX + Shape.prototype.MAX_ZINDEX;
    /**
     * the segment to the left of this segment
     * @type Segment
     */
    this.previousNeighbor = null;
    /**
     * the segment to the right of this segment
     * @type Segment
     */
    this.nextNeighbor = null;
    /**
     * Orientation of the segment
     *  * Vertical
     *  * Horizontal
     * @type {String}
     */
    this.orientation = "";
    /**
     * Not sure about this yet
     * @type ArrayList
     */
//	this.moveListeners = new ArrayList();
    /**
     * The resize Point of this segment
     * @type ResizePoint
     */
//	this.resizePoint = new ResizePoint();
    /**
     * The width of the segment
     * @type Integer
     */
    this.width = 1;

    this.graphics = null;
    /**
     * This segment style ej. "dotted", "segmented", "segmentdot"
     * @type string
     */
    this.style = null;
    /**
     * The object the segment points too, in case of helpers or ports drag
     * @type Object
     */
    this.pointsTo = null;

    this.moveHandler = null;

    /**
     * Creates an ArrayList of the intersection itself
     * intersections = ArrayList[
     *      {
     *          center: point of intersection,
     *          IdOtherConnection: id of the other connection
     *      }
     * ]
     * @type {ArrayList}
     */
    this.intersections = new ArrayList();

    this.hasMoveHandler = false;
};

Segment.prototype = new JCoreObject();
Segment.prototype.type = "Segment";

/**
 * Creates the HTML Representation of the Segment
 * @returns {Object}
 */
Segment.prototype.createHTML = function () {
    this.html = document.createElement('div');
    this.html.id = this.id;
    this.html.style.position = "absolute";
    this.html.style.left = "0px";
    this.html.style.top = "0px";
    this.html.style.height = "0px";
    this.html.style.width = "0px";
    this.html.style.zIndex = this.zOrder;
    return this.html;
};
/**
 * In charge of the painting / positioning of the figure
 * on the DOM and setting the styles
 * @returns {Segment}
 */
Segment.prototype.paint = function () {
    if (this.getHTML() === null) {
        return this;
    }
    if (this.graphics === null) {
        this.graphics = new Graphics(this.html);
    }
    //dibujas linea llamar a drawLine de la clase graphics con los puntos
    this.graphics.drawLine(this.startPoint.x, this.startPoint.y,
        this.endPoint.x, this.endPoint.y, this.style);
    this.parent.html.appendChild(this.html);
};

Segment.prototype.destroy = function () {
    $(this.html).remove();
};

Segment.prototype.paintWithIntersections = function (doNotCreateHandlers) {

    // we have to paint the segment again so destroy the previous one
    this.destroy();

    var startPoint,
        endPoint,
        diff,
        i,
        reverse = false;

    if (this.getHTML() === null) {
        return this;
    }
    if (this.graphics === null) {
        this.graphics = new Graphics(this.html);
    }

    //console.log(this.hasMoveHandler);
    if (!doNotCreateHandlers && this.hasMoveHandler) {
        this.addSegmentMoveHandler();
        console.log("in and parent is:");
        console.log(this.moveHandler.parent);
        console.log(this.moveHandler.parent.getID() === this.getID());
    }
    console.log("move handler is: ");
    console.log(this.moveHandler);


    // default differentials to split the segment
    if (this.orientation === this.HORIZONTAL) {
        diff = new Point(Shape.prototype.DEFAULT_RADIUS, 0);
        if (this.startPoint.x > this.endPoint.x) {
            reverse = true;
        }

        // for this to work we need to sort the intersections
        this.intersections.sort(function (i, j) {
            return i.center.x >= j.center.x;
        });

    } else {
        diff = new Point(0, Shape.prototype.DEFAULT_RADIUS);
        if (this.startPoint.y > this.endPoint.y) {
            reverse = true;
        }

        // for this to work we need to sort the intersections
        this.intersections.sort(function (i, j) {
            return i.center.y >= j.center.y;
        });
    }
    this.graphics.graphics.clear();

    startPoint = this.startPoint.clone();
    for (i = 0; i < this.intersections.getSize(); i += 1) {
        // if the direction is reverse then we get the
        // inverse position for i in the array
        if (reverse) {
            endPoint = this.intersections
                .get(this.intersections.getSize() - i - 1).center;
        } else {
            endPoint = this.intersections.get(i).center;
        }

        if (reverse) {
            endPoint = endPoint.add(diff);
        } else {
            endPoint = endPoint.subtract(diff);
        }
        this.graphics.drawLine(startPoint.x, startPoint.y,
            endPoint.x, endPoint.y, this.style, 0, 0, true);
        if (reverse) {
            startPoint = endPoint.subtract(diff.multiply(2));
        } else {
            startPoint = endPoint.add(diff.multiply(2));
        }
    }

    // draw last segment
    endPoint = this.endPoint.clone();
    this.graphics.drawLine(startPoint.x, startPoint.y,
        endPoint.x, endPoint.y, this.style, 0, 0, true);
    this.parent.html.appendChild(this.html);
};

Segment.prototype.addSegmentMoveHandler = function () {
    var midX = (this.startPoint.x + this.endPoint.x) / 2,
        midY = (this.startPoint.y + this.endPoint.y) / 2;
    this.moveHandler = new SegmentMoveHandler(this, this.orientation);
    midX -= this.moveHandler.width / 2;
    midY -= this.moveHandler.height / 2;
    this.moveHandler.setPosition(midX, midY);
    this.html.appendChild(this.moveHandler.getHTML());
    this.moveHandler.paint();
    this.moveHandler.attachListeners(this.moveHandler);
    return this;
};

/**
 * Returns the length of the Segment
 * @returns {Number}
 */
Segment.prototype.getLength = function () {
    var length = 0;
    return length;
};

/**
 * not sure about this yet
 * @param listener
 * @returns {Segment}
 */
Segment.prototype.attachMoveListener = function (listener) {
    return this;
};

/**
 * not sure about this yet
 * @param listener
 * @returns {Segment}
 */
Segment.prototype.detachMoveListener = function (listener) {
    return this;
};

/**
 * Fires a move event for the Segment
 * @returns {Segment}
 */
Segment.prototype.fireMoveEvent = function () {
    return this;
};

/**
 * Handler of the onDragStart Event
 * @returns {Boolean}
 */
Segment.prototype.onDragStart = function () {
    return true;
};

/**
 * Handler for the onDrag event
 */
Segment.prototype.onDrag = function () {

};

/**
 * Handler for the onDragEnd event
 */
Segment.prototype.onDragEnd = function () {

};

/**
 * Not sure about this yet
 * Handler for when other line moves
 */
Segment.prototype.onOtherLineMove = function () {

};

/**
 * Returns the HTML representation of the segment
 * @returns {String}
 */
Segment.prototype.getHTML = function () {
    if (this.html === null) {
        this.createHTML();
    }
    return this.html;
};

/**
 * Returns the ID of the element
 * @returns {String}
 */
Segment.prototype.getID = function () {
    return this.id;
};

/**
 * Returns the parent of the segment
 * @returns {Object}
 */
Segment.prototype.getParent = function () {
    return this.parent;
};

/**
 * Returns the start point of the segment
 * @returns {Point}
 */
Segment.prototype.getStartPoint = function () {
    return this.startPoint;
};

/**
 * Returns the end point of the segment
 * @returns {Point}
 */
Segment.prototype.getEndPoint = function () {
    return this.endPoint;
};

/**
 * Returns the zOrder of the segment
 * @returns {Number}
 */
Segment.prototype.getZOrder = function () {
    return this.zOrder;
};

/**
 * Returns the resizePoint of this segment
 * @returns {ResizePoint}
 */
Segment.prototype.getResizePoint = function () {
    return this.resizePoint;
};

/**
 * not sure about this
 * Returns the move listeners of this segment
 * @returns {ArrayList}
 */
Segment.prototype.getMoveListeners = function () {
    return this.moveListeners;
};

/**
 * Returns the width of the segment
 * @returns {Number}
 */
Segment.prototype.getWidth = function () {
    return this.width;
};

/**
 * Returns the style line of the segment
 * @return {string}
 */
Segment.prototype.getStyle = function () {
    return this.style;
};

//setters
/**
 * Sets the ID of the element
 * @param {String} newID
 * @returns {Segment}
 */
Segment.prototype.setID = function (newID) {
    return this;
};

/**
 * Sets the parent of the segment
 * @param {Object} newParent
 * @returns {Segment}
 */
Segment.prototype.setParent = function (newParent) {
    this.parent = newParent;
    return this;
};

/**
 * Sets the start point of the segment
 * @param {Point} newPoint
 * @returns {Segment}
 */
Segment.prototype.setStartPoint = function (newPoint) {
    return this;
};

/**
 * Sets the end point of the segment
 * @param {Point} newPoint
 * @returns {Segment}
 */
Segment.prototype.setEndPoint = function (newPoint) {
    return this;
};

/**
 * Sets the zOrder of the segment
 * @param {Number} newZOrder
 * @returns {Segment}
 */
Segment.prototype.setZOrder = function (newZOrder) {
    return this;
};/**
 * Paint Port method
 * @returns {Port}
 */

/**
 * Sets the segment to the left of this segment
 * @param {Segment} newSegment
 * @returns {Segment}
 */
Segment.prototype.setLeftNeighbor = function (newSegment) {
    return this;
};

/**
 * Sets the segment to the right of this segment
 * @param {Segment} newSegment
 * @returns {Segment}
 */
Segment.prototype.setRightNeighbor = function (newSegment) {
    return this;
};

/**
 * Sets the resizePoint of this segment
 * @param {ResizePoint} newResizePoint
 * @returns {Segment}
 */
Segment.prototype.setResizePoint = function (newResizePoint) {
    return this;
};

/**
 * not sure about this
 * Sets the move listeners of this segment
 * @param {ArrayList} newListeners
 * @returns {ArrayList}
 */
Segment.prototype.setMoveListeners = function (newListeners) {

};

/**
 * Sets the width of the segment
 * @param {Number} newWidth
 * @returns {Number}
 */
Segment.prototype.setWidth = function (newWidth) {

};

/**
 * Sets the style line of the segment
 * @param {string} newStyle
 * @returns {Segment}
 *
 */
Segment.prototype.setStyle = function (newStyle) {
    this.style = newStyle;
    return this;
};

Segment.prototype.createIntersectionWith = function (otherSegment) {
    var intersectionObject,
        intersectionPoint,
        oval;
    intersectionPoint = Geometry.segmentIntersectionPoint(this.startPoint,
        this.endPoint, otherSegment.startPoint, otherSegment.endPoint);
    intersectionObject = new Intersection(intersectionPoint,
        otherSegment.parent.getID(), this);
    this.html.appendChild(intersectionObject.getHTML());
    intersectionObject.paint();
    this.intersections.insert(intersectionObject);
    //console.log(intersectionObject);
    //console.log(this.intersections);
    return this;
};

Segment.prototype.clearIntersections = function () {
    var i,
        intersection,
        size = this.intersections.getSize();
    while (size > 0) {
        intersection = this.intersections.get(size - 1);
        $(intersection.html).remove();
        this.intersections.popLast();
        size -= 1;
    }
};