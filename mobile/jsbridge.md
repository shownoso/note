# 通信桥梁

js 与 native 互相 rpc

## js 调用 native
1. 注入 API：通过 WebView 提供的接口，向 JavaScript 的 Context（window）中注入对象或者方法

2. 拦截 URL SCHEME：Web 端发送 URL Scheme 请求，Native 拦截
  - 耗时长 不怎么推荐

## native 调用 js
直接执行拼接好的 JavaScript 代码，从外部调用 JavaScript 中的方法，因此 JavaScript 的方法必须在全局的 window 上。

## 原理
```js
window.JSBridge = {
  // 调用 Native
  invoke: function(bridgeName, data) {
    // 判断环境，获取不同的 nativeBridge
    nativeBridge.postMessage({
      bridgeName: bridgeName,
      data: data || {}
    });
  },
  receiveMessage: function(msg) {
    var bridgeName = msg.bridgeName,
      data = msg.data || {};
    // 具体逻辑
  }
};
```

消息都是单向的，那么调用 Native 功能时的 Callback 即  RPC 框架的回调机制  
也可以是 JSONP 形式  

native ： 接收到 JavaScript 消息 => 解析参数，拿到 bridgeName、data 和 callbackId => 根据 bridgeName 找到功能方法，以 data 为参数执行 => 执行返回值和 callbackId 一起回传前端。