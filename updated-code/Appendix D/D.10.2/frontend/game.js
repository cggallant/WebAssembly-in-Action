let moduleMemory = null;
let moduleExports = null;

var Module = {
  instantiateWasm: function(importObject, successCallback) {
    moduleMemory = importObject.env.memory;
    let mainInstance = null;

    // Instantiate the module
    WebAssembly.instantiateStreaming(fetch("main.wasm"), importObject)
    .then(result => {
      mainInstance = result.instance;
      
      const sideImportObject = {    
        env: {
          memory: moduleMemory,
          _malloc: mainInstance.exports.malloc,
          _free: mainInstance.exports.free,
          _SeedRandomNumberGenerator: mainInstance.exports.SeedRandomNumberGenerator,
          _GetRandomNumber: mainInstance.exports.GetRandomNumber,
          _GenerateCards: generateCards,
          _UpdateTriesTotal: updateTriesTotal,
          _FlipCard: flipCard,
          _RemoveCards: removeCards,
          _LevelComplete: levelComplete,
          _Pause: pause,
          _Log: log,
        }
      };

     return WebAssembly.instantiateStreaming(fetch("cards.wasm"), sideImportObject)   

    }).then(sideInstanceResult => {
       moduleExports = sideInstanceResult.instance.exports;

       // Pass the main module's instance to Emscripten    
       successCallback(mainInstance);
    });


    // Pass back an empty JavaScript object because instantiation was
    // performed asynchronously
    return {}; 
  }
};

// Called by the module to have the UI to create cards for the rows and columns indicated
function generateCards(rows, columns, level, tries) {
  document.getElementById("currentLevel").innerText = level;
  updateTriesTotal(tries);

  let html = "";
  for (let row = 0; row < rows; row++) { 
    // Start a div so that each row's cards are on their own line
    html += "<div>";

    // Loop through columns building up the HTML for each card
    for (let column = 0; column < columns; column++) {
      html += "<div id=\"" + getCardId(row, column) + "\" class=\"CardBack\" onclick=\"onClickCard(" + row + "," + column + ");\"><span></span></div>";
    }

    // Close off the div for the current row
    html += "</div>";
  }

  document.getElementById("cardContainer").innerHTML = html;
}

// Called by the module to have the tries count updated
function updateTriesTotal(tries) {
  document.getElementById("tries").innerText = tries;
}

// Helper to give each card a unique id based on the row and column values
function getCardId(row, column) { return ("card_" + row + "_" + column); }

// Called by the module when the player clicks on a card
function flipCard(row, column, cardValue) {
  const card = getCard(row, column);
  card.className = "CardBack";

  // If the card is selected...
  if (cardValue !== -1) {
    card.className = ("CardFace " + getClassForCardValue(cardValue));
  }
}

function getCard(row, column) { return document.getElementById(getCardId(row, column)); }

// Type0, Type1, Type2, etc
function getClassForCardValue(cardValue) { return ("Type" + cardValue); }

// Called by the module when a match was found so that we hide the cards
function removeCards(firstCardRow, firstCardColumn, secondCardRow, secondCardColumn) {
  // using visibility so that the cards are still taking up space but aren't shown
  // (so that the other cards don't move)
  let card = getCard(firstCardRow, firstCardColumn);
  card.style.visibility = "hidden";

  card = getCard(secondCardRow, secondCardColumn);
  card.style.visibility = "hidden";
}

// Called by the module when the player successfully completes the current level
function levelComplete(level, tries, hasAnotherLevel) {
  document.getElementById("levelComplete").style.display = "";
  document.getElementById("levelSummary").innerText = `Good job! You've completed level ${level} with ${tries} tries.`;

  if (!hasAnotherLevel) { document.getElementById("playNextLevel").style.display = "none"; }
}

function pause(callbackNamePointer, milliseconds) {
  // Wait for the specified number of milliseconds before calling the function
  // indicated. The function is expected to have a void return type and no parameters.
  window.setTimeout(function() {
    // Read the string from the module's memory and prefix it with the '_' character
    const name = ("_" + getStringFromMemory(callbackNamePointer));

    // Call the method requested
    moduleExports[name]();
  }, milliseconds);
}

function getStringFromMemory(memoryOffset) {
  let returnValue = "";

  const size = 256;
  const bytes = new Uint8Array(moduleMemory.buffer, memoryOffset, size);
  
  let character = "";
  for (let i = 0; i < size; i++) {
    character = String.fromCharCode(bytes[i]);
    if (character === "\0") { break;}
    
    returnValue += character;
  }

  return returnValue;
}

// When the player clicks on a card, we tell the WebAssembly module which card was clicked on
function onClickCard(row, col) {
  moduleExports._CardSelected(row, col);
}

// The player clicked the Replay button
function replayLevel() {
  document.getElementById("levelComplete").style.display = "none";

  moduleExports._ReplayLevel();
}

// The player clicked the Play Next Level button
function playNextLevel() {
  document.getElementById("levelComplete").style.display = "none";

  moduleExports._PlayNextLevel();
}

function log(functionNamePointer, triesValue) {
  const name = getStringFromMemory(functionNamePointer);
  console.log(`Function name: ${name}  triesValue: ${triesValue}`);
}