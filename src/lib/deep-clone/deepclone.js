 /** 
  * @class CloneOf object
  * @brief Object to clone other objects, and preserve primatives as their object types (Deep Copy)
  * @author Andrew Holloway
  * @date 2009-08-28 (re-written)
  *
  * Notes:
  * - This file contains an instance of the untropy Namespace, and all functions within should use it.
  * - The new cloning code is based off of code written by James Padolsey (http://james.padolsey.com/)
  * 
  */

/// Namespacing
if (typeof Untropy == "undefined") {
 
   Untropy = {};
    
}
 
/**
 * @brief This object clones the object specified in its parameter.
 *
 * This Cloning function returns an unextended copy of the 
 * object. It copies arrays by directly iterating over each
 * internal array, if they exist.
 * 
 * @return copy of the specified object
 * 
 */
Untropy.CloneOf = function(obj) {

    // Go into arrays and copy all the stuff inside
    if (Object.prototype.toString.call(obj) === '[object Array]') {
        var out = [], 
            i = 0, 
            len = obj.length;

        for ( ; i < len; i++ ) {
            out[i] = arguments.callee(obj[i]);
        }
        return out;
    }

    // Handle case when the object is ... an object
    if (typeof obj === 'object') {

        var out = {}, 
            i;

        for ( i in obj ) {
            out[i] = arguments.callee(obj[i]);
        }

        return out;
    }

    // primitive types pass on through.
    return obj;

};
