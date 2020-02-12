var bytes = new Buffer(256);

for(var i = 0; i< bytes.length; i++) {
  bytes[i] = i;
}

var end = bytes.slice(240, 256);

console.log(end[0]) // 240

end[0] = 0;

console.log(bytes[240]) // 0 缓冲区也被修改了

var more = new Buffer(8);

 // end中的第8-15个元素赋值到more中 起始位置是more[0]
end.copy(more, 0, 8,16); 

console.log(more[0]); // 248



var buf = new Buffer('2πr', 'utf-8');

console.log(buf.length) // 4   3个字符占4个字节

console.log(buf.toString()) // '2πr'

buf = new Buffer(10);
var len = buf.write('πr2', 4);
console.log(len);
console.log(buf.toString('utf-8', 4, 4 + len)); // 'πr2'