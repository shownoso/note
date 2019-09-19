
### 远程
```bash
# 克隆
git clone
# 远程关联
git remote add origin git@server-name:path/repo-name.git
# 远程库信息
git remote
git remote -v 
# 远程推送
# 初次，指定origin为默认主机
git push -u origin master
# 将当前分支推送到origin主机的对应分支
git push origin <branch>

# 创建远程origin的dev分支到本地
git checkout -b dev origin/dev

# 本地分支与远程分支的链接关系没有创建时 创建链接
git branch --set-upstream-to <branch-name> origin/<branch-name>

# 拉取
git pull


```

### ssh

1. 生成密钥对 不要设置密码
```bash
ssh-keygen -t rsa -C "email@example.com"
```
2. 在 ~/.ssh 中生成了私钥和公钥

3. 将公钥.pub内容配置到github 

4. 需要注意git clone 时的协议方式 
```bash
# 以当前仓库克隆方式为https为例
# 移除关联
git remote remove origin
# 重置为ssh方式
git remote add origin git@github.com:用户名/仓库名.git
```
