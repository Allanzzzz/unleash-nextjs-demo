import "../styles/globals.css";
import type { AppProps } from "next/app";
import FlagProvider, { UnleashClient } from "../middleware/unleash";

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
