# DOM Tree

## 准备渲染
- 网络进程根据响应头中的 content-type 字段来判断文件的类型（`content-type text/html`）。因为是 HTML 文档，浏览器进程准备一个渲染进程，并向渲染进程发起“提交文档”的消息。
- 渲染进程收到“提交文档”的消息后，和网络进程建立一个共享数据的管道，网络进程接收到数据后就往这个管道里面放，而渲染进程则从管道的另外一端不断地读取数据，并同时将读取的数据交给 HTML 解析器进行解析。
- 等文档数据传输完成之后，渲染进程会返回“确认提交”的消息给浏览器进程；提交数据之后渲染进程会创建一个空白页面，称为[解析白屏](#解析白屏)
- 浏览器进程在收到“确认提交”的消息后，会更新浏览器界面状态，包括了安全状态、地址栏的 URL、前进后退的历史状态，并更新 Web 页面。
- HTML 解析器会动态接收字节流，并将其解析为 DOM。
- 之后进行后续渲染

## DOM 解析
### 分词
通过分词器将字节流转换为 Token（最小的单词）
- Tag Token： 即标签，分为 StartTag 和 EndTag 分别代表开始标签 `<tagName>`和结束标签`<tagName/>`
- 文本 Token

### 词法安全检查 XSSAuditor
渲染引擎的一个安全检查模块叫，用于检测词法安全。在分词器解析出来 Token 之后，它会检测这些模块是否安全，比如是否引用了外部脚本，是否符合 CSP 规范，是否存在跨站点请求等。如果出现不符合规范的内容，XSSAuditor 会对该脚本或者下载任务进行拦截。

### 将 Token 解析为 DOM 节点，并将 DOM 节点添加到 DOM 树中
维护一个Token 栈：计算节点之间的父子关系,用于 DOM 树构建的数据模型。Token 将按照顺序压入。
- 默认的 栈底部有一个 startTag document
- 压入 StartTag Token，将创建一个 DOM 节点加入到 DOM 树中，其父节点就是栈中相邻的 Token 生成的节点。
- 如果是 文本 Token， 直接将文本加入到 DOM 树中，其父节点就是当前栈顶 Token 所对应的 DOM 节点。
- 如果是 EndTag Token，与栈顶的元素进行比较，如果匹配则弹出栈顶的 Token，该元素解析完毕。

### 解析过程中遇到内联脚本
暂停解析流程，并优先执行脚本内容

### 解析过程中遇到 js 文件请求
暂停解析流程，等待 js 文件加载完成，然后优先执行脚本内容。

### 解析过程中遇到 CSS 文件请求
暂停解析流程，等待 CSS文件加载完成

### 渲染流水线
![css-js-render-flow](../image/css-js-render-flow.png)

#### 优化阻塞
1. 浏览器的优化：Chrome-预解析操作，渲染引擎收到字节流之后，会开启一个预解析线程，用来分析 HTML 文件中包含的 JavaScript、CSS 等相关文件，解析到相关文件之后，预解析线程会提前下载这些文件。
2. 对于内容不涉及 DOM 操作的 js 文件，通过异步加载优化
```html
<!-- async：一旦加载立即执行 还是有可能阻塞-->
<script async type="text/javascript" src='foo.js'></script>
<!-- defer： DOMContentLoaded 事件之前执行 -->
<script defer type="text/javascript" src='foo.js'></script>

```
3. 脚本中可能操作 CSSOM（styleSheets），需要等待外部的 CSS 文件下载完成，并解析生成 CSSOM 对象之后，因此 Js 脚本依赖样式表，样式文件会阻塞 Js 的执行

4. script 放在`</body> `之前：保证了 DOM 提前生成，不过因为要执行完该脚本才开始渲染，所以本质还是阻塞了渲染的。
## 解析白屏
文档数据传输完成之后，渲染进程会返回“确认提交”的消息给浏览器进程；提交数据之后渲染进程会创建一个空白页面。这个过程主要包括了解析 HTML、下载 CSS、下载 JavaScript、生成 CSSOM（styleSheets）、执行 JavaScript、生成布局树（DOM tree + styleSheets）、绘制页面。

### 缩短白屏
1. 用内联 CSS、Js 的方式 替代 CSS 文件和 Js 文件的下载（视具体情况而定）
2. 同优化阻塞的方案，对于内容不涉及 DOM 操作的 js 文件，通过异步加载优化
3. CSS 文件拆分，按照特定场景引入特定的CSS （使用media）