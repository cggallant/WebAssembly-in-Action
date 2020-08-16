#include <emscripten.h>

int main() {
  EM_ASM_({
    console.log('hello ' + Module.UTF8ToString($0));
  }, "world!");
}