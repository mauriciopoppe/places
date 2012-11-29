/**
 * Initializes and BPMN Annotation
 * Holds the behavior of an annotation that can be attached to a BPMN element.
 * @extends BPMNShape
 * @constructor
 * @param {Number} handlers
 * @param {Label} label
 */

var BPMNAnnotation = function (handlers, label) {
    var xDimension,
        yDimension,
        elementClass,
        i,
        lay;

    BPMNShape.call(this, handlers);


    /**
     * Background color for the annotation
     * @type String
     */
    this.backgroundColor = null;
    /**
     * Font size for the annotation
     * @type Integer
     */
    this.fontSize = 12;
    /**
     * Font style for the annotation
     * @type String
     */
    this.fontStyle = "arial";
    /**
     * Font color for the annotation
     * @type Color
     */
    this.color = new Color(0, 0, 0);

//    this.html = null;

//    this.height = 51;
//
//    this.width = 101;

    this.graphics = null;

//    this.label = new Label(this);

    /**
     * Limits for the inner figure, for drag & drop behavior
     * @type array
     * @TODO Determine true limits
     */
    this.limits = [5, 5, 5, 5, 5];

    //dimensions according to the zoom scale
    xDimension = [14, 20, 101, 32, 37];
    yDimension = [15, 24, 41, 40, 47];


    //this variable holds the class that will be applied to the element
    elementClass = "Annotation";

    for (i = 0; i < this.zoomScales; i += 1) {
        //construct the element properties that are used according to the zoom scale
        this.elementProperties.push(new ShapeZoomProperty(xDimension[i], yDimension[i]));
    }
    //insert the corresponding layer to the element
    this.layers.insert(new Layer(this, "main annotation layer", elementClass, 0, "", true));

    //insert the corresponding layer to label element
    lay = new Layer(this, "Label", 'label_empty', 5, "", true);

    this.layers.insert(lay);

    this.label.setParent(lay);

};

BPMNAnnotation.prototype = new BPMNShape();
BPMNAnnotation.prototype.type = "Annotation";

/**
 * This method will determine the drag behavior that will be used according to where the user clicked
 * @param {Point} clickedPoint
 * @returns Number
 */
BPMNAnnotation.prototype.determineDragBehavior = function (clickedPoint) {

    //the limit applied according to the zoom scale
    var limit = this.limits[2];
    //if the point is in the inner rectangle then we just drag
    if (Geometry.pointInRectangle(clickedPoint, new Point(0 + limit, 0 + limit),
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

BPMNAnnotation.prototype.updateResizeListener  = function (annotation) {
    BPMNActivity.prototype.updateResizeListener.call(this, annotation);
};

/**
 * In charge of the painting / positioning of the figure on the DOM and setting the styles
 * @returns {Annotation}
 */
BPMNAnnotation.prototype.paint = function () {

    if (!this.html) {
        this.html = this.createHTML();
    }
    if (this.graphics === null) {
        this.graphics = new jsGraphics(this.id);
    } else {
        this.graphics.clear();
    }

    this.graphics.drawLine(0, 0, 0, this.height);
    this.graphics.drawLine(0, 0, Math.round(this.width * 0.25), 0);
    this.graphics.drawLine(0, this.height, Math.round(this.width * 0.25), this.height);
    this.graphics.paint();

    if (this.label.getMessage() !== '') {
        this.label.paint(this);
    }
    //Used the code above to test lines
};

BPMNAnnotation.prototype.repaint = function () {
    this.paint();
};
//getters

/**
 * Returns the  label
 * @returns {String}
 */
BPMNAnnotation.prototype.getLabel = function () {
    return this.label;
};
/**
 * Returns the Annotation font size
 * @returns {Integer}
 */
BPMNAnnotation.prototype.getFontSize = function () {
    return this.fontSize;
};
/**
 * Returns the Annotation font style
 * @returns {String}
 */
BPMNAnnotation.prototype.getFontStyle = function () {
    return this.fontStyle;
};
/**
 * Returns the Annotation Color
 * @returns {Color}
 */
BPMNAnnotation.prototype.getColor = function () {
    return this.color;
};
/**
 * Returns the Annotation background color
 * @returns {Color}
 */
BPMNAnnotation.prototype.getBackgroundColor = function () {
    return this.backgroundColor;
};
//Setters
/**
 * Sets the Annotation label
 * @returns {Annotation}
 * @param {String} newLabel
 */
BPMNAnnotation.prototype.setLabel = function (newLabel) {
    return this;
};
/**
 * Sets the Annotation font size
 * @returns {Annotation}
 * @param {Integer} newFontSize
 */
BPMNAnnotation.prototype.setFontSize = function (newFontSize) {
    return this;
};
/**
 * Sets the Annotation font style
 * @returns {Annotation}
 * @param {String} newFontStyle
 */
BPMNAnnotation.prototype.setFontStyle = function (newFontStyle) {
    return this;
};
/**
 * Sets the Annotation Color
 * @returns {Annotation}
 * @param {Color} newColor
 */
BPMNAnnotation.prototype.setColor = function (newColor) {
    return this;
};
/**
 * Sets the Annotation background color
 * @returns {Annotation}
 * @param {String} newBackgroundColor
 */
BPMNAnnotation.prototype.getBackgroundColor = function (newBackgroundColor) {
    return this;
};
