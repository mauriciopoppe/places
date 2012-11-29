
/**
 * Initializes A BPMN Group Element
 * @class Class that holds the behavior of the different grouping elements
 * found in BPMN like groups, lanes and lane sets
 * @param ResizeHandlerNumber
 */

var BPMNGroupElement = function (ResizeHandlerNumber) {

    BPMNShape.call(this, ResizeHandlerNumber);

    this.graphic = null;
    this.container = true;
    this.zoom = 1;
    this.resizable = true;

    this.defaultZOrder = 4;
    this.zOrder = 4;
    this.containerType = null;
    this.focus = true;
};
BPMNGroupElement.prototype = new BPMNShape();
BPMNGroupElement.prototype.type = "BPMNGroupElement";
BPMNGroupElement.prototype.family = "BPMNGroupElement";

/**
 * Create JsGraphic object for BPMNGroupElement (POOL, LANE, PARTICIPANT, GROUP)
 * @param {String} id
 * @returns {BPMNGroupElement}
 */
BPMNGroupElement.prototype.createJsGraphics = function (id) {
    this.graphic = new jsGraphics(id);
    return this;
};


/**
 * Creates the corresponding html for the bpmn group element
 * @return {*}
 */
BPMNGroupElement.prototype.createHTML = function () {

    BPMNShape.prototype.createHTML.call(this);
    return this.html;
};
/**
 * set color of wzGraphic element into the layer
 * @param {String} newColor
 * @returns {BPMNGroupElement}
 */
BPMNGroupElement.prototype.setColor = function (newColor) {
    this.graphic.setColor(newColor);
    this.repaint();
    return this;
};
/**
 * Set ID to BPMNGroupElement object
 * @param {String} id
 * @returns {BPMNGroupElement}
 */
BPMNGroupElement.prototype.setID = function (id) {
    this.id = id;
    return this;
};
/**
 * Apply zoom to draw a figure in BPMNGroupElement object
 * @param {Integer} value
 * @returns {Integer}
 */
BPMNGroupElement.prototype.applyZoom = function (value) {
    return this.zoom * value;
};
/**
 * Sverify if is a shape is container
 * @returns {Boolean}
 */
BPMNGroupElement.prototype.isContainer = function () {
    return this.container;
};
/**
 * In charge of the painting / positioning of the figure on the DOM and setting
 * the styles
 * @returns {BPMNGroupElement}
 */
BPMNGroupElement.prototype.paint = function () {
    return this;
};
/**
 * Resize the group according to the intersection of a shape to its boundaries
 * @param {Shape} shape
 * @returns {BPMNGroupElement}
 */
BPMNGroupElement.prototype.resizeGroup = function (shape) {
    return this;
};

// TODO: Fix label dimensions after text change
// TODO: Fix groupElement dimensions after label change
BPMNGroupElement.prototype.updateResizeListener = function (groupElement) {
    BPMNSubProcess.prototype.updateResizeListener.call(this, groupElement);
};

/**
 * Sets the background-color for this group element
 * @param color
 * @return {*}
 */
BPMNGroupElement.prototype.setBackground = function (color) {
    this.html.style.background = color;
    return this;
};
/**
 * Sets paintable atribute to container
 * @param {boolean} paintable
 * @return {*}
 */
BPMNGroupElement.prototype.setFocus = function (focus) {
    this.focus = focus;
    return this;
};
/**
 * Determines the drag behavior of the element
 * @param clickedPoint
 * @return {Number}
 */
BPMNGroupElement.prototype.determineDragBehavior = function (clickedPoint) {
    //the limit applied according to the zoom scale
    var limit = this.limits[2];
    //if the point is in the inner rectangle then we just drag
    if (Geometry.pointInRectangle(clickedPoint, new Point(limit, limit),
        new Point(this.width - limit, this.height - limit))) {
        return this.DRAG;
    }
    //if the point is in the outer rectangle then we just connect
    if (Geometry.pointInRectangle(clickedPoint, new Point(0, 0),
        new Point(this.width, this.height))) {
        return this.CONNECT;
    }
    //if the user clicked outside the shape we just cancel
    return this.CANCEL;
};


/**
 * Defines the port position where we will locate the port regarding this
 * group element, according to the point where the connection was started or
 * dropped
 * @param port
 * @param point
 * @return {*}
 */
BPMNGroupElement.prototype.definePortPosition = function (port, point) {
    var shapeSide,
        xCoordinate,
        yCoordinate,
        minDist,
        direction,
        i,
        coordinate,
        value;


    //this array will be used to determine to which side the point that was
    // clicked is closer, top, right, bottom, left
    shapeSide = [0, this.realWidth, this.realHeight, 0];
    //the next two arrays will be used to calculate the port final position
    xCoordinate = [point.x, this.realWidth, point.x, 0];
    yCoordinate = [0, point.y, this.realHeight, point.y];
    //minDist will store the minimum distance so far to one side of the shape
    minDist = point.y;
    //this will store the direction determined so far
    direction = this.TOP;
    //calculates to which side we should add the port to
    for (i = 1; i < 4; i += 1) {
        coordinate = (i % 2) ? point.x : point.y;
        value = Math.abs(shapeSide[i] - coordinate);
        if (minDist > value) {
            minDist = value;
            direction = i;
        }
    }

    port.setPosition(xCoordinate[direction] - port.width / 2,
                     yCoordinate[direction] - port.height / 2);
    //Subtract the wide of the CSS border to get the original starting point
//    port.setAbsolutePosition(port.x + this.x, port.y + this.y);
    port.setDirection(direction);
    port.determinePercentage();

    return this;
};




BPMNGroupElement.prototype.getLeft = Shape.prototype.getAbsoluteX;
BPMNGroupElement.prototype.getTop = Shape.prototype.getAbsoluteY;

BPMNGroupElement.prototype.getFocus = function () {
    return this.focus;
};
