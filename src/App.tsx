import { useState } from "react";
import {
  useAccount,
  useCallsStatus,
  useConnect,
  useDisconnect,
  useSendCalls,
} from "wagmi";

function App() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { sendCallsAsync } = useSendCalls();
  const [id, setId] = useState<string>("");
  const result = useCallsStatus({
    id,
    query: {
      enabled: id !== "",
      refetchInterval: (data) => {
        if (data?.state.data?.statusCode === 200) {
          return false;
        }
        return 500;
      },
    },
  });

  return (
    <>
      <div>
        <h2>Account</h2>

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
        </div>

        {account.status === "connected" && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
      </div>

      <div>
        <h2>Send</h2>
        <button
          onClick={async () => {
            const { id: callsId } = await sendCallsAsync({
              calls: [
                {
                  to: "0x0000000000000000000000000000000000000000",
                  data: "0x",
                },
              ],
            });
            setId(callsId);
          }}
        >
          Send
        </button>
      </div>

      {id !== "" && (
        <div>
          <h2>Result</h2>
          <p>Calls ID: {id}</p>
          <div>Status: {result.data?.status}</div>
        </div>
      )}
    </>
  );
}

export default App;
