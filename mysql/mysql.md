## 安装

[mysql-yum](https://dev.mysql.com/downloads/repo/yum/)
```bash
# 下载合适的mysql仓库
wget https://dev.mysql.com/get/mysql80-community-release-el7-3.noarch.rpm
yum -y install mysql80-community-release-el7-3.noarch.rpm
# 安装
yum -y install mysql-community-server
```
- 关于mysql卸载与升级
```bash
# 查看当前状态
service mysqld status
systemctl status mysqld.service
# 停止服务
systemctl stop mysqld.service
# 查看yum仓库状态
yum repolist all | grep mysql
yum repolist enabled | grep mysql
# 找到已安装的mysql
yum list installed | grep mysql
# 卸载已安装的mysql
yum remove mysql-community-client mysql-community-common mysql- community-server mysql-community-libs mysql-community-libs-compat mysql-community-release
# 找到残留并删除 两个特殊的，按需删除：/etc/my.cnf /var/log/mysqld.log
whereis mysql
find / -name mysql
rm -rf <残留文件>

# 升级
# rpm -Uvh mysql80-community-release-el7-3.noarch.rpm
# 安装
yum -y install mysql-community-server
```


## 常用指令

启动
service mysqld start

初次启动查看日志获取密码
```bash
cat /var/log/mysqld.log
# A temporary password is generated for root@localhost: 
```
刷新权限
flush privileges

重置密码
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new password'

远程数据库登录

服务器配置3306端口允许访问
指定数据库 use <数据库名>
配置远程登录用户 % 代表所有ip
create user 'root'@'%' identified with mysql_native_password by 'a password'
赋予权限 *.* 全部
grant all privileges on *.* to 'root'@'%'

```bash
ssh root@ip
mysql -uroot -p 
 
```

检查防火墙
```bash
#cent OS
systemctl status firewalld
#关闭防火墙
systemctl stop firewalld
```

use 选择使用的数据库名


