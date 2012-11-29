/**
 * Created with JetBrains WebStorm.
 * User: mauricio
 * Date: 9/14/12
 * Time: 2:02 PM
 * To change this template use File | Settings | File Templates.
 */
//***************************************************************************
//****************************Start of Oval Class ***************************
//***************************************************************************

/**
 * Initializes and oval
 * @class A Regular Shape the properties and behaviors of an Oval
 * @augments RegularShape
 * @param {Point} center
 */

Oval = function (center) {
    RegularShape.call(this);
    /**
     * The center of the oval
     * @type Point
     */
    this.id = 'ovalID' + Math.random();
    this.center = (!center) ? null : center;
    //if (!this.graphic instanceof jsGraphics)
    //this.graphic = new     jsGraphics(this.id);
    this.graphic = null;
    this.visible = true;

};

Oval.prototype = new RegularShape();
Oval.prototype.type = "Oval";
/**
 * In charge of the painting / positioning of the figure on the DOM and setting
 * the styles
 * @returns {Oval}
 */
Oval.prototype.paint = function () {

    if (!this.visible) {
        this.html.style.display = "none";
    } else {
        this.html.style.display = "inline";
    }

    if (this.html) {
        //this.html.style.backgroundColor = this.color.getCSS();
        this.setOpacity(8);
        //this.setColor('red');

        //this.setPosition(this.center.x,this.center.y);
        this.graphic = new jsGraphics(this.id);
        this.graphic.setColor("red"); // green
        //this.setColor('#00ff00');
        this.graphic.fillOval(0, 0, this.getWidth(), this.getHeight());
        this.graphic.paint();   
        //this.attachListeners(this);
    }
    return this;
};
/**
 * Set opacity to div to contain de oval figure
 * @returns {Oval}
 */
Oval.prototype.setOpacity = function (value) {
    this.html.style.opacity = value / 10;
    return this;
};

/**
 * Set color to fill oval figure;
 * @returns {Oval}
 */
//Oval.prototype.setColor= function(color){
//    console.log(color);
//    this.graphic.setColor(color);
//    return this;
//};
/**
 * Creates the HTML representation of the Oval
 * @returns {Oval}
 */
Oval.prototype.createHTML = function () {

    Shape.prototype.createHTML.call(this);
//  this.html.style.backgroundColor = this.color.getCSS();
    return this.html;
    //return this;
};
/**
 * Returns the center of the oval
 * @returns {Point}
 */
Oval.prototype.getCenter = function () {
    return this.center;
};
/**
 * Sets the center of the oval
 * @returns {Oval}
 * @param {Point} newCenter
 */
Oval.prototype.setCenter = function (newCenter) {
    this.center = newCenter;
    return this;
};

/**
 * Show a Oval
 * @returns {Oval}
 */
Oval.prototype.showOval = function () {
    if (!this.visible) {
        this.visible = true;
    }
    this.paint();
    return this;
};

/**
 * Hide a Oval
 * @returns {Oval}
 */
Oval.prototype.hideOval = function () {
    if (this.visible) {
        this.visible = false;
    }
    this.paint();

    return this;
};

//Oval.prototype.attachListeners = function(Oval){
//
//    var portDragOptions = {
//
//    };
//    $(Oval.html).draggable(portDragOptions);
//    return Oval;
//};

//***************************************************************************
//****************************End Of Class **********************************
//***************************************************************************
