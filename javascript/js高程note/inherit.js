function inherit(p) {
  if (p == null) throw TypeError(); // p must be a non-null object
  if (Object.create)                // If Object.create() is defined...
      return Object.create(p);      //    then just use it.
  var t = typeof p;                 // Otherwise do some more type checking
  if (t !== "object" && t !== "function") throw TypeError();
  function f() {};                  // Define a dummy constructor function.
  f.prototype = p;                  // Set its prototype property to p.
  return new f();                   // Use f() to create an "heir" of p.
}
