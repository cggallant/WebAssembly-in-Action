#!/bin/bash
emcc validate_core.cpp -s SIDE_MODULE=2 -O1 -o validate_core.wasm