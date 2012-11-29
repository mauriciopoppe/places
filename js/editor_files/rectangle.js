/**
 * Created with JetBrains WebStorm.
 * User: mauricio
 * Date: 9/14/12
 * Time: 2:03 PM
 * To change this template use File | Settings | File Templates.
 */
//***************************************************************************
//****************************Start of Rectangle Class **********************
//***************************************************************************

/**
 * Initializes a rectangle shape
 * @class This class contains all the common behaviors and properties for a rectangle shape in this framework
 * @augments RegularShape
 */

Rectangle = function () {

    RegularShape.call(this);

};

Rectangle.prototype = new RegularShape();
Rectangle.prototype.type = "Rectangle";

/**
 * In charge of the painting and setting the styles
 * @returns {Rectangle}
 */
Rectangle.prototype.paint = function () {
    if (this.html) {
        this.html.style.backgroundColor = this.color.getCSS();
    }
    return this;
};
/**
 * Creates the HTML representation of the Rectangle
 * @returns {Object}
 */
Rectangle.prototype.createHTML = function () {
    Shape.prototype.createHTML.call(this);
//    this.html.style.backgroundColor = this.color.getCSS();
    return this.html;
};

//***************************************************************************
//****************************End Of Class **********************************
//***************************************************************************
