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
} from "@martiandao/aptos-web3-bip44.js";

import { CodeBlock } from "../components/CodeBlock";

// import { TypeTagVector } from "@martiandao/aptos-web3-bip44.js/dist/aptos_types";
// import {TypeTagParser} from "@martiandao/aptos-web3-bip44.js/dist/transaction_builder/builder_utils";
export default function Home() {

  const { account, signAndSubmitTransaction } = useWallet();
  const client = new WalletClient(APTOS_NODE_URL, APTOS_FAUCET_URL);
  const [resource, setResource] = React.useState<MoveResource>();
  const [formInput, updateFormInput] = useState<{
    name: string;
    url: string;
    description: string;
    verification_url: string;
    
  }>({
    name: "",
    url: "",
    description: "",
    verification_url: "",
  });

  async function create_services() {
    await signAndSubmitTransaction(
      init_service_aggr(),
      { gas_unit_price: 100 }
    );
  }

  async function create_service() {
    await signAndSubmitTransaction(
      add_service(),
      { gas_unit_price: 100 }
    );
  }

  async function get_service_resource() {
    client.aptosClient.getAccountResource(account!.address!.toString(),  DAPP_ADDRESS + "::service_aggregator::serviceAggregator").then(
      setResource
    );
  }

  function log_acct() {
    console.log(resource)
    console.log(account!.address!.toString());
  }

  function init_service_aggr() {
    return {
      type: "entry_function_payload",
      function: DAPP_ADDRESS + "::service_aggregator::create_service_aggregator",
      type_arguments: [],
      arguments: [
      ],
    };
  }

  function add_service() {
    const { name, url, description, verification_url } = formInput;
    return {
      type: "entry_function_payload",
      function: DAPP_ADDRESS + "::service_aggregator::add_service",
      type_arguments: [],
      arguments: [
        name,
        url, 
        description, 
        verification_url 
      ],
    };
  }

  return (
    <div>
        <p><b>Module Path:</b> {DAPP_ADDRESS}::service_aggregator</p>
        <button
          onClick={create_services}
          className={
            "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
          }>
          Init serviceAggregator in DID Contract
        </button>
        <br></br>
        <input
          placeholder="service Name"
          className="mt-8 p-4 input input-bordered input-primary w-full"
          onChange={(e) =>
            updateFormInput({ ...formInput, name: e.target.value })
          }
        />
        <br></br>
        <input
          placeholder="service URL"
          className="mt-8 p-4 input input-bordered input-primary w-full"
          onChange={(e) =>
            updateFormInput({ ...formInput, url: e.target.value })
          }
        />
        <br></br>
        <input
          placeholder="service Description"
          className="mt-8 p-4 input input-bordered input-primary w-full"
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />
        <br></br>
        <input
          placeholder="service Verification URL(Optional)"
          className="mt-8 p-4 input input-bordered input-primary w-full"
          onChange={(e) =>
            updateFormInput({ ...formInput, verification_url: e.target.value })
          }
        />
        <br></br>
        <button
          onClick={create_service}
            className={
              "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
            }>
            Add service
        </button>
        <br></br>
        <button
          // onClick={create_addr}
            className={
              "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
            }>
            Update service
        </button>
    </div>
  );
}
