# 安全

## 同源策略与跨域
如果两个 URL 的协议、域名和端口都相同

### 限制

1. 非同源的 JavaScript 脚本不能对当前 DOM 对象读和写的操作。
2. 非同源的站点无法读取当前站点的 Cookie、IndexDB、LocalStorage 等数据。
3. 不能通过 XMLHttpRequest 等方式将站点的数据发送给非同源的站点。

### 跨域访问

1. 跨文档消息机制：可以通过 window.postMessage 的 JavaScript 接口来和不同源的 DOM 进行通信。
2. 跨域资源共享（CORS）：跨域资源在服务端设置允许跨域，就可以进行跨域访问控制，从而使跨域数据传输得以安全进行。
```
传递cookie， Access-Control-Allow-Origin 不可为 *
服务端
Access-Control-Allow-Origin: a.com
Access-Control-Allow-Credentials: true

客户端
xhr.withCredentials = true;

```
3. 内容安全策略（CSP）:主要以白名单的形式配置可信任的内容来源，在网页中，能够使白名单中的内容正常执行（包含 JS，CSS，Image 等等），而非白名单的内容无法正常执行。
```html
//meta

<meta http-equiv="Content-Security-Policy" content="script-src 'self'">
//header

Content-Security-Policy:
script-src 'unsafe-inline' 'unsafe-eval' 'self' *.54php.cn *.yunetidc.com *.baidu.com *.cnzz.com *.duoshuo.com *.jiathis.com;report-uri /error/csp
```
4. JSONP 老旧浏览器 get



## XSS
获取敏感信息
1. 存储型： 恶意代码入库，回显到浏览器执行
2. 反射型： 恶意代码入接口，接口回显（反射）到浏览器执行
3. DOM 型： 页面处理。 
  - httponly
  - 输入过滤，敏感字符转换为 html 实体
  - CSP

## CSRF
利用登录状态

1. SameSite
2. Orign、Referer 
  - referenrce policy  如 window.opener
<a href="https://xxxx" rel="noopener noreferrer"> 外链 <a>
3. CSRF token
  - 请求地址中添加
  - header中自定义属性

## 点击劫持
- 诱使用户点击看似无害的按钮（实则点击了透明 iframe 中的按钮）
- 监听鼠标移动事件，让危险按钮始终在鼠标下方
- 使用 HTML5 拖拽技术执行敏感操作（例如 deploy key）

### 预防
1. 服务端添加 X-Frame-Options 响应头,这个 HTTP 响应头是为了防御用 iframe 嵌套的点击劫持攻击。 这样浏览器就会阻止嵌入网页的渲染。
2. JS 判断顶层视口的域名是不是和本页面的域名一致，不一致则不允许操作，top.location.hostname === self.location.hostname；
3. 敏感操作使用更复杂的步骤（验证码、输入项目名称以删除）。

