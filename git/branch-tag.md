### 分支管理

```bash
# 查看分支
git branch
# 创建分支 dev
git branch dev
# 切换到分支 dev
git checkout dev 
git switch dev
# 创建并切换
git checkout -b dev
git switch -c dev
# 合并分支
# 合并指定分支到当前分支 假设当前为master 则将dev分支合并到master
git merge dev
# 禁用Fast forward 产生一次提交 保留合并的历史
git merge --no-ff -m ‘一些注释’ dev

# 删除分支
git branch -d dev
# 强行删除
git branch -D dev

# 查看暂存内容
git stash list
# 暂存
git stash
# 将暂存恢复至工作区
git stash apply <stash-name>
# 删除暂存
git stash drop
# 恢复并删除
git stash pop

# 为当前分支进行一次！新的提交！ 内容为指定的commit
git cherry-pick <commit>


# rebase 待描述
git rebase
```

### 标签

```bash
# 查看标签
git tag 
git show <tag>
# 创建标签
git tag <tag> <commit-id>
git tag -a <tag> -m "一些注释" <commit-id>
# 删除
git tag -d <tag>
# 远程删除
git push origin :refs/tags/<tag>
# 推送
# 一次性全部
git push origin --tags
# 单个
git push origin <tag>


```