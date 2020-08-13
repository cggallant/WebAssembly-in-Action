// Will be called by the _FindPrimes method in the find_primes.wasm module
function logPrime(prime) {
  console.log(prime.toString());
}

const isPrimeImportObject = { };

// First load the is_prime.wasm side module
WebAssembly.instantiateStreaming(fetch("is_prime.wasm"), isPrimeImportObject)
.then(module => {
  // Then load the find_primes.wasm side module passing it the IsPrime 
  // method from the is_prime module.
  const findPrimesImportObject = {
    env: {
      IsPrime: module.instance.exports.IsPrime,
      LogPrime: logPrime,
    }
  };

  return WebAssembly.instantiateStreaming(fetch("find_primes.wasm"), findPrimesImportObject);

})
.then(module => {
  module.instance.exports.FindPrimes(3, 100);
});
