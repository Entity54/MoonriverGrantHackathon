import { ApiPromise, WsProvider, Keyring }     from '@polkadot/api';
import { stringToU8a, u8aToHex, hexToU8a, BN } from '@polkadot/util'; // Some helper functions used here


import { ethers } from 'ethers';  
import detectEthereumProvider from '@metamask/detect-provider'; // FOR METAMASK TO BE USED This function detects most providers injected at window.ethereum

import IERC20_raw from './Abis/IERC20';  
import Xtokens_raw from './Abis/Xtokens';       
const XtokensAddress    = "0x0000000000000000000000000000000000000804";    

let wallet;
let Xtokens;
const setWallet = (_wallet=null) => { 
  if (_wallet) {
      wallet = _wallet;
      console.log("New wallet : ",wallet);
      Xtokens     =  new ethers.Contract( XtokensAddress, Xtokens_raw.abi, wallet);
  }
}


//***** Get balance for token //*****
const getBalance = async (tokenAddress, client) => {
      const erc20 =  new ethers.Contract( tokenAddress, IERC20_raw.abi, wallet);
      const balanceWEI = await erc20.balanceOf(client);
      const balance = ethers.utils.formatUnits(balanceWEI,12);
      console.log(`Balnance of ${client} for ${tokenAddress} is: `,balance);
      return balance;
};

//***** Check allowance for token //*****
const checkAllowanceOfTokentoAddress = async (wallet, tokenAddress, client, spender) => {
    const erc20 =  new ethers.Contract( tokenAddress, IERC20_raw.abi, wallet);
    let allowanceWEI = await erc20.allowance(client, spender);
    const allowance = ethers.utils.formatUnits(allowanceWEI,12);
    console.log(`allowance: `,allowance);
    return allowance;
};

//*****  Approve  //*****
const approve = async (tokenAddress, spender, amountin_unitsEth="0.001") => {  
    const erc20 =  new ethers.Contract( tokenAddress, IERC20_raw.abi, wallet);

    const amountWEI =  ethers.BigNumber.from( ethers.utils.parseUnits(amountin_unitsEth,12) );
    console.log(`Client wants to transfer ${amountWEI} Tokens WEI. NEED TO APPROVE TRANSFER OF THIS TOKEN FROM CLIENT ACCOUNT TO SPENDER`);

    return new Promise (async (resolve,reject) => {
        const tx2 = await erc20.approve(spender, amountWEI );
        tx2.wait().then( async reslveMsg => {
             console.log(`tx2 fro approval is mined resolveMsg : `,reslveMsg);
        });

    })
};

//***** Simple Transfer //*****
const simpleERC20Transfer = async (wallet, tokenAddress, receipient, amountin_unitsEth="0.001") => {
  const erc20 =  new ethers.Contract( tokenAddress, IERC20_raw.abi, wallet);

  const amountWEI =  ethers.BigNumber.from( ethers.utils.parseUnits(amountin_unitsEth,12) );
  const tx3 = await erc20.transfer(receipient, amountWEI);
  tx3.wait().then( async reslveMsg => {
    console.log(`tx3 for transfer is mined resolveMsg : `,reslveMsg);
   });
};


//TODO INSTALL POLKADTO EXTENSION TO REPLACE HARD CODED ACCOUNTS
const getAccountIdtoHex = (accountKeyrin) => {
  const keyring = new Keyring({ type: 'sr25519' });
  const PHRASE = 'casual subject usage friend elder novel brick prosper order protect senior hunt';    //Alecia
  const Alecia = keyring.addFromUri(PHRASE);
  console.log(`${Alecia.meta.name}: has address ${Alecia.address} with publicKey [${Alecia.publicKey}]`);

  const hexvalue = u8aToHex(Alecia.publicKey);
  console.log("********* *** hexvalue: ",hexvalue);  //0x92c192cbc87592da162e2e57693382c084eb6b13cc2c8aa47a7515b27b5ccc0f
  // 5FP8MMBmPdBCMgG5AspTHVNWXXSEoR4vgJwSrehUj1qJAKxN

  return hexvalue;
}

const transfer_xcKSMtoKSM = async (_amount, destinationRelayAccount) => {
  console.log("GET READY for xcKSM to KSM action");
  
  const relayTokenPrecompileAddress = "0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080";  //xcUNIT
  
  const amount = (new BN(_amount)).mul(mantissa).toString();

  const weight = 4000000000;

  getAccountIdtoHex()
  const destination = [1,["0x0192c192cbc87592da162e2e57693382c084eb6b13cc2c8aa47a7515b27b5ccc0f00"]];
  //[1,["0x01  from 0x92c192cbc87592da162e2e57693382c084eb6b13cc2c8aa47a7515b27b5ccc0f remove 0x add 00 for last option"]]

  const tx4 = await Xtokens.transfer(relayTokenPrecompileAddress, amount, destination , weight);
  tx4.wait().then( async reslveMsg => {
    console.log(`tx4 for transfering xcKSM to KSM is mined resolveMsg : `,reslveMsg);
   });

}


//***** Setup Substrate Chain //*****
const setup_SubstrateChain = async (wsURL = 'MoonbaseAlpha') => {
    console.log("setup_Moonbeam is RUN");
  
    let WS_URL;
    if (wsURL === 'MoonbaseAlpha') WS_URL = 'wss://wss.api.moonbase.moonbeam.network'; 
    else if (wsURL === 'Moonriver') WS_URL = 'wss://wss.moonriver.moonbeam.network'; 
    else if (wsURL === 'MoonbaseRelayTestnet') WS_URL = 'wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network'; 
    else if (wsURL === 'Polkadot') WS_URL = 'wss://rpc.polkadot.io'; 
    else if (wsURL === 'Kusama') WS_URL = 'wss://kusama-rpc.polkadot.io'; 

    const wsProvider = new WsProvider(WS_URL);
  
    // Wait for Provider
    const api = await ApiPromise.create({ provider: wsProvider });
    await api.isReady;
    console.log(`api => : `,api);
    return {api};
};

//***** Transfer from Relay to Parachain //*****
const mantissa = new BN(1000000000000);
const transferFromRelayToParachain = async (apiRelay, parachain=1000, EVMaccount="0x1270dbdE6Fa704f9363e47Dd05493D5dae329A4d", amount="1") => {
  // parachain : 1000 for Moonbasealpha and 2025 for Moonriver

  const ADDR1 = '5FP8MMBmPdBCMgG5AspTHVNWXXSEoR4vgJwSrehUj1qJAKxN';     //Alecia
  const ADDR2 = '5EbenGjMnTsyMuDVoSbMfXidaCTrtqfLya1Khnb8zXCkD6LJ';     //A1
  
  const now = await apiRelay.query.timestamp.now();   // Retrieve the last timestamp
  const { nonce, data: balance } = await apiRelay.query.system.account(ADDR1);   // Retrieve the account balance & nonce via the system module
  console.log(`${now}: balance of ${balance.free} and a nonce of ${nonce}`);

  const keyring = new Keyring({ type: 'sr25519' });
  const PHRASE = 'casual subject usage friend elder novel brick prosper order protect senior hunt';    //Alecia
  const Alecia = keyring.addFromUri(PHRASE);

  const txRealytoParachain = await apiRelay.tx.xcmPallet
  .limitedReserveTransferAssets(
      { V1: {parents: new BN(0), interior: { X1: { Parachain: parachain } } } },
      { V1: {parents: new BN(0), interior: { X1: { AccountKey20: { network: "Any", key: EVMaccount } } } } },
      { V1: [ 
                { 
                    id:  { Concrete: { parents: new BN(0), interior: "Here"} },
                    fun: { Fungible: (new BN(amount)).mul(mantissa) }
                }
            ] 
      },
     0, 
    {Limited: new BN(1000000000)}

  )      //limitedReserveTransferAssets(dest, beneficiary, assets, feeAssetItem, weightLimit)       
  .signAndSend(Alecia, ({ status, events, dispatchError }) => {
   
      if (dispatchError) {
        if (dispatchError.isModule) {
          // for module errors, we have the section indexed, lookup
          const decoded = apiRelay.registry.findMetaError(dispatchError.asModule);
          const { docs, name, section } = decoded;

          console.log(`${section}.${name}: ${docs.join(' ')}`);
        } else {
          // Other, CannotLookup, BadOrigin, no extra info
          console.log(dispatchError.toString());
        }
      }
  });
  console.log(`Submitted xcmPallet transaction with hash ${txRealytoParachain}`);   // Show the hash



}

//***** Transfer from Relay to Realy //*****
const tranferFromRelayToRelay = async (apiRelay, recipient='5EbenGjMnTsyMuDVoSbMfXidaCTrtqfLya1Khnb8zXCkD6LJ', _amount="1") => {

      const ADDR1 = '5FP8MMBmPdBCMgG5AspTHVNWXXSEoR4vgJwSrehUj1qJAKxN';     //Alecia
      const ADDR2 = '5EbenGjMnTsyMuDVoSbMfXidaCTrtqfLya1Khnb8zXCkD6LJ';     //A1
  
      const keyring = new Keyring({ type: 'sr25519' });
      const PHRASE = 'casual subject usage friend elder novel brick prosper order protect senior hunt';    //Alecia
      const Alecia = keyring.addFromUri(PHRASE);
      
      const amount = (new BN(_amount)).mul(mantissa);
      const unsub_Tx = apiRelay.tx.balances
      .transfer(recipient, amount)
      .signAndSend(Alecia, ({ status, events, dispatchError }) => {
        
        if (dispatchError) {
          if (dispatchError.isModule) {
            
            const decoded = apiRelay.registry.findMetaError(dispatchError.asModule);
            const { docs, name, section } = decoded;

            console.log(`${section}.${name}: ${docs.join(' ')}`);
          } else {
            // Other, CannotLookup, BadOrigin, no extra info
            console.log(dispatchError.toString());
          }
        }
      });

}


//For MoobaseAlpha use Pablo Monn Address 0x1270dbdE6Fa704f9363e47Dd05493D5dae329A4d
//***** Setup EVM Chain //*****
const setup = async (network = "moonbaseAlpha", useMetaMask=true) => {

      let provider, wallet, wss_provider=null, mm_acounts;
      //#region SETUP PROVIDER AND WALLET WITH METAMASK 
      if (useMetaMask)
      {
        const _provider = await detectEthereumProvider();
        if (_provider) {
          provider = new ethers.providers.Web3Provider(window.ethereum, "any");   
          provider.on("network", (newNetwork, oldNetwork) => {
              if (oldNetwork) {
                  window.location.reload();
              }
          });

          mm_acounts = await _provider.request({ method: 'eth_requestAccounts' });
          console.log(`MetaMask Accounts: `,mm_acounts);
          const account = mm_acounts[0];
          const mm_chainId = await _provider.request({ method: 'eth_chainId' });
          console.log(`MetaMask mm_chainId: `,mm_chainId);
        
          wallet = provider.getSigner(); 

          console.log("New MetaMask wallet signer : ",wallet);
          setWallet(wallet);

          return { provider, wallet, account,  };
        } 
        else { 
          console.log('Please install MetaMask!'); 
          return { provider: null, wallet: null, account: null };
        }
      }
      //#endregion SETUP PROVIDER AND WALLET WITH METAMASK  
}

export {
          setWallet,
          wallet,
          setup, 
          setup_SubstrateChain, 
          transferFromRelayToParachain, 
          tranferFromRelayToRelay,
          simpleERC20Transfer,
          getBalance,
          checkAllowanceOfTokentoAddress,
          approve,
          getAccountIdtoHex,
          transfer_xcKSMtoKSM
       };