/**
 * Created with JetBrains WebStorm.
 * User: mauricio
 * Date: 9/14/12
 * Time: 2:04 PM
 * To change this template use File | Settings | File Templates.
 */
//***************************************************************************
//****************************Start of ResizeHandler Class ********************
//***************************************************************************

/**
 * Initializes a Resize Point for handling resize operations
 * @class Contains the behaviors of particular rectangular shapes designed for
 * resizing a figure it also handle events related to resize operations and
 * this rectangles
 * @augments Rectangle
 * @param {Object} parent
 * @param {String} category
 */

ResizeHandler = function (parent, orientation) {

    if (!parent || !orientation) {
        return undefined;
    }

    this.orientation = orientation;

    this.id = orientation + parent.id + "resizehandler";
    /**
     * Type of resize handler to use regarding style
     * @type String
     */
    this.category = "non-resizable";
    /**
     * Denotes whether the resize point is visible or not
     * @type Boolean
     */
    this.visible = false;
    /**
     * Fixed ResizeHandler width
     * @type Number
     */
    this.width = 4;
    /**
     * Fixed ResizeHandler height
     * @type Number
     */
    this.height = 4;

    //According to the category we determine the background-color that the
    // handler will have, either green or white
    /**
     * Shape whom the resize point belongs to
     * @type Object
     */
    this.parent = parent;


    if (this.category  === "resizable") {
        this.color = new Color(0, 255, 0);
    } else {
        this.color = new Color(255, 255, 255);
    }
};

ResizeHandler.prototype = new Rectangle();
ResizeHandler.prototype.type = "ResizeHandler";

ResizeHandler.prototype.paint = function () {
    if (!this.html) {
        return this;
    }
    Rectangle.prototype.paint.call(this);

    this.html.style.border = "thin black solid";
    if (!this.visible) {
        this.html.style.display = "none";
    } else {
        this.html.style.display = "inline";
    }

};

/**
 * Returns whether the ResizeHandler is visible or not
 * @returns {Boolean}
 */
ResizeHandler.prototype.isVisible = function () {
    return this.visible;
};
/**
 * Returns the category of the Resize Point (resizable or non-resizable)
 * @returns {String}
 */
ResizeHandler.prototype.getCategory = function () {
    return this.category;
};
/**
 * Sets the visibility of the resize point
 * @param {Boolean} isVisible
 * @returns {ResizeHandler}
 */
ResizeHandler.prototype.setVisible = function (isVisible) {
    if (typeof isVisible === "boolean") {
        this.visible = isVisible;
    }
    this.paint();
    return this;

};
/**
 * Sets the category of the port
 * @param newCategory
 * @returns {ResizeHandler}
 */
ResizeHandler.prototype.setCategory = function (newCategory) {
    if (typeof newCategory === "string") {
        this.category = newCategory;
    }
    if (this.category === "resizable") {
        this.color = new Color(0, 255, 0);
        this.html.className = "ui-resizable-handle ui-resizable-" +
            this.orientation;
    } else {
        this.color = new Color(255, 255, 255);
        this.html.className = "";
    }
    this.paint();
    return this;
};

//***************************************************************************
//****************************End Of Class **********************************
//***************************************************************************
