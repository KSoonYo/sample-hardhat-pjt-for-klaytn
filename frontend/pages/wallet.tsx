import { useEffect, useState } from "react";
import type { NextPage } from "next";

const Wallet: NextPage = () => {
  const [address, setAddress] = useState(undefined);
  const [network, setnetwork] = useState(undefined);

  useEffect(() => {
    const { klaytn } = window;
    loadAccount(klaytn);
  }, []);

  const loadAccount = async (klaytn: any) => {
    if (klaytn === undefined) return;
    try {
      await klaytn.enable();
      setAccountInfo(klaytn);
      setnetworkInfo(klaytn);
      klaytn.on("accountsChanged", () => setAccountInfo(klaytn));
      klaytn.on("networkChanged", () => setnetworkInfo(klaytn));
      klaytn.on("disconnected", () => {
        setAccountInfo(undefined);
        setnetwork(undefined);
      });
    } catch {
      console.error("user denied account access");
    }
  };

  const setAccountInfo = async (klaytn: any) => {
    if (klaytn === undefined) return;
    const selectedAddress = klaytn.selectedAddress;
    setAddress(selectedAddress);
  };

  const setnetworkInfo = async (klaytn: any) => {
    if (klaytn === undefined) return;
    setnetwork(klaytn.networkVersion);
  };

  return (
    <div>
      <p>
        {address === undefined ? "no connection" : `connection: ${address}`}
      </p>
      <p>{network === undefined ? "no network" : `network: ${network}`}</p>
    </div>
  );
};

export default Wallet;
