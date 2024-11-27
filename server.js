const https = require("https");
const fs = require("fs");
const next = require("next");

const app = next({ dev: true });
const handle = app.getRequestHandler();

const port = 3000; // Default Next.js port

const httpsOptions = {
  key: fs.readFileSync("./192.168.1.52+3-key.pem"),
  cert: fs.readFileSync("./192.168.1.52+3.pem"),
};

app.prepare().then(() => {
  https
    .createServer(httpsOptions, (req, res) => {
      handle(req, res);
    })
    .listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on https://192.168.1.52:${port}`);
    });
});
