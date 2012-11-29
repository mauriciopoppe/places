/**
 * Represents a BPMN Participant Object
 * @class Defines a BPMNParticipant
 * @constructor
 * @param {Number} ResizeHandlerNumber of resize handlers associated to this
 * shape
 */
var BPMNParticipant = function (ResizeHandlerNumber) {
    var xDimension,
        yDimension,
        elementClass,
        i,
        lay;
    BPMNGroupElement.call(this, ResizeHandlerNumber);

    this.limits = [5, 5, 5, 5, 5];
    //dimensions according to the zoom scale
    xDimension = [14, 20, 300, 32, 37];
    yDimension = [15, 24, 100, 40, 47];


    //this variable holds the class that will be applied to the element
    elementClass = "participant";

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
    this.label.setMessage('Participant # 1');
    this.label.setPos(7);
    this.label.setOrientation('vertical');
};
BPMNParticipant.prototype = new BPMNGroupElement();
BPMNParticipant.prototype.type = "bpmnParticipant";
/**
 * This method will paint thi figure
 * @returns BPMNParticipant
 */
BPMNParticipant.prototype.paint = function () {
    this.setBackground('white');
    if (this.graphic === null) {
        this.graphic = new jsGraphics(this.id);
    }
    this.graphic.clear();
    this.graphic.setColor(participantColor);
    this.graphic.drawRect(0, 0, this.width, this.height);
    this.graphic.drawLine(this.applyZoom(45), 0, this.applyZoom(45),
        this.height);
    this.graphic.paint();
    if (this.label.getMessage() !== '') {
        this.label.paint(this);
    }

    return this;
};

BPMNParticipant.prototype.repaint = function (newZoom) {

    this.setPosition(this.x, this.y);
    this.setDimension(this.width, this.height);
    //this.createHTML(true);
    this.paint();
};

BPMNParticipant.prototype.attachListeners = function (participant) {
    BPMNShape.prototype.attachListeners.call(this, participant);
};
