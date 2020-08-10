#include <cstdlib>

#ifdef __EMSCRIPTEN__
  #include <emscripten.h>
#endif

#ifdef __cplusplus
extern "C" { // So that the C++ compiler doesn't rename our function names below
#endif

  // Functions that are part of validate_core.cpp:
  extern int ValidateValueProvided(const char* value, const char* error_message);
  extern int IsIdInArray(char* selected_id, int* valid_ids, int array_length);

  // Function that will be imported from JavaScript
  extern void UpdateHostAboutError(const char* error_message);

#ifdef __EMSCRIPTEN__
  EMSCRIPTEN_KEEPALIVE
#endif
  int ValidateProduct(char* product_id, int* valid_product_ids, int array_length) 
  {
    // Validation 1: A Product ID must be selected
    if (ValidateValueProvided(product_id, "A Product must be selected.") == 0) 
    {
      return 0;
    }

    // Validation 2: A list of valid Product IDs must be passed in
    if ((valid_product_ids == NULL) || (array_length == 0))
    {
      UpdateHostAboutError("There are no Products available.");
      return 0;
    }

    // Validation 3: The selected Product ID must match one of the IDs provided
    if (IsIdInArray(product_id, valid_product_ids, array_length) == 0)
    {
      UpdateHostAboutError("The selected Product is not valid.");
      return 0;
    }

    // Everything is ok (no issues with the product id)
    return 1;
  }

#ifdef __EMSCRIPTEN__
  EMSCRIPTEN_KEEPALIVE
#endif
  int ValidateQuantity(char* quantity)
  {
    // Validation 1: The quantity must be provided
    if (ValidateValueProvided(quantity, "A quantity must be provided.") == 0)
    {
      return 0;
    }

    // Validation 2: The quantity must be greater than zero
    if (atoi(quantity) <= 0)
    {
      UpdateHostAboutError("Please enter a valid quantity.");
      return 0;
    }

    // Everything is ok (no issues with the quantity)
    return 1;
  }

#ifdef __cplusplus
}
#endif
