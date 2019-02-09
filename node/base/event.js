const events = require('events');
//创建eventsEmitter
const emitter = new events.EventEmitter();

//绑定事件处理函数

const handler = function connected() {
    console.log('connected!');
}


// 完成绑定
emitter.on('event1', handler);

//触发事件

emitter.emit('event1');