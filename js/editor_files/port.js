/**
 * Created with JetBrains WebStorm.
 * User: mauricio
 * Date: 9/14/12
 * Time: 2:05 PM
 * To change this template use File | Settings | File Templates.
 */
//***************************************************************************
//****************************Start of Port Class ***************************
//***************************************************************************

/**
 * Initializes a port that holds a Connection
 * @class Class designed to hold a connection and add aditional behaviors to it
 * like movement
 * @augments Rectangle
 */

Port = function () {
    /**
     * x coordinate relative the shape the port is held by
     * @type Integer
     */
    this.x = 0;
    /**
     * y coordinate relative the shape the port is held by
     * @type Integer
     */
    this.y = 0;
    /**
     * x Coordinate relative to the canvas
     * @type Number
     */
    this.absoluteX = 0;
    /**
     * y Coordinate relative to the canvas
     * @type Number
     */
    this.absoluteY = 0;
    /**
     * Conneccion atached to port
     * @type Number
     */
    this.connection = null;
    /**
     * Representation (Shape) of the port when it is connected
     * @type Oval
     */
    this.connectedRepresentation = new Oval();
    /**
     * Shape parent
     * @type Shape
     */
    this.parent = null;
    /**
     * Shape direction respect of shape
     * @type Integer
     */
    this.direction = this.RIGHT;
    /**
     * Visibility of the Port
     * @type Boolean
     */
    this.visible = false;
    /**
     * The percentage relative to where the port is located regarding one of
     * bpmn shape dimensions
     * @type Number
     */
    this.percentage = 0;
    /**
     * Current zIndex of the port
     * @type {Number}
     */
    this.zOrder = 1;

    /**
     * Default zIndex of the ports
     * @type {Number}
     */
    this.defaultZOrder = 1;
    this.setID('port-' + UniqueID.create());

};

//Port.prototype = new Rectangle();
Port.prototype = new Oval();
Port.prototype.TOWARDS_CENTER = 5;
Port.prototype.type = "Port";

/**
 * Creates the HTML representation of the port
 * @returns {Port}
 */
//Port.prototype.createHTML = function(){
//	return this;
//};
/**
 * In charge of the painting / positioning of the figure on the DOM and setting
 * the styles
 * @returns {Port}
 */

/**
 * Paint Port method
 * @returns {Port}
 */
Port.prototype.paint = function () {
    this.html.className = "bpmn_port";
//    Rectangle.prototype.paint.call(this);
    Oval.prototype.paint.call(this);
    if (!this.visible) {
        this.html.style.display = "none";
    } else {
        this.html.style.display = "inline";
    }
    return this;
};

/**
 * Repaint port method applying the new position and
 * @param {Port} port
 * @returns {Port}
 */
Port.prototype.repaint = function (port) {
    port.html.style.left = port.x + "px";
    port.html.style.top = port.y + "px";
    //this.connection.setSourcePort(this);
    //this.connection.paint();
    port.connection.setSourcePort(port);
    port.connection.connect();
    port.connection.checkAndCreateIntersectionsWithAll();
    return port;
};

///**
// * Sets the relative position of the Port regarding its holding Shape
// * @param {Integer} xpos
// * @param {Integer} ypos
// * @returns {Port}
// */
//Port.prototype.setPosition = function(xpos, ypos){
//    this.x = xpos;
//    this.y = ypos;
//    return this;
//};

/**
 * Sets the x coordinate Absolute to the canvas
 * @param {Integer} absX
 * @returns {Port}
 */
//Port.prototype.setAbsoluteX = function(absX){
//    this.absoluteX = absX;
//    return this;
//};
//
///**
// * Set the y coordinate Absolute to the canvas
// * @param {Integer} absY
// * @returns {Port}
// */
//Port.prototype.setAbsoluteY = function(absY){
//    this.absoluteY = absY;
//    return this;
//};

/**
 * Returns the x coordinate relative to the canvas
 * @returns {Integer}
 */
Port.prototype.getAbsoluteX = function () {
    return this.absoluteX;
};
/**
 * Returns the y coordinate relative to the canvas
 * @returns {Integer}
 */
Port.prototype.getAbsoluteY = function () {
    return this.absoluteY;
};

/**
 * Handler of the onDragStart Event
 * @returns {Function}
 */
Port.prototype.onDragStart = function (port) {
    return function (e, ui) {
        port.connection.disconnect();
        return true;
    };
};


/**
 * Handler for the onDrag event
 * @param {Port} port
 * @param {Point} endPoint
 * @param {Port} otherPort
 * @param {Canvas} canvas
 */
Port.prototype.onDrag = function (port, endPoint, otherPort, canvas) {
    return function (e, ui) {
        if (canvas.connectionSegment) {
            $(canvas.connectionSegment.getHTML()).remove();
        }

        endPoint.x = e.pageX - canvas.getLeft() + canvas.getLeftScroll();
        endPoint.y = e.pageY - canvas.getTop() + canvas.getTopScroll();
        //make connection segment
        canvas.connectionSegment = new Segment(otherPort.getPoint(false),
            endPoint, canvas);
        canvas.connectionSegment.pointsTo = port;
        canvas.connectionSegment.createHTML();
        canvas.connectionSegment.paint();
    };
};

/**
 * Handler for the onDragEnd event
 * @return {Function}
 */
Port.prototype.onDragEnd = function (port, canvas) {
    return function (e, ui) {

        if (canvas.connectionSegment) {
            $(canvas.connectionSegment.getHTML()).remove();
        }
        port.repaint(port);
    };
};

/*Port.prototype.setZOrder = function (value) {
 Shape.prototype.setZOrder.call(this, value);
 };*/

/**
 * Determine the percentage relative to the shape where the port is located
 * @return {*}
 */
Port.prototype.determinePercentage = function () {
    //Shape and port dimension to consider, it can be either width or height
    var shapeDimension,
        portDimension;
    if (!this.parent) {
        return false;
    }
    if (this.direction === this.TOP || this.direction === this.BOTTOM) {
        shapeDimension = this.parent.realWidth;
        portDimension = this.x;
    } else {
        shapeDimension = this.parent.realHeight;
        portDimension = this.y;
    }

    this.percentage = Math.round((portDimension / shapeDimension) * 100.0);
    return true;
};

/**
 * Set the absolute coordinates relative to canvas
 * @returns {Port}
 */
//Port.prototype.setAbsolutePosition = function(x,y){
//	this.setAbsoluteX(x);
//	this.setAbsoluteY(y);
//	return this;
//};

/**
 * Returns the x coordinate relative to its holding figure
 * @returns {Integer}
 */
Port.prototype.getX = function () {
    return this.x;
};

/**
 * Returns the y coordinate relative to its holding figure
 * @returns {Integer}
 */
Port.prototype.getY = function () {
    return this.y;
};

/**
 * Returns the width of port
 * @returns {Integer}
 */
Port.prototype.getWidth = function () {
    return this.width;
};

/**
 * Returns the height of port
 * @returns {Integer}
 */
Port.prototype.getHeight = function () {
    return this.height;
};

/**
 * Returns the connection associated with the port
 * @returns {Connection}
 */
Port.prototype.getConnection = function () {
    return this.connection;
};

/**
 * Returns the connected representation of the port
 * @returns {Oval}
 */
Port.prototype.getConnectedRepresentation = function () {
    return this.connectedRepresentation;
};

/**
 * Sets the connection associated with the port
 * @param {Connection} newConn
 * @returns {Port}
 */
Port.prototype.setConnection = function (newConn) {

    if (newConn && newConn.type === "Connection") {
        this.connection = newConn;
    }

    return this;
};

/**
 * Sets the connected representation of the port
 * @param {Oval} newRep
 * @returns {Port}
 */
Port.prototype.setConnectedRepresentation = function (newRep) {
    this.connectedRepresentation = newRep;
    return this;
};

/**
 * Show a Port
 * @returns {Port}
 */
Port.prototype.showPort = function () {
    if (!this.visible) {
        this.visible = true;
    }
    this.paint();
    return this;
};

/**
 * Hide a Port
 * @returns {Port}
 */
Port.prototype.hidePort = function () {
    if (this.visible) {
        this.visible = false;
    }
    this.paint();

    return this;
};
/**
 * Destroy the Port
 * @returns {Port}
 */
Port.prototype.destroy = function () {
    this.parent.removePort(this);  //remove from BPMNShape
    $(this.html).remove();
    return true;
};

/**
 * Get the a Point position of port
 * @returns {Point}
 */
Port.prototype.getPoint = function (relativeToShape) {
    if (relativeToShape) {
        return new Point(this.getX() + Math.round(this.getWidth() / 2),
            this.getY() + Math.round(this.getHeight() / 2));
    }
    return new Point(this.getAbsoluteX() + Math.round(this.getWidth() / 2),
        this.getAbsoluteY() + Math.round(this.getHeight() / 2));

};
/**
 * Listeners of the port.
 * Here all about the mouse, key and others events.
 *
 *
 */
Port.prototype.attachListeners = function (currPort) {
    var otherPort,
        portDragOptions;
    otherPort = currPort.connection.sourcePort.getPoint(false)
        .equals(currPort.getPoint(false)) ? currPort.connection.endPort :
        currPort.connection.sourcePort;

    portDragOptions = {
        //containment : "parent"
        start : currPort.onDragStart(currPort),
        drag : currPort.onDrag(currPort, currPort.getPoint(false),
            otherPort, currPort.parent.canvas),
        stop : currPort.onDragEnd(currPort, currPort.parent.canvas)

        //revert: false,
        //revertDuration: 0

    };
    $(currPort.html).draggable(portDragOptions);
    $(currPort.html).mouseover(
        function () {
            $(currPort.html).css('cursor', 'Move');

        }
    );
    return currPort;
};

/**
 * Sets the Direction to the port
 * @param {Object} newDirection;
 * @returns {Port}
 */
Port.prototype.setDirection = function (newDirection) {
    this.direction = newDirection;
    return this;
};

/**
 * Get the direction to the port
 * 0 = TOP, 1 = RIGHT, 2 = BOTTOM, 3 = LEFT
 * @returns {Integer}
 */
Port.prototype.getDirection = function () {
    return this.direction;
};

Port.prototype.moveTowardsTheCenter = function (port, reverse) {
    var towardsCenterDistance = Port.prototype.TOWARDS_CENTER,
        dx = [0, -towardsCenterDistance, 0, towardsCenterDistance],
        dy = [towardsCenterDistance, 0, -towardsCenterDistance, 0],
        multiplier = 1;

    if (reverse) {
        multiplier = -1;
    }
    port.setPosition(port.x + dx[port.direction] * multiplier,
        port.y + dy[port.direction] * multiplier);
};
//***************************************************************************
//****************************End Of Class **********************************
//***************************************************************************
