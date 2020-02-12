function copyFile(f1, f2, done) {
  var input = fs.createReadStream(f1);
  var output = fs.createWriteStream(f2);

  input.on('data', function (d) {
    output.write(d);
  })

  input.on('error', function (e) {
    throw e;
  })

  input.on('end', function() {
    output.end();
    done && done();
  })
}

