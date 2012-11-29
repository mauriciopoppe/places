
var BPMNBoundaryEvent = function (handlers) {
    BPMNEvent.call(this, handlers, 'BoundaryEvent');

    this.markers = [
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
    ];

    this.layers.insert(new Layer(this, 'img_100_intermediate_messagecatch',
        'img_100_intermediate_messagecatch', 0, "bpmn_zoom", true));
    this.numberRelativeToActivity = null;
};
BPMNBoundaryEvent.prototype = new BPMNEvent();
BPMNBoundaryEvent.prototype.type = "BPMNBoundaryEvent";

BPMNBoundaryEvent.prototype.createHTML = function () {
    BPMNShape.prototype.createHTML.call(this);
    //this.html.className = '';
    //this.html.className = 'boundary-event';
    return this.html;
};

BPMNBoundaryEvent.prototype.attachListeners = function (event) {
    BPMNShape.prototype.attachListeners.call(this, event);
    var shapeDragOptions = {
        //containment:'parent',
        revert : true,
        //helper: bpmnShape.createDragHelper,
        start : event.onDragStart(event),
        drag : event.onDrag(event), //, bpmnShape.canvas, new Point(0, 0)),
        stop : event.onDragEnd(event)
    };
    $(event.html).draggable(shapeDragOptions);

};
BPMNBoundaryEvent.prototype.onDragStart = function (event) {
    return function (e, ui) {
        event.initX = event.getX();
        event.initY = event.getY();
        event.initParent = event.parent;

        BPMNShape.prototype.onDragStart.call(this, event)(e, ui);

        event.paint();

    };
};

BPMNBoundaryEvent.prototype.onDrag = function (event) {
    return function (e, ui) {
        //console.log((ui.position.top + Math.round(event.height / 2)) + ', ' +
        // (ui.position.left + Math.round(event.width /2)));
        BPMNShape.prototype.onDrag.call(this, event, event.canvas,
            new Point(0, 0))(e, ui);
    };
};
BPMNBoundaryEvent.prototype.onDragEnd = function (event) {
    return function (e, ui) {
        BPMNShape.prototype.onDragEnd.call(this, event)(e, ui);
        removeFromContainer(event);
        addToContainer(event.initParent, event, e);

        event.setPosition(event.initX, event.initY);
        event.paint();

    };
};
BPMNBoundaryEvent.prototype.attachToActivity = function () {
    var numBou = this.parent.getAvailableBoundaryPlace();
    if (numBou !== false) {
        this.parent.setBoundary(this, numBou);
        //alert(this.parent.getAvailableBoundaryPlace());
        this.setNumber(numBou);
    } else {
        alert('there is not enough space');
        this.destroy();
    }
    return this;
};
BPMNBoundaryEvent.prototype.setNumber = function (num) {
    this.numberRelativeToActivity = num;
    return this;
};
BPMNBoundaryEvent.prototype.getNumber = function (num) {
    return this.numberRelativeToActivity;
};
BPMNBoundaryEvent.prototype.destroy = function () {
    if (this.numberRelativeToActivity !==  null) {
        this.parent.boundaryPlaces.get(this.numberRelativeToActivity).available = true;
    }
    BPMNShape.prototype.destroy.call(this);
    return this;
};