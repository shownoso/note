// 两个例子 理解微任务队列
 
new Promise((resolve,reject)=>{
    console.log("promise1",1)  
    resolve();
    // micro: [then11]
}).then(()=>{
    
    console.log("then11",2)
    // 显式return 立即执行
    return new Promise((resolve,reject)=>{
        console.log("promise2",3)
        resolve();
        // resolve micro: [then21]
    }).then(()=>{
        console.log("then21",4)
        new Promise((resolve,reject)=>{
            console.log("promise3",5)
            resolve();
            // micro: [then31] => log1   
        }).then(()=>{
            console.log("then31",7)
            // log2：then回调结束 resolve micro: [then22, then32]  继续清理then22
        }).then(()=>{
                console.log("then32",9)  
        });
        // log1:  then回调结束 resolve micro: [then31, then22] 同步结束，此时应当清除所有微任务 首先清理then31 => log2
    }).then(()=>{
        console.log("then22",8)
        // then回调结束 resolve,
        //  micro: [then32, then12] 同步结束 清理当前微任务队列 
    })

}).then(()=>{
    console.log("then12",6)
}) 




