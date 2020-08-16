#include <cstdlib>
#include <cstdio>

#ifdef __EMSCRIPTEN__
  #include <emscripten.h>
#endif

#ifdef __cplusplus
extern "C" { // So that the C++ compiler does not rename our function names
#endif

  // Define the function signature of the method that will be created in the JavaScript
  extern int IsOnline();

int main()
{
  printf("Are we online? %s\n", (IsOnline() == 1 ? "Yes" : "No"));  

  return 0;
}

#ifdef __cplusplus
}
#endif