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
    (if
      (i32.eq
        (get_local $level)
        (i32.const 1)
      )
      (then
        (set_global $rows (i32.const 2))
        (set_global $columns (i32.const 2))
      )
    )

    ;; If level 2 was requested...
    (if
      (i32.eq
        (get_local $level)
        (i32.const 2)
      )
      (then
        (set_global $rows (i32.const 2))
        (set_global $columns (i32.const 3))
      )
    )

    ;; If level 3 was requested...
    (if
      (i32.eq
        (get_local $level)
        (i32.const 3)
      )
      (then
        (set_global $rows (i32.const 2))
        (set_global $columns (i32.const 4))
      )
    )
  )

  (func $ResetSelectedCardValues
    ;; Reset the first card values
    (set_global $first_card_row
      (i32.const -1)
    )
    (set_global $first_card_column
      (i32.const -1)
    )
    (set_global $first_card_value
      (i32.const -1)
    )

    ;; Reset the second card values
    (set_global $second_card_row
      (i32.const -1)
    )
    (set_global $second_card_column
      (i32.const -1)
    )
    (set_global $second_card_value
      (i32.const -1)
    )
  )

  (func $InitializeCards (param $level i32)
    (local $count i32)

    ;; Remember the requested level and then set the rows and columns global variables
    ;; to their proper values based on the current level
    (set_global $current_level
      (get_local $level)
    )
    (call $InitializeRowsAndColumns
      (get_local $level)
    )

    ;; Make sure the first and second card values are reset
    (call $ResetSelectedCardValues)

    ;; Determine how many cards are there for this level and from that how many pairs
    (set_local $count
      (i32.mul
        (get_global $rows)
        (get_global $columns)
      )
    )

    (set_global $matches_remaining
      (i32.div_s
        (get_local $count)
        (i32.const 2)
      )
    )

    ;; Allocate the memory needed for this level's cards. 'cards' is a pointer (i32)
    (set_global $cards
      (call $malloc
;; move shift left logic to its own function
        (i32.shl ;; shift left ( << ). Basically: sizeof(int) * count
          (get_local $count)
          (i32.const 2)
        )
      )
    )

    ;; Fill the array with pairs of values (0, 0, 1, 1, 2, 2 for example)
    (call $PopulateArray
      (get_local $count)
    )

    ;; Shuffle the array
    (call $ShuffleArray
      (get_local $count)
    )

    (set_global $tries    
      (get_global 6)
    )
  )

  (func $PopulateArray (param $array_length i32)
    (local $index i32)
    (local $card_value i32)

    (set_local $index
      (i32.const 0)
    )
    (set_local $card_value
      (i32.const 0)
    )

    ;; Loop through the array filling it with pairs of values (0, 0, 1, 1, 2, 2 for example)
    (loop $while-populate
      ;; Set the value at $index to $card_value
      (i32.store
        (call $GetMemoryLocationFromIndex
          (get_local $index)
        )
        (get_local $card_value)
      )

      ;; Increment the index for the next array item
      (set_local $index
        (i32.add
          (get_local $index)
          (i32.const 1)
        )
      )

      ;; Set the value at $index to $card_value (adding $card_value in pairs)
      (i32.store
        (call $GetMemoryLocationFromIndex
          (get_local $index)
        )
        (get_local $card_value)
      )

    
      ;; Increment the card value for the next loop
      (set_local $card_value
        (i32.add
          (get_local $card_value)
          (i32.const 1)
        )
      )

      ;; Increment the index for the next loop
      (set_local $index
        (i32.add
          (get_local $index)
          (i32.const 1)
        )
      )

      ;; If the index hasn't exceeded the size of the array, loop again
      (if
        (i32.lt_s
          (get_local $index)
          (get_local $array_length)
        )
        (then
          (br $while-populate)
        )
      )
    )
  )

  ;; Returns the location in memory for the index specified in the $cards pointer 
  (func $GetMemoryLocationFromIndex (param $index i32) (result i32)
    ;; Adjust the index based on the $cards pointer start position
    (i32.add
      (get_global $cards)
      ;; Shift (<<) the index value by 2 (same as multiplying it by 4) because each
      ;; index location represents a 32-bit integer (4 bytes)
      (i32.shl
        (get_local $index)
        (i32.const 2)
      )
    )
  )

  (func $ShuffleArray (param $array_length i32)
    (local $index i32)
    (local $memory_location1 i32)
    (local $memory_location2 i32)
    (local $card_to_swap i32)
    (local $card_value i32)

    (call $SeedRandomNumberGenerator)

    ;; The followoing loop starts at the end of the array and moves to the beginning
    (set_local $index
      (i32.sub
        (get_local $array_length)
        (i32.const 1)
      )
    )

    ;; Shuffle the array using the Fisher-Yates shuffle (https://gist.github.com/sundeepblue/10501662)
    (loop $while-shuffle
      ;; Determine a random card to swap with
      (set_local $card_to_swap
        (call $GetRandomNumber
          (i32.add
            (get_local $index)
            (i32.const 1)
          )
        )
      )

      ;; Get the memory location based on the index and the start location of the cards 
      ;; pointer
      (set_local $memory_location1
        (call $GetMemoryLocationFromIndex
          (get_local $index)
        )
      )

      ;; Get the memory location based on the card_to_swap index and the start location 
      ;; of the cards pointer
      (set_local $memory_location2
        (call $GetMemoryLocationFromIndex
          (get_local $card_to_swap)
        )
      )

      ;; Remember the card value at the current index in the array (will need to be placed
      ;; where card_to_swap is)
      (set_local $card_value
        (i32.load
          (get_local $memory_location1)
        )
      )

      ;; Put the value from card_to_swap into the array at the current index
      (i32.store
        (get_local $memory_location1)
        (i32.load
          (get_local $memory_location2)
        )
      )

      ;; Put the card value into the array where card_to_swap's value was
      (i32.store
        (get_local $memory_location2)
        (get_local $card_value)
      )


      ;; Decrement the index by 1 for the next loop
      (set_local $index
        (i32.sub
          (get_local $index)
          (i32.const 1)
        )
      )

      ;; If the index is still greater than zero then loop again
      (if
        (i32.gt_s
          (get_local $index)
          (i32.const 0)
        )
        (then
          (br $while-shuffle)
        )
      ) 
    )
  )

  (func $PlayLevel (param $level i32)
    (call $InitializeCards
      (get_local $level)
    )

    (call $GenerateCards
      (get_global $rows)
      (get_global $columns)
      (get_local $level)
      (get_global $tries)
    )
  )

  (func $GetCardValue (param $row i32) (param $column i32) (result i32)
    (local $index i32)
    (local $value i32)

    ;; The index value for the card in the cards array is the following 
    ;; equation: row * columns + column
    (set_local $index
      (i32.mul
        (get_local $row)
        (get_global $columns)
      )
    )
    (set_local $index
      (i32.add
        (get_local $index)
        (get_local $column)
      )
    )

    ;; The cards variable is a pointer (i32) to a memory index. The index we found so 
    ;; far is within the cards array. We now need to adjust the index based on the 
    ;; start position of the cards array.
    (set_local $index
      (i32.add
;;shift left will have its own function...what if it's a step further e.g. GetCardMemoryIndex <- pass in $index and it does the shift left + add
        (i32.shl ;; shift left ( << )
          (get_local $index)
          (i32.const 2)
        )
        (get_global $cards)
      )
    )

    ;; Load the value from the memory index
    (set_local $value
      (i32.load
        (get_local $index)
      )
    )

    ;; Put the return value onto the stack so that it gets returned to the caller
    (get_local $value)
  )

  (func $CardSelected (param $row i32) (param $column i32)
    (local $card_value i32)

    ;; Ignore clicks while the game is paused
    (if
      (i32.eq
        (get_global $execution_paused)
        (i32.const 1)
      )
      (then
        (return)
      )
    )

    ;; Get the value of the card for the row and column specified. Tell the UI
    ;; to show this card
    (set_local $card_value
      (call $GetCardValue
        (get_local $row)
        (get_local $column)
      )
    )
    (call $FlipCard
      (get_local $row)
      (get_local $column)
      (get_local $card_value)
    )

    ;; If no card has been clicked on yet...
    (if
      (i32.eq
        (get_global $first_card_row)
        (i32.const -1)
      )
      (then
        ;; Remember the details about the card that was clicked on
        (set_global $first_card_row
          (get_local $row)
        )
        (set_global $first_card_column
          (get_local $column)
        )
        (set_global $first_card_value
          (get_local $card_value)
        )
      )
      (else ;; This is the second card that was clicked...
        ;; If both values are 1 (true) then the player clicked on the same card (i32.and is a bitwise AND)
        (if
          (call $IsFirstCard)
            (get_local $row)
            (get_local $column)
          )
          (then
            (return)
          )
        )


        ;; Remember the second card's details
        (set_global $second_card_row
          (get_local $row)
        )
        (set_global $second_card_column
          (get_local $column)
        )
        (set_global $second_card_value
          (get_local $card_value)
        )

        ;; Don't respond to clicks until the Pause function calls back into this module
        (set_global $execution_paused
          (i32.const 1)
        )

        ;; Call the Pause function. This is a timeout to allow the UI to show the card 
        ;; that was selected before we either turn it face down or remove it. The UI
        ;; calls the function that we specify once the time is up.
        (call $Pause
          (i32.const 5120) ;; Location in memory of the string "SecondCardSelectedCallback"
          (i32.const 600)
        )
      )
    )
  )

  (func $IsFirstCard (param $row i32) (param $column i32) (result i32)
    (local $rows_equal i32)
    (local $columns_equal i32)

    ;; Determine if the first card's row matches the current row
    (set_local $rows_equal
      (i32.eq
        (get_global $first_card_row)
        (get_local $row)
      )
    )

    ;; Determine if the first card's column matches the current column
    (set_local $columns_equal
      (i32.eq
        (get_global $first_card_column)
        (get_local $column)
      )
    )

    (i32.and
      (get_local $rows_equal)
      (get_local $columns_equal)
    )
  )

  (func $SecondCardSelectedCallback
    (local $is_last_level i32)

    ;; If we have a match then...
    (if
      (i32.eq
        (get_global $first_card_value)
        (get_global $second_card_value)
      )
      (then
        (call $RemoveCards
          (get_global $first_card_row)
          (get_global $first_card_column)
          (get_global $second_card_row)
          (get_global $second_card_column)
        )

        ;; Decrement the matches remaining so that we know when the level is complete
        (set_global $matches_remaining
          (i32.sub
            (get_global $matches_remaining)
            (i32.const 1)
          )
        )
      )
      (else
        ;; Flip the cards back to face down
        (call $FlipCard
          (get_global $first_card_row)
          (get_global $first_card_column)
          (i32.const -1)
        )
        (call $FlipCard
          (get_global $second_card_row)
          (get_global $second_card_column)
          (i32.const -1)
        )
      )
    )

    ;; Increment the number of tries
    (set_global $tries
      (i32.add
        (get_global $tries)
        (i32.const 1)
      )
    )

    ;; Tell the JavaScript code to update the UI with the new total
    (call $UpdateTriesTotal
      (get_global $tries)
    )

    ;; Make sure the first and second card values are reset
    (call $ResetSelectedCardValues)

    ;; Turn off the flag allowing CardSelected to accept clicks again
    (set_global $execution_paused
      (i32.const 0)
    )

    ;; If there are no matches remaining then the player has won this level
    (if
      (i32.eq
        (get_global $matches_remaining)
        (i32.const 0)
      )
      (then
        ;; Free the memory used by the cards
        (call $free
          (get_global $cards)
        )

        ;; Determine if the current level is the last one
        (set_local $is_last_level
          (i32.lt_s
            (get_global $current_level)
            (get_global $MAX_LEVEL)
          )
        )

        ;; Tell the user they beat the level and indicate if there's another level or not
        (call $LevelComplete
          (get_global $current_level)
          (get_global $tries)
          (get_local $is_last_level)
        )
      )
    )
  )

  (func $ReplayLevel
    (call $PlayLevel
      (get_global $current_level)
    )
  )

  (func $PlayNextLevel
    (call $PlayLevel
      (i32.add
        (get_global $current_level)
        (i32.const 1)
      )
    )
  )

  (func $main
    (call $PlayLevel 
      (i32.const 1)
    )
  )

  ;;==========
  ;; Data
  ;;----------
  (data (i32.const 5120) "SecondCardSelectedCallback")
)