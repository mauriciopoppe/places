/**
 * Represents a BPMN Pool Object
 * @class Defines a BPMNPool
 * @constructor
 * @param {Number} ResizeHandlerNumber of resize handlers associated to this
 * shape
 */

var BPMNPool = function (ResizeHandlerNumber) {
    var xDimension,
        yDimension,
        elementClass,
        i,
        lay;

    BPMNGroupElement.call(this, ResizeHandlerNumber);
    this.limits = [9, 9, 9, 9, 9];
    //dimensions according to the zoom scale
    xDimension = [14, 20, 700, 32, 37];
    yDimension = [15, 24, 300, 40, 47];


    //this variable holds the class that will be applied to the element
    elementClass = "pool";

    for (i = 0; i < this.zoomScales; i += 1) {
        //construct the element properties that are used according to the
        // zoom scale
        this.elementProperties.push(new ShapeZoomProperty(xDimension[i],
            yDimension[i]));
    }
    //insert the corresponding layer to the element
    this.layers.insert(new Layer(this, "main data object layer", elementClass,
        0, "", true));

    this.orientation = 'horizontal'; //horizontal/vertical
    //
    this.bpmnLanes = new ArrayList();

    this.children = new ArrayList();

    //insert the corresponding layer to label element
    lay = new Layer(this, "Label", 'label_empty', 5, "", true);

    this.layers.insert(lay);

    this.label.setCanvas(lay);

    this.label.setMessage('POOL # 1');

};

BPMNPool.prototype = new BPMNGroupElement();
BPMNPool.prototype.type = "BPMNPool";
/**
 * This method will paint the figure
 * @returns BPMNPool
 */
BPMNPool.prototype.paint = function () {

    this.html.style.backgroundColor = (new Color(255, 255, 255, 0.8)).getCSS();
    if (this.graphic === null) {
        this.graphic = new jsGraphics(this.id);
    } else {
        this.graphic.clear();
    }

    this.graphic.drawRect(0, 0, this.width, this.height);


    if (this.label.getMessage() !== '') {
        if (this.orientation === 'horizontal') {
            this.label.setPos(7);
            this.label.setOrientation('vertical');
            this.graphic.drawLine(this.applyZoom(poolHead), 0, this.applyZoom(poolHead),
                this.height);
        } else {
            this.label.setPos(1);
            this.label.setOrientation('horizontal');
            this.graphic.drawLine(0, this.applyZoom(poolHead), this.width,
                this.applyZoom(poolHead));
            this.label.setPosition(1);
        }
        this.label.paint(this);
    }
    this.graphic.paint();
    return this;
    //this.setID('pool-' + UniqueID.create());
};
/**
 * This method will repaint the figure
 * @returns BPMNPool
 */
BPMNPool.prototype.repaint = function (newZoom) {
    this.setPosition(this.x, this.y);
    this.setDimension(this.width, this.height);
    //this.createHTML(true);
    this.paint();
};
BPMNPool.prototype.validateDimensions = function (shape, e) {
    //var factor = 10*this.zoomFactor;
    var factor,
        newWidth,
        newHeight;
    if (shape.getType() === 'BPMNLane') {
        return;
    }
    factor = 10;//10*1;
    //console.log(shape.getX()+','+shape.getY());

    newWidth =  shape.getX() + shape.getWidth() + factor;
    newHeight = shape.getY() + shape.getHeight() + factor;
    if (shape.getX() < 0) {
        this.setPosition(this.getLeft() + shape.getX(), this.getTop());
        shape.setPosition(shape.x - shape.getX(), shape.y);
    }
    if (shape.getY() < 0) {
        this.setPosition(this.getLeft(), this.getTop() + shape.getY());
        shape.setPosition(shape.x, shape.y - shape.getY());
    }

    if (newWidth > this.getWidth()) {
        this.setDimension(newWidth, this.getHeight());
        if (this.getParent()) {
            this.getParent()
                .setDimension(newWidth + this.getParent().applyZoom(poolHead),
                    this.getParent().getHeight());
            this.getParent().repaint();
        }
    }
    if (newHeight > this.getHeight()) {
        this.setDimension(this.getWidth(), newHeight);
        if (this.getParent()) {
            //console.log(this.getHeight());
            this.getParent().setDimension(this.getParent().getWidth(),
                this.getHeight() * this.getParent().bpmnLanes.getSize());
            this.getParent().repaint();
        }

    }
    if (this.getParent()) {
        this.getParent().refactorLanePosition();
    }
    return this;
};
/**
 * Recalculates the locations a dimensions from all lanes that belong to the
 * corresponding pools
 * @return {*}
 */
BPMNPool.prototype.refactorLanePosition = function () {
    var numLanes,
        newx,
        newy,
        newWidth,
        newHeight,
        lane,
        i;

    numLanes = this.bpmnLanes.getSize();

    newx = (this.orientation === 'horizontal') ? this.applyZoom(poolHead) : 0;
    newy = (this.orientation === 'horizontal') ? 0 : this.applyZoom(poolHead);

    newWidth = (this.orientation === 'horizontal') ?
        this.getWidth() - this.applyZoom(poolHead) : this.getWidth() / numLanes;
    newHeight = (this.orientation === 'horizontal') ?
        this.getHeight() / numLanes : this.getHeight() - this.applyZoom(poolHead);
    //console.log(numLanes);
    for (i = 0; i < numLanes; i += 1) {
        lane = this.bpmnLanes.get(i);
        //console.log(lane);
        //console.log(newWidth+','+newHeight);
        lane.setPosition(newx, newy);
        lane.setDimension(newWidth, newHeight);

        lane.paint();
        newy = (this.orientation === 'horizontal') ? newy + newHeight : newy;
        newx = (this.orientation === 'horizontal') ? newx : newx + newWidth;
    }
    //newLane.setPosition(this.getX()+this.applyZoom(45),this.getY());
    //newLane.setDimension(this.getWidth()-this.applyZoom(45),this.getHeight());
    return this;
};
/**
 * This method will add lanes to pool
 * @returns BPMNPool
 */

BPMNPool.prototype.addLane = function (newLane) {

    if (newLane.type === 'BPMNLane') {
        newLane.setParentPool(this);
        this.bpmnLanes.insert(newLane);
        this.refactorLanePosition();
    }
    return this;
};
/**
 * This method will remove a lane from a pool
 * @returns BPMNPool
 */
BPMNPool.prototype.removeLane = function (lane) {
    this.bpmnLanes.remove(lane);
    this.refactorLanePosition();
    return this;
};
/**
 * Function for attaching the corresponding pool listeners to this pool
 * @param pool
 * @return {*}
 */
BPMNPool.prototype.attachListeners = function (pool) {
    var $pool;
    //if(!pool.innerPool){
        BPMNShape.prototype.attachListeners.call(this, pool);
    //}
    $pool = $(pool.html).droppable({
        //accept: "#pm_project_toolbar ul > li,.valid-outside-shapes" +
        //",.valid-outside-shapes-group,.other-valid,.valid-drop-class,.helper",
        accept: "#pool,#event,#intermediateevent,#endevent,#activity" +
            ",#gateway,#lane,#dataobject,#datastore,#annotation" +
            ",#subprocess ,.valid-outside-shapes," +
            ".valid-outside-shapes-group,.other-valid," +
            ".valid-drop-class",
        drop: pool.onDrop(pool),
//        over: pool.dragEnter(pool),
//        out : pool.dragLeave(pool)
        //activeClass: "ui-state-hover",
        hoverClass: "focused"
        //greedy: true
    });

    return this;

};

BPMNPool.prototype.resizeBehavior = function (pool, e, ui) {
    BPMNSubProcess.prototype.resizeBehavior.call(this, pool, e, ui);
    pool.refactorLanePosition();
};


BPMNPool.prototype.onResize = function (pool) {
    return function (e, ui) {
        pool.resizeBehavior(pool, e, ui);
    };
};

BPMNPool.prototype.onResizeEnd = function (pool) {
    return function (e, ui) {
        pool.resizeBehavior(pool, e, ui);
        pool.showOrHideResizeHandlers(true);
        if (pool.parent) {
            pool.parent.updateResizeListener(pool.parent);
        }
    };
};

BPMNPool.prototype.getLeft = Shape.prototype.getAbsoluteX;
BPMNPool.prototype.getTop = Shape.prototype.getAbsoluteY;


/**
 * Function for adding a shape to this pool, it also validates whether the
 * shape is a lane or not
 * @param {Shape} shape
 * @param {Number} x
 * @param {Number} y
 */
BPMNPool.prototype.addShape = function (shape, x, y) {
    BPMNSubProcess.prototype.addShape.call(this, shape, x, y);
    if (shape.type === "BPMNLane") {
        this.addLane(shape);
    }
};

/**
 * Determine the valid shapes that can be dropped inside a pool
 * @param {BPMNShape} bpmnShape
 * @return {Boolean}
 */
BPMNPool.prototype.validateShape = function (bpmnShape) {
    return true;
};

BPMNPool.prototype.updateChildrenPosition = function (diffX, diffY) {
    BPMNSubProcess.prototype.updateChildrenPosition.call(this, diffX, diffY);
};

BPMNPool.prototype.updateSize = function () {
    BPMNSubProcess.prototype.updateSize.call(this);
    this.repaint(100);
};

/**
 * Drop Handler for the pool object, so far its very similar to the subprocess
 * drop handler
 * @param {BPMNPool} pool
 * @return {Function}
 */
BPMNPool.prototype.onDrop = function (pool) {
    return function (e, ui) {
        BPMNSubProcess.prototype.onDrop.call(this, pool)(e, ui);
    };
};
/**
 * dragEnter Handler for the pool object, so far its very similar to the
 * subprocess dragEnter handler
 * @param {BPMNPool} pool
 * @return {Function}
 */
BPMNPool.prototype.dragEnter = function (pool) {
    return function (e, ui) {
        if (pool.getFocus()) {
            pool.setColor(overContainerColor);
        }
    };
};
/**
 * dragLeave Handler for the pool object, so far its very similar to the
 * subprocess dragLeave handler
 * @param {BPMNPool} pool
 * @return {Function}
 */
BPMNPool.prototype.dragLeave = function (pool) {
    return function (e, ui) {
        pool.setFocus(true);
        pool.setColor(poolColor);
        //
    };
};
