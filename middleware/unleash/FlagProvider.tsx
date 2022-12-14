/** @format */

import * as React from "react";
import { IConfig, UnleashClient } from "unleash-proxy-client";
import FlagContext, { IFlagContextValue } from "./FlagContext";

interface IFlagProvider {
  unleashClient: UnleashClient;
  startClient?: boolean;
}

const FlagProvider: React.FC<React.PropsWithChildren<IFlagProvider>> = ({
  children,
  unleashClient,
  startClient = true,
}) => {
  const client = React.useRef<UnleashClient>(unleashClient);
  const [flagsReady, setFlagsReady] = React.useState(false);
  const [flagsError, setFlagsError] = React.useState(null);

  if (!unleashClient) {
    console.warn(
      `You must provide either a config or an unleash client to the flag provider. If you are initializing the client in useEffect, you can avoid this warning by
      checking if the client exists before rendering.`
    );
  }

  client.current.on("ready", () => {
    setFlagsReady(true);
  });

  client.current.on("error", (e: any) => {
    setFlagsError(e);
  });

  React.useEffect(() => {
    const shouldStartClient = startClient || !unleashClient;
    if (shouldStartClient) {
      client.current.start();
    }
  }, []);

  const updateContext: IFlagContextValue["updateContext"] = async (context) => {
    await client.current.updateContext(context);
  };

  const isEnabled: IFlagContextValue["isEnabled"] = (toggleName) => {
    return client.current.isEnabled(toggleName);
  };

  const getVariant: IFlagContextValue["getVariant"] = (toggleName) => {
    return client.current.getVariant(toggleName);
  };

  const on: IFlagContextValue["on"] = (event, callback, ctx) => {
    return client.current.on(event, callback, ctx);
  };

  const context = React.useMemo<IFlagContextValue>(
    () => ({
      on,
      updateContext,
      isEnabled,
      getVariant,
      client: client.current,
      flagsReady,
      flagsError,
      setFlagsReady,
      setFlagsError,
    }),
    [flagsReady, flagsError]
  );

  return (
    <FlagContext.Provider value={context}>{children}</FlagContext.Provider>
  );
};

export default FlagProvider;
