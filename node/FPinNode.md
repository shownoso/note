## 函数式编程在Node中的应用

1. 高阶函数：可以将函数作为输入或者返回值，形成一种后续传递风格的结果接受方式，而非单一的返回值形式。后续传递风格的程序将函数业务重点从返回值传递到回调函数中。
```js
app.use(function(){
  //todo
})

var emitter = new events.EventEmitter;
emitter.on(function(){
  //todo
})
```

2. 偏函数：指定部分参数产生一个新的定制函数的形式就是偏函数。Node中异步编程非常常见，我们通过哨兵变量会很容易造成业务的混乱。underscore，after变量。
