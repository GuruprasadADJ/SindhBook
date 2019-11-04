var qs = require("querystring");
var http = require("http");
                                
var options = {
  "method": "GET",
  "hostname": "2factor.in",
  "port": null,
  "path": "/API/V1/76263c6b-fc6d-11e9-9fa5-0200cd936042/SMS/9112133465/6768",
  "headers": {
    "content-type": "application/x-www-form-urlencoded"
  }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.write(qs.stringify({}));
req.end();