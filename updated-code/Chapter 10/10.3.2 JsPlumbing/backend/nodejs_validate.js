const clientData = {
  name: "Women's Mid Rise Skinny Jeans",
  categoryId: "100",
};

const MAXIMUM_NAME_LENGTH = 50;
const VALID_CATEGORY_IDS = [100, 101];

function setErrorMessage(error) { console.log(error); }

const Module = require('./validate.js');

Module['onRuntimeInitialized'] = function() {
  let errorMessage = "";
  const errorMessagePointer = Module._malloc(256);

  if (!validateName(clientData.name, errorMessagePointer) ||
      !validateCategory(clientData.categoryId, errorMessagePointer)) {
    errorMessage = Module.UTF8ToString(errorMessagePointer);
  }

  Module._free(errorMessagePointer);

  setErrorMessage(errorMessage);
  if (errorMessage === "") {
    // no issues, we can save to the database
  }
}

function validateName(name, errorMessagePointer) {
  const isValid = Module.ccall('ValidateName',
      'number',
      ['string', 'number', 'number'],
      [name, MAXIMUM_NAME_LENGTH, errorMessagePointer]);

  return (isValid === 1);
}

function validateCategory(categoryId, errorMessagePointer) {
  const arrayLength = VALID_CATEGORY_IDS.length;
  const bytesPerElement = Module.HEAP32.BYTES_PER_ELEMENT;
  const arrayPointer = Module._malloc((arrayLength * bytesPerElement));
  Module.HEAP32.set(VALID_CATEGORY_IDS, (arrayPointer / bytesPerElement));

  const isValid = Module.ccall('ValidateCategory', 
      'number',
      ['string', 'number', 'number', 'number'],
      [categoryId, arrayPointer, arrayLength, errorMessagePointer]);

  Module._free(arrayPointer);

  return (isValid === 1);
}