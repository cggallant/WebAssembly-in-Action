(module
  ;;==========
  ;; Types
  ;;----------
  ;; Signatures of functions both defined in the module and imported
  (type $FUNCSIG$v (func))
  (type $FUNCSIG$vi (func (param i32)))
  (type $FUNCSIG$vii (func (param i32 i32))) 
  (type $FUNCSIG$viii (func (param i32 i32 i32))) 
  (type $FUNCSIG$viiii (func (param i32 i32 i32 i32))) 
  (type $FUNCSIG$ii (func (param i32) (result i32)))
  (type $FUNCSIG$iii (func (param i32 i32) (result i32))) 

  ;;==========
  ;; Imports
  ;;----------
  ;; Functions that will be imported from JavaScript
  (import "env" "_GenerateCards" (func $GenerateCards (param i32 i32 i32 i32)))
  (import "env" "_UpdateTriesTotal" (func $UpdateTriesTotal (param i32)))
  (import "env" "_FlipCard" (func $FlipCard (param i32 i32 i32)))
  (import "env" "_RemoveCards" (func $RemoveCards (param i32 i32 i32 i32)))
  (import "env" "_LevelComplete" (func $LevelComplete (param i32 i32 i32)))
  (import "env" "_Pause" (func $Pause (param i32 i32)))
  (import "env" "_Log" (func $Log (param i32 i32)))
  
  ;; Memory and functions that will be imported from the Emscripten generated module
  (import "env" "memory" (memory $memory 256))
  (import "env" "_SeedRandomNumberGenerator" (func $SeedRandomNumberGenerator))
  (import "env" "_GetRandomNumber" (func $GetRandomNumber (param i32) (result i32)))
  (import "env" "_malloc" (func $malloc (param i32) (result i32)))
  (import "env" "_free" (func $free (param i32)))

  ;;==========
  ;; Globals
  ;;----------
  ;; Capable of 6 but, to simplify InitializeRowsAndColumns, just showing 3
  (global $MAX_LEVEL i32 (i32.const 3))

  ;; The array that will represent each card's values
  (global $cards (mut i32) (i32.const 0))

  ;; Details about the current level
  (global $current_level (mut i32) (i32.const 0))
  (global $rows (mut i32) (i32.const 0))
  (global $columns (mut i32) (i32.const 0))
  (global $matches_remaining (mut i32) (i32.const 0))
  (global $tries (mut i32) (i32.const 0))

  ;; Details about the cards that have been clicked on
  (global $first_card_row (mut i32) (i32.const 0))
  (global $first_card_column (mut i32) (i32.const 0))
  (global $first_card_value (mut i32) (i32.const 0))
  (global $second_card_row (mut i32) (i32.const 0))
  (global $second_card_column (mut i32) (i32.const 0))
  (global $second_card_value (mut i32) (i32.const 0))

  ;; We will briefly pause the game when the second card is shown
  ;; so that it remains displayed long enough for the player to see
  ;; it before it gets removed or flipped back facedown. While 
  ;; paused, no clicks will be handled. 1 for true, 0 for false.
  (global $execution_paused (mut i32) (i32.const 0))

  ;;==========
  ;; Exports
  ;;----------
  (export "_CardSelected" (func $CardSelected))
  (export "_SecondCardSelectedCallback" (func $SecondCardSelectedCallback))
  (export "_ReplayLevel" (func $ReplayLevel))
  (export "_PlayNextLevel" (func $PlayNextLevel))

  ;;==========
  ;; Start
  ;;----------
  (start $main)

  ;;==========
  ;; Code
  ;;----------
  ;; With the text format, the function's declaration and body are one

  (func $InitializeRowsAndColumns (param $level i32)
    ;; If level 1 was requested...
    get_local $level
    i32.const 1
    i32.eq
    if
      i32.const 2
      set_global $rows

      i32.const 2
      set_global $columns
    end

    ;; If level 2 was requested...
    get_local $level
    i32.const 2
    i32.eq
    if
      i32.const 2
      set_global $rows

      i32.const 3
      set_global $columns
    end

    ;; If level 3 was requested...
    get_local $level
    i32.const 3
    i32.eq
    if
      i32.const 2
      set_global $rows

      i32.const 4
      set_global $columns
    end
  )

  (func $ResetSelectedCardValues
    ;; Reset the first card values
    i32.const -1
    set_global $first_card_row

    i32.const -1
    set_global $first_card_column

    i32.const -1
    set_global $first_card_value

    ;; Reset the second card values
    i32.const -1
    set_global $second_card_row

    i32.const -1
    set_global $second_card_column

    i32.const -1
    set_global $second_card_value
  )

  (func $InitializeCards (param $level i32)
    (local $count i32)

    ;; logging to track down the source of the issue with $tries not being reset
    i32.const 1051
    get_global $tries
    call $Log

    ;; Remember the requested level and then set the rows and columns global variables
    ;; to their proper values based on the current level
    get_local $level
    set_global $current_level
    
    get_local $level
    call $InitializeRowsAndColumns
    
    ;; Make sure the first and second card values are reset
    call $ResetSelectedCardValues

    ;; Determine how many cards are there for this level and from that how many pairs
    get_global $rows
    get_global $columns
    i32.mul
    set_local $count
    
    get_local $count
    i32.const 2
    i32.div_s
    set_global $matches_remaining
    

    ;; Allocate the memory needed for this level's cards. '$cards' is a pointer (i32)
    get_local $count
    i32.const 2
    i32.shl ;; shift left ( << ) by 2 because the memory needed is 4 bytes per item
    call $malloc
    set_global $cards

    ;; Fill the array with pairs of values (0, 0, 1, 1, 2, 2 for example)
    get_local $count
    call $PopulateArray

    ;; Shuffle the array
    get_local $count
    call $ShuffleArray

    ;; get_global 6   <- this was the bug. Replaced with the following:
    i32.const 0
    set_global $tries
  )

  (func $PopulateArray (param $array_length i32)
    (local $index i32)
    (local $card_value i32)

    ;; Initialize both variables before the loop starts
    i32.const 0
    set_local $index
    
    i32.const 0
    set_local $card_value
    
    ;; Loop through the array filling it with pairs of values (0, 0, 1, 1, 2, 2 for example)
    loop $while-populate
      ;; Set the value at $index to $card_value
      get_local $index
      call $GetMemoryLocationFromIndex
      get_local $card_value
      i32.store ;; set the card_value in memory
      
      ;; Increment the index for the next array item
      get_local $index
      i32.const 1
      i32.add
      set_local $index
      
      ;; Set the value at $index to $card_value (adding $card_value in pairs)
      get_local $index
      call $GetMemoryLocationFromIndex
      get_local $card_value
      i32.store ;; set the card_value in memory
    

      ;; Increment the card value for the next loop
      get_local $card_value
      i32.const 1
      i32.add
      set_local $card_value
      
      ;; Increment the index for the next loop
      get_local $index
      i32.const 1
      i32.add
      set_local $index

      ;; If the index hasn't exceeded the size of the array, loop again
      get_local $index
      get_local $array_length
      i32.lt_s
      if
        br $while-populate
      end
    end $while-populate
  )

  ;; Returns the location in memory for the index specified in the $cards pointer 
  (func $GetMemoryLocationFromIndex (param $index i32) (result i32)
    ;; Shift (<<) the index value left by 2 (same as multiplying it by 4) because
    ;; each index location represents a 32-bit integer (4 bytes)
    get_local $index
    i32.const 2
    i32.shl

    ;; Now adjust the index based on the $cards pointer start position
    get_global $cards
    i32.add
  )

  (func $ShuffleArray (param $array_length i32)
    (local $index i32)
    (local $memory_location1 i32)
    (local $memory_location2 i32)
    (local $card_to_swap i32)
    (local $card_value i32)

    call $SeedRandomNumberGenerator

    ;; The following loop starts at the end of the array and moves to the beginning
    get_local $array_length
    i32.const 1
    i32.sub
    set_local $index
    
    ;; Shuffle the array using the Fisher-Yates shuffle (https://gist.github.com/sundeepblue/10501662)
    loop $while-shuffle
      ;; Determine a random card to swap with
      get_local $index
      i32.const 1
      i32.add
      call $GetRandomNumber
      set_local $card_to_swap
      
      ;; Get the memory location based on the index
      get_local $index
      call $GetMemoryLocationFromIndex
      set_local $memory_location1
      
      ;; Get the memory location based on the card_to_swap index
      get_local $card_to_swap
      call $GetMemoryLocationFromIndex
      set_local $memory_location2
       

      ;; Remember the card value at the current index in the array (will need to be placed
      ;; where card_to_swap is)
      get_local $memory_location1
      i32.load
      set_local $card_value
      
      ;; Put the value from card_to_swap into the array at the current index
      get_local $memory_location1 ;; index position that will be updated
      get_local $memory_location2 ;; card_to_swap position that we will get the value from
      i32.load ;; pop $memory_location2 from the stack, read the value from memory at that card_to_swap position, and put the value back on the stack
      i32.store ;; pop $memory_location1 from the stack (where the value will be written to) and the value obtained from card_to_swap. Write the value to memory at $memory_location1
      
      ;; Put the card value into the array where card_to_swap's value was
      get_local $memory_location2
      get_local $card_value
      i32.store
      

      ;; Decrement the index by 1 for the next loop
      get_local $index
      i32.const 1
      i32.sub
      set_local $index
      
      ;; If the index is still greater than zero then loop again
      get_local $index
      i32.const 0
      i32.gt_s
      if
        br $while-shuffle
      end 
    end $while-shuffle
  )

  (func $PlayLevel (param $level i32)
    ;; logging to track down the source of the issue with $tries not being reset
    i32.const 1067
    get_global $tries
    call $Log


    get_local $level
    call $InitializeCards
 
    get_global $rows
    get_global $columns
    get_local $level
    get_global $tries
    call $GenerateCards
  )

  (func $GetCardValue (param $row i32) (param $column i32) (result i32) 
    ;; The index value for the card in the cards array is the following 
    ;; equation: row * columns + column
    get_local $row
    get_global $columns
    i32.mul ;; multiply the row and columns values together
    get_local $column
    i32.add ;; add on the column value

    i32.const 2
    i32.shl ;; shift left because each index represents a 32-bit integer (4 bytes, not 1) 
    get_global $cards
    i32.add ;; Adjust the index based on the start position of the $cards pointer
    i32.load ;; Load the value from the memory index. Leave it on the stack for the caller
  )

  (func $CardSelected (param $row i32) (param $column i32)
    (local $card_value i32)

    ;; Ignore clicks while the game is paused
    get_global $execution_paused
    i32.const 1
    i32.eq
    if
      return
    end

    ;; Get the value of the card for the row and column specified. 
    get_local $row
    get_local $column
    call $GetCardValue
    set_local $card_value

    ;; Tell the UI to show this card
    get_local $row
    get_local $column
    get_local $card_value
    call $FlipCard
    
    ;; If no card has been clicked on yet...
    get_global $first_card_row
    i32.const -1
    i32.eq
    if
      ;; Remember the details about the card that was clicked on
      get_local $row
      set_global $first_card_row
      
      get_local $column
      set_global $first_card_column

      get_local $card_value
      set_global $first_card_value
    else ;; This is the second card that was clicked...
      ;; Find out if this card is really the first card
      get_local $row
      get_local $column
      call $IsFirstCard
      if
        return
      end

      ;; Remember the second card's details
      get_local $row
      set_global $second_card_row
      
      get_local $column
      set_global $second_card_column

      get_local $card_value
      set_global $second_card_value
      
      ;; Don't respond to clicks until the Pause function calls back into this module
      i32.const 1
      set_global $execution_paused
      
      ;; Call the Pause function. This is a timeout to allow the UI to show the card 
      ;; that was selected before we either turn it face down or remove it. The UI
      ;; calls the function that we specify once the time is up.
      i32.const 1024 ;; Location in memory of the string "SecondCardSelectedCallback"
      i32.const 600
      call $Pause
    end
  )

  (func $IsFirstCard (param $row i32) (param $column i32) (result i32)
    (local $rows_equal i32)
    (local $columns_equal i32)

    ;; Determine if the first card's row matches the current row
    get_global $first_card_row
    get_local $row
    i32.eq
    set_local $rows_equal
      
    ;; Determine if the first card's column matches the current column
    get_global $first_card_column
    get_local $column
    i32.eq
    set_local $columns_equal
      
    ;; If both values are 1 (true) then the player clicked on the same card (i32.and is a bitwise AND)
    get_local $rows_equal
    get_local $columns_equal
    i32.and
  )

  (func $SecondCardSelectedCallback
    (local $is_last_level i32)

    ;; logging to track down the source of the issue with $tries not being reset
    i32.const 1024
    get_global $tries
    call $Log


    ;; If the card values for the first and second cards clicked on are a match then...
    get_global $first_card_value
    get_global $second_card_value
    i32.eq
    if
      ;; Tell the JavaScript to hide the two cards
      get_global $first_card_row
      get_global $first_card_column
      get_global $second_card_row
      get_global $second_card_column
      call $RemoveCards

      ;; Decrement the matches remaining so that we know when the level is complete
      get_global $matches_remaining
      i32.const 1
      i32.sub
      set_global $matches_remaining
    else ;; not a match...
      ;; Flip the cards back to face down
      get_global $first_card_row
      get_global $first_card_column
      i32.const -1
      call $FlipCard
        
      get_global $second_card_row
      get_global $second_card_column
      i32.const -1
      call $FlipCard
    end

    ;; Increment the number of tries
    get_global $tries
    i32.const 1
    i32.add
    set_global $tries

    ;; Tell the JavaScript code to update the UI with the new total
    get_global $tries
    call $UpdateTriesTotal


    ;; Make sure the first and second card values are reset
    call $ResetSelectedCardValues

    ;; Turn off the flag allowing CardSelected to accept clicks again
    i32.const 0
    set_global $execution_paused

    ;; If there are no matches remaining then the player has won this level
    get_global $matches_remaining
    i32.const 0
    i32.eq
    if
      ;; Free the memory used by the cards
      get_global $cards
      call $free
      
      ;; Determine if the current level is the last one
      get_global $current_level
      get_global $MAX_LEVEL
      i32.lt_s
      set_local $is_last_level
      
      ;; Tell the user they beat the level and indicate if there's another level or not
      get_global $current_level
      get_global $tries
      get_local $is_last_level
      call $LevelComplete
    end
  )

  (func $ReplayLevel
    get_global $current_level
    call $PlayLevel
  )

  (func $PlayNextLevel
    get_global $current_level
    i32.const 1
    i32.add
    call $PlayLevel
  )

  (func $main
    i32.const 1    
    call $PlayLevel 
  )

  ;;==========
  ;; Data
  ;;----------
  (data (i32.const 1024) "SecondCardSelectedCallback\00InitializeCards\00PlayLevel")
)