##  安装 (mac)

```bash
    brew install nginx
```

#### 源码安装
进入源码目录 nginx-version.tar.gz
确认 gcc 已安装
```bash
    ./configure #Makefile
    make & make install #编译并安装
```


## 基本命令
```bash
    #启动
    nginx
    #重启
    nginx -s reload
    #关闭
    nginx -s stop
    nginx -s quit

    killall nginx

    # or
    systemctl start nginx.service

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
## 虚拟主机

### 基于端口号/ip/域名  ==> server_name
```bash
    server{
        listen 8080;
        server_name localhost;
        root /usr/share/nginx/html/p8080;
        index index.html;
    }
```

### 基于域名 
需要配置域名解析

## 访问权限控制

### 指令优先级
就是在同一个块下的两个权限指令，先出现的设置会覆盖后出现的设置（也就是谁先触发，谁起作用）
```conf
    # 如下配置为 仅允许该ip通过
    location / {
        allow  45.76.202.222;
        deny   all;
    }
```
### 精确匹配
通过=进行精确匹配 多一层安全屏障
```conf
    location =/static{
        allow all;
    }
    location =/private{
        deny all;
    }
```

### 正则匹配
```conf
    location ~\.html$ {
        allow all;
    }
```

### 反向代理 

```conf
    server{
        listen 80;
        server_name blog.shownoso.work;
        location / {
               proxy_pass http://shownoso.work;
        }
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


## 对前端性能的优化

```bash
# 尝试时 务必不要选择 disable cache while DevTools is open (chrome)
http {
   .....
    etag: on; # 开启etag => If-None-Match
    gzip on; #开启压缩
    gzip_types text/plain application/javascript text/css;

    add-header Cache-Control no-cache; # 协商缓存
   .....
}
```

## 根据客户端判定

```bash
    server{
        listen 80;
        server_name blog.shownoso.work;
        location / {
         root /usr/share/nginx/pc;
         if ($http_user_agent ~* '(Android|webOS|iPhone|iPod|BlackBerry)') {
            root /usr/share/nginx/mobile;
         }
         index index.html;
        }
    }
```
