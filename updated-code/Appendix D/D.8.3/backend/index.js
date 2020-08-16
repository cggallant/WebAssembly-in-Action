const clientData = {
  isProduct: true,
  name: "Women's Mid Rise Skinny Jeans",
  categoryId: "100",
  productId: "301",
  quantity: "10",
};

const MAXIMUM_NAME_LENGTH = 50;
const VALID_CATEGORY_IDS = [100, 101];
const VALID_PRODUCT_IDS = [200, 301];

// Will hold the Emscripten Module instance for the Product or Order linked WebAssembly module. Only
// need the one instance when using Node.js because you'll only be validating one webpage at a time.
let validationModule = null;

const Module = require('./validate_core.js');

function initializePage() {
  const moduleName = (clientData.isProduct ? 'validate_product.wasm' : 'validate_order.wasm');

  validationModule = new Module({
    dynamicLibraries: [moduleName],
    onRuntimeInitialized: runtimeInitialized,
  });
}

function runtimeInitialized() {
  if (clientData.isProduct) {
    if (validateName(clientData.name) && validateCategory(clientData.categoryId)) {
      // everything is ok...we can pass the data to the server-side code
    }
  }
  else { // Order Form...
    if (validateProduct(clientData.productId) && validateQuantity(clientData.quantity)) {
      // everything is ok...we can pass the data to the server-side code
    }
  }
}

global.setErrorMessage = function(error) { console.log(error); }

//-------------
// Edit Product functions...
//
function validateName(name) {
  const isValid = validationModule.ccall('ValidateName',
      'number',
      ['string', 'number'],
      [name, MAXIMUM_NAME_LENGTH]);

  return (isValid === 1);
}

function validateCategory(categoryId) {
  const arrayLength = VALID_CATEGORY_IDS.length;
  const bytesPerElement = validationModule.HEAP32.BYTES_PER_ELEMENT;
  const arrayPointer = validationModule._malloc((arrayLength * bytesPerElement));
  validationModule.HEAP32.set(VALID_CATEGORY_IDS, (arrayPointer / bytesPerElement));

  const isValid = validationModule.ccall('ValidateCategory', 
      'number',
      ['string', 'number', 'number'],
      [categoryId, arrayPointer, arrayLength]);

  validationModule._free(arrayPointer);

  return (isValid === 1);
}
//
// End of the Edit Product functions...
//-------------

//-------------
// Place Order functions...
//
function validateProduct(productId) {
  const arrayLength = VALID_PRODUCT_IDS.length;
  const bytesPerElement = validationModule.HEAP32.BYTES_PER_ELEMENT;
  const arrayPointer = validationModule._malloc((arrayLength * bytesPerElement));
  validationModule.HEAP32.set(VALID_PRODUCT_IDS, (arrayPointer / bytesPerElement));

  const isValid = validationModule.ccall('ValidateProduct',
      'number',
      ['string', 'number', 'number'],
      [productId, arrayPointer, arrayLength]);

  validationModule._free(arrayPointer);

  return (isValid === 1);
}

function validateQuantity(quantity) {
  const isValid = validationModule.ccall('ValidateQuantity',
      'number',
      ['string'],
      [quantity]);

  return (isValid === 1);
}
//
// End of the Place Order functions...
//-------------

// Now that all the code has been loaded, call the function
initializePage();