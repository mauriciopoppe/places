/**
 * Created with JetBrains WebStorm.
 * User: mauricio
 * Date: 9/26/12
 * Time: 9:29 AM
 * To change this template use File | Settings | File Templates.
 */
//***************************************************************************
//****************************Start of Arc Class ***************************
//***************************************************************************

/**
 * Initializes and arc
 * @class A Regular Shape the properties and behaviors of an Arc
 * @augments RegularShape
 * @param {Point} center
 */

Arc = function (center, radius, startAngle, endAngle) {
    RegularShape.call(this);
    /**
     * ID of the arc
     * @type {String}
     */
    this.id = 'arcID' + Math.random();
    /**
     * The center of the arc
     * @type Point
     */
    this.center = (!center) ? null : center;
    //if (!this.graphic instanceof jsGraphics)
    //this.graphic = new     jsGraphics(this.id);
    this.graphic = null;
    /**
     * Visibility of this arc
     * @type {Boolean}
     */
    this.visible = true;
    /**
     * The angle calculation is as follows
     * - TOP 270
     * - RIGHT 0
     * - BOTTOM 90
     * - LEFT 180
     * And since the canvas is flipped in the y-axis
     * we start drawing from the endAngle towards the start angle
     * therefore to draw an arc from 0 deg to 90 deg
     * Arc(cx, cy, radius, 270, 0)
     */

    /**
     * Start angle of this arc
     * @type {Number}
     */
    this.startAngle = (!startAngle) ? 270 : startAngle;
    /**
     * End angle of this arc
     * @type {Number}
     */
    this.endAngle = (!endAngle) ? 90 : endAngle;
    /**
     * Radius of the arc
     * @type {Number}
     */
    this.radius = (!radius) ? Shape.prototype.DEFAULT_RADIUS : radius;
};

Arc.prototype = new RegularShape();
Arc.prototype.type = "Arc";
/**
 * In charge of the painting / positioning of the figure on the DOM and setting
 * the styles
 * @returns {Arc}
 */
Arc.prototype.paint = function () {

    if (!this.visible) {
        this.html.style.display = "none";
    } else {
        this.html.style.display = "inline";
    }

    if (this.html) {
        //this.setPosition(this.center.x,this.center.y);
        this.graphic = new jsGraphics(this.id);
        this.graphic.setColor("black");
        this.graphic.drawArc(this.center.x, this.center.y, this.radius,
            this.startAngle, this.endAngle);
        this.graphic.paint();
        //this.attachListeners(this);
    }
    return this;
};
/**
 * Set opacity to div to contain de oval figure
 * @returns {Arc}
 */
Arc.prototype.setOpacity = function (value) {
    this.html.style.opacity = value / 10;
    return this;
};

/**
 * Creates the HTML representation of the Arc
 * @returns {Arc}
 */
Arc.prototype.createHTML = function () {

    Shape.prototype.createHTML.call(this);
    return this.html;
};

/**
 * Returns the center of the oval
 * @returns {Point}
 */
Arc.prototype.getCenter = function () {
    return this.center;
};

/**
 * Sets the center of the oval
 * @returns {Arc}
 * @param {Point} newCenter
 */

Arc.prototype.setCenter = function (newCenter) {
    this.center = newCenter;
    return this;
};

/**
 * Show a Arc
 * @returns {Arc}
 */
Arc.prototype.showArc = function () {
    if (!this.visible) {
        this.visible = true;
    }
    this.paint();
    return this;
};

/**
 * Hide a Arc
 * @returns {Arc}
 */
Arc.prototype.hideArc = function () {
    if (this.visible) {
        this.visible = false;
    }
    this.paint();
    return this;
};

//***************************************************************************
//****************************End Of Class **********************************
//***************************************************************************
