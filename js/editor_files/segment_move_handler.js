/**
 * Created with JetBrains WebStorm.
 * User: mauricio
 * Date: 9/14/12
 * Time: 2:06 PM
 * To change this template use File | Settings | File Templates.
 */
//***************************************************************************
//*********************Start Of SegmentMoveHandler Class***********************
//***************************************************************************

/**
 * Represents the object that will help us move a segment, it can be given a
 * style class
 * @param {Segment} parent
 * @param {String} orientation
 */

var SegmentMoveHandler = function (parent, orientation) {

    if (!parent) {
        return undefined;
    }

    this.orientation = orientation;

    /**
     * Denotes whether the SegmentMove point is visible or not
     * @type Boolean
     */
    this.visible = false;
    /**
     * Fixed SegmentMoveHandler width
     * @type Number
     */
    this.width = 4;
    /**
     * Fixed SegmentMoveHandler height
     * @type Number
     */
    this.height = 4;

    //According to the category we determine the background-color that the handler will have, either green or white
    /**
     * Shape whom the SegmentMove point belongs to
     * @type Object
     */
    this.parent = parent;

    this.color.setGreen(255);

    this.zOrder = 2;
};


SegmentMoveHandler.prototype = new Rectangle();
SegmentMoveHandler.prototype.type = "SegmentMoveHandler";

/**
 * Paint SegmentMoveHandler method
 * @returns {SegmentMoveHandler}
 */
SegmentMoveHandler.prototype.paint = function () {
    ResizeHandler.prototype.paint.call(this);
    this.setZOrder(this.zOrder);
    return this;
};

/**
 * Sets the visibility of the SegmentMoveHandler point
 * @param {Boolean} isVisible
 * @returns {SegmentMoveHandler}
 */
SegmentMoveHandler.prototype.setVisible = function (isVisible) {
    ResizeHandler.prototype.setVisible.call(this, isVisible);
    return this;
};

SegmentMoveHandler.prototype.attachListeners = function (handler) {
    var $handler = $(handler.html);
    $handler.on('click', handler.onClick(handler));
    //$handler.on('mousedown', handler.onMouseDown(handler));
    //$handler.on('mouseover', handler.onMouseOver(handler));
    //$handler.on('mouseup', handler.onMouseUp(handler));
    $handler.draggable({
        start: handler.onDragStart(handler),
        drag: handler.onDrag(handler),
        stop: handler.onDragEnd(handler),
        axis: (handler.orientation === handler.HORIZONTAL) ? "y" : "x"
        //containment: handler.parent.parent.html
    });
};

SegmentMoveHandler.prototype.onMouseDown = function (handler) {
    return function (e, ui) {
        e.stopPropagation();
    };
};

SegmentMoveHandler.prototype.onMouseOver = function (handler) {
    return function (e, ui) {
        e.stopPropagation();
    };
};

SegmentMoveHandler.prototype.onMouseUp = function (handler) {
    return function (e, ui) {
        e.stopPropagation();
    };
};

SegmentMoveHandler.prototype.onClick = function (handler) {
    return function (e, ui) {
        e.stopPropagation();
    };
};

SegmentMoveHandler.prototype.onDragStart = function (handler) {
    return function (e, ui) {
        var parentSegment = handler.parent;
        parentSegment.clearIntersections();
        // e.stopPropagation();
    };
};
SegmentMoveHandler.prototype.onDrag = function (handler) {
    return function (e, ui) {
        var parentSegment = handler.parent,
            prevNeighbor = parentSegment.previousNeighbor,
            nextNeighbor = parentSegment.nextNeighbor,
            midX, midY;

        if (handler.orientation === handler.VERTICAL) {
            parentSegment.startPoint.x = ui.helper.position().left
                + handler.width / 2;
            parentSegment.endPoint.x = ui.helper.position().left
                + handler.width / 2;
            prevNeighbor.endPoint.x =
                parentSegment.startPoint.x;
            nextNeighbor.startPoint.x =
                parentSegment.endPoint.x;
        } else {
            parentSegment.startPoint.y = ui.helper.position().top
                + handler.height / 2;
            parentSegment.endPoint.y = ui.helper.position().top
                + handler.height / 2;
            prevNeighbor.endPoint.y =
                parentSegment.startPoint.y;
            nextNeighbor.startPoint.y =
                parentSegment.endPoint.y;
        }

        // paint the previous segment
        prevNeighbor.paint();
        // fix handler for the prev segment if possible
        if (prevNeighbor.moveHandler) {
            midX = (prevNeighbor.startPoint.x + prevNeighbor.endPoint.x) / 2
                - prevNeighbor.moveHandler.width / 2;
            midY = (prevNeighbor.startPoint.y + prevNeighbor.endPoint.y) / 2
                - prevNeighbor.moveHandler.height / 2;
            prevNeighbor.moveHandler.setPosition(midX, midY);
        }

        // paint the next segment
        nextNeighbor.paint();
        // fix moveHandler for the next segment if possible
        if (nextNeighbor.moveHandler) {
            midX = (nextNeighbor.startPoint.x + nextNeighbor.endPoint.x) / 2
                - nextNeighbor.moveHandler.width / 2;
            midY = (nextNeighbor.startPoint.y + nextNeighbor.endPoint.y) / 2
                - nextNeighbor.moveHandler.height / 2;
            nextNeighbor.moveHandler.setPosition(midX, midY);
        }

        parentSegment.paint();
    };
};
SegmentMoveHandler.prototype.onDragEnd = function (handler) {
    return function (e, ui) {
        handler.onDrag(handler)(e, ui);
        var segment = handler.parent,
            connection = segment.parent,
            i,
            tempSegment;

        // delete previous handlers
        for (i = 0; i < connection.lineSegments.getSize(); i += 1) {
            tempSegment = connection.lineSegments.get(i);
            if (tempSegment.hasMoveHandler) {
                $(tempSegment.moveHandler.html).remove();
            }
        }

        connection.setSegmentMoveHandlers();
        connection.checkAndCreateIntersectionsWithAll();

        // trigger targetSpriteDecorator onClick
        $(connection.targetDecorator.html).trigger('click');
    };
};
//***************************************************************************
//****************************End Of Class **********************************
//***************************************************************************
