const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const unleash = require("unleash-client");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const unleashInstance = unleash.initialize({
  url: "https://{WEB_DOMAIN:4242}/api",
  appName: "default",
  environment: "development",
  refreshInterval: 15,
  customHeaders: {
    Authorization: "UNLEASH_API_TOKEN",
  },
});

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true);
      req.context = {
        ...req.context,
        unleash: unleashInstance,
      };
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
