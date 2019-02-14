var delay = 2; // 0 => 1 2   100 => 2 1 
setTimeout(function () {
  console.log(1);
}, delay);
setImmediate(function () {
  console.log(2);
});

process.nextTick(() => {
  console.log(3);
});
new Promise((resovle,reject)=>{
  console.log(4);
  resovle(4);
}).then(function(){
  console.log(5);
});
console.log(6);



async function test() {
  console.log('Hello');
  await sleep(1000); // 如果时间为0 结果也一样 micro-task
  console.log('world!');
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
test();
