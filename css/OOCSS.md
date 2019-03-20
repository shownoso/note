# 面对对象的css
http://oocss.org/
download it and learn
## 注意点
1. 将共性声明放到父类，减少重复定义
```css
    .header {
        font-size: 14px;
        .nav {
            color: #222;
        }
        .info {
            color: #fff;
        }
    }
```
2. 将结构与皮肤分离
```html
    <div class="container skin"></div> 
```
```css
    .container {
        display: flex;
    }
    .skin {
        background: #eee;
    }
```
3. 将容器与内容分离
```html
    <div class="container">
        <ul class="list">
            <li></li>
        </ul>
    </div> 
```
```css
    .container {
        display: flex;
    }
    .list {
        color: #262626;
    }
```
4. 抽象可重用元素，组件化
5. 对需要拓展的对象本身增加class而不是其父节点
6. 对象应当保持独立性
```css
    .nav {

    }
    .menu {

    }
```
7. 尽可能避免使用id选择器，权重太高了，无法重用
8. 避免位置相关的样式
9. 保证选择器权重相同
10. 类名：简短、清晰、语义化