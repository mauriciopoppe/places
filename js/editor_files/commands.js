/**
 * @fileOverview This file will have all the classes related to Operations that
 * can be executed in the framework It's whole purpose is scalability so that
 * in the future undo and redo operations can be performed
 * @author Thaer Latif
 */

//***************************************************************************
//****************************Start of Operation Class ************************
//***************************************************************************

/**
 * Constructs a Operation given its names
 * @class The main class for executing an Operation
 * @param {String} operationType
 * @param {Canvas} canvas
 */

Operation = function (operationType, canvas) {
    /**
     * The Type of the Operation used to construct a specific Operation
     * @type String
     */
    this.operationType = (!operationType) ? "default" : OperationType;
    /**
     * The canvas on which the Operation would be operating
     * @type Canvas
     */
    this.canvas = (!canvas) ? null : canvas;
    /**
     * The Operation parameters
     * @type Array
     */
    this.operationParameters = null;
};

Operation.prototype.type = "Operation";

/**
 * Determines the type of Operation that needs to be executed and pass the
 * parameters to it
 */
Operation.prototype.determineOperation = function () {

};
/**
 * Executes the Operation subclasses are the ones that must implement this
 * method
 */
Operation.prototype.execute = function () {

};
/**
 * Redo function for when this feature is implemented
 */
Operation.prototype.redo = function () {

};
/**
 * Undo function for when this feature is implemented
 */
Operation.prototype.undo = function () {

};
/**
 * Cancel function for when this feature is implemented
 */
Operation.prototype.cancel = function () {

};


/**
 * Returns if an Operation can be executed
 * @returns {Boolean}
 */
Operation.prototype.isExecutable = function () {
    return true;
};

//getters

/**
 * Returns the type of the Operation
 * @returns {String}
 */
Operation.prototype.getOperationType = function () {
    return this.operationType;
};
/**
 * Returns the canvas on which this Operation is working on
 * @returns {Canvas}
 */
Operation.prototype.getCanvas = function () {
    return this.canvas;
};
/**
 * Returns the extra parameters passed to this Operation
 * @returns {Array}
 */
Operation.prototype.getOperationParameters = function () {
    return this.operationParameters;
};

//setters

/**
 * Sets the type of the Operation
 * @param {String} newOperationType
 * @returns {Operation}
 */
Operation.prototype.setOperationType = function (newOperationType) {
    return this;
};
/**
 * Sets the canvas on which this Operation is working on
 * @param {Canvas} newCanvas
 * @returns {Operation}
 */
Operation.prototype.setCanvas = function (newCanvas) {
    return this;
};
/**
 * Sets the extra parameters passed to this Operation
 * @param {Array} newParameters
 * @returns {Operation}
 */
Operation.prototype.setOperationParameters = function (newParameters) {
    return this;
};

//***************************************************************************
//****************************End Of Class **********************************
//***************************************************************************

//***************************************************************************
//****************************Start of OperationConnect Class ***************
//***************************************************************************

/**
 * Constructs a connect operation
 * @class This class represents an operation for connecting two ports
 * @augments Operation
 * @param {Port} sport
 * @param {Port} dport
 * @param {Connection} conn
 */

OperationConnect = function (sport, dport, conn) {
    /**
     * The source port of the connection
     * @type Port
     */
    this.source = (!sport) ? null : sport;
    /**
     * The destination port of the connection
     * @type Port
     */
    this.target = (!dport) ? null : dport;
    /**
     * The connection
     * @type Connection
     */
    this.connection = (!conn) ? null : conn;
};

OperationConnect.prototype = new Operation();
OperationConnect.prototype.type = "OperationConnect";


/**
 * Executes the Operation Connect
 */
OperationConnect.prototype.execute = function () {

};
//getters

/**
 * Returns the source of the connection
 * @returns {Port}
 */
OperationConnect.prototype.getSource = function () {
    return this.source;
};
/**
 * Returns the target of the connection
 * @returns {Port}
 */
OperationConnect.prototype.getTarget = function () {
    return this.target;
};
/**
 * Returns the connection
 * @returns {Connection}
 */
OperationConnect.prototype.getConnection = function () {
    return this.connection;
};

//setters

/**
 * Sets the source of the connection
 * @param {Port} newSource
 * @returns {OperationConnect}
 */
OperationConnect.prototype.setSource = function (newSource) {
    return this;
};
/**
 * Sets the target of the connection
 * @param {Port} newTarget
 * @returns {OperationConnect}
 */
OperationConnect.prototype.setTarget = function (newTarget) {
    return this;
};
/**
 * Sets the connection
 * @param {Connection} newConnection
 * @returns {OperationConnect}
 */
OperationConnect.prototype.setConnection = function (newConnection) {
    return this;
};

//***************************************************************************
//****************************End Of Class **********************************
//***************************************************************************

//***************************************************************************
//****************************Start of OperationResize Class ****************
//***************************************************************************

/**
 * Constructs a resize operation
 * @class This class represents an operation for resizing a figure
 * @augments Operation
 * @param {Shape} shape
 * @param {Number} newWidth
 * @param {Number} newHeight
 *
 */

OperationResize = function (shape, newWidth, newHeight) {
    /**
     * The shape to be resized
     * @type Shape
     */
    this.shape = (!shape) ? null : shape;
    /**
     * The old width
     * @type {Number}
     */
    this.oldWidth = (!shape) ? -1 : shape.getWidth();
    /**
     * The old height
     * @type {Number}
     */
    this.oldHeight = (!shape) ? -1 : shape.getHeight();
    /**
     * The new width to be applied
     * @type {Number}
     */
    this.width = (!newWidth) ? -1 : newWidth;
    /**
     * The new height to be applied
     * @type {Number}
     */
    this.height = (!newHeight) ? -1 : newHeight;
};

OperationResize.prototype = new Operation();
OperationResize.prototype.type = "OperationResize";

/**
 * Set the new Dimension for the Shape
 * @returns {OperationResize}
 */
OperationResize.prototype.setDimension = function () {
    return this;
};
/**
 * Execute the resize operation
 */
OperationResize.prototype.execute = function () {

};

//getters
/**
 * Returns the shape to be resized
 * @returns {Shape}
 */
OperationResize.prototype.getShape = function () {
    return this.shape;
};
/**
 * Returns the old width of the shape
 * @returns {Number}
 */
OperationResize.prototype.getOldWidth = function () {
    return this.oldWidth;
};

/**
 * Returns the old height of the shape
 * @returns {Number}
 */

OperationResize.prototype.getOldHeight = function () {
    return this.oldHeight;
};
/**
 * Returns the new width of the shape
 * @returns {Number}
 */

OperationResize.prototype.getWidth = function () {
    return this.width;
};
/**
 * Returns the new height of the shape
 * @returns {Number}
 */

OperationResize.prototype.getHeight = function () {
    return this.height;
};
//setters
/**
 * Sets the shape to be resized
 * @param {Shape} newShape
 * @returns {OperationResize}
 */
OperationResize.prototype.setShape = function (newShape) {
    return this;
};
/**
 * Sets the old width of the shape
 * @param {Number} newWidth
 * @returns {OperationResize}
 */
OperationResize.prototype.setOldWidth = function (newWidth) {
    return this;
};

/**
 * Sets the old height of the shape
 * @param {Number} newHeight
 * @returns {OperationResize}
 */

OperationResize.prototype.setOldHeight = function (newHeight) {
    return this;
};
/**
 * Sets the new width of the shape
 * @param {Number} newWidth
 * @returns {OperationResize}
 */

OperationResize.prototype.setWidth = function (newWidth) {
    return this;
};
/**
 * Sets the new height of the shape
 * @param {Number} newHeight
 * @returns {OperationResize}
 */

OperationResize.prototype.setHeight = function (newHeight) {
    return this;
};

//***************************************************************************
//****************************End Of Class **********************************
//***************************************************************************

//***************************************************************************
//****************************Start of OperationAdd Class *******************
//***************************************************************************

/**
 * Constructs an add operation
 * @class Represents an operation that adds a figure to the canvas
 * @augments Operation
 * @param {Shape} shape
 * @param {Shape} parent
 * @param {Number} xcoord
 * @param {Number} ycoord
 */

OperationAdd = function (shape, parent, xcoord, ycoord) {
    /**
     * The shape to be added
     * @type Shape
     */
    this.shape = (!shape) ? null : shape;
    /**
     * The parent of the shape
     * @type Shape
     */
    this.parent = (!parent) ? null : parent;
    /**
     * The x coordinate relative to its parent or canvas where the shape will
     * be positioned
     * @type Number
     */
    this.x = (!xcoord) ? -1 : xcoord;
    /**
     * The y coordinate relative to its parent or canvas where the shape will
     * be positioned
     * @type Number
     */
    this.y = (!ycoord) ? -1 : ycoord;
};

OperationAdd.prototype = new Operation();
OperationAdd.prototype.type = "OperationAdd";

/**
 * Executes the add Operation
 */
OperationAdd.prototype.execute = function () {

};
//getters
/**
 * Returns the shape to be added
 * @returns {Shape}
 */
OperationAdd.prototype.getShape = function () {
    return this.shape;
};

/**
 * Returns the parent of the shape to be added
 * @returns {Shape}
 */
OperationAdd.prototype.getParent = function () {
    return this.parent;
};

/**
 * Returns the x coordinate where the shape will be added
 * @returns {Number}
 */
OperationAdd.prototype.getX = function () {
    return this.x;
};

/**
 * Returns the y coordinate where the shape will be added
 * @returns {Number}
 */
OperationAdd.prototype.getY = function () {
    return this.y;
};

//setters

/**
 * Sets the shape to be added
 * @param {Shape} newShape
 * @returns {OperationAdd}
 */
OperationAdd.prototype.setShape = function (newShape) {
    return this;
};

/**
 * Sets the parent of the shape to be added
 * @param {Shape} newParent
 * @returns {OperationAdd}
 */
OperationAdd.prototype.setParent = function (newParent) {
    return this;
};

/**
 * Sets the x coordinate where the shape will be added
 * @param {Number} newX
 * @returns {OperationAdd}
 */
OperationAdd.prototype.setX = function (newX) {
    return this;
};

/**
 * Sets the y coordinate where the shape will be added
 * @param {Number} newY
 * @returns {OperationAdd}
 */
OperationAdd.prototype.setY = function (newY) {
    return this;
};


//***************************************************************************
//****************************End Of Class **********************************
//***************************************************************************

//***************************************************************************
//****************************Start of OperationDel Class *******************
//***************************************************************************

/**
 * Constructs a deletion Operation
 * @class This class represents an operation that deletes a shape
 * @augments Operation
 * @param {Shape} shape
 */

OperationDel = function (shape) {
    /**
     * The shape to be deleted
     * @type Shape
     */
    this.shape = (!shape) ? null : shape;
    /**
     * The parent of the shape to be deleted
     * @type Shape
     */
    this.parent = (!shape) ? null : shape.getParent();
    /**
     * The connections regarding that shape
     * @type ArrayList
     */
    this.connections = null;
};

OperationDel.prototype = new OperationDel();
OperationDel.prototype.type = "OperationDel";

/**
 * Executes the del Operation
 */

OperationDel.prototype.execute = function () {

};
//getters
/**
 * Returns the shape to be deleted
 * @returns {Shape}
 */
OperationDel.prototype.getShape = function () {
    return this.shape;
};
/**
 * Returns the parent of the shape to be deleted
 * @returns {Shape}
 */
OperationDel.prototype.getParent = function () {
    return this.parent;
};
/**
 * Returns the connections associated to the shape
 * @returns {ArrayList}
 */
OperationDel.prototype.getConnections = function () {
    return this.connections;
};
//setters
/**
 * Sets the shape to be deleted
 * @param {Shape} newShape
 * @returns {OperationDel}
 */
OperationDel.prototype.setShape = function (newShape) {
    return this;
};
/**
 * Sets the parent of the shape to be deleted
 * @param {Shape} newParent
 * @returns {OperationDel}
 */
OperationDel.prototype.setParent = function (newParent) {
    return this;
};
/**
 * Sets the connections associated to the shape
 * @param {ArrayList} newConnections
 * @returns {OperationDel}
 */
OperationDel.prototype.setConnections = function (newConnections) {
    return this;
};

//***************************************************************************
//****************************End Of Class **********************************
//***************************************************************************

//***************************************************************************
//****************************Start of OperationMove Class ******************
//***************************************************************************

/**
 * Constructs a move Operation
 * @class This class represents a move operation
 * @augments Operation
 * @param {Shape} shape
 * @param {Number} x
 * @param {Number} y
 */

OperationMove = function (shape, x, y) {
    /**
     * The shape to be moved
     * @type Shape
     */
    this.shape = (!shape) ? null : shape;
    /**
     * The previous x coordinate
     * @type Number
     */
    this.oldX = (!shape) ? null : shape.getX();
    /**
     * The previous y coordinate
     * @type Number
     */
    this.oldY = (!shape) ? null : shape.getY();
    /**
     * The new x coordinate
     * @type Number
     */
    this.newX = (!x) ? -1 : x;
    /**
     * The new y coordinate
     * @type Number
     */
    this.newY = (!y) ? -1 : y;
};

OperationMove.prototype = new Operation();
OperationMove.prototype.type = "OperationMove";

/**
 * Executes the move operation
 */
OperationMove.prototype.execute = function () {

};
/**
 * Sets the starting position of the operation
 * @param {Number} x
 * @param {Number} y
 * @returns {OperationMove}
 */
OperationMove.prototype.setStartPosition = function (x, y) {
    return this;
};

/**
 * Sets the current position in the operation
 * @param {Number} x
 * @param {Number}y
 * @returns {OperationMove}
 */

OperationMove.prototype.setPosition = function (x, y) {
    return this;
};
//setters
/**
 * Returns the shape to be moved
 * @returns {Shape}
 */
OperationMove.prototype.getShape = function () {
    return this.shape;
};
/**
 * Returns the old x coordinate of the shape
 * @returns {Number}
 */
OperationMove.prototype.getOldX = function () {
    return this.oldX;
};
/**
 * Returns the old y coordinate of the shape
 * @returns {Number}
 */
OperationMove.prototype.getOldY = function () {
    return this.oldY;
};
/**
 * Returns the new x coordinate of the shape
 * @returns {Number}
 */
OperationMove.prototype.getNewX = function () {
    return this.newX;
};
/**
 * Returns the new y coordinate of the shape
 * @returns {Number}
 */
OperationMove.prototype.getNewY = function () {
    return this.newY;
};

/**
 * Sets the shape to be moved
 * @param {Shape} newShape
 * @returns {OperationMove}
 */
OperationMove.prototype.setShape = function (newShape) {
    return this;
};
/**
 * Sets the old x coordinate of the shape
 * @param {Number} newX
 * @returns {OperationMove}
 */

OperationMove.prototype.setOldX = function (newX) {
    return this;
};
/**
 * Sets the old y coordinate of the shape
 * @param {Number} newY
 * @returns {OperationMove}
 */

OperationMove.prototype.setOldY = function (newY) {
    return this;
};
/**
 * Sets the new x coordinate of the shape
 * @param {Number} newX
 * @returns {OperationMove}
 */

OperationMove.prototype.setNewX = function (newX) {
    return this;
};
/**
 * Sets the new y coordinate of the shape
 * @param {Number} newY
 * @returns {OperationMove}
 */

OperationMove.prototype.setNewY = function (newY) {
    return this;
};

//***************************************************************************
//****************************End Of Class **********************************
//***************************************************************************

//***************************************************************************
//****************************Start of OperationMoveLine Class **************
//***************************************************************************

/**
 * Construct a Segment Move Operation
 * @class This class represents a segment move operation
 * @augments Operation
 * @param {Segment} currentSegment
 * @param {Point} startPoint
 * @param {Point} endPoint
 */

OperationMoveSegment = function (currentSegment, startPoint, endPoint) {
    /**
     * The segment to be moved
     * @type Segment
     */
    this.segment = (!currentSegment) ? null : currentSegment;
    /**
     * The previous start point of the segment
     * @type Point
     */
    this.oldStartPoint = (!currentSegment) ? null : currentSegment.getStartPoint();
    /**
     * The previous end point of the segment
     * @type Point
     */
    this.oldEndPoint = (!currentSegment) ? null : currentSegment.getEndPoint();
    /**
     * The new start point of the segment
     * @type Point
     */
    this.newStartPoint = (!startPoint) ? null : startPoint;
    /**
     * The new end point of the segment
     * @type Point
     */
    this.newEndPoint = (!endPoint) ? null : endPoint;
};

OperationMoveSegment.prototype = new Operation();
OperationMoveSegment.prototype.type = "OperationMoveSegment";

/**
 * Executes the move segment Operation
 */
OperationMoveSegment.prototype.execute = function () {

};

/**
 * Returns the segment to be moved
 * @returns {Segment}
 */
OperationMoveSegment.prototype.getSegment = function () {
    return this.segment;
};
/**
 * Returns the old start point of the segment
 * @returns {Point}
 */
OperationMoveSegment.prototype.getOldStartPoint = function () {
    return this.oldStartPoint;
};
/**
 * Returns the old end point of the segment
 * @returns {Point}
 */
OperationMoveSegment.prototype.getOldEndPoint = function () {
    return this.oldEndPoint;
};
/**
 * Returns the new start point of the segment
 * @returns {Point}
 */
OperationMoveSegment.prototype.getNewStartPoint = function () {
    return this.newStartPoint;
};
/**
 * Returns the new end point of the segment
 * @returns {Point}
 */
OperationMoveSegment.prototype.getNewEndPoint = function () {
    return this.newEndPoint;
};

/**
 * Sets the segment to be moved
 * @param {Segment} newSegment
 * @returns {OperationMoveSegment}
 */
OperationMoveSegment.prototype.setSegment = function (newSegment) {
    return this;
};
/**
 * Sets the old start point of the segment
 * @param {Point} newPoint
 * @returns {OperationMoveSegment}
 */
OperationMoveSegment.prototype.setOldStartPoint = function (newPoint) {
    return this;
};
/**
 * Sets the old end point of the segment
 * @param {Point} newPoint
 * @returns {OperationMoveSegment}
 */
OperationMoveSegment.prototype.setOldEndPoint = function (newPoint) {
    return this;
};
/**
 * Sets the new start point of the segment
 * @param {Point} newPoint
 * @returns {OperationMoveSegment}
 */
OperationMoveSegment.prototype.setNewStartPoint = function (newPoint) {
    return this;
};
/**
 * Sets the new end point of the segment
 * @param {Point} newPoint
 * @returns {OperationMoveSegment}
 */
OperationMoveSegment.prototype.setNewEndPoint = function (newPoint) {
    return this;
};

//***************************************************************************
//****************************End Of Class **********************************
//***************************************************************************

//***************************************************************************
//****************************Start of OperationMovePort Class **************
//***************************************************************************

/**
 * Constructs a Move Port Operation
 * @class This class represents a move port operation
 * @augments Operation
 * @param {Port} port
 * @param {Number} x
 * @param {Number} y
 */

OperationMovePort = function (port, x, y) {
    /**
     * Port to be moved
     * @type Port
     */
    this.port = (!port) ? null : port;
    /**
     * Previous x coordinate of the port
     * @type Number
     */
    this.oldX = (!port) ? null : port.getX();
    /**
     * Previous y coordinate of the port
     * @type Number
     */
    this.oldY = (!port) ? null : port.getY();
    /**
     * New x coordinate of the port
     * @type Number
     */
    this.newX = (!x) ? -1 : x;
    /**
     * New y coordinate of the port
     * @type Number
     */
    this.newY = (!y) ? -1 : y;

};

OperationMovePort.prototype = new Operation();
OperationMovePort.prototype.type = "OperationMovePort";


/**
 * Executes the move port operation
 */
OperationMovePort.prototype.execute = function () {

};
/**
 * Returns the port to be moved
 * @returns {Port}
 */
OperationMovePort.prototype.getPort = function () {
    return this.port;
};
/**
 * Returns the old x coordinate of the Port
 * @returns {Number}
 */
OperationMovePort.prototype.getOldX = function () {
    return this.oldX;
};
/**
 * Returns the old y coordinate of the Port
 * @returns {Number}
 */
OperationMovePort.prototype.getOldY = function () {
    return this.oldY;
};
/**
 * Returns the new x coordinate of the Port
 * @returns {Number}
 */
OperationMovePort.prototype.getNewX = function () {
    return this.newX;
};
/**
 * Returns the new y coordinate of the Port
 * @returns {Number}
 */
OperationMovePort.prototype.getNewY = function () {
    return this.newY;
};

/**
 * Sets the Port to be moved
 * @param {Port} newPort
 * @returns {OperationMovePort}
 */
OperationMovePort.prototype.setPort = function (newPort) {
    return this;
};
/**
 * Sets the old x coordinate of the Port
 * @param {Number} newX
 * @returns {OperationMovePort}
 */

OperationMovePort.prototype.setOldX = function (newX) {
    return this;
};
/**
 * Sets the old y coordinate of the Port
 * @param {Number} newY
 * @returns {OperationMovePort}
 */

OperationMovePort.prototype.setOldY = function (newY) {
    return this;
};
/**
 * Sets the new x coordinate of the Port
 * @param {Number} newX
 * @returns {OperationMovePort}
 */

OperationMovePort.prototype.setNewX = function (newX) {
    return this;
};
/**
 * Sets the new y coordinate of the Port
 * @param {Number} newY
 * @returns {OperationMovePort}
 */

OperationMovePort.prototype.setNewY = function (newY) {
    return this;
};

//***************************************************************************
//****************************End Of Class **********************************
//***************************************************************************
