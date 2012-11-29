
var BPMNActivity = function (handlers, type, style) {
    var xDimension,
        yDimension,
        elementClass,
        i,
        lay;

    BPMNShape.call(this, handlers);

    /**
     *
     * @type {*}
     */
    this.type = (type !== null || type !== '') ? type : null;
    /**
     *
     * @type {*}
     */
    this.style = (style !== null || style !== '') ? style : null;

    /**
     *
     * @type {Array}
     */
    this.types = ['bpmn_activity_subprocess',
        'bpmn_activity_call_activity',
        'bpmn_activity_transaction',
        'bpmn_activity_event_subprocess'];


    /**
     * Limits for the inner figure, for drag & drop behavior
     * @type array
     * @TODO Determine true limits
     */
    this.limits = [5, 5, 5, 5, 5];
    /**
     * The width including the CSS3 border width
     * @type {Number}
     */
    this.realWidth = 0;
    /**
     * The height including the CSS3 border height
     * @type {Number}
     */
    this.realHeight = 0;

    //dimensions according to the zoom scale
    xDimension = [14, 20, 101, 32, 37];
    yDimension = [15, 24, 51, 40, 47];

    if (this.type === "bpmn_activity_subprocess") {
        xDimension[2] = 350;
        yDimension[2] = 400;
    }
    //this variable holds the class that will be applied to the element
    elementClass = "bpmn_activity";

    for (i = 0; i < this.zoomScales; i += 1) {
        //construct the element properties that are used according to the
        // zoom scale
        this.elementProperties.push(new ShapeZoomProperty(xDimension[i],
            yDimension[i]));
    }
    //insert the corresponding layer to the element
    this.layers.insert(new Layer(this, "main Activity layer", elementClass,
        0, "", true));

    //insert the corresponding layer to label element
    lay = new Layer(this, "Label", 'label_empty', 5, "", true);

    this.layers.insert(lay);

    this.label.setCanvas(lay);

    this.label.setAutomaticResize(true);

    this.markers = ['img_100_task_empty',
        'img_100_task_sendtask',
        'img_100_task_receivetask',
        'img_100_task_usertask',
        'img_100_task_businessrule',
        'img_100_task_servicetask',
        'img_100_task_scripttask',
        'img_100_task_manualtask',
        'img_100_activity_adhoc',
        'img_100_loop_none',
        'img_100_loop_sequencial',
        'img_100_loop_parallel',
        'img_100_loop_standard',
        'img_100_activity_compensation'];
    this.numBoundary = [0, 0, 0, 0]; // [BOTTOM,LEFT,TOP,RIGHT];
    this.boundaryPlaces = new ArrayList();

};

BPMNActivity.prototype = new BPMNShape();
BPMNActivity.prototype.type = 'BPMNActivity';
/**
 * Function for attaching listeners to the corresponding activities
 * @param {BPMNActivity} activity
 */
BPMNActivity.prototype.attachListeners = function (activity) {
    var $pool;
    BPMNShape.prototype.attachListeners.call(this, activity);
    $(activity.html).droppable({
        accept: "#boundaryevent,.helper,.bpmn_port",
        //accept: "#boundaryevent,#drag-helper,.bpmn_port,.valid-drop-class",
        drop: activity.onDrop(activity),
        over: activity.dragEnter(activity),
        out : activity.dragLeave(activity)
//        greedy: true
    });

    $(activity.html).bind('contextmenu', function (e) {e.preventDefault(); });
    $(activity.html).mousedown(function (e) {
        var newL, j, layer;
        e.preventDefault();
        if (e.which === 3) {
            if (e.ctrlKey) {
                //Ctrl Key Pressed
            }
            j = Math.floor(Math.random() *
                (activity.markers.length - 1) + 1);
            layer = activity.layers.find('id', activity.id + 'Layer-Markers');
            if (typeof layer === 'undefined') {
                newL = new Layer(activity, "Markers", 'img_100_task_empty', 0,
                    '', true);
                activity.addLayer(newL, 4, ['bpmn_zoom', activity.markers[j]]);
            } else {
                activity.addMarkers(layer, 0, ['bpmn_zoom',
                    activity.markers[j]]);
            }
//            console.log(newL.html);
        }
    });

    return this;
};

BPMNActivity.prototype.updateResizeListener  = function (activity) {
    var margin = 11,
        minW,
        minH,
        $activity;
    minW = activity.label.width + margin;
    minH = activity.label.height + margin;

    $activity = $(activity.html).resizable({
        minWidth : minW,
        minHeight : minH
    });
};

BPMNActivity.prototype.validateDimensions = function (shape, e) {
    return this;
};
BPMNActivity.prototype.onDrop = function (activity) {
    return function (e, ui) {
        BPMNSubProcess.prototype.onDrop.call(this, activity)(e, ui);

        activity.setColor('#0055cc');
    };
};
BPMNActivity.prototype.dragEnter = function (activity) {
    return function (e, ui) {
        activity.setColor(overContainerColor);
    };
};
BPMNActivity.prototype.dragLeave = function (activity) {
    return function (e, ui) {
        activity.setColor('#0055cc');
    };
};
/**
 * This method will determine the drag behavior that will be used
 * according to where the user clicked
 * @param {Point} clickedPoint
 * @returns Number
 */

BPMNActivity.prototype.determineDragBehavior = function(clickedPoint){

    //the limit applied according to the zoom scale
    var limit = this.limits[2];
    //if the point is in the inner rectangle then we just drag
    //console.log(this.width + 5 - limit);
    if(Geometry.pointInRectangle(clickedPoint, new Point(limit, limit),
        new Point(this.width + 5 - limit, this.height + 5 - limit))){
        return this.DRAG;
    }
    //if the point is in the outer rectangle then we just connect
    if(Geometry.pointInRectangle(clickedPoint, new Point(0, 0),
        new Point(this.width + 5, this.height + 5))){
        return this.CONNECT;
    }
    //if the user clicked outside the shape we just cancel
    return this.CANCEL;


};

/**
 * Defines a port position for an activity
 * @param {Port} port
 * @param {Point} point
 * @return {*}
 */
BPMNActivity.prototype.definePortPosition = function (port, point) {

    // this array will be used to determine to which side the point that
    // was clicked is closer, top, right, bottom, left
    var shapeSide = [-2, this.realWidth, this.realHeight, -2],
        //the next two arrays will be used to calculate the port final position
        xCoordinate = [point.x, this.realWidth, point.x, -2],
        yCoordinate = [-2, point.y, this.realHeight, point.y],
        // minDist will store the minimum distance so far to one side
        // of the shape
        minDist = point.y,
        //this will store the direction determined so far
        direction = this.TOP,
        i,
        coordinate,
        value;

    //calculates to which side we should add the port to
    for (i = 1; i < 4; i += 1) {
        coordinate = (i % 2) ? point.x : point.y;
        value = Math.abs(shapeSide[i] - coordinate);
        if (minDist > value) {
            minDist = value;
            direction = i;
        }
    }

    port.setPosition(xCoordinate[direction] - port.width / 2,
                     yCoordinate[direction] - port.height / 2);

    //Subtract the wide of the CSS border to get the original starting point
//    port.setAbsolutePosition(port.x + this.realX, port.y + this.realY);
    port.setDirection(direction);
    port.determinePercentage();

    return this;


};
/**
 * Adds a shape to this subprocess
 * @param {Shape} shape
 * @param {Number} x
 * @param {Number} y
 */
BPMNActivity.prototype.addShape = function (shape, x, y) {
    shape.setParent(this);
    shape.setPosition(x, y).setCanvas(this.canvas);
    this.html.appendChild(shape.getHTML());
    shape.paint();
    this.children.insert(shape);
};

/**
 * Creates the corresponding html for an activity bpmn element
 * @return {*}
 */
BPMNActivity.prototype.createHTML = function () {
    BPMNShape.prototype.createHTML.call(this);
    this.realWidth = this.width + 2;
    this.realHeight = this.height + 2;
    this.realX = this.x + 2;
    this.realY = this.y + 2;
    this.html.className = 'bpmn_activity';
    if (this.type !== null) {
        this.html.className += ' ' + this.type;
    }
    return this.html;
};


/**
 * Sets the real position of the bpmn activity relative to its container
 * @param {Number} x
 * @param {Number} y
 * @return {*}
 */
BPMNActivity.prototype.setPosition = function (x, y, triggerChange) {
    Shape.prototype.setPosition.call(this, x, y, triggerChange);
    this.realX = this.x + 2;
    this.realY = this.y + 2;
    return this;
};


/**
 * Applies the styling to the activity
 */
BPMNActivity.prototype.paint = function () {
    if (this.html === null)
        this.createHTML();

//    console.log(this.label);
    if (this.label.getMessage() !== '') {
//        this.label.setPos(7);
//        this.label.setOrientation('vertical');
        this.label.paint(this);
    }
};


BPMNActivity.prototype.repaint = function () {
    this.paint();
};

//BPMNActivity.prototype.getHTML = function(){
//    return this.html;
//}
/**
 * Returns the activity type
 * @return {String}
 */
BPMNActivity.prototype.getType = function () {
    return this.type;
};

/**
 * Returns the activity style
 * @return {*}
 */
BPMNActivity.prototype.getStyle = function () {
    return this.style;
};
/**
 * Analog function to getAsoluteX for common behavior among containers
 * @type {Function}
 */
BPMNActivity.prototype.getLeft = Shape.prototype.getAbsoluteX;
/**
 * Analog function to getAbsoluteY for common behavior among containers
 * @type {Function}
 */
BPMNActivity.prototype.getTop = Shape.prototype.getAbsoluteY;
/**
 * Sets the activity type
 * @param {String} newType
 * @return {*}
 */
BPMNActivity.prototype.setType = function (newType) {
    this.type = newType;
    return this.type;
};

/**
 * Sets the activity style
 * @param newStyle
 * @return {*}
 */
BPMNActivity.prototype.setStyle = function (newStyle) {
    this.style = newStyle;
    return this.style;
};
BPMNActivity.prototype.setColor = function (newColor) {
    this.html.style.borderColor = newColor;
    return this;
};
/**
 * Determines which shapes are valid for dropping in a subprocess
 * @param {BPMNShape} bpmnShape
 * @return {Boolean}
 */
BPMNActivity.prototype.validateShape = function (bpmnShape) {
    return bpmnShape.type === "BPMNBoundaryEvent";
};

/**
 * Get number of  boundary events atached to activity
 * @param {BPMNShape} bpmnShape
 * @return {Boolean}
 */
BPMNActivity.prototype.getNumberOfBoundaries = function () {
    var child, i, bouNum=0;
    for(i=0 ; i<this.getChildren().getSize(); i=i+1){
        child= this.getChildren().get(i);
        //console.log(child);
        if (child.getType()==='BPMNBoundaryEvent'){
            bouNum = bouNum + 1;
        }
    }
    return bouNum;
};
/**
 * set Focus for set focusable a container
 * @param {Boolean} focus
 * @return {*}
 */
BPMNActivity.prototype.setFocus = function (focus) {
    this.focus= focus;
    return this;
};
/**
 * Get Focus status of the container
 * @return {Boolean} focus
 */
BPMNActivity.prototype.getFocus = function () {
    return this.focus;
};


BPMNActivity.prototype.makeBoundaryPlaces = function (bpmnShape) {
    var bouX,
        bouY,
        bouNum,
        factor = 3,
        space,
        number=0;

    //BOTTON
    var numBotton =0;
    bouY = bpmnShape.parent.getHeight() - bpmnShape.getHeight() / 2; //y constante
    bouX = bpmnShape.parent.getWidth() - (numBotton + 1) * (bpmnShape.getWidth() + factor);

    while(bouX + bpmnShape.getWidth() / 2 > 0){
        space = {};
        space.x = bouX;
        space.y = bouY;
        space.available = true;
        space.number = number;
        space.location = 'BOTTON';
        bpmnShape.parent.boundaryPlaces.insert(space);
//        bpmnShape.setPosition(bouX, bouY);
//        alert('posicion : '+bouX+','+bouY);
        number += 1;
        numBotton += 1;
        bouX = bpmnShape.parent.getWidth() - (numBotton + 1) * (bpmnShape.getWidth() + factor);

    }
    //LEFT
    var numLeft=0;
    bouY = bpmnShape.parent.getHeight() - (numLeft + 1) * (bpmnShape.getHeight() + factor);
    bouX = -bpmnShape.getHeight() / 2;   //x constante
    while(bouY + bpmnShape.getHeight() / 2 > 0){
        space = {};
        space.x = bouX;
        space.y = bouY;
        space.available = true;
        space.number = number;
        space.location = 'LEFT';
        bpmnShape.parent.boundaryPlaces.insert(space);
//        bpmnShape.setPosition(bouX, bouY);
//        alert('posicion : '+bouX+','+bouY);
        number += 1;
        numLeft += 1;
        bouY = bpmnShape.parent.getHeight() - (numLeft + 1) * (bpmnShape.getHeight() + factor);
    }
    //TOP
    var numTop=0;
    bouY = -bpmnShape.getWidth() / 2;//x constante
    bouX = (numTop) * (bpmnShape.getWidth() + factor);
    while(bouX + bpmnShape.getWidth() / 2 < bpmnShape.parent.getWidth()){
        space = {};
        space.x = bouX;
        space.y = bouY;
        space.available = true;
        space.number = number;
        space.location = 'TOP';
        bpmnShape.parent.boundaryPlaces.insert(space);
//        bpmnShape.setPosition(bouX, bouY);
//        alert('posicion : '+bouX+','+bouY);
        number += 1;
        numTop += 1;
        bouX = (numTop) * (bpmnShape.getWidth() + factor);
    }
    //RIGHT
    var numRight=0;
    bouY = (numRight) * (bpmnShape.getHeight() + factor);
    bouX = bpmnShape.parent.getWidth() - bpmnShape.getWidth() / 2;//CONSTANTE
    while(bouY + bpmnShape.getHeight() / 2 < bpmnShape.parent.getHeight()){
        space = {};
        space.x = bouX;
        space.y = bouY;
        space.available = true;
        space.number = number;
        space.location = 'RIGHT';
        bpmnShape.parent.boundaryPlaces.insert(space);
//        bpmnShape.setPosition(bouX, bouY);
//        alert('posicion : '+bouX+','+bouY);
        number += 1;
        numRight += 1;
        bouY = (numRight) * (bpmnShape.getHeight() + factor);
    }
    return this;
};
BPMNActivity.prototype.setBoundary = function (bpmnShape, number) {
    var bouPlace = this.boundaryPlaces.get(number);
    bouPlace.available = false;
    bpmnShape.setPosition(bouPlace.x, bouPlace.y);
};
BPMNActivity.prototype.getAvailableBoundaryPlace = function () {
    var place = 0,
        bouPlace,
        sw = true,
        i;
    for (i = 0; i < this.boundaryPlaces.getSize(); i += 1) {
        bouPlace = this.boundaryPlaces.get(i);
        if (bouPlace.available && sw) {
           place = bouPlace.number;
            sw = false;
        }
    }
    if (!sw){
        return place;
    } else {
        return false;
    }

};
BPMNActivity.prototype.updateBoundaryPlaces = function (bpmnShape) {
    var i,
        aux,
        k=0;
    aux =  new ArrayList();
    for (i = 0; i < this.boundaryPlaces.getSize(); i += 1) {
        aux.insert(this.boundaryPlaces.get(i));
    }
    this.boundaryPlaces.clear();
    //  console.log(aux.asArray());
    this.makeBoundaryPlaces(this.getChildren().getFirst());

    for (i = 0; i < this.boundaryPlaces.getSize(); i += 1) {
//        //console.log(this.boundaryPlaces.get(i));
//        console.log(aux.get(i).location);
        if(k < aux.getSize()){
           // console.log(this.boundaryPlaces.get(i).location +'==='+ aux.get(k).location);
            //if (this.boundaryPlaces.get(i).location === aux.get(k).location) {
              //  console.log(k);
//                if(!aux.get(k).available){
//                    //alert(aux.get(k).number);
//                 //   console.log(this.getChildren().asArray());
//                    //this.getChildren().get(0).numberRelativeToActivity = i;
//
//                    var bouToModify = null;
//                    for (j = 0; j < this.getChildren().getSize(); j += 1) {
//                        if(this.getChildren().get(j).type === 'BPMNBoundaryEvent'){
//                            var bou = this.getChildren().get(j);
//                            //alert(bou.numb  erRelativeToActivity +'==='+ aux.get(k).number);
//                            if (bou.numberRelativeToActivity === aux.get(k).number) {
//                                bouToModify = bou;
//                            }
//                        }
//                    }
//
//                    bouToModify.numberRelativeToActivity = i;
//                }
                this.boundaryPlaces.get(i).available = aux.get(k).available;
              //  console.log(aux.get(k));
                //
                k++;
//
          //}

        }

    }
    return this;
};
BPMNActivity.prototype.updateBoundaryPositions = function () {
    var child,
        i;
    if (this.getNumberOfBoundaries() > 0) {

        this.updateBoundaryPlaces(this.getChildren().getFirst());
        console.log(this.getChildren().getSize());
        for (i = 0; i < this.getChildren().getSize(); i += 1) {
            child = this.getChildren().get(i);
            //console.log(child);
            //console.log(this.boundaryPlaces.get(child.numberRelativeToActivity));
            child.setPosition(this.boundaryPlaces.get(
                child.numberRelativeToActivity).x,
                this.boundaryPlaces.get(child.numberRelativeToActivity).y
            );
        }

    }
};

BPMNActivity.prototype.hideBoundaryEvents = function () {
    var i,
        child;
    for (i = 0; i < this.getChildren().getSize(); i += 1) {
        child = this.getChildren().get(i);
        if (child.type === 'BPMNBoundaryEvent') {
            //console.log(child);
            //alert('hide');
            child.hideLayer(child.getID());
        }
    }
};