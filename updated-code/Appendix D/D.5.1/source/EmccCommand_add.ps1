docker run --rm -v ${pwd}:/src emscripten/emsdk emcc add.c -s SIDE_MODULE=2 -O1 -o add.wasm