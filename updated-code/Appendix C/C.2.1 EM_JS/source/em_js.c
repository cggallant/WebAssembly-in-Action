#include <emscripten.h>

// void return, no parameters
EM_JS(void, NoReturnValueWithNoParameters, (), {
  console.log("NoReturnValueWithNoParameters called");
});

int main()
{
  NoReturnValueWithNoParameters();
  return 0;
}