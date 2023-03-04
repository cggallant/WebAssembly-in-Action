docker run --rm -v ${pwd}:/src emscripten/emsdk emcc add.c -s "EXPORTED_RUNTIME_METHODS=['ccall','cwrap']" -o js_plumbing.js
