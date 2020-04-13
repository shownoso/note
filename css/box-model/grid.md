# Grid

## 容器属性
- grid-template-columns 行的划分
- grid-template-rows 列的划分

### 行列划分使用的属性
- 使用 repeat(n, rule) 设置重复
```css
/* 3份均分 */
grid-template-rows: repeat(3, 33.33%);
/* 6份 100px 20px 80px 100px 20px 80px */
grid-template-columns: repeat(2, 100px 20px 80px);
/* 自动填充，尽可能容纳 */
grid-template-columns: repeat(auto-fill, 100px);
```
- fr 片段，用于设置网格间的比例
```css
/* 1 : 2 */
grid-template-columns: 1fr 2fr;
/* 第一个150px 第二三个按照 1： 2 分剩余 */
grid-template-columns: 150px 1fr 2fr;
```
- minmax 设置占距范围
```css

grid-template-columns: 1fr 1fr minmax(100px, 1fr);
```

- auto 浏览器决定
```css
grid-template-columns: 100px auto 100px;
```

- 网格线名称
```css
grid-template-columns: [c1] 100px [c2] 100px [c3] auto [c4];
```
- 网格线名称可以有多个 [g1 g2]

### 间距
- row-gap
- column-gap
- gap: <row-gap> <column-gap>
```css
/* 行列单元格间距都是20px */
gap: 20px
```
### 区域
```css
/* . 表示该区域不需要使用  同名区域会合并 */
grid-template-areas: "header . header"
                     "main main sidebar"
                     "footer footer footer";
```
- 区域命名会影响网格线命名。命名规则为 区域名-start 区域名-end

### 排列顺序
grid-auto-flow
默认 row 先行后列  
column 先列后行
row dense 尽可能填满不出现空格 行的方向优先填充
column dense 尽可能填满不出现空格 列的方向优先填充

### 容器中单元格内容的位置
justify-items 水平
align-items 垂直
默认都是 stretch
```css
justify-items: start | end | center | stretch;
align-items: start | end | center | stretch;

place-items: <align-items> <justify-items>;
/* 所有单元格水平垂直居中 */
place-items: center;
```

### 容器中内容区域的位置
```css

justify-content: start | end | center | stretch | space-around | space-between | space-evenly;
align-content: start | end | center | stretch | space-around | space-between | space-evenly;  

place-content: <align-content> <justify-content>

place-content: space-around;
```

### 自动创建行列

grid-auto-columns
grid-auto-rows


### 简写
```css
grid-template: grid-template-columns grid-template-rows grid-template-areas
/* 模板行列区域、自动行列排列顺序 */
grid: grid-template-rows grid-template-columns grid-template-areas grid-auto-rows grid-auto-columns grid-auto-flow
```



## 项目属性
- grid-column-start属性：左边框所在的垂直网格线
- grid-column-end属性：右边框所在的垂直网格线
- grid-row-start属性：上边框所在的水平网格线
- grid-row-end属性：下边框所在的水平网格线


```css
/* 该项目左边框距离有边框2个网格 */
grid-column-start: span 2;

grid-column: grid-column-start / grid-column-end
grid-row: grid-row-start / grid-row-end
```
- 重叠 使用 z-index

```css
grid-column: 1 / 3;
grid-row: 1 / 3;
/* 等价 */

grid-column: 1 / span 2;
grid-row: 1 / span 2;

```

- grid-area 指定占据的具体位置
```css
/* 占据 e 区域 */
grid-area: e;
grid-area: <row-start> / <column-start> / <row-end> / <column-end>;
```

### 单元格的内容属性
```css
justify-self: start | end | center | stretch;
align-self: start | end | center | stretch;
place-self: <align-self> <justify-self>;
```