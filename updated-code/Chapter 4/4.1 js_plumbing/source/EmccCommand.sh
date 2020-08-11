#!/bin/bash
emcc validate.cpp -s EXTRA_EXPORTED_RUNTIME_METHODS=['ccall','UTF8ToString'] -o validate.js