### The _C.2.1 EM\_JS_ folder
  
  No changes were needed for this folder.

### The _C.2.2 EM\_JS_ folder
  
  No changes were needed for this folder.

### The _C.2.3 EM\_JS_ folder
  
  No changes were needed for this folder.

### The _C.2.4 EM\_JS_ folder
  
- The Emscripten command line has been adjusted:
  - As of Emscripten 2.0.4, _malloc_ and _free_ are no longer exported by default. They now need to be included via the _EXPORTED\_FUNCTIONS command line array if needed.

### The _C.3.1 EM\_ASM_ folder
  
  No changes were needed for this folder.

### The _C.3.2 EM\_ASM\__ folder
  
  No changes were needed for this folder.

### The _C.3.3 EM\_ASM\__ folder
  
  No changes were needed for this folder.

### The _C.3.4 EM\_ASM\_DOUBLE_ folder
  
  No changes were needed for this folder.

### The _C.3.5 EM\_ASM\_INT_ folder
  
- The Emscripten command line has been adjusted:
  - As of Emscripten 2.0.4, _malloc_ and _free_ are no longer exported by default. They now need to be included via the _EXPORTED\_FUNCTIONS command line array if needed.

---

To compile the code in the _updated-code_ folder requires _Emscripten 2.0.11_.

The instructions for installing Emscripten can be found in _Appendix A_ of the book.


In order to install Emscripten, Python is required. Conveniently, Python also has the ability to run a local web server. You'll need to use a local web server to run many of the examples included. 

Although instructions for how to run Python's local web server can also be found in Appendix A, I recommend using the extension file that was created in the following article: "[Extending Python's Simple HTTP Server](https://cggallant.blogspot.com/2020/07/extending-pythons-simple-http-server.html)"


Python doesn't need to be used if you don't want to use it but you'll need to make sure that the web server you use has the **application/wasm** Media Type set for **.wasm** files.
