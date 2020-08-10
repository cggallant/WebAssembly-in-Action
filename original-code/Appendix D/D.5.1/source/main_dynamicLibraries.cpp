#include <cstdlib>
#include <cstdio>
#include <emscripten.h>

#ifdef __cplusplus
extern "C" {
#endif

extern int Add(int value1, int value2);

int main()
{
  int result = Add(24, 76);
  printf("Result of the call to the Add function: %d\n", result);

  return 0;
}

#ifdef __cplusplus
}
#endif

