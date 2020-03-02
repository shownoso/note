# React 性能

## 长列表
虚拟滚动
https://react-window.now.sh/#/examples/list/fixed-size
https://bvaughn.github.io/react-virtualized/#/components/List
https://medium.com/@paularmstrong/twitter-lite-and-high-performance-react-progressive-web-apps-at-scale-d28a00e780a3

## 避免 Reconciliation （没必要的domdiff）
shouldComponentUpdate 控制
PureComponent 自动处理sCU，浅比较

对于引用数据类型，使用新的对象去处理，而不是修改原来对象本身。即 不可变
immutable-js
immerjs

在实现自己的组件时，保持稳定的DOM结构会有助于性能的提升。例如，我们有时可以通过CSS隐藏或显示某些节点，而不是真的移除或添加DOM节点。 domdiff 是按层分析的 Web UI中节点跨层级操作特别少，可以忽略不计但是尽量避免，

## 性能分析
React dev tool - Profiler
https://zh-hans.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html

### Profiler api
https://zh-hans.reactjs.org/docs/profiler.html
Profiling 增加了额外的开支，所以它在生产构建中会被禁用。

为了将 profiling 功能加入生产环境中，React 提供了使 profiling 可用的特殊的生产构建环境。 从 fb.me/react-profiling了解更多关于如何使用这个构建环境的信息。
