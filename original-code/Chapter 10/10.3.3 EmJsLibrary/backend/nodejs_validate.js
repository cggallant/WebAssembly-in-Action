const clientData = {
  name: "Women's Mid Rise Skinny Jeans",
  categoryId: "100",
};

const MAXIMUM_NAME_LENGTH = 50;
const VALID_CATEGORY_IDS = [100, 101];

// Placed on the global object to the Emscripten generated JavaScript code can access the function
global.setErrorMessage = function(error) { console.log(error); }

const Module = require('./validate.js');

Module['onRuntimeInitialized'] = function() {
  if (validateName(clientData.name) && validateCategory(clientData.categoryId)) {
    // no issues, we can save to the database
  }
}

function validateName(name) {
  const isValid = Module.ccall('ValidateName',
      'number',
      ['string', 'number'],
      [name, MAXIMUM_NAME_LENGTH]);

  return (isValid === 1);
}

function validateCategory(categoryId) {
  const arrayLength = VALID_CATEGORY_IDS.length;
  const bytesPerElement = Module.HEAP32.BYTES_PER_ELEMENT;
  const arrayPointer = Module._malloc((arrayLength * bytesPerElement));
  Module.HEAP32.set(VALID_CATEGORY_IDS, (arrayPointer / bytesPerElement));

  const isValid = Module.ccall('ValidateCategory', 
      'number',
      ['string', 'number', 'number'],
      [categoryId, arrayPointer, arrayLength]);

  Module._free(arrayPointer);

  return (isValid === 1);
}