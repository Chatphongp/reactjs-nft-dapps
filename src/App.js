import "./App.css";
import { useEffect, useState } from "react";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import { Buffer } from "buffer";
import { WHITELISTED } from "./whitelist/whitelistAddress";

function App() {
  window.Buffer = Buffer;
  const [address, setAddress] = useState("");
  const [connected, setConnected] = useState(false);
  const [whitelistStatus, setWhitelistStatus] = useState(false);

  useEffect(() => {
    window.ethereum.on("accountsChanged", (accounts) => {
      console.log(accounts);
    });
  }, []);

  const getProof = (address) => {
    
    let wlAddress = WHITELISTED;
    console.log(WHITELISTED);

    const leafNodes = wlAddress.map((addr) => keccak256(addr));
    const merkleTree = new MerkleTree(leafNodes, keccak256, {
      sortPairs: true,
    });

    const rootHash = merkleTree.getRoot();
    console.log(rootHash.toString("hex"));
    console.log(address);
    console.log(merkleTree.toString())
    const hexProof = merkleTree.getHexProof(keccak256(address));

    setWhitelistStatus(hexProof.length > 0);
  };

  const mintNFT = () => {};

  const handleConnectWallet = async () => {
    const accounts = await window.ethereum
      .request({
        method: "wallet_requestPermissions",
        params: [
          {
            eth_accounts: {},
          },
        ],
      })
      .then(() =>
        window.ethereum.request({
          method: "eth_requestAccounts",
        })
      );

    setAddress(accounts[0]);
    setConnected(true);
    getProof(accounts[0]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          {!connected
            ? "Please Connect your wallet"
            : "Connected to " + address}
        </div>

        {!connected ? (
          <button onClick={handleConnectWallet}> Connect </button>
        ) : (
          <>
          { whitelistStatus ? <button onClick={mintNFT}>Mint</button> : <div>You're not whitelisted.</div> }
          </>
        )}
      </header>
    </div>
  );
}

export default App;
