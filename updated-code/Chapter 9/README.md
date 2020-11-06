### The _9.3 pre-fetch_ folder

- In the _worker.onmessage_ method (in the _prefetch.js_ file), the _emscriptenModule = new Module_ line of code has been replaced with a _Module_ object call having a _then_ method. The module instance received by the _then_ method is placed in the _emscriptenModule_ global variable.


### The _9.4 pthreads_ folder

- The _pthreads.html.mem_ file isn't created by Emscripten anymore for the current module. I haven't dug into it to see if it's gone for all modules or just the current module's configuration.

- No changes would be needed to run this in Chrome desktop. 
  
  On July 28th, 2020, Firefox 79 was released with support for the _SharedArrayBuffer_ but, to enable it, you need to return two response headers:
  - _Cross-Origin-Opener-Policy_ (COOP) with the value _same-origin_.
  - _Cross-Origin-Embedder-Policy_ (COEP) with the value _require-corp_.

  **More Info:** My article "[WebAssembly threads in Firefox](https://cggallant.blogspot.com/2020/07/webassembly-threads-in-firefox.html)" explains the response headers and walks you through creating a web page that manipulates a user-supplied image using JavaScript, a non-threaded WebAssembly function, and a WebAssembly function that uses pthreads. It also shows you how to modify the _wasm-server.py_ file to include the response headers.

    Although the article title says 'Firefox', the response headers will soon be required by Chrome for Android _(August 2020)_, Firefox for Android _(soon)_, and Chrome desktop _(March 2021)_.


---

To compile the code in the _updated-code_ folder requires _Emscripten 2.0.8_.

The instructions for installing Emscripten can be found in _Appendix A_ of the book.


In order to install Emscripten, Python is required. Conveniently, Python also has the ability to run a local web server. You'll need to use a local web server to run many of the examples included. 

Although instructions for how to run Python's local web server can also be found in Appendix A, I recommend using the extension file that was created in the following article: "[Extending Python's Simple HTTP Server](https://cggallant.blogspot.com/2020/07/extending-pythons-simple-http-server.html)"


Python doesn't need to be used if you don't want to use it but you'll need to make sure that the web server you use has the **application/wasm** Media Type set for **.wasm** files.
