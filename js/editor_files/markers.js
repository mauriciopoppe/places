/**
 * Initializes a BPMN Markers
 * @class Class that contains the behaviors and properties
 * of BPMN Markers Objects
 * @augments Markers
 */
var Markers = function (parent, position, eclass) {
    Shape.call(this);
    this.markersName = (!name) ? "Markers" : name;
    this.html = null;
    this.parent = parent;
    this.positions = ['left top', 'center top', 'right top',
        'left bottom', 'center bottom', 'right bottom'];
    this.position = (position !== null && typeof position === "number")
        ? position : 0;

    this.elementclass = (typeof eclass !== "undefined" && eclass !== null)
        ? eclass : 'class_empty';
};
Markers.prototype = new Shape();
Markers.prototype.type = "Markers";

Markers.prototype.createHTML = function () {
    var x;
    Shape.prototype.createHTML.call(this);

    this.html.id = this.id;
    this.html.style.width = '13px';
    this.html.style.height = '13px';
    this.html.className = '';

    if (this.elementclass instanceof Array) {
        for (x in this.elementclass) {
            this.html.className += this.elementclass[x] + ' ';
        }
    } else {
        this.html.className = this.elementclass;
    }
    this.parent.html.appendChild(this.html);

//    this.html.className = '';
//    this.html.className = 'bpmn-markers';
//    this.parent.html.appendChild(this.html);
//    this.parent.layers.insert(this);
//    //Create DIV in LEFT TOP POSITION
//    html = Markers.createDivs('markers-lt');
//    this.html.appendChild(html);
//    html.style.textAlign = 'left';
//    $(html).position({of: $(this.html), my: 'left top',
//    at: 'left top'});
//    //Create DIV in CENTER TOP POSITION
//    html = Markers.createDivs('markers-ct');
//    html.style.textAlign = 'center';
//    this.html.appendChild(html);
//    $(html).position({of: $(this.html), my: 'center top',
//    at: 'center top'});
//    //Create DIV in RIGHT TOP POSITION
//    html = Markers.createDivs('markers-rt');
//    html.style.textAlign = 'right';
//    this.html.appendChild(html);
//    $(html).position({of: $(this.html), my: 'right top',
//    at: 'right top',
//    collision: 'fit'});
//    //Create DIV in RIGHT TOP POSITION
//    html = Markers.createDivs('markers-rt');
//    html.style.textAlign = 'right';
//    this.html.appendChild(html);
//    $(html).position({of: $(this.html), my: 'right top',
//    at: 'right top',
//    collision: 'fit'});
//    //Create DIV in LEFT BOTTOM POSITION
//    html = Markers.createDivs('markers-lb');
//    html.style.textAlign = 'left';
//    this.html.appendChild(html);
//    $(html).position({of: $(this.html), my: 'left bottom',
//    at: 'left bottom'});
//    //Create DIV in CENTER BOTTOM POSITION
//    html = Markers.createDivs('markers-cb');
//    html.style.textAlign = 'center';
//    this.html.appendChild(html);
//    $(html).position({of: $(this.html), my: 'center bottom',
//    at: 'center bottom'});
//    //Create DIV in RIGHT BOTTOM POSITION
//    html = Markers.createDivs('markers-rb');
//    html.style.textAlign = 'right';
//    this.html.appendChild(html);
//    $(html).position({of: $(this.html), my: 'right bottom',
//    at: 'right bottom'});
    return this.html;
};
Markers.prototype.paint = function () {
    if (this.getHTML() === null) {
        this.createHTML();
    }
    $(this.html).position({
        of: $(this.parent.html),
        my: this.positions[this.position],
        at: this.positions[this.position]
    });
};
Markers.prototype.setElementClass = function (newClass) {
    var x;
    if (typeof newClass !== 'undefined' && newClass !== null) {
        this.elementclass = newClass;
        this.html.className = '';
        if (newClass instanceof Array) {
            for (x in newClass) {
                this.html.className += this.elementclass[x] + ' ';
            }
        } else {
            this.html.className = this.elementclass;
        }
    }
    return this;
};

Markers.prototype.setPosition = function (newPosition) {
    if (newPosition !== null && typeof newPosition === 'number') {
        this.position = newPosition;
    }
    return this;
};