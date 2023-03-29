# Welcome to the "[WebAssembly in Action](https://www.manning.com/books/webassembly-in-action)" source code

<img src="https://images.manning.com/180/240/resize/book/7/97eac5c-498e-4454-bdb2-677ec3406f29/Gallant-WA-HI.png" align="left" /> This repository holds the companion code for the book "[WebAssembly in Action](https://www.manning.com/books/webassembly-in-action)" in the [original-code](https://github.com/cggallant/WebAssembly-in-Action/tree/master/original-code) folder.

One of the tools used in the book is version _1.38.45_ of the _Emscripten toolkit_. Because the toolkit is constantly being improved, some of the items shown in the book need to be adjusted if you wish to use some of the more recent versions of the toolkit. 

The code in the following folder has been updated to work with _Emscripten 3.1.33_: [updated-code](https://github.com/cggallant/WebAssembly-in-Action/tree/master/updated-code)

<p>&nbsp;</p>

# Python's local web server

Appendix A of the book gave instructions on how to run Python's local web server. While that works, back in June of 2020, I wrote the following article that detailed how to extend Python's web server so that things like response headers could be included: [Extending Python's Simple HTTP Server](https://cggallant.blogspot.com/2020/07/extending-pythons-simple-http-server.html)

I've included that article's script *(wasm-server.py)* in the root folder. If you have Python installed you can navigate to that folder in your terminal and run it with the following command: **python wasm-server.py**

Rather than installing Python directly, you can also pull the Python docker image instead: **docker pull python**

Then, run the following command to start up the web server and map a local port, 5000 in this example, to port 8080 in the container:
  **docker run -it --rm -p 5000:8080 -v "D:\WebAssembly-in-Action:/usr/src/myapp" -w /usr/src/myapp python:latest python wasm-server.py**

  If you use PowerShell, the **D:\WebAssembly-in-Action** portion of the path can be replaced with _${pwd}_. _${pwd}_ is a PowerShell object holding the full path of the current directory.

Once that's running, you just need to specify the relative path to the file you want to run. For example *(%20 where there are spaces)*: **http://localhost:5000/updated-code/Chapter%203/3.4%20html_template/html_template.html**


# Emscripten in a Docker container

In the book, Emscripten was installed on your OS. As an alternative, you can pull the version that you need as a Docker image from Docker hub (https://hub.docker.com/r/emscripten/emsdk/tags)

Then, the commands in the EmccCommand files could be prefixed with the following: **docker run --rm -v "D:\WebAssembly-in-Action:/src" emscripten/emsdk:3.1.33**

  If you're using PowerShell, you can replace the **D:\WebAssembly-in-Action** portion of the path with _${pwd}_. For example, building the module for Chapter 3, section '3.4 html_template': 
    **docker run --rm -v ${pwd}:/src emscripten/emsdk:3.1.33 emcc calculate_primes.c -o html_template.html**

  
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


- "[Hosting Uno Platform WebAssembly apps on Azure Static Web Apps](https://platform.uno/blog/hosting-uno-platform-webassembly-apps-on-azure-static-web-apps/)"

  This week there was an [announcement](https://azure.microsoft.com/en-us/blog/develop-production-scale-modern-web-apps-quickly-with-azure-static-web-apps/) that the Azure Static Web Apps service came out of preview.

  As the name implies, Azure Static Web Apps give you a way to host static web apps and it comes with many features including global distribution of your content and free SSL certificates to name a couple.

  Static web apps are applications where all the work happens in the browser and the app is decoupled from server-side code. Because an Uno Platform WebAssembly application is all client-side, it's a static web app and can take advantage of the Azure Static Web Apps service.

  I was honored with the opportunity to create an article that expands on some documentation that the Uno Platform already had on Azure Static Web Apps. In the article, I walk you through creating a GitHub repository, creating an Azure Static Web App, and then linking the two together. Then you create an Uno Platform WebAssembly application, check it into your repository, and see the Azure Static Web App automatically detect the change and deploy your new code.

  <img src="https://1.bp.blogspot.com/-GHXr6BPRJFs/YKGzn1mwKgI/AAAAAAAALoY/XGM-2qnArIUdk54EkIw795ImZOMKQSEWgCLcBGAsYHQ/s320/1.%2BOverall%2Bbut%2Bno%2Bannotations.png" width="350" align="center" />


- "[WebAssembly Fixed-Width SIMD from C#](https://cggallant.blogspot.com/2023/03/safari-164-and-webassembly-fixed-width.html)"

  On Monday, March 27th, 2023, Safari 16.4 was released and with it came support for WebAssembly's fixed-width SIMD feature! With this update, all modern browsers now support this feature.

  I wrote an article that walks you through creating an Uno Platform application and how to work with vectors to leverage SIMD in C#. The article also explains how to compile your application ahead-of-time (AOT) with SIMD support.

  
  <div align="center">
    <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiChYPQATCnlD6cV4hcdpRPGTcL_bsTojJUHQAgflXpp0R35NKKWD1adyFjKfLbml0fl9bXJ1bNPA4JvS7XuoQ8W0k-s5jOjliuuC2d5SeaS0pRw0pPxgqU7_EA8mFMkMi8L-UoqhMP5IBfPBn98GkpLc1EtXsErGdKRsMPa0leoUCEjLfPTFUi6Kpv/s372/1.%20SISD%20vs%20SIMD.png" width="375" />

    <div>A visual representation comparing data being processed</div>
    <div>one element at a time with normal arithmetic (Single</div>
    <div>Instruction, Single Data) versus four at a time, in</div>
    <div>this case, with SIMD</div>
  </div>
  
  

  I also wrote a short blog post to go with it that has a link to the Uno Platform article. The blog post includes information on how to do the same thing in Blazor WebAssembly and includes a link to a GitHub repo of the Blazor code.

  

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