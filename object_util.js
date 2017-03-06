'use strict';



function ObjectUtil() {
}

/**
 * Some static util functions for retrieving and checking nested keys in JSON objects. Syntax inspired by Immutable. Does support Arrays.
 */


/**
 * Checks whether a nested object key exists in an object. Dives into arrays if required.
 * @see http://stackoverflow.com/questions/2631001/javascript-test-for-existence-of-nested-object-key
 * @param obj The JSON object in which to check for the nested key
 * @param path_components An array of strings and/or numbers defining the path (of key names) to the key in question. Numbers are interpreted as array indices.
 * @returns {boolean} Whether the key exists. (The value may still be null, undefined, or falsy.)
 */
ObjectUtil.hasIn = function(obj, path_components) {
	let handled_path = [];
	let path_component;
	let last_obj = null;
	let index;
	for (var i = 0; i < path_components.length; i++) {
		path_component = path_components[i];
		handled_path.push(path_component);

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
			if(ObjectUtil._stringRepresentsPositiveIntegerIncludingZero(path_component)) {
				let index = parseInt(path_component);
				if(index >= 0 && index < obj.length) {
					last_obj = obj;
					obj = obj[index];
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
 * @param obj the JSON object in which to check for the nested key
 * @param path_components an array of strings defining the path (of key names) to the key in question
 * @returns {boolean} whether the key exists and is neither undefined nor null
 */
ObjectUtil.hasDefinedAndNonNullIn = function(obj, path_components) {
	if(ObjectUtil.hasIn(obj, path_components)) {
		let value = ObjectUtil.getIn(obj, path_components);
		let result = (typeof(value) !== 'undefined' && value != null);
		return result;
	}
	return false;
}

/**
 * Retrieves the nested obj from the given one. Note that the path has to exist, Check first with hasIn if in doubt.
 * @param obj the input JSON object
 * @param path_components the path to the nested object as an array of strings
 * @param alternate an alternate return value that will be used if the given path does not exist in the object
 * @returns {Object} the nested object
 */
ObjectUtil.getIn = function(obj, path_components, alternate) {
	if(!ObjectUtil.hasIn(obj, path_components)) {
		return alternate;
	}
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

/**
 * Creates a new object based on the old one that has the given path added.
 * @param obj the input JSON object
 * @param path_components the path to the nested object as an array of strings and/or numbers. You have to use numbers (integers >= 0 to be more precise) if you want to set array values.
 * @param value_to_use_for_leaf the value to set for the final path element
 * @param value_to_use_for_missing_array_elements a value to push into arrays to fill them to the required length, if needed. Optional, defaults to undefined.
 * @returns {Object} the new JSON object, which includes the requested path
 **/
ObjectUtil.addPathIn = function(obj, path_components, value_to_use_for_leaf, value_to_use_for_missing_array_elements) {
	
	var obj_cp = Object.assign({}, obj);
	
	if(ObjectUtil.hasIn(obj, path_components)) {
		return obj_cp;
	}
		
	var path_component_is_number = path_components.map(path_component => (typeof path_component === "number"));
	
	
	// handle requested array at root
	if(path_components.length > 0 && path_component_is_number[0]) {
		obj_cp = [];
	}
	
		
	var sub_obj = obj_cp;
	var path_component;
	var index;
	var current_path_component_is_number;
	var next_path_component_is_number;
	for (var i = 0; i < path_components.length; i++) {
		path_component = path_components[i];		
		
		if (typeof(sub_obj[path_component]) != 'object' || sub_obj[path_component] == null) {	// need to create path
			next_path_component_is_number = ((i < path_components.length - 1) && path_component_is_number[i+1]);
			current_path_component_is_number = path_component_is_number[i];
			if(next_path_component_is_number) {
				if(!Array.isArray(sub_obj[path_component])) {
					sub_obj[path_component] = [];
				}
			}
			else {
				// In case of an array: we may need to add array elements before this one before we can insert it
				if(current_path_component_is_number) {
					if(Array.isArray(sub_obj)) {
						index = path_component;
							while(index >= sub_obj.length) {
								sub_obj.push(value_to_use_for_missing_array_elements);
							}
					}
				}				
				sub_obj[path_component] = {};
				if(i === (path_components.length - 1)) {
					sub_obj[path_component] = value_to_use_for_leaf;
				}
			}
		}
		
		sub_obj = sub_obj[path_component];
	}
	return obj_cp;
}



module.exports = ObjectUtil;
