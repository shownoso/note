##

## 获取

### jdk

1. 官网 linux为例: .rpm
```bash
#推荐方式
rpm -ivh jdk.rpm
```

2. openJDK
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
# 安装
sudo yum install jenkins
```

### 配置：

配置文件：/etc/sysconfig/jenkins

```bash
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