import React from "react";
import { Button } from "@chakra-ui/react";
import Address from "./Address";

export default function Account({
  address,
  userProvider,
  localProvider,
  mainnetProvider,
  price,
  minimized,
  web3Modal,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  blockExplorer,
}) {
  const modalButtons = [];
  if (web3Modal) {
    if (web3Modal.cachedProvider) {
      modalButtons.push(
        <Button
          key="logoutbutton"
          size="md"
          onClick={logoutOfWeb3Modal}
        >
          logout
        </Button>,
      );
    } 
    else {
      modalButtons.push(
        <Button
          key="loginbutton"
          size="md"
          /*type={minimized ? "default" : "primary"}     too many people just defaulting to MM and having a bad time*/
          onClick={loadWeb3Modal}
        >
          Connect
        </Button>,
      );
    }
  }

  const display = minimized ? (
    ""
  ) : (
    <span>
      {address ? <Address value={address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} /> : "Connecting..."} 
    </span>
  );

  return (
    <div>
      {display}
      {modalButtons}
    </div>
  );
}
