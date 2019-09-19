

function req(name,t = 1000) {
    return new Promise(resolve => {
        console.log('req:' + name)
       
        name === 'shown' && (function() {
            throw new Error('shown error')
        })()
        
        setTimeout(function() {
            resolve(name);
        }, t)

    }).catch(e => console.log(e)) // await 错误处理
}

async function requestBatch() {
    const reqQuque = [req('shown'), req('oso', 3000)];
    const result2 = await Promise.all(reqQuque).then(res => console.log(res)).catch(e => console.log(e));

    
    console.log(result2)
}

requestBatch();