import { DAPP_NAME, DAPP_ADDRESS, APTOS_FAUCET_URL, APTOS_NODE_URL, MODULE_URL, STATE_SEED } from '../config/constants';
import { useWallet } from '@manahippo/aptos-wallet-adapter';
// import { MoveResource } from '@martiandao/aptos-web3-bip44.js/dist/generated';
import { useState, useEffect } from 'react';
import React from 'react';
import { AptosAccount, WalletClient, HexString, Provider } from '@martiandao/aptos-web3-bip44.js';

import { LoaderIcon } from "react-hot-toast";

// import { CodeBlock } from "../components/CodeBlock";

// import { TypeTagVector } from "@martiandao/aptos-web3-bip44.js/dist/aptos_types";
// import {TypeTagParser} from "@martiandao/aptos-web3-bip44.js/dist/transaction_builder/builder_utils";
export default function Home() {
  const [services, setServices] = React.useState<Array<any>>([]);
  const { account, signAndSubmitTransaction } = useWallet();
  // TODO: refresh page after disconnect.
  const client = new WalletClient(APTOS_NODE_URL, APTOS_FAUCET_URL);
  // const [resource, setResource] = React.useState<MoveResource>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [nfts, setNFTs] = useState<Array<any>>([]);
  const loadHero = async (collection_name: string) => {
    
    if (account && account.address) {
        setLoading(true);
        const provider = new Provider({
          fullnodeUrl: "https://fullnode.testnet.aptoslabs.com/v1/",
          indexerUrl: "https://indexer-testnet.staging.gcp.aptosdev.com/v1/graphql"
        });
        // mainnet: "https://indexer.mainnet.aptoslabs.com/v1/graphql",
        // testnet: "https://indexer-testnet.staging.gcp.aptosdev.com/v1/graphql",
        // devnet: "https://indexer-devnet.staging.gcp.aptosdev.com/v1/graphql",

        const resourceAddress = await AptosAccount.getResourceAccountAddress(
          DAPP_ADDRESS,
          new TextEncoder().encode(STATE_SEED)
        );
        console.log("resourceAddr:", resourceAddress);
        const collectionAddress = await provider.getCollectionAddress(
          // account.address,
          resourceAddress, 
          "Hero Quest!"
        );

        console.log(collectionAddress);
        const tokens = await provider.getTokenOwnedFromCollectionAddress(
          account.address.toString(),
          "0xeec058a336375649ea3a718750f74d94475880bce6d06ec5e32c7ed5dbfbbc8e",
          {
            tokenStandard: "v2",
          }
        );
        const nfts = tokens.current_token_ownerships_v2.map((t) => {
          const token_data = t.current_token_data;
          const properties = token_data?.token_properties;
          console.log("token_data", token_data);
          console.log("properties", properties);
          return {
            name: token_data?.token_name || "",
            token_id: token_data?.token_data_id || "",
            token_uri: token_data?.token_uri || "",
            token_properties: properties
          };
        });

        setNFTs(nfts);
        console.log(tokens);
        setLoading(false);
    }
  };

  useEffect(() => {
    loadHero("Hero Quest!");
  }, [account]);

  async function createCollection(){
    await signAndSubmitTransaction(doCreateCollection(), { gas_unit_price: 100 }).then(() => {
    });
  }

  function doCreateCollection() {
    return {
      type: 'entry_function_payload',
      function: DAPP_ADDRESS + '::hero::create_collection',
      type_arguments: [],
      arguments: [],
    };
  }

  async function mintHero() {
    await signAndSubmitTransaction(doMintHero(), { gas_unit_price: 100 }).then(() => {
      // updated it
      // setTimeout(get_services, 3000);
    });
  }

  function doMintHero() {
    // description: string;
    // gender: string;
    // name: string;
    // race: string;
    // uri: string;
    const { name, description, gender, race, uri } = mintHeroInput;
    return {
      type: 'entry_function_payload',
      function: DAPP_ADDRESS + '::hero::mint_hero',
      type_arguments: [],
      arguments: [description, gender, name, race, uri],
    };
  }

  // entry fun mint_hero(
  //     account: &signer,
  //     description: String,
  //     gender: String,
  //     name: String,
  //     race: String,
  //     uri: String,
  // ) acquires OnChainConfig {
  //     create_hero(account, description, gender, name, race, uri);
  // }
  const [mintHeroInput, setMintHeroInput] = useState<{

    description: string;
    gender: string;
    name: string;
    race: string;
    uri: string;
  }>({
    description: '',
    gender: '',
    name: '',
    race: '',
    uri: ''
  });

  return (
      // HERE if u want a background pic
      //  <div className="flex flex-col justify-center items-center bg-[url('/assets/gradient-bg.png')] bg-[length:100%_100%] py-10 px-5 sm:px-0 lg:py-auto max-w-[100vw] ">  
      <div>
      <center>
      <p>
        <b>Module Path: </b>
        <a target="_blank" href={MODULE_URL} className="underline">
          {DAPP_ADDRESS}::{DAPP_NAME}
        </a>
      </p>
          <button onClick={loadHero} className={'btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg'}>
            Refesh Hero!
          </button>
          <br></br>
          <input
            placeholder="Name for your Hero"
            className="mt-8 p-4 input input-bordered input-primary w-1/2"
            onChange={(e) => setMintHeroInput({ ...mintHeroInput, name: e.target.value })}
          />
          <br></br>
          <input
            placeholder="Description for your Hero"
            className="mt-8 p-4 input input-bordered input-primary w-1/2"
            onChange={(e) => setMintHeroInput({ ...mintHeroInput, description: e.target.value })}
          />
          <br></br>
          <input
            placeholder="Gender for your Hero"
            className="mt-8 p-4 input input-bordered input-primary w-1/2"
            onChange={(e) => setMintHeroInput({ ...mintHeroInput, name: e.target.value })}
          />
          <br></br>
          <input
            placeholder="Race for your Hero"
            className="mt-8 p-4 input input-bordered input-primary w-1/2"
            onChange={(e) => setMintHeroInput({ ...mintHeroInput, race: e.target.value })}
          />
          <br></br>
          <input
            placeholder="URI for your Hero"
            className="mt-8 p-4 input input-bordered input-primary w-1/2"
            onChange={(e) => setMintHeroInput({ ...mintHeroInput, uri: e.target.value })}
          />
          <br></br>
          <button onClick={mintHero} className={'btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg'}>
            mint ur Hero!
          </button>
          <div className="flex gap-4">
              {isLoading ? (
                <LoaderIcon className="!w-8 !h-8" />
              ) : (
                nfts.map(nft => (
                  <div className="bg-blue-300 w-24 h-24 flex flex-col gap-2 justify-center items-center cursor-pointer hover:bg-blue-300">
                    <span className="text-md">
                      {nft.name}
                    </span>
                    <p className="text-sm">
                      Uri:&nbsp;
                      <b>{nft.token_uri}</b>
                    </p>
                  </div>
                ))
              )}
            </div>
          {/* The type of DID Owner: &nbsp; &nbsp; &nbsp; &nbsp;
          <select
            value={mintHeroInput.did_type}
            onChange={(e) => {
              setAddAddrInput({ ...mintHeroInput, did_type: parseInt(e.target.value) });
            }}>
            <option value="0">Individual</option>
            <option value="1">DAO</option>
            <option value="2">Bot</option>
            <option value="3">Repo</option>
          </select>
          <br></br>
          <button onClick={init_did} className={'btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg'}>
            Init Your DID
          </button>{' '}
          &nbsp; &nbsp; &nbsp; &nbsp; 💡 INIT Your DID on Aptos before the other Operations!
          <br></br>
          <button
            onClick={get_services}
            className={
              "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
            }>
            Refresh the Services Info
          </button>
          <br></br>
        </>
      )}
      {hasAddrAggregator && (
        <>
          <button
            onClick={get_services}
            className={
              "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
            }>
            Refresh the Services Info
          </button>
          <div className="overflow-x-auto mt-2">
            {services.length > 0 && (
              <>
                <h3 className="text-center font-bold">Services</h3>
                <div>{render_services_table()}</div>
              </>
            )}
          <br></br>
          </div>



        <input
          placeholder="service Name"
          className="mt-8 p-4 input input-bordered input-primary w-1/4"
          onChange={(e) => updateFormInput({ ...formInput, name: e.target.value })}
          value={formInput.name}
        />
        <br></br>
        <input
          placeholder="service Description"
          className="mt-8 p-4 input input-bordered input-primary w-1/4"
          onChange={(e) => updateFormInput({ ...formInput, description: e.target.value })}
          value={formInput.description}
        />
        <br></br>
        <br></br>
        <br></br>

        <div className="inline-flex relative mr-3 formkit-field">
          <p>https://github.com/</p>
          <input
            placeholder="github account"
            className="p-4 input input-bordered input-primary ml-2"
            onChange={(e) => updateFormInput({ ...formInput, github_acct: e.target.value })}
            value={formInput.github_acct}
          />
        </div>
        <br></br>
        <br></br>
        <div className="inline-flex relative mr-3 formkit-field">
          <a href="https://docs.movedid.build/guides-for-the-scenarios-of-move-did/bind-github-and-movedid/" target="_blank">
            <p className="underline">💡 How can I create a gist to verify my github acct?</p>
          </a>
        </div>
        <br></br>

        <div className="inline-flex relative mr-3 formkit-field">
          <a href="https://gist.github.com" target="_blank">
            <button className={'btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg'}>
              Create a gist!
            </button>
          </a>
        </div>
        <br></br>
        <br></br>
        <div className="inline-flex relative mr-3 formkit-field w-1/4">
          <p>https://gist.github.com/{formInput.github_acct}/</p>
        <input
          placeholder="gist Verification URL"
          className="p-4 input input-bordered input-primary w-full ml-2"
          onChange={(e) => updateFormInput({ ...formInput, gist_id: e.target.value })}
          value={formInput.gist_id}
        />
        </div>
        <br></br>
        <br></br>
        <div className="inline-flex relative mr-3 formkit-field">
          <p>0 means never expire: </p>
        <input
          className="p-4 input input-bordered input-primary ml-2"
          onChange={(e) => updateFormInput({ ...formInput, expired_at: parseInt(e.target.value) })}
          placeholder="0"
          value={formInput.expired_at}
        />
        </div>

        <br></br>
        <button onClick={add_service} className={'btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg'}>
          Add Service
        </button>
        <br></br>
        <button onClick={update_service} className={'btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg'}>
          Update Service
        </button>
        <br></br>
        <input
          placeholder="service Name"
          className="mt-8 p-4 input input-bordered input-primary w-1/4"
          onChange={(e) => updateFormInput({ ...formInput, name: e.target.value })}
          value={formInput.name}
        />
        <br></br>
        <button onClick={delete_service} className={'btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg'}>
          Delete Service
        </button> */}
      </center>
    </div>
  );
}
