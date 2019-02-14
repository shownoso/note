function Student(name) {
  this.name = name;
}
//demo1
let student1 = new Student();
let student2 = new Student();
setTimeout(function () {
  student1 = null;
},3000);

//demo2
let student3 = new Student("shown");
let stuSet = new Set();
stuSet.add(student3)
student3 = null;
stuSet = null;

//闭包在堆区
let StuFactory = function (name) {
  let student = new Student(name);
  return function () {
    console.log(student);
  }
}
let s1 = StuFactory("shownoso");
s1();
s1 = null;
