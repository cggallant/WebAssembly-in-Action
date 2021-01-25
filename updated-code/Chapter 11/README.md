In the _frontend_ folder, the _game.js_ file needs to be modified.

The _env_ object, of the _sideImportObject_ object, needs to be adjusted because the exported functions from the _main.wasm_ file no longer contain the underscore character. The following four lines of code need to be changed:
- _\_malloc: mainInstance.exports.\_malloc,_ to _\_malloc: mainInstance.exports.malloc,_
- _\_free: mainInstance.exports.\_free_, to _\_free: mainInstance.exports.free,_
- _\_SeedRandomNumberGenerator: mainInstance.exports.\_SeedRandomNumberGenerator,_ to _\_SeedRandomNumberGenerator: mainInstance.exports.SeedRandomNumberGenerator,_
- _\_GetRandomNumber: mainInstance.exports.\_GetRandomNumber,_ to _\_GetRandomNumber: mainInstance.exports.GetRandomNumber,_


In the _source_ folder, the _cards.wast_ file needs to be modified.

I had you place the string _"SecondCardSelectedCallback"_ starting at byte _1024_ in the module's memory thinking that if the main.wasm module decided to put anything into memory, 1024 bytes should be enough room to not interfere with it. It turns out that the main module has decided to start its memory at the 1024 byte as well.

In the _cards.wast_ file, locate the _$CardSelected_ function and scroll to the end. Just before the _call $Pause_ line of code is an _i32.const 1024_ line of code. Change this value to 5,120. The line of code should now be: _i32.const 5120_

Scroll to the very bottom of the _cards.wast_ file and change the value in the _data_ node from _1024_ to _5120_. The _data_ node should now be the following: _(data (i32.const 5120) "SecondCardSelectedCallback")_

Rebuild the _cards.wasm_ file by going to the _wat2wasm online tool_ (https://webassembly.github.io/wabt/demo/wat2wasm/), pasting the contents of the _cards.wast_ file into the top-left pane, and then click the _Download_ button. Name the file that you download to: _cards.wasm_  


- The Emscripten command line has been adjusted:
  - As of Emscripten 2.0.4, _malloc_ and _free_ are no longer exported by default. They now need to be included via the _EXPORTED\_FUNCTIONS command line array if needed.

---

To compile the code in the _updated-code_ folder requires _Emscripten 2.0.11_.

The instructions for installing Emscripten can be found in _Appendix A_ of the book.


In order to install Emscripten, Python is required. Conveniently, Python also has the ability to run a local web server. You'll need to use a local web server to run many of the examples included. 

Although instructions for how to run Python's local web server can also be found in Appendix A, I recommend using the extension file that was created in the following article: "[Extending Python's Simple HTTP Server](https://cggallant.blogspot.com/2020/07/extending-pythons-simple-http-server.html)"


Python doesn't need to be used if you don't want to use it but you'll need to make sure that the web server you use has the **application/wasm** Media Type set for **.wasm** files.
