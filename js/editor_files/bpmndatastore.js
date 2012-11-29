/**
 * Created with JetBrains WebStorm.
 * User: devrodrigo
 * Date: 9/14/12
 * Time: 12:28 PM
 * To change this template use File | Settings | File Templates.
 */

/**
 * Represents a BPMN Data Store
 * @class Defines a BPMNDataStore
 * @constructor
 * @param {Number} handlers number of resize handlers associated to this shape
 */

var BPMNDataStore = function (handlers) {
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
    //dimensions applied according to the zoom factor
    xDimension = [20, 30, 40, 51, 60];
    yDimension = [22, 32, 43, 54, 65];
    //this variable will hold the class applied to the element
    elementClass = "img_150_data_datastore";

    for (i = 0; i < this.zoomScales; i += 1) {
        //construct the element properties according to the zoom scale
        this.elementProperties.push(new ShapeZoomProperty(xDimension[i],
            yDimension[i]));
    }
    //insert the corresponding layer to the element
    this.layers.insert(new Layer(this, "main data store layer", elementClass,
        0, "bpmn_zoom", true));

    //insert the corresponding layer to label element
    lay = new Layer(this, "Label", 'label_empty', 5, "", true);

    this.layers.insert(lay);

    this.label.setParent(lay);

    this.label.setMessage('Store # 1');

    this.label.setPos(16);

};

BPMNDataStore.prototype = new BPMNShape();
BPMNDataStore.prototype.type = "BPMNDataStore";
/**
 * This method will determine the drag behavior that will be used according to
 * where the user clicked
 * @param {Point} clickedPoint
 * @returns Number
 */
BPMNDataStore.prototype.determineDragBehavior = function (clickedPoint) {

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
