/**
 * @brief This class represents a BPMN Event
 * @description This class constructs a BPMNEvent given its type, if you are
 * looking for building an intermediate event pass the string
 * 'IntermediateEvent' to the constructor, if you are looking for building an
 * end event pass the string EndEvent to the constructor, otherwise,
 * it will build a start event
 * @class Defines a BPMN Event
 * @constructor
 * @param {Number} handlers number of resize handlers associated to this shape
 * @param {string} type
 */
var BPMNEvent = function (handlers, type) {
    //this variable will hold the css class applied to this object
    var elementClass,
        dimensions,
        i,
        lay;
    BPMNShape.call(this, handlers);
    /**
     * The event type
     * @type string
     */
    this.eventType = (type) ? type : "StartEvent";


    //dimensions applied according to the zoom factor
    dimensions = [15, 22, 29, 35, 43];
    /**
     * Limits for the inner figure, for drag & drop behavior
     * @type array
     */
    this.limits = [2, 3, 5, 6, 7];

    this.resizable = false;

    switch (this.eventType) {
        case "IntermediateEvent":
            this.eventType = "IntermediateEvent";
            elementClass = "img_100_intermediate_event";
            this.label.setMessage('Intermediate # 1');
            break;
        case "BoundaryEvent":
            this.eventType = "BoundaryEvent";
            elementClass = "img_100_intermediate_event";
            break;
        case "EndEvent":
            this.eventType = "EndEvent";
            elementClass = "img_100_end_event";
            this.label.setMessage('End # 1');
            break;
        default:
            elementClass = "img_100_start_event";
            this.label.setMessage('Start # 1');
    }
    for (i = 0; i < this.zoomScales; i += 1) {
        //constructing the array of element properties for all zoom scales
        this.elementProperties.push(new ShapeZoomProperty(dimensions[i],
            dimensions[i]));
    }
    //insert the corresponding layer to the element
    this.layers.insert(new Layer(this, "main event layer", elementClass, 0,
        "bpmn_zoom", true));

    //insert the corresponding layer to label element
    lay = new Layer(this, "Label", 'label_empty', 5, "", true);

    this.layers.insert(lay);

    this.label.setCanvas(lay);

    this.label.setPos(16);
//
//    this.label.setWidth(100);

    this.markers = [[
        'img_100_start_timer',
        'img_100_start_signalcatch',
        'img_100_start_conditional',
        'img_100_start_multiplecatch',
        'img_100_start_parallel',
        'img_100_start_compensationcatch',
        'img_100_start_escalationcatch',
        'img_100_start_errorcatch',
        'img_100_start_messagecatch'
    ], [
        'img_100_intermediate_messagecatch',
        'img_100_intermediate_messagethrow',
        'img_100_intermediate_timer',
        'img_100_intermediate_signalcatch',
        'img_100_intermediate_signalthrow',
        'img_100_intermediate_conditional',
        'img_100_intermediate_linkcatch',
        'img_100_intermediate_multiplecatch',
        'img_100_intermediate_multiplethrow',
        'img_100_intermediate_parallel',
        'img_100_intermediate_linkthrow',
        'img_100_intermediate_compensationcatch',
        'img_100_intermediate_compensationthrow',
        'img_100_intermediate_escalationcatch',
        'img_100_intermediate_cancelcatch',
        'img_100_intermediate_errorcatch',
        'img_100_intermediate_errorthrow',
        'img_100_intermediate_escalationthrow',
        'img_100_intermediate_cancelthrow'
    ], [
        'img_100_end_messagethrow',
        'img_100_end_terminate',
        'img_100_end_signalthrow',
        'img_100_end_multiplethrow',
        'img_100_end_compensationthrow',
        'img_100_end_errorthrow',
        'img_100_end_escalationthrow',
        'img_100_end_cancelthrow'
    ]];

};

BPMNEvent.prototype = new BPMNShape();
BPMNEvent.prototype.type = "BPMNEvent";

/**
 * This method will determine the drag behavior that will be used according to
 * where the user clicked
 * @param {Point} clickedPoint
 * @returns {Number}
 */
BPMNEvent.prototype.determineDragBehavior = function (clickedPoint) {
    var limit,
        center;
    limit = this.limits[2]; //defining the limits, where we need to draw an
    // inner figure to determine the behavior
    //the center of the circle
    center = new Point(this.width / 2, this.height / 2);

    //if the point is in the inner circle then we drag
    if (Geometry.pointInCircle(clickedPoint, center, this.width / 2 - limit)) {
        return this.DRAG;
    }
    //if the point is in the outer circle then we try to make a connection
    if (Geometry.pointInCircle(clickedPoint, center, this.width / 2)) {
        return this.CONNECT;
    }
    //otherwise the user clicked outside the shape so we don't do anything
    return this.CANCEL;
};

BPMNEvent.prototype.attachListeners = function (event) {
    BPMNShape.prototype.attachListeners.call(this, event);
    $(event.html).bind('contextmenu', function (e) {e.preventDefault(); });
    $(event.html).mousedown(function (e) {
        var newL, j, layer, et = 0;
        e.preventDefault();
        switch (event.eventType) {
            case "IntermediateEvent":
            case "BoundaryEvent":
                et = 1;
                break;
            case "EndEvent":
                et = 2;
                break;
            default:
                et = 0;
        }
        if (e.which ===  3) {
            j = Math.floor(Math.random() * 0.9999999999999999 *
                (event.markers[et].length - 1 + 0) + 1);

            layer = event.layers.find('id', event.id + 'Layer-Markers');
            if (typeof layer === 'undefined') {
                newL = new Layer(event, "Markers", event.markers[et][j], 0,
                    'bpmn_zoom', true);
                event.addLayer(newL);
            } else {
                layer.setElementClass(event.markers[et][j]);
            }
//            console.log(newL.html);
        }
    });
};
