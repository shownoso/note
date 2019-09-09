//addMethod
function addMethod(object, name, fn) {
    //保存前一次添加的方法
    var old = object[name];
    //重写 object[name]
    object[name] = function() { 
        // fn.length 函数的形参个数  arguments.length 函数的实参个数
        if(fn.length === arguments.length) {
            //this => object
            return fn.apply(this, arguments);
        } else if(typeof old === "function") {
            return old.apply(this, arguments);
        }
    }
}


     
var people = {
　　values: ["Dean Edwards", "Alex Russell", "Dean Tom"]
};


// 不传参数时，返回peopld.values里面的所有元素
addMethod(people, "find", function() {
　　return this.values;
});

// 传一个参数时，匹配并返回
addMethod(people, "find", function(name) {
    var arr = this.values;
　　for(var i = 0; i < arr.length; i++) {
        return arr[i] ? {
            name: arr[i],
            index: i
        } : undefined;
　　}　　
});
     

     
     
// 测试：
console.log(people.find()); //["Dean Edwards", "Alex Russell", "Dean Tom"]
console.log(people.find('Dean Edwards')); //{name: "Dean Edwards", index: 0}