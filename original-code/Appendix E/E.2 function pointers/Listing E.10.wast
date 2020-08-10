(module
  (type $FUNCSIG$v (func))
  
  (import "env" "Function1" (func $function1))
  (import "env" "Function2" (func $function2))
  
  (table 2 anyfunc)
  
  (export "Test" (func $test))

  (elem (i32.const 0) $function1 $function2)
  
  (func $test (param $index i32)
    (call_indirect (type $FUNCSIG$v)
      (get_local $index) 
    )
  ) 
)