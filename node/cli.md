### tool

commander  定义命令

inquirer 用户交互

### bin
"bin": {

}
### link
npm link

注意 需要指定运行环境
脚本入口头一行  #!/usr/bin/env node

### index.js
```js
    const cmd = require('commander');
    const inquirer = require('inquirer');
    // 定义版本
    cmd.version('1.0.0', '-v --version');
    cmd.command('init <name>').action(name => {
        inquirer.prompt([
            {
                type: 'input',
                name: 'projectname',
                message: '项目名？',
            }
        ]).then(answer => {
            down(answer.projectname);
            
        })
    });
    cmd.parse(process.argv);
```

### bin/down.js
```js
const fs = require('fs');

module.exports = function(name) {
    const tpl = './project';
    const target = './' + name;
    let arr = [];
    fs.mkdir(target, function() {

        push(tpl);
        arr.forEach(function(item, index) {
            (function(item) {
                if (item[0] === 'file') {
                    fs.readFile(item[1], function(err, data) {
                        const tarFile = (target + '/' + item[1]).replace(tpl, '.');
                        fs.writeFile( tarFile, data, function() {

                        });
                    })
                } else {
                    fs.mkdir(tarFile);
                }
            })(item)
        });

        function push(path) {
            const files = fs.readdirSync(path);
            files.forEach(function(item, index) {
                const curPath = path + '/' + item;
                const stat = fs.statSync(curPath);
                if(stat.isDirectory()) {
                        arr.push(['dir', curPath]);
                        push(curPath);
                    } else {
                        arr.push(['file', curPath]);
                    }
                }); 
        }
    });
}
```