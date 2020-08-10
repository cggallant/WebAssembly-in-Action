#include <stdlib.h>
#include <stdio.h>
#include <emscripten.h>

// string return, no parameters
EM_JS(char*, StringReturnValueWithNoParameters, (), {
  const greetings = "Hello from StringReturnValueWithNoParameters";

  // Determine how many bytes there are in the string and add an extra
  // byte for the null terminator.
  const byteCount = (Module.lengthBytesUTF8(greetings) + 1);

  // Allocate the memory and then copy the string into the memory  
  const greetingsPointer = Module._malloc(byteCount);
  Module.stringToUTF8(greetings, greetingsPointer, byteCount);

  // Return the pointer
  return greetingsPointer;
});

int main() 
{
  char* greetingsPointer = StringReturnValueWithNoParameters();

  printf("StringReturnValueWithNoParameters was called and it returned the following result: %s\n", greetingsPointer);

  // Be careful here. Any time malloc is used, free also needs to be used.
  free(greetingsPointer);

  return 0;
}

