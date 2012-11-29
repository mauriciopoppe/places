/**
 * @fileOverview This file will contain the classes related to the canvas
 * @author Thaer Latif
 */

//***************************************************************************
//****************************Start of Canvas Class**************************
//***************************************************************************

/**
 * Constructs the canvas
 * @class Represents the canvas where all bpmn elements interact
 * @augments JCoreObject
 */

var Canvas = function (id) {
    /**
     * The id of the canvas
     * @type String
     */
    this.id = id || "canvasID";

    this.width = 4000;

    this.height = 4000;

    /**
     * HTML Representation of the canvas
     * @type Object
     */
    this.html = (id) ? document.getElementById(id) : null;
    if (this.html) {
        //this is needed for all the other elements to be relative to the canvas
        this.html.style.position = "absolute";
        this.html.style.width = this.width + "px";
        this.html.style.height = this.height + "px";
    } else {
        return; //if there is no id used for the canvas then we just return
    }
    /**
     * A list of all the connections in the canvas
     * @type ArrayList
     */
    this.canvasConnections = new ArrayList();
    /**
     * A list of all the shapes in the canvas
     * @type ArrayList
     */
    this.canvasShapes = new ArrayList();
    /**
     * A list of all the containers in the canvas
     * @type ArrayList
     */
    this.containers = new ArrayList();
    /**
     * List of all bpmn shapes of the canvas
     * @type ArrayList
     */
    this.bpmnShapes = new ArrayList();
    /**
     * List of all regular Shapes of the canvas
     */
    this.regularShapes = new ArrayList();
    /**
     * The left coordinate of the canvas
     * @type Number
     */
    this.left  = 0;
    /**
     * The top coordinate of the canvas
     * @type Number
     */
    this.top = 0;
    /**
     * Connection segment used for drag and drop connections
     * @type Segment
     */
    this.connectionSegment = null;
    /**
     * Left Scroll Position of the canvas
     * @type Number
     */
    this.leftScroll = 0;
    /**
     * Top Scroll position of the canvas
     * @type Number
     */
    this.topScroll = 0;
    /**
     * Zoom Factor
     * @type Number
     */
    this.zoomFactor = 100;
    /**
     * The position where the properties for a given zoom are located for each
     * element of the canvas
     * @type Number
     */
    this.propertyPosition = 2;
    /**
     * The source port that is currently selected in the canvas
     * @type Port
     */
    this.selectedSourcePort = null;
    /**
     * The destination port that is currently selected in the canvas
     * @type Port
     */
    this.selectedDestPort = null;
    /**
     * List of selected elements in the canvas
     * @type ArrayList
     */
    this.currentSelection = new ArrayList();
    this.currentShape = null;
    /**
     * Current connection in the canvas
     * @type {Connection}
     */
    this.currentConnection = null;


    // MultipleSelectionContainer variables
    /**
     * Represents the rectangle created to do multiple selection
     * @type {MultipleSelectionContainer}
     */
    this.rectangleSelection = new MultipleSelectionContainer(this);


    /**
     * True if the mouseDown event of the canvas is triggered,
     * it's set to false in mouseUp event
     * @type {Boolean}
     */
    this.isMouseDown = false;

    /**
     * True if the mouseDown event of the canvas is triggered and the mouseMove
     * event is triggered,it's set to false in mouseUp event
     * @type {Boolean}
     */
    this.isMouseDownAndMove = false;
    /**
     * Denotes if there's been a multiple drop prior to a drag end
     * @type {Boolean}
     */
    this.multipleDrop = false;
    /**
     * Determines if the elements where selected with in an attempt to select
     * multiple elements
     * @type {Boolean}
     */
    this.multipleSelection = false;

    /**
     * Default zIndex for the canvas
     * @type {Number}
     */
    this.defaultZzOrder = 0;
    /**
     * Initially the canvas zIndex is 0
     * @type {Number}
     */
    this.zOrder = 0;

    /**
     * Points to the element that's been added, changed or deleted in the
     * canvas
     * @type *
     */
    this.updatedElement = null;
    /**
     * Pointer to the last connection selected in the canvas
     * @type {Connection}
     */
    this.previousConnection = null;
    /**
     * Determines if the canvas's been right clicked at mouse down
     * @type {Boolean}
     */
    this.rightClick = false;

    this.intersectionTimeout = null;

};

Canvas.prototype  = new JCoreObject();
Canvas.prototype.type = "Canvas";


/**
 * Picks the list of the canvas where the shape should be added
 * @param {Shape} shape
 * @return {*}
 */
Canvas.prototype.addToList = function (shape) {
    if (shape.isContainer()) {
        this.containers.insert(shape);
    }
    switch (shape.family) {
    case "BPMNShape":
        this.bpmnShapes.insert(shape);
        break;
    case "RegularShape":
        this.regularShapes.insert(shape);
        break;
    case "Shape":
        this.canvasShapes.insert(shape);
        break;
    default:
    }
    return this;
};
/**
 * Adds a specified shape given some the coordinates x and y
 * @param {Shape} shape
 * @param {Number} x
 * @param {Number} y
 * @returns {Canvas}
 */
Canvas.prototype.addShape = function (shape, x, y) {
    shape.setPosition(x, y)
        .setCanvas(this);
    //insert the shape HTML to the DOM
    this.html.appendChild(shape.getHTML());
    shape.paint();
    return this;
};
/**
 * Adds a connection to the canvas, appending its html to the DOM and inserting
 * it in the list of connections
 * @param {Connection} conn
 * @returns {Canvas}
 */
Canvas.prototype.addConnection = function (conn) {
    this.html.appendChild(conn.getHTML());
    this.canvasConnections.insert(conn);
    this.updatedElement = conn;
    $(this.html).trigger("createelement");
    return this;
};
/**
 * Remove all selected elements (for multiselection)
 * @param {Canvas} canvas
 * @returns {Canvas}
 */
Canvas.prototype.removeElements = function (canvas) {
    while (canvas.getCurrentSelection().getSize() > 0) {
        canvas.getCurrentSelection().getFirst().destroy();
    }
    if (canvas.currentConnection) {

        canvas.currentConnection.destroy();
    }

    return this;
};

/**
 * Move all selected elements (for multiselection)
 * @param {Canvas} canvas
 * @returns {Canvas}
 */
Canvas.prototype.moveElements = function (canvas, direction) {
    var i, j,
        shape,
        hfactor = 0,
        vfactor = 0,
        port;
    switch(direction){
        case 'LEFT':
            hfactor = -1;
            break;
        case 'RIGHT':
            hfactor = 1;
            break;
        case 'TOP':
            vfactor = -1;
            break;
        case 'BOTTON':
            vfactor = 1;
            break;
    }

    for (i = 0; i < canvas.getCurrentSelection().getSize(); i += 1) {
        shape =canvas.getCurrentSelection().get(i);

        shape.setPosition(shape.getX()+hfactor,shape.getY()+vfactor);
        for (j = 0; j < shape.ports.getSize(); j++) {
            //for each port update its absolute position and repaint its
            // connection
            port = shape.ports.get(j);

            port.setPosition(port.x, port.y);
            port.connection.disconnect().connect();

            clearTimeout(this.intersectionTimeout);
            this.intersectionTimeout = setTimeout(function () {
                port.connection.disconnect().connect();
                port.connection.checkAndCreateIntersectionsWithAll();
            }, 2000);
            this.intersectionTimeout = null;
        }
    }

    return this;
};
/**
 * Removes a specified shape
 * @param {Shape} shape
 * @returns {Canvas}
 */
Canvas.prototype.removeShape = function (shape) {
    // remove from the current selection
    this.currentSelection.remove(shape);

    // remove from the canvas arrayList
    if (shape.isContainer()) {
        this.containers.remove(shape);
    } else if (shape.family === "BPMNShape") {
        this.bpmnShapes.remove(shape);
    } else if (shape.family === "RegularShape") {
        this.regularShapes.remove(shape);
    } else if (shape.family === "Shape") {
        this.canvasShapes.remove(shape);
    }
    return this;
};
/**
 * Remove a current selection shape
 * @param {Shape} newSelection
 * @returns {Canvas}
 */
Canvas.prototype.removeCurrentSelection = function (newSelection) {
    this.currentSelection.remove(newSelection);
    return this;
};


Canvas.prototype.emptyCurrentSelection = function () {
    var i,
        shape;
    while (this.currentSelection.getSize() > 0) {
        shape = this.currentSelection.get(0);
        this.removeFromSelection(shape);
    }
    //console.log("selection after clear: " + this.currentSelection.getSize());
    this.currentSelection.clear();
    return this;
};

Canvas.prototype.isValidSelection = function (referenceShape, newShape) {
    if (referenceShape.parent === null) {
        if (newShape.parent === null) {
            return true;
        }
        return false;
    } else {
        if (newShape.parent === null) {
            return false;
        } else if (newShape.parent.id === referenceShape.parent.id) {
            return true;
        }
    }
    return false;
};

Canvas.prototype.addToSelection = function (bpmnShape) {
    var currentSelection = this.currentSelection,
        firstSelected,
        valid,
        isEmpty = currentSelection.isEmpty();
    if (!isEmpty) {
        firstSelected = currentSelection.get(0);
        valid = this.isValidSelection(firstSelected, bpmnShape);
    } else {
        valid = true;
    }

    if (!currentSelection.contains(bpmnShape) && valid) {
        // increase this shape zIndex
        bpmnShape.increaseZIndex(bpmnShape);
        currentSelection.insert(bpmnShape);
        bpmnShape.showOrHideResizeHandlers(true);

    }
    return this;
};

Canvas.prototype.removeFromSelection = function (bpmnShape) {
    bpmnShape.decreaseZIndex(bpmnShape);
    this.currentSelection.remove(bpmnShape);
    bpmnShape.showOrHideResizeHandlers(false);
};

/**
 * Removes a specified connections
 * @param {Connection} conn
 * @returns {Canvas}
 */
Canvas.prototype.removeConnection = function (conn) {
    //this.currentSelection.remove(conn);
    this.canvasConnections.remove(conn);
    return this;
};
/**
 * Sets the left and top coordinate of the canvas
 * @param {Number} x
 * @param {Number} y
 * @returns {Canvas}
 */
Canvas.prototype.setPosition = function (x, y) {
    this.setLeft(x);
    this.setTop(y);
    return this;
};
/**
 * Attach necessary event listeners to the canvas
 * @param {Canvas} canvas
 */
Canvas.prototype.attachListeners = function (canvas) {
    var $canvas = $(canvas.html).click(canvas.onClick(canvas)),
        dropOptions;

    $canvas.mousedown(canvas.onMouseDown(canvas));
    $canvas.mousemove(canvas.onMouseMove(canvas));
    $canvas.mouseup(canvas.onMouseUp(canvas));
    $canvas.on("createelement", canvas.onCreateElement(canvas));
    $canvas.on("removeelement", canvas.onRemoveElement(canvas));
    $canvas.on("changeelement", canvas.onChangeElement(canvas));
    $canvas.on("selectelement", canvas.onSelectElement(canvas));
    $canvas.on("multipleelementsselection",
        canvas.onMultipleElementsSelection(canvas));
    $canvas.on("rightclick", canvas.onRightClick(canvas));
    $canvas.on("contextmenu", function (e) {
        e.preventDefault();
    });

    dropOptions = {

        accept: "#pool,#event,#intermediateevent,#endevent,#activity" +
            ",#gateway,#participant,#dataobject,#datastore,#annotation" +
            ",#subprocess, #group, .valid-outside-shapes," +
            ".valid-outside-shapes-group,.other-valid," +
            ".valid-drop-class,.helper",

        drop: canvas.onDrop(canvas)

    };

    $canvas
        .droppable(dropOptions);
};


/**
 * This is a handler that will be executed after an element has been created in
 * the canvas.
 * It is meant to be overwritten.
 * This handler will be executed every time a bpmnShape, a connection, or an
 * independent label is created
 * @param updatedElement Reference to the last element that's been added to the
 * canvas
 */
Canvas.prototype.onCreateElementHandler = function (updatedElement) {

    console.log("oncreate");
    console.log(updatedElement);
    return true;
};

/**
 * Executes the handler for the custom createelement event
 * @param canvas
 * @return {Function}
 */
Canvas.prototype.onCreateElement = function (canvas) {
    return function (e, ui) {
        canvas.onCreateElementHandler(canvas.updatedElement);
    };
};


Canvas.prototype.onRemoveElementHandler = function (elementId) {
    console.log("remove");
    //alert("an element with this id: " + elementId + " been deleted ");
    return true;
};

Canvas.prototype.onRemoveElement = function (canvas) {
    return function (e, ui) {
        canvas.onRemoveElementHandler(canvas.updatedElement.id);
    };
};


Canvas.prototype.onChangeElementHandler = function (updatedElement) {
    console.log("onchange");
    console.log(updatedElement);
    return true;
};

Canvas.prototype.onChangeElement = function (canvas) {
    return function (e, ui) {
        canvas.onChangeElementHandler(canvas.updatedElement);
    };
};

Canvas.prototype.onSelectElementHandler = function (updatedElement) {
    console.log("onselect");
    console.log(updatedElement);
};

Canvas.prototype.onSelectElement = function (canvas) {
    return function (e, ui) {
        canvas.onSelectElementHandler(canvas.updatedElement);
    };
};

Canvas.prototype.onMultipleElementsSelectionHandler = function (updatedElement) {
    console.log("multipleselection");
    console.log(updatedElement);
};

Canvas.prototype.onMultipleElementsSelection = function (canvas) {
    return function (e, ui) {
        canvas.onMultipleElementsSelectionHandler(canvas.updatedElement);
    };
};

Canvas.prototype.onRightClickHandler = function (updatedElement) {
    console.log("rightclick");
    console.log(updatedElement);
};

Canvas.prototype.onRightClick = function (canvas) {
    return function (e, ui) {
        canvas.onRightClickHandler(canvas.updatedElement);
    };
};

/**
 * Click event handler, hide selected ports and resize handlers
 * @param {Canvas} canvas
 * @returns {Function}
 */
Canvas.prototype.onClick = function (canvas) {
    return function (e, ui) {

        // testing
//        var bpmnShape = new BPMNActivity(8);
//        addToContainer(canvas, bpmnShape, e);
//        canvas.addToList(bpmnShape);
//        bpmnShape.attachListeners(bpmnShape);
//        bpmnShape.paint();
        // end testing



        //console.log(e.pageX + " " + e.pageY);

//        if (!canvas.isMouseDownAndMove) {
//            //canvas.rectangleSelection.showOrHideResizeHandlers(false);
//        }

    };
};


/**
 * MouseDown event of the canvas
 * @param canvas
 * @return {Function}
 */
Canvas.prototype.onMouseDown = function (canvas) {
    return function (e, ui) {

        var x = e.pageX - canvas.getLeft() + canvas.getLeftScroll(),
            y = e.pageY - canvas.getTop() + canvas.getTopScroll();
        e.preventDefault();

        if (e.which === 3) {
            canvas.rightClick = true;
            canvas.updatedElement = canvas;
            $(canvas.html).trigger("rightclick");

        }

        canvas.isMouseDown = true;
        canvas.isMouseDownAndMove = false;

        // clear old selection
        canvas.emptyCurrentSelection();

        canvas.rectangleSelection.reset();
        canvas.rectangleSelection.setPosition(x, y);
        canvas.rectangleSelection.oldX = x;
        canvas.rectangleSelection.oldY = y;
        canvas.rectangleSelection.setVisible(true);
        canvas.rectangleSelection.changeOpacity(0.2);
//        console.log("canvas down");

    };
};

/**
 * MouseMove event of the canvas (some code is executed only if the mouseDown
 * event was triggered before)
 * @param canvas
 * @return {Function}
 */
Canvas.prototype.onMouseMove = function (canvas) {
    return function (e, ui) {
        if (canvas.isMouseDown && !canvas.rightClick) {
            canvas.isMouseDownAndMove = true;
            var x = e.pageX - canvas.getLeft() + canvas.getLeftScroll(),
                y = e.pageY - canvas.getTop() + canvas.getTopScroll(),
                topLeftX,
                topLeftY,
                bottomRightX,
                bottomRightY;

            topLeftX = Math.min(x, canvas.rectangleSelection.oldX);
            topLeftY = Math.min(y, canvas.rectangleSelection.oldY);
            bottomRightX = Math.max(x, canvas.rectangleSelection.oldX);
            bottomRightY = Math.max(y, canvas.rectangleSelection.oldY);

            canvas.rectangleSelection.setPosition(topLeftX, topLeftY);
            canvas.rectangleSelection.setDimension(bottomRightX - topLeftX,
                bottomRightY - topLeftY);

        }

//        console.log("canvas move");
    };
};

/**
 * MouseUp event of the canvas (executes some code only of the mouseDownAndMove
 * variable is set to true in the mouseMove event)
 * @param canvas
 * @return {Function}
 */
Canvas.prototype.onMouseUp = function (canvas) {
    return function (e, ui) {
        if (canvas.isMouseDownAndMove) {
            var x = e.pageX - canvas.getLeft() + canvas.getLeftScroll(),
                y = e.pageY - canvas.getTop() + canvas.getTopScroll();
            canvas.rectangleSelection.setPosition(
                Math.min(x, canvas.rectangleSelection.x),
                Math.min(y, canvas.rectangleSelection.y)
            );

            if (canvas.rectangleSelection) {
                canvas.rectangleSelection.wrapElements();
            }
        } else {
            canvas.setCurrentShape(null);
            hideSelectedPorts(canvas);


            showSelectedHandlers(canvas, null, false, true);
            hidePreviousConnection(canvas);
            if (!canvas.rectangleSelection.wasDragged) {
                canvas.rectangleSelection.reset().setVisible(false);
            }
        }
        canvas.isMouseDown = false;
        canvas.isMouseDownAndMove = false;
        canvas.rightClick = false;

//        console.log("canvas up");
    };
};

/**
 * Handler for scrolling
 */
Canvas.prototype.onScroll = function () {

};
/**
 * Handler for the on drag start event
 * @returns {Boolean}
 */
Canvas.prototype.onDragStart = function () {
    return true;
};
/**
 * Handler for the on drag event
 */
Canvas.prototype.onDrag = function () {

};
/**
 * Handler for the on drag end event
 */
Canvas.prototype.onDragEnd = function () {

};
/**
 * Handler for the on drop event, creates an image based on its type and adds
 * the shape to the canvas handling the scroll and page coordinates using the
 * event and ui objects
 * @param {Canvas} canvas Respective canvas
 * @returns {Function}
 */
Canvas.prototype.onDrop = function (canvas) {
    return function (e, ui) {

        //variable that will hold the corresponding bpmn shape
        var bpmnShape,
        //the dropped object id
            droppedId,
            coordinates,
            i,
            selection,
            sibling;
        if (ui.helper && ui.helper.attr('id') === 'drag-helper') {
            return false;
        }

        droppedId = ui.draggable.attr('id');

        bpmnShape = createShapeById(droppedId);
        //this means that the shape was moved, not added
        if (bpmnShape === null) {
            bpmnShape = canvas.bpmnShapes.find('id', droppedId);
            if (!bpmnShape) {
                return false;
            }
            if (bpmnShape.parent) {
                selection = canvas.currentSelection;
                for (i = 0; i < selection.getSize(); i += 1) {
                    sibling = selection.get(i);
                    coordinates = getPointRelativeToPage(sibling);
                    removeFromContainer(sibling);
                    addToContainer(canvas, sibling, e, coordinates.x,
                        coordinates.y);
                    sibling.fixZIndex(sibling, 0);
                    sibling.parent = null;

                }
                canvas.multipleDrop = true;
            }
            canvas.updatedElement = false;
            return true;
        } else {
            canvas.updatedElement = bpmnShape;
        }

        addToContainer(canvas, bpmnShape, e);
        bpmnShape.fixZIndex(bpmnShape, 0);

        canvas.addToList(bpmnShape);
        bpmnShape.attachListeners(bpmnShape);
        if (bpmnShape.family !==
                'RegularShape' && bpmnShape.type !== 'Label') {
            bpmnShape.showOrHideResizeHandlers(false);
        }
        if (canvas.updatedElement) {
            $(canvas.html).trigger("createelement");
        }
        return true;
    };

};
/**
 * Hander for the supr key event
 */
Canvas.prototype.onSupr = function () {

};

/**
 * Returns the id of the canvas
 * @returns {String}
 */

Canvas.prototype.getID = function () {
    return this.id;
};

/**
 * Returns the canvas html
 * @returns {Object}
 */
Canvas.prototype.getHTML = function () {
    return this.html;
};

/**
 * Returns the a list of the connections in the canvas
 * @returns {ArrayList}
 */
Canvas.prototype.getCanvasConnections = function () {
    return this.canvasConnections;
};
/**
 * Returns the zoom factor applied to the canvas
 * @returns {Number}
 */
Canvas.prototype.getZoomFactor = function () {
    return this.zoomFactor;
};
/**
 * Returns the position where the properties of a given zoom are located for
 * each element of the canvas
 * @returns {Number}
 */
Canvas.prototype.getPropertyPosition = function () {
    return this.propertyPosition;
};

/**
 * Returns a list of the shapes in the canvas
 * @returns {ArrayList}
 */
Canvas.prototype.getCanvasShapes = function () {
    return this.canvasShapes;
};
/**
 * Returns a list of the containers in the canvas
 * @returns {ArrayList}
 */
Canvas.prototype.getContainers = function () {
    return this.containers;
};

/**
 * Returns the left coordinate relative to the canvas
 * @returns {Number}
 */
Canvas.prototype.getLeft = function () {
    return this.left;
};

/**
 * Returns the top coordinate relative to the canvas
 * @returns {Number}
 */
Canvas.prototype.getTop = function () {
    return this.top;
};
/**
 * Returns the left scroll position of the canvas
 * @returns {Number}
 */
Canvas.prototype.getLeftScroll = function () {
    return this.leftScroll;
};
/**
 * Returns the top scroll position of the canvas
 * @returns {Number}
 */
Canvas.prototype.getTopScroll = function () {
    return this.topScroll;
};

/**
 * Returns the current selection of the canvas
 * @returns {ArrayList}
 */
Canvas.prototype.getCurrentSelection = function () {
    return this.currentSelection;
};
/**
 * Returns the current selected shape of the canvas
 * @returns {ArrayList}
 */
Canvas.prototype.getCurrentShape = function (newSelected) {
    return this.currentShape;
};

/**
 * Returns the connection segment of the canvas
 * @returns {Segment}
 */
Canvas.prototype.getConnectionSegment = function () {
    return this.connectionSegment;
};

Canvas.prototype.getWidth = function () {
    return this.width;
};

Canvas.prototype.getHeight = function () {
    return this.height;
};

/**
 * Sets the id of the canvas
 * @param {String} newID
 * @returns {Canvas}
 */
Canvas.prototype.setID = function (newID) {
    return this;
};
/**
 * Sets the connections in the canvas
 * @param {ArrayList} newConnections
 * @returns {Canvas}
 */
Canvas.prototype.setCanvasConnections = function (newConnections) {
    return this;
};
/**
 * Sets the shapes in the canvas
 * @param {ArrayList} newShapes
 * @returns {Canvas}
 */
Canvas.prototype.setCanvasShapes = function (newShapes) {
    return this;
};
/**
 * Set the zoom Factor applied in the canvas
 * @param {Number} newZoom
 * @returns {Canvas}
 */
Canvas.prototype.setZoomFactor = function (newZoom) {
    if (typeof newZoom === "number" && newZoom % 25 === 0 && newZoom > 0) {
        this.zoomFactor = newZoom;
    }
    return this;
};
/**
 * Sets the position where the properties for each element on the canvas
 * should be
 * @param {Number} newPosition
 * @returns {Canvas}
 */
Canvas.prototype.setPropertyPosition = function (newPosition) {
    if (typeof newPosition === "number" && newPosition >= 0 &&
            newPosition < this.elementProperties.length) {
        this.propertyPosition = newPosition;
    }
    return this;
};
/**
 * Sets the containers in the canvas
 * @param {ArrayList} newContainers
 * @returns {Canvas}
 */
Canvas.prototype.setContainers = function (newContainers) {
    return this;
};
/**
 * Sets the left coordinate relative to the canvas
 * @param {Number} newPosition
 * @returns {Canvas}
 */
Canvas.prototype.setLeft = function (newPosition) {
    if (typeof newPosition === "number" && newPosition >= 0) {
        this.left = newPosition;
        if (this.html) {
            this.html.style.left = this.left;
        }
    }
    return this;
};
/**
 * Sets the top coordinate relative to the canvas
 * @param {Number} newPosition
 * @returns {Canvas}
 */
Canvas.prototype.setTop = function (newPosition) {
    if (typeof newPosition === "number" && newPosition >= 0) {
        this.top = newPosition;
        if (this.html) {
            this.html.style.top = this.top;
        }
    }
    return this;
};
/**
 * Sets the left scroll position of the canvas
 * @param {Number} newPosition
 * @returns {Canvas}
 */
Canvas.prototype.setLeftScroll = function (newPosition) {
    if (typeof newPosition === "number" && newPosition >= 0) {
        this.leftScroll = newPosition;
    }
    return this;
};
/**
 * Sets the top scroll position of the canvas
 * @param {Number} newPosition
 * @returns {Canvas}
 */
Canvas.prototype.setTopScroll = function (newPosition) {
    if (typeof newPosition === "number" && newPosition >= 0) {
        this.topScroll = newPosition;
    }
    return this;
};
/**
 * Sets the current selected shape to the canvas
 * @param {JCoreObject} newSelected
 * @returns {Canvas}
 */
Canvas.prototype.setCurrentShape = function (newSelected) {
    this.currentShape = newSelected;
    return this;
};

/**
 * Sets the current selection of the canvas
 * @param {JCoreObject} newSelection
 * @returns {Canvas}
 */
Canvas.prototype.setCurrentSelection = function (newSelection) {
    this.currentSelection.insert(newSelection);
    return this;
};
/**
 * Sets the connection segment of the canvas
 * @param {Segment} newSegment
 * @returns {Canvas}
 */
Canvas.prototype.setConnectionSegment = function (newSegment) {
    return this;
};

Canvas.prototype.getZOrder = function () {
    return Shape.prototype.getZOrder.call(this);
};
//***************************************************************************
//****************************End Of Class **********************************
//***************************************************************************
