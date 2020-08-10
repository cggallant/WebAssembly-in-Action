mergeInto(LibraryManager.library, {
  UpdateHostAboutError: function(errorMessagePointer) {
    setErrorMessage(Module.UTF8ToString(errorMessagePointer));
  }
});