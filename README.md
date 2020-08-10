# Welcome to the "WebAssembly in Action" source code

![](https://images.manning.com/180/240/resize/book/7/97eac5c-498e-4454-bdb2-677ec3406f29/Gallant-WA-HI.png)

This repository holds the companion code for the book "[WebAssembly in Action](https://www.manning.com/books/webassembly-in-action)" in the [original-code](https://github.com/cggallant/WebAssembly-in-Action/tree/master/original-code) folder.

One of the tools used in the book is version _1.38.45_ of the _Emscripten toolkit_. Because the toolkit is constantly being improved, some of the items shown in the book need to be adjusted if you wish to use some of the more recent versions of the toolkit. In the coming days, I'll push up a new folder containing those modifications.


# Bonus content

If you're interested, I’ve written several articles exploring WebAssembly use beyond what was taught in the book:

- "[The import statement with an Emscripten-generated WebAssembly module in Vue.js](https://cggallant.blogspot.com/2020/01/the-import-statement-with-emscripten.html)"


This article shows you how you can build your Emscripten-generated WebAssembly module for use with Vue.js. It then shows you two approaches that you can use to load the module into your application.


- "[Extending Python's Simple HTTP Server](https://cggallant.blogspot.com/2020/07/extending-pythons-simple-http-server.html)" 

In the book, I used Python's Simple HTTP Server as a local web server because it was convenient due to the Emscripten toolkit including a copy of Python with its installation. At the time, I wasn't aware that you could extend Python's web server which would have made things a bit easier during your setup because you can include the WebAssembly Media Type in the file rather than having to edit one of Python's files.

This article is also a precursor to my next article "WebAssembly threads in Firefox" because that article will need two response headers returned which isn't possible by using Python’s web server.


- "[WebAssembly threads in Firefox](https://cggallant.blogspot.com/2020/07/webassembly-threads-in-firefox.html)" 

In the book I show you how to use WebAssembly threads but, at the time of the book's writing, they were only available in Firefox behind a flag. It's no longer behind a flag but Firefox has added a requirement: To enable the SharedArrayBuffer, you need to include two response headers. At the moment, this is Firefox specific but will soon be a requirement for all browsers that support WebAssembly threads including Chrome for Android _(August 2020)_, Firefox for Android _(soon)_, and Chrome desktop _(March 2021)_.


# Supporting this book

Many people buy books based on referrals or recommendations of those they trust. I would appreciate it if you could add your rating or review on any of the following websites:
- Manning Plublications: [https://www.manning.com/books/webassembly-in-action](https://www.manning.com/books/webassembly-in-action)
- Goodreads: [https://www.goodreads.com/book/show/45361484-webassembly-in-action](https://www.goodreads.com/book/show/45361484-webassembly-in-action)
- Amazon: [https://www.amazon.com/WebAssembly-Action-Gerard-Gallant/dp/1617295744/](https://www.amazon.com/WebAssembly-Action-Gerard-Gallant/dp/1617295744/)
- Your favorite book seller or even your blog

Don't yet have your own copy of the book? You can buy it from many book sellers including:
- Directly from Manning Publications (recommended): [https://www.manning.com/books/webassembly-in-action](https://www.manning.com/books/webassembly-in-action)
- Amazon: [https://www.amazon.com/s?k=webassembly+in+action](https://www.amazon.com/s?k=webassembly+in+action)
- Abebooks: [https://www.abebooks.com/servlet/BookDetailsPL?bi=30618231105&searchurl=kn%3Dwebassembly%2Bin%2Baction](https://www.abebooks.com/servlet/BookDetailsPL?bi=30618231105&searchurl=kn%3Dwebassembly%2Bin%2Baction)
- Barns & Noble: [https://www.barnesandnoble.com/w/webassembly-in-action-gerard-gallant/1131337158](https://www.barnesandnoble.com/w/webassembly-in-action-gerard-gallant/1131337158)



# Providing feedback

If you'd like to discuss the book's text, you can submit issues via the liveBook: [https://livebook.manning.com/book/webassembly-in-action/about-this-book/](https://livebook.manning.com/book/webassembly-in-action/about-this-book)

I'm also on twitter: [@Gerard_Gallant](https://twitter.com/Gerard_Gallant)




