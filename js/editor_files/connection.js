/**
 * Initializes a connection given its ports
 * @class Class that represents a connections between two BPMN Classes
 * @augments JCoreObject
 * @param {Port} start
 * @param {Port} end
 */

var Connection = function (start, end, canvas) {
    /**
     * The id of the connection
     * @type String
     */
    this.id = UniqueID.create();
    /**
     * The html representation of the connection
     * @type String
     */
    this.html = null;
    /**
     * The source port of the connection
     * @type Port
     */
    this.sourcePort = start;
    /**
     * The end port of the connection
     * @type Port
     */
    this.endPort = end;

//  this.endPort.setConnection(this);
//
//  this.sourcePort.setConnection(this);

    /**
     * The decorator of the source of the connection
     * @type ConnectionDecorator
     */
    this.sourceDecorator = null;
    /**
     * The decorator of the target of the connection
     * @type ConnectionDecorator
     */
    this.targetDecorator = null;
    /**
     * List of the lines that forms the connection
     * @type ArrayList
     */
    this.lineSegments = new ArrayList();
    /**
     * The resize point located in the source of the connection
     * @type ResizePoint
     */
    //this.startResizePoint = new ResizePoint();
    /**
     * The resize point located in the target of the connection
     * @type ResizePoint
     */
    //this.endResizePoint = new ResizePoint();
    /**
     * The connection type regarding BPMN purposes
     * @type String
     */
    this.connectionType = "default";
    /**
     * The canvas this connection belongs to
     * @type Canvas
     */
    this.canvas = canvas;
    /**
     * This segment style ej. "dotted", "segmented", "segmentdot"
     * @type string
     */
    this.styleSegments = null;

    start.setConnection(this);

    end.setConnection(this);
    /**
     * Denotes if the shape can be a container itself
     * @type boolean
     */
    this.container = false;

    /**
     * default zIndex of the connection
     * @type {Number}
     */
    this.defaultZOrder = 2;

    /**
     * Current zIndex of the connection
     * @type {Number}
     */
    this.zOrder = 2;
    /**
     * ArrayList which contains the ids of the Connections it has an
     * intersection with
     * intersectionWith = ArrayList[
     *      connection: {Object} intersection with this connection
     * ]
     * @type {ArrayList}
     */
    this.intersectionWith = new ArrayList();
};

Connection.prototype = new JCoreObject();
Connection.prototype.type = "Connection";

/**
 * Router associated with the connection
 * @type Router
 */
Connection.prototype.router = new ManhattanConnectionRouter(); //new Router();

/**
 * Creates the HTML Representation of the Connection
 * @returns {Connection}
 */
Connection.prototype.createHTML = function () {
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

Connection.prototype.setSegmentMoveHandlers = function () {
    var i,
        currentSegment,
        orientationOptions = [this.HORIZONTAL, this.VERTICAL],
        segmentOrientation = (this.endPort.direction === this.TOP ||
            this.endPort.direction === this.BOTTOM) ? 1 : 0;
    for (i = this.lineSegments.getSize() - 1; i >= 0; i -= 1) {
        currentSegment = this.lineSegments.get(i);
        currentSegment.orientation =
            orientationOptions[segmentOrientation];
        currentSegment.hasMoveHandler = false;

        // set prev and next segments
        if (i < this.lineSegments.getSize() - 1 && i > 0) {
            currentSegment.nextNeighbor = this.lineSegments.get(i + 1);
            currentSegment.previousNeighbor = this.lineSegments.get(i - 1);
            currentSegment.hasMoveHandler = true;
            currentSegment.addSegmentMoveHandler();
        }
        segmentOrientation = 1 - segmentOrientation;
    }
    return this;
};

Connection.prototype.isContainer = function () {
    return this.container;
};

Connection.prototype.showMoveHandlers = function () {
    var i,
        currentHandler;
    for (i = 0; i < this.lineSegments.getSize(); i += 1) {
        currentHandler = this.lineSegments.get(i).moveHandler;
        if (currentHandler) {
            currentHandler.setVisible(true);
        }
    }
    return this;
};

/**
 * In charge of the painting / positioning of the figure on the
 * DOM and setting the styles
 * @returns {Connection}
 */
Connection.prototype.paint = function () {
    try {
        if (this.getHTML() === null) {
            this.createHTML();
        }
        //Delete de childs on the DIV is exists
//        while(this.html.hasChildNodes())
//        {
//            this.html.removeChild(this.html.lastChild);
//        }
        $(this.html).empty();

        this.oldPoint = null;

        // Use the internal router if any has been set....
        this.router.createRoute(this);
        // paint the decorator if any exists
        if (this.targetDecorator !== null) {
            this.targetDecorator.paint(this.endPort.getPoint(false),
                this.endPort.direction, this);
        }

        if (this.sourceDecorator !== null) {
            this.sourceDecorator.paint(this.sourcePort.getPoint(false),
                this.sourcePort.direction, this);
        }

        this.oldPoint = null;
        //add DIV to canvas
        //this.addToCanvas();

    } catch (e) {
        console.log(e.message);
    }
    return this;
};
/**
 * Removes the connection between the two figures
 * and delete the corresponding ports
 * @returns {Boolean}
 */
Connection.prototype.disconnect = function (isBeingDragged) {
    if (!isBeingDragged) {
        this.clearAllIntersections();
    }
    this.lineSegments.clear();
    $(this.html).empty();
    return this;
};


/**
 * Connects two BPMN Figures
 * @returns {Connection}
 */
Connection.prototype.connect = function () {
    this.paint();
    this.setSegmentMoveHandlers();
    return this;
};
/**
 * Add a segment to the current connection
 * @param {Point} point
 * @returns {Connection}
 */
Connection.prototype.addSegment = function (point) {

    var p, s;
    p = new Point(parseInt(point.x, 10), parseInt(point.y, 10));

    if (this.oldPoint !== null) {
        //draw line to connection Div
        s = new Segment(new Point(this.oldPoint.x, this.oldPoint.y), p, this);
        s.setStyle(this.styleSegments);
        s.paint();

        this.lineSegments.insert(s);
    }

    this.oldPoint = {};
    this.oldPoint.x = p.x;
    this.oldPoint.y = p.y;
};
/**
 * Remove a given segment in this connection
 * @param segment
 */
Connection.prototype.removeSegment = function (segment) {
    return this;
};

/**
 * destroy a  connecction
 * @param segment
 */
Connection.prototype.destroy = function () {
    hideSelectedPorts(this.canvas);
    this.canvas.removeConnection(this);
    //this.canvas.removeShape(this);
    this.sourcePort.destroy(); //destroy sourcePort
    this.endPort.destroy(); //destroy endPort

    $(this.html).remove();  //delete to html
    this.canvas.updatedElement = this;
    $(this.canvas.html).trigger("removeelement");

    return this;
};

Connection.prototype.clear = function () {
    //eliminar todo lo que esta dentro del html de connection
};

/**
 * Returns a list of all the intersections that the connection has with other connections
 * @returns {ArrayList}
 */
Connection.prototype.getIntersections = function () {
    var intersections = new ArrayList();
    return intersections;
};
/**
 * Handler to call when other figure related to this connection is moved
 * @returns {Connection}
 */
Connection.prototype.onOtherFigureMove = function () {
    return this;
};

//getters
/**
 * Returns the id of the connection
 * @returns {String}
 */
Connection.prototype.getID = function () {
    return this.id;
};
/**
 * Returns the html representation of the connection
 * @returns {String}
 */
Connection.prototype.getHTML = function () {
    if (this.html === null) {
        this.createHTML();
    }
    return this.html;
};
/**
 * returns the source port of the connection
 * @returns {Port}
 */
Connection.prototype.getSourcePort = function () {
    return this.sourcePort;
};
/**
 * returns the end port of the connection
 * @returns {Port}
 */
Connection.prototype.getEndPort = function () {
    return this.endPort;
};
/**
 * Returns the source decorator of the connection
 * @returns {ConnectionDecorator}
 */
Connection.prototype.getSourceDecorator = function () {
    return this.sourceDecorator;
};
/**
 * Returns the target decorator of the connection
 * @returns {ConnectionDecorator}
 */
Connection.prototype.getTargetDecorator = function () {
    return this.targetDecorator;
};
/**
 * Returns a list of the lines associated with this connection
 * @returns {ArrayList}
 */
Connection.prototype.getLineSegments = function () {
    return this.lineSegments;
};
/**
 * Returns the start resize point of the connection
 * @returns {ResizePoint}
 */
Connection.prototype.getStartResizePoint = function () {
    return this.startResizePoint;
};
/**
 * Returns the end resize point of the connection
 * @returns {ResizePoint}
 */
Connection.prototype.getEndResizePoint = function () {
    return this.endResizePoint;
};
/**
 * Returns the connection type
 * @returns {String}
 */
Connection.prototype.getConnectionType = function () {
    return this.connectionType;
};
/**
 * Returns the canvas of the connection
 * @returns {Canvas}
 */
Connection.prototype.getCanvas = function () {
    return this.canvas;
};
/**
 * Returns the style line of the segment
 * @return {string}
 */
Connection.prototype.getStyleSegments = function () {
    return this.styleSegments;
};

//setters

/**
 * Sets the id of the connection
 * @returns {Connection}
 */
Connection.prototype.setID = function (newID) {
    return this;
};

/**
 * Sets the source port of the connection
 * @returns {Connection}
 */
Connection.prototype.setSourcePort = function (newPort) {
    return this;
};
/**
 * Sets the end port of the connection
 * @returns {Connection}
 */
Connection.prototype.setEndPort = function (newPort) {
    return this;
};
/**
 * Sets the source decorator of the connection
 * @returns {Connection}
 */
Connection.prototype.setSourceDecorator = function (newDecorator) {
    if (newDecorator.type === 'ConnectionDecorator') {
        this.sourceDecorator = newDecorator;
    }
    return this;
};
/**
 * Sets the target decorator of the connection
 * @returns {Connection}
 */
Connection.prototype.setTargetDecorator = function (newDecorator) {
    if (newDecorator.type === 'ConnectionDecorator') {
        this.targetDecorator = newDecorator;
    }
    return this;
};
/**
 * Sets a list of the lines associated with this connection
 * @returns {Connection}
 */
Connection.prototype.setLineSegments = function (newLines) {
    return this;
};
/**
 * Sets the start resize point of the connection
 * @returns {Connection}
 */
Connection.prototype.setStartResizePoint = function (newPoint) {
    return this;
};
/**
 * Sets the end resize point of the connection
 * @returns {Connection}
 */
Connection.prototype.setEndResizePoint = function (newPoint) {
    return this;
};
/**
 * Sets the connection type
 * @returns {Connection}
 */
Connection.prototype.setConnectionType = function (newConnType) {
    return this;
};
/**
 * Sets the canvas of the connection
 * @returns {Connection}
 */
Connection.prototype.setCanvas = function (newCanvas) {
    return this;
};

/**
 * Sets the style line of the segment
 * @param {string} newStyle
 * @returns {Segment}
 *
 */
Connection.prototype.setStyleSegments = function (newStyle) {
    this.styleSegments = newStyle;
    return this;
};

Connection.prototype.onClick = function (connection/*parametros*/) {
    return function (e, ui) {
        //connection.sourcePort.setZIndex(numero);
    };
};

Connection.prototype.setZOrder = function (newZOrder) {
    Shape.prototype.setZOrder.call(this, newZOrder);
};

Connection.prototype.getZOrder = function () {
    return Shape.prototype.getZOrder.call(this);
};
/**
 * Fix the zIndex of the connection based on the shape's parent
 * or the shape
 */
Connection.prototype.fixZIndex = function () {
    var sourceShape = this.sourcePort.parent,
        destShape = this.endPort.parent,
        sourceShapeParent,
        destShapeParent,
        sourceShapeParentZIndex,
        destShapeParentZIndex;

    if (sourceShape.parent) {
        sourceShapeParent = sourceShape.parent;
    } else {
        sourceShapeParent = sourceShape.canvas;
    }
    sourceShapeParentZIndex = Math.min(sourceShapeParent.getZOrder(),
        sourceShape.getZOrder() - 1);

    if (destShape.parent) {
        destShapeParent = destShape.parent;
    } else {
        destShapeParent = destShape.canvas;
    }
    destShapeParentZIndex = Math.min(destShapeParent.getZOrder(),
        destShape.getZOrder() - 1);

    this.setZOrder(Math.max(sourceShapeParentZIndex, destShapeParentZIndex) +
        2);
    //this.html.style.zIndex =
    //    Math.max(parseInt(sourceShape.html.style.zIndex, 10),
    //        parseInt(destShape.html.style.zIndex, 10)) + 1;
};

Connection.prototype.checkAndCreateIntersections = function (otherConnection) {
    // iterate over all the segments of this connection
    var i,
        j,
        segment,
        testingSegment,
        hasAtLeastOneIntersection = false;

    for (i = 0; i < this.lineSegments.getSize(); i += 1) {
        segment = this.lineSegments.get(i);
        for (j = 0; j < otherConnection.lineSegments.getSize(); j += 1) {
            testingSegment = otherConnection.lineSegments.get(j);
            // segment must have opposite direction
            if (segment.orientation !== testingSegment.orientation &&
                    Geometry.segmentIntersection(segment.startPoint,
                        segment.endPoint, testingSegment.startPoint,
                        testingSegment.endPoint)) {
                hasAtLeastOneIntersection = true;
                // create the intersection on this segment
                segment.createIntersectionWith(testingSegment);
            }
        }
    }
    //console.log("There was an intersection? " + hasAtLeastOneIntersection);
    if (hasAtLeastOneIntersection) {
        if (!this.intersectionWith.find('id', otherConnection.getID())) {
            this.intersectionWith.insert(otherConnection);
        }
        if (!otherConnection.intersectionWith.find('id', this.getID())) {
            otherConnection.intersectionWith.insert(this);
        }
    }
    return hasAtLeastOneIntersection;
};

Connection.prototype.checkAndCreateIntersectionsWithAll =
    function (doNotCreateHandlers) {
    var i,
        otherConnection,
        segment;
    //console.log("Checking intersections...");
    //console.log("total connections in the canvas is:" +
    //    this.canvas.canvasConnections.getSize());
    for (i = 0; i < this.canvas.canvasConnections.getSize(); i += 1) {
        otherConnection = this.canvas.canvasConnections.get(i);
        if (otherConnection.getID() !== this.getID()) {
            this.checkAndCreateIntersections(otherConnection);
        }
    }

    // after we've got all the intersections
    // paint the segments with it's intersections
    for (i = 0; i < this.lineSegments.getSize(); i += 1) {
        segment = this.lineSegments.get(i);
        if (segment.intersections.getSize()) {
            segment.paintWithIntersections(doNotCreateHandlers);
        }
    }
    return this;
};

Connection.prototype.clearIntersectionsWith = function (otherConnection) {
    var i,
        segment,
        intersectionObject,
        intersectionWasErased;
    for (i = 0; i < this.lineSegments.getSize(); i += 1) {
        intersectionWasErased = false;
        segment = this.lineSegments.get(i);
        //console.log("segment intersection size: " + segment.intersections.getSize());
        while (true) {
            intersectionObject = segment.
                intersections.find('idOtherConnection', otherConnection.getID());
            if (intersectionObject) {
                segment.intersections.remove(intersectionObject);
                intersectionObject.destroy();
            } else {
                break;
            }
            intersectionWasErased = true;
        }
        if (intersectionWasErased) {
            segment.paintWithIntersections();
        }
    }
    // remove other connection from this connection intersectionWith ArrayList
    this.intersectionWith.remove(otherConnection);
    otherConnection.intersectionWith.remove(this);
};

Connection.prototype.clearAllIntersections = function () {
    var otherIntersection;
    //console.log("Clearing all: " + this.intersectionWith.getSize());
    while (this.intersectionWith.getSize() > 0) {
        otherIntersection = this.intersectionWith.get(0);
        otherIntersection.clearIntersectionsWith(this);
        //this.clearIntersectionsWith(otherIntersection);
        //otherIntersection.disconnect().connect();
    }
};


