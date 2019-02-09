function route(pathname, req) {
    console.log("About to route a request for " + pathname);
    if (pathname === '/shown') {
        return `has found ${pathname}!`;
    }
    return 'can not find this route!';
}

module.exports = route;