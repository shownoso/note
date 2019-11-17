let json = {
    '0': 'A',
    '1': 'B',
    '2': 'C',
    length: 3
};
console.log(Array.from(json));

console.log(Array.of(1,2,3));


// 实例上的新方法

let instance = [1,2,3];
console.log(instance.find((item, index, arr) => item ===2)); //2

instance.fill('shown', 0, 2); // 从index为0开始填充2位
console.log(instance); // [ 'shown', 'shown', 3 ]

// 判断空位，仅当空位时才false
let sparseArr = [,1,2];
console.log(`index 0 是有值的： ${0 in sparseArr}`);

// 遍历
// 普通遍历
// forEach
// for of
// 功能性遍历
// filter
// map
// some
// every
let arr = ['A', 'B', 'C'];

arr.forEach((value, index) => console.log(value, index));

for (let item of arr){
    console.log(item);
}

for (let index of arr.keys()){
    console.log(index);
}

let interator = arr.entries();
console.log(interator);
console.log(interator.next()); 
// 注意 这里第一项已经被next 下面循环只剩2项
for (let nextItem of interator){
    console.log(nextItem);
}
// 完整遍历
for (let [index, value] of arr.entries()){
    console.log(`index: ${index}   value: ${value}`);
}


