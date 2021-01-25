#!/bin/bash
emcc find_primes.c --no-entry -O1 -s ERROR_ON_UNDEFINED_SYMBOLS=0 -o find_primes.wasm