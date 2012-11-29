/**
 * @fileOverview This class contains the functionality for generating unique IDs
 * for all elements in the designer
 */

UniqueID = function () {
};

UniqueID.prototype.type = "UniqueID";

/**
 * Generates a unique id.
 * But just for the correctness: this is no Global Unique Identifier,
 * it is just a random generator
 * with the output that looks like a GUID. But may be also useful.
 *
 * @private
 * @returns String
 **/
//UniqueID.create = function()
//{
//    var segment=function()
//    {
//        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
//    }
//    return (segment()+segment()+segment()+segment()+segment()+segment()
// +segment()+segment());
//};
UniqueID.create = function () {
    var rand = function (min, max) {
        // Returns a random number
        //
        // version: 1109.2015
        // discuss at: http://phpjs.org/functions/rand
        // +   original by: Leslie Hoare
        // +   bugfixed by: Onno Marsman
        // %          note 1: See the commented out code below for a
        // version which will work with our experimental
        // (though probably unnecessary) srand() function)
        // *     example 1: rand(1, 1);
        // *     returns 1: 1
        var argc = arguments.length;
        if (argc === 0) {
            min = 0;
            max = 999999999;
        } else if (argc === 1) {
            throw new Error(
                'Warning: rand() expects exactly 2 parameters, 1 given'
            );
        }
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    uniqid = function (prefix, more_entropy) {
        // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +    revised by: Kankrelune (http://www.webfaktory.info/)
        // %        note 1: Uses an internal counter (in php_js global) to avoid collision
        // *     example 1: uniqid();
        // *     returns 1: 'a30285b160c14'
        // *     example 2: uniqid('foo');
        // *     returns 2: 'fooa30285b1cd361'
        // *     example 3: uniqid('bar', true);
        // *     returns 3: 'bara20285b23dfd1.31879087'
            if (typeof prefix === 'undefined') {
                prefix = "";
            }

            var retId;
            var formatSeed = function (seed, reqWidth) {
                seed = parseInt(seed, 10).toString(16); // to hex str
                if (reqWidth < seed.length) { // so long we split
                    return seed.slice(seed.length - reqWidth);
                }
                if (reqWidth > seed.length) { // so short we pad
                    return Array(1 + (reqWidth - seed.length)).join('0') + seed;
                }
                return seed;
            };

            // BEGIN REDUNDANT
            if (!this.php_js) {
                this.php_js = {};
            }
            // END REDUNDANT
            if (!this.php_js.uniqidSeed) { // init seed with big random int
                this.php_js.uniqidSeed = Math.floor(Math.random() * 0x75bcd15);
            }
            this.php_js.uniqidSeed += 1;

            retId = prefix; // start with prefix, add current milliseconds hex string
            retId += formatSeed(parseInt(new Date().getTime() / 1000, 10), 8);
            retId += formatSeed(this.php_js.uniqidSeed, 5); // add seed hex string
            if (more_entropy) {
                // for more entropy we add a float lower to 10
                retId += (Math.random() * 10).toFixed(8).toString();
            }

            return retId;
        },
        sUID;

    do {
        sUID = uniqid(rand(0, 999999999), true);
        sUID = sUID.replace('.', '0');
    } while (sUID.length !== 32);

    return sUID;
};

