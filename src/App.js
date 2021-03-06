import React, { lazy, Suspense, useEffect, useState, useCallback } from 'react';
import { ethers } from 'ethers';  
import QuickTransfer from './ntt54_QuickTransfer';
import { setWallet,     setup, setup_SubstrateChain, getSCabstractions, setPolkadotInjector} from './Setup.js';   //Setup EVM and Polkadto Api

import { web3Accounts, web3Enable, web3FromAddress, web3AccountsSubscribe, web3FromSource, web3ListRpcProviders, web3UseRpcProvider } from '@polkadot/extension-dapp';

import detectEthereumProvider from '@metamask/detect-provider'; // FOR METAMASK TO BE USED This function detects most providers injected at window.ethereum


/// Components
import Index from "./jsx";

import "./vendor/bootstrap-select/dist/css/bootstrap-select.min.css";
import "./css/style.css";
 

function App() {
  //#region
  const [relaySpecs,setRelaySpecs]              = useState({ api: undefined, chainID: undefined, blockNumber: undefined });
  const [parachainSpecs,setParachainSpecs]      = useState({ api: undefined, chainID: undefined, blockNumber: undefined });
  const [karuraAlphaSpecs,setKaruraAlphaSpecs]  = useState({ api: undefined, chainID: undefined, blockNumber: undefined });
  
  // const [kusamaSpecs,setKusamaSpecs]            = useState({ api: undefined, chainID: undefined, blockNumber: undefined });
  // const [moonriverSpecs,setMoonriverSpecs]      = useState({ api: undefined, chainID: undefined, blockNumber: undefined });
  // const [karuraSpecs,setKaruraSpecs]            = useState({ api: undefined, chainID: undefined, blockNumber: undefined });

  const [setupSpecs,setSetupSpecs]            = useState({ wallet: null, provider: null, pair: null, connected: "Not connected", walletAddress: null });
  // const [blockChainSpecs,setBlockChainSpecs]  = useState({ networkName: undefined, chainID: undefined, blockNumber: undefined, gasPrice: undefined});
  const [blockHeader, setBlockHeader]         = useState({ number: undefined , hash: undefined, size: undefined });

  const [evm_api_state,setEvm_Api_State] = useState(false);
  const [accountList, setAccountList] = useState();  //stores the list of accounts from the extensions
  // const [accountBalance, setAccountBalance] = useState();
  // const [portfolio, setPortfolio] = useState(undefined);

  // const [blockTimestamp, setBlockTimestamp]   = useState(undefined);
  // const [selectedAccountName, setSelectedAccountName] = useState("");

  // const [polakdotSigner, setPolakdotSigner] = useState(null);
  const [polkadtoAccountList, setPolkadtoAccountList] = useState([]);
  const [polakdotAccountSigner, setPolakdotAccountSigner] = useState({injector: null, address: null});


  // const [mmAccountList, setMMAccountList] = useState([]);



  //#endregion


  //#region PolkadotExtenionApp
  const polakdotSignerfunction = async (SENDER) => {
      if (!SENDER) return null 
      else {
          const injector = await web3FromAddress(SENDER); // finds an injector for an address
          console.log(`polakdotSigner ===> injector: `,injector);
          // setPolakdotSigner(injector);
          setPolkadotInjector(injector,SENDER);
          setPolakdotAccountSigner({injector: injector, address: SENDER});
          return injector;    
      }
  }

  useEffect(async() => {

    //this call fires up the authorization popup returns an array of all the injected sources (this needs to be called first, before other requests)
    const extensions = await web3Enable('ntt54 Dapp');
    if (extensions.length === 0) {
      console.log("no extension installed, or the user did not accept the authorization");
      // in this case we should inform the use and give a link to the extension
      return;
    }

    // returns an array of { address, meta: { name, source } } meta.source contains the name of the extension that provides this account
    // const allAccounts = await web3Accounts();
    // console.log(`POLKADOT EXTENSION allAccounts: `,allAccounts)
    // setPolkadtoAccountList(allAccounts);

    // we are now informed that the user has at least one extension and that we will be able to show and use accounts
    let unsubscribe; // this is the function of type `() => void` that should be called to unsubscribe
    // we subscribe to any account change and log the new list.  note that `web3AccountsSubscribe` returns the function to unsubscribe
    unsubscribe = await web3AccountsSubscribe(( injectedAccounts ) => { 
        let substrateAccounts = []
        injectedAccounts.map(( account ) => {
            console.log("web3AccountsSubscribe ====> account.address: " ,account.address);
            // console.log("web3AccountsSubscribe ====> account: " ,account);
            substrateAccounts.push(account.address);
        })
        setPolkadtoAccountList(substrateAccounts);
    });
     
    // unsubscribe && unsubscribe(); // don't forget to unsubscribe when needed, e.g when unmounting a component
    // the address we use to use for signing, as injected
    // const SENDER = '5CfNjYygrfiaAfGWaGRVgGdkTuDfykZsgSXfuxTkekqq7JBh';
    // finds an injector for an address
    // const injector = await web3FromAddress(SENDER);
  }, []);   
  //#endregion


  //#region MetaMaskExtenionApp
  useEffect(async() => {

    let provider, mm_wallet, wss_provider=null, mm_acounts, mm_account, mm_chainId, wallet, account;
    //#region SETUP PROVIDER AND WALLET WITH METAMASK 
    const _provider = await detectEthereumProvider();
    if (_provider) {
        provider = new ethers.providers.Web3Provider(window.ethereum, "any");   

        mm_acounts = await _provider.request({ method: 'eth_requestAccounts' });
        mm_chainId = await _provider.request({ method: 'eth_chainId' });
        mm_account = mm_acounts[0];
        mm_wallet = provider.getSigner(); 
        console.log(`***** MetaMask Accounts *****: `,mm_acounts, ` CHAINID: ${mm_chainId} SELECTED ACOUNT: ${mm_account} mm_wallet: `,mm_wallet);
        // setMMAccountList( mm_acounts);
        setEvm_Api_State(true);
        setAccountList(mm_acounts);
        setWallet(mm_wallet);
         const _setupSpecs = { wallet: mm_wallet, provider, pair:"", connected: "C", walletAddress: await mm_wallet.getAddress() };
        setSetupSpecs(_setupSpecs);

        _provider.on('chainChanged', async (chainId) => {
          window.location.reload();
          const mm_chainId = await _provider.request({ method: 'eth_chainId' });
          console.log(`***** MetaMask Accounts *****:  CHAINID: ${mm_chainId}`);
        });

        _provider.on('accountsChanged', async (accounts) => {
          // Handle the new accounts, or lack thereof. // "accounts" will always be an array, but it can be empty.
          mm_account = accounts[0];

          provider = new ethers.providers.Web3Provider(window.ethereum, "any");   
          mm_wallet = provider.getSigner(); 
          console.log(`****** METAMASK ACCOUNT CHANGED EVENT KICKS IN *****  accounts: `,accounts,`  SELECTED ACOUNT: ${mm_account} mm_wallet.getAddress: ${await mm_wallet.getAddress()} mm_wallet: `,mm_wallet);
          // setMMAccountList(accounts);
          setEvm_Api_State(true);
          setAccountList(accounts);
          setWallet(mm_wallet);

          const _setupSpecs = { wallet: mm_wallet, provider, pair:"", connected: "C", walletAddress: await mm_wallet.getAddress() };
          setSetupSpecs(_setupSpecs);

        });

      
        // wallet = provider.getSigner(); 

        // console.log(`New MetaMask wallet.getAddress: ${await wallet.getAddress()} wallet signer : `,wallet);
        // setWallet(wallet);

        // return { provider, wallet, account,  };
    } 
    else { 
      console.log('Please install MetaMask!'); 
      // return { provider: null, wallet: null, account: null };
    }
    //#endregion SETUP PROVIDER AND WALLET WITH METAMASK 


  }, []);   
  //#endregion




  useEffect(() => {
    const runSetup = async () => {
      console.log("api_rel running setup ");

        //#region Substrate
        //testnet
        // const { api: api_moonbasealpha } = await setup_SubstrateChain("MoonbaseAlpha");
        // console.log("api_moonbasealpha: ",api_moonbasealpha);
        // const { api: api_relay } = await setup_SubstrateChain("MoonbaseRelayTestnet");
        // console.log("api_relay: ",api_relay);
        // const { api: api_karuraalpha } = await setup_SubstrateChain("KaruraAlphanet");
        // console.log("api_karuraalpha: ",api_karuraalpha);

        // console.log("api_moonbasealpha.consts.balances.existentialDeposit : ",api_moonbasealpha.consts.balances.existentialDeposit.toNumber());            // The amount required to create a new account
        // console.log("api_relay.consts.balances.existentialDeposit : ",api_relay.consts.balances.existentialDeposit.toNumber());             
        // console.log("api_karuraalpha.consts.balances.existentialDeposit : ",api_karuraalpha.consts.balances.existentialDeposit.toNumber());             

        // setParachainSpecs({ api: api_moonbasealpha, chainID: undefined, blockNumber: undefined });
        // setRelaySpecs({ api: api_relay, chainID: undefined, blockNumber: undefined });
        // setKaruraAlphaSpecs({ api: api_karuraalpha, chainID: undefined, blockNumber: undefined });

        //mainnet
        const { api: api_kusama } = await setup_SubstrateChain("Kusama");
        console.log("api_kusama: ",api_kusama);
        const { api: api_moonriver } = await setup_SubstrateChain("Moonriver");
        console.log("api_moonriver: ",api_moonriver);
        const { api: api_karura } = await setup_SubstrateChain("Karura");
        console.log("api_karura: ",api_karura);

        console.log("api_kusama.consts.balances.existentialDeposit : ",api_kusama.consts.balances.existentialDeposit.toNumber());             
        console.log("api_moonriver.consts.balances.existentialDeposit : ",api_moonriver.consts.balances.existentialDeposit.toNumber());            
        console.log("api_karura.consts.balances.existentialDeposit : ",api_karura.consts.balances.existentialDeposit.toNumber());             

        // setKusamaSpecs({ api: api_kusama, chainID: undefined, blockNumber: undefined });
        // setMoonriverSpecs({ api: api_moonriver, chainID: undefined, blockNumber: undefined });
        // setKaruraSpecs({ api: api_karura, chainID: undefined, blockNumber: undefined });

        setRelaySpecs({ api: api_kusama, chainID: undefined, blockNumber: undefined });
        setParachainSpecs({ api: api_moonriver, chainID: undefined, blockNumber: undefined });
        setKaruraAlphaSpecs({ api: api_karura, chainID: undefined, blockNumber: undefined });
        //#endregion


        //EVM
        // const { provider, wallet, account } = await setup("moonbaseAlpha", true);
        // setEvm_Api_State(true);
        // setAccountList([account]);

        // const balanceAccount_BigNumber = await provider.getBalance(account);
        // const balanceAccount =  ethers.utils.formatUnits( balanceAccount_BigNumber, 18 );
        // setAccountBalance(balanceAccount);
        // const walletBalance = await wallet.getBalance(); // { BigNumber: "42" }
        // const walletChainID = await wallet.getChainId();   
        // const gasPrice = await wallet.getGasPrice(); // 1000000000 Returns the current gas price. BigNumber   
        // const nonce = await wallet.getTransactionCount(); //NONCE 
      
        // console.log(`APP.JS  ***> account:${account} balanceAccount: ${balanceAccount} Wallet address that signs transactions: ${await wallet.getAddress()} walletBalance: ${ ethers.utils.formatUnits( walletBalance, 18 )} walletChainID: ${walletChainID} nonce:${nonce}`);
        // console.log(`APP.JS  ***>  (await provider.getNetwork()).chainId: ${(await provider.getNetwork()).chainId} getBlockNumber: ${await provider.getBlockNumber()} gasPrice: ${gasPrice.toString()}`);
        
        // const _setupSpecs = { wallet, provider, pair:"", connected: "Connected to MoonRiverbase", walletAddress: await wallet.getAddress() };
        // setSetupSpecs(_setupSpecs);
        // setBlockChainSpecs({ networkName: "MoonRiver", chainID: (await provider.getNetwork()).chainId, blockNumber: await provider.getBlockNumber(), gasPrice: (await provider.getGasPrice()).toString() });
    }
    runSetup();

  }, []);   


  //#region  parachain events setup
  useEffect(() => {

    const parachain = async (api) => {
        const chain = await api.rpc.system.chain();
        console.log(`App.js Parachain ${chain} is run at  Timestmap: ${new Date()}`);
        
        let count = 0;
        //Subscribe to the new headers on-chain.   
        const unsubHeads = await api.rpc.chain.subscribeNewHeads((lastHeader) => {
            console.log(`${chain}: last block #${lastHeader.number} has hash ${lastHeader.hash}`);
            setBlockHeader({number: `${lastHeader.number}`, hash: `lastHeader.hash`, size: "header.size"});

            // if (++count > 10) {
            //     unsubHeads();
            // }
        });
    }

    if (parachainSpecs.api)
    {
      parachain(parachainSpecs.api).catch((er) => { console.log(`APP.JS parachain Error: `,er);  });
    }
    else console.log(`App.js => setupSpecs.provider is undefined`);

  }, [parachainSpecs.api]);  
  //#endregion  parachain events setup

    
  return (
    <>
              <Suspense fallback={
                  <div id="preloader">
                      <div className="sk-three-bounce">
                          <div className="sk-child sk-bounce1"></div>
                          <div className="sk-child sk-bounce2"></div>
                          <div className="sk-child sk-bounce3"></div>
                      </div>
                  </div>  
                 }
              >
                  <Index 
                  setupSpecs={setupSpecs} polakdotSignerfunction={polakdotSignerfunction} polkadtoAccountList={polkadtoAccountList} relaySpecs={relaySpecs} karuraAlphaSpecs={karuraAlphaSpecs}  accountList={accountList} blockHeader={blockHeader}   polakdotAccountSigner={polakdotAccountSigner}
                         blockChainSpecs={"blockChainSpecs"}  blockTimestamp={"blockTimestamp"} portfolio={"portfolio"}  oracleData={"oracleData"}
                         selectedAccountName={"selectedAccountName"}  evm_api_state={"evm_api_state"} 
                         />
              </Suspense>
          </>
      );

}

export default App;
