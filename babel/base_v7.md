## Babel7

- @babel/cli
- @babel/core
- @babel/plugin-transform-[plugin-name]

- @babel/[preset-type]
- @babel/polyfill

- @babel/runtime
- @babel/plugin-transform-runtime

### 命令行工具

#### @babel/core
核心库，transform的主体

#### @babel/cli
babel提供的内建命令行工具，适合安装在本地项目

### 插件 plugins
搭配使用插件，指定需要的转换。  
例如使用 @babel/plugin-transform-arrow-functions 进行剪头函数转换 

### 预设 presets
挑选插件真麻烦，使用预设的插件集合
- @babel/preset-env
- @babel/preset-flow
- @babel/preset-react
- @babel/preset-typescript

#### preset-env
- targets: 指定目标环境。使用 [browserslist](https://github.com/browserslist/browserslist) 来筛选浏环境。官方建议把targets写到 .browserslistrc 或者 package.json 里，这样其它工具也能更轻易的获取到目标浏览器
- useBuiltIns: 是否引入 polyfill, 默认值为 false
  - 'entry': 入口引入一次，需要手动i mport '@babel/polyfill'
  - 'usage': 按需引入

```js
  "modules": true,  // 是否转译module syntax，默认是 commonjs
  "debug": true, // 是否输出启用的plugins列表
  "spec": false, // 是否允许more spec compliant，但可能转译出的代码更慢
  "loose": false, // 是否允许生成更简单es5的代码，但可能不那么完全符合ES6语义
  "useBuiltIns": false, // 怎么运用 polyfill
  "include": [], // 总是启用的 plugins
  "exclude": [],  // 强制不启用的 plugins
  "forceAllTransforms": false, // 强制使用所有的plugins，用于只能支持ES5的uglify可以正确压缩代码
```


#### polyfill
@babel/polyfill 模块包括 core-js 和一个自定义的 regenerator runtime 模块用于模拟**完整的** ES2015+ 环境。 
```bash
# 注意：polyfill必须作为依赖项`
npm install --save @babel/polyfill
```
v7.4.0之后，它将过时。详情：https://babeljs.io/docs/en/babel-polyfill#docsNav
```js
// 用户自己选择兼容库
import "core-js/stable";
import "regenerator-runtime/runtime";
```
所以preset-env + useBuiltIns: 'usage' + polyfill 依然优秀?

#### 对于库/工具的作者
如果你不需要类似 Array.prototype.includes 的实例方法，可以使用 @babel/plugin-transform-runtime 插件而不是对全局范围（global scope）造成污染的 @babel/polyfill。见下方。


###  @babel/runtime @babel/plugin-transform-runtime

```is a library that contain's Babel modular runtime helpers and a version of regenerator-runtime.```

helper： 编译后有许多如 _classCallCheck，_defineProperties，_createClass 等辅助函数。  

使用 @babel/plugin-transform-runtime，它将替换对 @babel/runtime 版本的功能的引用，以减少重复helper。自动引入。


#### @babel/polyfill 与 @babel/runtime  
两者都基于core-js提供的一组polyfill和一个generator runtime 来实现模拟 ES2015+ 环境。  
1. @babel/polyfill 通过向全局对象和内置对象的prototype实现
2. @babel/runtime ```is just the package that contains the implementations of the functions in a modular way.```
只是一个包含了功能实现的模块，所以不可能修改实例方法。







    