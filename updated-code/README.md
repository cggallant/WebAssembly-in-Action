# The updated companion code for the book "[WebAssembly in Action](https://www.manning.com/books/webassembly-in-action)"

<img src="https://images.manning.com/180/240/resize/book/7/97eac5c-498e-4454-bdb2-677ec3406f29/Gallant-WA-HI.png" align="left" /> The code in this folder has been upgraded to work with version _3.1.32_ of the _Emscripten toolkit_.

  **Except for Chapter 8's code**... There is an issue preventing Chapter 8's code from being upgraded higher than 3.1.30. I'll be looking into that issue and will try to have a fix for it soon.

Each chapter's _README.md_ file lists the changes made to that chapter's code.

<p>&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;</p>


# Python's local web server

Appendix A of the book gave instructions on how to run Python's local web server. While that works, back in June of 2020, I wrote the following article that detailed how to extend Python's web server so that things like response headers could be included: [Extending Python's Simple HTTP Server](https://cggallant.blogspot.com/2020/07/extending-pythons-simple-http-server.html)

I've included that article's script *(wasm-server.py)* in the root folder. If you have Python installed you can navigate to that folder in your terminal and run it with the following command: **python wasm-server.py**

Rather than installing Python directly, you can also pull the Python docker image instead: **docker pull python**

Then, run the following command to start up the web server and map a local port, 5000 in this example, to port 8080 in the container:
  **docker run -it --rm -p 5000:8080 -v "D:\WebAssembly-in-Action:/usr/src/myapp" -w /usr/src/myapp python:latest python wasm-server.py**

  If you use PowerShell, the **D:\WebAssembly-in-Action** portion of the path can be replaced with ${pwd}. ${pwd} is a PowerShell object holding the full path of the current directory.

Once that's running, you just need to specify the relative path to the file you want to run. For example *(%20 where there are spaces)*: **http://localhost:5000/updated-code/Chapter%203/3.4%20html_template/html_template.html**


# Emscripten in a Docker container

In the book, Emscripten was installed on your OS. As an alternative, you can pull the version that you need as a Docker image from Docker hub (https://hub.docker.com/r/emscripten/emsdk/tags)

Then, the commands in the EmccCommand files could be prefixed with the following: **docker run --rm -v "D:\WebAssembly-in-Action:/src" emscripten/emsdk:3.1.32**

  If you're using PowerShell, you can replace the **D:\WebAssembly-in-Action** portion of the path with ${pwd}. For example, building the module for Chapter 3, section '3.4 html_template': 
    **docker run --rm -v ${pwd}:/src emscripten/emsdk:3.1.32 emcc calculate_primes.c -o html_template.html**
    

# Supporting this book

Don't yet have your own copy of the book? You can buy it from many book sellers including:
- Directly from Manning Publications _(recommended)_: [https://www.manning.com/books/webassembly-in-action](https://www.manning.com/books/webassembly-in-action)
- Amazon: [https://www.amazon.com/WebAssembly-Action-Gerard-Gallant/dp/1617295744/](https://www.amazon.com/WebAssembly-Action-Gerard-Gallant/dp/1617295744/)
- Abebooks: [https://www.abebooks.com/servlet/BookDetailsPL?bi=30618231105&searchurl=kn%3Dwebassembly%2Bin%2Baction](https://www.abebooks.com/servlet/BookDetailsPL?bi=30618231105&searchurl=kn%3Dwebassembly%2Bin%2Baction)
- Barns & Noble: [https://www.barnesandnoble.com/w/webassembly-in-action-gerard-gallant/1131337158](https://www.barnesandnoble.com/w/webassembly-in-action-gerard-gallant/1131337158)
