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

## 负载均衡

```conf
http      #http块
{
    upstream test 
    {
       #server 地址:端口号 weight表示权值，权值越大，被分配的几率越大;
　　　　server 192.168.0.223:8080 weight=2;            
    　 server 192.168.0.224:8080 weight=1;
    }
    server      #server块
    { 
        listen       8080;
        server_name  localhost;
        location / { 
            proxy_pass http://test/; 
        } 
    }
    
}
```

## Keepalived
