#!/bin/bash
emcc add.c -s EXTRA_EXPORTED_RUNTIME_METHODS=['ccall','cwrap'] -o js_plumbing.js