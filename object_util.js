'use strict';



function ObjectUtil() {
}

/**
 * Some static util functions for retrieving and checking nested keys in objects. Syntax inspired by Immutable. Does support Arrays.
 */


    /**
     * Checks whether a nested object key exists in an object. Dives into arrays as well.
     * @see http://stackoverflow.com/questions/2631001/javascript-test-for-existence-of-nested-object-key
     * @param obj the object in which to check for the nested key
     * @param path_components an array of strings defining the path (of key names) to the key in question
     * @returns {boolean} whether the key exists. (The value may still be null, undefined, or falsy.)
     */
    ObjectUtil.hasIn = function(obj, path_components) {
        let handled_path = [];
        let path_component;
        let last_obj = null;
        let index;
        for (var i = 0; i < path_components.length; i++) {
            path_component = path_components[i];
            handled_path.push(path_component);
            //console.log("At path '" + handled_path.join(', ') + "':");

            // special handling for array indices given as number instead of text
            if (typeof(path_component) === "number") {
                if (Array.isArray(obj)) {
                    index = path_component;
                    if (index >= 0 && index < obj.length) {
                        last_obj = obj;
                        obj = obj[index];
                        continue;
                    }
                    else {
                        return false;
                    }
                }

            }

            if (typeof(obj) != 'object' || obj == null) {
                return false;   // must be object or array, and the latter is also of type object in JS
            }
            if(Array.isArray(obj)) {
                //console.log("###### At " + handled_path.join(', ') + ": is array.");
                if(ObjectUtil._stringRepresentsPositiveIntegerIncludingZero(path_component)) {
                    let index = parseInt(path_component);
                    //console.log("###### At " + handled_path.join(', ') + ": is array. index=" + index);
                    if(index >= 0 && index < obj.length) {
                        last_obj = obj;
                        obj = obj[index];
                        //console.log("###### At " + handled_path.join(', ') + ": is array. index=" + index + ". obj=%o", obj);
                    }
                    else {
                        return false;
                    }
                } else {
                    return false;
                }

            }
            else {
                // is object
                if (!obj.hasOwnProperty(path_component)) {
                    return false;
                }
                last_obj = obj;
                obj = obj[path_component];
            }
        }
        return true;
    }


    ObjectUtil._stringRepresentsPositiveIntegerIncludingZero = function(str) {
        var n = Math.floor(Number(str));
        return String(n) === str && n >= 0;
    }

    /**
     * Checks whether a nested object key exists and is not null or undefined.
     * @param obj the object in which to check for the nested key
     * @param tests an array of strings defining the path (of key names) to the key in question
     * @returns {boolean} whether the key exists and is neither undefined nor null
     */
    ObjectUtil.hasDefinedAndNonNullIn = function(obj, tests) {
        if(ObjectUtil.hasIn(obj, tests)) {
            let value = ObjectUtil.getIn(obj, tests);
            let result = (typeof(value) !== 'undefined' && value != null);
            return result;
        }
        return false;
    }

    /**
     * Retrieves the nested obj from the given one. Note that the path has to exist, Check first with hasIn if in doubt.
     * @param obj the object
     * @param path_components the path to the nested object
     * @returns {Object} the nested object
     */
    ObjectUtil.getIn = function(obj, path_components) {
        let path_component;
        for (var i = 0; i < path_components.length; i++) {
            path_component = path_components[i];
            if(Array.isArray(obj)) {
                let index = parseInt(path_component);
                obj = obj[index];
            } else {
                obj = obj[path_component];
            }
        }
        return obj;
    }



module.exports = ObjectUtil;
