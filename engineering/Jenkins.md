##

## 获取

### jdk

1. 官网 linux为例: .rpm
```bash
#推荐方式
rpm -ivh jdk.rpm
```

2. 也可以 openJDK
```bash
yum install jdk
```

### jenkins
1. tomcat服务
下载Generic Java package在tomcat中运行
2. linux(CentOS)
```shell
# 如果下载很慢，那就上梯子，或者：
# 1.可以改为http获取（推荐）
# 2.下载到本地 并指向本地目录

# 添加官方仓库 
sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
#导入公钥
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io.key
# 或 https://pkg.jenkins.io/redhat-stable/jenkins.io.key

# 检查本地路径下的jenkins仓库是否存在 是，则安装
cd /etc/yum.repos.d/
# 安装
sudo yum install jenkins
```

### 配置：

配置文件：/etc/sysconfig/jenkins

```bash
# find
/PORT
# next
n
# 退出查找
:noh


# 修改默认端口,8080太热门
JENKINS_PORT="8001"
# AJP启动，选填
JENKINS_AJP_PORT="8009" 
```

### 服务管理

```shell
# Linux
systemctl start jenkins
systemctl stop jenkins
systemctl status jenkins

# Mac
launchctl
```



## 第一次访问：

* 管你要密码怎么办？

可以cat`/var/lib/jenkins/secrets/initialAdminPassword`查看默认口令

* 等待初始化

* 安装建议插件，选择默认，(左侧的选项。上梯子)

* 创建管理员账号（**一定要记住你设置的管理员用户名和口令！！**）

* 登陆之后出现主界面意味着安装成功！

## 持续集成node

## 作为前端开发 需要补全一些必要的插件



安装插件：

[NodeJS Plugin](http://wiki.jenkins-ci.org/display/JENKINS/NodeJS+Plugin)

[Publish Over SSH](https://plugins.jenkins.io/publish-over-ssh)

GitHub Integration Plugin

注意点： advance标签底部 Update Site 根据实际访问情况设置协议头 http或https

配置远程

### 确认 服务器环境是不是完整的：

* git （centos mini安装需要手动 yum）yum install -y git
* svn (根据需要选择)
* node.js （必要的环境）  https://blog.csdn.net/and04292/article/details/79423037



## 使用jenkins之前要做的事情

1. 必须要有github、svn或私有git服务器
2. 完整的项目
   1. test 
   2. 接口测试
   3. 其它的测试内容
3. CI 可以装在本机，或专用的CI服务器
4. 项目代码要提交到 github、svn等服务器上
5. 保证代码在开发机上是正常的
   1. bug
   2. 运行环境（引用的包要写入package.json）
   3. 手动模拟jenkins的流程（测试、构建、发布），可以封装成脚本
6. 保证jenkins环境一切正常
7. 发布服务器上也要存在基础的运行环境（不包括项目本身引用的包）
8. 必要的静态资源服务器
9. 配置Jenkins的自动化处理流程



## Jenkins 系统配置

 主页--> 系统管理--> 系统设置

* **Publish over SSH**项目