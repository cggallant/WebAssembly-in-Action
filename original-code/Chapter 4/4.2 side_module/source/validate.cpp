// If this is an Emscripten (WebAssembly) build then...
#ifdef __EMSCRIPTEN__
  #include <emscripten.h>
#endif

#ifdef __cplusplus
extern "C" { // So that the C++ compiler does not rename our function names
#endif

#include "side_module_system_functions.h"

  int ValidateValueProvided(const char* value, const char* error_message, char* return_error_message)
  {
    // If the string is null or the first character is the null terminator then the string is empty
    if ((value == NULL) || (value[0] == '\0'))
    {
      strcpy(return_error_message, error_message);
      return 0;
    }

    // Everything is ok
    return 1;
  }

#ifdef __EMSCRIPTEN__
  EMSCRIPTEN_KEEPALIVE
#endif
  int ValidateName(char* name, int maximum_length, char* return_error_message)
  {
    // Validation 1: A name must be provided
    if (ValidateValueProvided(name, "A Product Name must be provided.", return_error_message) == 0)
    {
      return 0;
    }

    // Validation 2: A name must not exceed the specified length
    if (strlen(name) > maximum_length)
    {
      strcpy(return_error_message, "The Product Name is too long.");
      return 0;
    }

    // Everything is ok (no issues with the name)
    return 1;
  }

  int IsCategoryIdInArray(char* selected_category_id, int* valid_category_ids, int array_length)
  {
    // Loop through the array of valid ids that were passed in...
    int category_id = atoi(selected_category_id);
    for (int index = 0; index < array_length; index++)
    {
      // If the selected id is in the array then...
      if (valid_category_ids[index] == category_id)
      {
        // The user has a valid selection so exit now
        return 1;
      }
    }

    // We did not find the category id in the array
    return 0;
  }

#ifdef __EMSCRIPTEN__
  EMSCRIPTEN_KEEPALIVE
#endif
  int ValidateCategory(char* category_id, int* valid_category_ids, int array_length, char* return_error_message)
  {
    // Validation 1: A Category ID must be selected
    if (ValidateValueProvided(category_id, "A Product Category must be selected.", return_error_message) == 0)
    {
      return 0;
    }

    // Validation 2: A list of valid Category IDs must be passed in
    if ((valid_category_ids == NULL) || (array_length == 0))
    {
      strcpy(return_error_message, "There are no Product Categories available.");
      return 0;
    }

    // Validation 3: The selected Category ID must match one of the IDs provided
    if (IsCategoryIdInArray(category_id, valid_category_ids, array_length) == 0)
    {
      strcpy(return_error_message, "The selected Product Category is not valid.");
      return 0;
    }

    // Everything is ok (no issues with the category id)
    return 1;
  }

#ifdef __cplusplus
}
#endif