import { useContext, useEffect, useState, useRef } from "react";
import FlagContext from "./FlagContext";

const useFlag = (name: string) => {
  if (typeof window !== "undefined") {
    const { isEnabled, client } = useContext(FlagContext);
    const [flag, setFlag] = useState(false);
    const flagRef = useRef<typeof flag>();
    flagRef.current = flag;

    useEffect(() => {
      if (!client) return;
      client.on("update", () => {
        const enabled = isEnabled(name);
        if (enabled !== flagRef.current) {
          flagRef.current = enabled;
          setFlag(!!enabled);
        }
      });

      client.on("ready", () => {
        const enabled = isEnabled(name);
        setFlag(enabled);
      });
    }, [client]);

    return flag;
  } else {
    return false;
  }
};

export default useFlag;
