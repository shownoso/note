# 布局（Layout）
布局是浏览器计算各元素几何信息的过程：元素的大小以及在页面中的位置。
在 Firefox 中称为*重排（Reflow）*。  
https://developers.google.com/web/fundamentals/performance/rendering/avoid-large-complex-layouts-and-layout-thrashing

## 触发条件
对“几何属性”的更改都会触发 Layout，比如元素的宽、高、定位的位置等。
[CSS Trigger](https://csstriggers.com/)
## 观察布局消费的时间
使用 Chrome DevTools - Performance 面板进行录制，查看 Layout 消费的时间。

## 优化与注意点
- 布局几乎总是作用到整个文档。 如果有大量元素，将需要很长时间来算出所有元素的位置和尺寸。
- DOM 元素的数量将影响性能；应当尽可能避免布局
- 尽可能使用 Flexbox，因为它比定位/浮动布局在 Layout 消耗上更少。
- 始终应先批量读取样式并执行（浏览器可以使用上一帧的布局值），然后执行任何写操作（[FastDOM](https://github.com/wilsonpage/fastdom)可以批处理读取和写入），从而避免强制同步布局和布局抖动


### 强制同步布局
在当前帧通过 js 强制浏览器提前执行布局。

一帧的顺序： JavaScript -> Style -> Layout -> Paint -> Composite

在当前帧的 JavaScript 阶段，上一帧的所有旧布局值是已知的，那么在此时进行读取，浏览器可以使用上一帧的布局值进行反馈。  
```js
// 在下一帧开始时
requestAnimationFrame(logBoxHeight);
function logBoxHeight() {
  // 读取盒子的高，反馈的是上一帧时的值。
  console.log(box.offsetHeight);
}
```
假如在当前帧 JavaScript 阶段对 DOM 进行了样式更改，随后又对其进行了样式读取，那么为了反馈真实的 DOM 样式，浏览器必须*立即*应用这个样式更改，提前执行布局并反馈正确的值。此时发生了*强制同步布局*。

```js
// 在下一帧开始时
requestAnimationFrame(logBoxHeight);
function logBoxHeight() {
  // 样式更改
  box.classList.add('super-big');
  // 读取盒子的高，为了反馈样式更改后的值，提前进行布局。
  console.log(box.offsetHeight);
}
```

### 布局抖动
大量的强制同步布局
```js
function resizeAllParagraphsToMatchBlockWidth() {
  // 浏览器反复进行读写操作
  for (var i = 0; i < paragraphs.length; i++) {
    paragraphs[i].style.width = box.offsetWidth + 'px';
  }
}
```
在每次迭代操作中，都会读取 box.offsetWidth 来更新 paragraphs[i].style.width，那么在下次迭代时，浏览器必须应用 paragraphs[i] 的样式更改，提前执行布局。  
所以根据优化规则，先读后写：
```js
// 先读
var width = box.offsetWidth;
function resizeAllParagraphsToMatchBlockWidth() {
  for (var i = 0; i < paragraphs.length; i++) {
    // 后写
    paragraphs[i].style.width = width + 'px';
  }
}
```


