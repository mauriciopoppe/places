
/**
 * This class represents a BPMNGateway
 * @class Defines a BPMNGateway
 * @constructor
 * @param {Number} handlers number of resize handlers associated to this shape
 *
 */
var BPMNGateway = function (handlers) {
    var dimensions,
        elementClass,
        i,
        lay;
    BPMNShape.call(this, handlers);

    //dimensions according to the zoom scales
    dimensions = [20, 30, 41, 50, 60];
    /**
     * Limits for the inner figure, for drag & drop behavior
     * @type array
     * @TODO Determine true limits
     */
    this.limits = [8, 8, 8, 8, 8];
    this.resizable = false;
    //this class will hold the css class applied to the element
    elementClass = "img_150_gateway_exclusive";

    for (i = 0; i < this.zoomScales; i += 1) {
        //constructs the properties that will be applied to the element
        // according to the zoom scale
        this.elementProperties.push(new ShapeZoomProperty(dimensions[i],
            dimensions[i]));
    }
    //insert the corresponding layer to the element
    this.layers.insert(new Layer(this, "main gateway layer", elementClass, 0,
        "bpmn_zoom", true));

    this.label.setMessage('Gateway # 1');

    //insert the corresponding layer to label element
    lay = new Layer(this, "Label", 'label_empty', 5, "", true);

    this.layers.insert(lay);

    this.label.setParent(lay);

    this.label.setPos(16);

    this.markers = ['img_100_gateway_exclusive',
        'img_100_gateway_exclusive_marked',
        'img_100_gateway_parallel',
        'img_100_gateway_eventbased',
        'img_100_gateway_inclusive',
        'img_100_gateway_exclusiveeventbased',
        'img_100_gateway_paralleleventbased',
        'img_100_gateway_complex'];
};

BPMNGateway.prototype = new BPMNShape();
BPMNGateway.prototype.type = "BPMNGateway";
/**
 * This method will determine the drag behavior that will be used according to
 * where the user clicked
 * @param {Point} clickedPoint
 * @returns Number
 */
BPMNGateway.prototype.determineDragBehavior = function (clickedPoint) {
    var limit,
        halfHeight,
        halfWidth,
        center,
        rhombusPoints;

    //the limit according to the current zoom factor
    limit = this.limits[2];
    //half of the height of the figure useful for determining its center and
    // its points
    halfHeight = this.height / 2;
    //half of the width of the figure useful for determining its center and
    // its points
    halfWidth = this.width / 2;
    //creates a new point that will be the center
    center = new Point(halfWidth, halfHeight);
    //Determining rhombus points of the inner figure
    rhombusPoints = [new Point(limit, halfHeight),
                     new Point(halfWidth, limit),
                     new Point(this.width - limit, halfHeight),
                     new Point(halfWidth, this.height - limit)
                    ];
    //if the point is in the inner rhombus then we drag
    if (Geometry.pointInRhombus(clickedPoint, rhombusPoints, center)) {
        return this.DRAG;
    }
    //Set the rhombus points to the outer figure
    rhombusPoints[0].x -= limit;
    rhombusPoints[1].y -= limit;
    rhombusPoints[2].x += limit;
    rhombusPoints[3].y += limit;
    //if the clicked point is in the outer figure then we try to make a
    // connection
    if (Geometry.pointInRhombus(clickedPoint, rhombusPoints, center)) {
        return this.CONNECT;
    }
    //otherwise the user clicked outside the shape so we just cancel
    return this.CANCEL;

};

BPMNGateway.prototype.attachListeners = function (gateway) {
    BPMNShape.prototype.attachListeners.call(this, gateway);
    $(gateway.html).bind('contextmenu', function (e) {e.preventDefault(); });
    $(gateway.html).mousedown(function (e) {
        var newL, j, layer;
        e.preventDefault();
        if (e.which === 3) {
            j = Math.floor(Math.random() * 0.9999999999999999
                * (gateway.markers.length - 1) + 1);
            layer = gateway.layers.find('id', gateway.id + 'Layer-Markers');
            if (typeof layer === 'undefined') {
                newL = new Layer(gateway, "Markers", gateway.markers[j], 0,
                    'bpmn_zoom', true);
                gateway.addLayer(newL);
            } else {
                layer.setElementClass(gateway.markers[j]);
            }
//            console.log(newL.html);
        }
    });
};
