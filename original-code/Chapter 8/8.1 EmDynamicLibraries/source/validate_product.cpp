#include <cstdlib>
#include <cstring>

#ifdef __EMSCRIPTEN__
  #include <emscripten.h>
#endif

#ifdef __cplusplus
extern "C" { // So that the C++ compiler does not rename our function names
#endif

  // Functions that are part of validate_core.cpp:
  extern int ValidateValueProvided(const char* value, const char* error_message);
  extern int IsIdInArray(char* selected_id, int* valid_ids, int array_length);

  // Function that will be imported from JavaScript
  extern void UpdateHostAboutError(const char* error_message);

#ifdef __EMSCRIPTEN__
  EMSCRIPTEN_KEEPALIVE
#endif
  int ValidateName(char* name, int maximum_length)
  {
    // Validation 1: A name must be provided
    if (ValidateValueProvided(name, "A Product Name must be provided.") == 0)
    {
      return 0;
    }

    // Validation 2: A name must not exceed the specified length
    if (strlen(name) > maximum_length)
    {
      UpdateHostAboutError("The Product Name is too long.");
      return 0;
    }

    // Everything is ok (no issues with the name)
    return 1;
  }

#ifdef __EMSCRIPTEN__
  EMSCRIPTEN_KEEPALIVE
#endif
  int ValidateCategory(char* category_id, int* valid_category_ids, int array_length)
  {
    // Validation 1: A Category ID must be selected
    if (ValidateValueProvided(category_id, "A Product Category must be selected.") == 0)
    {
      return 0;
    }

    // Validation 2: A list of valid Category IDs must be passed in
    if ((valid_category_ids == NULL) || (array_length == 0))
    {
      UpdateHostAboutError("There are no Product Categories available.");
      return 0;
    }

    // Validation 3: The selected Category ID must match one of the IDs provided
    if (IsIdInArray(category_id, valid_category_ids, array_length) == 0)
    {
      UpdateHostAboutError("The selected Product Category is not valid.");
      return 0;
    }

    // Everything is ok (no issues with the category id)
    return 1;
  }

#ifdef __cplusplus
}
#endif
