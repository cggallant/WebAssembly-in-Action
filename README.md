# Welcome to the "[WebAssembly in Action](https://www.manning.com/books/webassembly-in-action)" source code

<img src="https://images.manning.com/180/240/resize/book/7/97eac5c-498e-4454-bdb2-677ec3406f29/Gallant-WA-HI.png" align="left" /> This repository holds the companion code for the book "[WebAssembly in Action](https://www.manning.com/books/webassembly-in-action)" in the [original-code](https://github.com/cggallant/WebAssembly-in-Action/tree/master/original-code) folder.

One of the tools used in the book is version _1.38.45_ of the _Emscripten toolkit_. Because the toolkit is constantly being improved, some of the items shown in the book need to be adjusted if you wish to use some of the more recent versions of the toolkit. 

The code in the following folder has been updated to work with _Emscripten 2.0.11_: [updated-code](https://github.com/cggallant/WebAssembly-in-Action/tree/master/updated-code)

<p>&nbsp;</p>
  
# Bonus content

If you're interested, I’ve written several articles exploring WebAssembly use beyond what was taught in the book:

- "[The import statement with an Emscripten-generated WebAssembly module in Vue.js](https://cggallant.blogspot.com/2020/01/the-import-statement-with-emscripten.html)"
  
  <a href="https://commons.wikimedia.org/wiki/File:Vue.js_Logo_2.svg" target="_blank"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/200px-Vue.js_Logo_2.svg.png" width="50" align="left" /></a> This article shows you how you can build your Emscripten-generated WebAssembly module for use with Vue.js. It then shows you two approaches that you can use to load the module into your application.


- "[Extending Python's Simple HTTP Server](https://cggallant.blogspot.com/2020/07/extending-pythons-simple-http-server.html)" 
  
  <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg" width="50" align="left" /> In the book, I used Python's Simple HTTP Server as a local web server because it was convenient due to Emscripten's need of it for its installation. At the time, I wasn't aware that you could extend Python's web server which would have made things a bit easier during your setup because you can include the WebAssembly Media Type in the file rather than having to edit one of Python's files.
  
  This article shows you how to extend Python’s Simple HTTP Server. It’s also a precursor to my next article "WebAssembly threads in Firefox" because that article will need two response headers returned which isn't possible when using Python’s web server.


- "[WebAssembly threads in Firefox](https://cggallant.blogspot.com/2020/07/webassembly-threads-in-firefox.html)" 
  
  <img src="https://1.bp.blogspot.com/-20aC9uX8oPc/XyAh6PICkBI/AAAAAAAALOI/C4SMdZl69YA4pqkfTcaYRwvYfU0l_MA6ACLcBGAsYHQ/w400-h174/9%2B-%2BScreen%2Bshot%2Bof%2Bfinal%2Bproduct%2Bwith%2Bimages%2Bshown.png" width="350" align="right" /> In the book I show you how to use WebAssembly threads but, at the time of the book's writing, they were only available in Firefox behind a flag. They're no longer behind a flag but Firefox has added a requirement: To enable the SharedArrayBuffer, you need to include two response headers.

  This article walks you through returning the response headers, including the crossorigin attribute, and using WebAssembly threads to convert a user-supplied image to greyscale.
  
  At the moment, this is Firefox specific but will soon be a requirement for all browsers that support WebAssembly threads including Chrome for Android _(January 2021)_, Firefox for Android _(soon)_, and Chrome desktop _(March 2021)_.


- "[Using WebAssembly modules in C#](https://platform.uno/blog/using-webassembly-modules-in-c/)"
  
  In my book I show you how to use an Emscripten-generated WebAssembly module in the browser and on the server in Node.js. I also mention the [WebAssembly System Interface](https://hacks.mozilla.org/2019/03/standardizing-wasi-a-webassembly-system-interface/) (WASI) whose aim is to create a standard approach to running WebAssembly modules outside the browser in a safe way. 

  While there were a lot of exciting things being worked on with WASI at the time, unfortunately, it wasn’t until after the book went to production that an early preview of the Wasmtime runtime was announced for .NET Core.
  
  I  wrote this article to show you how your C# code can load and use a WebAssembly module via the Wasmtime runtime for .NET. The article also covers how to create custom model validation with ASP.NET Core MVC.
  
  <img src="https://1.bp.blogspot.com/-tlOcF_PBsMs/X0P6KNf32JI/AAAAAAAALTI/Pp8hdU8X06kmgm94qUb0PF16Y35APvSUwCLcBGAsYHQ/s711/z_%2BWebAssembly%2Bin%2BC%2523_%2Bimage%2Bfor%2Bmy%2Bblog%2Bpost%2Band%2Bsocial%2Bmedia.png" width="350" align="center" />


- "[Blazor WebAssembly and the Dovico Time Entry Status app](https://cggallant.blogspot.com/2020/10/blazor-webassembly-and-dovico-time.html)"

  <img src="https://1.bp.blogspot.com/-8cXpMqDHpR8/X33BYgdJUwI/AAAAAAAALZ4/hrMYW0nxDVMPcwiQ_x4dmWntiUNq9Im1wCLcBGAsYHQ/w640-h408/1%2B-%2BScreenShotOfTheBlazorApp.png" width="350" align="right" />

  Over the past few weeks, I've been digging into WebAssembly from a C# perspective for an article that I'm writing. To aid in that learning, I decided to use some research time that my company gave me to dig into Blazor WebAssembly by rewriting a small Java application that I built in 2011.

  This article walks you through creating the Dovico Time Entry Status app using Blazor WebAssembly.


<p>&nbsp;</p>
<p>&nbsp;</p>


# Supporting this book

Many people buy books based on referrals or recommendations of those they trust. I would appreciate it if you could add your rating or review on any of the following websites:
- Manning Plublications: [https://www.manning.com/books/webassembly-in-action](https://www.manning.com/books/webassembly-in-action)
- Goodreads: [https://www.goodreads.com/book/show/45361484-webassembly-in-action](https://www.goodreads.com/book/show/45361484-webassembly-in-action)
- Amazon: [https://www.amazon.com/WebAssembly-Action-Gerard-Gallant/dp/1617295744/](https://www.amazon.com/WebAssembly-Action-Gerard-Gallant/dp/1617295744/)
- Your favorite book seller or even your own blog.

Don't yet have your own copy of the book? You can buy it from many book sellers including:
- Directly from Manning Publications _(recommended)_: [https://www.manning.com/books/webassembly-in-action](https://www.manning.com/books/webassembly-in-action)
- Amazon: [https://www.amazon.com/WebAssembly-Action-Gerard-Gallant/dp/1617295744/](https://www.amazon.com/WebAssembly-Action-Gerard-Gallant/dp/1617295744/)
- Abebooks: [https://www.abebooks.com/servlet/BookDetailsPL?bi=30618231105&searchurl=kn%3Dwebassembly%2Bin%2Baction](https://www.abebooks.com/servlet/BookDetailsPL?bi=30618231105&searchurl=kn%3Dwebassembly%2Bin%2Baction)
- Barns & Noble: [https://www.barnesandnoble.com/w/webassembly-in-action-gerard-gallant/1131337158](https://www.barnesandnoble.com/w/webassembly-in-action-gerard-gallant/1131337158)



# Providing feedback

If you'd like to discuss the book's text, you can submit issues via the liveBook: [https://livebook.manning.com/book/webassembly-in-action/about-this-book/](https://livebook.manning.com/book/webassembly-in-action/about-this-book)

You can also find me here:
- Twitter: [@Gerard_Gallant](https://twitter.com/Gerard_Gallant)
- Facebook: [WebAssembly in Action](https://www.facebook.com/WebAssembly-in-Action-111681507332045/)