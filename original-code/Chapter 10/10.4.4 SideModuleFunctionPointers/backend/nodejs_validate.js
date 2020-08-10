const util = require('util');

const clientData = {
  name: "Women's Mid Rise Skinny Jeans",
  categoryId: "100",
};

const MAXIMUM_NAME_LENGTH = 50;
const VALID_CATEGORY_IDS = [100, 101];

let validateOnSuccessNameIndex = -1;
let validateOnSuccessCategoryIndex = -1;
let validateOnErrorNameIndex = -1;
let validateOnErrorCategoryIndex = -1;
let validateNameCallbacks = { resolve: null, reject: null };
let validateCategoryCallbacks = { resolve: null, reject: null };

let moduleMemory = null;
let moduleExports = null;
let moduleTable = null;

const fs = require('fs');
fs.readFile('validate.wasm', function(error, bytes) {
  if (error) { throw error; }

  instantiateWebAssembly(bytes);
});

function instantiateWebAssembly(bytes) {
  moduleMemory = new WebAssembly.Memory({initial: 256});
  moduleTable = new WebAssembly.Table({initial: 1, element: "anyfunc"});

  const importObject = {    
    env: {
      __memory_base: 0,
      memory: moduleMemory,
      __table_base: 0,
      table: moduleTable,
      abort: function(i) { throw new Error('abort'); },
    }
  };

  WebAssembly.instantiate(bytes, importObject).then(result => {
    moduleExports = result.instance.exports;

    // Have anonymous functions created for the success and error function pointers that
    // the module's ValdiateName and ValidateCategory functions will call.
    validateOnSuccessNameIndex = addToTable(() => { 
      onSuccessCallback(validateNameCallbacks);
    }, 'v');

    validateOnSuccessCategoryIndex = addToTable(() => {
      onSuccessCallback(validateCategoryCallbacks);
    }, 'v');

    validateOnErrorNameIndex = addToTable((errorMessagePointer) => {
      onErrorCallback(validateNameCallbacks, errorMessagePointer);
    }, 'vi');

    validateOnErrorCategoryIndex = addToTable((errorMessagePointer) => {
      onErrorCallback(validateCategoryCallbacks, errorMessagePointer);
    }, 'vi');

    validateData();
  });
}

function addToTable(jsFunction, signature) {
  // Determine what the Table object's current size is. That will be the new item's index
  const index = moduleTable.length;

  // Grow the table by one to allow for the new function to be added. Convert the JavaScript function
  // into a Wasm function.
  moduleTable.grow(1); 
  moduleTable.set(index, convertJsFunctionToWasm(jsFunction, signature));

  // Tell the caller the index of JavaScript function in the Table
  return index;
}

// Copied from validate.js in the WebAssembly\Chapter 6\6.1.2 EmFunctionPointers\frontend\ folder.
// 
// It looks complicated but, basically, it creates a small Wasm module on the fly that imports the JavaScript function
// you specified. The module exports that same function as a WebAssembly function that can then be inserted into 
// WebAssembly.Table objects.
//
function convertJsFunctionToWasm(func, sig) {
  // The module is static, with the exception of the type section, which is
  // generated based on the signature passed in.
  var typeSection = [
    0x01, // id: section,
    0x00, // length: 0 (placeholder)
    0x01, // count: 1
    0x60, // form: func
  ];
  var sigRet = sig.slice(0, 1);
  var sigParam = sig.slice(1);
  var typeCodes = {
    'i': 0x7f, // i32
    'j': 0x7e, // i64
    'f': 0x7d, // f32
    'd': 0x7c, // f64
  };

  // Parameters, length + signatures
  typeSection.push(sigParam.length);
  for (var i = 0; i < sigParam.length; ++i) {
    typeSection.push(typeCodes[sigParam[i]]);
  }

  // Return values, length + signatures
  // With no multi-return in MVP, either 0 (void) or 1 (anything else)
  if (sigRet == 'v') {
    typeSection.push(0x00);
  } else {
    typeSection = typeSection.concat([0x01, typeCodes[sigRet]]);
  }

  // Write the overall length of the type section back into the section header
  // (excepting the 2 bytes for the section id and length)
  typeSection[1] = typeSection.length - 2;

  // Rest of the module is static
  var bytes = new Uint8Array([
    0x00, 0x61, 0x73, 0x6d, // magic ("\0asm")
    0x01, 0x00, 0x00, 0x00, // version: 1
  ].concat(typeSection, [
    0x02, 0x07, // import section
      // (import "e" "f" (func 0 (type 0)))
      0x01, 0x01, 0x65, 0x01, 0x66, 0x00, 0x00,
    0x07, 0x05, // export section
      // (export "f" (func 0 (type 0)))
      0x01, 0x01, 0x66, 0x00, 0x00,
  ]));

   // We can compile this wasm module synchronously because it is very small.
  // This accepts an import (at "e.f"), that it reroutes to an export (at "f")
  var module = new WebAssembly.Module(bytes);
  var instance = new WebAssembly.Instance(module, {
    e: {
      f: func
    }
  });
  var wrappedFunc = instance.exports.f;
  return wrappedFunc;
}

function onSuccessCallback(validateCallbacks) {
  // Call the resolve method for the Promise and then remove both function pointers from the
  // object
  validateCallbacks.resolve();
  validateCallbacks.resolve = null;
  validateCallbacks.reject = null;
}

function onErrorCallback(validateCallbacks, errorMessagePointer) {
  // Read the error message from the module's memory
  const errorMessage = getStringFromMemory(errorMessagePointer);

  // Call the reject method for the Promise and then remove both function pointers from the
  // object
  validateCallbacks.reject(errorMessage);
  validateCallbacks.resolve = null;
  validateCallbacks.reject = null;
}

function setErrorMessage(error) { console.log(error); }

function validateData() {
  Promise.all([
    validateName(clientData.name),
    validateCategory(clientData.categoryId)
  ])
  .then(() => {
     // everything is ok...we can save
  })
  .catch((error) => { 
    setErrorMessage(error);
  });
}

function createPointers(isForName, resolve, reject, returnPointers) {
  // Pass the function pointers of the Promise object to the appropriate object
  if (isForName) {
    validateNameCallbacks.resolve = resolve;
    validateNameCallbacks.reject = reject;

    // Return the indexes to the calling function
    returnPointers.onSuccess = validateOnSuccessNameIndex;
    returnPointers.onError = validateOnErrorNameIndex;
  } else {
    validateCategoryCallbacks.resolve = resolve;
    validateCategoryCallbacks.reject = reject;

    // Return the indexes to the calling function
    returnPointers.onSuccess = validateOnSuccessCategoryIndex;
    returnPointers.onError = validateOnErrorCategoryIndex;
  }
}

function getStringFromMemory(memoryOffset) {
  let returnValue = "";

  const size = 256;
  const bytes = new Uint8Array(moduleMemory.buffer, memoryOffset, size);
  
  let character = "";
  for (let i = 0; i < size; i++) {
    character = String.fromCharCode(bytes[i]);
    if (character === "\0") { break;}
    
    returnValue += character;
  }

  return returnValue;
}

function copyStringToMemory(value, memoryOffset) {
  const bytes = new Uint8Array(moduleMemory.buffer);
  bytes.set(new util.TextEncoder().encode((value + "\0")), memoryOffset);
}

function validateName(name) {
  return new Promise(function(resolve, reject) {

    // Create the function pointers
    const pointers = { onSuccess: null, onError: null };
    createPointers(true, resolve, reject, pointers);

    const namePointer = moduleExports._create_buffer((name.length + 1));
    copyStringToMemory(name, namePointer);

    moduleExports._ValidateName(namePointer, MAXIMUM_NAME_LENGTH, pointers.onSuccess, pointers.onError);

    moduleExports._free_buffer(namePointer);
  });
}

function validateCategory(categoryId) {
  return new Promise(function(resolve, reject) {

    // Create the function pointers
    const pointers = { onSuccess: null, onError: null };
    createPointers(false, resolve, reject, pointers);

    const categoryIdPointer = moduleExports._create_buffer((categoryId.length + 1));
    copyStringToMemory(categoryId, categoryIdPointer);

    const arrayLength = VALID_CATEGORY_IDS.length;
    const bytesPerElement = Int32Array.BYTES_PER_ELEMENT;
    const arrayPointer = moduleExports._create_buffer((arrayLength * bytesPerElement));

    const bytesForArray = new Int32Array(moduleMemory.buffer);
    bytesForArray.set(VALID_CATEGORY_IDS, (arrayPointer / bytesPerElement));

    moduleExports._ValidateCategory(categoryIdPointer, arrayPointer, arrayLength, pointers.onSuccess, pointers.onError);

    moduleExports._free_buffer(arrayPointer);
    moduleExports._free_buffer(categoryIdPointer);
  });
}