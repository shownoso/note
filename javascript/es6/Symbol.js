let symbol = Symbol('shownoso');
console.log(typeof symbol); // symbol
console.log(symbol); // Symbol(shownoso)
console.log(symbol.toString()); // 'Symbol(shownoso)'

let obj = {
    [symbol]: 'shown',
    age: 28,
}

// symbol为key的属性受保护，无法遍历得到
for (let prop in obj) {
    console.log(obj[prop]); 
}

console.log(obj[symbol]); // 只能通过属性名获取