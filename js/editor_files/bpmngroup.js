
/**
 * Represents a BPMN Group Object
 * @class Defines a BPMNGroup
 * @constructor
 * @param {Number} ResizeHandlerNumber of resize handlers associated to this shape
 */
var BPMNGroup = function (ResizeHandlerNumber) {
    var xDimension,
        yDimension,
        elementClass,
        i;

    BPMNGroupElement.call(this, ResizeHandlerNumber);

    this.limits = [5, 5, 5, 5, 5];
    //dimensions according to the zoom scale
    xDimension = [14, 20, 300, 32, 37];
    yDimension = [15, 24, 100, 40, 47];


    //this variable holds the class that will be applied to the element
    elementClass = "group";

    for (i = 0; i < this.zoomScales; i += 1) {
        //construct the element properties that are used according to the zoom scale
        this.elementProperties.push(new ShapeZoomProperty(xDimension[i],
            yDimension[i]));
    }
    //insert the corresponding layer to the element
    this.layers.insert(new Layer(this, "main data object layer", elementClass,
        0, "", true));

};
BPMNGroup.prototype = new BPMNGroupElement();
BPMNGroup.prototype.type = "bpmnGroup";
/**
 * This method will paint thi figure
 * @returns BPMNGroup
 */
BPMNGroup.prototype.paint = function () {

    this.html.style.border = "1px solid black";
    this.html.style.borderStyle = "dashed";
    //this.setBackground('white');

    return this;

};

BPMNGroup.prototype.repaint = function () {
    this.paint();
};


/**
 * Function in charge to attach particular listeners for events related to the BPMNGroup Element
 * @param bpmnGroup
 * @return {*}
 */
BPMNGroup.prototype.attachListeners = function (bpmnGroup) {
    BPMNShape.prototype.attachListeners.call(this, bpmnGroup);
    return this;
};

BPMNGroup.prototype.onDrop = function (bpmnGroup) {
    return function (e, ui) {
        return false;
    };
};
