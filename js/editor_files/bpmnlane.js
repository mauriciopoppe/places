/**
 * Represents a BPMN Lane Object
 * @class Defines a BPMNLane
 * @constructor
 * @param {Number} ResizeHandlerNumber of resize handlers associated to this
 * shape
 */

var BPMNLane = function (ResizeHandlerNumber) {
    var i,
        xDimension,
        yDimension,
        elementClass,
        lay;
    this.id = UniqueID();
    this.parentPool = null;
    this.innerPool = false;
    BPMNGroupElement.call(this, ResizeHandlerNumber);
    this.limits = [5, 5, 5, 5,  5];
    //dimensions according to the zoom scale
    xDimension = [14, 20, 300, 32, 37];
    yDimension = [15, 24, 100, 40, 47];


    //this variable holds the class that will be applied to the element
    elementClass = "lane";
    this.setID('lane-' + UniqueID.create());
    for (i = 0; i < this.zoomScales; i += 1) {
        //construct the element properties that are used according to the zoom
        // scale
        this.elementProperties.push(new ShapeZoomProperty(xDimension[i],
            yDimension[i]));
    }
    //insert the corresponding layer to the element
    this.layers.insert(new Layer(this, "main data object layer", elementClass,
        0, "", true));

    //insert the corresponding layer to label element
    lay = new Layer(this, "Label", 'label_empty', 5, "", true);
    this.layers.insert(lay);
    this.label.setCanvas(lay);
    this.resizable = false;
    this.label.setMessage('LANE # 1');
    this.label.setPos(7);
    this.label.setOrientation('vertical');
};
BPMNLane.prototype = new BPMNGroupElement();
BPMNLane.prototype.type = "BPMNLane";
/**
 * This method will paint the figure
 * @returns BPMNLane
 */
BPMNLane.prototype.paint = function () {

    if (this.graphic === null) {
        this.graphic = new jsGraphics(this.id);
    } else {
        this.graphic.clear();
    }
    this.html.style.backgroundColor = (new Color(255, 255, 255, 0.8)).getCSS();

    this.graphic.drawRect(0, 0, this.width, this.height);
    this.graphic.paint();
    if (this.label.getMessage() !== '') {
        this.label.paint(this);
    }

    return this;
};
/**
 * This method will Repaint the figure
 * @returns BPMNLane
 */
BPMNLane.prototype.repaint = function (newZoom) {
    this.setPosition(this.x, this.y);
    this.setDimension(this.width, this.height);
    //this.createHTML(true);
    this.paint();
};


/**
 * This method will set parent poll of the lane
 * @returns BPMNLane
 */
BPMNLane.prototype.setParentPool = function (pPool) {
    this.parentPool = pPool;
};

/**
 * Determines the shapes that are valid to drop inside a lane
 * @param {BPMNShape} bpmnShape
 * @return {Boolean}
 */
BPMNLane.prototype.validateShape = function (bpmnShape) {
    return bpmnShape.type !== "BPMNLane";
};

BPMNLane.prototype.attachListeners = function (lane) {
    var $bpmnLane;
    $bpmnLane = $(lane.html).click(lane.onClick(lane));
    $bpmnLane.bind('contextmenu', function (e) {e.preventDefault(); });
    //BPMNShape.prototype.attachListeners.call(this, lane);
    //$bpmnLane = $(lane.html);
    $bpmnLane.droppable({
        greedy: true,
        accept: "#event,#intermediateevent,#endevent,#activity," +
            "#gateway" +
            ",.valid-outside-shapes,.other-valid,.valid-drop-class",
        drop: lane.onDrop(lane),
        hoverClass: "focused"
        //over: lane.dragEnter(lane),
        //out : lane.dragLeave(lane),
    });

    $bpmnLane.mousedown(function (e) {
        var newL, j, layer, et =    0;
        e.preventDefault();

        if (e.which === 3) {
            lane.transformToPool();   //transform to pool method;

        }
    });

};


/**
 * Click handler for the lane object, simply hide the ports that have been
 * selected, and also the resize handlers
 * @param {BPMNLane} lane
 * @return {Function}
 */
BPMNLane.prototype.onClick = function (lane) {
    return function (e, ui) {
        BPMNShape.prototype.onClick.call(this, lane)(e, ui);
        e.stopPropagation();
    };
};

BPMNLane.prototype.updateChildrenPosition = function (diffX, diffY) {
    BPMNSubProcess.prototype.updateChildrenPosition.call(this, diffX, diffY);
};

BPMNLane.prototype.updateSize = function () {
    BPMNSubProcess.prototype.updateSize.call(this);
    this.repaint();
    //this.parent.repaint(100);
    this.parent.updateSize();

};

/**
 * Drop Hanlder for the lane object, so far it is very similar to the
 * subprocess drop handler
 * @param lane
 * @return {Function}
 */
BPMNLane.prototype.onDrop = function (lane) {
    return function (e, ui) {
        BPMNSubProcess.prototype.onDrop.call(this, lane)(e, ui);
        lane.setColor(poolColor);
    };
};



/**
 * dragEnter Handler for the pool object, so far its very similar to the
 * subprocess dragEnter handler
 * @param {BPMNLane} lane
 * @return {Function}
 */
BPMNLane.prototype.dragEnter = function (lane) {
    return function (e, ui) {
        console.log('over lane');
        //BPMNPool.prototype.dragEnter.call(this,lane)(e.ui);
        lane.getParent().setColor(poolColor);
        lane.setColor(overContainerColor);

    };
};
/**
 * dragLeave Handler for the pool object, so far its very similar to the
 * subprocess dragLeave handler
 * @param {BPMNLane} lane
 * @return {Function}
 */
BPMNLane.prototype.dragLeave = function (lane) {
    return function (e, ui) {
        //console.log('drag leave');
        //BPMNPool.prototype.dragLeave.call(this,lane)(e.ui);
        lane.setColor(poolColor);
        //lane.getParent().setColor(poolColor);
    };
};
/**
 * Deletes the Lame and its relations, returns true if successful
 * @returns {Boolean}
 */
BPMNLane.prototype.destroy = function () {
    BPMNShape.prototype.destroy.call(this);
    if (this.parentPool) {
        this.parentPool.removeLane(this);
    }
    return true;
};

/**
 * Function for adding a shape to the corresponding lane, uses the same method
 * that subprocess objects use
 * @param bpmnShape
 * @param x
 * @param y
 */
BPMNLane.prototype.addShape = function (bpmnShape, x, y) {
    BPMNSubProcess.prototype.addShape.call(this, bpmnShape, x, y);
};

BPMNLane.prototype.validateDimensions = function (shape, e) {
    BPMNPool.prototype.validateDimensions.call(this, shape, e);
    return this;
};


BPMNLane.prototype.transformToPool = function () {
    bpmnShape = new BPMNPool(8);
    bpmnShape.draggable = false;
    bpmnShape.resizable = false;
    //bpmnShape.innerPool = true;

    addToContainer(this, bpmnShape, '', 0, 0);

    BPMNPool.prototype.attachListeners.call(this, bpmnShape);
    bpmnShape.setDimension(this.getWidth(), this.getHeight());
    bpmnShape.repaint();

    return this;
};
