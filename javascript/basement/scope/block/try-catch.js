
var fn = function () {
    
  try {
      console.log(this) // obj
      throw new Error('111')
  } catch (e) {
      console.log(this) // obj
  } finally {

      console.log(this) // obj
  }

}

var obj = {
  a:1,
  fn: fn
}

obj.fn();