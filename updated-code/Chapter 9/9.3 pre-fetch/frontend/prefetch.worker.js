WebAssembly.compileStreaming(fetch("calculate_primes.wasm"))
.then(module => {
  self.postMessage(module);
});
