/**
 * Initializes the label properties
 * @class A class that holds functions related to labels in the framework
 * @augments Shape
 * @param {String} msg
 * @param {Number} fsize
 * @param {String} fstyle
 *
 */
var Text = function (parent, msg) {
    this.id = UniqueID.create();
    /**
     * The message to be displayed
     * @type String
     */
    this.message = (!msg) ? "" : msg;
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

    this.parent = parent;

    this.html = null;
//    if(!this.html)
//        this.createHTML();
};

//Text.prototype = new Shape();
Text.prototype.type = "Text";

/**
 * Creates the HTML Representation of the Label
 * @returns {Label}
 */
Text.prototype.createHTML = function () {
    this.html = document.createElement('input');
    this.html.id = this.id;
    this.html.type = "text";
    this.html.className = "input-small";
    this.html.style.display = "none";
    this.html.style.left   = "0px";
    this.html.style.top    = "0px";
    this.html.style.zIndex = this.zOrder;
    this.html.style.height = "10px";
    this.html.value = this.message;
    this.attachListeners();
    return this.html;
};

//getters

/**
 * Returns the label message
 * @returns {String}
 */
Text.prototype.getMessage = function () {
    return this.message;
};

/**
 * Returns the label Color
 * @returns {Color}
 */
Text.prototype.getColor = function () {
    return this.color;
};

/**
 * Returns the label background color
 * @returns {Color}
 */
Text.prototype.getBackgroundColor = function () {
    return this.backgroundColor;
};

Text.prototype.getHTML = function () {
    if (this.html === null) {
        this.createHTML();
    }
    return this.html;
};
// Setters
/**
 * Sets the label message
 * @returns {Label}
 * @param {String} newMessage
 */
Text.prototype.setMessage = function (newMessage) {
    this.message = newMessage;
    if (this.html !== null) {
        this.html.value = newMessage;
    }
    return this;
};

/**
 * Sets the label Color
 * @returns {Label}
 * @param {Color} newColor
 */
Text.prototype.setColor = function (newColor) {
    this.color = newColor;
    return this;
};

/**
 * Sets the label background color
 * @returns {Label}
 * @param {Color} newBackgroundColor
 */
Text.prototype.setBackgroundColor = function (newBackgroundColor) {
    this.backgroundColor = newBackgroundColor;
    return this;
};

//Text.prototype.setPosition = function(x,y){
//    if(typeof x == "number" && typeof y == "number"){
//      if(this.html){
//          this.html.style.left = x + "px";
//          this.html.style.top = y + "px";
//        }
//  }
//    return this;
//}
//
//Text.prototype.setDimention = function (w,h){
//    if(typeof w == "number" && typeof h == "number"){
//      if(this.html){
//            this.width = w;
//            this.height = h;
//          this.html.style.width = w + "px";
//            this.html.style.height = h + "px";
//        }
//  }
//    return this;
//}

Text.prototype.hide = function () {
    this.html.style.display = "none";
    return this;
};

Text.prototype.show = function () {
    this.html.style.display = "block";
    $(this.html).focus();
    return this;
};

Text.prototype.attachListeners = function () {
//    console.log(this);
    $(this.html).focusout(this.lostFocus(this));
    $(this.html).keydown(this.keyDown(this));
    $(this.html).keypress(this.keyPress(this));
    $(this.html).keyup(this.keyUp(this));
};

Text.prototype.lostFocus = function (self) {
    return function (e, ui) {
        var outerDiv = self.parent.parent;

        self.hide();
        self.parent.label.style.display = 'block';
        if (self.html.value !== '') {
            self.parent.setMessage(self.html.value);
            self.parent.paint(self.parent.parent);
        }

        // TODO: fix outerDiv height and width

//        outerDiv.updateResizeListener(outerDiv);

//
//        _self.parent.label.innerHTML = _self.html.value;
//        var nL = Math.round((_self.html.value.length * 8) /
//        parseInt(_self.parent.width,10));
//
//        var newHeight = nL * _self.parent.height;
//
//        if (newHeight > _self.parent.height)
//            _self.parent.height = newHeight;
//
//        if (newHeight > parseInt(_self.parent.parent.height,10)){
//            _self.parent.parent.setDimension(_self.parent.parent.width,
//              newHeight + 10);
//            _self.parent.parent.html.style.height = newHeight +
//              10 + "px";
//            _self.parent.parent.paint();
//        }
//        _self.parent.paint(_self.parent.parent);
        //setPosition
//        if (nL > 1)
//            _self.parent.setPosition(0,
//          Math.round(_self.parent.parent.height/2)-Math.round(newHeight/2));
    };

};

Text.prototype.keyPress = function (self) {
    return function (e) {
        if (e.which === 13) {
            $(self.html).focusout();
        }
    };
};
Text.prototype.keyDown = function (self) {
    return function (e) {
    };
};
Text.prototype.keyUp = function (self) {
    return function (e) {
        return false;
    };
};
