### The _7.2.2 dlopen_ folder

No changes were needed for this folder.
 

### The _7.2.3 dynamicLibraries_ folder

- The Emscripten command line has been adjusted:
  - Emscripten 3.1.32 was throwing a compile error because of the missing *FindPrimes* function in *main.cpp*. The *-s ERROR_ON_UNDEFINED_SYMBOLS=0* flag was added to the command line so that it's a warning instead of an error.


### The _7.2.4 ManualLinking_ folder

A few changes were needed in the _frontend_ folder's _main.js_ file:
- The _env_ object, in the _isPrimeImportObject_, was deleted.
- The _\_\_memory_base: 0,_ line of code was deleted from the _env_ object of the _findPrimesImportObject_ object.
- The underscore character in front of both IsPrime functions has been removed in the _env_ object of the _findPrimesImportObject_ object. The new line of code is: _IsPrime: module.instance.exports.IsPrime,_
- The underscore character in front of _LogPrime_ has been removed in the _env_ object of the _findPrimesImportObject_ object. The new line of code is: _LogPrime: logPrime,_
- In the _then_ method, of the WebAssembly.instantiateStreaming call, the underscore has been removed from in front of the _FindPrimes_ function call.

- The Emscripten command line has been adjusted:
  - It no longer includes the _-s SIDE\_MODULE=2_ flag.
  - The _--no-entry_ flag was included because there's no _main_ function defined. Including this flag prevents a compilation error.
  - The _ERROR\_ON\_UNDEFINED\_SYMBOLS=0_ flag was included so that the imported functions _IsPrime_ and _LogPrime_ don't cause a compilation error.


---

To compile the code in the _updated-code_ folder requires _Emscripten 3.1.33_.

The instructions for installing Emscripten can be found in _Appendix A_ of the book.


In order to install Emscripten, Python is required. Conveniently, Python also has the ability to run a local web server. You'll need to use a local web server to run many of the examples included. 

Although instructions for how to run Python's local web server can also be found in Appendix A, I recommend using the extension file that was created in the following article: "[Extending Python's Simple HTTP Server](https://cggallant.blogspot.com/2020/07/extending-pythons-simple-http-server.html)"


Python doesn't need to be used if you don't want to use it but you'll need to make sure that the web server you use has the **application/wasm** Media Type set for **.wasm** files.
