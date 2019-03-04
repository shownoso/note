

## 如何运用本地存储

## 缓存优先级


## http2有什么问题



##

chrome rendering

绿框 重绘


## 网页渲染流程
1. dom分层
2. 每个图层节点的样式计算 recalculate style
3. 为每个节点生成图形和位置： 重排  layout
4. 对每个节点进行绘制并添加到所在图层的位图中 重绘 paint 
5. 将位图上传至GPU  比如处理旋转、缩放、偏移、透明度等呈现 composite layers（并不是每个图层都有GPU参与）
composite ： https://juejin.im/entry/59dc9aedf265da43200232f9

主要过程：

layout =》 paint =》 composite layers

1. 占据独立层的元素

根元素 position transform 半透明 css滤镜 video overflow

2. GPU参与的元素

CSS3D CSS滤镜 CSStransform video webgl（使js运行在GPU的库 gpu.js）

运用： 强制3d 让gpu参与
3. cpu  gpu

相同： 总线和外接联系、缓存体系、数字和逻辑与预算单元、计算而生
不同： cpu主要负责和操作系统

4. 重绘不一定引起重排，重排一定引起重绘


添加或者删除元素
元素位置改变
使用怪异盒模型：不会让盒子发生太多变化 box-sizing: border-box 减少重排
页面初始化
内容变化（没有撑开盒子）
js 读取值 offset scroll width getComputedStyle ： 为什么？  因为浏览器优化过程被断
浏览器对js操作元素的时候会维护一个队列，合并一些操作减少重排
但是一旦读取的时候，浏览器就会取消优化


如何解决？ 先读  然后使用 requestAnimationFrame() 在下一帧写




