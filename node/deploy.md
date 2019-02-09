## node项目部署
可参考：https://www.jianshu.com/p/70ced477e5bd
## pm2 
pm2.json:
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
### 基础命令

```bash
    #启动
    pm2 start pm2.json
    #关闭
    pm2 stop all
    #服务列表
    pm2 list
    #日志
    pm2 logs
    #监控
    pm2 monit
```

## 部署相关

```bash
    #node  进程列表 pid
    ps aux | grep node
    #查询端口占用
    lsof -i tcp:8081
    #干掉某进程
    kill -9 pid

    #登陆服务器 root 服务器名 ip 所在ip地址
    ssh root@ip
    #将build.zip丢到该服务器的root路径下
    scp build.zip root@192.168.0.1:/root/
    #解压
    unzip build.zip
    #进入项目后安装依赖 （安装）并启动pm2
    cd build
    npm install --production
    pm2 pm2.json

```

#### 使用shell.js

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




<!-- 见[继承](../javascript/继承.md) -->


