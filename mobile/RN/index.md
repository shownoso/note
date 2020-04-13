# RN


bridge实现更复杂
性能优于 cordova
## 生态 react-native~

navigator-router
elements
vector-icons
router-flux
animatable
ignite


wechat
sound
gifted-messenger
image-picker
yunpeng-alipay

## 性能优化

1. 首页白屏？异步逐层渲染  
  - scrollView ListView 使用 rAF 或 定时器将组件一个个 push进 scrollView
  - react-progressive

2. shouldComponentUpdate

3. 直接修改 state，会立即触发渲染， 使用 rAF
  - setNativeProps： 相当于直接修改 dom （不推荐，但是事实上蛮有用的）

4. 首屏最小化结构。 区分动态和静态组件

5. 最小化 ListView 同1 
  - react-native-sglistView
  - CRNlistView
  - react-native-gifted-listview

## 优势
- 开发/测试成本低，体验好（代码修改即可生效 无需编译）
- 一套代码跨平台
- 开发效率高，体验接近原生
- 版本发布灵活 增量升级流量少

## 不足
- 样式书写麻烦
- 动效可能掉帧


## 增量方案

1. 计算增量包 = 新版本 - 旧版本 （可能跨多个版本，就有多个增量包）
2. app 比对版本 下载（当前所需所有）增量包
3. 旧版本 + 增量包 = 新版本


## 上线
bsdiff 生成差异 
bspatch 合并差异

## 版本并存

react-native-code-push  
moles-packer
