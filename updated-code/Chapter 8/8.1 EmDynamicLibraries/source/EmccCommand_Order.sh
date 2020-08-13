#!/bin/bash
emcc validate_order.cpp -s SIDE_MODULE=2 -O1 -o validate_order.wasm