import React, { useState } from "react";
import { TezosToolkit } from "@taquito/taquito";
import { Navbar, Container, Nav } from "react-bootstrap"
import "./App.css";
import qrcode from "qrcode-generator";
import Cover from "./components/Cover";
import coverImg from "./assets/img/petshop.jpg";
import Wallet from "./components/Wallet";
import VotingPlatform from "./components/Vote/VotingPlatform";
import { truncateAddress } from "./utils/utils";

enum BeaconConnection {
  NONE = "",
  LISTENING = "Listening to P2P channel",
  CONNECTED = "Channel connected",
  PERMISSION_REQUEST_SENT = "Permission request sent, waiting for response",
  PERMISSION_REQUEST_SUCCESS = "Wallet is connected"
}

const App = () => {
  const [Tezos, setTezos] = useState<TezosToolkit>(
    new TezosToolkit("https://ghostnet.ecadinfra.com")
  );
  const [contract, setContract] = useState<any>(undefined);
  const [publicToken, setPublicToken] = useState<string | null>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [userAddress, setUserAddress] = useState<string>("");
  const [userBalance, setUserBalance] = useState<number>(0);
  const [storage, setStorage] = useState<any>({});
  const [copiedPublicToken, setCopiedPublicToken] = useState<boolean>(false);
  const [beaconConnection, setBeaconConnection] = useState<boolean>(false);

  // Ghostnet contract
  const contractAddress: string = "KT1XZU6REHQuwofZ6YjUTvvzzuxcxbkTrhzG";

  const generateQrCode = (): { __html: string } => {
    const qr = qrcode(0, "L");
    qr.addData(publicToken || "");
    qr.make();

    return { __html: qr.createImgTag(4) };
  };

  if (publicToken && (!userAddress || isNaN(userBalance))) {
    return (
      <div className="main-box">
        <h1>Taquito React template</h1>
        <div id="dialog">
          <header>Try the Taquito React template!</header>
          <div id="content">
            <p className="text-align-center">
              <i className="fas fa-broadcast-tower"></i>&nbsp; Connecting to
              your wallet
            </p>
            <div
              dangerouslySetInnerHTML={generateQrCode()}
              className="text-align-center"
            ></div>
            <p id="public-token">
              {copiedPublicToken ? (
                <span id="public-token-copy__copied">
                  <i className="far fa-thumbs-up"></i>
                </span>
              ) : (
                <span
                  id="public-token-copy"
                  onClick={() => {
                    if (publicToken) {
                      navigator.clipboard.writeText(publicToken);
                      setCopiedPublicToken(true);
                      setTimeout(() => setCopiedPublicToken(false), 2000);
                    }
                  }}
                >
                  <i className="far fa-copy"></i>
                </span>
              )}

              <span>
                Public token: <span>{publicToken}</span>
              </span>
            </p>
            <p className="text-align-center">
              Status: {beaconConnection ? "Connected" : "Disconnected"}
            </p>
          </div>
        </div>
        <div id="footer">
          <img src="built-with-taquito.png" alt="Built with Taquito" />
        </div>
      </div>
    );
  } else if (userAddress && !isNaN(userBalance)) {
    return (
      <Container fluid="md">
        <Navbar bg="white" expand="lg">
          <Container className="container-fluid">
            <Navbar.Brand href="index.html" className=" m-0 h4 fw-bold">
              Tezos Voting DApp
            </Navbar.Brand>
            <Nav className="justify-content-end pt-3 pb-5">
              <Nav.Item>
                <Wallet
                  address={userAddress}
                  amount={userBalance}
                  wallet={wallet}
                  setPublicToken={setPublicToken}
                  setUserAddress={setUserAddress}
                  setUserBalance={setUserBalance}
                  setWallet={setWallet}
                  setTezos={setTezos}
                  setBeaconConnection={setBeaconConnection}
                />
              </Nav.Item>
            </Nav>
          </Container>
        </Navbar>
        <main>
          <p>
            <i className="far fa-file-code"></i>&nbsp;
            Contract is deployed here&nbsp;
            <a
              href={`https://better-call.dev/ghostnet/${contractAddress}/operations`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {truncateAddress(contractAddress)}
            </a>
          </p>
          <VotingPlatform
            contract={contract}
            setUserBalance={setUserBalance}
            Tezos={Tezos}
            userAddress={userAddress}
            setStorage={setStorage}
            storage={storage}
          />
        </main>
      </Container>
    );
  } else if (!publicToken && !userAddress && !userBalance) {
    return (
      <Cover
        Tezos={Tezos}
        setContract={setContract}
        setPublicToken={setPublicToken}
        setWallet={setWallet}
        setUserAddress={setUserAddress}
        setUserBalance={setUserBalance}
        setStorage={setStorage}
        contractAddress={contractAddress}
        setBeaconConnection={setBeaconConnection}
        wallet={wallet}
        name="Tezos Voting DApp"
        coverImg={coverImg}
      />
    );
  } else {
    return <div>An error has occurred</div>;
  }
};

export default App;
