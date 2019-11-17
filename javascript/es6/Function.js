// arrow  function
// 1. this绑定词法作用域，不可作为构造函数
// 2. 不可作为generator
// 3. 没有arguments对象，可以用...args替代
let fn = (a, b = 'shown') => a === b; 
console.log(fn('shown', undefined)); // 当不传入或传入为undefined时 使用默认值
console.log(`必须传递的形参个数： ${fn.length}`); // 1


let fn2 = (...args) => console.log(args);
fn2(1,2,3);

let fn3 = ({shown, oso = 'oso'}) => console.log(shown, oso);
fn3({
    shown: 'shown',
});