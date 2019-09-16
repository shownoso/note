
### 常用

```bash

# 日志
git log 
# 状态
git status
# 历史命令
git reflog
# 工作区和版本库里面最新版本的区别
git diff HEAD -- <filename>

# 添加到暂存区 
git add readme.txt
# 提交
git commit -m "一些注释"
# 撤销
git checkout -- <filename>
# 删除(从版本库中)
git rm <filename>
# 回滚
# 指定版本
git reset --hard <version>
# 指定 上一个  上n个  HEAD-<number>
git reset --hard HEAD^


```

