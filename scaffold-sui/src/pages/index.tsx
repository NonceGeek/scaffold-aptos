import {
  DAPP_ADDRESS,
} from "../config/constants";
import { useWallet } from "@suiet/wallet-kit";
import { useState } from "react";
import React from "react";
import Link from 'next/link';

export default function Home() {

  const { account, signAndExecuteTransaction } = useWallet();
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
      packageObjectId: DAPP_ADDRESS,
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

  return (
    <div>
      <p><b>Mint Example NFT</b></p>
      <p className="mt-4"><b>Module Path:</b> {DAPP_ADDRESS}::devnet_nft</p>
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
      <p className="mt-4">{message}</p>
      {message && <p className="mt-4"><Link href={tx}>View transaction</Link></p>}
    </div>
  );
}
