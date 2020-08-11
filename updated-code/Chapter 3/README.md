The only change needed for this chapter's code was to modify the _side_module.html_ file's JavaScript to call _.Increment_ rather than _.\_Increment_.

The new code should be:

```javascript
const value = result.instance.exports.Increment(17);
```


---

To compile the code in the _updated-code_ folders requires _Emscripten 1.40.1_.

The instructions for installing Emscripten can be found in _Appendix A_ of the book.


In order to install Emscripten, Python is required. Conveniently, Python also has the ability to run a local web server. You'll need to use a local web server to run many of the examples included. 

Although instructions for how to run Python's local web server can also be found in Appendix A, I recommend using the extension file that was created in the following article: "[Extending Python's Simple HTTP Server](https://cggallant.blogspot.com/2020/07/extending-pythons-simple-http-server.html)"


Python doesn't need to be used if you don't want to use it but you'll need to make sure that the web server you use has the **application/wasm** Media Type set for **.wasm** files.
