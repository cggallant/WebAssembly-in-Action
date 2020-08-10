#!/bin/bash
emcc side_module_system_functions.cpp validate.cpp -s SIDE_MODULE=2 -O1 -o validate.wasm