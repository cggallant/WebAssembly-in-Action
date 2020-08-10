#!/bin/bash
emcc calculate_primes_five_pthreads.cpp -O1 -std=c++11 -s USE_PTHREADS=1 -s PTHREAD_POOL_SIZE=5 -o five_pthreads.html