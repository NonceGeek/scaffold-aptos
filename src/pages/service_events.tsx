// import { DAPP_ADDRESS, MODULE_NAME, MODULE_URL, APTOS_NODE_URL } from '../config/constants';
import {
    DAPP_ADDRESS,
    APTOS_NODE_URL,
    NETWORK
  } from "../config/constants";
import { useWallet } from '@manahippo/aptos-wallet-adapter';
import { useEffect, useState } from 'react';
import React from 'react';
import { AptosAccount, AptosClient, BCS, HexString } from 'aptos';

export default function Home() {
    const { account, signAndSubmitTransaction } = useWallet();

    const [addServiceEvents, setAddServiceEvents] = useState<
        Array<{
            name: string;
            description: string;
            url: string;
            verification_url: string;
            expired_at: number;
        }>
        >([{
            name: '',
            description: '',
            url: '',
            verification_url: '',
            expired_at: 0,
        },]);

    const [updateServiceEvents, setUpdateAddServiceEvents] = useState<
        Array<{
            name: string;
            description: string;
            url: string;
            verification_url: string;
            expired_at: number;
        }>
        >([{
            name: '',
            description: '',
            url: '',
            verification_url: '',
            expired_at: 0,
        },]);

    const [deleteServiceEvents, setDeleteAddServiceEvents] = useState<
        Array<{
            name: string;
        }>
        >([{
            name: '',
        },]);
    
    const client = new AptosClient(APTOS_NODE_URL);

    const get_add_service_events = async () => {
        try {
            await client.getEventsByEventHandle(
                account!.address!.toString(),
                DAPP_ADDRESS + '::service_aggregator::ServiceAggregator',
                'add_service_events'
            ).then((events) => {
                console.log(events);
                const data = events.map((event) => {
                    return event.data;
                });
                setAddServiceEvents(data);
            });


        } catch (err) {
            console.log(err);
        }};
    
    const get_update_service_events = async () => {
        try {
            await client.getEventsByEventHandle(
                account!.address!.toString(),
                DAPP_ADDRESS + '::service_aggregator::ServiceAggregator',
                'update_service_events'
            ).then((events) => {
                console.log(events);
                const data = events.map((event) => {
                    return event.data;
                });
                setUpdateAddServiceEvents(data);
            });


        } catch (err) {
            console.log(err);
        }};

    const get_delete_service_events = async () => {
        try {
            await client.getEventsByEventHandle(
                account!.address!.toString(),
                DAPP_ADDRESS + '::service_aggregator::ServiceAggregator',
                'delete_service_events'
            ).then((events) => {
                console.log(events);
                const data = events.map((event) => {
                    return event.data;
                });
                setDeleteAddServiceEvents(data);
            });


        } catch (err) {
            console.log(err);
        }};
    
    const render_add_service_envets = () => {
        return addServiceEvents.map(
            (data, _index) =>
            (
                <tr className="text-center">
                    <th>{data.name}</th>
                    <td>{data.description}</td>
                    <td><a className="underline" href={data.url} target="_blank">{data.url}</a></td>
                    <td><a className="underline"  href={data.verification_url} target="_blank">{data.verification_url}</a></td>
                    <td>{data.expired_at}</td>
                </tr>
            )
        );
    };

    const render_update_service_envets = () => {
        return updateServiceEvents.map(
            (data, _index) =>
            (
                <tr className="text-center">
                    <th>{data.name}</th>
                    <td>{data.description}</td>
                    <td><a className="underline" href={data.url} target="_blank">{data.url}</a></td>
                    <td><a className="underline" href={data.verification_url} target="_blank">{data.verification_url}</a></td>
                    <td>{data.expired_at}</td>
                </tr>
            )
        );
    };

    const render_delete_service_events = () => {
        return deleteServiceEvents.map(
            (data, _index) =>
            (
                <tr className="text-center">
                    <th>{data.name}</th>
                </tr>
            )
        );
    };

    // useEffects
    useEffect(() => {
        get_add_service_events();
    }, [account]);

    useEffect(() => {
        get_update_service_events();
    }, [account]);


    useEffect(() => {
        get_delete_service_events();
    }, [account]);

    return (


        
        <div className=" p-4 w-[60%] m-auto flex flex-col shadow-2xl opacity-80 mb-10 justify-center ">
            { (account  && account.address) && (
                <div className="overflow-x-auto mt-2">
                <center>
                    <h3><b>Events Owner:</b> 
                        <a href={"https://explorer.aptoslabs.com/account/" + account.address + "?network=" + NETWORK} target="_blank" rel="noreferrer">
                            <p className="underline">
                                {account.address.toString()}
                            </p>
                        </a>
                    </h3>
                </center>
                <br></br>
                <br></br>
                </div>

            )}
            {/* add_service_events */}
            {addServiceEvents && (
                <div className="overflow-x-auto mt-2">
                    <h3 className="text-center font-bold">
                        service_aggregator::ServiceAggregator.add_service_events
                    </h3>
                    <table className="table table-compact w-full my-2">
                    <thead>
                        <tr className="text-center">
                            <th>Name</th>
                            <th>Description</th>
                            <th>URL</th>
                            <th>Verification URL</th>
                            <th>Expired at</th>
                        </tr>
                    </thead>
                    <tbody>{render_add_service_envets()}</tbody>
                    </table>
                    <br></br>
                </div>
            )}

            {/* TODO: Auto Generate by Code Generator */}
            {/* update_service_events */}
            {updateServiceEvents && (
                <div className="overflow-x-auto mt-2">
                    <h3 className="text-center font-bold">
                        service_aggregator::ServiceAggregator.update_service_events
                    </h3>
                    <table className="table table-compact w-full my-2">
                    <thead>
                        <tr className="text-center">
                            <th>Name</th>
                            <th>Description</th>
                            <th>URL</th>
                            <th>Verification URL</th>
                            <th>Expired at</th>
                        </tr>
                    </thead>
                    <tbody>{render_update_service_envets()}</tbody>
                    </table>
                    <br></br>
                </div>
            )}

            {/* delete_service_events */}
            {deleteServiceEvents && (
                <div className="overflow-x-auto mt-2">
                    <h3 className="text-center font-bold">
                        service_aggregator::ServiceAggregator.delete_service_events
                    </h3>
                    <table className="table table-compact w-full my-2">
                    <thead>
                        <tr className="text-center">
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>{render_delete_service_events()}</tbody>
                    </table>
                </div>
            )}
        </div>


    )
}