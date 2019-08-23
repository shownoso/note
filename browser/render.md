## 渲染

### Loading阶段
1. DOM tree
2. CSS tree

### 渲染(Rendering)阶段

#### 渲染树
生成渲染树 Recalculate Style  
Render tree = DOM + CSS

#### layout 
布局，决定元素排列位置
width、 height、 margin、 left/top...
#### paint
绘制
box-shadow、 border-radius、 background...
1. Paint Setup
2. Paint

#### 绘制(Painting)-合成层
[composite layers](https://juejin.im/entry/59dc9aedf265da43200232f9) 将位图（BitMap）传输到GPU 渲染到屏幕 

3D transform
animation、transition实现的动画
video、canvas、Flash
CSS Filter
z-index大于某个相邻节点的Layer

### 触发渲染阶段
修改不同css属性。
查询CSS属性触发结果：https://csstriggers.com/
触发的阶段越靠前，渲染的代价会越高。
