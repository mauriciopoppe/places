/**
 * Initializes a BPMN Shape
 * @class Class that contains the behaviors and properties of all BPMN Objects
 * @augments Shape
 */

var BPMNShape = function (ResizeHandlerNumber) {

    Shape.call(this);
    /**
     * List of all the ports related to that shape
     * @type ArrayList
     */
    this.ports = new ArrayList();
    /**
     *
     * @description List of all the layers related to the shape.
     * @type ArrayList
     */
    this.layers = new ArrayList();

    /**
     * Limits for the inner figure, for drag & drop behavior,
     * each bpmn shape has its own limits
     * @type array
     */
    this.limits = [0, 0, 0, 0, 0];
    /**
     * The position of the limits array where the applied limit is located.
     * This value is related to the zoomFactor
     * @type number
     */
    this.limitPosition = 2;
    /**
     * Element zoom properties
     * @type array
     */
    this.elementProperties = [];
    /**
     * ConnectionHelper created the connect drag behavior is used
     * @type ConnectionHelper
     */
    this.helper = null;
    /** Determine if the polygon is re
     * @type Boolean
     */
    this.draggable = true;
    this.resizable = true;
    /**
     * List containing the resize Points located in the corner of a div
     * @type ArrayList
     */
    this.cornerResizeHandlers = new ArrayList();
    /**
     * List containing the resize Points located in the middle of a border
     * @type ArrayList
     */
    this.midResizeHandlers = new ArrayList();
    /**
     * Denotes the drag behavior a bpmnShape is taking according to where
     * the user clicked, it can
     * be DRAG, CONNECT OR CANCEL
     * @type Number
     */
    this.dragBehavior = this.CANCEL;
    /**
     * Point where a connection starts when the bpmnshape is applying the
     * CONNECT behavior
     * @type Point
     */
    this.startConnectionPoint = new Point(0, 0);
    /**
     * Marks true if the shape if a drag behavior is being applied
     * @type Boolean
     */
    this.dragging = false;
    /**
     * Marks true if the shape if a resizing behavior is being applied
     * @type Boolean
     */
    this.resizing = false;
    /**
     * Left coordinate where the shape was before a drag operation started
     * @type Number
     */
    this.oldLeft = 0;
    /**
     * Top coordinate where the shape was before a drag operation started
     * @type Number
     */
    this.oldTop = 0;

    this.oldX = 0;

    this.oldY = 0;

    this.oldAbsoluteX = 0;

    this.oldAbsoluteY = 0;

    this.oldWidth = 0;

    this.oldHeight = 0;

    this.oldParent = null;

    this.cornersIdentifiers = ['nw', 'ne', 'se', 'sw'];

    this.midPointIdentifiers = ['n', 'e', 's', 'w'];

    var i;

    //First determine how many ResizeHandlers we are to create
    if (!ResizeHandlerNumber || (ResizeHandlerNumber !== 8 &&
        ResizeHandlerNumber !== 4 && ResizeHandlerNumber !== 0)) {
        ResizeHandlerNumber = 4;
    }
    //Then insert the corners first
    for (i = 0; i < ResizeHandlerNumber && i < 4; i += 1) {
        this.cornerResizeHandlers.insert(
            new ResizeHandler(this, this.cornersIdentifiers[i])
        );
    }
    //subtract 4 just added resize points to the total
    ResizeHandlerNumber -= 4;
    //add the rest to the mid list
    for (i = 0; i < ResizeHandlerNumber; i += 1) {
        this.midResizeHandlers.insert(
            new ResizeHandler(this, this.midPointIdentifiers[i])
        );
    }
    /**
     * Array built when setting the dimension of the shape to store the
     * x coordinate of the div corners in clockwise order starting at top left
     * @type array
     */
    this.xCorners = [0, 0, 0, 0];
    /**
     * Array built when setting the dimension of the shape to store the
     * y coordinate of the div corners in clockwise order starting at top left
     * @type array
     */
    this.yCorners = [0, 0, 0, 0];
    /**
     * Array built when setting the dimension of the shape to store the
     * x coordinate of the midpoints of each div border in clockwise order
     * starting at the top border
     * @type Array
     */
    this.xMidPoints = [0, 0, 0, 0];
    /**
     * Array built when setting the dimension of the shape to store the
     * y coordinate of the midpoints of each div border in clockwise order
     * starting at the top border
     * @type Array
     */
    this.yMidPoints = [0, 0, 0, 0];

    this.label = new Label(this);

    this.markers = null;

    this.onMultipleSelection = false;

    this.zOrder = 1;

};

BPMNShape.prototype = new Shape();
BPMNShape.prototype.type = "BPMNShape";
BPMNShape.prototype.family = "BPMNShape";

//Constants for determining drag and drop behavior

/**
 * Constant that determines numerical values for the drag behavior Connect
 * @type Number
 */
BPMNShape.prototype.CONNECT = 1;
/**
 * Constant that determines numerical values for the drag behavior Drag
 * @type Number
 */
BPMNShape.prototype.DRAG = 2;
/**
 * Constant that determines numerical values for the drag behavior Cancel
 * @type Number
 */
BPMNShape.prototype.CANCEL = 0;

/**
 * Creates the HTML Representation of the BPMN Shape
 * @returns {Object}
 */
BPMNShape.prototype.createHTML = function (modifying) {

    var i,
        j;
    Shape.prototype.createHTML.call(this, modifying);
    //add this class in order to distinguish it from other shapes
    this.html.className = "bpmn_shape";
    //sort the layers according to its priority
    this.layers.sort(Layer.prototype.comparisonFunction);
    if (!modifying) {//if we are creating the shape for the first time
        //append their html to the DOM
        for (i = 0; i < this.layers.getSize(); i += 1) {
            this.html.appendChild(this.layers.get(i).getHTML());

        }
        for (i = 0; i < this.cornerResizeHandlers.getSize(); i += 1) {
            this.addResizeHandler(this.cornerResizeHandlers.get(i),
                this.xCorners[i], this.yCorners[i]);
        }
        for (i = 0; i < this.midResizeHandlers.getSize(); i += 1) {
            this.addResizeHandler(this.midResizeHandlers.get(i),
                this.xMidPoints[i], this.yMidPoints[i]);
        }

    } else {//if we are just modifying properties
        for (j = 0; j < this.layers.getSize(); j += 1) {
            this.layers.get(j).createHTML(true);
        }
    }

    return this.html;
};

/**
 * In charge of the painting / positioning of the figure on the DOM and
 * setting the styles
 * @returns {BPMNShape}
 */
BPMNShape.prototype.paint = function () {
    var i;
    for (i = 0; i < this.layers.getSize(); i += 1) {
        this.layers.get(i).paint();
    }
    if (this.label.getMessage() !== '') {
        this.label.paint(this);
    }
    return this;
};
BPMNShape.prototype.updateLayers = function () {
    var i, j,
        layer;
    for (i = 0; i < this.getLayers().getSize(); i += 1) {
        layer = this.getLayers().get(i);
//        console.log(layer.html); //?????
        layer.repaintMarkers();
        //?????
        layer.setProperties();
    }
    return this;
};
/**
 * Set the dimension of the bpmnShape and also updates the positions of the div
 * corners and midpoints
 * @param {Number} newWidth
 * @param {Number} newHeight
 */
BPMNShape.prototype.setDimension = function (newWidth, newHeight,
                                             triggerChange) {
    Shape.prototype.setDimension.call(this, newWidth, newHeight, triggerChange);
    //since the width and height changed we need to update the corners and
    // midpoints of the div
    /*
    this.xCorners = [0, this.width, this.width, 0];
    this.yCorners = [0, 0, this.height, this.height];
    this.xMidPoints = [this.width / 2, this.width, this.width / 2, 0];
    this.yMidPoints = [0, this.height / 2, this.height, this.height / 2];
    */

    this.xCorners = [0, Math.round(this.width), Math.round(this.width), 0];
    this.yCorners = [0, 0, Math.round(this.height), Math.round(this.height)];
    this.xMidPoints = [Math.round(this.width / 2), Math.round(this.width),
        Math.round(this.width / 2), 0];
    this.yMidPoints = [0, Math.round(this.height / 2), Math.round(this.height),
        Math.round(this.height / 2)];

    this.updateHandlers();
    //for()
    //if (this.html)
    this.updateLayers();
};

/**
 * Returns what it should be the next layer if there is such in the DOM tree
 * or null otherwise
 * @param {Layer} layer
 * @returns {Layer}
 */
BPMNShape.prototype.findLayerPosition = function (layer) {
    var nextLayer = null,//holds the next layer regarding the position where
    // the new layer should be inserted
        minVal = 10000000, //holds the minimum value of all the values greater
    // than the newLayer priority
        i,
        currLayer,
        currPriority;
    //iterate through all the layers and find the minimum priority of all
    // the priorities that are greater than the priority of the current layer
    for (i = 0; i < this.layers.getSize(); i += 1) {
        currLayer = this.layers.get(i);
        currPriority = currLayer.getPriority();
        if (currPriority > layer.getPriority()) {
            if (minVal > currPriority) {
                minVal = currPriority;
                nextLayer = currLayer;
            }
        }
    }
    return nextLayer;
};
/**
 * Updates the position of the handlers
 * @returns BPMNShape
 */
BPMNShape.prototype.updateHandlers = function () {
    var handler,
        i;
    for (i = 0; i < this.cornerResizeHandlers.getSize(); i += 1) {
        handler = this.cornerResizeHandlers.get(i);
        handler.setPosition(this.xCorners[i] -
            Math.round(handler.width / 2) - 1,
            this.yCorners[i] - Math.round(handler.height / 2) - 1);
    }
    for (i = 0; i < this.midResizeHandlers.getSize(); i += 1) {
        handler = this.midResizeHandlers.get(i);
        handler.setPosition(this.xMidPoints[i] -
            Math.round(handler.width / 2) - 1,
            this.yMidPoints[i] - Math.round(handler.height / 2) - 1);
    }
    return this;

};
/**
 * If the parameter is set to false then the bpmnShape resize Handlers will
 * be hidden, otherwise they will be shown
 * @param {Boolean} visible
 */
BPMNShape.prototype.showOrHideResizeHandlers = function (visible) {

    var i;
    if (!visible) {
        visible = false;
    }
    for (i = 0; i < this.cornerResizeHandlers.getSize(); i += 1) {
        this.cornerResizeHandlers.get(i).setVisible(visible);
    }

    for (i = 0; i < this.midResizeHandlers.getSize(); i += 1) {
        this.midResizeHandlers.get(i).setVisible(visible);
    }
};

/**
 * Adds a Resize Point to the shape given its x and y coordinates
 * @param {ResizeHandler} resizeHandler
 * @param {Number} x
 * @param {Number} y
 */
BPMNShape.prototype.addResizeHandler = function (resizeHandler, x, y) {
    if (!this.html) {
        return;
    }

    this.html.appendChild(resizeHandler.getHTML());

    resizeHandler.setPosition(x - Math.round(resizeHandler.width / 2) - 1,
        y - Math.round(resizeHandler.height / 2) - 1);
    if (this.resizable) {
        resizeHandler.setCategory("resizable");
    } else {
        resizeHandler.paint();
    }
};

/**
 * Adds a new layer to the corresponding shape
 * @param {Layer} newLayer
 * @returns {BPMNShape}
 */
BPMNShape.prototype.addLayer = function (newLayer, posM, marker) {
    //gets the layer that would come next the new one
    var nextLayer = this.findLayerPosition(newLayer);
    //if there is none it means that the new layer has the highest priority
    // of all
    if (!nextLayer) {
        //so we just append it to the parent
        this.html.appendChild(newLayer.getHTML());
    } else {
        //otherwise we append it before nextLayer
        this.html.insertBefore(newLayer.getHTML(), nextLayer.getHTML());
    }
    newLayer.paint();
    this.layers.insert(newLayer);

    if (typeof posM !== "undefined" && posM !== null) {
        this.addMarkers(newLayer, posM, marker);
    }
    return this;
};
/**
 * Finds a given layer by ID or null of it doesn't exist
 * @param {string} layerID
 * @returns {Layer}
 */
BPMNShape.prototype.findLayer = function (layerID) {

    var currLayer,
        i;

    for (i = 0; i < this.layers.getSize(); i += 1) {
        currLayer = this.layers.get(i);
        if (layerID === currLayer.getID()) {
            return currLayer;
        }
    }
    return null;
};
/**
 * Makes a layer to non-visible
 * @param {String} layerID
 * @returns {BPMNShape}
 */
BPMNShape.prototype.hideLayer = function (layerID) {
    var currLayer;
    if (!layerID || typeof layerID !== "string") {
        return this;
    }
    currLayer = this.findLayer(layerID);
    if (!currLayer) {
        return this;
    }

    currLayer.setVisible(false);
    currLayer.paint();

    return this;

};
/**
 * Makes a layer visible
 * @param {String} layerID
 * @returns {BPMNShape}
 */
BPMNShape.prototype.showLayer = function (layerID) {
    var currLayer;
    if (!layerID || typeof layerID !== "string") {
        return this;
    }

    currLayer = this.findLayer(layerID);
    if (!currLayer) {
        return this;
    }
    currLayer.setVisible(true);
    currLayer.paint();

    return this;
};

/**
 * Deletes the shape and its relations, returns true if successful
 * @returns {Boolean}
 */
/*BPMNShape.prototype.destroy = function () {
    var child,
        conn;
    while (this.children.getSize() > 0) {
        child = this.children.getFirst();
        this.children.remove(child);

//        while (child.ports.getSize() > 0) {
//            conn = child.getPorts().getLast().connection;
//            conn.destroy();
//        }

        this.canvas.removeShape(child);
        //delete shape html;
        $(child.html).remove();
        child.destroy();
    }
    if (!this.html) {
        return false;
    }
    while (this.ports.getSize() > 0) {
        conn = this.getPorts().getLast().connection;
        conn.destroy();
    }

    removeFromContainer(this);
    this.canvas.removeShape(this);
    //delete shape html;
    $(this.html).remove();
    this.canvas.updatedElement = this;
    $(this.canvas.html).trigger("removeelement");
    return true;
};*/

BPMNShape.prototype.destroy = function () {
    var child,
        conn,
        children = this.children;
    while (!children.isEmpty()) {
        child = children.popLast();
        child.destroy();
    }
    while (!this.ports.isEmpty()) {
        conn = this.ports.popLast().connection;
        conn.destroy();
    }
    removeFromContainer(this);
    this.canvas.removeShape(this);
    $(this.html).remove();
    this.canvas.updatedElement = this;
    $(this.canvas.html).trigger("removeelement");
    return true;
};

/**
 * Adds a port to the Shape
 * @param {Port} port
 * @param {Integer} xPortCoord
 * @param {Integer} yPortCoord
 * @returns {BPMNShape}
 */
BPMNShape.prototype.addPort = function (port, xPortCoord, yPortCoord,
                                        triggerChange) {


    //where the user is attempting to create the port

    var position = new Point(xPortCoord, yPortCoord),
        oldX = port.x,
        oldY = port.y,
        oldAbsoluteX = port.absoluteX,
        oldAbsoluteY = port.absoluteY,
        oldParent = port.parent;
    //set the corresponding shape where the port would be created
    port.setParent(this);
    port.setCanvas(this.canvas);
    //set the port dimension
    port.setDimension(8, 8);

    //validate the position of the port in order to positionate it in one of
    // the corners of the shape, this is applied to all but activities

    //port.validatePosition(position);
    this.definePortPosition(port, position);



    //append the html to the DOM and paint the port
    this.html.appendChild(port.getHTML());

    port.paint();
    port.setColor(new Color(255, 0, 0));
    //insert the port to the ports array of the shape
    this.ports.insert(port);
    if (triggerChange) {
        port.changeParent(oldX, oldY, oldAbsoluteX,
            oldAbsoluteY, oldParent, port.canvas);
    }
    return this;
};


BPMNShape.prototype.definePortPosition = function (port, point) {
    var directionArray = [this.TOP, this.RIGHT, this.BOTTOM, this.LEFT],
    //Array of Directions 0 = TOP, 1 = RIGHT, 2 = BOTTOM, 3 = LEFT
        pointArray = [new Point(Math.round(this.width / 2), 0),
            new Point(this.width, Math.round(this.height / 2)),
            new Point(Math.round(this.width / 2), this.height),
            new Point(0, Math.round(this.height / 2))],
    //Array of points of the shape
        direction,
        disMin,
        i,
        nd;

    direction = directionArray[this.TOP];  //obtain location of the port
    disMin = point.getSquaredDistance(pointArray[this.TOP]);
    // get the minimum distance between 2 points;
    for (i = 1; i < pointArray.length; i += 1) {
        nd = point.getSquaredDistance(pointArray[i]);

        if (disMin > nd) {
            disMin = nd;
            direction = directionArray[i];
        }
    }

    // because of the zIndex problem move the ports towards the center
    // of the shape

    port.setPosition(pointArray[direction].x - port.width / 2,
        pointArray[direction].y - port.height / 2);
//    port.setAbsolutePosition(port.x + this.realX, port.y + this.realY);
    port.setDirection(direction);
    port.determinePercentage();

    return this;
};


/**
 * Removes a port from the Shape
 * @param {Port} port
 * @returns {BPMNShape}
 */
BPMNShape.prototype.removePort = function (port) {
    this.ports.remove(port);
    return this;
};
/**
 * show  all ports of the Shape
 * @returns {BPMNShape}
 */

BPMNShape.prototype.showPorts = function () {
    var i;
    for (i = 0; i < this.ports.getSize(); i += 1) {
        this.ports.get(i).showPort();
    }
    return this;
};


/**
 * Updates the position of the ports regarding the BPMNShape and two
 * differentials
 * @param xDiff
 * @param yDiff
 * @return {*}
 */
BPMNShape.prototype.updatePortsPosition = function (xDiff, yDiff) {
    var i,
        port,
        ports = this.ports;
    for (i = 0; i < ports.getSize(); i += 1) {
        port = ports.get(i);
        if (port.direction === this.RIGHT || port.direction === this.BOTTOM) {
            port.oldX = port.x;
            port.oldY = port.y;
            port.oldAbsoluteX = port.absoluteX;
            port.oldAbsoluteY = port.absoluteY;
            port.setPosition(port.x + xDiff, port.y + yDiff, true);
            port.changePosition(port.oldX, port.oldY, port.oldAbsoluteX,
                port.oldAbsoluteY);
        } else {
            port.setPosition(port.x, port.y, true);
        }
        port.connection.disconnect().connect();
    }
    return this;
};

/**
 * hide  all ports of the Shape
 * @returns {BPMNShape}
 */
BPMNShape.prototype.hidePorts = function () {
    var i;
    for (i = 0; i < this.ports.getSize(); i += 1) {
        this.ports.get(i).hidePort();
    }

    return this;

};

/**
 * onMouseEnter handler  all port from the Shape
 * @returns {BPMNShape}
 */
BPMNShape.prototype.onMouseEnter = function () {
    this.showPorts();
};

/**
 * onMouseleave handler  all port from the Shape
 * @returns {BPMNShape}
 */
BPMNShape.prototype.onMouseLeave = function () {
    this.hidePorts();
};
/**
 * Redraws the connections and recalculate intersections related to the Shape
 * @returns {BPMNShape}
 */
BPMNShape.prototype.refreshConnections = function () {
    return this;
};
/**
 * Returns the respective drag behavior, by default is to cancel, so its
 * sub-classes should implement this method.
 * @returns {Number}
 */
BPMNShape.prototype.determineDragBehavior = function () {
    return this.DRAG;
};

/**
 * Creates a ConnectionHelper when the Connect drag behavior is applied
 * @param {Number} x left coordinate of the helper
 * @param {Number} y top coordinate of the helper
 */
/*BPMNShape.prototype.createHelper = function (x, y) {

    this.helper = new ConnectionHelper(this);

<<<<<<< HEAD
    //set the position so that the center of the helper is where the user
    clicked
    this.helper.setPosition(x - Math.round(this.helper.getWidth() / 2), y -
        Math.round(this.helper.getHeight() / 2));
=======
    //set the position so that the center of the helper is where the
    //user clicked
    this.helper.setPosition(x - this.helper.getWidth() / 2, y -
    this.helper.getHeight() / 2);
    //set a high zIndex value so that the helper can be seen above everything
    //this.helper.setZOrder(this.MAX_ZINDEX + this.MAX_ZINDEX);
>>>>>>> 2a46afab06282d3543549f7950e85c48eae7cdb7

    this.helper.createHTML();

    //determine the variables that will be passed to the helper listeners
    var startPoint = new Point(x, y);
    var endPoint = new Point(x, y);


    this.helper.attachListeners(this.helper, startPoint, endPoint, this.canvas);

};*/
/**
 * Creates a drag helper for drag and drop operations for the helper property
 * in jquery ui draggable
 * @returns {___html1}
 */
BPMNShape.prototype.createDragHelper = function () {
    var html = document.createElement("div");
    html.style.width = 8 + "px";
    html.style.height = 8 + "px";
    html.style.backgroundColor = "black";
    html.style.zIndex = this.MAX_ZINDEX;
    html.id = "drag-helper";
    html.className = "drag-helper";
    // html.style.display = "none";
    return html;
};

/**
 * This function will attach all the listeners corresponding to the bpmnShape
 * @returns {BPMNShape}
 */
BPMNShape.prototype.attachListeners = function (bpmnShape) {
    if (bpmnShape.html === null) {
        return bpmnShape;
    }


    var $bpmnShape = $(bpmnShape.html).click(bpmnShape.onClick(bpmnShape));
    //drag options for the added shapes
    if (bpmnShape.draggable) {
        $bpmnShape.on("mousedown", bpmnShape.onMouseDown(bpmnShape));
        $bpmnShape.mousemove(bpmnShape.onMouseMove(bpmnShape));
        $bpmnShape.mouseup(bpmnShape.onMouseUp(bpmnShape));
        $bpmnShape.on("contextmenu", function (e) {
            e.preventDefault();
        }
            );

        var shapeDragOptions = {
            containment : this.canvas.html,
            //helper: bpmnShape.createDragHelper,
            revertDuration : 0,
            //cursorAt: {left: bpmnShape.width/2, top: bpmnShape.height/2},
            start : bpmnShape.onDragStart(bpmnShape),
            drag : bpmnShape.onDrag(bpmnShape, bpmnShape.canvas, new Point(0, 0)),
            stop : bpmnShape.onDragEnd(bpmnShape)
        };
        //valid-drop-class states that the element is droppable in the canvas
        if (bpmnShape.type !== 'BPMNBoundaryEvent') {
            $bpmnShape = $(bpmnShape.html).addClass("valid-drop-class").draggable(shapeDragOptions);
        } else {
            $bpmnShape = $(bpmnShape.html).addClass("boundary-drop-class").draggable(shapeDragOptions);
        }
    }

    //drop options for the shape
    var shapeDropOptions = {
        accept:"#connection-segment,#helper-id,.bpmn_shape,.bpmn_port,.bpmn_activity",
        drop:bpmnShape.onDrop(bpmnShape),
        greedy:true
    };

    //defining handles object
    var handlesObject = {};
    var i;

    if (bpmnShape.resizable) {

        for (i = 0; i < bpmnShape.midPointIdentifiers.length; i += 1) {
            handlesObject[bpmnShape.midPointIdentifiers[i]] = '#' +
                bpmnShape.midPointIdentifiers[i] + bpmnShape.id +
                'resizehandler';
        }
        for (i = 0; i < bpmnShape.cornersIdentifiers.length; i += 1) {
            handlesObject[bpmnShape.cornersIdentifiers[i]] = '#' +
                bpmnShape.cornersIdentifiers[i] + bpmnShape.id +
                'resizehandler';
            // alert(handlesObject[bpmnShape.cornersIdentifiers[i]]);
        }
        var shapeResizeOptions = {
            handles : handlesObject,
            start : bpmnShape.onResizeStart(bpmnShape),
            stop: bpmnShape.onResizeEnd(bpmnShape),
            resize : bpmnShape.onResize(bpmnShape)
        };
        $bpmnShape.resizable(shapeResizeOptions);
        bpmnShape.updateResizeListener(bpmnShape);
    }
    $bpmnShape.droppable(shapeDropOptions);



    return bpmnShape;
};



BPMNShape.prototype.recalculatePortPosition = function (port) {

    var xPercentage = Math.round((port.percentage *
            port.parent.realWidth) / 100),
        yPercentage = Math.round((port.percentage *
            port.parent.realHeight) / 100),
        xCoordinate = [xPercentage, port.parent.realWidth, xPercentage, 0],
        yCoordinate = [0, yPercentage, port.parent.realHeight, yPercentage];

    port.setPosition(xCoordinate[port.direction] - Math.round(port.width / 2),
        yCoordinate[port.direction] - Math.round(port.height / 2));
};

BPMNShape.prototype.resizeBehavior = function (bpmnShape, e, ui) {
    var i,
        port;
    bpmnShape.setPosition(ui.position.left, ui.position.top);
    bpmnShape.setDimension(ui.size.width, ui.size.height);

    bpmnShape.repaint();
    for (i = 0; i < bpmnShape.ports.getSize(); i += 1) {
        port = bpmnShape.ports.get(i);

        bpmnShape.recalculatePortPosition(port);
        port.connection.disconnect().connect();

        if (!this.resizing) {
            port.connection.checkAndCreateIntersectionsWithAll();
        }
    }

};



BPMNShape.prototype.onResizeStart = function (bpmnShape) {
    return function (e, ui) {

        bpmnShape.resizing = true;
        bpmnShape.dragging = false;
        bpmnShape.oldWidth = bpmnShape.width;
        bpmnShape.oldHeight = bpmnShape.height;
        bpmnShape.oldLeft = bpmnShape.x;
        bpmnShape.oldTop = bpmnShape.y;
        bpmnShape.oldAbsoluteX = bpmnShape.absoluteX;
        bpmnShape.oldAbsoluteY = bpmnShape.absoluteY;
        bpmnShape.initPortsChange();
        if (bpmnShape.canvas.currentSelection.getSize() > 1) {
//            $(bpmnShape.html).resizable("option", "disabled", "true");
//            return false;
            showSelectedHandlers(bpmnShape.canvas, bpmnShape, false);
//
        }
        bpmnShape.showOrHideResizeHandlers(false);
        if (bpmnShape.type === 'BPMNActivity') {
            bpmnShape.hideBoundaryEvents();
        }
        return true;
    };
};

BPMNShape.prototype.onResize = function (bpmnShape) {
    return function (e, ui) {
        bpmnShape.resizeBehavior(bpmnShape, e, ui);
    };
};
BPMNShape.prototype.onResizeEnd = function (bpmnShape) {
    var $clone;
    return function (e, ui) {

        bpmnShape.resizing = false;

        bpmnShape.resizeBehavior(bpmnShape, e, ui);
        bpmnShape.showOrHideResizeHandlers(true);
        if (bpmnShape.parent) {
            bpmnShape.parent.updateResizeListener(bpmnShape.parent);
            bpmnShape.parent.updateSize();
        }

        bpmnShape.changeSize(bpmnShape.oldWidth, bpmnShape.oldHeight);
        if (bpmnShape.oldLeft !== bpmnShape.x ||
                bpmnShape.oldTop !== bpmnShape.y) {
            bpmnShape.changePosition(bpmnShape.oldLeft, bpmnShape.oldTop,
                bpmnShape.oldAbsoluteX, bpmnShape.oldAbsoluteY);
        }
        bpmnShape.firePortsChange();

        if (bpmnShape.type === 'BPMNActivity') {
            bpmnShape.updateBoundaryPositions();
        }

//        bpmnShape.dragging = false;
    };
};


BPMNShape.prototype.initShapeChange = function () {
    var i,
        canvas = this.canvas,
        selection = canvas.currentSelection,
        bpmnShape;
    for (i = 0; i < selection.getSize(); i += 1) {
        bpmnShape = selection.get(i);
        bpmnShape.oldLeft = bpmnShape.oldX  = bpmnShape.getX();
        bpmnShape.oldTop = bpmnShape.oldY = bpmnShape.getY();
        bpmnShape.oldAbsoluteX = bpmnShape.absoluteX;
        bpmnShape.oldAbsoluteY = bpmnShape.absoluteY;
    }
};

BPMNShape.prototype.fireShapeChange = function () {
    var i,
        canvas = this.canvas,
        selection = canvas.currentSelection,
        bpmnShape;
    for (i = 0; i < selection.getSize(); i += 1) {
        bpmnShape = selection.get(i);
        bpmnShape.changePosition(bpmnShape.oldLeft, bpmnShape.oldTop,
                bpmnShape.oldAbsoluteX, bpmnShape.oldAbsoluteY);
    }
};

BPMNShape.prototype.initPortsChange = function () {
    var i,
        ports = this.ports,
        port;
    for (i = 0; i  < ports.getSize(); i += 1) {
        port = ports.get(i);
        port.oldX = port.x;
        port.oldY = port.y;
        port.oldAbsoluteX = port.absoluteX;
        port.oldAbsoluteY = port.absoluteY;
    }
};
BPMNShape.prototype.firePortsChange = function () {
    var i,
        ports = this.ports,
        port;
    for (i = 0; i < ports.getSize(); i += 1) {
        port = ports.get(i);
        port.changePosition(port.oldX, port.oldY, port.oldAbsoluteX,
            port.oldAbsoluteY);
    }
};
/**
 * Handler for the onmousedown event, changes the draggable properties according to the drag behavior that is being applied
 * @param {BPMNShape} bpmnShape
 * @returns {Function}
 */
BPMNShape.prototype.onMouseDown = function (bpmnShape) {


    return function (e, ui) {
        var dragOptions;

        e.preventDefault();
        if (e.which === 3) {

            bpmnShape.canvas.updatedElement = bpmnShape;
            $(bpmnShape.canvas.html).trigger("rightclick");
        } else if (bpmnShape.onMultipleSelection) {
            return false;
        } else {

            dragOptions = {
                helper: "none",
                cursorAt: false,
                revert: false
            };

            if (bpmnShape.dragBehavior === bpmnShape.CONNECT) {
                //that for validate focus whit connections
                //if(bpmnShape.getParent() && (bpmnShape.getParent().getType()==='BPMNPool'||bpmnShape.getParent().getType()==='bpmn_activity_subprocess')){
                   //bpmnShape.getParent().setFocus(false);
                //}
                dragOptions.helper = bpmnShape.createDragHelper;
                dragOptions.cursorAt = {top: 0, left: 0};
                dragOptions.revert = function () {
                    $(bpmnShape.html).removeClass('helper');
                    return true;
                };
                $(bpmnShape.html).addClass('helper').draggable(dragOptions);
            } else if (bpmnShape.dragBehavior === bpmnShape.DRAG) {
                $(bpmnShape.html).draggable({
                    helper: "none",
                    cursorAt: false,
                    revert: false
                });
                //bpmnShape.canvas.addToSelection(bpmnShape);
            }
            bpmnShape.dragging = true;
        }
        e.stopPropagation();
    };
};


/**
 * On Mouse Up handler it allows the shape to recalculate drag behavior whenever there was a mouse down event but no drag involved
 * @param {BPMNShape} bpmnShape
 * @return {Function}
 */
BPMNShape.prototype.onMouseUp = function (bpmnShape) {
    return function (e, ui) {
        bpmnShape.dragging = false;
        //e.stopPropagation();
    };
};


/**
 * Handler for the onmousemove event, determines the drag behavior that is being applied, the coordinates where the mouse is currently located and changes the mouse cursor
 * @param {BPMNShape} bpmnShape
 * @returns {Function}
 */

BPMNShape.prototype.onMouseMove = function (bpmnShape) {
    return function (e, ui) {
        //console.log(bpmnShape.dragend);
        //console.log("here");


        if (bpmnShape.dragging)
            return;

        $bpmnShape = $(bpmnShape.html);
        var canvas = bpmnShape.canvas;
        bpmnShape.startConnectionPoint.x = e.pageX - canvas.left - bpmnShape.absoluteX + canvas.getLeftScroll();
        bpmnShape.startConnectionPoint.y = e.pageY - canvas.top - bpmnShape.absoluteY + canvas.getTopScroll();
        bpmnShape.dragBehavior = bpmnShape.determineDragBehavior(bpmnShape.startConnectionPoint);

        if (bpmnShape.dragBehavior === bpmnShape.DRAG) {
            $bpmnShape.css('cursor', 'move');
        }
        else if (bpmnShape.dragBehavior === bpmnShape.CONNECT) {
            $bpmnShape.css('cursor', 'crosshair');
        }
        else {
            $bpmnShape.css('cursor', 'default');
        }

        //e.stopPropagation();
    };
};


/**
 * Handler of the onDragStart Event
 * @returns {Function}
 */
BPMNShape.prototype.onDragStart = function (bpmnShape) {
    return function (e, ui) {
        var i;

        bpmnShape.oldLeft = bpmnShape.oldX  = bpmnShape.getX();
        bpmnShape.oldTop = bpmnShape.oldY = bpmnShape.getY();
        bpmnShape.oldAbsoluteX = bpmnShape.absoluteX;
        bpmnShape.oldAbsoluteY = bpmnShape.absoluteY;
        bpmnShape.initShapeChange();

//        bpmnShape.dragging = true;

        //if the behavior is drag then we just return
        if (bpmnShape.dragBehavior === bpmnShape.DRAG) {
            if (!bpmnShape.canvas.currentSelection.contains(bpmnShape)) {
                bpmnShape.canvas.emptyCurrentSelection();
                bpmnShape.canvas.addToSelection(bpmnShape);


            }

            // make the parents of this shape increase its zIndex
            // so that if this shape is moved from one container to
            // another it's always on the top
            bpmnShape.oldParent = bpmnShape.parent;
            bpmnShape.increaseParentZIndex(bpmnShape.parent);
            return true;
        } else {

            if (bpmnShape.dragBehavior === bpmnShape.CONNECT) {
                //if the behavior is connect then we need to create a helper and determine where the ports would be added in case
                //there is a successful connection
                //bpmnShape.determinePortPosition(bpmnShape.startConnectionPoint);


                //working here
                bpmnShape.startConnectionPoint.x += bpmnShape.getAbsoluteX();
                bpmnShape.startConnectionPoint.y += bpmnShape.getAbsoluteY();

                return true;

            }
        }
        //return false since we don't actually need to drag the bpmnShape
        //bpmnShape.dragging = false;
        return false;
    };
};

/**
 * This method contains the dragBehavior that is applied on the drag and dragEnd events, it repaints all the bpmnShape connections while
 * the shape is being dragged
 * @param {BPMNShape} bpmnShape
 * @param {JQuery.Event} e
 * @param ui
 * @param {Boolean} root
 */
BPMNShape.prototype.dragProcedure = function (bpmnShape, e, ui, root) {

    var i,
        j,
        sibling,
        diffX,
        diffY,
        port,
        child;
    if (root) {

        bpmnShape.setPosition(ui.helper.position().left,
            ui.helper.position().top);
        diffX = bpmnShape.x - bpmnShape.oldX;
        diffY = bpmnShape.y - bpmnShape.oldY;

        bpmnShape.oldX = bpmnShape.x;
        bpmnShape.oldY = bpmnShape.y;



        for (i = 0; i < bpmnShape.canvas.currentSelection.getSize(); i += 1) {
            sibling = bpmnShape.canvas.currentSelection.get(i);
            if (sibling.id !== bpmnShape.id ) {
                sibling.setPosition(sibling.x + diffX, sibling.y + diffY);
            }
        }
    } else {

        bpmnShape.setPosition(bpmnShape.x, bpmnShape.y);

        //console.log("child " + bpmnShape.id+":" + bpmnShape.x, bpmnShape.y);

    }
    if (root) {
        for (i = 0; i < bpmnShape.canvas.currentSelection.getSize(); i += 1) {
            sibling = bpmnShape.canvas.currentSelection.get(i);
            for (j = 0; j < sibling.children.getSize(); j += 1) {
                child = sibling.children.get(j);
                child.dragProcedure(child, e, ui, false);
            }
        }
    } else {
        for (i = 0; i < bpmnShape.children.getSize(); i += 1) {
            child = bpmnShape.children.get(i);
            child.dragProcedure(child, e, ui, false);
        }
    }

    if (root) {
        for (i = 0; i < bpmnShape.canvas.currentSelection.getSize(); i += 1) {
            sibling = bpmnShape.canvas.currentSelection.get(i);
            for (j = 0; j < sibling.ports.getSize(); j += 1) {
                //for each port update its absolute position and repaint its connection
                port = sibling.ports.get(j);

                //port.setAbsolutePosition(bpmnShape.realX + port.x, bpmnShape.realY + port.y);
                port.setPosition(port.x, port.y);
                if (!bpmnShape.dragging) {
                    port.connection.disconnect().connect();
                    port.connection.checkAndCreateIntersectionsWithAll();
                } else {
                    port.connection.disconnect().connect();
                }
            }
        }
    } else {
        for (i = 0; i < bpmnShape.ports.getSize(); i += 1) {
            //for each port update its absolute position and repaint its connection
            port = bpmnShape.ports.get(i);

            //port.setAbsolutePosition(bpmnShape.realX + port.x, bpmnShape.realY + port.y);
            port.setPosition(port.x, port.y);
            port.connection.disconnect().connect();
        }
    }
};

/**
 * Handler for the onDrag event, it either draws a helper for making a connection or simply drag the shape to change its location
 * @param {BPMNShape} bpmnShape
 * @param {Canvas} canvas
 * @param {endPoint} endPoint
 * @returns {Function}
 */
BPMNShape.prototype.onDrag = function (bpmnShape, canvas, endPoint) {
    return function (e, ui) {
        var zIndex;
        if (bpmnShape.dragBehavior === bpmnShape.DRAG) {
            bpmnShape.dragProcedure(bpmnShape, e, ui, true);
        }
        else {

            if (canvas.connectionSegment) {
                //remove the connection segment in order to create another one
                $(canvas.connectionSegment.getHTML()).remove();
            }

            //Determine the point where the mouse currently is
            endPoint.x = e.pageX - canvas.getLeft() + canvas.getLeftScroll();
            endPoint.y = e.pageY - canvas.getTop() + canvas.getTopScroll();


            //creates a new segment from where the helper was created to the currently mouse location
            canvas.connectionSegment = new Segment(bpmnShape.startConnectionPoint, endPoint, canvas);
            //We make the connection segment point to helper in order to get information when the drop occurs
            canvas.connectionSegment.pointsTo = bpmnShape;
            //create HTML and paint
            canvas.connectionSegment.createHTML();
            canvas.connectionSegment.paint();

        }
    };

};
/**
 * Handler for the onDragEnd event, it either redraws the connections attached to the shape or finishes the connection by removing the segment line and setting
 * the shape to its original position
 * @param {BPMNShape} bpmnShape
 * @return {Function}
 */
BPMNShape.prototype.onDragEnd = function (bpmnShape) {
    return function (e, ui) {
        var i,
            currentSelection,
            shape;

        bpmnShape.dragging = false;

        if (bpmnShape.dragBehavior === bpmnShape.DRAG) {
            if (!bpmnShape.canvas.multipleDrop) {
                bpmnShape.dragProcedure(bpmnShape, e, ui, true);
                if (bpmnShape.onMultipleSelection) {
                    bpmnShape.changePosition(bpmnShape.oldLeft, bpmnShape.oldTop,
                        bpmnShape.oldAbsoluteX, bpmnShape.oldAbsoluteY);
                }
                bpmnShape.fireShapeChange();
            }

        } else {
            bpmnShape.setPosition(bpmnShape.oldLeft, bpmnShape.oldTop);
            if (bpmnShape.canvas.connectionSegment) {
                //remove the connection segment left
                $(bpmnShape.canvas.connectionSegment.html).remove();
            }
        }

        if (bpmnShape.canvas.currentSelection.getSize() > 1) {
            bpmnShape.onMultipleSelection = true;
        }
        bpmnShape.canvas.multipleDrop = false;

        // current selection zIndex is reverted here
        bpmnShape.decreaseParentZIndex(bpmnShape.oldParent);

        currentSelection = bpmnShape.canvas.currentSelection;

        // update current selection zIndex
        for (i = 0; i < currentSelection.getSize(); i += 1) {
            shape = currentSelection.get(i);
            shape.increaseZIndex(shape);
        }

    };
};
/**
 * Handler of the onDragEnter Event
 *
 */
BPMNShape.prototype.onDragEnter = function () {

};
/**
 * Handler for the onDragLeave event
 */
BPMNShape.prototype.onDragLeave = function () {

};


BPMNShape.prototype.dropBehavior = function (bpmnShape, e, ui) {
    var regularShapes = bpmnShape.canvas.regularShapes,
        id = ui.draggable.attr('id'),
        port = regularShapes.find('id', id),
        oldPortX,
        oldPortY,
        oldPortAbsoluteX,
        oldPortAbsoluteY;
    if (ui.helper && ui.helper.attr('id') === "drag-helper") {
        //if its the helper then we need to create two ports and draw a connection
        //we get the points and the corresponding shapes involved
        var startPoint = bpmnShape.canvas.connectionSegment.startPoint;
        var sourceShape = bpmnShape.canvas.connectionSegment.pointsTo;
        //determine the points where the helper was created
        if (sourceShape.parent && sourceShape.parent.id === bpmnShape.id) {
            return false;
        }
        sourceShape.setPosition(sourceShape.oldLeft, sourceShape.oldTop);

        startPoint.x -= sourceShape.absoluteX;
        startPoint.y -= sourceShape.absoluteY;

        //create the ports
        var sourcePort = new Port();
        var endPort = new Port();

        //determine the position where the helper was dropped
        var endPortLeft = ui.offset.left - bpmnShape.canvas.left - bpmnShape.absoluteX + bpmnShape.canvas.getLeftScroll();
        var endPortTop = ui.offset.top - bpmnShape.canvas.top - bpmnShape.absoluteY + bpmnShape.canvas.getTopScroll();
        //add ports to the corresponding shapes
        sourceShape.addPort(sourcePort, startPoint.x, startPoint.y);
        bpmnShape.addPort(endPort, endPortLeft, endPortTop);
        //add ports to the canvas array for regularShapes
        bpmnShape.canvas.regularShapes.insert(sourcePort).insert(endPort);
        //create a connection
        var connection = new Connection(sourcePort, endPort, bpmnShape.canvas);
        //set their decorators
        connection.setTargetDecorator(new TargetSpriteConnectionDecorator(connection));
        connection.setSourceDecorator(new SourceSpriteConnectionDecorator(connection));
//            connection.setStyleSegments('segmentdot');
        //connect the two ports
        connection.connect();
        // fixes the zIndex of the connection
        connection.fixZIndex();
        //add the connection to the canvas, that means insert its html to the DOM and adding it to the connections array
        bpmnShape.canvas.addConnection(connection);

        // now that the connection was drawn try to create the intersections
        connection.checkAndCreateIntersectionsWithAll();

        //attaching port listeners
        sourcePort.attachListeners(sourcePort);
        endPort.attachListeners(endPort);
        return true;
    } else if (port) {
        //otherwise if it is not the helper then we are just moving ports
        //get the new position of the port
        var x = ui.position.left;
        var y = ui.position.top;
        port.setPosition(x, y);
        if (bpmnShape.getID() !== port.parent.getID()) {
            //alert('move port');
            port.parent.removePort(port);
            var currLeft = ui.offset.left - bpmnShape.canvas.left - bpmnShape.absoluteX;
            var currTop = ui.offset.top - bpmnShape.canvas.top - bpmnShape.absoluteY;
            bpmnShape.addPort(port, currLeft, currTop, true);
            bpmnShape.canvas.regularShapes.insert(port);
            //bpmnShape.definePortPosition(port, port.getPoint(true));

        } else {
            //validate its position to determine where to position the dropped port
            oldPortX = port.x;
            oldPortY = port.y;
            oldPortAbsoluteX = port.absoluteX;
            oldPortAbsoluteY = port.absoluteY;
            bpmnShape.definePortPosition(port, port.getPoint(true));
            port.changePosition(oldPortX, oldPortY, oldPortAbsoluteX,
                oldPortAbsoluteY);
        }
        return true;
    }
    return false;
};

/**
 * Handler for the onDrop event, it makes a connection between bpmnShape or moves a port location of the shape
 * @param {BPMNShape} bpmnShape
 * @return {Function}
 */
BPMNShape.prototype.onDrop = function (bpmnShape) {
    return function (e, ui) {
        return bpmnShape.dropBehavior(bpmnShape, e, ui);
    };
};


/**
 * Handler of the onClick Event hides the selected ports and resize Handlers if any and show its corresponding resize handler
 * @param bpmnShape
 * @type Function
 */
BPMNShape.prototype.onClick = function (bpmnShape) {
    return function (e, ui) {
        var isCtrl = false,
            current = null,
            currentSelection = bpmnShape.canvas.currentSelection,
            currentSize = currentSelection.getSize(),
            prevShape = currentSelection.contains(bpmnShape);
        if (e.ctrlKey) {
            //Ctrl+Click
            isCtrl = true;
        }
        //just hide the selected ports
        hideSelectedPorts(bpmnShape.canvas);
        if (e.which === 3) {
            e.preventDefault();
            alert("asdhassdiahsda");
            bpmnShape.canvas.updatedElement = bpmnShape;
            $(bpmnShape.canvas.html).trigger("rightclick");
        } else if (!bpmnShape.onMultipleSelection) {
            showSelectedHandlers(bpmnShape.canvas, bpmnShape, isCtrl);
            if (isCtrl) {
                if (currentSize === 0) {
                    bpmnShape.canvas.updatedElement = bpmnShape;
                    $(bpmnShape.canvas.html).trigger("selectelement");
                } else if (!prevShape) {
                    bpmnShape.canvas.updatedElement = {
                        "selectedElements" : currentSelection.asArray()
                    };
                    $(bpmnShape.canvas.html).trigger(
                        "multipleelementsselection"
                    );
                }
            } else if (!prevShape) {

                bpmnShape.canvas.updatedElement = bpmnShape;
                $(bpmnShape.canvas.html).trigger("selectelement");
            }
        }
        hidePreviousConnection(bpmnShape.canvas);
        bpmnShape.canvas.rectangleSelection.reset().setVisible(false);

        if (this.helper) {
            $(this.helper.html).remove();
        }
        //verify and prevent lost focus when is selected
        current = bpmnShape.canvas.getCurrentShape();
        if (current !== undefined && current !== null && current !== bpmnShape) {
            if (current.label !== undefined && $(current.label.text.html).is( ":focus" )){
                $(current.label.text.html).focusout();
            }
        }
        bpmnShape.onMultipleSelection = false;
        bpmnShape.canvas.setCurrentShape(bpmnShape);
        e.stopPropagation();
    };
};

//getters

/**
 * Returns a list of ports related to the shape
 * @returns {ArrayList}
 */
BPMNShape.prototype.getPorts = function () {
    return this.ports;
};
/**
 * Returns a list of Layers related to the shape
 * @returns {ArrayList}
 */
BPMNShape.prototype.getLayers = function () {
    return this.layers;
};

//setters

/**
 * Sets a list of ports related to the shape
 * @param {ArrayList} newPortList
 * @returns {BPMNShape}
 */
BPMNShape.prototype.setPorts = function (newPortList) {
    if (newPortList.type === "ArrayList")
        this.ports = newPortList;
    return this;
};
/**
 * Sets a list of layers related to the shape
 * @param {ArrayList} newLayerList
 * @returns {BPMNShape}
 */
BPMNShape.prototype.setLayers = function (newLayerList) {
    if (newLayerList.type == "ArrayList")
        this.layers = newLayerList;
    return this;
};

BPMNShape.prototype.addMarkers = function (newLayer, pos, eclass) {
    var  nMarker, x, lMarker, ifExist = false;
    for (x = 0; x <= newLayer.markers.getSize() - 1; x++){
        lMarker = newLayer.markers.get(x);
        if (lMarker.position === pos) {
            ifExist = true;
            break;
        }
    }
    if (!ifExist) {
        nMarker = new Markers(newLayer, pos, eclass);
        newLayer.markers.insert(nMarker);
        nMarker.paint();
    } else {
        lMarker.setElementClass(eclass);
    }
};

//***************************************************************************
//****************************End Of Class **********************************
//***************************************************************************
