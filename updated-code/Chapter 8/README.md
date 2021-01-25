When the _MODULARIZE_ flag is used when compiling the WebAssembly module, creating a _Module_ object will now return a _Promise_. As a result, a couple changes were needed in the _switchForm_ function of the _index.js_ file (_frontend_ folder):
- The _productModule = new Module_ line of code has been replaced with a _Module_ object call having a _then_ method. The module instance received by the _then_ method is placed in the _productModule_ global variable.
- The _orderModule = new Module_ line of code has been replaced with a _Module_ object call having a _then_ method. The module instance received by the _then_ method is placed in the _orderModule_ global variable.


---

To compile the code in the _updated-code_ folder requires _Emscripten 2.0.11_.

The instructions for installing Emscripten can be found in _Appendix A_ of the book.


In order to install Emscripten, Python is required. Conveniently, Python also has the ability to run a local web server. You'll need to use a local web server to run many of the examples included. 

Although instructions for how to run Python's local web server can also be found in Appendix A, I recommend using the extension file that was created in the following article: "[Extending Python's Simple HTTP Server](https://cggallant.blogspot.com/2020/07/extending-pythons-simple-http-server.html)"


Python doesn't need to be used if you don't want to use it but you'll need to make sure that the web server you use has the **application/wasm** Media Type set for **.wasm** files.
