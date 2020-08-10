#include <cstdlib>
#include <cstdio>
#include <dlfcn.h>
#include <emscripten.h>

typedef int(*Add)(int,int);

void CallAdd(const char* file_name)
{
  void* handle = dlopen("add.wasm", RTLD_NOW);
  if (handle == NULL) { return; }

  Add add = (Add)dlsym(handle, "Add");
  if (add == NULL) { return; }

  int result = add(4, 9);

  dlclose(handle);

  printf("Result of the call to the Add function: %d\n", result);
}

int main()
{
  emscripten_async_wget("add.wasm", "add.wasm", CallAdd, NULL);

  return 0;
}
