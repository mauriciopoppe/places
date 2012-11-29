/**
 * Created with JetBrains WebStorm.
 * User: mauricio
 * Date: 9/26/12
 * Time: 12:43 PM
 * To change this template use File | Settings | File Templates.
 */
//***************************************************************************
//****************************Start of Intersection Class *******************
//***************************************************************************

/**
 * Initializes the intersection
 * @augments RegularShape
 * @param {Point} center
 * @param {Segment} idOtherConnection
 * @param {Segment} parent
 */

Intersection = function (center, idOtherConnection, parent) {
    //RegularShape.call(this);
    /**
     * ID of the arc
     * @type {String}
     */
    this.id = 'intersectionID' + Math.random();
    /**
     * The center of the arc
     * @type Point
     */
    this.center = (!center) ? null : center;
    /**
     * Visibility of this arc
     * @type {Boolean}
     */
    this.visible = true;
    /**
     * Parent of this intersection is a segment
     * @type {Segment}
     */
    this.parent = parent;
    /**
     * Id of the other connection
     * @type {String}
     */
    this.idOtherConnection = idOtherConnection;
};

Intersection.prototype = new Arc(null);
Intersection.prototype.type = "Intersection";

/**
 * In charge of the painting / positioning of the figure on the DOM and setting
 * the styles
 * @returns {Intersection}
 */
Intersection.prototype.paint = function () {
    // console.log(this.parent.orientation);
    if (this.parent.orientation === this.VERTICAL) {
        this.startAngle = 270;
        this.endAngle = 90;
    } else {
        this.startAngle = 180;
        this.endAngle = 0;
    }
    Arc.prototype.paint.call(this);

    if (!this.visible) {
        this.html.style.display = "none";
    } else {
        this.html.style.display = "inline";
    }

    return this;
};
/**
 * Set opacity to div to contain de oval figure
 * @returns {Intersection}
 */
Intersection.prototype.setOpacity = function (value) {
    this.html.style.opacity = value / 10;
    return this;
};

/**
 * Destroys the intersection
 */
Intersection.prototype.destroy = function () {
    $(this.html).remove();
};

/**
 * Creates the HTML representation of the Intersection
 * @returns {Intersection}
 */
Intersection.prototype.createHTML = function () {
    Shape.prototype.createHTML.call(this);
    return this.html;
};

/**
 * Returns the center of the oval
 * @returns {Point}
 */
Intersection.prototype.getCenter = function () {
    return this.center;
};

/**
 * Sets the center of the oval
 * @returns {Intersection}
 * @param {Point} newCenter
 */

Intersection.prototype.setCenter = function (newCenter) {
    this.center = newCenter;
    return this;
};

/**
 * Show a Intersection
 * @returns {Intersection}
 */
Intersection.prototype.showIntersection = function () {
    if (!this.visible) {
        this.visible = true;
    }
    this.paint();
    return this;
};

/**
 * Hide a Intersection
 * @returns {Intersection}
 */
Intersection.prototype.hideIntersection = function () {
    if (this.visible) {
        this.visible = false;
    }
    this.paint();
    return this;
};

//***************************************************************************
//****************************End Of Class **********************************
//***************************************************************************
