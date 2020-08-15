#include <cstdlib>
#include <ctime>
#include <emscripten.h>

#ifdef __cplusplus
extern "C" {// So that the C++ compiler doesn't rename our function names below
#endif

// System methods needed by cards.wasm because it will be built using only the 
// WebASsembly Text Format. Not shown here but malloc and free are also exported 
// by default by the Emscripten compiler (they are also needed by cards.wasm)
//
EMSCRIPTEN_KEEPALIVE
void SeedRandomNumberGenerator() { srand(time(NULL)); }

EMSCRIPTEN_KEEPALIVE
int GetRandomNumber(int range) { return (rand() % range); }

#ifdef __cplusplus
}
#endif