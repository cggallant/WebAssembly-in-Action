### The _D.1.2_ folder
  
  Modify the _side_module.html_ (_frontend_ folder) file's JavaScript to call _.Increment_ rather than _.\_Increment_ and _.Decrement_ rather than _.\_Decrement_ (no leading underscore characters).
  
  The new code should be:
  
  ```javascript
  let value = result.instance.exports.Increment(17);
  ...

  value = result.instance.exports.Decrement(4);
  ...
  ```

  - The Emscripten command line has been adjusted:
    - It no longer includes the _-s SIDE\_MODULE=2_ flag.
    - The _--no-entry_ flag was included because there's no _main_ function defined. Including this flag prevents a compilation error.


### The _D.3.2_ folder
  
  No changes were needed for this folder.


### The _D.5.1_ folder
  
- The Emscripten command line has been adjusted:
  - Emscripten 3.1.32 was throwing a compile error because of the missing *Add* function in *main_dynamicLibraries.cpp*. The *-s ERROR_ON_UNDEFINED_SYMBOLS=0* flag was added to the command line of the *EmccCommand_main_dynamicLibraries* files.


### The _D.7.2_ folder

  - The _three\_pthreads.html.mem_ and _five\_pthreads.html.mem_ files aren't created by Emscripten anymore for the current module.
  
  - No changes would be needed to run this in Chrome desktop. 
    
    On July 28th, 2020, Firefox 79 was released with support for the _SharedArrayBuffer_ but, to enable it, you need to return two response headers:
    - _Cross-Origin-Opener-Policy_ (COOP) with the value _same-origin_.
    - _Cross-Origin-Embedder-Policy_ (COEP) with the value _require-corp_.
    
    **More Info:** My article "[WebAssembly threads in Firefox](https://cggallant.blogspot.com/2020/07/webassembly-threads-in-firefox.html)" explains the response headers and walks you through creating a web page that manipulates a user-supplied image using JavaScript, a non-threaded WebAssembly function, and a WebAssembly function that uses pthreads. It also shows you how to modify the _wasm-server.py_ file to include the response headers.
    
    Although the article title says 'Firefox', the response headers will soon be required by Chrome for Android _(August 2020)_, Firefox for Android _(soon)_, and Chrome desktop _(March 2021)_.


### The _D.8.3_ folder
  
  - In the _initializePage_ function (in the _index.js_ file), the _validationModule = new Module_ line of code has been replaced with a _Module_ object call having a _then_ method. The module instance received by the _then_ method is placed in the _validationModule_ global variable and then the _runtimeInitialized_ function is called.
  

### The _D.9.2_ folder
  
  - In the _source_ folder, in the _cards.wast_ file, the two instances of _i32.const 1024_ for the _SecondCardSelectedCallback_ string have been replaced with: _i32.const 5120_

  - At some point between Emscripten 2.0.8 and 2.0.11, the memory for main.wasm is no longer included in the importObject parameter of the instantiateWasm method. In the _game.js_ file, the _moduleMemory_ value now needs to be obtained from the module's exports in the _then_ method of the _instantiateStreaming_ function.

### The _D.10.2_ folder
  
  In the _source_ folder, the following changes are needed in the _cards.wast_ file because the _data_ node's position in the module's memory was adjusted from _1024_ to _5120_:
  - At the top of the _$InitializeCards_ function, the _i32.const 1051_ line of code before the _call $Log_ line of code needs to be changed from _1051_ to _5147_.
  - At the top of the _$PlayLevel_ function, the _i32.const 1067_ line of code before the _call $Log_ line of code needs to be changed from _1067_ to _5163_.
  - At the top of the _$SecondCardSelectedCallback_ function, the _i32.const 1024_ line of code before the _call $Log_ line of code needs to be changed from _1024_ to _5120_.
  - The _wat2wasm_ online tool now expects the string separator in the data node to be _\\00_. Adjust the data node to now be: _(data (i32.const 5120) "SecondCardSelectedCallback\\00InitializeCards\\00PlayLevel")_ 

  - At some point between Emscripten 2.0.8 and 2.0.11, the memory for main.wasm is no longer included in the importObject parameter of the instantiateWasm method. In the _game.js_ file, the _moduleMemory_ value now needs to be obtained from the module's exports in the _then_ method of the _instantiateStreaming_ function.


### The _D.11.2_ folder
  
  Updated the npm installations of Mocha and Chai...
  - Updated Mocha to version _10.2.0_
  - Updated Chai to version _4.3.7_

  If you're using the wasm-server.py file that I've included at the root of this solution, and if the COOP/COEP headers are enabled in the file, the CDN files for Mocha and Chai in tests.html will be blocked. I added the **crossorigin** property to the *Link* and *Script* tags in *tests.html* to allow them to be downloaded.


---

To compile the code in the _updated-code_ folder requires _Emscripten 3.1.32_.

The instructions for installing Emscripten can be found in _Appendix A_ of the book.


In order to install Emscripten, Python is required. Conveniently, Python also has the ability to run a local web server. You'll need to use a local web server to run many of the examples included. 

Although instructions for how to run Python's local web server can also be found in Appendix A, I recommend using the extension file that was created in the following article: "[Extending Python's Simple HTTP Server](https://cggallant.blogspot.com/2020/07/extending-pythons-simple-http-server.html)"


Python doesn't need to be used if you don't want to use it but you'll need to make sure that the web server you use has the **application/wasm** Media Type set for **.wasm** files.
