var a = 0;

async function asyncFn() {
    let res  = a + await Promise.resolve(9); //yield 锁住res 为 9  
    console.log(res) 
}
asyncFn();
a = a + 1;
console.log(a);