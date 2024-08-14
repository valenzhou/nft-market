"use client";
import Image from "next/image";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
//   DropdownItem,
//   DropdownTrigger,
//   Dropdown,
//   DropdownMenu,
//   Avatar,
} from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
    useAccount,
  } from "wagmi";


export default function NavigatorBar() {
    const pathName = usePathname();
    const { isConnected } = useAccount();
    // console.log(isConnected)
    // const handleDropSelect = (e:any)=>{
    //     console.log(e);
    // }
    // const handleSetting = (e:any)=>{
    //     console.log(e);
    // }
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
      {/* {isConnected &&
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Jason Hughes"
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat" onAction={handleDropSelect}>
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">zoey@example.com</p>
            </DropdownItem>
            <DropdownItem key="settings" onPress={handleSetting}>My Settings</DropdownItem>
            <DropdownItem key="team_settings">Team Settings</DropdownItem>
            <DropdownItem key="analytics">Analytics</DropdownItem>
            <DropdownItem key="system">System</DropdownItem>
            <DropdownItem key="configurations">Configurations</DropdownItem>
            <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
            <DropdownItem key="logout" color="danger">
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown> } */}
      </NavbarContent>
    </Navbar>
  );
}
