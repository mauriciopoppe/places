
/**
 * Represents a BPMN Data Object
 * @class Defines a BPMNDataObject
 * @constructor
 * @param {Number} handlers number of resize handlers associated to this shape
 */

var BPMNDataObject = function (handlers) {
    var xDimension,
        yDimension,
        elementClass,
        i,
        lay;

    BPMNShape.call(this, handlers);

    /**
     * Limits for the inner figure, for drag & drop behavior
     * @type array
     * @TODO Determine true limits
     */
    this.limits = [5, 5, 5, 5, 5];
    this.resizable = false;
    //dimensions according to the zoom scale
    xDimension = [14, 20, 23, 32, 37];
    yDimension = [15, 24, 31, 40, 47];


    //this variable holds the class that will be applied to the element
    elementClass = "img_150_data_dataobject";

    for (i = 0; i < this.zoomScales; i += 1) {
        //construct the element properties that are used according to the
        // zoom scale
        this.elementProperties.push(new ShapeZoomProperty(xDimension[i],
            yDimension[i]));
    }
    //insert the corresponding layer to the element
    this.layers.insert(new Layer(this, "main data object layer", elementClass,
        0, "bpmn_zoom", true));

    //insert the corresponding layer to label element
    lay = new Layer(this, "Label", 'label_empty', 5, "", true);

    this.layers.insert(lay);

    this.label.setParent(lay);

    this.label.setMessage('Data # 1');

    this.label.setPos(16);

};

BPMNDataObject.prototype = new BPMNShape();
BPMNDataObject.prototype.type = "BPMNDataObject";
/**
 * This method will determine the drag behavior that will be used according to
 * where the user clicked
 * @param {Point} clickedPoint
 * @returns Number
 */
BPMNDataObject.prototype.determineDragBehavior = function (clickedPoint) {

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
