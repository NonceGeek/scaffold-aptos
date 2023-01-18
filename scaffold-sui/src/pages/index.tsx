import {
  DAPP_ADDRESS,
} from "../config/constants";
import { useWallet } from "@suiet/wallet-kit";
import { useEffect, useState } from "react";
import React from "react";
import Link from 'next/link';
import { JsonRpcProvider } from '@mysten/sui.js';

export default function Home() {
  const provider = new JsonRpcProvider();
  const { account, connected, signAndExecuteTransaction } = useWallet();
  const [formInput, updateFormInput] = useState<{
    name: string;
    url: string;
    description: string;
  }>({
    name: "",
    url: "",
    description: "",
  });
  const [message, setMessage] = useState('');
  const [tx, setTx] = useState('');
  const [nfts, setNfts] = useState<Array<{ id: string, name: string, url: string, description: string }>>([]);

  const PACKAGE_ID = remove_leading_zero(DAPP_ADDRESS);

  function remove_leading_zero(address: string) {
    return address.replace(/0x[0]+/, '0x')
  }

  async function mint_example_nft() {
    setMessage("");
    try {
      const data = create_example_nft()
      const resData = await signAndExecuteTransaction({
        transaction: {
          kind: 'moveCall',
          data,
        },
      });
      console.log('success', resData);
      setMessage('Mint succeeded');
      setTx('https://explorer.sui.io/transaction/' + resData.certificate.transactionDigest)
    } catch (e) {
      console.error('failed', e);
      setMessage('Mint failed: ' + e);
      setTx('');
    }
  }

  function log_acct() {
    console.log(account!.address!.toString());
  }

  function create_example_nft() {
    const { name, url, description } = formInput;
    return {
      packageObjectId: PACKAGE_ID,
      module: 'devnet_nft',
      function: 'mint',
      typeArguments: [],
      arguments: [
        name,
        description,
        url,
      ],
      gasBudget: 30000,
    };
  }

  async function fetch_example_nft() {
    const objects = await provider.getObjectsOwnedByAddress(account!.address)
    const nft_ids = objects
      .filter(item => item.type === PACKAGE_ID + "::devnet_nft::DevNetNFT")
      .map(item => item.objectId)
    const nftObjects = await provider.getObjectBatch(nft_ids)
    const nfts = nftObjects.filter(item => item.status === "Exists").map(item => {
      return {
        id: item.details.data.fields.id.id,
        name: item.details.data.fields.name,
        url: item.details.data.fields.url,
        description: item.details.data.fields.description,
      }
    })
    setNfts(nfts)
  }

  useEffect(() => {
    (async () => {
      if (connected) {
        fetch_example_nft()
      }
    })()
  }, [connected, tx])

  return (
    <div>
      <p><b>Mint Example NFT</b></p>
      <p className="mt-4"><b>Module Path:</b> {PACKAGE_ID}::devnet_nft</p>
      <br></br>
      <input
        placeholder="NFT Name"
        className="mt-4 p-4 input input-bordered input-primary w-full"
        onChange={(e) =>
          updateFormInput({ ...formInput, name: e.target.value })
        }
      />
      <br></br>
      <input
        placeholder="NFT Description"
        className="mt-8 p-4 input input-bordered input-primary w-full"
        onChange={(e) =>
          updateFormInput({ ...formInput, description: e.target.value })
        }
      />
      <br></br>
      <input
        placeholder="NFT IMAGE URL"
        className="mt-8 p-4 input input-bordered input-primary w-full"
        onChange={(e) =>
          updateFormInput({ ...formInput, url: e.target.value })
        }
      />
      <br></br>
      <button
        onClick={mint_example_nft}
        className={
          "btn btn-primary font-bold mt-4 text-white rounded p-4 shadow-lg"
        }>
        Mint example NFT
      </button>
      <br></br>
      <p className="mt-4">{message}{message && <Link href={tx}>, View transaction</Link>}</p>
      <br></br>
      <p className="mt-4"><b>Minted NFTs:</b></p>
      {nfts && nfts.map((item, i) => <div className="gallery">
        <img src={item.url} max-width="300" max-height="200"></img>
        <div className="name">{item.name}</div>
        <div className="desc">{item.description}</div>
      </div>)}
    </div>
  );
}
