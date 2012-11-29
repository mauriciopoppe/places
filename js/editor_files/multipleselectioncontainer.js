/**
 * Created with JetBrains WebStorm.
 * User: mauricio
 * Date: 9/17/12
 * Time: 10:39 AM
 * To change this template use File | Settings | File Templates.
 */

//***************************************************************************
//***************Start of MultipleSelectionContainer Class*******************
//***************************************************************************

/**
 * Represents the rectangle created to do multiple selection
 * @param canvas
 * @constructor
 */
var MultipleSelectionContainer = function (canvas) {
    RegularShape.call(this);
    /**
     * Element properties of this element to handle the width and height
     * according to the desired zoom
     * @type {Array}
     */
    this.elementProperties = [{}, {}, {width: 0, height: 0}];
    /**
     * X coordinate of the element regarding the canvas
     * @type {Number}
     */
    this.x = 0;
    /**
     * Y corrdinate of the element regarding to the canvas
     * @type {Number}
     */
    this.y = 0;

    /**
     * Helper to store the x coordinate while resizing this element
     * @type {Number}
     */
    this.oldX = 0;

    /**
     * Helper to store the y coordinate while resizing this element
     * @type {Number}
     */
    this.oldY = 0;

    /**
     * The background color of this element
     * @type {Color}
     */
    this.backgroundColor = new Color(0, 128, 255, 0.1);

    /**
     * Reference to the canvas
     * @type {*}
     */
    this.canvas = canvas;
    /**
     * BPMNShape parent previous selection
     * @type {*}
     */
    this.oldParent = null;

    this.handle = null;

    // add this element to the canvas
    addToContainer(this.canvas, this, {}, 0, 0);
};

MultipleSelectionContainer.prototype = new Rectangle();
MultipleSelectionContainer.prototype.type = "MultipleSelectionContainer";


/**
 * Applies the styling to the activity
 * @return {*}
 */
MultipleSelectionContainer.prototype.paint = function () {
    this.html.style.backgroundColor = this.backgroundColor.getCSS();
    return this;
};

/**
 * Changes the opacity value
 * @param {Number} value
 * @return {*}
 */
MultipleSelectionContainer.prototype.changeOpacity = function (value) {
    this.backgroundColor.setOpacity(value);
    this.paint();
    return this;
};


/**
 * Wraps the selected elements retrieved through this.intersectElements
 * and sets some styling to the container
 */
MultipleSelectionContainer.prototype.wrapElements = function () {
    var i,
        shape,
        x,
        y,
        xDiff = this.canvas.getLeft() - this.canvas.getLeftScroll(),
        yDiff = this.canvas.getTop() - this.canvas.getTopScroll(),
        currentSelection = this.canvas.currentSelection,
        limits,
        upperLeftMargin = 10,
        bottomRightMargin = 30,
        $shape,
        selection = [];
    this.intersectElements();
    if (!currentSelection.isEmpty()) {
        selection = currentSelection.asArray();
        this.canvas.updatedElement = {
            "selectedElements" : selection
        };
        $(this.canvas.html).trigger("multipleelementsselection");
    }
/*
    currentSelection = this.canvas.getCurrentSelection();

    if (!currentSelection.isEmpty()) {
        this.oldParent = currentSelection.get(0).parent;
        limits = currentSelection.getDimensionLimit();
        this.setPosition(limits[this.LEFT] - upperLeftMargin, limits[this.TOP]
            - upperLeftMargin);
        this.setDimension(limits[this.RIGHT] - limits[this.LEFT]
            + bottomRightMargin,
            limits[this.BOTTOM] - limits[this.TOP] + bottomRightMargin);

        // TODO: Styling after wrapping
        this.changeOpacity(0.1);
        this.html.style.border = "1px solid " +
            (new Color(0, 128, 255, 0.5)).getCSS();
        this.showOrHideResizeHandlers(true);
//        this.setZOrder(2);

        for (i = 0; i < currentSelection.getSize(); i += 1) {
            shape = currentSelection.get(i);
            x = shape.x + xDiff;
            y = shape.y + yDiff;
            removeFromContainer(shape);
            addToContainer(this, shape, null, x, y);

        }
//        this.handle.setDimension(this.width, this.height);
        this.attachListeners(this);

    } else {
        this.reset();
        this.setVisible(false);
        this.showOrHideResizeHandlers(false);
    }
    */
    this.reset();
    this.setVisible(false);
};

/**
 * Checks intersection of this container and the elements in its parent,
 * also create a reference to the intersected elements in
 * the canvas.currentSelection ArrayList
 */
MultipleSelectionContainer.prototype.intersectElements = function () {
    var i,
        shape,
        children;

    //empty the current selection
    this.canvas.emptyCurrentSelection();

    // get all the BPMN shapes of this.parent
    children = !this.parent ? this.canvas.bpmnShapes : this.parent.children;
    console.log(children.getSize());
    for (i = 0; i < children.getSize(); i += 1) {
        shape = children.get(i);
        if (shape.parent === null && this.checkIntersection(shape)) {
            this.canvas.addToSelection(shape);
            shape.showOrHideResizeHandlers(true);
        }
    }
};

/**
 * Resets the position and width of this shape
 */
MultipleSelectionContainer.prototype.reset = function () {
    //this.retrieveElements();
    this.setPosition(0, 0);
//    this.handle.setDimension(0, 0);
    this.setDimension(0, 0);
    return this;
};


MultipleSelectionContainer.prototype.retrieveElements = function () {
    var previousContainer = !this.oldParent ?  this.canvas : this.oldParent,
        i,
        x,
        y,
        shape,
        $shape;
    while (!this.children.isEmpty()) {
        shape = this.children.popLast();
        x = shape.x + this.canvas.getLeft() - this.canvas.getLeftScroll() +
            this.getLeft() + Math.floor(shape.width / 2);
        y = shape.y + this.canvas.getTop() - this.canvas.getTopScroll() +
            this.getTop() + Math.floor(shape.height / 2);

        removeFromContainer(shape);
        addToContainer(previousContainer, shape, null, x, y);
    }
};

/**
 * Sets the visibility of this shape
 * @param visible
 */
MultipleSelectionContainer.prototype.setVisible = function (visible) {
    if (visible) {
        this.html.style.display = "inline";
    } else {
        this.html.style.display = "none";
    }
};

MultipleSelectionContainer.prototype.getLeft = Shape.prototype.getAbsoluteX;
MultipleSelectionContainer.prototype.getTop = Shape.prototype.getAbsoluteY;

/**
 * Checks the intersection of a given shape and this
 * @param shape
 * @return {Boolean}
 */
MultipleSelectionContainer.prototype.checkIntersection = function (shape) {
    var topLeft = new Point(this.x, this.y),
        bottomRight = new Point(this.x + this.width, this.y + this.height);
    return Geometry.pointInRectangle(new Point(shape.realX, shape.realY),
        topLeft, bottomRight) ||
        Geometry.pointInRectangle(new Point(shape.realX +
            shape.width, shape.realY), topLeft, bottomRight) ||
        Geometry.pointInRectangle(new Point(shape.realX, shape.realY +
            shape.height), topLeft, bottomRight) ||
        Geometry.pointInRectangle(new Point(shape.realX +
            shape.width, shape.realY + shape.height), topLeft, bottomRight);
};
