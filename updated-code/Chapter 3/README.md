
### The _3.6 side\_module_ folder

The only change needed for this chapter's code was to modify the _side_module.html_ file's JavaScript to call _.Increment_ rather than _.\_Increment_.

The new code should be:

```javascript
const value = result.instance.exports.Increment(17);
```

When I wrote this book, I wanted you to be able to compile the module without the Emscripten-generated JavaScript code so that you could learn about the WebAssembly JavaScript API and gain a better understanding of how WebAssembly works.

I decided to use the Emscripten _SIDE_MODULE_ flag as a way to prevent the generation of the JavaScript code. The flag is intended to create modules for use with dynamic linking:
- A main module would be created that has JavaScript code and the standard C library functions and is linked to side modules at runtime.
- The side modules don't have the standard C library functions or JavaScript code.

Because the modules are designed to work together, the functions or their signatures, can be changed at any point by Emscripten's developers. So long as the main module's code is generated with the same version of Emscripten as the side modules, everything works with the dynamic linking. This ability to change doesn't happen very often but has caused the side module code in the book to be more brittle than I'd like.

At the moment, generating a stand-alone module is easier to work with than the side_module approach because you don't need to provide your own versions of the standard C library functions. Stand-alone modules aren't designed for use in a browser, but rather, for use in a WebAssembly System Interface (WASI) environment so there's still a chance that things may break with this approach over time. 


- The Emscripten command line has been adjusted:
  - It no longer includes the _-s SIDE\_MODULE=2_ flag.
  - The _--no-entry_ flag was included because there's no _main_ function defined. Including this flag prevents a compilation error.

---

To compile the code in the _updated-code_ folder requires _Emscripten 3.1.33_.

The instructions for installing Emscripten can be found in _Appendix A_ of the book.


In order to install Emscripten, Python is required. Conveniently, Python also has the ability to run a local web server. You'll need to use a local web server to run many of the examples included. 

Although instructions for how to run Python's local web server can also be found in Appendix A, I recommend using the extension file that was created in the following article: "[Extending Python's Simple HTTP Server](https://cggallant.blogspot.com/2020/07/extending-pythons-simple-http-server.html)"


Python doesn't need to be used if you don't want to use it but you'll need to make sure that the web server you use has the **application/wasm** Media Type set for **.wasm** files.
