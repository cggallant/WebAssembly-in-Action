// Check if we're running in Node.js (might be running in a browser)
const IS_NODE = (typeof process === 'object' && typeof require === 'function');

// We're in the test runner (we'll load these in the 'before' function)
if (IS_NODE) {
  let chai = null;
  let Module = null;
}
else { // We're in the browser...
  // Using 'var' because it needs to be global in order for Emscripten's generated JavaScript code to see it
  var Module = {
    // Run the tests when Emscripten's JS tells us that it's ready to be interacted with
    onRuntimeInitialized: () => { mocha.run(); }
  };  
}

describe("Testing the validate.wasm module from chapter 4", () => {

  before(() => {
    if (IS_NODE) {
      // Load the Chai library
      chai = require('chai');
      
      // Load the Emscripten generated JavaScript. Because it might not be ready right away, return a Promise that will be
      // resolved once the module is ready to be interacted with
      return new Promise((resolve) => {
        Module = require('./validate.js');
        Module['onRuntimeInitialized'] = () => {
          resolve();
        }  
      }); // new Promise
    } // IS_NODE
  }); // before

  it("Pass an empty string", () => {
    const errorMessagePointer = Module._malloc(256);
    const name = "";
    const expectedMessage = "A Product Name must be provided.";
    
    const isValid = Module.ccall('ValidateName',
        'number',
        ['string', 'number', 'number'],
        [name, 50/*MAXIMUM_NAME_LENGTH*/, errorMessagePointer]);

    let errorMessage = "";
    if (isValid === 0) { errorMessage = Module.UTF8ToString(errorMessagePointer); }

    Module._free(errorMessagePointer);

    chai.expect(errorMessage).to.equal(expectedMessage);
  });

  it("Pass a string that's too long", () => {
    const errorMessagePointer = Module._malloc(256);
    const name = "Longer than 5 characters";
    const expectedMessage = "";
    
    const isValid = Module.ccall('ValidateName',
        'number',
        ['string', 'number', 'number'],
        [name, 50/*MAXIMUM_NAME_LENGTH*/, errorMessagePointer]);

    let errorMessage = "";
    if (isValid === 0) { errorMessage = Module.UTF8ToString(errorMessagePointer); }

    Module._free(errorMessagePointer);

    chai.expect(errorMessage).to.equal(expectedMessage);
  });
});