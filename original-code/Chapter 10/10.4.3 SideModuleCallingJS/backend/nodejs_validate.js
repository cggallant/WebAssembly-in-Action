const util = require('util');

const clientData = {
  name: "Women's Mid Rise Skinny Jeans",
  categoryId: "100",
};

const MAXIMUM_NAME_LENGTH = 50;
const VALID_CATEGORY_IDS = [100, 101];

let moduleMemory = null;
let moduleExports = null;

const fs = require('fs');
fs.readFile('validate.wasm', function(error, bytes) {
  if (error) { throw error; }

  instantiateWebAssembly(bytes);
});

function instantiateWebAssembly(bytes) {
  moduleMemory = new WebAssembly.Memory({initial: 256});

  const importObject = {    
    env: {
      __memory_base: 0,
      memory: moduleMemory,
      _UpdateHostAboutError: function(errorMessagePointer) {
        setErrorMessage(getStringFromMemory(errorMessagePointer));
      },
    }
  };

  WebAssembly.instantiate(bytes, importObject).then(result => {
    moduleExports = result.instance.exports;
    validateData();
  });
}

function setErrorMessage(error) { console.log(error); }

function validateData() {
  if (validateName(clientData.name) && validateCategory(clientData.categoryId)) {
    // no issues, we can save to the database
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
  const namePointer = moduleExports._create_buffer((name.length + 1));
  copyStringToMemory(name, namePointer);

  const isValid = moduleExports._ValidateName(namePointer, MAXIMUM_NAME_LENGTH);

  moduleExports._free_buffer(namePointer);

  return (isValid === 1);
}

function validateCategory(categoryId) {
  const categoryIdPointer = moduleExports._create_buffer((categoryId.length + 1));
  copyStringToMemory(categoryId, categoryIdPointer);

  const arrayLength = VALID_CATEGORY_IDS.length;
  const bytesPerElement = Int32Array.BYTES_PER_ELEMENT;
  const arrayPointer = moduleExports._create_buffer((arrayLength * bytesPerElement));

  const bytesForArray = new Int32Array(moduleMemory.buffer);
  bytesForArray.set(VALID_CATEGORY_IDS, (arrayPointer / bytesPerElement));

  const isValid = moduleExports._ValidateCategory(categoryIdPointer, arrayPointer, arrayLength);

  moduleExports._free_buffer(arrayPointer);
  moduleExports._free_buffer(categoryIdPointer);

  return (isValid === 1);
}