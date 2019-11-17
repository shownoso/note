// 常量
console.log(`最大: ${Number.MAX_SAFE_INTEGER}`);
console.log(`最小: ${Number.MIN_SAFE_INTEGER}`);
const MAX_VAL = Math.pow(2, 53) - 1;
console.log(`MAX_VAL === MAX_SAFE_INTEGER: ${MAX_VAL === Number.MAX_SAFE_INTEGER}`);

// 进制表示
let binary = 0B111; //二进制
let octal = 0O111; //八进制

console.log(binary);
console.log(octal);

// API
let isFinite = Number.isFinite(NaN);
let isNaN = Number.isNaN(NaN);
let isInteger = Number.isInteger(1.0); // 1.0是整数
let isNumByType = typeof NaN;
let isSafeInteger = Number.isSafeInteger(MAX_VAL + 1);

console.log(`isFinite: ${isFinite}`); // false
console.log(`isNaN: ${isNaN}`); // true
console.log(`isInteger: ${isInteger}`); //true
console.log(`isNumByType: ${isNumByType}`); // 注意，是number
console.log(`isSafeInteger: ${isSafeInteger}`); //false