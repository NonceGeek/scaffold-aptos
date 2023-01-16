import {
  DAPP_ADDRESS,
} from "../config/constants";
import { useWallet } from "@suiet/wallet-kit";
import { useState } from "react";
import React from "react";

import { CodeBlock } from "../components/CodeBlock";

export default function Home() {

  const { account, signAndExecuteTransaction } = useWallet();
  // const client = new WalletClient(APTOS_NODE_URL, APTOS_FAUCET_URL);
  // const [resource, setResource] = React.useState<MoveResource>();
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

  async function create_endpoints() {
    await signAndExecuteTransaction(
      {
        transaction: {
          kind: 'moveCall',
          data: init_endpoint_aggr(),
        }
      }
    );
  }

  async function create_endpoint() {
    await signAndExecuteTransaction(
      {
        transaction: {
          kind: 'moveCall',
          data: add_endpoint(),
        }
      }
    );
  }

  // async function get_endpoint_resource() {
  //   client.aptosClient.getAccountResource(account!.address!.toString(),  DAPP_ADDRESS + "::endpoint_aggregator::EndpointAggregator").then(
  //     setResource
  //   );
  // }

  function log_acct() {
    // console.log(resource)
    console.log(account!.address!.toString());
  }

  function init_endpoint_aggr() {
    return {
      packageObjectId: DAPP_ADDRESS,
      module: 'endpoint_aggregator',
      function: 'create_endpoint_aggregator',
      typeArguments: [],
      arguments: [],
      // gasPayment: '',
      gasBudget: 30000,
    };
  }

  function add_endpoint() {
    const { name, url, description, verification_url } = formInput;
    return {
      packageObjectId: DAPP_ADDRESS,
      module: 'endpoint_aggregator',
      function: 'add_endpoint',
      typeArguments: [],
      arguments: [
        name,
        url,
        description,
        verification_url
      ],
      // gasPayment: '',
      gasBudget: 30000,
    };
  }

  return (
    <div>
      <p><b>Module Path:</b> {DAPP_ADDRESS}::endpoint_aggregator</p>
      <button
        onClick={create_endpoints}
        className={
          "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
        }>
        Init EndpointAggregator in DID Contract
      </button>
      <br></br>
      <input
        placeholder="Endpoint Name"
        className="mt-8 p-4 input input-bordered input-primary w-full"
        onChange={(e) =>
          updateFormInput({ ...formInput, name: e.target.value })
        }
      />
      <br></br>
      <input
        placeholder="Endpoint URL"
        className="mt-8 p-4 input input-bordered input-primary w-full"
        onChange={(e) =>
          updateFormInput({ ...formInput, url: e.target.value })
        }
      />
      <br></br>
      <input
        placeholder="Endpoint Description"
        className="mt-8 p-4 input input-bordered input-primary w-full"
        onChange={(e) =>
          updateFormInput({ ...formInput, description: e.target.value })
        }
      />
      <br></br>
      <input
        placeholder="Endpoint Verification URL(Optional)"
        className="mt-8 p-4 input input-bordered input-primary w-full"
        onChange={(e) =>
          updateFormInput({ ...formInput, verification_url: e.target.value })
        }
      />
      <br></br>
      <button
        onClick={create_endpoint}
        className={
          "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
        }>
        Add Endpoint
      </button>
      <br></br>
      <button
        // onClick={create_addr}
        className={
          "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
        }>
        Update Endpoint
      </button>
    </div>
  );
}
