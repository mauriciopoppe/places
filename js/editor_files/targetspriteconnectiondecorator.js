/**
 * Initializes a TargetSpriteDecorator with its type or a default type
 * @class Represents a decorator target for a connection in the end of it
 * @augments JCoreObject
 * @param {int} lenght
 * @param {int} width
 */
var TargetSpriteConnectionDecorator = function (conn, type) {
    /**
     * This parameter is a connection object
     * @type object connection
     * @default connection
     */
    this.parent = conn;
    /**
     * This parameter is a type of target decorator
     * @type string ej. 'message', 'Conditional', 'Association'
     * @default type decorator
     */
    this.decoratorType = (!type) ? 'normal' : type;
    /**
     * This parameter is an array to see if the end point
     * is UP, RIGHT, BOTTOM and LEFT
     * @type array
     * @default {'0':'up', '1':'right', '2':'bottom', '3':'left'}
     */
    this.spriteDirection = {'0' : 'up', '1' : 'right',
        '2' : 'bottom', '3' : 'left'};

    this.height = 11;

    this.width = 11;

    ConnectionDecorator.call(this);

    return this;
};

TargetSpriteConnectionDecorator.prototype = new ConnectionDecorator();
TargetSpriteConnectionDecorator.prototype.type = "ConnectionDecorator";

/**
 * In charge of the painting / positioning of the figure on the
 * DOM and setting the styles
 * @returns {ConnectionDecorator}
 */
TargetSpriteConnectionDecorator.prototype.paint = function (point, direction) {
//    var f;
    if (this.getHTML() === null) {
        this.createHTML();
    }
    if (this.decoratorType === null) {
        this.decoratorType = 'normal';
    }
    this.html.className = "";
    this.html.className = "bpmn_zoom con_100_target_" + this.decoratorType +
        '_' + this.spriteDirection[direction];
//    f = ((direction % 2 === 0) ? ((direction === 0) ? 2 : direction % 2) : direction % 2);
//    this.html.style.top = (point.y - Math.round(parseInt(this.html.style.height, 10) * (f / 2)) + ((f === 0) ? 0 : 1)) + 'px';
//
//    f = ((direction === 1) ? direction : (direction % 2) + 1);
//    this.html.style.left = (point.x - Math.round(parseInt(this.html.style.width, 10) * (f / 2)) + ((f === 0) ? 0 : 1)) + 'px';
    switch (direction) {
        case 0:
            this.html.style.top = (point.y - this.height) + "px";
            this.html.style.left = (point.x - Math.round(this.width / 2) + 1) + "px";
            break;
        case 1:
            this.html.style.top = (point.y - Math.round(this.height / 2)) + "px";
            this.html.style.left = (point.x) + "px";
            break;
        case 2:
            this.html.style.top = (point.y) + "px";
            this.html.style.left = (point.x - Math.round(this.width / 2) + 1) + "px";
            break;
        case 3:
            this.html.style.top = (point.y - Math.round(this.height / 2)) + "px";
            this.html.style.left = (point.x - this.width) + "px";
            break;
    }

    this.parent.html.appendChild(this.html);

    this.attachListeners();

    return this;
};
/**
 * Creates the HTML Representation of the TargetSpriteConnectionDecorator
 * @returns {ConnectionDecorator.html}
 */
TargetSpriteConnectionDecorator.prototype.createHTML = function () {
    this.html = document.createElement('div');
    this.html.id = this.id;
    this.html.style.position = "absolute";
    this.html.style.left = "0px";
    this.html.style.top = "0px";
    this.html.style.height = this.height + "px";
    this.html.style.width = this.width + "px";
    this.html.style.zIndex = "2";
    return this.html;
};
/**
 * Returns the HTML Representation of the decorator
 * @returns {String}
 */
TargetSpriteConnectionDecorator.prototype.getHTML = function () {
    if (this.html === null) {
        this.createHTML();
    }
    return this.html;
};
/**
 * Set attachListener
 */
TargetSpriteConnectionDecorator.prototype.attachListeners = function () {
    var $connectionDecorator;
    $connectionDecorator = $(this.html).click(this.onClick(this.parent));
    $connectionDecorator.on("contextmenu", function (e) {
        e.preventDefault();
    });
    $connectionDecorator.on("mousedown", this.onMouseDown(this));

};


TargetSpriteConnectionDecorator.prototype.onMouseDown = function (decorator) {
    return function (e, ui) {
        e.preventDefault();
        if (e.which === 3) {
            decorator.parent.canvas.updatedElement = decorator.parent;
            $(decorator.parent.canvas.html).trigger("rightclick");
        }
        e.stopPropagation();
    };
};
    /**
     * Add Method click to TargetSpriteConnectionDecorator
     * @param {object} conn Connection Object
     * @return {Function}
     */
TargetSpriteConnectionDecorator.prototype.onClick = function (conn) {
        return function (e, ui) {
            var sourceShape,
                destShape,
                maxZIndex,
                dx,
                dy,
                towardsCenterDistance,
                prevConnection = conn.canvas.previousConnection;
            //console.log(prevConnection);
            hideSelectedPorts(conn.canvas);
            showSelectedHandlers(conn.canvas);
            hidePreviousConnection(conn.canvas);
            conn.showMoveHandlers();
            //console.log(prevConnection);

            // todo set the zIndex equal to conn.sourcePort.parent + 3
            // todo add variable defaultZIndex
            conn.sourcePort.parent.setZOrder(4);
            conn.endPort.parent.setZOrder(4);
            /*sourceShape = conn.sourcePort.parent;
             destShape = conn.endPort.parent;
             maxZIndex = Math.max(sourceShape.getZOrder(), destShape.getZOrder());
             sourceShape.setZOrder(maxZIndex + 2);
             destShape.setZOrder(maxZIndex + 2);*/

            //console.log(sourceShape.getZOrder() + " " + destShape.getZOrder());
            //conn.endPort.parent.setZOrder(connZIndex + 2);

            conn.sourcePort.showPort();
            conn.endPort.showPort();

            // move the port according to its direction
            conn.sourcePort.moveTowardsTheCenter(conn.sourcePort);
            conn.endPort.moveTowardsTheCenter(conn.endPort);

            conn.canvas.selectedSourcePort = conn.sourcePort;
            conn.canvas.selectedDestPort = conn.endPort;
            conn.canvas.currentConnection = conn;

            if (!prevConnection || (conn.id !== prevConnection.id)) {
                conn.canvas.updatedElement = conn;
                $(conn.canvas.html).trigger("selectelement");
            }

            //conn.canvas.setCurrentSelection(conn);
            //conn.can
            e.stopPropagation();
//        console.log(conn.canvas);
    };
};

