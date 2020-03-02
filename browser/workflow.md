## 浏览器工作流程

### 一、简单的请求/响应模型
客户端请求，服务端响应

### 二、 处理流程
1. 输⼊⽹址并回车
    - 确认协议(以下均认为是http)
    - 连接检测
    - 缓存查询
    - 跨越网关
2. 解析域名
    - DNS服务器
3. 浏览器发送[HTTP](../protocol/http.md)请求
    - 路由策略：来回可能是不同路径 分块也可能不同路径
4. 服务器处理请求
5. 服务器返回HTML响应
6. 浏览器处理HTML页⾯
7. 继续请求其他资源


### 三、timing-overview
https://www.w3.org/TR/navigation-timing/#sec-navigation-timing
![image](https://www.w3.org/TR/navigation-timing/timing-overview.png)


1. prompt for unload 提示卸载
    - navigationStart 导航开始
2. redirect 重定向
    - redirectStart 重定向开始
    - redirectEnd 重定向结束
3. unload 卸载，与重定向可同时发生
    - unloadStart 卸载开始； unloadEventStart 卸载开始之前的时间
    - unloadEnd 卸载结束； unloadEventEnd 卸载完成的时间
4. APP cache 应用缓存
    - fetchStart HTTP GET等效方式请求资源前的时间 （若有缓存，则记录为当前时间，否则记录为请求资源开始前的时间）

```网络开始```

5. DNS (应用层协议，使用的传输层协议是UDP，使用CDN优化)
    - domainLookupStart 查询DNS的开始时间。如果请求没有发起DNS请求，如keep-alive，缓存等，则返回fetchStart
    - domainLookupEnd 查询DNS的结束时间。如果没有发起DNS请求，同上

```TCP开始```

6. TCP (可使用长连接进行优化)
    - connectStart 开始建立TCP请求的时间。如果请求是keep-alive，缓存等，则返回domainLookupEnd
    - (secureConnectionStart) 如果在进行TLS或SSL，则返回握手时间
    - connectEnd 完成TCP链接的时间。如果是keep-alive，缓存等，同connectStart

```HTTP开始```

7. Request 请求
    - requestStart 发起请求的时间
8. Response 响应
    - responseStart 服务器开始响应的时间
    - responseEnd 服务器结束响应的时间

```网络结束```

9. Processing 处理(默认为HTML文档，描述Document.readyState: ``` loading、interactive、complete ```)
    - domLoading 正在加载之前立即记录
    - domInteractive 可交互之前立即记录， 页面呈现
    - domContentLoaded 
        - domContentLoadedEventStart DOMContentLoaded事件之前，立即记录
        - domContentLoadedEventEnd  domContentLoaded 事件结束
    - domComplete 就绪 complete： $(function(){}) => window.addEventListener('domContentLoaded')

10. onLoad 文档加载
    - loadEventStart 触发加载的时间
    - loadEventEnd 加载完成 开始由渲染器渲染 ``` window.onload  全部资源加载完毕```
[onload](./index.html)



