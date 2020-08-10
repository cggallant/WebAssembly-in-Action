#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
int IsPrime(int value) 
{
  // If the number specified is 2, indicate that it's a prime (it's the only even number
  // that is a prime)
  if (value == 2) { return 1; }

  // If 1 or less is specified or an even number is specified then the current number is not a prime
  if (value <= 1 || value % 2 == 0) { return 0; }

  // A prime number is only divisible evenly by 1 and itself so skip 1 and 2. 
  // Only check odd numbers and stop once we've reached the square root of the number
  // (becomes redundant to check any numbers after that)
  for (int i = 3; (i * i) <= value; i += 2) 
  {
    // The current number is evenly divisible into value. value is not a prime number
    if (value % i == 0) { return 0; }
  }

  // The number could not be divided evenly by any number we checked. This is a prime number.
  return 1; 
}