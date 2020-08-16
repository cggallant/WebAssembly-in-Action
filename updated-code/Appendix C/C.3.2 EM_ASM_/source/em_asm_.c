#include <emscripten.h>

int main() {
  EM_ASM_({ 
    console.log('EM_ASM_ macro received the value: ' + $0);
  }, 10);
}
