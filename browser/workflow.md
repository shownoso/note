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


1. 