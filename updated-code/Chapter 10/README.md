### The _10.3.1 JsPlumbingPrimes_ folder

No changes were needed for this folder.

### The _10.3.2 JsPlumbing_ folder

No changes were needed for this folder.

### The _10.3.3 EmJsLibrary_ folder

No changes were needed for this folder.

### The _10.3.4 EmFunctionPointers_ folder

No changes were needed for this folder.

<p>&nbsp;</p>

### The _10.4.1 SideModuleIncrement_ folder

- In the _nodejs_validate.js_ file:
  - In the the _then_ method of the _WebAssembly.instantiate_ function, don't include the underscore character in front of the _Increment_ function. The new code should be: `const value = result.instance.exports.Increment(2);`

### The _10.4.2 SideModule_ folder

- A few changes were made to the _nodejs\_validate.js_ file:
  - In the _instantiateWebAssembly_ function:
    - The _moduleMemory = new WebAssembly.Memory({initial: 256});_ line of code has been deleted
    - The _env_ object in the _importObject_ has been deleted
    - The _wasi\_snapshot\_preview1_ WASI object was added to the _importObject_ object with a _proc\_exit_ function
    - The _then_ method of the _WebAssembly.instantiate_ function places a reference to the module's memory in the _moduleMemory_ object
  - All occurrences of the _\_create\_buffer_ function have been renamed to _create\_buffer_ (no leading underscore)
  - All occurrences of the _\_free\_buffer_ function have been renamed to _free\_buffer_ (no leading underscore)
  - In the _validateName_ function, the underscore has been removed from the _moduleExports.\_ValidateName_ function call. It's now: _moduleExports.ValidateName_
  - In the _validateCategory_ function, the underscore has been removed from the _moduleExports.\_ValidateCategory_ function call. It's now: _moduleExports.ValidateCategory_

### The _10.4.3 SideModuleCallingJS_ folder

- A few changes were made to the _nodejs\_validate.js_ file:
  - In the _instantiateWebAssembly_ function:
    - The _moduleMemory = new WebAssembly.Memory({initial: 256});_ line of code has been deleted
    - In the _env_ object, within the _importObject_, the following changes were made:
      - The _\_\_memory\_base: 0,_ and _memory: moduleMemory,_ lines of code have been deleted
      - The underscore in front of _UpdateHostAboutError_ has been removed. The function has also been changed to use arrow notation but that's optional.
    - The _wasi\_snapshot\_preview1_ WASI object was added to the _importObject_ object with a _proc\_exit_ function
    - The _then_ method of the _WebAssembly.instantiate_ function places a reference to the module's memory in the _moduleMemory_ global variable
  - All occurrences of the _\_create\_buffer_ function have been renamed to _create\_buffer_ (no leading underscore)
  - All occurrences of the _\_free\_buffer_ function have been renamed to _free\_buffer_ (no leading underscore)
  - In the _validateName_ function, the underscore has been removed from the _moduleExports.\_ValidateName_ function call. It's now: _moduleExports.ValidateName_
  - In the _validateCategory_ function, the underscore has been removed from the _moduleExports.\_ValidateCategory_ function call. It's now: _moduleExports.ValidateCategory_

### The _10.4.4 SideModuleFunctionPointers_ folder

- A few changes were made to the _nodejs\_validate.js_ file:
  - In the _instantiateWebAssembly_ function:
    - The _moduleMemory = new WebAssembly.Memory({initial: 256});_ line of code has been deleted
    - The _moduleTable = new WebAssembly.Table({initial: 1, element: "anyfunc"});_ line of code has been deleted
    - The _env_ object, within the _importObject_, has been deleted
    - The _wasi\_snapshot\_preview1_ WASI object was added to the _importObject_ object with a _proc\_exit_ function
    - The _then_ method of the _WebAssembly.instantiate_ function places a reference to the module's memory in the _moduleMemory_ global variable and the module's table in the _moduleTable_ global variable.
  - All occurrences of the _\_create\_buffer_ function have been renamed to _create\_buffer_ (no leading underscore)
  - All occurrences of the _\_free\_buffer_ function have been renamed to _free\_buffer_ (no leading underscore)
  - In the _validateName_ function, the underscore has been removed from the _moduleExports.\_ValidateName_ function call. It's now: _moduleExports.ValidateName_
  - In the _validateCategory_ function, the underscore has been removed from the _moduleExports.\_ValidateCategory_ function call. It's now: _moduleExports.ValidateCategory_

---

This chapter uses Node.js

A version of Node.js is installed with the Emscripten SDK. Instructions for Node.js can be found in Appendix A, section A.3.