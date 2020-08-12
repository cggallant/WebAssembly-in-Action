#include <cstdlib>
#include <cstring>

#ifdef __EMSCRIPTEN__
  #include <emscripten.h>
#endif

#ifdef __cplusplus
extern "C" { // So that the C++ compiler does not rename our function names
#endif

  // Rather than defining the function signatures in each method's parameters, define them here to make the code a bit cleaner.
  typedef void(*OnSuccess)(void);
  typedef void(*OnError)(const char*);

  int ValidateValueProvided(const char* value)
  {
    // If the string is null or the first character is the null terminator then the string is empty
    if ((value == NULL) || (value[0] == '\0'))
    {
      return 0;
    }

    // Everything is ok
    return 1;
  }

#ifdef __EMSCRIPTEN__
  EMSCRIPTEN_KEEPALIVE
#endif
  void ValidateName(char* name, int maximum_length, OnSuccess UpdateHostOnSuccess, OnError UpdateHostOnError)
  {
    // Validation 1: A name must be provided
    if (ValidateValueProvided(name) == 0)
    {
      UpdateHostOnError("A Product Name must be provided.");
    }
    // Validation 2: A name must not exceed the specified length
    else if (strlen(name) > maximum_length)
    {
      UpdateHostOnError("The Product Name is too long.");
    }
    else // Everything is ok (no issues with the name)
    {
      UpdateHostOnSuccess();
    }
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
  void ValidateCategory(char* category_id, int* valid_category_ids, int array_length, OnSuccess UpdateHostOnSuccess, OnError UpdateHostOnError)
  {
    // Validation 1: A Category ID must be selected
    if (ValidateValueProvided(category_id) == 0)
    {
      UpdateHostOnError("A Product Category must be selected.");
    }
    // Validation 2: A list of valid Category IDs must be passed in
    else if ((valid_category_ids == NULL) || (array_length == 0))
    {
      UpdateHostOnError("There are no Product Categories available.");
    }
    // Validation 3: The selected Category ID must match one of the IDs provided
    else if (IsCategoryIdInArray(category_id, valid_category_ids, array_length) == 0)
    {
      UpdateHostOnError("The selected Product Category is not valid.");
    }
    else // Everything is ok (no issues with the category id)
    {
      UpdateHostOnSuccess();
    }
  }

#ifdef __cplusplus
}
#endif
