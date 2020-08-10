#!/bin/bash
emcc calculate_primes.cpp -O1 -std=c++11 -s USE_PTHREADS=1 -s PTHREAD_POOL_SIZE=4 -o pthreads.html