## 登陆远程服务器
```bash
ssh username@ip
#退出
exit 

```
## 用户

根目录
root  /root
other user /home/username

### 切换用户
su username

尽可能不要使用root用户操作远程服务器或者生产环境，因为权限太大了。 可以使用普通用户sudo来暂时获取根用户权限

## 行编辑器vi/vim
vi filename

### insert 插入模式

### 强制命令符
!
```bash
#强制退出
:q!
```
### 保存
:w
### 退出
:q

## 服务管理命令 systemctl
```bash
# 以nginx为例 
#查看状态
systemctl status nginx
#开启
systemctl start nginx
#关闭
systemctl stop nginx
```

## 网络管理命令
```bash
#interface config  网络接口管理
ifconfig
# eth 物理网卡

# 关闭网卡 eth0
ifdown eth0
# 激活网卡 eth0
ifup eth0

######

# ip 网络命令工具箱 mac下没有哎，ip命令属于外置命令，可以选择安装
ip
#比如 
ip addr
######

# route 查看路由相关信息
default： 默认网络配置

```

## 命令行下载命令
```bash
# 资源地址url
wget url
# 支持断点续传
wget -c url

# curl 功能比wget强一些

```

## linux帮助 
```bash
# 获取wget的帮助
wget -h
# 获取wget帮助文档 按q推出
man wget
```

## 终端快捷键 
```bash
# 结束正在运行的程序
ctrl + c
# 结束输入或退出
ctrl + d
# 暂停屏幕输出
ctrl + s
# 恢复屏幕输出
ctrl + q
#清屏
ctrl + l
clear
# 快速移动光标到行首/行尾
ctrl + a
ctrl + e

```


## linux网络管理 

```bash
# 
top

# 查看操作系统某一瞬间的状态
ps aux
# 1.user 启动该进程的用户
# 2.进程继承用户权限
# 3.pid 进程唯一编号 pid=1 是所有其它进程的父进程，父进程挂了所有子进程也全部挂掉
# 4.一般的 服务后带d的 是守护进程，属于服务
# 5. stat 当前瞬间该进程状态  S：休眠 Z：僵尸状态，父进程已经跪了，但是自身还未被回收 zombie


# 管道命令 | 将前面的结果传递给后面的命令
# 查询sshd进程 忽略信息中带有grep的
ps aux | grep sshd
# 如何区分主进程 pid较小的有可能是父进程


# kill pid 
# -9 强制关闭信号 
# pkill 进程名
kill -9 pid


# w 命令 查看谁在系统
w 

```


## 排查网络故障
```bash
# 路由追踪 展示经过的路由
traceroute 

#
ping
# 1. ttl 经过一个路由 该值减1

# 查看端口占用 示例 ;22
# a：所有  n：w网络  p：进程
ss -anp | grep :22

# *nix系统必带的
netstat -anp | grep :22

# mac下 
lsof -i tcp:8081

```







