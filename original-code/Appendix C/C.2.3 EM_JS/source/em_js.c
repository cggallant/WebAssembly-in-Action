#include <stdlib.h>
#include <emscripten.h>

// void return, a string for the parameter (pointers to any type can be passed in but the module's linear memory needs to be accessed directly to read them)
EM_JS(void, NoReturnValueWithStringParameter, (const char* string_pointer), {
  console.log("NoReturnValueWithStringParameter called: " +
      Module.UTF8ToString(string_pointer));
});

int main() 
{
  NoReturnValueWithStringParameter("Hello from WebAssembly");
  return 0;
}

