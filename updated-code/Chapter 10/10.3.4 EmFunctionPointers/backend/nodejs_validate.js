const clientData = {
  name: "Women's Mid Rise Skinny Jeans",
  categoryId: "100",
};

const MAXIMUM_NAME_LENGTH = 50;
const VALID_CATEGORY_IDS = [100, 101];

function setErrorMessage(error) { console.log(error); }

const Module = require('./validate.js');

Module['onRuntimeInitialized'] = function() {
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

function createPointers(resolve, reject, returnPointers) {
  // Create anonymous functions that will be called by the C code
  const onSuccess = Module.addFunction(function() {
    // Free the function pointers and then call the resolve method of the promise
    freePointers(onSuccess, onError);
    resolve();
  }, 'v');

  const onError = Module.addFunction(function(errorMessage) {
    // Free the function pointers and then call the reject method of the promise
    freePointers(onSuccess, onError);
    reject(Module.UTF8ToString(errorMessage));
  }, 'vi');

  // Return the pointers to the calling function
  returnPointers.onSuccess = onSuccess;
  returnPointers.onError = onError;
}

function freePointers(onSuccess, onError){
  Module.removeFunction(onSuccess);
  Module.removeFunction(onError); 
}

function validateName(name) {
  return new Promise(function(resolve, reject) {

    // Create the function pointers
    const pointers = { onSuccess: null, onError: null };
    createPointers(resolve, reject, pointers);    

    Module.ccall('ValidateName',
        null,//return type of void
        ['string', 'number', 'number', 'number'],
        [name, MAXIMUM_NAME_LENGTH, pointers.onSuccess, pointers.onError]);

  });
}

function validateCategory(categoryId) {
  return new Promise(function(resolve, reject) {

    // Create the function pointers
    const pointers = { onSuccess: null, onError: null };
    createPointers(resolve, reject, pointers);    

    const arrayLength = VALID_CATEGORY_IDS.length;
    const bytesPerElement = Module.HEAP32.BYTES_PER_ELEMENT;
    const arrayPointer = Module._malloc((arrayLength * bytesPerElement));
    Module.HEAP32.set(VALID_CATEGORY_IDS, (arrayPointer / bytesPerElement));

    Module.ccall('ValidateCategory', 
        null,//return type of void
        ['string', 'number', 'number', 'number', 'number'],
        [categoryId, arrayPointer, arrayLength, pointers.onSuccess, pointers.onError]);

    Module._free(arrayPointer);

  });
}