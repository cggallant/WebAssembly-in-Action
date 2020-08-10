#!/bin/bash
emcc em_asm_int.c -s EXTRA_EXPORTED_RUNTIME_METHODS=['lengthBytesUTF8','stringToUTF8'] -o em_asm_int.html