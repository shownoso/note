# jscore
js的解析引擎

## android
androidJSCore
```java
// intent-filter 设置启动入口

JSContext context = new JSContext();
JSValue jsValue = context.evaluateScript("'hello world'"); // 可以传入 Java代码，使用js执行java

System.out.println(jsValue)

```
## ios
内置了一个js解释器
JavaScriptCore

```swift
// swift let 是常量 var 是变量
let context = JSContext();
context?.evaluateScript("let name = 'shown';");
let value = context?.evaluateScript("name")  

if let v = value?.toString() {
  print(v)
}


```



