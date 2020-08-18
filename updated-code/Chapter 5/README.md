### The _5.1.1 EmJsLibrary_ folder

No changes were needed for this folder.

<p>&nbsp;</p>

### The _5.2.1 SideModuleCallingJS_ folder

When I wrote this book, I wanted you to be able to compile the module without the Emscripten-generated JavaScript code so that you could learn about the WebAssembly JavaScript API and gain a better understanding of how WebAssembly works.

I decided to use the Emscripten _SIDE_MODULE_ flag as a way to prevent the generation of the JavaScript code. The flag is intended to create modules for use with dynamic linking:
- A main module would be created that has JavaScript code and the standard C library functions and is linked to side modules at runtime.
- The side modules don't have the standard C library functions or JavaScript code.

Because the modules are designed to work together, the functions or their signatures, can be changed at any point by Emscripten's developers. So long as the main module's code is generated with the same version of Emscripten as the side modules, everything works with the dynamic linking. This ability to change doesn't happen very often but has caused the side module code in the book to be more brittle than I'd like.

At the moment, generating a stand-alone module is easier to work with than the side_module approach because you don't need to provide your own versions of the standard C library functions. Stand-alone modules aren't designed for use in a browser, but rather, for use in a WebAssembly System Interface (WASI) environment so there's still a chance that things may break with this approach over time. 

The changes I've made for this section's code are:
- Includes for the _cstdlib_, _cstdint_ and _cstring_ libraries have been added to the _validate.cpp_ file.
  - I reworked the _create\_buffer_ and _free\_buffer_ functions to use the _new_ and _delete_ keywords rather than the custom code it was using.
  - I then moved the functions from the _side\_module\_system\_functions.cpp_ file into the _validate.cpp_ file.
  - The include for the _side\_module\_system\_functions.h_ file has been removed from the _validate.cpp_ file.

- The _side\_module\_system\_functions.cpp_ and _side\_module\_system\_functions.h_ files have been deleted.

- The Emscripten command line has been adjusted:
  - It no longer includes the _side\_module\_system\_functions.cpp_ file or the _-s STANDALONE\_WASM=1_ flag.
  - You could include the _-s STANDALONE\_WASM=1_ flag but it's inferred by specifying the _.wasm_ extension for the output file.
  - The _--no-entry_ flag was included because there's no _main_ function defined. Including this flag prevents a compilation error.
  - Because you have an undefined symbol (the _UpdateHostAboutError_ function that you'll import into the module at runtime from the JavaScript code), you need to tell Emscripten to not treat that as an error. To do that, you use the _-s ERROR\_ON\_UNDEFINED\_SYMBOLS=0_ flag.


- A few changes were made to the _editproduct.js_ file:
  - In the _initializePage_ function:
    - The _moduleMemory = new WebAssembly.Memory({initial: 256});_ line of code has been deleted
    - In the _env_ object, within the _importObject_, the following changes were made:
      - The _\_\_memory\_base: 0,_ and _memory: moduleMemory,_ lines of code have been deleted
      - The underscore in front of _UpdateHostAboutError_ has been removed. The function has also been changed to use arrow notation but that's optional.
    - The _wasi\_snapshot\_preview1_ WASI object was added to the _importObject_ object with a _proc\_exit_ function
    - The _then_ method of the _instantiateStreaming_ function places a reference to the module's memory in the _moduleMemory_ object
  - All occurrences of the _\_create\_buffer_ function have been renamed to _create\_buffer_ (no leading underscore)
  - All occurrences of the _\_free\_buffer_ function have been renamed to _free\_buffer_ (no leading underscore)
  - In the _validateName_ function, the underscore has been removed from the _moduleExports.\_ValidateName_ function call. It's now: _moduleExports.ValidateName_
  - In the _validateCategory_ function, the underscore has been removed from the _moduleExports.\_ValidateCategory_ function call. It's now: _moduleExports.ValidateCategory_


---

To compile the code in the _updated-code_ folder requires _Emscripten 2.0.0_.

The instructions for installing Emscripten can be found in _Appendix A_ of the book.


In order to install Emscripten, Python is required. Conveniently, Python also has the ability to run a local web server. You'll need to use a local web server to run many of the examples included. 

Although instructions for how to run Python's local web server can also be found in Appendix A, I recommend using the extension file that was created in the following article: "[Extending Python's Simple HTTP Server](https://cggallant.blogspot.com/2020/07/extending-pythons-simple-http-server.html)"


Python doesn't need to be used if you don't want to use it but you'll need to make sure that the web server you use has the **application/wasm** Media Type set for **.wasm** files.
