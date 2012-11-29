/**
 * Initializes a Shape Object
 * @class Represents a shape of any kind used for the jCore framework
 * @augments JCoreObject
 * @param {Number} resizePointNumber, Numbers of resizePoints applied
 * to the shape
 *
 */
var Shape = function (resizePointNumber) {
    /** ID of the element
     * @type String
     */
    this.id = UniqueID.create();
    /** HTML representation of the object
     * @type Object
     */
    this.html = null;
    /**
     * Default zOrder of the shape
     * @type {Number}
     */
    this.defaultZOrder = 1;
    /** zOrder of the HTML Representation
     * @type Number
     */
    this.zOrder = 1;
    /** Canvas of the object
     * @type Canvas
     */
    this.canvas = null;
    /** Parent Element of the object if exists
     * @type Shape
     */
    this.parent = null;
    //Not Sure about this yet
    this.moveListeners = null;
    /** Width of the object
     * @type Number
     */
    this.width = 0;
    /** Height of the object
     * @type Number
     */
    this.height = 0;
    /** x coordinate of the object
     * @type Number
     */
    this.x = 0;
    /** y coordinate of the object
     * @type Number
     */
    this.y = 0;
    /** Children nodes of the object (These can be other Shapes)
     * @type ArrayList
     */
    this.children = new ArrayList();
    /**
     * Determines whether a shape has fixed Dimensions or not
     * @type Boolean
     */
    this.fixed  = true;
    /**
     * Denotes the container of the shape, by default it should be the canvas
     * @type Object
     */
    this.parentContainer = null;
    /**
     * Denotes if the shape can be a container itself
     * @type boolean
     */
    this.container = false;
    /**
     * The X Coordinate of what is the shape representation
     * @type {Number}
     */
    this.realX = 0;
    /**
     * The Y Coordinate of what is the shape representation
     * @type {Number}
     */
    this.realY = 0;
    /**
     * The real Width of the shape representation, including the border,
     * styles, and others
     * @type {Number}
     */
    this.realWidth = 0;
    /**
     * The real Height of the shape representation, including the border,
     * styles, and others
     * @type {Number}
     */
    this.realHeight = 0;
    /**
     * The x coordinate relative to the canvas
     * @type {Number}
     */
    this.absoluteX = 0;
    /**
     * The y coordinate relative to the canvas
     * @type {Number}
     */
    this.absoluteY = 0;

    this.oldX = 0;

    this.oldY = 0;

    this.oldAbsoluteX = 0;

    this.oldAbsoluteY = 0;
    /**
     * Determines whether the shape is being dragged or not
     * @type {Boolean}
     */
    this.dragging = false;
    /**
     * Determines whether the shape is being resized or not
     * @type {Boolean}
     */
    this.resizing = false;
};

Shape.prototype = new JCoreObject();
Shape.prototype.type = "Shape";
Shape.prototype.family = "Shape";

Shape.prototype.MAX_ZINDEX = 100;
Shape.prototype.DEFAULT_RADIUS = 6;

Shape.prototype.attachListeners = function (shape) {
    return shape;
};

/**
 * Creates the HTML Representation of the Shape
 * @returns {Object}
 */
Shape.prototype.createHTML = function (modifying) {
    //determine the zoom that will be applied to the shape
    var zoom,
        propertiesPosition,
        properties;
    zoom = (this.canvas) ? this.canvas.getZoomFactor() : 100;
    //Determine the position where the shape properties are located for the
    // given zoom factor, the default position is 2 that stands for zoom = 100
    propertiesPosition = (this.canvas) ? this.canvas.getPropertyPosition() : 2;
    properties = this.elementProperties[propertiesPosition];

    if (!modifying) {
        //If the element is true, we are just modifying some properties
        //otherwise we are creating the element
        this.html = document.createElement("div");
        this.html.id = this.getID();
        this.html.style.position = "absolute";
    }
    this.html.style.left = this.x + "px";
    this.html.style.top = this.y + "px";

    //If the positions are fixed then we can use the standard value for the
    //proper zoom
    if (!this.fixed) {
        //otherwise we just apply the zoom Factor to the current values
        this.setDimension(this.width * zoom / 100, this.height * zoom / 100);

    } else {
        //TODO: verificar dimension cuando el shape ya cambio de tamaño
        this.setDimension(properties.width, properties.height);
    }
    this.html.style.width = this.width + "px";
    this.html.style.height = this.height + "px";
    this.html.style.zIndex = this.zOrder;
    //  this.html.style.backgroundColor = "red";
    return this.html;
};
/**
 * In charge of the painting / positioning of the figure on the DOM
 * and setting the styles
 * @returns {Shape}
 */
Shape.prototype.paint = function () {
    return this;
};

/**
 * Repaints the shape changing some of its html attributes and painting it again
 * @returns {Shape}
 */
Shape.prototype.repaint = function () {
    this.html = this.createHTML(true);
    return this.paint();
};

//not sure about this
Shape.prototype.onOtherFigureMoved = function () {

};
/**
 * Handler for the onDragStart event
 * @returns {Boolean}
 */
Shape.prototype.onDragStart = function () {
    return true;
};
/**
 * Handler for the onDrag event
 */
Shape.prototype.onDrag = function () {

};
/**
 * Handler for the onDragEnd event
 */
Shape.prototype.onDragEnd = function () {

};
/**
 * Set the dimension of the object
 * @param {Number} newWidth
 * @param {Number} newHeight
 * @returns {Shape}
 */
Shape.prototype.setDimension = function (newWidth, newHeight, triggerChange) {
    var fields = [],
        oldWidth = this.width,
        oldHeight = this.height,
        validWidth = this.setWidth(newWidth),
        validHeight = this.setHeight(newHeight);

    if (!this.resizing && this.canvas && fields.length > 0 && triggerChange &&
            (validWidth || validHeight)) {
        this.changeSize(oldWidth, oldHeight);
    }
    return this;
};
/**
 *  Deletes the shape
 *  @returns {Boolean}
 */
Shape.prototype.dispose = function () {
    return true;
};

/**
 * Set the position of the element in the canvas
 * @param {Number} xpos
 * @param {Number} ypos
 * @returns {Shape}
 */
Shape.prototype.setPosition = function (xpos, ypos, triggerChange) {

    var fields = [],
        oldX = this.x,
        oldY = this.y,
        oldAbsoluteX = this.absoluteX,
        oldAbsoluteY = this.absoluteY,
        validX = this.setX(xpos),
        validY = this.setY(ypos);

    if (!this.dragging && this.canvas && fields.length > 0 && triggerChange &&
            (validX || validY)) {
        this.changePosition(oldX, oldY, oldAbsoluteX, oldAbsoluteY);
    }

    return this;
};
/**
 * Shows the resize point on the corners of the shape
 */
Shape.prototype.showResizePoints = function () {

};
/**
 * Hides the resize points on the corners of the shape
 */
Shape.prototype.hideResizePoints = function () {

};
/**
 * Moves the resize points of the corners of the shape,
 * (generally when dragging had occurred)
 */
Shape.prototype.moveResizePoints = function () {

};

Shape.prototype.changeParent = function (oldX, oldY,
                                         oldAbsoluteX, oldAbsoluteY,
                                         oldParent, canvas) {
    var fields = [
        {
            "field" : "x",
            "oldVal" : oldX,
            "newVal" : this.x
        },
        {
            "field" : "y",
            "oldVal" : oldY,
            "newVal" : this.y
        },
        {
            "field" : "absoluteX",
            "oldVal" : oldAbsoluteX,
            "newVal" : this.absoluteX
        },
        {
            "field" : "absoluteY",
            "oldVal" : oldAbsoluteY,
            "newVal" : this.absoluteY
        },
        {
            "field" : "parent",
            "oldVal" : oldParent,
            "newVal" : this.parent
        }
    ];
    canvas.updatedElement = {
        "id" : this.id,
        "type" : this.type,
        "fields" : fields,
        "relatedObject" : this
    };
    $(canvas.html).trigger("changeelement");
};

Shape.prototype.changeSize = function (oldWidth, oldHeight) {
    var canvas = this.canvas,
        fields = [
            {
                "field" : "width",
                "oldVal" : oldWidth,
                "newVal" : this.width
            },
            {
                "field" : "height",
                "oldVal" : oldHeight,
                "newVal" : this.height
            }
        ];
    canvas.updatedElement = {
        "id" : this.id,
        "type" : this.type,
        "fields" : fields,
        "relatedObject" : this
    };
    $(canvas.html).trigger("changeelement");
};

Shape.prototype.changePosition = function (oldX, oldY, oldAbsoluteX,
                                           oldAbsoluteY) {
    var canvas = this.canvas,
        fields = [
            {
                "field" : "x",
                "oldVal" : oldX,
                "newVal" : this.x
            },
            {
                "field" : "y",
                "oldVal" : oldY,
                "newVal" : this.y
            },
            {
                "field" : "absoluteX",
                "oldVal" : oldAbsoluteX,
                "newVal" : this.absoluteX
            },
            {
                "field" : "absoluteY",
                "oldVal" : oldAbsoluteY,
                "newVal" : this.absoluteY
            }

        ];
    canvas.updatedElement = {
        "id" : this.id,
        "type" : this.type,
        "fields" : fields,
        "relatedObject" : this
    };
    $(canvas.html).trigger("changeelement");
};

/**
 * Change the position of the shape and moves it there
 * @param {Number} x
 * @param {Number} y
 * @returns {Shape}
 */
Shape.prototype.moveShape = function (x, y) {
    this.setPosition(x, y);
    if (this.html) {
        this.html.style.left = this.x + "px";
        this.html.style.top = this.x + "px";
    }
    return this;

};
//getters
/**
 * Returns the ID
 * @returns {String}
 */
Shape.prototype.getID = function () {
    return this.id;
};
/**
 * Returns the HTML Representation
 * @returns {Object}
 */
Shape.prototype.getHTML = function () {
    if (this.html === null) {
        return this.createHTML(false);
    }
    return this.html;
};
/**
 * Returns the zOrder
 * @returns {Number}
 */
Shape.prototype.getZOrder = function () {
    return this.zOrder;
};
/**
 * Returns the canvas
 * @returns {Canvas}
 */
Shape.prototype.getCanvas = function () {
    return this.canvas;
};
/**
 * Returns the Parent of the shape
 * @returns {Shape}
 */
Shape.prototype.getParent = function () {
    return this.parent;
};
/**
 * Returns the width of the shape
 * @returns {Number}
 */
Shape.prototype.getWidth = function () {
    return this.width;
};

/**
 * Returns whether the dimensions of the shape are fixed or not
 * @returns {Boolean}
 */
Shape.prototype.isFixed = function () {
    return this.fixed;
};

/**
 * Returns the height of the shape
 * @returns {Number}
 */
Shape.prototype.getHeight = function () {
    return this.height;
};
/**
 * Returns the x coordinate of the shape
 * @returns {Number}
 */
Shape.prototype.getX = function () {
    return this.x;
};
/**
 * Returns the y coordinate of the shape
 * @returns {Number}
 */
Shape.prototype.getY = function () {
    return this.y;
};

Shape.prototype.getAbsoluteX = function () {
    return this.absoluteX;
};

Shape.prototype.getAbsoluteY = function () {
    return this.absoluteY;
};

/**
 * Returns the whether the shape is resizable or not
 * @returns {Boolean}
 */
Shape.prototype.isResizable = function () {
    return this.resizable;
};
/**
 * Returns the list of the shape children
 * @returns {ArrayList}
 */
Shape.prototype.getChildren = function () {
    return this.children;
};
/**
 * Returns the object where the shape is contained
 * @returns {object}
 */
Shape.prototype.getParentContainer = function () {
    return this.parentContainer;
};
/**
 * Returns the type of shape
 * @returns {object}
 */
Shape.prototype.getType = function () {
    return this.type;
};
/**
 * Returns whether the shape is container itself or not
 * @returns {Boolean}
 */
Shape.prototype.isContainer = function () {
    return this.container;
};
//setters
/**
 * Sets the ID
 * @returns {Shape}
 * @param {String} newID
 */
Shape.prototype.setID = function (newID) {
    if (typeof newID === "string" && newID !== "") {
        this.id = newID;
    } else if (this.id === "") {
        //this.id = this.createID("Shape");
        this.id = "noid";
    }
    return this;
};
/**
 * Sets the zOrder
 * @returns {Shape}
 * @param {Number} newZOrder
 */
Shape.prototype.setZOrder = function (newZOrder) {
    if (typeof newZOrder === "number" && newZOrder > 0) {
        this.zOrder = newZOrder;
        if (this.html) {
            this.html.style.zIndex = this.zOrder;
        }
    }
    return this;
};
/**
 * Sets the canvas
 * @returns {Shape}
 * @param {Canvas} newCanvas
 */
Shape.prototype.setCanvas = function (newCanvas) {
    if (newCanvas.type === "Canvas") {
        this.canvas = newCanvas;
    }
    return this;
};
/**
 * Sets the Parent of the shape
 * @returns {Shape}
 * @param {Shape} newParent
 */
Shape.prototype.setParent = function (newParent, triggerChange) {
    //if(newParent.type === "Shape" || newParent.type === "StartEvent" ||
    //newParent.type === "EndEvent")
    if (this.canvas && triggerChange) {
        this.canvas.updatedElement = {
            "id" : this.id,
            "type" : this.type,
            "fields" : [{
                "field" : "parent",
                "oldVal" : this.parent,
                "newVal" : newParent
            }]
        };
        $(this.canvas.html).trigger("changeelement");
    }
    this.parent = newParent;
    return this;
};
/**
 * Sets the width of the shape, returns true if successful
 * @returns {Shape}
 * @param {Number} newWidth
 */
Shape.prototype.setWidth = function (newWidth) {
    if (typeof newWidth === "number" && newWidth >= 0) {
        this.width = newWidth;
        this.realWidth = this.width;
        if (this.html) {
            this.html.style.width = this.width + "px";
        }
    } else {
        return false;
    }
    return true;
};

/**
 * Sets the height of the shape, returns true if successful
 * @returns {Boolean}
 * @param {Number} newHeight
 */
Shape.prototype.setHeight = function (newHeight) {
    if (typeof newHeight === "number" && newHeight >= 0) {
        this.height = newHeight;
        this.realHeight = this.height;
        if (this.html) {
            this.html.style.height = this.height + "px";
        }
    } else {
        return false;
    }
    return true;
};
/**
 * Sets whether the dimensions are fixed or not
 * @param {Boolean} fixed
 * @returns {Shape}
 */
Shape.prototype.setFixed = function (fixed) {
    if (typeof fixed === "boolean") {
        this.fixed = fixed;
    }
    return this;
};

/**
 * Sets the x coordinate of the shape, returns true if successful
 * @returns {Boolean}
 * @param {Number} newX
 */
Shape.prototype.setX = function (newX) {
    if (typeof newX === "number") {
        if (this.x !== this.realX) {
            this.realX = newX + 2;
            this.x = newX;
        } else {
            this.x = this.realX = newX;
        }
        this.setAbsoluteX();
        if (this.html) {
            this.html.style.left = this.x + "px";
        }
    } else {
        return false;
    }
    return true;
};
/**
 * Sets the y coordinate of the shape, returns true if successful
 * @returns {Shape}
 * @param {Number} newY
 */
Shape.prototype.setY = function (newY) {
    if (typeof newY === "number") {
        if (this.y !== this.realY) {
            this.realY = newY + 2;
            this.y = newY;
        } else {
            this.y = this.realY = newY;
        }

        this.setAbsoluteY();
        if (this.html) {
            this.html.style.top = this.y + "px";
        }
    } else {
        return false;
    }
    return true;
};


/**
 * Sets the x coordinate of the shape relative to the canvas
 * @return {*}
 */
Shape.prototype.setAbsoluteX = function () {
    if (!this.parent) {
        this.absoluteX = this.realX;
    } else {
        this.absoluteX = this.realX + this.parent.absoluteX;
    }
    return this;
};


/**
 * Sets the y coordinate of the shape relative to the canvas
 * @return {*}
 */
Shape.prototype.setAbsoluteY = function () {
    if (!this.parent) {
        this.absoluteY = this.realY;
    } else {
        this.absoluteY = this.realY + this.parent.absoluteY;
    }
    return this;
};

Shape.prototype.fixZIndex = function (shape, value) {
    // fix this shape zIndex
    var i,
        anotherShape,
        port,
        srcShape,
        destShape,
        srcShapeZIndex,
        destShapeZIndex,
        parentZIndex;

    if (shape.parent) {
        parentZIndex = shape.parent.html.style.zIndex;
    } else {
        parentZIndex = shape.canvas.zOrder;
    }
    //console.log("pi :" + parentZIndex);
    shape.setZOrder(parseInt(parentZIndex, 10) + value +
        parseInt(shape.defaultZOrder, 10));

    // fix children zIndex
    for (i = 0; i < shape.children.getSize(); i += 1) {
        anotherShape = shape.children.get(i);
        anotherShape.fixZIndex(anotherShape, 0);
    }

    // fix connection zIndex
    // only if it has ports
    if (shape.ports) {
        for (i = 0; i < shape.ports.getSize(); i += 1) {
            port = shape.ports.get(i);
            srcShape = port.connection.sourcePort.parent;
            destShape = port.connection.endPort.parent;
            srcShapeZIndex = parseInt(srcShape.html.style.zIndex, 10);
            destShapeZIndex = parseInt(destShape.html.style.zIndex, 10);
            port.connection.html.style.zIndex =
                Math.max(srcShapeZIndex + 1,
                    destShapeZIndex + 1);
        }
    }
};

Shape.prototype.increaseZIndex = function (shape) {
    this.fixZIndex(shape, shape.MAX_ZINDEX);
};

Shape.prototype.decreaseZIndex = function (shape) {
    this.fixZIndex(shape, 0);
};

Shape.prototype.increaseParentZIndex = function (shape) {
    if (shape) {
        shape.html.style.zIndex =
            parseInt(shape.html.style.zIndex, 10) + 1;
        // console.log(this.html.style.zIndex);
        shape.increaseParentZIndex(shape.parent);
    }
};

Shape.prototype.decreaseParentZIndex = function (shape) {
    if (shape) {
        shape.html.style.zIndex =
            parseInt(shape.html.style.zIndex, 10) - 1;
        shape.decreaseParentZIndex(shape.parent);
    }
};
