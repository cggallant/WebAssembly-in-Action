#!/bin/bash
emcc find_primes.c -s SIDE_MODULE=2 -O1 -o find_primes.wasm