#!/bin/bash
emcc validate.cpp --js-library mergeinto.js -s EXTRA_EXPORTED_RUNTIME_METHODS=['ccall','UTF8ToString'] -o validate.js