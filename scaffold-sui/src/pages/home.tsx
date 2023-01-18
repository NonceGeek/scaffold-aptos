import {
  DAPP_ADDRESS,
} from "../config/constants";
import { useWallet } from "@suiet/wallet-kit";
import { useState } from "react";
import React from "react";

import { CodeBlock } from "../components/CodeBlock";

import newAxios from "../utils/axios_utils";

export default function Home() {

  const { account, signAndExecuteTransaction } = useWallet();
  // const client = new WalletClient(APTOS_NODE_URL, APTOS_FAUCET_URL);
  // const [resource, setResource] = React.useState<MoveResource>();
  const [resource_v2, setResourceV2] = React.useState();
  const [formInput, updateFormInput] = useState<{
    did_type: number;
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
    await signAndExecuteTransaction(
      {
        transaction: {
          kind: 'moveCall',
          data: do_init_did(),
        }
      }
    );
  }

  async function create_addr() {
    await signAndExecuteTransaction(
      {
        transaction: {
          kind: 'moveCall',
          data: add_addr(),
        }
      }
    );
  }

  async function del_addr() {
    await signAndExecuteTransaction(
      {
        transaction: {
          kind: 'moveCall',
          data: delete_addr(),
        }
      }
    );
  }

  // async function get_resources() {
  //   client.aptosClient.getAccountResources(account!.address!.toString()).then(value =>
  //     console.log(value)
  //   );
  // }

  // async function get_table() {
  //   // client.aptosClient.getTableItem()
  // }

  // async function get_resource() {
  //   const { description, resource_path, addr_type, addr, pubkey, addr_description, chains } = formInput;
  //   console.log(client.aptosClient.getAccountResource(account!.address!.toString(), resource_path));
  // }

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

  // async function get_did_resource() {

  //   client.aptosClient.getAccountResource(account!.address!.toString(), DAPP_ADDRESS + "::addr_aggregator::AddrAggregator").then(
  //     setResource
  //   );
  // }

  function log_acct() {
    // console.log(resource)
    console.log(account!.address!.toString());
  }

  function do_init_did() {
    const { description, resource_path, addr_type, addr, pubkey, addr_description, chains } = formInput;
    return {
      packageObjectId: DAPP_ADDRESS,
      module: 'init',
      function: 'init',
      typeArguments: [],
      arguments: [
        0,
        description
      ],
      // gasPayment: '',
      gasBudget: 30000,
    };
  }

  function add_addr() {
    const { description, resource_path, addr_type, addr, pubkey, addr_description, chains } = formInput;
    return {
      packageObjectId: DAPP_ADDRESS,
      module: 'addr_aggregator',
      function: 'add_addr',
      typeArguments: [],
      arguments: [
        addr_type,
        addr,
        pubkey,
        chains,
        addr_description,
      ],
      // gasPayment: '',
      gasBudget: 30000,
    };
  }

  function delete_addr() {
    const { addr } = formInput;
    return {
      packageObjectId: DAPP_ADDRESS,
      module: 'addr_aggregator',
      function: 'delete_addr',
      typeArguments: [],
      arguments: [
        addr,
      ],
      // gasPayment: '',
      gasBudget: 30000,
    };
  }

  return (
    <div>
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
