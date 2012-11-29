/**
 * Initializes a layer, the constructor must be called with all its parameter
 * for the object to be meaningful, its is important to denote that the css
 * class must follow this structure
 * anyword_zoomScale_anythingYouWantHere
 * @class Class that contains the properties of a layer for a BPMN Shape we need
 * to have a BPMNShape already instantiated and added to the canvas in order for
 * this class to be effective
 * @augments Shape
 * @param {BPMNShape} parent
 * @param {String} name
 * @param {String} elementClass
 * @param {String} priority
 * @param {String} bpmnClass
 * @param {Boolean} visible
 */
var Layer;
Layer = function (parent, name, elementClass, priority, bpmnClass, visible) {
    //this variables will help us construct and parse all the css classes for
    //this layer to be used according to the zoom scale
    var zoomClass,
        auxArray,
        i,
        j;
    if (!parent || !elementClass) {
        return null;
    }
    Shape.call(this);

    this.elementProperties = [];
    /**
     * main CSS class
     * @type String
     */
    this.bpmnClass = (!bpmnClass) ? "" : bpmnClass;
    /**
     * element CSS Class
     * @type String
     */
    this.elementClass = (!elementClass) ? "" : elementClass;
    /**
     * The name of the layer
     * @type String
     */
    this.layerName = (!name) ? "defaultLayerName" : name;
    /**
     * The priority of the layer, determines which layer should be on top
     * @type Number
     */
    this.priority = (!priority) ? 0 : priority;
    /**
     * The bpmnShape that this layer belongs too.
     * Extremely important since some data will be strictly drawn by its parent
     * @type BPMNShape
     */
    this.parent = (!parent) ? null : parent;
    /**
     * Determines when a layer is visible or not
     * @type Boolean
     */
    this.visible = (!visible || typeof visible !== "boolean") ? true : visible;
    /**
     * The canvas that is related to its parent
     * @type Canvas
     */
    this.canvas = parent.canvas;
    //construct the zoom properties of the layer
    for (i = 0; i < this.zoomScales; i += 1) {
        auxArray = elementClass.split("_");
        zoomClass = auxArray[0] + "_" + (JCoreObject.prototype.minZoom +
            i * JCoreObject.prototype.zoomIncreaseFactor);
        for (j = 2; j < auxArray.length; j += 1) {
            zoomClass = zoomClass + "_" + auxArray[j];
        }
        this.elementProperties.push(
            new LayerZoomProperty(
                parent.elementProperties[i].width,
                parent.elementProperties[i].height,
                bpmnClass,
                zoomClass
            )
        );
    }

    /**
     * Markers
     */
    this.markers = new ArrayList();
};

Layer.prototype = new Shape();
Layer.prototype.type = "Layer";

/**
 * Comparison function for ordering layers according to priority
 * @param {Layer} layer1
 * @param {Layer} layer2
 * @returns {Boolean}
 */
Layer.prototype.comparisonFunction = function (layer1, layer2) {
    return layer1.priority > layer2.priority;
};
/**
 * Creates the HTML representation of the layer
 * @returns {Object} The html object
 */
Layer.prototype.createHTML = function (modifying) {
    this.setProperties();
    Shape.prototype.createHTML.call(this, modifying);
    return this.html;
};
/**
 * Paints the corresponding layer, in this case adds the
 * corresponding css classes
 * Important! when hidding we remove all layers classes
 * @returns {Layer}
 */
Layer.prototype.paint = function () {

    //The current position where the properties for the current zoom factor
    // are located
    var propertiesPosition;

    if (!this.html) {
        return this;
    }
    propertiesPosition = (this.canvas) ? this.canvas.getPropertyPosition() : 2;

    //determine the css classes that will be used
    this.bpmnClass = this.elementProperties[propertiesPosition].bpmnClass;
    this.elementClass = this.elementProperties[propertiesPosition].elementClass;

    //apply classes according to visibility
    if (this.visible) {
        this.html.className = this.bpmnClass + " " + this.elementClass;
    } else {
        this.html.className = "";
    }
    return this;
};

/**
 * This method will set the parent necessary properties for the layer to work
 * @returns {Layer}
 */
Layer.prototype.setProperties = function () {

    this.zOrder = this.parent.getZOrder();
    //The position of the new layer is relative to its parent and since it has
    // the same dimensions we start at 0 0
    this.x = 0;
    this.y = 0;
    //generates an id for the layer
    this.id = this.parent.getID() + "Layer-" + this.layerName;
    //this.width =  this.parent.getWidth();
    //this.height = this.parent.getHeight();
    this.setDimension(this.parent.getWidth(), this.parent.getHeight());
    this.canvas = this.parent.canvas;

    return this;
};
/**
 * Returns the layer name
 * @returns {String}
 */
Layer.prototype.getLayerName = function () {
    return this.layerName;
};
/**
 * Returns the layer main class
 * @returns {String}
 */
Layer.prototype.getBpmnClass = function () {
    return this.bpmnClass;
};
/**
 * Returns the element mapping class
 * @returns {String}
 */
Layer.prototype.getElementClass = function () {
    return this.elementClass;
};
/**
 * Returns the priority of the layer
 * @returns {Number}
 */
Layer.prototype.getPriority = function () {
    return this.priority;
};
/**
 * Returns if the layer is visible or not
 * @returns {Boolean}
 */
Layer.prototype.getVisible = function () {
    return this.visible;
};

/**
 * Sets the layer name
 * @param {String} newLayerName
 * @returns {Layer}
 */
Layer.prototype.setLayerName = function (newLayerName) {
    if (typeof newLayerName === "string" && newLayerName !== "") {
        this.layerName = newLayerName;
    }
    return this;
};
/**
 * Sets the main class of the layer
 * @param {String} newBpmnClass
 * @returns {Layer}
 */
Layer.prototype.setBpmnClass = function (newBpmnClass) {
    if (typeof newBpmnClass === "string" && newBpmnClass !== "") {
        this.bpmnClass = newBpmnClass;
    }
    return this;
};
/**
 * Sets the element mapping class of the layer
 * @param {String} newElementClass
 * @returns {Layer}
 */
Layer.prototype.setElementClass = function (newElementClass) {
    if (typeof newElementClass === "string" && newElementClass !== "") {
        this.elementClass = newElementClass;
        this.html.className = '';
        this.html.className = this.getBpmnClass() + ' ' + newElementClass;
    }
    return this;
};
/**
 * Sets the priority of the layer
 * @param {Number} newPriority
 * @returns {Layer}
 */
Layer.prototype.setPriority = function (newPriority) {
    if (typeof newPriority === "number") {
        this.priority = newPriority;
    }
    return this;
};
/**
 * Sets the visibility of the layer
 * @param {Boolean} visibility
 * @returns {Layer}
 */
Layer.prototype.setVisible = function (visibility) {
    if (typeof visibility === "boolean") {
        this.visible = visibility;
    }
    return this;
};

Layer.prototype.repaintMarkers = function () {
    var j;
    for (j = 0; j < this.markers.getSize(); j += 1) {
        this.markers.get(j).paint();
    }
    return this;
};
