const timeout = ms =>
    new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    }).catch(e => console.log(e));
const ajax1 = () =>
    timeout(1000).then(() => {
        console.log("1");
        return 1;
    });
const ajax2 = () =>
    timeout(2000).then(() => {
        console.log("2");
        return 2;
    });
const ajax3 = () =>
    timeout(3000).then(() => {
        console.log("3");
        return 3;
    });

const mergePromise = (ajaxArray) => {

    var result = [];
    const reducer = (previousPromise, nextPromise) => previousPromise.then(() => {
        return nextPromise().then(res => result.push(res))
    });

    return ajaxArray.reduce(reducer, Promise.resolve()).then((res) => {
        console.log(res)
        return result
    });

}

mergePromise([ajax1, ajax2, ajax3]).then(data => {
    console.log("done");
    console.log(data); // data 为 [1, 2, 3]
});