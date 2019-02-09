//路由

const http = require("http");
const url = require("url");
const router = require('./router_1');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    const pathname = url.parse(req.url).pathname;
    const datas = router(pathname, req);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`res: ${datas}`);

});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});


