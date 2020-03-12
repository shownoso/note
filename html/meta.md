# meta

[meta 参考](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meta)

## charset
页面编码
```html
  <meta charset="UTF-8" >
```
## http-equiv
具有 http-equiv 属性的 meta 标签，表示执行一个命令
- content-type 指定 编码方式
- content-language 指定内容的语言；
- default-style 指定默认样式表；
- refresh 刷新；
- set-cookie 模拟 http 头 set-cookie，设置 cookie；
- x-ua-compatible 模拟 http 头 x-ua-compatible，声明 ua 兼容性；
- content-security-policy 模拟 http 头 content-security-policy，声明[内容安全策略](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy)


## name="viewport"

- width：页面宽度，可以取值具体的数字，也可以是 device-width，表示跟设备宽度相等。
- height：页面高度，可以取值具体的数字，也可以是 device-height，表示跟设备高度相等。
- initial-scale：初始缩放比例。
- minimum-scale：最小缩放比例。
- maximum-scale：最大缩放比例。
- user-scalable：是否允许用户缩放。

```html
<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">
```


## 其他预定义的name
- application-name：如果页面是 Web application，用这个标签表示应用名称。
- author: 页面作者。
- description：页面描述，这个属性可能被用于搜索引擎或者其它场合。
- generator: 生成页面所使用的工具，主要用于可视化编辑器，如果是手写 HTML 的网页，不需要加这个 meta。
- keywords: 页面关键字，对于 SEO 场景非常关键。
- referrer: 跳转策略，是一种安全考量。
- theme-color: 页面风格颜色，实际并不会影响页面，但是浏览器可能据此调整页面之外的 UI（如窗口边框或者 tab 的颜色）。


## 常用

```html
<!-- 默认使用最新浏览器 -->
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

<!-- 不被网页(加速)转码 -->
<meta http-equiv="Cache-Control" content="no-siteapp">

<!-- 搜索引擎抓取 -->
<meta name="robots" content="index,follow">
<meta name="renderer" content="webkit">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, minimal-ui">

<!-- 删除苹果默认的工具栏和菜单栏 -->
<meta name="apple-mobile-web-app-capable" content="yes">

<!-- 设置苹果工具栏颜色 -->
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

```