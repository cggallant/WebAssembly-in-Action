#!/bin/bash
emcc em_js.c -s EXPORTED_RUNTIME_METHODS=['lengthBytesUTF8','stringToUTF8'] -s EXPORTED_FUNCTIONS=['_main','_malloc','_free'] -o em_js.html