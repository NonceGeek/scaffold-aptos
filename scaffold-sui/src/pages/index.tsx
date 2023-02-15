import { useWallet } from "@suiet/wallet-kit";
import { useEffect, useState } from "react";
import React from "react";
import Link from 'next/link';
import { JsonRpcProvider } from '@mysten/sui.js';
import { SUI_PACKAGE, SUI_MODULE } from "../config/constants";

const BaseAddr = "0x2";
type NftListPros = { nfts: Array<{ url: string, id: string, name: string, description: string }> };
const NftList = ({ nfts }: NftListPros) => {
  return nfts && (
    <div className="card lg:card-side bg-base-100 shadow-xl mt-5">
      <div className="card-body">
        <h2 className="card-title">Minted NFTs:</h2>
        {
          nfts.map((item, i) => <div className="gallery" key={item.id}>
            <a target="_blank" href={"https://explorer.sui.io/object/" + item.id + "?network=" + process.env.NEXT_PUBLIC_SUI_NETWORK}>
              <img src={item.url} max-width="300" max-height="200"></img>
              <div className="name">{item.name}</div>
              <div className="desc">{item.description}</div>
            </a>
          </div>)
        }
      </div>
    </div>
  )
}


type SwordListPros = { swords: Array<{ id: string, magic: number, strength: number }>, transfer: Function };
const SwordList = ({ swords, transfer }: SwordListPros) => {
  return swords && (
    <div className="card lg:card-side bg-base-100 shadow-xl mt-5">
      <div className="card-body">
        <h2 className="card-title">swords list:</h2>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Id</th>
                <th>Magic</th>
                <th>Strength</th>
                <th>Operate</th>
              </tr>
            </thead>
            <tbody>

              {
                swords.map((item, i) =>
                  <tr>
                    <th>{item.id}</th>
                    <td>{item.magic}</td>
                    <td>{item.strength} </td>
                    <td>
                      <a href="javascript:;" className="link link-hover link-primary" onClick={() => { transfer(item.id) }}>Transfer</a>
                    </td>
                  </tr>
                )
              }


            </tbody>
          </table>
        </div>


      </div>
    </div>
  )
}

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
  const [swords, setSword] = useState<Array<{ id: string, magic: number, strength: number }>>([]);
  const [gasObjects, setGasObjects] = useState<Array<{ id: string, value: Number, }>>([]);
  const [displayModal, toggleDisplay] = useState(false);
  const [recipient, updateRecipient] = useState("");
  const [transfer_id, setTransferId] = useState("");

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

  function create_example_nft() {
    const { name, url, description } = formInput;
    return {
      packageObjectId: BaseAddr,
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

  async function doTransfer() {
    function makeTranscaction() {
      return {
        packageObjectId: SUI_PACKAGE,
        module: SUI_MODULE,
        function: 'sword_transfer',
        typeArguments: [],
        // 类型错误，传递字符串类型，部分钱包会内部转化
        arguments: [
          transfer_id,
          recipient,
        ],
        gasBudget: 30000,
      };
    }

    setMessage("");
    try {
      const data = makeTranscaction();
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

  async function transferSword(id: string) {
    setTransferId(id);
    toggleDisplay(true);
  }

  async function fetch_gas_coins() {
    const gasObjects = await provider.getGasObjectsOwnedByAddress(account!.address)
    const gas_ids = gasObjects.map(item => item.objectId)
    const gasObjectDetail = await provider.getObjectBatch(gas_ids)
    console.log(gasObjectDetail);
    const gasList = gasObjectDetail.map((item: any) => {
      return {
        id: item.details.data.fields.id.id,
        value: item.details.data.fields.balance,
      }
    });
    setGasObjects(gasList);
  }

  async function fetch_example_nft() {
    const objects = await provider.getObjectsOwnedByAddress(account!.address)
    const nft_ids = objects
      .filter(item => item.type === BaseAddr + "::devnet_nft::DevNetNFT")
      .map(item => item.objectId)
    const nftObjects = await provider.getObjectBatch(nft_ids)
    const nfts = nftObjects.filter(item => item.status === "Exists").map((item: any) => {
      return {
        id: item.details.data.fields.id.id,
        name: item.details.data.fields.name,
        url: item.details.data.fields.url,
        description: item.details.data.fields.description,
      }
    })
    setNfts(nfts)
  }

  async function fetch_sword() {
    const objects = await provider.getObjectsOwnedByAddress(account!.address)
    const sword_ids = objects
      .filter(item => item.type === SUI_PACKAGE + "::" + SUI_MODULE + "::Sword")
      .map(item => item.objectId)
    const swordObjects = await provider.getObjectBatch(sword_ids)
    const swords = swordObjects.filter(item => item.status === "Exists").map((item: any) => {
      return {
        id: item.details.data.fields.id.id,
        magic: item.details.data.fields.magic,
        strength: item.details.data.fields.strength,
      }
    })
    setSword(swords)
  }

  useEffect(() => {
    (async () => {
      if (connected) {
        fetch_example_nft()
        fetch_sword()
      }
    })()
  }, [connected, tx])

  useEffect(() => {
    (async () => {
      if (connected) {
        fetch_gas_coins()
      }
    })()
  }, [connected])

  return (
    <div>
      <div className={displayModal ? "modal modal-bottom sm:modal-middle modal-open" : "modal modal-bottom sm:modal-middle"}>
        <div className="modal-box">
          <label onClick={() => { toggleDisplay(false) }} className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
          <h3 className="font-bold text-lg">Input recent address</h3>
          <input
            placeholder="Recipient"
            className="mt-8 p-4 input input-bordered input-primary w-full"
            value={recipient}
            onChange={(e) =>
              updateRecipient(e.target.value)
            }
          />
          <div className="modal-action">
            <label htmlFor="my-modal-6" className="btn" onClick={() => {
              toggleDisplay(!displayModal);
              doTransfer();
            }}>Done!</label>
          </div>
        </div>
      </div>
      <div>
        <p><b>Mint Example NFT</b></p>
        <input
          placeholder="NFT Name"
          className="mt-4 p-4 input input-bordered input-primary w-full"
          onChange={(e) =>
            updateFormInput({ ...formInput, name: e.target.value })
          }
        />
        <input
          placeholder="NFT Description"
          className="mt-8 p-4 input input-bordered input-primary w-full"
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />
        <input
          placeholder="NFT IMAGE URL"
          className="mt-8 p-4 input input-bordered input-primary w-full"
          onChange={(e) =>
            updateFormInput({ ...formInput, url: e.target.value })
          }
        />
        <button
          onClick={mint_example_nft}
          className={
            "btn btn-primary font-bold mt-4 text-white rounded p-4 shadow-lg"
          }>
          Mint example NFT
        </button>
        <p className="mt-4">{message}{message && <Link href={tx}>, View transaction</Link>}</p>
      </div>
      <NftList nfts={nfts} />
      <SwordList swords={swords} transfer={transferSword} />


    </div >
  );
}
