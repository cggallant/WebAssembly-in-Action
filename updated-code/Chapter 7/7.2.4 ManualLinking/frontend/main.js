// Will be called by the _FindPrimes method in the find_primes.wasm module
function logPrime(prime) {
  console.log(prime.toString());
}

const isPrimeImportObject = {
  env: { 
    __memory_base: 0,
  }
};

// First load the is_prime.wasm side module
WebAssembly.instantiateStreaming(fetch("is_prime.wasm"), isPrimeImportObject)
.then(module => {
  // Then load the find_primes.wasm side module passing it the IsPrime 
  // method from the is_prime module.
  const findPrimesImportObject = {
    env: {
      __memory_base: 0,
      _IsPrime: module.instance.exports._IsPrime,
      _LogPrime: logPrime,
    }
  };

  return WebAssembly.instantiateStreaming(fetch("find_primes.wasm"), findPrimesImportObject);

})
.then(module => {
  module.instance.exports._FindPrimes(3, 100);
});
