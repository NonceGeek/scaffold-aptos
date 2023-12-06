import {
  DAPP_ADDRESS,
  APTOS_FAUCET_URL,
  APTOS_NODE_URL,
  MODULE_URL,
} from "../config/constants";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { MoveResource } from "@martiandao/aptos-web3-bip44.js/dist/generated";
import { useState, useEffect } from "react";
import {
  AptosAccount,
  WalletClient,
  HexString,
  AptosClient,
} from "@martiandao/aptos-web3-bip44.js";

import { CodeBlock } from "../components/CodeBlock";

import newAxios from "../utils/axios_utils";

import React, { KeyboardEventHandler } from "react";
import CreatableSelect from "react-select/creatable";

import VerifyEthAddrBtn from "../components/VerifyEthAddrBtn";
import VerifyAptosAddrBtn from "../components/VerifyAptAddrBtn";

// import { TypeTagVector } from "@martiandao/aptos-web3-bip44.js/dist/aptos_types";
// import {TypeTagParser} from "@martiandao/aptos-web3-bip44.js/dist/transaction_builder/builder_utils";

// TODO: downcase the tags input

export default function Home() {
  const { account, signAndSubmitTransaction, connected } = useWallet();
  const client = new WalletClient(APTOS_NODE_URL, APTOS_FAUCET_URL);
  // const [resource, setResource] = React.useState<MoveResource>();
  // const [resource_v2, setResourceV2] = React.useState<any>();
  const [addrInfo, setAddrInfo] = React.useState<Array<any>>([]);
  const [typeInfo, setTypeInfo] = React.useState<any>(0);
  const [descriptionInfo, setDescriptionInfo] = React.useState<any>("");
  const [hasAddrAggregator, setHasAddrAggregator] =
    React.useState<boolean>(false);
  const [addAddrInput, setAddAddrInput] = useState<{
    did_type: number;
    description: string;
    resource_path: string;
    addr_type: number;
    addr: string;
    pubkey: string;
    addr_description: string;
    spec_fields: string;
    chains: Array<string>;
    expire_second: number;
  }>({
    did_type: 0,
    description: "",
    resource_path: "",
    addr_type: 1,
    addr: "",
    pubkey: "",
    addr_description: "",
    spec_fields: "",
    chains: [],
    expire_second: 0,
  });
  const [updateAddrInput, setUpdateAddrInput] = useState<{
    addr: string;
    addr_description: string;
    chains: Array<string>;
  }>({
    addr: "",
    addr_description: "",
    chains: [],
  });

  const components = {
    DropdownIndicator: null,
  };

  interface Option {
    readonly label: string;
    readonly value: string;
  }

  const createOption = (label: string) => ({
    label,
    value: label,
  });
  const [inputValue, setInputValue] = React.useState("");
  const [chainsValue, setChainsValue] = React.useState<readonly Option[]>([]);

  const [inputValue2, setInputValue2] = React.useState("");
  const [chainsValue2, setChainsValue2] = React.useState<readonly Option[]>([]);

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (!inputValue) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        setChainsValue((prev) => [...prev, createOption(inputValue)]);
        setAddAddrInput({
          ...addAddrInput,
          chains: [...addAddrInput.chains, inputValue],
        });
        setInputValue("");
        event.preventDefault();
    }
  };

  const handleKeyDown2: KeyboardEventHandler = (event) => {
    if (!inputValue2) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        setChainsValue2((prev) => [...prev, createOption(inputValue2)]);
        setUpdateAddrInput({
          ...updateAddrInput,
          chains: [...updateAddrInput.chains, inputValue2],
        });
        setInputValue2("");
        event.preventDefault();
    }
  };

  async function init_did() {
    await signAndSubmitTransaction(do_init_did(), { gas_unit_price: 100 });
    check_addr_aggregator();
  }

  async function add_addr() {
    const test = await signAndSubmitTransaction(do_add_addr(), {
      gas_unit_price: 100,
    });
    console.log(test);
    get_addr_info(); // refresh after address added
  }

  async function update_addr() {
    const addrIndex = addrInfo
      .map((item) => {
        return item.addr;
      })
      .indexOf(updateAddrInput.addr);
    if (addrIndex !== -1) {
      // if address to be updated is one of the existing addresses, see if it's verified
      const verified = addrInfo[addrIndex].signature !== "0x";
      if (verified) {
        console.log("will update verified address");
        const txn = await signAndSubmitTransaction(do_update_addr_verified(), {
          gas_unit_price: 100,
        });
        console.log(txn);
      } else {
        console.log("will update non verified address");
        const txn = await signAndSubmitTransaction(
          do_update_addr_not_verified(),
          { gas_unit_price: 100 }
        );
        console.log(txn);
      }
      get_addr_info(); // refresh addr info after update
    } else {
      alert("Address not found!");
    }
  }

  async function delete_addr(address: string) {
    const txn = await signAndSubmitTransaction(do_delete_addr(address), {
      gas_unit_price: 100,
    });
    console.log(txn);
    get_addr_info(); // refresh addr info after update
  }

  async function get_addr_info() {
    if (account && account.address) {
      try {
        const addr_aggregator: any =
          await client.aptosClient.getAccountResource(
            account.address.toString(),
            DAPP_ADDRESS + "::addr_aggregator::AddrAggregator"
          );
        // console.log(addr_aggregator);
        if (addr_aggregator) {
          const addresses: Array<string> = addr_aggregator.data.addrs;
          const type = addr_aggregator.data.type;
          const description = addr_aggregator.data.description;
          const addr_infos_map_handle: string =
            addr_aggregator.data.addr_infos_map.handle;
          // console.log(addresses);
          // console.log(addr_infos_map_handle);
          const out: Array<any> = [];
          for (let i = 0; i < addresses.length; i++) {
            const table_item = await client.aptosClient.getTableItem(
              addr_infos_map_handle,
              {
                key_type: "0x1::string::String",
                value_type: DAPP_ADDRESS + "::addr_info::AddrInfo",
                key: addresses[i],
              }
            );
            out.push(table_item);
          }
          console.log(out);
          setAddrInfo(out);
          setTypeInfo(type);
          setDescriptionInfo(description);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  useEffect(() => {
    get_addr_info();
  }, [account]);

  function do_init_did() {
    const {
      description,
      resource_path,
      addr_type,
      addr,
      pubkey,
      addr_description,
      chains,
    } = addAddrInput;
    return {
      type: "entry_function_payload",
      function: DAPP_ADDRESS + "::init::init",
      type_arguments: [],
      arguments: [addr_type, description],
    };
  }

  function do_add_addr() {
    const {
      description,
      resource_path,
      addr_type,
      addr,
      pubkey,
      spec_fields,
      addr_description,
      expire_second,
    } = addAddrInput;
    return {
      type: "entry_function_payload",
      function: DAPP_ADDRESS + "::addr_aggregator::add_addr",
      type_arguments: [],
      arguments: [
        addr_type,
        addr,
        "", // pubkey
        [], // chains
        addr_description,
        "", // spec fields
        expire_second,
      ],
    };
  }

  function do_update_addr_verified() {
    const { addr, chains, addr_description } = updateAddrInput;
    return {
      type: "entry_function_payload",
      function:
        DAPP_ADDRESS +
        "::addr_aggregator::update_addr_info_with_chains_and_description_and_expired_at",
      type_arguments: [],
      arguments: [addr, chains, addr_description, 0],
    };
  }

  function do_update_addr_not_verified() {
    const { addr, chains, addr_description } = updateAddrInput;
    return {
      type: "entry_function_payload",
      function:
        DAPP_ADDRESS +
        "::addr_aggregator::update_addr_info_for_non_verification",
      type_arguments: [],
      arguments: [addr, chains, addr_description],
    };
  }

  function do_delete_addr(address: string) {
    // const { addr } = addAddrInput;
    return {
      type: "entry_function_payload",
      function: DAPP_ADDRESS + "::addr_aggregator::delete_addr",
      type_arguments: [],
      arguments: [address],
    };
  }

  const render_addr_info = () => {
    let out_array = [];
    for (let i = 0; i < addrInfo.length; i++) {
      out_array.push(
        <tr className="text-center" key={i}>
          <th>{addrInfo[i].addr.substring(0, 10) + "..."}</th>
          <td>{addrInfo[i].addr_type === "0" ? "ETH" : "APT"}</td>
          <td>{addrInfo[i].chains}</td>
          <td>
            {addrInfo[i].description.length > 20
              ? addrInfo[i].description.substring(0, 20)
              : addrInfo[i].description}
          </td>
          <td>{new Date(addrInfo[i].created_at * 1000).toLocaleString()}</td>
          <td>
            {addrInfo[i].expired_at === "0"
              ? "Never"
              : new Date(addrInfo[i].expired_at * 1000).toLocaleString()}
          </td>
          <td>
            {addrInfo[i].updated_at === "0"
              ? "Never"
              : new Date(addrInfo[i].updated_at * 1000).toLocaleString()}
          </td>
          <td>{addrInfo[i].signature !== "0x" ? "Yes" : "No"}</td>
          {addrInfo[i].addr_type === "0" ? (
            <VerifyEthAddrBtn
              addrInfo={addrInfo}
              addrIndex={i}
              address={addrInfo[i].addr}
              verified={addrInfo[i].signature !== "0x"}
              get_addr_info={get_addr_info}
            />
          ) : (
            <VerifyAptosAddrBtn
              addrInfo={addrInfo}
              addrIndex={i}
              address={addrInfo[i].addr}
              verified={addrInfo[i].signature !== "0x"}
              get_addr_info={get_addr_info}
            />
          )}
          <td>
            <button
              onClick={() => delete_addr(addrInfo[i].addr)}
              className={
                "btn btn-primary font-bold text-white  w-[50px] rounded-[50%] shadow-lg flex justify-center items-center text-[30px]"
              }
            >
              -
            </button>
          </td>
        </tr>
      );
    }
    return out_array;
  };

  async function check_addr_aggregator() {
    if (account && account.address) {
      try {
        const addr_aggregator: any =
          await client.aptosClient.getAccountResource(
            account.address.toString(),
            DAPP_ADDRESS + "::addr_aggregator::AddrAggregator"
          );
        console.log("addr_aggregator: " + addr_aggregator.data);
        setHasAddrAggregator(true);
      } catch (err: any) {
        console.log("check_addr_aggregator: " + err);
        setHasAddrAggregator(false);
      }
    }
  }

  useEffect(() => {
    check_addr_aggregator();
  }, [account]);
  useEffect(() => {
    console.log("has_addr: " + hasAddrAggregator);
  }, [hasAddrAggregator]);

  // useEffect(() => {console.log("has account:" + account)}, [account])

  return (
    <div>
      <center>
        <p>
          <b>Module Path:</b>
          <a target="_blank" href={MODULE_URL} className="underline">
            {DAPP_ADDRESS}::addr_aggregator
          </a>
        </p>
      </center>
      {!hasAddrAggregator && (
        <>
          <input
            placeholder="Description for your DID"
            className="mt-8 p-4 input input-bordered input-primary w-full"
            onChange={(e) =>
              setAddAddrInput({ ...addAddrInput, description: e.target.value })
            }
          />
          <br></br>
          <br></br>
          The type of DID Owner: &nbsp; &nbsp; &nbsp; &nbsp;
          <select
            value={addAddrInput.did_type}
            onChange={(e) => {
              setAddAddrInput({
                ...addAddrInput,
                did_type: parseInt(e.target.value),
              });
            }}
          >
            <option value="1">DAO</option>
          </select>
          <br></br>
          <button
            onClick={init_did}
            className={
              "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
            }
          >
            Init Your DID
          </button>{" "}
          &nbsp; &nbsp; &nbsp; &nbsp; 💡 INIT Your DID on Aptos before the other
          Operations!
          <br></br>
          <center>
            <button
              onClick={get_addr_info}
              className={
                "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
              }
            >
              Refresh DID Resources
            </button>
          </center>
          <br></br>
        </>
      )}

      {hasAddrAggregator && (
        <center>
          <button
            onClick={get_addr_info}
            className={
              "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
            }
          >
            Refresh DID Resources
          </button>
          <br></br>
        </center>
      )}
      {/* Need the description here. */}
      {hasAddrAggregator && addrInfo && (
        <div className="overflow-x-auto mt-2">
          <hr></hr>
          <br></br>
          {/* todo: make it diff of h1 - h5 */}
          <center>
            <article className="prose lg:prose-xl">
              <h2 className="text-center">DID Basic Information</h2>
            </article>
          </center>
          <center>
            <p>
              <b>DID Type: </b> {typeInfo === "0" ? "Human" : "DAO"}
            </p>
            <p>
              <b>DID Description: </b> {descriptionInfo}
            </p>
          </center>
          <br></br>
          <hr></hr>
          <br></br>
          <center>
            <article className="prose lg:prose-xl">
              <h2 className="prose text-center">Addr Aggreagator</h2>
            </article>
          </center>

          <table className="table table-compact w-full my-2">
            <thead>
              <tr className="text-center">
                <th>Address</th>
                {/* TODO: Need to Copiable */}
                {/* TODO: Need to judge if asset */}
                <th>Address Type</th>
                <th>Chain(s)</th>
                <th>Description</th>
                <th>Created At</th>
                <th>Expire At</th>
                <th>Updated At</th>
                <th>Verified</th>
                <th>Verify</th>
                <th>Signature</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>{render_addr_info()}</tbody>
          </table>

          <br></br>
          <select
            value={addAddrInput.addr_type}
            onChange={(e) => {
              setAddAddrInput({
                ...addAddrInput,
                addr_type: parseInt(e.target.value),
              });
            }}
          >
            <option value="1">Aptos Type Addr</option>
            <option value="0">Ethereum Type Addr</option>
          </select>
          <br></br>

          <input
            placeholder="Addr"
            className="mt-8 p-4 input input-bordered input-primary w-full"
            onChange={(e) =>
              setAddAddrInput({ ...addAddrInput, addr: e.target.value })
            }
          />
          {/* <br></br>
            <input
                placeholder="Pubkey (Required for APT if need to verify acct; Optional for ETH)"
                className="mt-8 p-4 input input-bordered input-primary w-full"
                onChange={(e) =>
                setAddAddrInput({ ...addAddrInput, pubkey: e.target.value })
                }
            /> */}
          <br></br>
          <input
            placeholder="Addr Description"
            className="mt-8 p-4 input input-bordered input-primary w-full"
            onChange={(e) =>
              setAddAddrInput({
                ...addAddrInput,
                addr_description: e.target.value,
              })
            }
          />
          <br></br>
          <input
            placeholder="Public Key(Only should add for APT addr that needed to verify)"
            className="mt-8 p-4 input input-bordered input-primary w-full"
            value={addAddrInput.pubkey}
            onChange={(e) =>
              setAddAddrInput({
                ...addAddrInput,
                pubkey: e.target.value,
              })
            }
          />
          <br></br>
          <input
            placeholder="Spec Fields"
            className="mt-8 p-4 input input-bordered input-primary w-full"
            value={addAddrInput.spec_fields}
            onChange={(e) =>
              setAddAddrInput({
                ...addAddrInput,
                spec_fields: e.target.value,
              })
            }
          />
          <br></br>
          {/* <CreatableSelect
                components={components}
                inputValue={inputValue}
                isClearable
                isMulti
                menuIsOpen={false}
                onChange={(newValue) => {
                setChainsValue(newValue);
                setAddAddrInput({ ...addAddrInput, chains: newValue.map(x => x.value) })
                }}
                onInputChange={(newValue) => setInputValue(newValue)}
                onKeyDown={handleKeyDown}
                placeholder="Chains"
                value={chainsValue}
                className="mt-8 input-primary w-full select-input"
                styles={{
                control: (_, state) => {
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
            /> */}
          <input
            placeholder="Expire Second"
            className="mt-8 p-4 input input-bordered input-primary w-full"
            value={addAddrInput.expire_second}
            onChange={(e) =>
              setAddAddrInput({
                ...addAddrInput,
                expire_second: parseInt(e.target.value),
              })
            }
          />
          <br></br>
          <button
            onClick={add_addr}
            className={
              "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
            }
          >
            Add Addr
          </button>
          <br></br>

          <input
            placeholder="Addr"
            className="mt-8 p-4 input input-bordered input-primary w-full"
            onChange={(e) =>
              setUpdateAddrInput({ ...updateAddrInput, addr: e.target.value })
            }
          />
          <br></br>
          <input
            placeholder="Addr Description"
            className="mt-8 p-4 input input-bordered input-primary w-full"
            onChange={(e) =>
              setUpdateAddrInput({
                ...updateAddrInput,
                addr_description: e.target.value,
              })
            }
          />
          {/* <CreatableSelect
                components={components}
                inputValue={inputValue2}
                isClearable
                isMulti
                menuIsOpen={false}
                onChange={(newValue) => {
                setChainsValue2(newValue);
                setUpdateAddrInput({ ...updateAddrInput, chains: newValue.map(x => x.value) })
                }}
                onInputChange={(newValue) => setInputValue2(newValue)}
                onKeyDown={handleKeyDown2}
                placeholder="Chains"
                value={chainsValue2}
                className="mt-8 input-primary w-full select-input"
                styles={{
                control: (_, state) => {
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
            /> */}
          <button
            onClick={update_addr}
            className={
              "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
            }
          >
            Update Addr
          </button>
        </div>
      )}

      {/* <button
        onClick={delete_addr}
        className={
          "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
        }>
        Delete Addr
      </button> */}
    </div>
  );
}
