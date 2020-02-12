```js
var a = 0;
var b = 0;
function fn(a) {
  fn = function(b) {
    console.log(a + b++);
  };
  console.log(a++);
}

fn(1);
fn(2);
```

1. 全局代码执行，此时GO如下
```
a: 0
b: 0
fn: reference to function f(){...} //heap
```

2. fn(1)执行，创建EC_1，此时AO_1如下
```
a: 1

```
- 查找fn并使fn指向`function(b){...}`，当前AO无fn，则到上级（GO）查找,fn被“重写”
- 继续执行console语句，打印a为1。a++执行完毕，此时AO/VO：
```
a: 2
```
扫描到`function(b){...}`中存在对a的引用，此时形成闭包 Closure (fn): { a: 2}

3. fn(2)执行，创建新的EC_2，此时AO_2如下
```
b: 2
```
- 执行console语句，查找a，当前AO无a，查找上一个EC，找到a为2
- (a + b) ++ 打印结果为4。++执行完毕后，此时AO/VO：
```
b: 3
```

4. 执行结束 销毁
