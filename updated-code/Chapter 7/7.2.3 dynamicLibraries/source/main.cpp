#include <cstdlib>

#ifdef __EMSCRIPTEN__
  #include <emscripten.h>
#endif

#ifdef __cplusplus
extern "C" {// So that the C++ compiler does not rename the functions below
#endif

extern void FindPrimes(int start, int end);

int main() {
  FindPrimes(3, 99);

  return 0;
}

#ifdef __cplusplus
}
#endif
