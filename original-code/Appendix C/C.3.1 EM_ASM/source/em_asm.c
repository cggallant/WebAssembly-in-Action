#include <emscripten.h>

int main()
{
  EM_ASM(console.log('EM_ASM macro calling'));
}
