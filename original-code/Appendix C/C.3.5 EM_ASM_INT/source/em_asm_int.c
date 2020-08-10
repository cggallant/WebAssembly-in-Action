#include <stdlib.h>
#include <stdio.h>
#include <emscripten.h>

int main() {
  char* message = (char*)EM_ASM_INT({
    const greetings = "Hello from EM_ASM_INT!";
    const byteCount = (Module.lengthBytesUTF8(greetings) + 1);

    const greetingsPointer = Module._malloc(byteCount);
    Module.stringToUTF8(greetings, greetingsPointer, byteCount);

    return greetingsPointer;
  });

  printf("%s\n", message);
  free(message);    
}