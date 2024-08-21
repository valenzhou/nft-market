"use client";
import Image from "next/image";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
} from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
    useAccount,
  } from "wagmi";


export default function NavigatorBar() {
    const pathName = usePathname();
    const { isConnected } = useAccount();
  return (
    <Navbar maxWidth="full" style={{backgroundColor: '#1b191a'}}>
      <NavbarBrand>
        <Image
          src="/nft-logo.png"
          width={79}
          height={60}
          style={{ transform: "scale(1)"}}
          alt=""
        />
        <p className="font-bold text-inherit">NFT-MARKET</p>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive>
          <Link color={pathName == '/' ? 'secondary' : 'foreground'} aria-current="page" href="/">
            Collections
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/mint" color={pathName == '/mint' ? 'secondary' : 'foreground'}>
            Mint
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link color={pathName == '/market' ? 'secondary' : 'foreground'} aria-current="page" href="/market">
            Market
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/stake" color={pathName == '/stake' ? 'secondary' : 'foreground'}>
            Stake
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color={pathName == '/protal' ? 'secondary' : 'foreground'} href="/protal">
            Protal
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent as="div" justify="end">
      <ConnectButton /> 
      </NavbarContent>
    </Navbar>
  );
}
