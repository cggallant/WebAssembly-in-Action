emcc validate_order.cpp --js-library mergeinto.js -s MAIN_MODULE=2 -s MODULARIZE=1 -s EXPORT_NAME="ModuleOrder" -s EXPORTED_FUNCTIONS=['_malloc','_free','_atoi'] -s EXPORTED_RUNTIME_METHODS=['ccall','UTF8ToString'] -s ERROR_ON_UNDEFINED_SYMBOLS=0 -o validate_order.js