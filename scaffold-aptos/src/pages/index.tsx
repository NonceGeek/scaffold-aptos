import {
  DAPP_ADDRESS,
  APTOS_FAUCET_URL,
  APTOS_NODE_URL
} from "../config/constants";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { MoveResource } from "@martiandao/aptos-web3-bip44.js/dist/generated";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  AptosAccount,
  WalletClient,
  HexString,
  AptosClient,
} from "@martiandao/aptos-web3-bip44.js";
import { CodeBlock } from "../components/CodeBlock";
import newAxios from "../utils/axios_utils";

// import { TypeTagVector } from "@martiandao/aptos-web3-bip44.js/dist/aptos_types";
// import {TypeTagParser} from "@martiandao/aptos-web3-bip44.js/dist/transaction_builder/builder_utils";
export default function Home() {
  const router = useRouter();
  const { account, signAndSubmitTransaction, connected, signMessage, wallet } = useWallet();
  const client = new WalletClient(APTOS_NODE_URL, APTOS_FAUCET_URL);
  const [resource, setResource] = React.useState<MoveResource>();
  const [resource_v2, setResourceV2] = React.useState();

  const [msg, setMsg] = useState("");
  const [signData, setSignData] = useState("");
  const [formInput, updateFormInput] = useState<{
    did_type: number
    description: string;
    resource_path: string;
    addr_type: number;
    addr: string;
    pubkey: string;
    addr_description: string;
    chains: Array<string>;
  }>({
    did_type: 0,
    description: "",
    resource_path: "",
    addr_type: 0,
    addr: "",
    pubkey: "",
    addr_description: "",
    chains: [],
  });

  async function init_did() {
    await signAndSubmitTransaction(
      do_init_did(),
      { gas_unit_price: 100 }
    );
  }

  async function create_addr() {
    await signAndSubmitTransaction(
      add_addr(),
      { gas_unit_price: 100 }
    );
  }

  async function del_addr() {
    await signAndSubmitTransaction(
      delete_addr(),
      { gas_unit_price: 100 }
    );
  }

  async function get_resources() {
    client.aptosClient.getAccountResources(account!.address!.toString()).then(value =>
      console.log(value)
    );
  }

  async function get_table() {
    // client.aptosClient.getTableItem()
  }

  async function get_resource() {
    const { description, resource_path, addr_type, addr, pubkey, addr_description, chains } = formInput;
    console.log(client.aptosClient.getAccountResource(account!.address!.toString(), resource_path));
  }

  async function faas_test() {
    newAxios.post(
      '/api/v1/run?name=DID.Renderer&func_name=get_module_doc',
      {
        "params": [
        ]
      },
    ).then(
      value => {
        console.log(value.data);
      }
    );
  }
  async function get_did_resource_v2() {
    newAxios.post(
      '/api/v1/run?name=DID.Renderer&func_name=gen_did_document',
      { "params": [account!.address!.toString()] },
    ).then(
      value => {
        console.log(value.data)
        setResourceV2(value.data)
      }
    );
  }

  async function get_did_resource() {
    client.aptosClient.getAccountResource(account!.address!.toString(), DAPP_ADDRESS + "::addr_aggregator::AddrAggregator").then(
      setResource
    );
  }

  function log_acct() {
    console.log(resource)
    console.log(account!.address!.toString());
  }

  function do_init_did() {
    const { description, resource_path, addr_type, addr, pubkey, addr_description, chains } = formInput;
    return {
      type: "entry_function_payload",
      function: DAPP_ADDRESS + "::init::init",
      type_arguments: [],
      arguments: [
        0,
        description
      ],
    };
  }

  function add_addr() {
    const { description, resource_path, addr_type, addr, pubkey, addr_description, chains } = formInput;
    return {
      type: "entry_function_payload",
      function: DAPP_ADDRESS + "::addr_aggregator::add_addr",
      type_arguments: [],
      arguments: [
        addr_type,
        addr,
        pubkey,
        chains,
        addr_description,

      ],
    };
  }

  function delete_addr() {
    const { addr } = formInput;
    return {
      type: "entry_function_payload",
      function: DAPP_ADDRESS + "::addr_aggregator::delete_addr",
      type_arguments: [],
      arguments: [
        addr,
      ],
    };
  }


  const buildSignMessagePayload = (messageToSign: string) => {
    const nonce = 'random_string';
    return [
      'pontem',
      'petra',
      'martian',
      'fewcha',
      'rise wallet',
      'snap',
      'bitkeep',
      'blocto',
      'coin98',
      'foxwallet',
      'openblock'
    ].includes(wallet?.adapter?.name?.toLowerCase() || '')
      ? {
        message: messageToSign,
        nonce
      }
      : messageToSign;
  }


  useEffect(() => {
    (async () => {
      if (typeof router.query.msg == 'string') {
        setMsg(router.query.msg);
      }
    })();
  });

  // 参考代码: https://github.com/hippospace/aptos-wallet-adapter/blob/6c4f4f3e91a8985bb7ab40873afc44f7402ecd30/packages/wallet-nextjs/pages/index.tsx
  useEffect((() => {
    (async () => {
      if (connected) {
        if (typeof msg == 'string') {
          const signedMessage = await signMessage(buildSignMessagePayload(msg));
          const response = typeof signedMessage === 'string' ? signedMessage : signedMessage.signature;
          setSignData(response.toString());
        }
      }
    })();
  }), [msg])

  const signMessageAction = async () => {
    if (connected) {
      const signedMessage = await signMessage(buildSignMessagePayload(msg));
      const response = typeof signedMessage === 'string' ? signedMessage : signedMessage.signature;
      setSignData(response.toString());
    } else {
      alert("connect wallet first...");
    }
  }

  return (
    <div>
      <div className="m-7 p-4  w-full rounded-md border-2">
        <input
          placeholder="message"
          className="mt-8 p-4 input input-bordered input-primary w-full"
          onChange={(e) =>
            setMsg(e.target.value)
          }
          value={msg}
        />
        <button
          onClick={signMessageAction}
          className={
            "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
          }>
          Sign Messsage
        </button>

        <div className="w-full mt-3  rounded-md ">
          <p className="rounded-md border-slate-600	">
            Sign Content :  <b> {signData} </b>
          </p>
        </div>
      </div>

      <p><b>Module Path:</b> {DAPP_ADDRESS}::addr_aggregator</p>
      <input
        placeholder="Description for your DID"
        className="mt-8 p-4 input input-bordered input-primary w-full"
        onChange={(e) =>
          updateFormInput({ ...formInput, description: e.target.value })
        }
      />
      <br></br>
      <br></br>
      The type of DID Owner: &nbsp; &nbsp; &nbsp; &nbsp;
      <select
        value={formInput.did_type}
        onChange={(e) => {
          updateFormInput({ ...formInput, did_type: parseInt(e.target.value) })
        }}
      >
        <option value="0">Individual</option>
        <option value="1">DAO</option>
      </select>
      <br></br>
      <button
        onClick={init_did}
        className={
          "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
        }>
        Init Your DID
      </button> &nbsp; &nbsp; &nbsp; &nbsp; 💡 INIT Your DID on Aptos before the other Operations!
      <br></br>
      <br></br>
      <button
        onClick={get_did_resource_v2}
        className={
          "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
        }>
        Get DID Resource
      </button>
      {resource_v2 && (
        <CodeBlock code={resource_v2} />
      )}
      <br></br>
      <select
        value={formInput.addr_type}
        onChange={(e) => {
          updateFormInput({ ...formInput, addr_type: parseInt(e.target.value) })
        }}
      >
        <option value="0">Ethereum Type Addr</option>
        <option value="1">Aptos Type Addr</option>
      </select>
      <br></br>
      <input
        placeholder="Addr"
        className="mt-8 p-4 input input-bordered input-primary w-full"
        onChange={(e) =>
          updateFormInput({ ...formInput, addr: e.target.value })
        }
      />
      <br></br>
      <input
        placeholder="Pubkey(Optional)"
        className="mt-8 p-4 input input-bordered input-primary w-full"
        onChange={(e) =>
          updateFormInput({ ...formInput, pubkey: e.target.value })
        }
      />
      <br></br>
      <input
        placeholder="Addr Description"
        className="mt-8 p-4 input input-bordered input-primary w-full"
        onChange={(e) =>
          updateFormInput({ ...formInput, addr_description: e.target.value })
        }
      />
      <br></br>
      <input
        placeholder="Chains"
        className="mt-8 p-4 input input-bordered input-primary w-full"
        onChange={(e) =>
          updateFormInput({ ...formInput, chains: JSON.parse(e.target.value) })
        }
      />
      <br></br>
      <button
        onClick={create_addr}
        className={
          "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
        }>
        Add Addr
      </button>
      <br></br>
      <button
        // onClick={create_addr}
        className={
          "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
        }>
        Update Addr
      </button>
      <button
        onClick={del_addr}
        className={
          "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
        }>
        Delete Addr
      </button>
    </div>
  );
}
