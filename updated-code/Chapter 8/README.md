When the _MODULARIZE_ flag is used when compiling the WebAssembly module, creating a _Module_ object will now return a _Promise_. As a result, a couple changes were needed in the _switchForm_ function of the _index.js_ file (_frontend_ folder):
- The _productModule = new Module_ line of code has been replaced with a _Module_ object call having a _then_ method. The module instance received by the _then_ method is placed in the _productModule_ global variable.
- The _orderModule = new Module_ line of code has been replaced with a _Module_ object call having a _then_ method. The module instance received by the _then_ method is placed in the _orderModule_ global variable.

As of Emscripten 3.1.31, when linking a side module to a main module via *dynamicLibraries*, the side module's exported functions are not exposed to the JavaScript code from Emscripten's Module object. As a result, the logic for this chapter's code was adjusted so that the *validate_product* and *validate_order* modules are now main modules and *validate_core* is now a side module. Each main module was given a name *(ModuleProduct and ModuleOrder respectively)*.
- In the *index.html* file (*frontend* folder), the *validate_core.js* script at the end of the file has been replaced by two script tags. One for *valdiate_order.js* and one for *validate_product.js*.
- In the *index.js* file (*frontend* folder), the *switchForm* function was adjusted to use the new module object names and to specify *validate_core.wasm* for both the productModule and orderModule.

The Emscripten command lines have been adjusted for each of the files:
  - *validate_core.cpp* is now built as a side module *(a validate_core.js file is also no longer generated and has been deleted)*
  - *validate_order.cpp* and *validate_product.cpp* are now built as main modules
    - Each is given a name *(ModuleOrder and ModuleProduct respectively)*
    - *_malloc* and *_free* need to be included for use by the *index.js* file's code
    - Because validate_order.cpp and validate_product.cpp both reference functions that don't exist in their code, the *-s ERROR_ON_UNDEFINED_SYMBOLS=0* flag was needed to cause the compiler to treat that as a warning rather than an error.
    - Emscripten 3.1.32 was giving a warning that the command line argument *EXTRA_EXPORTED_RUNTIME_METHODS* has been deprecated and to use *EXPORTED_RUNTIME_METHODS* instead. That adjustment has been made.

---

To compile the code in this folder requires _Emscripten 3.1.32_. 

The instructions for installing Emscripten can be found in _Appendix A_ of the book.


In order to install Emscripten, Python is required. Conveniently, Python also has the ability to run a local web server. You'll need to use a local web server to run many of the examples included. 

Although instructions for how to run Python's local web server can also be found in Appendix A, I recommend using the extension file that was created in the following article: "[Extending Python's Simple HTTP Server](https://cggallant.blogspot.com/2020/07/extending-pythons-simple-http-server.html)"


Python doesn't need to be used if you don't want to use it but you'll need to make sure that the web server you use has the **application/wasm** Media Type set for **.wasm** files.
