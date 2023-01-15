import {
  DAPP_ADDRESS,
  APTOS_FAUCET_URL,
  APTOS_NODE_URL
} from "../config/constants";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { MoveResource } from "@martiandao/aptos-web3-bip44.js/dist/generated";
import { useState } from "react";
import React from "react";
import {
  AptosAccount,
  WalletClient,
  HexString,
  AptosClient,
} from "@martiandao/aptos-web3-bip44.js";

import { CodeBlock } from "../components/CodeBlock";

import newAxios from "../utils/axios_utils";

import Select from 'react-select';

// import { TypeTagVector } from "@martiandao/aptos-web3-bip44.js/dist/aptos_types";
// import {TypeTagParser} from "@martiandao/aptos-web3-bip44.js/dist/transaction_builder/builder_utils";
export default function Home() {
  const options = [
    { value: 'ethereum', label: 'ethereum' },
    { value: 'polygon', label: 'polygon' },
  ];
  const [selectedOption, setSelectedOption] = useState(null);

  const { account, signAndSubmitTransaction } = useWallet();
  const client = new WalletClient(APTOS_NODE_URL, APTOS_FAUCET_URL);
  const [resource, setResource] = React.useState<MoveResource>();
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
      {/* <input
        placeholder="Chains"
        className="mt-8 p-4 input input-bordered input-primary w-full"
        // onChange={(e) =>
        //   updateFormInput({ ...formInput, addr_description: e.target.value })
        // }
        list="chain_list"
        multiple={true}
        type="text"
      />
      <datalist id="chain_list">
        <option value="ethereum" />
        <option value="polygon" />
      </datalist> */}
      <Select
        placeholder="Chains"
        // className="mt-8 p-4 input input-bordered input-primary w-full"
        // className="mt-8 input-primary w-full select-input"
        className="mt-8 input-primary w-full select-input"
        onChange={(e) => {
          updateFormInput({ ...formInput, chains: e.map(x => { return x?.value || "" }) })
        }}
        defaultValue={selectedOption}
        options={options}
        isMulti={true}
        styles={{
          control: (baseStyles, state) => {
            return {
              // display
              display: 'flex',
              alignItems: 'center',
              // height & width
              width: '100%',
              height: '3rem',
              // outline
              outline: state.isFocused ? '2px solid #570df8' : '0px',
              outlineOffset: '3px',
              // border & padding
              borderRadius: '8px',
              paddingLeft: '0.4rem',
              // size
              fontSize: '1rem',
            }
          },
        }}
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
    </div >
  );
}
