import Image from "next/image";
import { NavItem } from "./NavItem";
import { AptosConnect } from "./AptosConnect";
import {
  MODULE_URL
} from "../config/constants";

export function NavBar() {
  return (
    <nav className="navbar py-4 px-4 bg-base-100">
      <div className="flex-1">
        <a href="http://movedid.build" target="_blank">
          <Image src="/logo.png" width={64} height={64} alt="logo" />
        </a>
        <ul className="menu menu-horizontal p-0 ml-5">
          <NavItem href="/" title="AddrManager" />
          <NavItem href="/service" title="ServiceManager" />
          {/* <NavItem href="/did_querier" title="DIDQuerier" /> */}
          <li className="font-sans font-semibold text-lg">
            <a href="https://github.com/NonceGeek/MoveDID/tree/main/did-aptos" target="_blank">Source Code</a>
            <a href={MODULE_URL} target="_blank">Contract on Explorer</a>
          </li>
        </ul>
      </div>
      <AptosConnect />
    </nav>
  );
}
