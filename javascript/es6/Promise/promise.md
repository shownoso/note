

1. 状态一旦变更不可修改
2. then期望传入函数，否则按then链进行值透传
3. 当前状态被更改为fullfilled时（resolve），then被调用，并将then的回调推入微任务队列
4. then的结果是一个Promise
5. 上一个then的回调函数的返回值是下一个then中回调函数的参数；以下是then中return的情况：

    - new Error: 将作为下一个then中回调函数的参数，当期望错误被catch，直接throw即可
    - new Promise(): 等待这个Promise实例的状态改变

返回值 | 返回的promise的状态 | 传递给下一个then/catch中回调函数的参数    
-|-|-
无 | resolved  | undefined |
一个值 | resolved  | 这个值 |
throw new Error | rejected | catch中，这个错误 |
return new Error | resolved  | then中，这个错误 |
非pending状态的Promise | 与返回的Promise状态一致 | 同这个Promise |
pending状态的Promise | pending  | 等待终态的产生，并且参数与终态时调用的回调函数的参数一致 |


