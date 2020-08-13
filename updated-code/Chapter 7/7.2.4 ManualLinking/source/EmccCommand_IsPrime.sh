#!/bin/bash
emcc is_prime.c -s SIDE_MODULE=2 -O1 -o is_prime.wasm