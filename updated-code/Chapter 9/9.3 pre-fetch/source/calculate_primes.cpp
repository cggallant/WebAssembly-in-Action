#include <cstdlib>
#include <cstdio>
#include <vector>
#include <chrono>
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

void FindPrimes(int start, int end, std::vector<int>& primes_found)
{
  // Loop through the odd numbers to see which ones are prime numbers
  for (int i = start; i <= end; i += 2)
  {
    // If the current number is a prime number then pass the value to the console
    // of the browser
    if (IsPrime(i))
    {
      primes_found.push_back(i);
    }
  }
}

int main() 
{
  int start = 3, end = 1000000;
  printf("Prime numbers between %d and %d:\n", start, end);

  // Not using 'clock_t start = clock()' because that returns the CPU clock which includes how much CPU time each thread uses too.
  // We want to know the wall clock time that has passed.
  std::chrono::high_resolution_clock::time_point duration_start = std::chrono::high_resolution_clock::now();

  std::vector<int> primes_found;
  FindPrimes(start, end, primes_found);

  std::chrono::high_resolution_clock::time_point duration_end = std::chrono::high_resolution_clock::now();
  std::chrono::duration<double, std::milli> duration = (duration_end - duration_start);

  printf("FindPrimes took %f milliseconds to execute\n", duration.count());

  printf("The values found:\n");
  for(int n : primes_found) 
  {
    printf("%d ", n);
  }
  printf("\n");

  return 0; 
}

#ifdef __cplusplus
}
#endif