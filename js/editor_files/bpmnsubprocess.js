
/**
 * This class represents a BPMN Sub-process which functions as a container,
 * for other elements, and it can be nested within another containers
 * or it can be independent
 * @param {Number} handlers Number of resize handlers that a subprocess
 * would display
 * @param {String} type
 * @param {String} style
 * @constructor
 */
var BPMNSubProcess = function (handlers, type, style) {
    BPMNActivity.call(this, handlers, "bpmn_activity_subprocess");
    this.container = true;
    this.defaultZOrder = 4;
    this.zOrder = 4;
    this.children = new ArrayList();
    this.focus = true;
};

BPMNSubProcess.prototype = new BPMNActivity();
BPMNSubProcess.type = "BPMNSubProcess";

/**
 * Function for attaching listeners to the corresponding subprocess
 * @param {BPMNSubProcess} subprocess
 */
BPMNSubProcess.prototype.attachListeners = function (subprocess) {
    BPMNShape.prototype.attachListeners.call(this, subprocess);
    var $subprocess = $(subprocess.html).droppable({
        //accept:"#pm_project_toolbar ul > li,.valid-outside-shapes,
        // valid-outside-shapes-group,.other-valid,.valid-drop-class,.helper",
        accept: "#event,#intermediateevent,#boundaryevent,#endevent,#activity" +
            ",#gateway,#dataobject,#datastore,#annotation" +
            ",#subprocess ,.valid-outside-shapes," +
            ".valid-outside-shapes-group,.other-valid," +
            ".valid-drop-class,.helper,.bpmn_port",
        drop: subprocess.onDrop(subprocess),
        //activeClass: "ui-state-highlight",
        //over:subprocess.dragEnter(subprocess),
        //out:subprocess.dragLeave(subprocess),
        //activeClass: "focused",
        hoverClass: "focused",
        greedy: true
    });
};

/**
 * Creates the corresponding html for an activity bpmn element
 * @return {*}
 */
BPMNSubProcess.prototype.createHTML = function () {
    BPMNActivity.prototype.createHTML.call(this);
    this.html.style.backgroundColor = (new Color(217, 237, 247, 0.8)).getCSS();
    return this.html;
};

BPMNSubProcess.prototype.updateResizeListener  = function (subProcess) {
    var margin = 11,
        labelH = 51,
        labelW = 101,
        minW,
        minH,
        children = subProcess.children,
        limits = children.getDimensionLimit(),
        $subProcess;

    if (subProcess.label.orientation === 'vertical') {
        minW = Math.max(limits[1], Math.max(labelH, subProcess.label.height)) +
            margin + 8;
        minH = Math.max(limits[2], Math.max(labelW, subProcess.label.width)) +
            margin;
    } else {
        minW = Math.max(limits[1], Math.max(labelW, subProcess.label.width)) +
            margin;
        minH = Math.max(limits[2], Math.max(labelH, subProcess.label.height)) +
            margin + 8;

    }

    $subProcess = $(subProcess.html).resizable({
        minWidth : minW,
        minHeight : minH
    });
};

BPMNSubProcess.prototype.validateDimensions = function (shape, e) {
    //var factor = 10*this.zoomFactor;
    var factor = 10;
    //console.log(shape.getX() + ',' + shape.getY());

    var newWidth = shape.getX() + shape.getWidth() + factor;
    var newHeight = shape.getY() + shape.getHeight() + factor;

    if (shape.getX() < 0) {
        //for(var i=0;i<this.children.getSize();i=i+1){
        //    var child = this.children.get(i);
        //alert(child.type);
        //child.setPosition(child.x-shape.getX(),child.y);
        //}
        this.setPosition(this.getLeft() + shape.getX(), this.getTop());
        shape.setPosition(shape.x - shape.getX(), shape.y);

    }
    if (shape.getY() < 0) {
        this.setPosition(this.getLeft(), this.getTop() + shape.getY());
        shape.setPosition(shape.x, shape.y - shape.getY());
    }

    if (newWidth > this.getWidth()) {
        this.setDimension(newWidth, this.getHeight());
        //this.repaint();
    }
    if (newHeight > this.getHeight()) {
        this.setDimension(this.getWidth(), newHeight);
        //this.repaint();
    }
    return this;
};

/**
 * Adds a shape to this subprocess
 * @param {Shape} shape
 * @param {Number} x
 * @param {Number} y
 * @returns {SubProcess}
 */
BPMNSubProcess.prototype.addShape = function (shape, x, y) {
    shape.parent = this;
    shape.setPosition(x, y).setCanvas(this.canvas);
    this.html.appendChild(shape.getHTML());
    shape.paint();
    this.children.insert(shape);
    return this;


};

/**
 * Determines which shapes are valid for dropping in a subprocess
 * @param {BPMNShape} bpmnShape
 * @return {Boolean}
 */
BPMNSubProcess.prototype.validateShape = function (bpmnShape) {
    return bpmnShape.type !== "BPMNLane";
};

/**
 * Analog function to getAsoluteX for common behavior among containers
 * @type {Function}
 */
BPMNSubProcess.prototype.getLeft = Shape.prototype.getAbsoluteX;
/**
 * Analog function to getAbsoluteY for common behavior among containers
 * @type {Function}
 */
BPMNSubProcess.prototype.getTop = Shape.prototype.getAbsoluteY;


BPMNSubProcess.prototype.updateChildrenPosition = function (diffX, diffY) {
    var children = this.children,
        child,
        i;
    for (i = 0; i < children.getSize(); i += 1) {
        child = children.get(i);
        child.oldX = child.x;
        child.oldY = child.y;
        child.oldAbsoluteX = child.absoluteX;
        child.oldAbsoluteY = child.absoluteY;
        if ((diffX !== 0 || diffY !== 0) &&
                !this.canvas.currentSelection.contains(child)) {
            child.changePosition(child.oldX, child.oldY, child.oldAbsoluteX,
                child.oldAbsoluteY);
        }
        child.setPosition(child.x + diffX, child.y + diffY);
    }

};

BPMNSubProcess.prototype.updateSize = function () {
    var children = this.children,
        limits = children.getDimensionLimit(),
        left = limits[3],
        top = limits[0],
        right = limits[1],
        bottom = limits[2],
        newLeft = this.x,
        newTop = this.y,
        newWidth = this.width,
        newHeight = this.height,
        margin = 15,
        diffX = 0,
        diffY = 0,
        positionShift = false,
        dimensionIncrement = false;


    if (this.type === "BPMNPool") {
        margin = 0;
    }

    if (left < 0) {
        diffX = margin - left;
        positionShift = true;
        this.oldX = this.x;
        this.oldAbsoluteX = this.x;
        this.oldY = this.y;
        this.oldAbsoluteY = this.absoluteY;
    }
    if (top < 0) {
        diffY = margin - top;
        positionShift = true;
        this.oldX = this.x;
        this.oldAbsoluteX = this.x;
        this.oldY = this.y;
        this.oldAbsoluteY = this.absoluteY;
    }

    newLeft -= diffX;
    newTop -=  diffY;
    newWidth +=  diffX;
    newHeight += diffY;

    if (right > newWidth) {
        newWidth = right + margin + diffX;
        dimensionIncrement = true;
        this.oldWidth = this.width;
    }
    if (bottom > newHeight) {
        newHeight = bottom + margin + diffY;
        dimensionIncrement = true;
        this.oldHeight = this.height;
    }

    this.setPosition(newLeft, newTop);
    if (positionShift) {
        this.changePosition(this.oldX, this.oldY, this.absoluteX,
            this.absoluteY);
    }
    this.updatePortsPosition(newWidth - this.width, newHeight - this.height);
    this.setDimension(newWidth, newHeight);
    if (dimensionIncrement) {
        this.changeSize(this.oldWidth, this.oldHeight);
    }
    this.updateChildrenPosition(diffX, diffY);

};


/**
 * Drop Handler: Determines whether to create a connection between shapes or
 * add a shape to this subprocess
 * @param subprocess
 * @return {Function}
 */
BPMNSubProcess.prototype.onDrop = function (subprocess) {
    return function (e, ui) {
        var bpmnShape = null,
            selection,
            sibling,
            i,
            coordinates,
            id;

        if (!BPMNShape.prototype.onDrop.call(this, subprocess)(e, ui)) {

            id = ui.draggable.attr('id');
            bpmnShape = createShapeById(id);
            if (bpmnShape === null) {
                bpmnShape = subprocess.canvas.bpmnShapes.find('id', id);
                if (!bpmnShape) {
                    return false;
                }
                if (!(bpmnShape.parent &&
                        bpmnShape.parent.id === subprocess.id)) {

                    selection = subprocess.canvas.currentSelection;
                    for (i = 0; i < selection.getSize(); i += 1) {
                        sibling = selection.get(i);
                        sibling.oldParent = sibling.parent;
                        sibling.oldX = sibling.x;
                        sibling.oldY = sibling.y;
                        sibling.oldAbsoluteX = sibling.absoluteX;
                        sibling.oldAbsoluteY = sibling.absoluteY;
                        coordinates = getPointRelativeToPage(sibling);
                        removeFromContainer(sibling);
                        addToContainer(subprocess, sibling, e, coordinates.x,
                            coordinates.y);
                        sibling.fixZIndex(sibling, 0);
                        sibling.changeParent(sibling.oldX, sibling.oldY,
                            sibling.oldAbsoluteX, sibling.oldAbsoluteY,
                            sibling.oldParent, sibling.canvas);
                        //console.log(subprocess.children.getSize());
                    }
                    subprocess.canvas.multipleDrop = true;

                }
                subprocess.updateSize();


                subprocess.canvas.updatedElement = null;
            } else if (subprocess.validateShape(bpmnShape)) {

                addToContainer(subprocess, bpmnShape, e);
                bpmnShape.fixZIndex(bpmnShape, 0);
                subprocess.canvas.addToList(bpmnShape);
                bpmnShape.attachListeners(bpmnShape);
                bpmnShape.showOrHideResizeHandlers(false);
                //since it is a new element in the designer, we triggered the
                //custom on create element event
                subprocess.canvas.updatedElement = bpmnShape;
                $(subprocess.canvas.html).trigger("createelement");
            }
            //subprocess.validateDimensions(bpmnShape, e);
            if (subprocess.type !== 'BPMNLane') {
                subprocess.updateResizeListener(subprocess);
            }

            //setting boundary position
            if (bpmnShape.getType() === 'BPMNBoundaryEvent') {
                if (bpmnShape.parent.boundaryPlaces.isEmpty()) {
                    bpmnShape.parent.makeBoundaryPlaces(bpmnShape);
                }
                bpmnShape.attachToActivity();
            }
        }
        subprocess.setColor(poolColor);
        subprocess.setFocus(true);
    };
};
/**
 * Set color to subprocess
 * @param {Color} newColor
 * @return {*}
 */
BPMNSubProcess.prototype.setColor = function (newColor) {
    this.html.style.borderColor = newColor;
    return this;
};

/**
 * dragEnter Handler for the su process object
 * @param {BPMNSubProcess} subprocess
 * @return {Function}
 */
BPMNSubProcess.prototype.dragEnter = function (subprocess) {
    return function (e, ui) {
        var aux = ui.draggable.attr('class');
        console.log(subprocess.getFocus());
        if (
            aux !==
                'bpmn_shape valid-drop-class ui-draggable ui-droppable helper'
        ) {
            subprocess.setColor(overContainerColor);
        }

    };
};
/**
 * dragLeave Handler for the subprocess object
 * @param {BPMNSubProcess} subprocess
 * @return {Function}
 */
BPMNSubProcess.prototype.dragLeave = function (subprocess) {
    return function (e, ui) {
        //subprocess.setFocus(true);
        subprocess.setColor(poolColor);
    };
};

BPMNSubProcess.prototype.resizeBehavior = function (subprocess, e, ui) {
    var i,
        j,
        port,
        child;
    BPMNShape.prototype.resizeBehavior.call(this, subprocess, e, ui);
    for (i = 0; i < subprocess.children.getSize(); i += 1) {
        child = subprocess.children.get(i);
        child.setPosition(child.x, child.y);
        for (j = 0; j < child.ports.getSize(); j += 1) {
            port = child.ports.get(j);
            port.setPosition(port.x, port.y);

            port.connection.paint();
            console.log(port.getPoint(false));
        }
    }
};
BPMNSubProcess.prototype.onResize = function (subprocess) {
    return function (e, ui) {
        subprocess.resizeBehavior(subprocess, e, ui);
    };
};
BPMNSubProcess.prototype.onResizeEnd = function (subprocess) {
    return function (e, ui) {
        subprocess.resizeBehavior(subprocess, e, ui);
        subprocess.showOrHideResizeHandlers(true);
        if (subprocess.parent) {
            subprocess.parent.updateResizeListener(subprocess.parent);
            subprocess.parent.updateSize();
        }
        subprocess.changeSize(subprocess.oldWidth, subprocess.oldHeight);
        if (subprocess.oldLeft !== subprocess.x ||
                subprocess.oldTop !== subprocess.y) {
            subprocess.changePosition(subprocess.oldLeft, subprocess.oldTop,
                subprocess.oldAbsoluteX, subprocess.oldAbsoluteY);
        }
        subprocess.firePortsChange();
    };
};
