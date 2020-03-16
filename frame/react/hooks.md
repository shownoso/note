## 版本

首先，在使用新api之前明确下对应的版本，

### react：

16.8.6 (当前最新版本) Context、useReducer bug修复
16.8.0 Hooks api正式版本
16.6.0 新增React.memo React.lazy
16.0.0 独立React.PropTypes，启用Fiber算法

### vue：

3.0 (未发布)支持hooks，ES2015的Proxy来代替Object.defineProperty
2.6.10 (当前最新版本)
2.3.0 支持ssr
2.1.0 Scoped Slots
2.0 引入 vdom

## What is a Hook?

React-Hooks是Function Component，内部维护一些组件状态。**每次刷新都会将函数执行一次，每次 Render 都有自己的 Props 与 State，可以认为每次 Render 的内容都会形成一个快照并保留下来，这包括 state props useEffect 以及写在 Function Component 中的所有函数。** 因此当状态变更而 Rerender 时，就形成了 N 个 Render 状态，而每个 Render 状态都拥有自己固定不变的 Props 与 State。其实不仅是变量和对象对象，函数在每次渲染时也是独立的。
Hook和之前的Class Component完全不同，接下来会使用hooks实现生命周期的功能，那只是为了便于理解。想要完全理解Hooks，那就忘掉生命周期，用Function Component 的思维方式。

## React提供的hooks

### useState(Any)

等价于 state、setState
与setState不同点: setState的数据将和上一份state进行merge，而hooks的方法是替换

- 基本使用

```
const [count, setCount] = useState(0);
<button onClick={() => setCount(count+1)}>自增</button>
```

- 定时器内调用

```
const Page = (props) => {
  const [count, setCount] = useState(0);
  setInterval(() => {
    setCount(count + 1); // 会出现问题，每次刷新都会多一个定时器
  }, 1000);

  return (
    <div>
      <h1>count: {count}</h1>
    </div>
  )
};
```

### useEffect(Function, Array)

等价于componentDidMount + componentDidUpdate + componentWillUnmount + componentShouldUpdate
用于对组件执行一些副作用的功能。
重点：

1. 在组件刷新之后，浏览器完成布局与绘制之后执行
2. 第一个参数是一个函数（初始函数），即每次刷新之后执行。该函数可以返回另一个清理用的函数（清理函数），将在下一次执行初始函数之前被调用
3. 第二个参数为数组，即初始函数执行的依赖项。如果数组内定义的变量变更了，下一次初始函数才会被调用
4. 如果第二个参数传入空数组[]，初始函数只会在组件首次渲染完成之后调用，清理函数只会在组件卸载前调用。
5. 基本使用

```
  useEffect(() => {
    console.log('set count 1:', count);
  });
```

- 使用clean up 函数

```
useEffect(() => {
  console.log('set count 2:', count);
  document.title = `Count: ${count}`;
  return () => {
    console.log('set count clean up', count);
  }
})
```

- 依赖变量

```
const [name, setName] = useState('default name');

useEffect(() => {
  console.log('new name:', name);
  return () => {
    console.log('set name clean up', name);
  }
}, [name]);
```

- 只在创建后执行一次

```
useEffect(() => {
  console.log('did mount');

  return () => {
    console.log('will unmount');
  }
}, []);
```

- 依赖的变量，每次都进行地址比对

```
// 当name值变成才调用
useEffect(() => {
  console.log('data:', data); // 只会在初始时执行一次
}, [data]);
const onSetValue = () => {
  data.name = getRandomStr();
  setData(data);
}
```

- 每次刷新维护一份状态

```
const [count, setCount] = useState(0);
useEffect(() => {
  setInterval(() => {
    setCount(count + 1); // 只会从0变成1，因为count的值永远是初始化时候的值=0，可以使用setCount(count => count + 1);实现
  }, 1000);
}, []);
```

### useLayoutEffect

useEffect相似，但是在浏览器执行绘制之前，useLayoutEffect 内部的更新计划将被同步刷新。可以使用它来读取 DOM 布局并**同步触发**重渲染。
官方推荐使用useEffect，只有当它出问题的时候再尝试使用 useLayoutEffect

```
const [count, setCount] = useState(0);
useLayoutEffect(() => {
 alert('useLayoutEffect'); // 会在页面刷新前alert，且打断页面的刷新
});
return (
  <div>
    <h1>count: {count}</h1>
    <button onClick={() => setCount(count + 1)}>自增</button>
  </div>
)
```

### useContext

等价于 class 组件中的 static contextType = MyContext 或者 <MyContext.Consumer>
接收一个 context 对象（React.createContext 的返回值）并返回该 context 的当前值
当组件上层最近的 <MyContext.Provider> 更新时，该 Hook 会触发重渲染，并使用最新传递给 MyContext provider 的 context value 值。

```
import React, { useState, useContext } from 'react';
const Context = React.createContext();

const Child = () => {
  const ctx = useContext(Context);
  return (
    <div>
      <h1>count: {ctx.count}</h1>
      <button onClick={() => ctx.onClick()}>Child Add</button>
    </div>
  )
}
const Page = (props) => {
  const [count, setCount] = useState(0);

  return (
    <Context.Provider value={{ count, onClick: () => setCount(count + 10) }}>
      <Child />
      <button onClick={() => setCount(count + 1)}>Page add</button>
    </Context.Provider>
  )
};
```

### useReducer

hooks 提供的一个类似于 redux 的 api，让我们可以通过 action 的方式来管理 context，或者 state

```
import React, { useReducer } from 'react';

const initialState = { count: 0 };

function init(count) {
  return { count: count };
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}
function Page({ initialCount = 10 }) {
  // 第一种方式，传入reducer和初始状态
  const [state, dispatch] = useReducer(reducer, initialState);
  // 第二种方式，传入reducer、初始函数参数，初始函数。可以实现动态的从props获取参数
  const [state, dispatch] = useReducer(reducer, count, init);
  return (
    <>
      Count: {state.count}
      <br />
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </>
  );
}
```

### useCallback：

useCallback接受函数和一个数组输入，并返回的一个缓存版本的回调函数，仅当重新渲染时数组中的值发生改变时，才会返回新的函数实例

首先思考以下代码

```
class Example extends React.PureComponent{
    render(){
        // ......
    }
}

class App extends Component{
    render(){
        return <Example onChange={() => this.setState()}/>
    }
}
// 以上代码没有实现期望中的性能优化，可以改成下列形式
class App extends Component{
    constructor(props){
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    render(){
        return <Example onChange={this.onChange}/>
    }

    onChange(){
        // ...
    }
}
```

- 性能优化实现

```
let lastChange = null;

const Page = (props) => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  const onChangeCount = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  console.log('is equal', lastChange === onChangeCount); // 当只有count变更时，才会打印false
  lastChange = onChangeCount;

  return (
    <div>
      <h1>name: {name} count: {count}</h1>
      <button onClick={onChangeCount}>自增</button>
      <button onClick={() => setName(getRandomStr())}>自增</button>
    </div>
  )
};
```

### useMemo

类似Vue的computed，在某个依赖项改变时才重新计算 memoized 值。
如果没有提供依赖项数组，useMemo 在每次渲染时都会计算新的值。

```
const otherName =  useMemo(() => changeName(name), [name])
useCallback(fn, deps) 等价于 useMemo(() => fn, deps)。
```

### useRef：

用于访问元素的实例，传入的参数为将作为.current属性的初始值

```
const inputEl = useRef(null);
const onButtonClick = () => {
  inputEl.current.focus();
};

const onReset = () => {
  inputEl.current.value = '';
}
return (
  <div>
    <input ref={inputEl} />
    <button onClick={onButtonClick}>on Focus</button>
    <button onClick={onReset}>Reset</button>
  </div>
)
```

### useDebugValue

useDebugValue 可用于在 React 开发者工具中显示自定义 hook 的标签。

### useImperativeHandle

让你在使用 ref 时自定义暴露给父组件的实例值。在大多数情况下，应当避免使用 ref 这样的命令式代码。useImperativeHandle 应当与 forwardRef 一起使用

```
const Child = (props, ref) => {
  const [name, setName] = useState('default');
  useImperativeHandle(ref, () => ({
    // 暴露给父组件调用的方法
    changeName(newName) {
      setName(newName)
    }
  }));
  return <h1>child name: {name}</h1>
}

const ChildRef = forwardRef(Child)

const Page = (props) => {
  const childRef = useRef();

  function setName() {
    childRef.current.changeName(getRandomStr())
  };

  return (
    <div>
      <ChildRef ref={childRef}></ChildRef>
      <button onClick={setName}>设置子组件名称</button>
    </div>
  )
};
export default Page;
```

## 第三方hooks：

### Mobx-react-lite

mobX hooks实现

```
import React from 'react';
import { observer, useObservable } from "mobx-react-lite";

const Page = observer((props) => {
  const nameRef = React.useRef();
  const person = useObservable({
    name: "John",
    age: 1,
  });

  const events = useObservable({
    onChangAge() {
      person.age += 1;
    },
    onChangeName(e) {
      person.name = nameRef.current.value;
    },
    onNameChange(e) {
      console.log(e.target.value);
    },
    onReset() {
      person.name = 'John';
      person.age = 1;
      nameRef.current.value = '';
    }
  });

  return (
    <div>
      <h1>name: {person.name}, age: {person.age}</h1>
      <br />
      <button onClick={events.onChangAge}>add age</button>
      <br />
      <input ref={nameRef} onChange={events.onNameChange} />
      <button onClick={events.onChangeName}>change name</button>
      <br />
      <button onClick={events.onReset}>重置</button>
    </div>
  )
});
```

### [其他的hooks实现](https://mp.weixin.qq.com/s?__biz=MjM5MTA1MjAxMQ==&mid=2651232617&idx=1&sn=dc230ec49783a93282157303740ddb75&chksm=bd4940ed8a3ec9fbd1e437c141fd66b139e859cf21f73169be6a34e467a7804ce32e1c5aa6ce&mpshare=1&scene=1&srcid=#rd)

## 为什么用hooks

1. 把分散在各个生命周期内的相关联业务集中到一起
2. 公共业务逻辑原先通过render props或者高阶函数实现，现在直接编写hooks即可
3. 不需要去理解 class及this，这些对于ui是非必要的
4. 更加简洁明了的代码

## Rules of Hooks

1. 只在最顶层使用 Hook
2. 只在 React 函数中调用 Hook
   - 在 React 的函数组件中调用 Hook
   - 在自定义 Hook 中调用其他 Hook
3. 自定义hook以use开头
4. 不可使用hook存储数据

## Hook简单实现

```
import React from 'react';

let state = []; // 维护两个列表，用于存储值，及set方法
let setters = [];
let cursor = 0; // 每个值的索引

function createSetter(cursor) {
  return function setterWithCursor(newVal) {
    state[cursor] = newVal;
  };
}


function useState(initVal) {
  state[cursor] = state[cursor] || initVal;
  setters[cursor] = setters[cursor] || createSetter(cursor);

  cursor++;

  return [state[cursor - 1], setters[cursor - 1]];
}

export default function RenderFunctionComponent() {
  cursor = 0;
  const [firstName, setFirstName] = useState("F1"); // cursor: 0
  const [lastName, setLastName] = useState("L2"); // cursor: 1
  console.log('state', state, 'setters', setters);

  return (
    <div>
      <button onClick={() => {
        setFirstName("set new firstName");
        console.log('state', state, 'setters', setters);
      }}>firstName</button>
      <button onClick={() => {
        setLastName("set new lastName");
        console.log('state', state, 'setters', setters);
      }}>lastName</button>
    </div>
  );
}
```

## 相关链接

- useHooks~小窍门：https://zhuanlan.zhihu.com/p/66170210
- 深入浅出 React Hooks：https://juejin.im/post/5cf475d66fb9a07ea944594e
- 精读《useEffect 完全指南》https://zhuanlan.zhihu.com/p/60277120
- A Complete Guide to useEffect：https://overreacted.io/a-complete-guide-to-useeffect/
- eslint-plugin-react-hooks@next：https://github.com/facebook/react/issues/14920
- Vue 3.0 进展@尤雨溪：https://node.fequan.com/playvideo/701606bc91ece45fc7650b5ac92653ae_7