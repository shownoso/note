# 渲染
构建 DOM 树、样式计算、布局阶段、分层、绘制、分块、光栅化和合成。
主线程： Dom Style Layout Layer Paint
非主线程：tiles raster draw quad display
每一个步骤都有其输入的内容，有其处理过程，生成输出内容。
## 构建 DOM 树
将 HTML 转换为 DOM 树，通过查看 `document` 对象即可查看整个文档的构建结果。

## 样式计算
渲染引擎会把获取到的 CSS 文本全部转换为 `document.styleSheets`。该样式表为样式操作提供了查询和修改等功能。  
将所有CSS 属性值转换为渲染引擎容易理解的、标准化的计算值。
输出每个 DOM 节点的样式。ComputedStyle （chrome devtool 选中元素 computed）

## 布局（Layout）
针对可见元素。
布局是浏览器计算各元素几何信息的过程：元素的大小以及在页面中的位置。
在 Firefox 中称为*重排（Reflow）*。
Layout Tree = DOM Tree + styleSheets。

在以前，这样描述：
Render Tree = DOM Tree + CSSOM Tree。

在执行布局操作的时候，会把布局运算的结果重新写回布局树中，所以布局树既是输入内容也是输出内容，这是布局阶段一个不合理的地方，因为在布局阶段并没有清晰地将输入内容和输出内容区分开来。针对这个问题，Chrome 团队正在重构布局代码，下一代布局系统叫 LayoutNG，试图更清晰地分离输入和输出，从而让新设计的布局算法更加简单。

分开来，结构会更加清晰，目前布局操作都是在主线程执行执行的，如果将布局的输入结构和输出结构分开来，那么可以在另外一个线程上执行布局操作，解析完把结果提交给主线程，这样会减轻主线程的压力。

所以将输入结构和输出结构分开，后续就可以更好地重构渲染模块的代码了！

## 图层 （Layer）
渲染引擎为特定的节点生成专用的图层，并生成一棵对应的图层树（LayerTree）。 
chrome devtool - moretool - Layers
### 产生：
1. [层叠上下文](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Understanding_z_index/The_stacking_context)的产生
2. clip 旧的浏览器，可忽略

### 绘制
1. 绘制指令
绘制指令执行一个简单的 绘制操作 ，每个元素的背景、前景、边框都需要单独的指令去绘制，每个图层的绘制都由一系列的绘制指令组成。
2. 栅格化（raster）操作
绘制操作是由渲染引擎中的合成线程来完成的
当图层的绘制列表准备好之后，主线程会把该绘制列表提交（commit）给合成线程
![render-processing](../image/render-processing.png)

3. 视口 （viewport）
屏幕上页面的可见区域。事实上浏览器不需要一次性绘制所有图层，它优先满足视口的可见性。
合成线程会将图层划分为图块（tile），按照视口附近的图块来*优先*生成位图。
这个将图块转换为位图的过程叫做 栅格（raster）化。
渲染进程维护了一个栅格化的线程池
![raster-task](../image/raster-task.png)

通常，栅格化过程都会使用 GPU 来加速生成，使用 GPU 生成位图的过程叫快速栅格化，或者 GPU 栅格化，生成的位图被保存在 GPU 内存中。GPU 操作是运行在 GPU 进程中，如果栅格化操作使用了 GPU，那么最终生成位图的操作是在 GPU 中完成的，这就涉及到了跨进程操作。
![gpu-raster](../image/gpu-raster.png)

渲染进程把生成图块的指令发送给 GPU，然后在 GPU 中执行生成图块的位图，并保存在 GPU 的内存中。
4. 合成
一旦所有图块都被光栅化，合成线程就会生成一个绘制图块的命令——“DrawQuad”，然后将该命令提交给浏览器进程。

浏览器进程里面有一个叫 viz 的组件，用来接收合成线程发过来的 DrawQuad 命令，然后根据 DrawQuad 命令，将其页面内容绘制到内存中，最后再将内存显示在屏幕上。

## 渲染流程总结
![render-sumarry](../image/render-summary.png)
1. 渲染进程将 HTML 内容转换为能够读懂的 DOM 树结构。
2. 渲染引擎将 CSS 样式表转化为浏览器可以理解的 styleSheets，计算出 DOM 节点的样式。
3. 创建布局树，并计算元素的布局信息。
4. 对布局树进行分层，并生成分层树。
5. 为每个图层生成绘制列表，并将其提交到合成线程。
6. 合成线程将图层分成图块，并在光栅化线程池中将图块转换成位图。
7. 合成线程发送绘制图块命令 DrawQuad 给浏览器进程。
8. 浏览器进程根据 DrawQuad 消息生成页面，并显示到显示器上。

## 布局（重排）的触发
对“几何属性”的更改都会触发 Layout，比如元素的宽、高、定位的位置等。
重新布局需要更新完整的渲染流程，所以开销也是最大的
## paint的触发
更新元素的绘制属性
重绘省去了布局和分层阶段，所以执行效率会比重排操作要高一些。

## 合成
[composite layers](https://juejin.im/entry/59dc9aedf265da43200232f9) 将位图（BitMap）传输到GPU 渲染到屏幕 
更改一个既不要布局也不要绘制的属性
缓存到GPU，不会重发layout paint


## CSS Triggers
触发布局、绘制或合成的 CSS 属性：[查看](https://csstriggers.com/)

## 优化建议

1. 使用 class 操作样式，而不是频繁操作 style
2. 避免使用 table 布局
3. 批量dom 操作，例如 createDocumentFragment，或者使用框架，例如 React
4. Debounce window resize 事件
5. 对 dom 属性的读写要分离
6. will-change: transform 做优化

## canvas 
api控制绘制

## 滚动
现代浏览器做了优化，把滚动操作交给了合成线程来处理，也就是说滚动的内容会被当成一个单独的图层，发生滚动的事件的时候，图层直接由合成线程来生成，也就是说这种情况下没有占用主线程，所以通常情况下不会产生重排和重回操作，只是简单合成就可以了，这样效率是最高的！



比如LayerTree中可能有五层，但是并不是每层都会单独的绘制出来，Chrome为了效率考虑，将一些不需要单独绘制的层合并在一起绘制，这就是GraphicsLayer，GraphicsLayer会分配一块空间用来保持绘制的图像。


关于，层压缩（Layer Squashing）这个概念你可以了解下。


1:首先渲染进程里执行图层合成(Layer Compositor)，也就是生成图层的操作，具体地讲，渲染进程的合成线程接收到图层的绘制消息时，会通过光栅化线程池将其提交给GPU进程，在GPU进程中执行光栅化操作，执行完成，再将结果返回给渲染进程的合成线程，执行合成图层操作！

2:合成的图层会被提交给浏览器进程，浏览器进程里会执行显示合成(Display Compositor)，也就是将所有的图层合成为可以显示的页面图片。 最终显示器显示的就是浏览器进程中合成的页面图片