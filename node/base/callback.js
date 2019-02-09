//阻塞代码
const fs = require('fs');
// const data = fs.readFileSync('./1.js');
// console.log(data.toString());


fs.readFile('./1.js', (err, data) => {
    if (err) {
        console.error(err);
    }
    console.log(data.toString());
});

console.log('同步执行完毕')

