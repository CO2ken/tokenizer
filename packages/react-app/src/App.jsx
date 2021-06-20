import React, { useCallback, useEffect, useState } from "react";
import { 
  ChakraProvider, 
  extendTheme,
  theme,
  Menu, 
  MenuItem, 
  MenuList, 
  MenuButton,
  ColorModeProvider,
  CSSReset,
  Stack, 
  Box, 
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  useColorModeValue,
  Button
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { getDefaultProvider, InfuraProvider, JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import "./App.css";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useUserAddress } from "eth-hooks";
import { useExchangePrice, useGasPrice, useUserProvider, useContractLoader, useContractReader, useBalance, useEventListener } from "./hooks";
import { Header, Account, Faucet, Ramp, Contract, GasGauge, Address, Balance, Wallet} from "./components";
import { Transactor } from "./helpers";
import { parseEther, formatEther } from "@ethersproject/units";
import { Tokenize, Landing, AccountPage, Project, ProjectDetails } from "./views"
import { DAI_ABI, DAI_ADDRESS, INFURA_ID, NETWORK, NETWORKS } from "./constants";
/*
    Welcome to 🏗 scaffold-eth !

    Code:
    https://github.com/austintgriffith/scaffold-eth

    Support:
    https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA
    or DM @austingriffith on twitter or telegram

    You should get your own Infura.io ID and put it in `constants.js`
    (this is your connection to the main Ethereum network for ENS etc.)


    🌏 EXTERNAL CONTRACTS:
    You can also bring in contract artifacts in `constants.js`
    (and then use the `useExternalContractLoader()` hook!)
*/

/// 📡 What chain are your contracts deployed to?
const targetNetwork = NETWORKS.localhost; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = true;

// 🔭 block explorer URL
const blockExplorer = "https://etherscan.io/" // for xdai: "https://blockscout.com/poa/xdai/"

// 🛰 providers
if(DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
//const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
const mainnetProvider = new JsonRpcProvider("https://mainnet.infura.io/v3/"+INFURA_ID)
// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_ID)

// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = "http://localhost:8545"; // for xdai: https://dai.poa.network
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
if(DEBUG) console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
const localProvider = new JsonRpcProvider(localProviderUrlFromEnv);

// Chakra UI extendTheme colors
const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
}

// const theme = extendTheme({ colors })

function App(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [injectedProvider, setInjectedProvider] = useState();
  /* 💵 this hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangePrice(targetNetwork, mainnetProvider);

  /* 🔥 this hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice("fast"); //1000000000 for xdai

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProvider = useUserProvider(injectedProvider, localProvider);
  const address = useUserAddress(userProvider);

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userProvider, gasPrice)

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address);
  if(DEBUG) console.log("💵 yourLocalBalance",yourLocalBalance?formatEther(yourLocalBalance):"...")

  // just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(mainnetProvider, address);
  if(DEBUG) console.log("💵 yourMainnetBalance",yourMainnetBalance?formatEther(yourMainnetBalance):"...")

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider)
  if(DEBUG) console.log("📝 readContracts",readContracts)

  // If you want to make 🔐 write transactions to your contracts, use the userProvider:
  const writeContracts = useContractLoader(userProvider)
  if(DEBUG) console.log("🔐 writeContracts",writeContracts)


  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new Web3Provider(provider));
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const [route, setRoute] = useState();
  useEffect(() => {
    setRoute(window.location.pathname)
  }, [ window.location.pathname ]);

  return (
    <ChakraProvider theme={theme}>
    <ColorModeProvider options={{ useSystsemColorMode: true }}>
    <CSSReset />
    {/* <Toggle /> */}
    <div className="App">
      <BrowserRouter>
      {/* ✏️ Edit the header and change the title to your project name */}
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Box><Header /></Box>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}>
              {/* {Links.map((link, href) => (
                <NavLink key={link, href}>{link}</NavLink>
              ))} */}
              <Link key="/" onClick={()=>{setRoute("/")}} to="/">home</Link>
              <Link key="/tokenize" onClick={()=>{setRoute("/tokenize")}} to="/tokenize">tokenize</Link>
              {/* <Link key="/project" onClick={()=>{setRoute("/project")}} to="/project">project</Link> */}
              <Link key="/account" onClick={()=>{setRoute("/account")}} to="/account">account</Link>
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                cursor={'pointer'}>
                Click me
              </MenuButton>
              <MenuList>
                <MenuItem>
                {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
                <Account
                    address={address}
                    localProvider={localProvider}
                    userProvider={userProvider}
                    mainnetProvider={mainnetProvider}
                    price={price}
                    web3Modal={web3Modal}
                    loadWeb3Modal={loadWeb3Modal}
                    logoutOfWeb3Modal={logoutOfWeb3Modal}
                    blockExplorer={blockExplorer}
                />
                </MenuItem>
                <MenuItem>
                  <Balance 
                  address={address} 
                  provider={localProvider} 
                  dollarMultiplier={price} 
                  />
                </MenuItem>
                <MenuItem>
                  <Wallet 
                  address={address} 
                  provider={userProvider} 
                  ensProvider={mainnetProvider} 
                  price={price} />
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              <Link key="/" onClick={()=>{setRoute("/")}} to="/">YourContract</Link>
              <Link key="/tokenize" onClick={()=>{setRoute("/tokenize")}} to="/tokenize">Tokenize</Link>
              <Link key="/project" onClick={()=>{setRoute("/project")}} to="/project">Project</Link>
              <Link key="/account" onClick={()=>{setRoute("/account")}} to="/account">Account</Link>
           </Stack>
          </Box>
        ) : null}
      </Box>

        {/* <Menu selectedKeys={[route]}>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            Actions
          </MenuButton>
          <MenuList>
            <MenuItem key="/">
              <Link onClick={()=>{setRoute("/")}} to="/">YourContract</Link>
            </MenuItem>
            <MenuItem key="/tokenize">
              <Link onClick={()=>{setRoute("/tokenize")}} to="/tokenize">Tokenize</Link>
            </MenuItem>
            <MenuItem key="/hints">
              <Link onClick={()=>{setRoute("/hints")}} to="/hints">Hints</Link>
            </MenuItem>
            <MenuItem key="/exampleui">
              <Link onClick={()=>{setRoute("/exampleui")}} to="/exampleui">ExampleUI</Link>
            </MenuItem>
            <MenuItem key="/subgraph">
              <Link onClick={()=>{setRoute("/subgraph")}} to="/subgraph">Subgraph</Link>
            </MenuItem>
          </MenuList>
        </Menu> */}

        <Switch>
          <Route exact path="/">
            <Landing />
          </Route>
          <Route path="/tokenize">
            <Tokenize
                address={address}
                userProvider={userProvider}
                mainnetProvider={mainnetProvider}
                localProvider={localProvider}
                yourLocalBalance={yourLocalBalance}
                price={price}
                tx={tx}
                writeContracts={writeContracts}
                readContracts={readContracts}
              />
          </Route>
          <Route path="/project">
            <Project
                address={address}
                userProvider={userProvider}
                mainnetProvider={mainnetProvider}
                localProvider={localProvider}
                yourLocalBalance={yourLocalBalance}
                price={price}
                tx={tx}
                writeContracts={writeContracts}
                readContracts={readContracts}
              />
          </Route>
          <Route path="/account">
            <AccountPage />
          </Route>
          <Route path="/tokenizer/:serialNo">
            <ProjectDetails 
            address={address}
            userProvider={userProvider}
            mainnetProvider={mainnetProvider}
            localProvider={localProvider}
            yourLocalBalance={yourLocalBalance}
            price={price}
            tx={tx}
            writeContracts={writeContracts}
            readContracts={readContracts}
            />
          </Route>
        </Switch>
      </BrowserRouter>

      {/* 🗺 Extra UI like gas price, eth price, faucet, and support: */}
       <div style={{ position: "fixed", textAlign: "left", right: 0, bottom: 20, padding: 10 }}>
          <HStack mb={2}>
              <Ramp price={price} address={address} />
              <GasGauge gasPrice={gasPrice} />
          </HStack>

          <HStack>
              {
                /*  if the local provider has a signer, let's show the faucet:  */
                localProvider && 
                localProvider.connection && 
                localProvider.connection.url && 
                localProvider.connection.url.indexOf("localhost")>=0 && 
                !process.env.REACT_APP_PROVIDER && price > 1 
                ? 
                (
                  <Faucet 
                  localProvider={localProvider} 
                  price={price} 
                  ensProvider={mainnetProvider}/>
                ) 
                : 
                (
                  ""
                )
              }
          </HStack>
       </div>

    </div>
    </ColorModeProvider>
    </ChakraProvider>
  );
}


/*
  Web3 modal helps us "connect" external wallets:
*/
const web3Modal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID,
      },
    },
  },
});

const logoutOfWeb3Modal = async () => {
  await web3Modal.clearCachedProvider();
  setTimeout(() => {
    window.location.reload();
  }, 1);
};

export default App;
