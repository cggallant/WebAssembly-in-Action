#!/bin/bash
emcc main_dynamicLibraries.cpp -s MAIN_MODULE=1 --pre-js pre.js -o main_dynamicLibraries.html