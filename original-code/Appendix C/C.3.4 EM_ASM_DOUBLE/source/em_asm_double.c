#include <stdio.h>
#include <emscripten.h>

int main() {
  double sum = EM_ASM_DOUBLE({ 
    return $0 + $1;
  }, 10.5, 20.1);

  printf("EM_ASM_DOUBLE result: %.2f\n", sum);
}