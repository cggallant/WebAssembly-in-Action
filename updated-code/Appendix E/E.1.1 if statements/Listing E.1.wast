(module
  (type $type0 (func (param i32) (result i32)))
  (export "Test" (func 0))
  
  (func (param $param i32) (result i32)
    (local $result i32)
    
    get_local $param
    i32.const 0
    i32.eq
    if
      i32.const 5
      set_local $result
    else
      i32.const 10
      set_local $result
    end

    get_local $result
  )
)