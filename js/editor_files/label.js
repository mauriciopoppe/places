/**
 * Initializes the label properties
 * @class A class that holds functions related to labels in the framework
 * @augments Shape
 * @param {String} msg
 * @param {Number} fsize
 * @param {String} fstyle
 *
 */
var Label = function (parent, message, incontainer) {
    Shape.call(this);

    /**
     * Text color
     * @type Color
     */
    this.color = new Color();
    /**
     * Background Color
     * @type Color
     */
    this.backgroundColor = new Color(255, 255, 255);
    /**
     * Array of Font Familys
     * @type {Array}
     */
    this.fontFamilys = ['Arial, Helvetica, sans-serif',
                       'Verdana, Geneva, sans-serif',
                       'Tahoma, Geneva, sans-serif'];

    this.fontFamily = 0;
    /**
     * Font Size
     * @type Number
     */
    this.fontSize = 10;
    /**
     * Font Style
     * @type String
     */
    this.fontStyle = 'normal';
    /**
     * Font Weight
     * @type {String}
     */
    this.fontWeight = 'normal';

    this.parent = parent;

    this.html = null;

    this.width = 90;

    this.height = 20;

    this.verticalwidth = 20;

    this.verticalheight = 90;

    this.left = null;

    this.top = null;

    this.container = false;

    this.inContainer = (typeof incontainer !== 'undefined'
                        && incontainer !== null) ? incontainer : true;

    this.orientation = 'horizontal';
    /**
     * Array of Position to Label Insert
     * @type {Array}
     * @example
     *      (9)             (10)          (11)
     *     ----------------------------------
     * (20)|(0)            (1)           (2)|(12)
     *     |                                |
     *     |                                |
     * (19)|(7)            (8)           (3)|(13)
     *     |                                |
     *     |                                |
     * (18)|(6)            (5)           (4)|(14)
     *     ----------------------------------
     *     (17)           (16)          (15)
     */
    this.positions = [['left top', 'left top'],
                      ['center top', 'center top'],
                      ['right top', 'right top'],
                      ['right center', 'right center'],
                      ['right bottom', 'right bottom'],
                      ['center bottom', 'center bottom'],
                      ['left bottom', 'left bottom'],
                      ['left center', 'left center'],
                      ['center center', 'center center'],
                      ['left bottom', 'left top'],
                      ['center bottom', 'center top'],
                      ['right bottom', 'right top'],
                      ['left top', 'right top'],
                      ['left center', 'right center'],
                      ['left bottom', 'right bottom'],
                      ['right top', 'right bottom'],
                      ['center top', 'center bottom'],
                      ['left top', 'left bottom'],
                      ['right bottom', 'left bottom'],
                      ['right center', 'left center'],
                      ['right top', 'left top']];

    this.textAligns = ['left', 'center', 'right', 'right', 'right',
                       'center', 'left', 'left', 'center', 'left',
                       'center', 'right', 'left', 'left', 'left',
                       'right', 'center', 'left', 'right', 'right',
                       'right'];

    this.textAlign = 'center';

    this.position = null;

    this.automaticResize = false;

    this.label = null; //document.createElement('span');

    this.message = (!message) ? '' : message;

    this.text =  new Text(this, message);


};

Label.prototype = new Shape();
Label.prototype.type = "Label";


/**
 * Creates the HTML Representation of the Label
 * @returns {Label}
 */
Label.prototype.createHTML = function () {
    Shape.prototype.createHTML.call(this);
//    this.html = document.createElement('div');
//    this.html.id = this.id;
//    this.html.style.height = this.height + "px";
//    this.html.style.width = this.width + "px";
    this.html.style.display = 'block';
    this.html.style.textAlign = this.textAlign;
    this.html.style.position = "absolute";
    this.html.style.fontFamily = this.fontFamilys[this.fontFamily];
    this.html.style.fontSize = this.fontSize + "pt";
    this.html.style.fontStyle = this.fontStyle;
//    this.html.style.border = '1px solid #000000';
    //Create a span element
    this.label = document.createElement('span');
    this.label.style.width = this.width + 'px';
    this.html.appendChild(this.label);
    this.html.appendChild(this.text.getHTML());
    this.parent.html.appendChild(this.html);

    if (!this.inContainer) {
        //TODO: Add resize handlers
    }
    this.attachListeners();
    return this.html;
};

Label.prototype.paint = function (parent) {
    var sizeText, maxSize, nLines;

    //if html null create element div
    if (this.html === null) {
        this.createHTML();
    }

    //inner message into span element
    this.label.innerHTML = this.getMessage();
    //Get Size of text message
    sizeText = Math.round(this.getMessage().length * this.fontSize * 0.65);

    //Change dimentions DIV if otientation is vertical
    if (this.orientation === 'vertical') {
        this.setWidth(this.verticalwidth);
        this.setHeight(this.verticalheight);
    }

    //Get max width refer parent
    if (this.orientation === 'vertical') {
        maxSize = this.parent.getHeight() -
            (Math.round(this.parent.getHeight() * 0.08));
    } else {
        maxSize = this.parent.getWidth() -
            (Math.round(this.parent.getWidth() * 0.08));
    }

    //If automatic Resize is true change width os div
    if (this.automaticResize) {
//        if ((sizeText > maxSize) && (this.getWidth() < maxSize)) {
        if (this.orientation === 'vertical') {
            if (sizeText > this.getHeight()) {
//                console.log('change height');
                this.setHeight(maxSize);
            } else if (this.getHeight() > maxSize) {
                this.setHeight(maxSize);
            }
        } else {
            if (sizeText > this.getWidth()) {
//                console.log('change width');
                this.setWidth(maxSize);
            } else if (this.getWidth() > maxSize) {
                this.setWidth(maxSize);
            }
        }
//        }
    }

    //Calculate height depending on the text size
    if (this.orientation === 'vertical') {
        nLines =  Math.round(this.getMessage().length *
            this.fontSize * 0.8 / this.getHeight());
        nLines = (nLines === 0) ? 1 : nLines;
        this.setWidth(nLines * 20);
//        console.log(
//            'Size Text: ' + sizeText +
//                ', Max Size:' + maxSize +
//                ', This Height:' + this.getHeight() +
//                ', Parent Height:' + this.parent.getHeight() +
//                ', Nº Lines: ' + nLines
//        );
    } else {
        nLines =  Math.round(this.getMessage().length *
            this.fontSize * 0.8 / this.getWidth());
        nLines = (nLines === 0) ? 1 : nLines;
        this.setHeight(nLines * 20);
//        console.log(
//            'Size Text: ' + sizeText +
//                ', Max Size:' + maxSize +
//                ', This Width:' + this.getWidth() +
//                ', Parent Width:' + this.parent.getWidth() +
//                ', Nº Lines: ' + nLines
//        );
    }

    //If Label into container ej. label, activity, poll, etc.
    if (this.inContainer) {
        //If Position variable is null assign default center center
        if (this.position === null) {
            this.position = 8;
        }

        //Positioning DIV Label respect BPMNShape using jquerui.positioning
        $(this.html).position({
            of: $(this.parent.html),
            my: this.positions[this.position][0],
            at: this.positions[this.position][1],
            offset : (this.orientation === 'vertical') ? '7 0' : ''
        });

        this.html.style.textAlign = this.textAligns[this.position];
        //If orientation is vertical apply class to span
        if (this.orientation === 'vertical') {
            //apply class rotate
            this.label.className = '';
            this.label.className = 'rotateText';
            //Positioning SPAN in DIV
            $(this.label).position({
                of: $(this.html),
                my: this.positions[0][0],
                at: this.positions[0][1]
            });
//        console.log(this.getMessage().length * this.fontSize * 0.60);
        }
    }
};
/**
 * Returns the label message
 * @returns {String}
 */
Label.prototype.getMessage = function () {
    return this.message;
};
/**
 * Returns the label font size
 * @returns {Number}
 */
Label.prototype.getFontSize = function () {
    return this.fontSize;
};
/**
 * Returns the label font style
 * @returns {String}
 */
Label.prototype.getFontStyle = function () {
    return this.fontStyle;
};
/**
 * Returns the label Color
 * @returns {Color}
 */
Label.prototype.getColor = function () {
    return this.color;
};
/**
 * Returns the label background color
 * @returns {Color}
 */
Label.prototype.getBackgroundColor = function () {
    return this.backgroundColor;
};
/**
 * Get Orientation
 * @return {String}
 */
Label.prototype.getOrientation = function () {
    return this.orientation;
};
/**
 * Get width
 * @return {*}
 */
Label.prototype.getWidth = function () {
    return this.width;
};
Label.prototype.getHTML = function () {
    if (this.html === null) {
        return this.createHTML(false);
    }
    return this.html;
}
// Setters
/**
 * Sets the label message
 * @returns {Label}
 * @param {String} newMessage
 */
Label.prototype.setMessage = function (newMessage) {
    this.message = newMessage;
    return this;
};
/**
 * Sets the label font size
 * @returns {Label}
 * @param {Number} newFontSize
 */
Label.prototype.setFontSize = function (newFontSize) {
    if (newFontSize !== null && typeof newFontSize === 'number') {
        this.fontSize = newFontSize;
        if (this.html) {
            this.html.style.fontSize = newFontSize + 'pt';
        }
    }
    return this;
};
/**
 * Sets the label font style
 * @returns {Label}
 * @param {String} newFontStyle
 */
Label.prototype.setFontStyle = function (newFontStyle) {
    if (newFontStyle !== null && newFontStyle !== '') {
        this.fontStyle = newFontStyle;
        if (this.html) {
            this.html.style.fontStyle = newFontStyle;
        }
    }
    return this;
};
/**
 * Sets the label Color
 * @returns {Label}
 * @param {Color} newColor
 */
Label.prototype.setColor = function (newColor) {
    this.color = newColor;
    return this;
};
/**
 * Sets the label background color
 * @returns {Label}
 * @param {Color} newBackgroundColor
 */
Label.prototype.setBackgroundColor = function (newBackgroundColor) {
    this.backgroundColor = newBackgroundColor;
    return this;
};

Label.prototype.setOrientation = function (newOrientation) {
    this.orientation = newOrientation;
    return this;
};

Label.prototype.setPos = function (newPos) {
    if (typeof newPos === "number") {
        this.position = newPos;
    }
    return this;
};
Label.prototype.setWidth = function (newWidth) {
    if (typeof newWidth === "number") {
        Shape.prototype.setWidth.call(this, newWidth);
        if (this.label && this.orientation !== 'vertical') {
            this.label.style.width = newWidth + 'px';
        }
    }
    return this;
};
Label.prototype.setHeight = function (newHeight) {
    if (typeof newHeight === "number") {
        Shape.prototype.setHeight.call(this, newHeight);
        if (this.label && this.orientation === 'vertical') {
            this.label.style.width = newHeight + 'px';
        }
    }
    return this;
};
Label.prototype.setCanvas = function (newParent) {
    if (newParent) {
        this.parent = newParent;
    }
    return this;
};
Label.prototype.setAutomaticResize = function (newAutomaticResize) {
    if (newAutomaticResize !== null && typeof newAutomaticResize === 'boolean') {
        this.automaticResize = newAutomaticResize;
    }
    return this;
};

Label.prototype.attachListeners = function () {
    //defining handles object
    var handlesObject = {},
        i,
        shapeResizeOptions;
    $_Label = $(this.html);
    if (!this.inContainer) {
        $_Label.draggable({
            cursor: "move"
        });
        //TODO: add behaivor to resize
//        $(this.html).resizable();
    }
    $_Label.dblclick(this.onDblClick(this));
};

Label.prototype.onDblClick = function (parent) {
    return function (e, ui) {
        parent.text.setMessage(parent.getMessage());
        parent.text.show();
        parent.label.style.display = "none";
    };
};

Label.prototype.isContainer = function () {
    return this.container;
};
