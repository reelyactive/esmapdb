ESMapDB
=======

ESMapDB is an embedded database for Node.js with an ECMAScript Map interface.  For lightweight operations with key-value pairs, ESMapDB combines the convenient interface of a Map with a simple, persistent data store.


Motivation
----------

_Yet another database???_  At [reelyActive](https://www.reelyactive.com), we used [NeDB](https://github.com/louischatriot/nedb), "The JavaScript Database", successfully for many years.  But alas, NeDB is no longer maintained.  After an extensive search for a simple, well-maintained successor with minimal dependencies, [LevelDB](https://github.com/google/leveldb) (wrapped up in the Node.js-friendly [level package](https://github.com/Level/level)) was identified as the best candidate.

_So why not just LevelDB???_  Well, LevelDB is very nearly functionally equivalent with the [Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map) object introduced in ES6, so we decided to wrap LevelDB with a Map interface, which arguably results in more familiar, readable and developer-friendly code.  In short, we've attempted to make managing a reasonable number of key-value pairs—with persistence—as simple as using Map.get(), Map.set() and the usual iterators.


How ESMapDB works
-----------------

ESMapDB can be instantiated with any combination of __in-memory__ _and/or_ __persistent__ operation.

When in-memory operation is enabled, simply interact with ESMapDB like a Map, using .get(), .set(), .delete() and the iterators which function exactly like a Map.

When persistent operation is enabled, simply add a callback function as an argument to the same .get(), .set(), .delete(), ... functions, which will execute once the asynchronous filesystem operation of LevelDB completes.

When _both_ in-memory and persistent operation are enabled, enjoy the simple non-blocking function calls of the Map interface while the filesystem operations are taken care of in the background.


Installation
------------

    npm install esmapdb


Hello ESMapDB!
--------------

```javascript
const ESMapDB = require('esmapdb');

const options = { createInMemory: true,
                  createPersistent: true };

let database = new ESMapDB(options);

database.set('key', 'value');     // Write to both memory and the filesystem
console.log(database.get('key')); // Prints 'value'
```


API Reference
-------------

Note that in all methods with an _optional_ callback below, the callback function observes the form __callback(err, result)__ where the two parameters are defined as follows:
- __err:__ Error returned by the persistent database operation, `undefined` otherwise.
- __result:__ The same result that the function call itself returns, but taken from the persistent store, when persistent operation is enabled.  If persistent operation is disabled, the result is taken from the in-memory store.

In other words, when both in-memory _and_ persistent operation are enabled, the function call returns the result from the in-memory store while the asynchronous callback result is derived from the persistent store.

### ESMapDB(options[, callback])

Constructor.  Create a new ESMapDB instance with the given options:

| Option                  | Default    | Description                           |
|:------------------------|:-----------|:--------------------------------------|
| createInMemory          | false      | Maintain an in-memory copy of the database |
| createPersistent        | false      | Maintain a copy of the database on the filesystem |
| persistentLocation      | 'database' | Store data in a folder called 'database' |
| persistentKeyEncoding   | 'utf-8'    | See LevelDB for supported encodings   |
| persistentValueEncoding | 'utf-8'    | See LevelDB for supported encodings   |

If an _optional_ callback is provided, and the `createPersistent` option is selected, the callback will execute after the persistent store is loaded or an error is encountered.

As of __esmapdb__ v0.3.0, errors encountered when loading a persistent store are no longer thrown, but may be observed in the _optional_ callback, and operation will continue as per the `createInMemory` setting.

### .size

Returns the number of key/value pairs in the database.  If in-memory option is enabled, the number of key/value pairs in the Map() is returned.  Else, an _estimate_ of the number of key/value pairs in persistent storage is returned.

### .clear([callback])

Removes all key/value pairs from the database.  Returns `undefined`.

If an _optional_ callback is provided, and persistent operation is enabled, the callback will execute after the persistent store is cleared.  In the absence of a persistent store, the callback will execute immediately.

### .delete(key[, callback])

Removes the pair with the given key from the database.  Returns `true` if the pair in the database existed and has been removed, or `false` if the element does not exist.

If an _optional_ callback is provided, and persistent operation is enabled, the callback will execute after deletion from the persistent store completes.  In the absence of a persistent store, the callback will execute immediately.

### .get(key[, callback])

Retrieve the value associated with the given key.  Returns the value associated to the key, or `undefined` if there is none.

If an _optional_ callback is provided, and persistent operation is enabled, the callback will execute after retrieval from the persistent store completes.  In the absence of a persistent store, the callback will execute immediately.

### .has(key[, callback])

Determine whether a pair with the given key exists in the database.  Returns a boolean asserting whether a value has been associated to the key in the database or not.

If an _optional_ callback is provided, and persistent operation is enabled, the callback will execute after determination from the persistent store completes.  In the absence of a persistent store, the callback will execute immediately.

### .set(key, value[, callback])

Create or update a key/value pair in the database.  Sets the value for the key in the database and returns the updated database as a Map object.  If in-memory operation is disabled, the return value will be an empty Map object.

If an _optional_ callback is provided, and persistent operation is enabled, the callback will execute after the update of the persistent store completes.  In the absence of a persistent store, the callback will execute immediately.

### .keys()

Returns a new Iterator object that contains the keys for each element in the in-memory database.  If in-memory operation is disabled, there will be zero keys over which to iterate.

### .values()

Returns a new Iterator object that contains the values for each element in the in-memory database.  If in-memory operation is disabled, there will be zero values over which to iterate.

### .entries()

Returns a new Iterator object that contains an array of [key, value] for each element in the in-memory database.  If in-memory operation is disabled, there will be zero pairs over which to iterate.

### .forEach(callback)

Executes the callback once for each key-value pair present in the in-memory database.  If in-memory operation is disabled, there will be zero execution of the callback function.


Contributing
------------

Discover [how to contribute](CONTRIBUTING.md) to this open source project which upholds a standard [code of conduct](CODE_OF_CONDUCT.md).


Security
--------

Consult our [security policy](SECURITY.md) for best practices using this open source software and to report vulnerabilities.


License
-------

MIT License

Copyright (c) 2022-2025 reelyActive

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
THE SOFTWARE.
