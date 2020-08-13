#include <cstdlib>

#ifdef __EMSCRIPTEN__
  #include <emscripten.h>
#endif

#ifdef __cplusplus
extern "C" { // So that the C++ compiler does not rename our function names
#endif

  // Function that will be imported from JavaScript
  extern void UpdateHostAboutError(const char* error_message);

#ifdef __EMSCRIPTEN__
  EMSCRIPTEN_KEEPALIVE
#endif
  int ValidateValueProvided(const char* value, const char* error_message)
  {
    // If the string is null or the first character is the null terminator then the string is empty
    if ((value == NULL) || (value[0] == '\0'))
    {
      UpdateHostAboutError(error_message);
      return 0;
    }

    // Everything is ok
    return 1;
  }

#ifdef __EMSCRIPTEN__
  EMSCRIPTEN_KEEPALIVE
#endif
  int IsIdInArray(char* selected_id, int* valid_ids, int array_length)
  {
    // Loop through the array of valid ids that were passed in...
    int id = atoi(selected_id);
    for (int index = 0; index < array_length; index++)
    {
      // If the selected id is in the array then...
      if (valid_ids[index] == id)
      {
        // The user has a valid selection so exit now
        return 1;
      }
    }

    // We did not find the id in the array
    return 0;
  }

#ifdef __cplusplus
}
#endif
