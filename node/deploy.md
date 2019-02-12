## node项目手动部署


## 主要步骤

1. 连接服务器,部署node环境,并安装pm2
2. 往服务器丢入node项目代码包,并在项目内安装依赖
3. (在项目根目录)创建并配置pm2.json,并使用pm2启动

### 一、node环境

略过 O(∩_∩)O~

### 二、丢代码

```bash
  #登陆服务器 root:服务器名 ip:服务器ip地址
  ssh root@ip
  #将build.zip丢到该服务器的root路径下
  scp build.zip root@ip:/root/
  #解压
  unzip build.zip
  #进入项目后安装依赖
  cd build
  npm install --production
```

### 三、配置pm2.json
下面是一个简单的配置。了解更多[PM2](https://github.com/Unitech/pm2)。
注意点： name和script一定要和node项目一致
```json
{
  "apps": [
    {
      "name": "myapp",
      "script": "app.js",
      "log_date_format": "YYYY-MM-DD HH:mm:SS",
      "out_file": "logs/node-app.stdout.log",
      "instances": "max",
      "watch": true,
      "exec_mode": "cluster"
    }
  ]
}
```

### 四、预备工作
看看有哪些node服务跑着,瞅瞅端口占用啥的。
```bash
    #node  进程列表 pid
    ps aux | grep node
    #查询端口占用(例如8081)
    lsof -i tcp:8081
    #干掉某进程
    kill -9 pid
```

### 五、 启动

```bash
  pm2 start pm2.json
```


### 使用shell.js

```bash
  npm install shell.js --save
```
创建depoly.js 
```js
  var shell = require('shelljs');
  shell.exec('npm install --production');
  shell.exec('pm2 start pm2.json');  
```
```bash
  node deploy.js
```

## 附录

参考：https://www.jianshu.com/p/70ced477e5bd

### pm2的优势 
pm2 是一个带有负载均衡功能的Node应用的进程管理器.
1. 内建负载均衡（使用Node cluster 集群模块）
2. 后台运行
3. 0秒停机重载
4. 具有Ubuntu和CentOS 的启动脚本
5. 停止不稳定的进程（避免无限循环）
6. 控制台检测
7. 提供 HTTP API
8. 远程控制和实时的接口API ( Nodejs 模块,允许和PM2进程管理器交互 )

### pm2基础命令

```bash
    #启动
    pm2 start pm2.json
    #关闭
    pm2 stop all
    #重启
    pm2 reload all
    #服务列表
    pm2 list
    #日志
    pm2 logs
    #监控
    pm2 monit
```



