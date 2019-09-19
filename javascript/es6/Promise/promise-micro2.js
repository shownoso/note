// 两个例子 理解微任务队列


new Promise((resolve,reject)=>{
    console.log("promise1",1)  
    resolve();
    // resolve   micro: [then11]
}).then(()=>{
    console.log("then11",2)
    new Promise((resolve,reject)=>{
        console.log("promise2",3)
        resolve();
        // micro: [then21] => log0
    }).then(()=>{
        console.log("then21",4)
        // micro:[then12]
        new Promise((resolve,reject)=>{
            console.log("promise3",5)
            resolve();
            // resolve micro:[then12, then31] =>log1
        }).then(()=>{
            console.log("then31",7)
            // log2: then回调结束 resolve micro: [then22, then32] 首先处理then22 => log3
        }).then(()=>{
                console.log("then32",9)
        })

        // log1:  then回调结束 resolve  micro: [then12, then31, then22]  继续处理then12
    }).then(()=>{
        console.log("then22",8)
        // log3: micro: [then32]
    })
     

    // log0 then回调结束 resolve micro: [then21, then12] 同步结束，此时应当清除所有微任务 首先清理then21
}).then(()=>{
    console.log("then12",6)
    // micro: [then31, then22] 同步结束，此时应当清除所有微任务 首先清理then31 => log2
}) 