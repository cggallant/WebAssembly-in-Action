#include <emscripten.h>

// From the is_prime side module to check if the number is a prime or not
extern int IsPrime(int value);

// From the JavaScript code to log the prime number to the browser's console
extern void LogPrime(int prime);

// The function that can be called when using dynamic linking
EMSCRIPTEN_KEEPALIVE
void FindPrimes(int start, int end)
{
  // Loop through the odd numbers to see which ones are prime numbers
  for (int i = start; i <= end; i += 2)
  {
    // If the current number is a prime number then pass the value to the console
    // of the browser
    if (IsPrime(i))
    {
      LogPrime(i);
    }
  }
}