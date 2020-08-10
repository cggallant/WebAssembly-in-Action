(module
  (type $type0 (func (param i32) (result i32)))

  (memory 1)

  (export "memory" (memory 0))
  (export "GetStringLength" (func 0))
  
  (func (param $param i32) (result i32)
    (local $count i32)
    (local $position i32)

    i32.const 0
    set_local $count
    
    get_local $param
    set_local $position
        
    loop $while
      get_local $position
      i32.load8_s

      i32.const 0
      i32.ne
      if
        get_local $count
        i32.const 1
        i32.add
        set_local $count
    
        get_local $position
        i32.const 1
        i32.add
        set_local $position
    
        br $while
      end
    end
    
    get_local $count
  )
)
