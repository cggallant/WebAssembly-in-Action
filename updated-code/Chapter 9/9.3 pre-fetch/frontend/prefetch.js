let compiledModule = null;
let emscriptenModule = null;

// Create a Web Worker and listen for messages from it
const worker = new Worker("prefetch.worker.js");
worker.onmessage = function(e) {
  // Place the compiled module in the global variable
  compiledModule = e.data;

  // Create a new instance of the Emscripten JavaScript Module object
  // and specify a callback function so that we can handle the WebAssembly
  // module's instantiation.
  Module({ instantiateWasm: onInstantiateWasm }).then((module) => {
    emscriptenModule = module;
  });
}

function onInstantiateWasm(importObject, successCallback) {
  // Instantiate the module
  WebAssembly.instantiate(compiledModule, importObject).then(instance =>
    // Pass the instance back to Emscripten's JavaScript
    successCallback(instance)
  ); 

  // Pass back an empty JavaScript object because instantiation was
  // performed asynchronously
  return {};
}
