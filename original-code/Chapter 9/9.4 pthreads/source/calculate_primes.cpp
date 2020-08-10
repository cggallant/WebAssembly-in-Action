#include <cstdlib>
#include <cstdio>
#include <vector>
#include <chrono>
#include <pthread.h>
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
  // If the start value is even then increment so that we start with an odd number
  if (start % 2 == 0) { start++; }

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

struct thread_args 
{
  int start;
  int end;
  std::vector<int> primes_found;
};

void* thread_func(void* arg) 
{
   struct thread_args* args = (struct thread_args*)arg;

   FindPrimes(args->start, args->end, args->primes_found);

   return arg;
}

int main() 
{
  int start = 3, end = 1000000;
  printf("Prime numbers between %d and %d:\n", start, end);

  // Not using 'clock_t start = clock()' because that returns the CPU clock which includes how much CPU time each thread uses too.
  // We want to know the wall clock time that has passed.
  std::chrono::high_resolution_clock::time_point duration_start = std::chrono::high_resolution_clock::now();


  // Create an array to hold the ID of each thread created to make it easier to create/join. Also create an array of the arguments
  // to pass to each thread (1 more than the number of threads we're spawning because this main thread will also do some 
  // calculations (3 to 199999))
  pthread_t thread_ids[4];
  struct thread_args args[5];

  int args_index = 1; // Skip 0 so that the main thread can put the prime numbers it finds in the first args index
  int args_start = 200000; // The background threads will handle 200,000 to 1,000,000. The main thread will do 3 to 199,999.

  // Spin up each thread...
  for (int i = 0; i < 4; i++) {
    // Indicate the start and end range for the prime number search for the current thread
    args[args_index].start = args_start;
    args[args_index].end = (args_start + 199999);

    // Start the thread
    if (pthread_create(&thread_ids[i], NULL, thread_func, &args[args_index]))
    {
      perror("Thread create failed");
      return 1;
    }

    // Increment the values for the next loop
    args_index += 1;
    args_start += 200000;
  }

  // Use this main thread to also check for primes
  FindPrimes(3, 199999, args[0].primes_found);

  // Wait for each of the threads to finish...
  for (int j = 0; j < 4; j++)
  {
    pthread_join(thread_ids[j], NULL);
  }


  std::chrono::high_resolution_clock::time_point duration_end = std::chrono::high_resolution_clock::now();
  std::chrono::duration<double, std::milli> duration = (duration_end - duration_start);

  printf("FindPrimes took %f milliseconds to execute\n", duration.count());

  // Loop through each args object so that we can output the list of prime numbers 
  // found by each thread...
  printf("The values found:\n");
  for (int k = 0; k < 5; k++)
  {
    for(int n : args[k].primes_found) 
    {
      printf("%d ", n);
    }
  }
  printf("\n");

  return 0; 
}

#ifdef __cplusplus
}
#endif