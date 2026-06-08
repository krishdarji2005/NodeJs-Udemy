// # HTTP Server Task
// ### Description
// Build a simple HTTP Server with following
// features.

// 1. GET: '/`: Send simple hello from
// server message.
// 2. GET: /contact-us': Send your email
// and contact number to the user.
// 3. POST: /tweet': Do a fake DB operation
// and send the ack that it is done.
// 4. GET: '/tweet': Send all the tweets
// from fake DB to the user.

// Also, you need to log the incomming
// requests with timestamps in file named
// log. txt'.

const http = require("node:http");
const fs = require("node:fs");
const { error } = require("node:console");

let tweets = [];
const server = http.createServer(function (req, res) {
  const method = req.method;
  const url = req.url;
  const log = `\n${Date.now()} : ${method} :${url}`;

  fs.appendFile("log.txt", log, "utf-8", (error) => {
    if (error) console.log(error);
  });

  switch (method) {
    case "GET":
      switch (url) {
        case "/":
          return res.writeHead(200).end("Hello from '/' root ");
        case "/contact-us":
          return res
            .writeHead(200)
            .end(
              "you can contact me at krishdarji@gmail.com or call me on +91 9619733283"
            );
        case "/tweet":
          return res.writeHead(200).end(`All Tweets :  ${tweets}`);
      }
      break;

    case "POST":
      switch (url) {
        case "/tweet":
          let tweet = req.body;
          tweets = [...tweets, tweet];
          return res.writeHead(200).end("Posted ");
      }
      break;
    }
    return res.writeHead(404).end("You are lost ");
});

server.listen(8000, function () {
  console.log("Listening on port 8000");
});
