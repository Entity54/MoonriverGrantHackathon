import React, { lazy, Suspense, useEffect, useState, useCallback } from 'react';
import { ethers } from 'ethers';  
import QuickTransfer from './ntt54_QuickTransfer';
import {setup, setup_SubstrateChain, getSCabstractions} from './Setup.js';   //Setup EVM and Polkadto Api

import "./vendor/bootstrap-select/dist/css/bootstrap-select.min.css";
import "./css/style.css";


function App() {

  const [parachainSpecs,setParachainSpecs]  = useState({ api: undefined, chainID: undefined, blockNumber: undefined });
  const [relaySpecs,setRelaySpecs]          = useState({ api: undefined, chainID: undefined, blockNumber: undefined });

  const [setupSpecs,setSetupSpecs]            = useState({ wallet: null, provider: null, pair: null, connected: "Not connected", walletAddress: null });
  const [blockChainSpecs,setBlockChainSpecs]  = useState({ networkName: undefined, chainID: undefined, blockNumber: undefined, gasPrice: undefined});
  const [blockHeader, setBlockHeader]         = useState({ number: undefined , hash: undefined, size: undefined });

  const [evm_api_state,setEvm_Api_State] = useState(false);
  const [accountList, setAccountList] = useState();  //stores the list of accounts from the extensions
  const [accountBalance, setAccountBalance] = useState();
  const [portfolio, setPortfolio] = useState(undefined);

  // const [blockTimestamp, setBlockTimestamp]   = useState(undefined);
  const [selectedAccountName, setSelectedAccountName] = useState("");


  useEffect(() => {
    const runSetup = async () => {

        //Substrate
        const { api: api_para } = await setup_SubstrateChain("MoonbaseAlpha");
        console.log("api_para: ",api_para);

        const { api: api_relay } = await setup_SubstrateChain("MoonbaseRelayTestnet");
        // const { api: api_para } = await setup_SubstrateChain("Moonriver");
        // const { api: api_relay } = await setup_SubstrateChain("Kusama");
        console.log("api_relay: ",api_relay);

        console.log("api_para.consts.balances.existentialDeposit : ",api_para.consts.balances.existentialDeposit.toNumber());            // The amount required to create a new account
        console.log("api_relay.consts.balances.existentialDeposit : ",api_relay.consts.balances.existentialDeposit.toNumber());            // The amount required to create a new account

        setParachainSpecs({ api: api_para, chainID: undefined, blockNumber: undefined });
        setRelaySpecs({ api: api_relay, chainID: undefined, blockNumber: undefined });

        //TEMPORARY ACCOUNT WE USE TO BE REPLACED BY POLKADTO EXTENSION WALLET
        const ADDR1 = '5FP8MMBmPdBCMgG5AspTHVNWXXSEoR4vgJwSrehUj1qJAKxN';     //Alecia
        const ADDR2 = '5EbenGjMnTsyMuDVoSbMfXidaCTrtqfLya1Khnb8zXCkD6LJ';     //A1


        //EVM
        const { provider, wallet, account } = await setup("moonbaseAlpha", true);
        setEvm_Api_State(true);
        setAccountList([account]);

        const balanceAccount_BigNumber = await provider.getBalance(account);
        const balanceAccount =  ethers.utils.formatUnits( balanceAccount_BigNumber, 18 );
        setAccountBalance(balanceAccount);
        const walletBalance = await wallet.getBalance(); // { BigNumber: "42" }
        const walletChainID = await wallet.getChainId();   
        const gasPrice = await wallet.getGasPrice(); // 1000000000 Returns the current gas price. BigNumber   
        const nonce = await wallet.getTransactionCount(); //NONCE 
      
        console.log(`APP.JS  ***> account:${account} balanceAccount: ${balanceAccount} Wallet address that signs transactions: ${await wallet.getAddress()} walletBalance: ${ ethers.utils.formatUnits( walletBalance, 18 )} walletChainID: ${walletChainID} nonce:${nonce}`);
        console.log(`APP.JS  ***>  (await provider.getNetwork()).chainId: ${(await provider.getNetwork()).chainId} getBlockNumber: ${await provider.getBlockNumber()} gasPrice: ${gasPrice.toString()}`);
        
        const _setupSpecs = { wallet, provider, pair:"", connected: "Connected to MoonRiverbase", walletAddress: await wallet.getAddress() };
        setSetupSpecs(_setupSpecs);
        setBlockChainSpecs({ networkName: "MoonRiver", chainID: (await provider.getNetwork()).chainId, blockNumber: await provider.getBlockNumber(), gasPrice: (await provider.getGasPrice()).toString() });
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
      //TODO SUBSCRIBE TO ACCOUNT TO TRACK BALANCE AN TXS
      const unsubHeads = await api.rpc.chain.subscribeNewHeads((lastHeader) => {
          console.log(`${chain}: last block #${lastHeader.number} has hash ${lastHeader.hash}`);
          setBlockHeader({number: `${lastHeader.number}`, hash: `lastHeader.hash`, size: "header.size"});


          if (++count > 10) {
              unsubHeads();
          }
      });
  }

  if (parachainSpecs.api)
  {
    // parachain(parachainSpecs.api).catch((er) => { console.log(`APP.JS parachain Error: `,er);  });
  }
  else console.log(`App.js => setupSpecs.provider is undefined`);

  }, [parachainSpecs.api]);  
  //#endregion  parachain events setup


  return (
    <div className="App" style={{backgroundColor:"#343d46", height:"100vh"}}>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>

        <div className="col-xl-3 col-xxl-12" style={{float:"left", backgroundColor:"#343d46"}}>
          S
				</div>
        <div className="col-xl-6 col-xxl-12" style={{float:"left",  }}>
						<QuickTransfer setupSpecs={setupSpecs} relaySpecs={relaySpecs} portfolio={portfolio} blockHeader={blockHeader}/>
				</div>
        <div className="col-xl-3 col-xxl-12">
          S
				</div>
    </div>
  );
}

export default App;
