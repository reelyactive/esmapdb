/**
 * Copyright reelyActive 2022
 * We believe in an open Internet of Things
 */


const DEFAULT_IN_MEMORY = false;
const DEFAULT_PERSISTENT = false;


/**
 * ESMapDB Class
 * Embedded database for Node.js with an ECMAScript Map interface.
 */
class ESMapDB {

  /**
   * ESMapDB constructor
   * @param {Object} options The options as a JSON object.
   * @constructor
   */
  constructor(options) {
    let self = this;
    options = options || {};

    this.isInMemory = options.createInMemory || DEFAULT_IN_MEMORY;
    this.isPersistent = options.createPersistent || DEFAULT_PERSISTENT;
    this.persistentSize = 0;
    this.inMemoryMap = new Map();
  }

  /**
   * Get the number of key-value pairs.
   */
  get size() {
    if(this.isInMemory) return this.inMemoryMap.size;
    return this.persistentSize;
  }

  /**
   * Remove all key-value pairs.
   * @param {Function} callback Optional callback for persistent operations.
   */
  clear(callback) {
    if(typeof callback === "function") {
      callback(); // TODO
    }
    return this.inMemoryMap.clear();
  }

  /**
   * Remove the key-value pair with the given key, if it exists.
   * @param {Object} key The key of the pair to remove.
   * @param {Function} callback Optional callback for persistent operations.
   * @return {Boolean} True if the pair exists and was removed, false otherwise.
   */
  delete(key, callback) {
    if(typeof callback === "function") {
      callback(); // TODO
    }
    return this.inMemoryMap.delete(key);
  }

  /**
   * Return the value paired with the given key, if the key exists.
   * @param {Object} key The key to look up.
   * @param {Function} callback Optional callback for persistent operations.
   * @return {Object} The value associated with the key, undefined otherwise.
   */
  get(key, callback) {
    if(typeof callback === "function") {
      callback(); // TODO
    }
    return this.inMemoryMap.get(key);
  }

  /**
   * Assert whether a key-value pair exists for the given key.
   * @param {Object} key The key to look up.
   * @param {Function} callback Optional callback for persistent operations.
   * @return {Boolean} True if the pair exists, false otherwise.
   */
  has(key, callback) {
    if(typeof callback === "function") {
      callback(); // TODO
    }
    return this.inMemoryMap.has(key);
  }

  /**
   * Set the given value for the given key.
   * @param {Object} key The key of the pair.
   * @param {Object} value The value to set for the pair.
   * @param {Function} callback Optional callback for persistent operations.
   * @return {Map} The in-memory Map which may not reflect persistent storage.
   */
  set(key, value, callback) {
    if(typeof callback === "function") {
      callback(); // TODO
    }

    if(this.isInMemory) {
      return this.inMemoryMap.set(key, value);
    }

    return this.inMemoryMap;
  }

}


module.exports = ESMapDB;