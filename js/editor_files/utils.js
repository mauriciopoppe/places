/**
 * @fileOverview File that contains all auxiliar classes
 * @author Thaer Latif
 */

/**
 * Represents the properties that are taken for building a shape according the
 * zoom factor
 * @class ShapeZoomProperty
 */

ShapeZoomProperty = function (width, height) {
    this.width = width;
    this.height = height;

};
/**
 * Represents the properties that are used for building a layer according to a
 * zoom factor
 * @param width
 * @param height
 * @param bpmnClass
 * @param elementClass
 * @returns {LayerZoomProperty}
 */

LayerZoomProperty = function (width, height, bpmnClass, elementClass) {
    this.width = width;
    this.height = height;
    this.bpmnClass = bpmnClass;
    this.elementClass = elementClass;
};


//***************************************************************************
//****************************Start of UniqueID Class ***********************
//***************************************************************************


/**
 * Construct a class to generate unique id to elements
 * @constructor ArrayList
 */

//***************************************************************************
//**************************** End of UniqueID Class ************************
//***************************************************************************
/**
 * Hide the ports that are currently selected in the canvas, and set their
 * zIndex and their parents zIndex to regular
 * @param {Canvas} canvas
 */
function hideSelectedPorts(canvas) {
    //the currently selected source and destination port in the canvas
    var selectedSrc = canvas.selectedSourcePort,
        selectedDst = canvas.selectedDestPort;

    //if they are not null, then we hide them
    if (selectedSrc && selectedDst) {
        selectedSrc.hidePort();
        selectedDst.hidePort();
        selectedSrc.setZOrder(1).parent.setZOrder(1);
        selectedDst.setZOrder(1).parent.setZOrder(1);
        selectedDst.moveTowardsTheCenter(selectedDst, true);
        selectedSrc.moveTowardsTheCenter(selectedSrc, true);
        canvas.selectedSourcePort = null;
        canvas.selectedDestPort = null;

    }

}


/**
 * Shows the resize handlers of all the selected shapes
 * @param {Canvas} canvas
 * @param {bpmnShape} bpmnShape
 */

function showSelectedHandlers(canvas, bpmnShape, isCtrl, multipleSelection) {
    var i,
        object,
        selected = canvas.currentSelection;

    if (!isCtrl && !multipleSelection) {//shift or control are not pressed
        for (i = selected.getSize() - 1; i >= 0; i -= 1) {
            object = selected.popLast();
            if (object.family === "BPMNShape" || object.family === "BPMNGroupElement") {
                //object.showOrHideResizeHandlers(false);
                canvas.removeFromSelection(object);
            }
        }
    }
    if (!bpmnShape || !bpmnShape.family || (bpmnShape.family !== "BPMNShape" &&
        //bpmnShape.family != "BPMNGroupElement") || bpmnShape.type === "BPMNLane")
        bpmnShape.family !== "BPMNGroupElement")) {
        return;
    }

//    if (selected.contains(bpmnShape)){
//        bpmnShape.showOrHideResizeHandlers(false);
//        canvas.removeCurrentSelection(bpmnShape);
//    } else {
//        bpmnShape.showOrHideResizeHandlers(true);
//        canvas.setCurrentSelection(bpmnShape)
//    }
    canvas.addToSelection(bpmnShape);

}


function hidePreviousConnection(canvas) {
    //the currently selected source and destination port in the canvas
    var i,
        currentHandler,
        previousConnection = canvas.currentConnection;
    if (previousConnection) {
        for (i = 0; i < previousConnection.lineSegments.getSize(); i += 1) {
            currentHandler = previousConnection.lineSegments.get(i).moveHandler;
            if (currentHandler) {
                currentHandler.setVisible(false);
            }
        }
        canvas.previousConnection = canvas.currentConnection;
        canvas.currentConnection = null;
    } else {
        canvas.previousConnection = null;
    }
}

function createShapeById(id) {
    var bpmnShape = null;

    switch (id) {
        case "event":
            bpmnShape = new BPMNEvent(4);
            break;
        case "intermediateevent":
            bpmnShape = new BPMNEvent(4, "IntermediateEvent");
            break;
        case "endevent":
            bpmnShape = new BPMNEvent(4, "EndEvent");
            break;
        case "boundaryevent":
            //bpmnShape = new BPMNEvent(4, "BoundaryEvent");
            bpmnShape = new BPMNBoundaryEvent(4, "BoundaryEvent");
            break;
        case "gateway":
            bpmnShape = new BPMNGateway(4);
            break;
        case "datastore":
            bpmnShape = new BPMNDataStore(4);
            break;
        case "dataobject":
            bpmnShape = new BPMNDataObject(4);
            break;
        case "pool":
            bpmnShape = new BPMNPool(8);
            break;
        case "participant":
            bpmnShape = new BPMNParticipant(8);
            break;
        case "lane":
            bpmnShape = new BPMNLane(8);
            break;
        case "group":
            bpmnShape = new BPMNGroup(8);
            break;
        case "activity":
            bpmnShape = new BPMNActivity(8, 'BPMNActivity');
            bpmnShape.label.setMessage('Task # 1');
            //bpmnShape.draw();
            break;
        case "annotation":
            bpmnShape = new BPMNAnnotation(8);
            bpmnShape.label.setMessage('Text # 1');
            //bpmnShape.paint();
            break;
        case "oval":
            bpmnShape = new Oval(new Point(50, 50));
            bpmnShape.setDimension(100, 100);
            break;
        case "subprocess":
            bpmnShape = new BPMNSubProcess(8);
            bpmnShape.label.setMessage('Subprocess # 1');
            bpmnShape.label.setPos(1);
            break;
        case "label":
            bpmnShape = new Label(null, null, false);
            bpmnShape.setMessage('Label # 1');
            break;
        default:
            break;
    }
    return bpmnShape;
}


/**
 * Adds a shape to the corresponding container and calls to the container addShape method
 * @param {containerElement}containerElement
 * @param {BPMNShape} bpmnShape
 * @param {JQuery.Event} e
 */
function addToContainer (containerElement, bpmnShape, e, x, y) {
    var zoomPropertiesIndex,
        shapeLeft = 0,
        shapeTop = 0,
        shapeWidth,
        shapeHeight,
        xCoord = !x ? e.pageX : x,
        yCoord = !y ? e.pageY : y;


    if (containerElement.type === "Canvas") {
        zoomPropertiesIndex = containerElement.getPropertyPosition();
        shapeLeft = containerElement.getLeftScroll();
        shapeTop = containerElement.getTopScroll();
    } else {
        zoomPropertiesIndex = containerElement.canvas.getPropertyPosition();
        shapeLeft = containerElement.canvas.getLeftScroll() -
            containerElement.canvas.getLeft();
        shapeTop = containerElement.canvas.getTopScroll() -
            containerElement.canvas.getTop();
    }


    shapeWidth = bpmnShape.getElementProperties()[zoomPropertiesIndex].width;
    shapeHeight = bpmnShape.getElementProperties()[zoomPropertiesIndex].height;
    if (bpmnShape.type == "Label") {
        shapeWidth = bpmnShape.getWidth();
        shapeHeight = bpmnShape.getHeight();
    }
    shapeLeft += xCoord - shapeWidth / 2 - containerElement.getLeft();

    shapeTop += yCoord - shapeHeight / 2 - containerElement.getTop();

//    }

    if (bpmnShape.family === "BPMNGroupElement" ||
        bpmnShape.type === "MultipleSelectionContainer" ||
        containerElement.type === "MultipleSelectionContainer") {
        shapeLeft += shapeWidth / 2;
        shapeTop += shapeHeight / 2;

    }

    if (bpmnShape.type === "BPMNBoundaryEvent") {
        console.log(shapeLeft + ', ' + shapeTop);
    }

//    if (bpmnShape.type == "Label") {
//        shapeLeft += shapeWidth/2;
//        shapeTop += shapeHeight/2;
//    }

//    console.log(shapeLeft + " " + shapeTop);
    containerElement.addShape(bpmnShape, shapeLeft, shapeTop);
    //bpmnShape.fixZIndex(bpmnShape, 0);
//    console.log(this.shapeChildren.asArray());


}

/**
 * Removes a shape from its corresponding container
 * @param bpmnShape
 */
function removeFromContainer (bpmnShape) {
    if (bpmnShape.parent) {
        bpmnShape.parent.children.remove(bpmnShape);
        if (bpmnShape.parent.resizable) {
            bpmnShape.parent.updateResizeListener(bpmnShape.parent);
        }
        bpmnShape.parent = null;
    }
}

function getPointRelativeToPage (bpmnShape) {
    var canvas = bpmnShape.canvas,
        x = bpmnShape.absoluteX + canvas.getLeft() - canvas.getLeftScroll() +
            bpmnShape.width / 2,
        y = bpmnShape.absoluteY + canvas.getTop() - canvas.getTopScroll() +
            bpmnShape.height / 2;
    console.log("prev " + bpmnShape.absoluteX + " " + bpmnShape.absoluteY);
    return new Point(x, y);
}

/*********************************************************************/

// This code publish object to be used with nodejs environment
//if (typeof exports !== 'undefined') {
//    module.exports = ArrayList;
//    var _ = require('../../lib/underscore/underscore.js');
//}

/**
 * Update positions about boundary events reletive to an activity
 * @param bpmnShape
 */
