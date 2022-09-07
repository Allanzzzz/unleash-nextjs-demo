import { GetServerSideProps } from "next";
import { useEffect } from "react";
import { useFlag } from "../../middleware/unleash";
import useServerSideFlags from "../../middleware/unleash/unleash-server-side";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const testServer = useServerSideFlags(context, "testServer");
  return {
    props: {
      testServer: testServer,
    },
  };
};

const Test = (props: { testServer: boolean }) => {
  const testClient = useFlag("testClient");

  useEffect(() => {
    console.log(testClient);
  });

  return (
    <div>
      <div>
        {props.testServer ? "Test Server Enabled" : "Test Server Disabled"}
      </div>
      <div>{testClient ? "Test Client Enabled" : "Test Client Disabled"}</div>
    </div>
  );
};

export default Test;
