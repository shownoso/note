// A+ Standard
var MyPromise = function(fn){
    //判断构造函数的参数是否为函数
    if(typeof fn !== 'function'){
        throw new TypeError('Promise resolver undefined is not a function');
    }
    const _this = this;
    //promise的状态
    _this.state = PENDING;
    //promise的值 
    _this.value = null;
    //用于保存then中的回调，当状态为pending的时候才会缓存，并且每个实例至多缓存一次。
    _this.resolveCallbacks = [];
    _this.rejectCallbacks = [];
    
    //resolve的方法
    _this.resolve = function(value){
        //判断参数是不是一个promise
        if(value instanceof MyPromise){
            //如果value是一个promise 递归执行   
            return value.then(_this.resolve,_this.reject);
        }
        //异步执行  真实情况是加入到微任务队列，这里用定时器模拟
        setTimeout(function(){
            if(_this.state === PENDING){
                _this.state = RESOLVED;
                _this.value = value;
                // 同步回调 通过then注册的回调
                _this.resolveCallbacks.forEach(cb => cb(_this.value));
            }
        },0)
    }
    //reject的方法
    _this.reject = function(value){
        //异步执行 保证执行顺序
        setTimeout(function(){
            if(_this.state === PENDING){
                _this.state = REJECTED;
                _this.value = value;
                _this.rejectCallbacks.forEach(cb => cb(_this.value));
            }
        },0)

    }

    //用于解决构造函数传入的函数返回出一个异常的情况
    //new MyPromise(()=> throw new Error('error'))
    try{
        fn(_this.resolve,_this.reject);
    }catch(e){
        _this.reject(e);
    }
}

MyPromise.prototype.then = function(onFulfilled,onRejected){
    const _self = this;
    //规范2.2.7
    //promise 的then方法返回一个新的promise
    var promise2;
    //规范2.2.7.3 /2.2.7.4
    //如果 onFulfilled 不是函数且 promise1 成功执行， promise2 必须成功执行并返回相同的值
    //如果 onRejected 不是函数且 promise1 拒绝执行， promise2 必须拒绝执行并返回相同的据因
    //如果参数不是函数就忽略，同时实现透传  new Promise().then().then(x=>x)
    onResolved = typeof onResolved === 'function' ? onResolved : x => x;
    onRejected = typeof onRejected === 'function' ? onRejected : r => {throw r};
    if(_self.state === PENDING){
        return promise2 = new MyPromise(function(resolve,reject){
            _self.resolveCallbacks.push(function(){
                //规范2.2.7.2
                //如果 onFulfilled 或者 onRejected 抛出一个异常 e ，则 promise2 必须拒绝执行，并返回拒因 e
                try{
                    var x = onFulfilled(_self.value);
                    //规范2.2.7.1
                    resolutionProcedure(promise2,x,resolve,reject);
                }catch(e){
                    reject(e);
                }
            });
            _self.rejectCallbacks.push(function(){
                //规范2.2.7.2
                try{
                    var x = onRejected(_self.value);
                    //规范2.2.7.1
                    resolutionProcedure(promise2,x,resolve,reject);
                }catch(e){
                    reject(e);
                }
            })
        })
    }
    if(_self.state === RESOLVED){
        return promise2 = new MyPromise(function(resolve,reject){
            //规范2.2.4
            //保证resolve的调用时机
            setTimeout(function(){
                //规范2.2.7.2
                try{
                    var x = onFulfilled(_self.value);
                    //规范2.2.7.1
                    resolutionProcedure(promise2,x,resolve,reject);
                }catch(e){
                    reject(e);
                }
            },0)
        })
    }
    if(_self.state === REJECTED){
        return promise2 = new MyPromise(function(resolve,reject){
            //规范2.2.4
            //保证了reject的调用时机
            setTimeout(function(){
                //规范2.2.7.2
                try{
                    var x = onRejected(_self.value);
                    //规范2.2.7.1
                    resolutionProcedure(promise2,x,resolve,reject);
                }catch(e){
                    reject(e);
                }
            })
        })
    }
}
//规范2.3
function resolutionProcedure(promise2,x,resolve,reject){
    //规范2.3.1
    //如果 promise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 promise，避免循环引用
    if(promise2 === x){
        return reject(new TypeError('循环引用'));
    }
    //规范2.3.2
    //如果x为promise
    if(x instanceof MyPromise){
        //如果x处于等待太，promise需保持等待态直至x被拒绝或执行
        if(x.state === PENDING){
            x.then(function(value){
                //再次调用该函数是为了确认x resolve的参数是什么类型，如果是基本类型就再次resolve传入下一个then
                resolutionProcedure(promise2,value,resolve,reject);
            },reject)
        }else{
            //如果x处于执行态，用相同的值执行promise
            //如果x处于拒绝态，用相同的据因拒绝promise
            x.then(resolve,reject);
        }
        return;
    }
    //规范2.3.3.3.3
    //如果 resolvePromise 和 rejectPromise 均被调用，或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
    var called = false;
    //规范2.3.3
    if(x !== null && (typeof x === 'object' || typeof x === 'function')){
        
        //规范2.3.3.2
        //如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
        try{
            //规范2.3.3.1
            //把 x.then 赋值给 then
            var then =x.then;
            
            if(typeof then === 'function'){
                //规范2.3.3.3
                //如果 then 是函数，将 x 作为函数的作用域 this 调用之。
                //传递两个回调函数作为参数，第一个参数叫做 resolvePromise ，第二个参数叫做 rejectPromise:
                then.call(
                    x,
                    //规范2.3.3.3.1
                    //如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
                    y => {
                        if(called){
                            return ;
                        }
                        called = true;
                        resolutionProcedure(promise2,y,resolve,reject);
                    },
                    //规范2.3.3.3.2
                    //如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
                    r =>{
                        if(called){
                            return ;
                        }
                        called = true;
                        resolutionProcedure(promise2,r,resolve,reject);
                    }
                );
            }else{
                //规范2.3.3.3.4
                //如果 then 不是函数，以 x 为参数执行 promise
                resolve(x);
            }
        }catch(e){
            //规范2.3.3.3.4
            if(called){
                return;
            }
            called = true;
            reject(e);
        }
    }else{
        //规范2.3.4
        //如果 x 不为对象或者函数，以 x 为参数执行 promise
        resolve(x);
    }
}