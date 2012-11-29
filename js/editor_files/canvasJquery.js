/**
 * @summary Plugin for creating the canvas, this is just a temporary file until replaced for the original
 * @description Creates the canvas an initiates its common behavior in a div
 * @version 1.1
 * @file canvasJquery.js
 * @author Thaer Latif
 * @contact thaer.latif@colosa.com
 */

(function ($, window, undefined) {

    var pluginName = "pmDraw",
        g;
//	var	document = window.document;

    /**
     * @class
     * @name PMDraw
     * @param {object} [oInit={}] Configuration object for Plugin.
     * @requires jQuery1.7+
     * @requires JqueryUI1.8+
     *
     * @example
     *        //basic initialization
     *        $(document).ready(function(){
     *            $('#div-id').PMDraw();
     *        });
     *
     * @example
     *         //required factors for interaction, objects that are supposed to be dragged into the canvas
     *         $(document).ready(function(){
     *            var dragOptions = {
     *                helper: "clone",
     *                revert: true,
     *                revertDuration: 0,
     *            };
     *
     *            $(".valid-outside-shapes").draggable(dragOptions);
     *            $('#div-id').PMDraw();
     *
     *        });
     *
     */

    function PMDraw(element, oInit) {
        this.element = element;
        /**
         * canvas variable used for most interactions in the plugin
         * @type Canvas
         * @memberof PMDraw
         */
        this.canvas = null;
        this._name = pluginName;
        this._init(element.getAttribute('id'));
    }

    /**
     * Initialization function, that constructs all the required behaviors and interactions with the canvas and its components
     * @param {string} id the id of the div that will be turn into a canvas
     * @memberof PMDraw
     */
    PMDraw.prototype._init = function (id) {
        //first we create a surrounding div to contain the canvas
        //$("#"+id).wrap("<div id='canvas-container' style='width: 500px; height: 200px; position: relative; overflow: scroll;'/>");
        //then we instantiate a canvas object
        this.canvas = new Canvas(id);
        //and then we assign the same object to a variable so that in events we still can reference the canvas Object
        var canvasVariable = this.canvas;
        //store the container of the canvas in a variable as well
        var $canvasContainer = $("#" + id).parent();
        //get the canvas and its container position, beware of where the container might be placed it would affect the actual result
        var canvasPosition = $("#" + id).offset();
        //var containerPosition = $("#canvas-container").position();
        //canvasVariable.setPosition(containerPosition.left + canvasPosition.left, containerPosition.top + canvasPosition.top);
        canvasVariable.setPosition(canvasPosition.left, canvasPosition.top);
        //canvas listeners and event options
        //updates the scroll position of the canvas everytime we scroll
//		console.log(canvasPosition.left + " " + canvasPosition.top);
        $canvasContainer.scroll(function () {
            canvasVariable.setLeftScroll($canvasContainer.scrollLeft())
                .setTopScroll($canvasContainer.scrollTop());
//			console.log($canvasContainer.scrollLeft() + " " + $canvasContainer.scrollTop());
            //	alert(canvas.getLeftScroll() + " " + canvas.getTopScroll());
        });



        canvasVariable.attachListeners(canvasVariable);
        var isCtrl = false;
        $(document).keydown(function (e) {
            //alert(e.which);
            switch (e.which) {
                case 17: // CTRL KEY
                    isCtrl = true;
                    break;
                case 116: // F5 KEY
                    e.preventDefault();
                    window.location.reload(true);
                    break;
                case 37:
                    // Left
                    e.preventDefault();
                    canvasVariable.moveElements(canvasVariable,'LEFT');
                    break;
                case 38:
                    // Top
                    e.preventDefault();
                    canvasVariable.moveElements(canvasVariable,'TOP');
                    break;
                case 39:
                    // Right
                    e.preventDefault();
                    canvasVariable.moveElements(canvasVariable,'RIGHT');
                    break;
                case 40:
                    // Bottom
                    e.preventDefault();
                    canvasVariable.moveElements(canvasVariable,'BOTTON');
                    break;
            }
        }).keypress(function (e) {

        }).keyup(function (e) {
            var current;
            e.preventDefault();
            switch (e.which) {
            case 8 :  //BACKSPACE
                if(isCtrl){
                    canvasVariable.removeElements(canvasVariable);
                }
                break;
            case 17: //CTRL KEY
                isCtrl = false;
                break;
            case 46: // DELETE KEY

                //if (canvasVariable.getCurrentSelection().getSize() > 0) {
                    //Run other code here when the element
                    // 'CurElement' is deleted
                    canvasVariable.removeElements(canvasVariable);
               // }
//                if (canvasVariable.getCurrentShape() !== null) {
//                    canvasVariable.getCurrentShape().destroy();
//                    //clear, that element doesn't exist anymore
//                    canvasVariable.setCurrentShape(null);
//                }
                break;
//          case 116: // F5 KEY
//              e.preventDefault();
//              window.location.reload(true);
//              break;
            case 113: //F2 KEY
                if (canvasVariable.getCurrentSelection().getLast() !== null) {
                    //Run other code here when the element
                    // 'CurElement' is deleted
                    current = canvasVariable.getCurrentSelection().getLast();
                    if (current !== undefined && current.label.html !== null) {
                        $(current.label.html).dblclick();
                        $(current.label.text.html).focus();
                    }
                }
                break;
            }
        });
    };

    $.fn[pluginName] = function (oInit) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new PMDraw(this, oInit));
            }
        });
    };
}(jQuery, window));
