mergeInto(LibraryManager.library, {
  IsOnline: function() {
    return (navigator.onLine ? 1 : 0);
  }
});