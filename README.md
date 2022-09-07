## How to use

### 1. Install unleash-client and unleash-proxy-client

```
npm install unleash-client unleash-proxy-client
```

### 2. Enable for Server Side

Add a custom server (server.js) for Next.js. https://nextjs.org/docs/advanced-features/custom-server

```
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

// you should connect the unleash web api on server side.
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
      // ...custom route
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

```

### 2. Enable for Client Side

Copy the middleware/unleash floder to you project.
Add a custom "App" (pages/\_app.tsx) for Next.js. https://nextjs.org/docs/advanced-features/custom-app

```
// you should connect the unleash proxy on client side.
const unleashConfig = {
  url: "https://{PROXY_DOMAIN:4241}/proxy",
  appName: "default",
  environment: "development",
  refreshInterval: 15,
  clientKey: "UNLEASH_PROXY_CLIENT_KEYS",
};
let unleashClient: UnleashClient | undefined = undefined;
if (typeof window !== "undefined" && unleashClient === undefined) {
  unleashClient = new UnleashClient(unleashConfig);
}

const MyApp = ({ Component, pageProps }: AppProps) => {
  if (typeof window !== "undefined" && unleashClient) {
    return (
      <FlagProvider unleashClient={unleashClient}>
        <Component {...pageProps} />
      </FlagProvider>
    );
  } else {
    return <Component {...pageProps} />;
  }
};

export default MyApp;
```
