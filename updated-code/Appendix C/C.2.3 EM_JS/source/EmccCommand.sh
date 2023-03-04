#!/bin/bash
emcc em_js.c -s EXPORTED_RUNTIME_METHODS=['UTF8ToString'] -o em_js.html