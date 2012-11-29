/**
 * @class ArrayList
 * Construct a List similar to Java ArrayList that encapsulates methods for
 * making a list that supports several operations
 * @constructor ArrayList
 */
var ArrayList = function () {
    //array where the list is built
    var elements = [],
    //size of the array
        size = 0,
        index,
        i,
        jCoreElement;
    return {

        id: Math.random(),
        /**
         * Get an element in a specified index
         * @param {Number} index
         * @returns {Object}
         */
        get : function (index) {
            return elements[index];
        },
        /**
         * Insert an element in the list
         * @param {Object} item
         */
        insert : function (item) {
            elements[size] = item;
            size += 1;
            return this;
        },

        /**
         * Removes an element from the list, the index or the element can be
         * provided
         * @param {Object} item
         * @param {Boolean} byIndex
         * @return {Boolean}
         */
        remove : function (item) {
            index = this.indexOf(item);
            if (index === -1) {

                return false;
            }
            //swap(elements[index], elements[size-1]);
            size -= 1;
            elements.splice(index, 1);
            return true;

        },
        /**
         * Get the length of the list
         * @return {Number}
         */
        getSize : function () {
            return size;
        },
        /**
         * Returns true if the list is empty
         * @returns {Boolean}
         */
        isEmpty : function () {
            return size === 0;
        },
        /**
         * Returns the first occurrence of an element
         * if the element is not contained
         * in the list then returns -1
         * @param {Object} item
         * @return {Number}
         */
        indexOf : function (item) {
            for (i = 0; i < size; i += 1) {
                if (item.id === elements[i].id) {

                    return i;
                }
            }
            return -1;

        },
        /**
         * Returns the the first object of the list that has the
         * specified attribute with the specified value
         * if the object is not found it returns undefined
         * @param {string} attribute
         * @param {string} value
         * @return {Object}
         */
        find : function (attribute, value) {
            var object = _.find(elements, function (arrayElement) {
                //return $(arrayElement.getHTML()).getAttribute(attribute) == value;
                return arrayElement[attribute] === value;
            });
            return object;
        },

        /**
         * Returns true if the list contains the item and false otherwise
         * @param {Object} item
         * @return {Boolean}
         */
        contains : function (item) {
            if (this.indexOf(item) !== -1) {
                return true;
            }
            return false;
        },
        /**
         * Sorts the list according to some criteria, descending by default
         * @param {Function} compFunction
         * @return {Boolean}
         *
         */
        sort : function (compFunction) {
            if (!compFunction) {
                return false;
            } else {
                elements.sort(compFunction);
                return true;
            }
        },

        /**
         * Returns the list as an array
         * @return {Array}
         */
        asArray : function () {
            return elements;
        },
        /**
         * Returns the last element of the list
         * @return {Object}
         */
        getFirst : function () {
            return elements[0];
        },
        /**
         * Returns the last element of the list
         * @return {Object}
         */
        getLast : function () {
            return elements[size - 1];
        },

        /**
         * Returns the last element of the list and deletes it from the list
         * @return {*}
         */
        popLast : function () {
            var lastElement;
            size -= 1;
            lastElement = elements[size];
            elements.splice(size, 1);
            return lastElement;
        },
        /**
         * Returns an array with the objects that determine the minimum size
         * the container should have
         * The array values are in this order TOP, RIGHT, BOTTOM AND LEFT
         * @return {Array}
         */
        getDimensionLimit : function () {
            var result = [100000, -1, -1, 100000],
                objects = [undefined, undefined, undefined, undefined];
            //number of pixels we want the inner shapes to be
            //apart from the border

            for (i = 0; i < size; i += 1) {
                if (result[0] > elements[i].y) {
                    result[0] = elements[i].y;
                    objects[0] = elements[i];

                }
                if (result[1] < elements[i].x + elements[i].width) {
                    result[1] = elements[i].x + elements[i].width;
                    objects[1] = elements[i];
                }
                if (result[2] < elements[i].y + elements[i].height) {
                    result[2] = elements[i].y + elements[i].height;
                    objects[2] = elements[i];
                }
                if (result[3] > elements[i].x) {
                    result[3] = elements[i].x;
                    objects[3] = elements[i];
                }
            }
            return result;
        },
        /**
         * Empty the arraylist
         */
        clear : function () {
            elements = [];
            size = 0;
        }
    };

};

// This code publish object to be used with nodejs environment
if (typeof exports !== 'undefined') {
    module.exports = ArrayList;
    var _ = require('../../lib/underscore/underscore.js');
}
