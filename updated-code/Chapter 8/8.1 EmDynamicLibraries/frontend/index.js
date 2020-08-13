const initialProductData = {
  name: "Women's Mid Rise Skinny Jeans",
  categoryId: "100",
};

const MAXIMUM_NAME_LENGTH = 50;
const VALID_CATEGORY_IDS = [100, 101];
const VALID_PRODUCT_IDS = [200, 301];

// Will hold the Emscripten Module instances for the Product and Order linked WebAssembly modules
let productModule = null;
let orderModule = null;

function initializePage() {
  document.getElementById("name").value = initialProductData.name;

  const category = document.getElementById("category");
  const count = category.length;
  for (let index = 0; index < count; index++) {
    if (category[index].value === initialProductData.categoryId) {
      category.selectedIndex = index;
      break;
    }
  }

  // If there's a hash in the URI (e.g. #EditProduct or #PlaceOrder) and it's for the
  // Place Order form then adjust the flag so that the Order form is displayed by 
  // default...
  let showEditProduct = true;
  if ((window.location.hash) && (window.location.hash.toLowerCase() === "#placeorder")) {
    showEditProduct = false;
  }

  // Make sure the proper form is displayed and Emscripten Module object is created
  switchForm(showEditProduct);
}

// Helper to adjust the controls to show the proper view
function switchForm(showEditProduct) {
  // Just in case there was an error message displayed from the previous form, clear the message
  setErrorMessage("");
  setActiveNavLink(showEditProduct);
  setFormTitle(showEditProduct);

  if (showEditProduct) {
    // Only create the Emscripten Module object for the Edit Product form the once...
    if (productModule === null) {
      Module({ dynamicLibraries: ['validate_product.wasm'] }).then((module) => {
        productModule = module;
      });
    }
 
    // Show the Edit Product controls
    showElement("productForm", true);
    showElement("orderForm", false);
  } else {
    // Only create the Emscripten Module object for the Order form the once...
    if (orderModule === null) {
      Module({ dynamicLibraries: ['validate_order.wasm'] }).then((module) => {
        orderModule = module;
      });
    }

    // Show the Order form's controls
    showElement("productForm", false);
    showElement("orderForm", true);
  }
}

// Helper to cause the proper link in the navigation bar to indicate that it's active
function setActiveNavLink(editProduct) {
  const navEditProduct = document.getElementById("navEditProduct");
  const navPlaceOrder = document.getElementById("navPlaceOrder");
  navEditProduct.classList.remove("active");
  navPlaceOrder.classList.remove("active");

  if (editProduct) { navEditProduct.classList.add("active"); }
  else { navPlaceOrder.classList.add("active"); }
}

function setFormTitle(editProduct) {
  const title = (editProduct ? "Edit Product" : "Place Order");
  document.getElementById("formTitle").innerText = title;
}

function showElement(elementId, show) {
  const element = document.getElementById(elementId);
  element.style.display = (show ? "" : "none");
}

function getSelectedDropdownId(elementId) {
  const dropdown = document.getElementById(elementId);
  const index = dropdown.selectedIndex;
  if (index !== -1) { return dropdown[index].value; }

  return "0";
}

function setErrorMessage(error) {
  const errorMessage = document.getElementById("errorMessage");
  errorMessage.innerText = error; 
  showElement("errorMessage", (error !== ""));
}

//-------------
// Edit Product functions...
//
function onClickSaveProduct() {
  // Clear any error message that might already be displayed from a previous click
  setErrorMessage("");

  const name = document.getElementById("name").value;
  const categoryId = getSelectedDropdownId("category");

  if (validateName(name) && validateCategory(categoryId)) {
    // everything is ok...we can pass the data to the server-side code    
  }
}

function validateName(name) {
  const isValid = productModule.ccall('ValidateName',
      'number',
      ['string', 'number'],
      [name, MAXIMUM_NAME_LENGTH]);

  return (isValid === 1);
}

function validateCategory(categoryId) {
  const arrayLength = VALID_CATEGORY_IDS.length;
  const bytesPerElement = productModule.HEAP32.BYTES_PER_ELEMENT;
  const arrayPointer = productModule._malloc((arrayLength * bytesPerElement));
  productModule.HEAP32.set(VALID_CATEGORY_IDS, (arrayPointer / bytesPerElement));

  const isValid = productModule.ccall('ValidateCategory', 
      'number',
      ['string', 'number', 'number'],
      [categoryId, arrayPointer, arrayLength]);

  productModule._free(arrayPointer);

  return (isValid === 1);
}
//
// End of the Edit Product functions...
//-------------

//-------------
// Place Order functions...
//
function onClickAddToCart() {
  // Clear any error message that might already be displayed from a previous click
  setErrorMessage("");

  const productId = getSelectedDropdownId("product");
  const quantity = document.getElementById("quantity").value;

  if (validateProduct(productId) && validateQuantity(quantity)) {
    // everything is ok...we can pass the data to the server-side code
  }
}

function validateProduct(productId) {
  const arrayLength = VALID_PRODUCT_IDS.length;
  const bytesPerElement = orderModule.HEAP32.BYTES_PER_ELEMENT;
  const arrayPointer = orderModule._malloc((arrayLength * bytesPerElement));
  orderModule.HEAP32.set(VALID_PRODUCT_IDS, (arrayPointer / bytesPerElement));

  const isValid = orderModule.ccall('ValidateProduct',
      'number',
      ['string', 'number', 'number'],
      [productId, arrayPointer, arrayLength]);

  orderModule._free(arrayPointer);

  return (isValid === 1);
}

function validateQuantity(quantity) {
  const isValid = orderModule.ccall('ValidateQuantity',
      'number',
      ['string'],
      [quantity]);

  return (isValid === 1);
}
//
// End of the Place Order functions...
//-------------