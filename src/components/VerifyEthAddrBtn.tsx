// import {
//     useBalance,
//     useContractLoader,
//     useContractReader,
//     // useOnBlock,
//     useUserProviderAndSigner,
//   } from "eth-hooks";
import { AptosWalletAdapter } from "@manahippo/aptos-wallet-adapter";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { useWallet } from '@manahippo/aptos-wallet-adapter';
import { DAPP_ADDRESS } from "../config/constants";
import { WalletClient } from "@martiandao/aptos-web3-bip44.js";
import { APTOS_NODE_URL, APTOS_FAUCET_URL, ETH_SIGNER_URL } from "../config/constants";

interface props {
    addrInfo: any,
    addrIndex: number,
    address: string, 
    verified: boolean,
    get_addr_info: ()=>Promise<void>
}


export default function VerifyEthAddrBtn({addrInfo, addrIndex, address, verified, get_addr_info}: props) {
    const [currentAccount, setCurrentAccount] = useState<string>();
    const { account, signAndSubmitTransaction } = useWallet();
    const [ msg, setMsg ] = useState<string>();
    const client = new WalletClient(APTOS_NODE_URL, APTOS_FAUCET_URL);
    const [ signature, setSignature ] = useState<string>("");

    // useEffect(() => {
    //     setMsg(resource_v2.result.verification_methods[addrIndex].verification.msg);
    // }, []);

    useEffect(() => {
        setMsg(addrInfo[addrIndex].msg);
    }, []);

    const update_eth_addr = async () => {
        console.log("signature:" + signature);
        console.log("address:" + address);
        const payload = {
            type: 'entry_function_payload',
            function: DAPP_ADDRESS + '::addr_aggregator::update_eth_addr',
            type_arguments: [],
            arguments: [address, signature],
        }
        const txn = await signAndSubmitTransaction(payload, { gas_unit_price: 100 });
        console.log(txn);
        get_addr_info();
    }

    const render_button = () => {
        if(address) { // only render if address exists
            if(verified) { // if verified already, disable button input
                return(
                    <>
                    <td>
                        <button className={
                            "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
                        } disabled={true}>
                            No Action Available
                        </button>
                    </td>
                    <td>
                        <input
                            placeholder="ETH signature verified"
                            className="mt-8 p-4 input input-bordered input-primary w-full"
                        />
                    </td>
                    </>
                )
            } else { // if not verified
                if(signature !== "") { // if signature is filled, enable verification button
                    return (
                        <>
                        <td>
                            <button className={
                                "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
                            } onClick={update_eth_addr}>
                                Verify ETH Signature 
                            </button>
                        </td>
                        <td>
                            <input
                                placeholder="Paste generated signature here"
                                className="mt-8 p-4 input input-bordered input-primary w-full"
                                onChange={(e) => setSignature(e.target.value)}
                            />
                        </td>
                        </>
                    )
                } else { // if signature is not filled, enable generate signature button
                    return (
                        <>
                        <td>
                            <button className={
                                "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
                            }>
                                <a 
                                    href={ETH_SIGNER_URL + msg}
                                    target="_blank"
                                >
                                    Generate ETH Signature
                                </a>
                            </button>
                        </td>
                        <td>
                            <input
                                placeholder="Paste generated signature here"
                                className="mt-8 p-4 input input-bordered input-primary w-full"
                                onChange={(e) => setSignature(e.target.value)}
                            />
                        </td>
                        </>
                    )
                }
            }
        }
    }

    // const test_verify_eth_addr = async () => {
    //     const signature = "0x5faa98bcaa18607b722e6e4da523451a410f23ac760c7871576f559686f5940f4dd2be9413b56efb4521138c3a83a95de72f97a89c45440c4c5d12f975fc1cba1b"
    //     const address = "0x9a193f61a32121131EB671E53ce34A381Ec9AaDe"
    //     const message = "62449562.1.4139eaf9a8f1ee32431e6d33876a8a4243be4b0d7fbf76f0cb0315ec92452369.5.nonce_geek"

    //     const payload = {
    //         type: 'script_payload',
    //         function: DAPP_ADDRESS + '::eth_sig_verifier::verify_eth_sig',
    //         type_arguments: [],
    //         arguments: [signature, address, message],
    //     }
    //     const txn = await signAndSubmitTransaction(payload, { gas_unit_price: 100 });
    //     console.log(txn);
    // }

    // test_verify_eth_addr();

    return (
        <>
        {render_button()}
        </>
    );
}


    // const provider = await web3Modal.requestProvider();
    // setInjectedProvider(new ethers.providers.Web3Provider(provider));
    // const userProviderAndSigner = useUserProviderAndSigner(injectedProvider, localProvider, USE_BURNER_WALLET);
    // const userSigner = userProviderAndSigner.signer;
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const signer = provider.getSigner();

    // const connectWalletAction = async() => {
    //     try {
    //       const{ethereum} = window;
    //       if(!ethereum) {
    //         console.log("No wallet detected!");
    //         return;
    //       } else {
    //         const accounts: Array<string> = await ethereum.request({method: 'eth_requestAccounts'});
    //         console.log('Connected', accounts[0]);
    //         setCurrentAccount(accounts[0]);
    //       }
    //     } catch(error) {
    //       console.log(error);
    //     }
    // };

    
//   async function get_account_addr_info() {

//     client.aptosClient.getAccountResource(account!.address!.toString(), DAPP_ADDRESS + "::addr_info::AddrInfo").then(
      
//     );
//   }

//     async function get_msg_to_sign() {
//         const payload = {
//             type: 'entry_function_payload',
//             function: DAPP_ADDRESS + '::service_aggregator::get_msg_to_sign',
//             type_arguments: [],
//             arguments: [],
//         }
//         await signAndSubmitTransaction
//     }

// async function airdrop_coins_not_average_script() {
        
//     console.log(do_airdrop_coins_not_average_script());

//     await signAndSubmitTransaction(do_airdrop_coins_not_average_script(), { gas_unit_price: 100 });
// }

// function do_airdrop_coins_not_average_script() {
//     const { addresses, description, moneys, money } = formInput;
//     return {
//       type: 'entry_function_payload',
//       function: DAPP_ADDRESS + '::addr_info::get_msg',
//       type_arguments: [],
//       arguments: [description, addresses, moneys],
//     };
//   }

    // const [ formInput, updateFormInput ] = useState<{
    //     address: string,
    //     signature: string
    // }>({
    //     address: "",
    //     signature: ""
    // });