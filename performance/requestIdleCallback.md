# requestIdleCallback
https://developers.google.com/web/updates/2015/08/using-requestidlecallback
当 requestAnimationFrame 回调执行时，开始
一帧的工作： JavaScript -> Style -> Layout -> Paint -> Composite
以及浏览器内部的一些工作的执行。
我们无法准确计算出浏览器一帧中的剩余时间，但是浏览器知道，在一帧中还剩余多少空余时间，于是可以请求浏览器进行调度。
以用户的交互为优先，通过 requestIdleCallback 向浏览器请求这些空余时间来执行相对不重要的任务

```js
function myNonEssentialWork (deadline) {

  while (deadline.timeRemaining() > 0 && tasks.length > 0)
    doWorkIfNeeded();

  // 如果没有剩余时间 那么请求下一个空闲时间
  if (tasks.length > 0)
    requestIdleCallback(myNonEssentialWork);
}
```

如果浏览器一直很忙，那么可以通过设置超时时间来强制执行
```js
requestIdleCallback(processPendingAnalyticsEvents, { timeout: 2000 });
```
如果这样做，会在下一次空闲时期被强制执行
- timeRemaining() === 0
- deadline.didTimeout === true 
这样做其实还是有风险的，如果该任务消耗过大，应用将迟缓或无应答，用户交互就会被影响。
问题： 这个timeout的性质与 setTimeout一样么，都不准时？



## 用于埋点数据的发送
```js
// 维护一个发送队列
var eventsToSend = [];

function onNavOpenClick () {

  // Animate the menu.
  menu.classList.add('open');

  // Store the event for later.
  eventsToSend.push(
    {
      category: 'button',
      action: 'click',
      label: 'nav',
      value: 'open'
    });

  schedulePendingEvents();
}

// 规划等待事件，安排计划任务
function schedulePendingEvents() {

  // 仅处理未加入到 requestIdleCallback 的任务
  if (isRequestIdleCallbackScheduled)
    return;

  isRequestIdleCallbackScheduled = true;

  if ('requestIdleCallback' in window) {
    // Wait at most two seconds before processing events.
    requestIdleCallback(processPendingAnalyticsEvents, { timeout: 2000 });
  } else {
    processPendingAnalyticsEvents();
  }
}


function processPendingAnalyticsEvents (deadline) {

  // 重置标志位，这样下一个任务可以被加入
  isRequestIdleCallbackScheduled = false;

  // 对于不支持 requestIdleCallback 的浏览器的兼容
  if (typeof deadline === 'undefined')
    deadline = { timeRemaining: function () { return Number.MAX_VALUE } };

  // Go for as long as there is time remaining and work to do.
  while (deadline.timeRemaining() > 0 && eventsToSend.length > 0) {
    // 取出事件对象
    var evt = eventsToSend.pop();
    // 发送给谷歌分析
    ga('send', 'event',
        evt.category,
        evt.action,
        evt.label,
        evt.value);
  }

  // 若队列中仍然有任务却没时间了，继续进行计划任务安排处理
  if (eventsToSend.length > 0)
    schedulePendingEvents();
}


```


## 用于 VDOM 变更

- 对于 DOM变更 总是使用 requestAnimationFrame 处理 这是因为 Layout 的消耗以及避免强制同步布局
- 对于 virtualDOM 变更（实质是js对象） 使用 requestIdleCallback
- 但是 virtualDOM 做 DOM patches 时，应当在下一个 requestAnimationFrame 回调中处理
- VDOM存疑？ rIC调用频率太低了 是否用rAF全盘接手？

```js
// 加工待处理的元素
function processPendingElements (deadline) {

  // // 对于不支持 requestIdleCallback 的浏览器的兼容
  if (typeof deadline === 'undefined')
    deadline = { timeRemaining: function () { return Number.MAX_VALUE } };

  if (!documentFragment)
    documentFragment = document.createDocumentFragment();

  // 当前有空闲时间
  while (deadline.timeRemaining() > 0 && elementsToAdd.length > 0) {

    // 创建元素
    var elToAdd = elementsToAdd.pop();
    var el = document.createElement(elToAdd.tag);
    el.textContent = elToAdd.content;

    // 将创建的元素放入文档片段
    documentFragment.appendChild(el);

    // 在 requestIdleCallback 中处理js操作
    // 在下一个 requestAnimationFrame 将整个文档片段append到document中
    // 对于VDOM框架 比如react 在 requestIdleCallback 处理dom变更
    scheduleVisualUpdateIfNeeded();
  }

  // 如果没时间了但是还有剩余元素没创建，进入下一次创建任务计划，重新请求下一个空闲时间处理
  if (elementsToAdd.length > 0)
    scheduleElementCreation();
}

// 使用 requestAnimationFrame 真正操作更新视图（下一帧）
function scheduleVisualUpdateIfNeeded() {

  if (isVisualUpdateScheduled)
    return;

  isVisualUpdateScheduled = true;

  requestAnimationFrame(appendDocumentFragment);
}


```


- 上述示例中的任务使用了队列 是可以分解的，如果当前帧空闲时间未完成，手动请求下一次。 但是如果一个任务无法分解，在当前帧空闲时间未完成，也没有关系，浏览器不会停止它，而是  the browser gives you the deadline to try and ensure a smooth experience for your users， 浏览器会自动协调下一个空闲时间

- timeRemaining() 目前最大值 50ms  合适的用户交互响应应当小于100ms
- 需要注意 dom更新引起的一系列style calculations, layout, painting, and compositing. 因此使用requestAnimationFrame处理。
- 需要注意 在idle回调结束时，resolving (or rejecting) Promises的回调会被立即执行，无论当前是否有空闲时间
- 嵌套 requestIdleCallback ，The new idle callback will be scheduled to run as soon as possible, starting from the next frame (rather than the current one).