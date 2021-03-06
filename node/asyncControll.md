## 常用的Node控制异步技术手段
1. Step、wind（提供等待的异步库）、Bigpipe、Q.js
2. Async、Await
3. Promise/Defferred是一种先执行异步调用，延迟传递的处理方式。Promise是高级接口，事件是低级接口。低级接口可以构建更多复杂的场景，高级接口一旦定义，不太容易变化，不再有低级接口的灵活性，但对于解决问题非常有效


### 协程
协程，又称微线程，纤程。英文名Coroutine。由于Node基于V8的原因，目前还不支持协程。

协程不是进程或线程，其执行过程更类似于子进程(子程序)，或者说不带返回值的函数调用。
一个程序可以包含多个协程，可以类比于一个进程包含多个线程。

#### 比较协程和线程

多个线程相对独立，有自己的上下文，切换受系统控制；
而协程也相对独立，有自己的上下文，但是其切换由自己控制，由当前协程切换到其他协程由当前协程来控制。

---

以下内容摘抄自https://www.liaoxuefeng.com/wiki/0014316089557264a6b348958f449949df42a6d3a2e542c000/001432090171191d05dae6e129940518d1d6cf6eeaaa969000

#### 深入对比理解

子程序（函数），在所有语言中都是层级调用，比如A调用B，B在执行过程中又调用了C，C执行完毕返回，B执行完毕返回，最后是A执行完毕。

所以子程序调用是通过栈实现的，一个线程就是执行一个子程序。

子程序调用总是一个入口，一次返回，调用顺序是明确的。而协程的调用和子程序不同。

协程看上去也是子程序，但执行过程中，在子程序内部可中断，然后转而执行别的子程序，在适当的时候再返回来接着执行。


#### 协程的优势
最大的优势就是协程极高的执行效率。因为子程序切换不是线程切换，而是由程序自身控制，因此，没有线程切换的开销，和多线程比，线程数量越多，协程的性能优势就越明显。

第二大优势就是不需要多线程的锁机制，因为只有一个线程，也不存在同时写变量冲突，在协程中控制共享资源不加锁，只需要判断状态就好了，所以执行效率比多线程高很多。

因为协程是一个线程执行，那怎么利用多核CPU呢？最简单的方法是多进程+协程，既充分利用多核，又充分发挥协程的高效率，可获得极高的性能。