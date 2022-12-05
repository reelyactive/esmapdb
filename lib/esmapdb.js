/**
 * Copyright reelyActive 2022
 * We believe in an open Internet of Things
 */


const level = require('level');
const path = require('path');


const DEFAULT_IN_MEMORY = false;
const DEFAULT_PERSISTENT = false;
const DEFAULT_LOCATION = 'database';
const DEFAULT_KEY_ENCODING = 'utf-8';
const DEFAULT_VALUE_ENCODING = 'utf-8';
const NO_ERRORS_VALUE = undefined;


/**
 * ESMapDB Class
 * Embedded database for Node.js with an ECMAScript Map interface.
 */
class ESMapDB {

  /**
   * ESMapDB constructor
   * @param {Object} options The options as a JSON object.
   * @param {Function} callback Optional callback for persistent operations.
   * @constructor
   */
  constructor(options, callback) {
    let self = this;
    options = options || {};

    let isPersistentSelected = options.createPersistent || DEFAULT_PERSISTENT;

    this.isInMemory = options.createInMemory || DEFAULT_IN_MEMORY;
    this.isPersistent = false;
    this.persistentSize = 0;
    this.inMemoryMap = new Map();

    if(isPersistentSelected) {
      let location = options.persistentLocation || DEFAULT_LOCATION;
      let keyEncoding = options.persistentKeyEncoding || DEFAULT_KEY_ENCODING;
      let valueEncoding = options.persistentValueEncoding ||
                          DEFAULT_VALUE_ENCODING;
      let encoding = { keyEncoding: keyEncoding, valueEncoding, valueEncoding };

      level(location, encoding, (err, database) => {
        if(err) {
          if(typeof callback === 'function') {
            return callback(err, self);
          }
          console.log('ESMapDB cannot access persistent storage at',
                      path.resolve(location) + ':',
                      'persistent data will be neither retrieved nor stored.');
        }
        else {
          self.database = database;
          self.isPersistent = true;

          if(self.isInMemory) {
            syncToMemory(self.database, self.inMemoryMap);
          }
          if(typeof callback === 'function') {
            return callback(NO_ERRORS_VALUE, self);
          }
        }
      });
    }
    else if(typeof callback === 'function') {
      return callback(NO_ERRORS_VALUE, self);
    }
  }

  /**
   * Get the number of key-value pairs.
   */
  get size() {
    if(this.isInMemory) return this.inMemoryMap.size;
    return this.persistentSize;
  }

  /**
   * Iterate over the in-memory map.
   */
  [Symbol.iterator]() {
    return this.inMemoryMap[Symbol.iterator]();
  }

  /**
   * Remove all key-value pairs.
   * @param {Function} callback Optional callback for persistent operations.
   */
  clear(callback) {
    let result = this.inMemoryMap.clear();

    if(this.isPersistent) {
      this.database.clear(function(err) {
        if(typeof callback === "function") {
          callback(err, result);
        }
      });
    }
    else if(typeof callback === "function") {
      callback(NO_ERRORS_VALUE, result);
    }

    return result;
  }

  /**
   * Remove the key-value pair with the given key, if it exists.
   * @param {Object} key The key of the pair to remove.
   * @param {Function} callback Optional callback for persistent operations.
   * @return {Boolean} True if the pair exists and was removed, false otherwise.
   */
  delete(key, callback) {
    let self = this;
    let result = this.inMemoryMap.delete(key);

    if(this.isPersistent) {
      this.database.get(key, function(err, value) {
        if(err && err.notFound) {
          if(typeof callback === "function") {
            callback(NO_ERRORS_VALUE, false);
          }
        }
        else if(err) {
          if(typeof callback === "function") {
            callback(err);
          }
        }
        else {
          self.database.del(key, function(err) {
            if(self.persistentSize > 0) {
              self.persistentSize--;
            }
            if(typeof callback === "function") {
              callback(err, true);
            }
          });
        }
      });
    }
    else if(typeof callback === "function") {
      callback(NO_ERRORS_VALUE);
    }

    return result;
  }

  /**
   * Iterate over the entries of the in-memory map.
   */
  entries() {
    return this.inMemoryMap.entries();
  }

  /**
   * Iterate over the in-memory map.
   */
  forEach(value, key, map, thisArg) {
    return this.inMemoryMap.forEach(value, key, map, thisArg);
  }

  /**
   * Return the value paired with the given key, if the key exists.
   * @param {Object} key The key to look up.
   * @param {Function} callback Optional callback for persistent operations.
   * @return {Object} The value associated with the key, undefined otherwise.
   */
  get(key, callback) {
    let result = this.inMemoryMap.get(key);

    if(this.isPersistent && (typeof callback === "function")) {
      this.database.get(key, function(err, value) {
        if(err && err.notFound) {
          callback(NO_ERRORS_VALUE, undefined);
        }
        else if(err) {
          callback(err);
        }
        else {
          callback(NO_ERRORS_VALUE, value);
        }
      });
    }
    else if(typeof callback === "function") {
      callback(NO_ERRORS_VALUE, result);
    }

    return result;
  }

  /**
   * Assert whether a key-value pair exists for the given key.
   * @param {Object} key The key to look up.
   * @param {Function} callback Optional callback for persistent operations.
   * @return {Boolean} True if the pair exists, false otherwise.
   */
  has(key, callback) {
    let result = this.inMemoryMap.has(key);

    if(this.isPersistent && (typeof callback === "function")) {
      this.database.get(key, function(err, value) {
        if(err && err.notFound) {
          callback(NO_ERRORS_VALUE, false);
        }
        else if(err) {
          callback(err);
        }
        else {
          callback(NO_ERRORS_VALUE, true);
        }
      });
    }
    else if(typeof callback === "function") {
      callback(NO_ERRORS_VALUE, result);
    }

    return result;
  }

  /**
   * Iterate over the keys of the in-memory map.
   */
  keys() {
    return this.inMemoryMap.keys();
  }

  /**
   * Set the given value for the given key.
   * @param {Object} key The key of the pair.
   * @param {Object} value The value to set for the pair.
   * @param {Function} callback Optional callback for persistent operations.
   * @return {Map} The in-memory Map which may not reflect persistent storage.
   */
  set(key, value, callback) {
    let self = this;
    let result = this.inMemoryMap;

    if(this.isInMemory) {
      result = this.inMemoryMap.set(key, value);
    }

    if(this.isPersistent) {
      this.database.get(key, function(err) {
        if(err && err.notFound) {
          self.persistentSize++;
        }
        self.database.put(key, value, function(err) {
          if(typeof callback === "function") {
            callback(err, result);
          }
        });
      });
    }
    else if(typeof callback === "function") {
      callback(NO_ERRORS_VALUE, result);
    }

    return result;
  }

  /**
   * Iterate over the values of the in-memory map.
   */
  values() {
    return this.inMemoryMap.values();
  }

}


/**
 * Sync the persistent database to memory.
 */
function syncToMemory(database, inMemoryMap) {
  database.createReadStream()
    .on('data', function(data) {
      inMemoryMap.set(data.key, data.value);
    });
}


module.exports = ESMapDB;
