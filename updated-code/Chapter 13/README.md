Updated the npm installations of Mocha and Chai...
- Updated Mocha to version _10.2.0_
- Updated Chai to version _4.3.7_

If you're using the wasm-server.py file that I've included at the root of this solution, and if the COOP/COEP headers are enabled in the file, the CDN files for Mocha and Chai in tests.html will be blocked. I added the **crossorigin** property to the *Link* and *Script* tags in *tests.html* to allow them to be downloaded.

---

This chapter uses Mocha and Chai which are both available via npm. npm is a package manager that comes with Node.js

A version of Node.js is installed with the Emscripten SDK.

To run the tests via Node.js, you can use the following command:
  **npm test tests.js**