### The _6.1.2 EmFunctionPointers_ folder

No changes were needed for this folder.

<p>&nbsp;</p>

### The _6.2.2 SideModuleFunctionPointers_ folder

The changes I've made for this section's code are:
- Includes for the _cstdlib_, _cstdint_ and _cstring_ libraries have been added to the _validate.cpp_ file.
  - The include for the _side\_module\_system\_functions.h_ file has been removed from the _validate.cpp_ file.
  - I reworked the _create\_buffer_ and _free\_buffer_ functions to use the _new_ and _delete_ keywords rather than the custom code it was using and then moved them from the _side\_module\_system\_functions.cpp_ file into the _validate.cpp_ file.
  
- The _side\_module\_system\_functions.cpp_ and _side\_module\_system\_functions.h_ files have been deleted.

- The Emscripten command line (_EmccCommand.bat/EmccCommand.sh_ files) has been adjusted:
  - It no longer includes the _side\_module\_system\_functions.cpp_ file or the _-s STANDALONE\_WASM=1_ flag.
  - You could include the _-s STANDALONE\_WASM=1_ flag but it's inferred by specifying the _.wasm_ extension for the output file.
  - The _--no-entry_ flag was included because there's no _main_ function defined. Including this flag prevents a compilation error.
  - By default a stand-alone module doesn't export the module's _table_ which is needed by the JavaScript code. 
    - In Emscripten 1.39.0, you needed to update the Emscripten emcc.py file to allow the _--growable-table_ flag. You don't need to edit the file anymore.
    - You need to tell the Emscripten linker to export the table by using the _--export-table_ flag. You also need to tell the linker to allow the table to grow by using the _--growable-table_ flag. Otherwise, the table size remains fixed at 2.


- A few changes were made to the _editproduct.js_ file:
  - In the _initializePage_ function:
    - The _moduleMemory = new WebAssembly.Memory({initial: 256});_ line of code has been deleted
    - The _moduleTable = new WebAssembly.Table({initial: 1, element: "anyfunc"});_ line of code has been deleted
    - The contents of the _importObject_ were deleted and replaced with the _wasi\_snapshot\_preview1_ WASI object that in turn has a _proc\_exit_ function
    - The _then_ method of the _instantiateStreaming_ function places a reference to the module's memory in the _moduleMemory_ object and the module's table in the _moduleTable_ object
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
