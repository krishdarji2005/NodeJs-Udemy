const http = require("http");

const server = http.createServer(function (req, res) {
  console.log("I got incoming request at ", Date.now());
  
  console.log(req.headers);
  console.log(req.method);
  console.log(req.url);

  switch (req.url) {
    case "/":
      res.writeHead(200);
      return res.end(`Homepage`);

    case "/contact":
      res.writeHead(200);
      return res.end(
        `This is contact page | contact: +91 9999999999 ytkrishdarji@gmail.com`
      );

    case "/about":
      res.writeHead(200);
      return res.end(`I am krish Darji`);

    default:
      res.writeHead(404);
      return res.end("You're lost");
  }

 
});

server.listen(8000, function () {
  console.log("server serving on port 8000");
});

//from frontend  fetch('/',{method:'POST'}) sends different requ
