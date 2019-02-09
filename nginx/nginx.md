##  安装 (mac)

```bash
    brew install nginx
```

## 基本命令
```bash
    #启动
    nginx
    #重启
    nginx -s reload
    #关闭
    nginx -s stop

```

## 基本模块
```conf
...              #全局块

events {         #events块
   ...
}

http      #http块
{
    ...   #http全局块
    server        #server块
    { 
        ...       #server全局块
        location [PATTERN]   #location块
        {
            ...
        }
        location [PATTERN] 
        {
            ...
        }
    }
    server
    {
      ...
    }
    ...     #http全局块
}
```


