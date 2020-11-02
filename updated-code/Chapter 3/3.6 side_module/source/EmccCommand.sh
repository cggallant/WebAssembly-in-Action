#!/bin/bash
emcc side_module.c -O1 --no-entry -s EXPORTED_FUNCTIONS=['_Increment'] -o side_module.wasm