/**
 * @fileOverview This file contains the class Graphics used to implement the
 * drawing required in the designer
 */

/**
 * The class in charge as the interface with the wz_graphics framework and
 * it is in charge of drawing the regular shapes and lines
 * @param {Object} html This parameter can be either an id, or an html object
 * @constructor
 */


var Graphics = function (html) {

    if (!html) {
        return null;
    }
    this.graphics = new jsGraphics(html);

    this.color = new Color(0, 0, 0);


};

/**
 * Draws a line of a given type between two points.
 *
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {string} type the type of line we wish to draw
 * @param {number} segLength the segment length for segmented and
 * segmentdot type of line
 * @param {number} spaceLength the space length for segmented and
 * segmentdot type of line
 */

Graphics.prototype.drawLine = function (x1, y1, x2, y2, type, segLength,
                                       spaceLength, doNotErasePrevious) {

    if (!doNotErasePrevious) {
        this.graphics.clear();
    }

    if (!type) {
        type = "regular";
    }
    switch (type) {
    case "dotted":
        this.graphics.setStroke(-1);
        break;
    case "segmented":
        this.graphics.setStroke(1);
        this.graphics.drawLine = this.makeSegmentedLine;
        break;
    case "segmentdot":
        this.graphics.setStroke(1);
        this.graphics.drawLine = this.makeSegmentDotLine;
        break;
    default:
        this.graphics.setStroke(1);
    }

    this.graphics.setColor(this.color.getCSS());
    this.graphics.drawLine(x1, y1, x2, y2, segLength, spaceLength);
    this.graphics.paint();


};
/**
 * Initializes the graphics variable with a new html container
 * @param html
 * @returns {Graphics}
 */


Graphics.prototype.initGraphics = function (html) {
    if (html) {
        this.graphics = new jsGraphics(html);
    }
    return this;

};
/**
 * Returns the color that was being used for drawing
 * @returns {Color}
 */

Graphics.prototype.getColor = function () {
    return this.color;

};
/**
 * Sets the color to be used for drawing
 * @param newColor
 * @returns {Graphics}
 */

Graphics.prototype.setColor = function (newColor) {
    if (newColor.type === "Color") {
        this.color = newColor;
    }
    return this;

};
/**
 * This function will make a segmented line between two points in the same axis,
 * if points in different axis are
 * provided the method would simple return
 *
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} segmentLength the segment length for segmented and
 * segmentdot type of line
 * @param {number} spLength the space length for segmented and
 * segmentdot type of line
 */
Graphics.prototype.makeSegmentedLine = function (x1, y1, x2, y2, segmentLength,
                                                 spLength) {
    var dx,
        dy,
        aux,
        segLength = 4,
        spaceLength = 3,
        diff = 0,
        x,
        y;

    //not same axis so just return
    if ((x2 !== x1 && y2 !== y1)) {
        return;
    }

    if (x2 === x1) {
        //same point just return
        if (y2 === y1) {
            return;
        }
        dx = 0;
        //swap
        if (y2 < y1) {
            aux = y2;
            y2 = y1;
            y1 = aux;
        }
        dy = diff = y2 - y1;
    } else {
        dy = 0;
        if (x2 < x1) {
            aux = x2;
            x2 = x1;
            x1 = aux;
        }
        dx = diff = x2 - x1;
    }

    x = x1;
    y = y1;

    if (diff < 7) {
        segLength = 2;
        spaceLength = 1;
    }

    segLength = (!segmentLength) ? segLength : segmentLength;
    spaceLength = (!spLength) ? spaceLength : spLength;

    if (dy === 0) {
        while (dx > 0) {
            if (dx >= segLength) {
                this._mkDiv(x, y, segLength, 1);
                x += segLength + spaceLength;
                dx -= (segLength + spaceLength);
            } else {
                this._mkDiv(x, y, dx, 1);
                dx = 0;
            }
        }
    } else {
        while (dy > 0) {
            if (dy >= segLength) {
                this._mkDiv(x, y, 1, segLength);
                y += segLength + spaceLength;
                dy -= (segLength + spaceLength);
            } else {
                this._mkDiv(x, y, 1, dy);
                dy = 0;
            }
        }
    }

};
/**
 * This function will make a segment between two points in the same axis with
 * the following structure segment-dot-segment
 * if points in different axis are provided the function will simply return.
 *
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} segmentLength the segment length for segmented and
 * segmentdot type of line
 * @param {number} spLength the space length for segmented and
 * segmentdot type of line
 */

Graphics.prototype.makeSegmentDotLine = function (x1, y1, x2, y2, segmentLength,
                                                  spLength) {
    var dx,
        dy,
        aux,
        segLength = 7,
        spaceLength = 4,
    //in case its necessary dot Length
        dotLength = 1,
        diff = 0,
        x,
        y;

    //not same axis so just return
    if ((x2 !== x1 && y2 !== y1)) {
        return;
    }


    if (x2 === x1) {
        //same point just return
        if (y2 === y1) {
            return;
        }
        dx = 0;
        //swap
        if (y2 < y1) {
            aux = y2;
            y2 = y1;
            y1 = aux;
        }
        dy  = y2 - y1;
        diff = dy;
    } else {
        dy = 0;
        if (x2 < x1) {
            aux = x2;
            x2 = x1;
            x1 = aux;
        }
        dx = x2 - x1;
        diff = dx;
    }

    x = x1;
    y = y1;

    segLength = (!segmentLength) ? segLength : segmentLength;
    spaceLength = (!spLength) ? spaceLength : spLength;

    if (dy === 0) {
        while (dx > 0) {
            if (dx >= segLength) {
                this._mkDiv(x, y, segLength, 1);
                dx -= (segLength + spaceLength);
                x += segLength + spaceLength;
                if (dx > 0) {
                    //we need to implement this if the dot length would be
                    // different than one
                    //if(dx < dotLength){
                    //	this._mkDiv(x,y,dx,1);
                    //  dx  = 0; continue;
                    //}
                    this._mkDiv(x, y, dotLength, 1);
                    dx -= (dotLength + spaceLength);
                    x += dotLength + spaceLength;

                }
            } else {
                this._mkDiv(x, y, dx, 1);
                dx = 0;
            }
        }
    } else {
        while (dy > 0) {
            if (dy >= segLength) {
                this._mkDiv(x, y, 1, segLength);
                dy -= (segLength + spaceLength);
                y += segLength + spaceLength;
                if (dy > 0) {
                    //we need to implement this if the dot length would be
                    // different than one
                    //if(dy < dotLength){
                    //	this._mkDiv(x,y,1,dy);
                    //  dy  = 0; continue;
                    //}
                    this._mkDiv(x, y, 1, dotLength);
                    dy -= (dotLength + spaceLength);
                    y += dotLength + spaceLength;

                }
            } else {
                this._mkDiv(x, y, 1, dy);
                dy = 0;
            }
        }
    }

};

