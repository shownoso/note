 async function asyncFn() {
    const promise1 = await 1;
    const promise2 = await Promise.resolve(2);
    console.log(promise1, promise2)
    
    // return new Promise((resolve) => {
    //     resolve(3)
    //     console.log('promise3')
    // }).then((ful) => {
    //     console.log('then31')
    //     console.log(ful)
    //     return 4
    // }).then((ful) => {
    //     console.log('then32')
    //     console.log(ful)
    //     return 5
    // })
    // 默认返回一个promise实例
    return 6
}

const fn = asyncFn()
console.log(fn)
fn.then((ful) => {
    console.log('out then')
    console.log(ful)
})


