#include <cstdlib>
#include <cstdio>
#include <emscripten.h>

#ifdef __cplusplus
extern "C" {// So that the C++ compiler does not rename the functions below
#endif

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

// The function that can be called when using dynamic linking
EMSCRIPTEN_KEEPALIVE
void FindPrimes(int start, int end)
{
  printf("Prime numbers between %d and %d:\n", start, end);

  // Loop through the odd numbers to see which ones are prime numbers
  for (int i = start; i <= end; i += 2)
  {
    // If the current number is a prime number then pass the value to the console
    // of the browser
    if (IsPrime(i))
    {
      printf("%d ", i);
    }
  }
  printf("\n");
}

// The main method for use when built as a normal WebAssembly module (not a side module)
int main() 
{
  FindPrimes(3, 100000);

  return 0; 
}

#ifdef __cplusplus
}
#endif