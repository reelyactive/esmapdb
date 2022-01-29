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


Contributing
------------

Discover [how to contribute](CONTRIBUTING.md) to this open source project which upholds a standard [code of conduct](CODE_OF_CONDUCT.md).


Security
--------

Consult our [security policy](SECURITY.md) for best practices using this open source software and to report vulnerabilities.

[![Known Vulnerabilities](https://snyk.io/test/github/reelyactive/esmapdb/badge.svg)](https://snyk.io/test/github/reelyactive/esmapdb)


License
-------

MIT License

Copyright (c) 2022 reelyActive

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
THE SOFTWARE.