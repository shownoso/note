# 分层

will-change
渲染引擎会将该元素*单独实现一层*，等这些变换发生时，渲染引擎会通过合成线程直接去处理变换，这些变换并没有涉及到主线程，这样就大大提升了渲染的效率。

占用内存也会增加