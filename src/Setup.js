import { ApiPromise, WsProvider, Keyring }     from '@polkadot/api';
import { numberToHex, u8aToString, stringToU8a, u8aToHex, hexToU8a, BN } from '@polkadot/util'; // Some helper functions used here
 
import { ethers } from 'ethers';  
import detectEthereumProvider from '@metamask/detect-provider'; // FOR METAMASK TO BE USED This function detects most providers injected at window.ethereum

import IERC20_raw from './Abis/IERC20';  
import Xtokens_raw from './Abis/Xtokens';       
const XtokensAddress    = "0x0000000000000000000000000000000000000804";    
const mantissa12 = new BN(1000000000000);
const mantissa10 = new BN('10000000000');


let wallet;
let Xtokens;
const setWallet = (_wallet=null) => { 
  if (_wallet) {
      wallet = _wallet;
      console.log("New wallet : ",wallet);
      Xtokens     =  new ethers.Contract( XtokensAddress, Xtokens_raw.abi, wallet);
  }
}

let polkadotInjector = null, polkadotInjectorAddress=null;
const setPolkadotInjector = (injector, injectorAddress) => { 
    polkadotInjector = injector;
    polkadotInjectorAddress = injectorAddress;
    console.log(`Setup New Polkadot Signer/Injector polkadotInjectorAddress: ${polkadotInjectorAddress} polkadotInjector: `,polkadotInjector)
}



//#region ***** Get balance for ERC20 token //*****
const getBalance = async (tokenAddress, client) => {
      const erc20 =  new ethers.Contract( tokenAddress, IERC20_raw.abi, wallet);
      const balanceWEI = await erc20.balanceOf(client);
      const balance = ethers.utils.formatUnits(balanceWEI,12);
      console.log(`Balnance of ${client} for ${tokenAddress} is: `,balance);
      return balance;
};
//#endregion

//#region ***** Check allowance for ERC20 token //*****
const checkAllowanceOfTokentoAddress = async (wallet, tokenAddress, client, spender) => {
    const erc20 =  new ethers.Contract( tokenAddress, IERC20_raw.abi, wallet);
    let allowanceWEI = await erc20.allowance(client, spender);
    const allowance = ethers.utils.formatUnits(allowanceWEI,12);
    console.log(`allowance: `,allowance);
    return allowance;
};
//#endregion

//#region *****  Approve ERC20  //*****
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
//#endregion

//#region ***** Simple ERC20 Transfer //*****
const simpleERC20Transfer = async (wallet, tokenAddress, receipient, amountin_unitsEth="0.001") => {
  const erc20 =  new ethers.Contract( tokenAddress, IERC20_raw.abi, wallet);

  const amountWEI =  ethers.BigNumber.from( ethers.utils.parseUnits(amountin_unitsEth,12) );
  const tx3 = await erc20.transfer(receipient, amountWEI);
  tx3.wait().then( async reslveMsg => {
    console.log(`tx3 for transfer is mined resolveMsg : `,reslveMsg);
   });
};
//#endregion

//TODO INSTALL POLKADTO EXTENSION TO REPLACE HARD CODED ACCOUNTS

//#region getAccountIdtoHex
const getAccountIdtoHex = (accountI32="") => {
  const keyring = new Keyring({ type: 'sr25519' });
  // const PHRASE = 'casual subject usage friend elder novel brick prosper order protect senior hunt';    //Alecia
  // const Alecia = keyring.addFromUri(PHRASE);

  // const hexvalue = u8aToHex(Alecia.publicKey);
  // console.log("********* *** hexvalue: ",hexvalue);  //0x92c192cbc87592da162e2e57693382c084eb6b13cc2c8aa47a7515b27b5ccc0f // 5FP8MMBmPdBCMgG5AspTHVNWXXSEoR4vgJwSrehUj1qJAKxN
  // const publicKey_u8_Alecia = hexToU8a("0x92c192cbc87592da162e2e57693382c084eb6b13cc2c8aa47a7515b27b5ccc0f");
  // const kusamaAddress = keyring.encodeAddress(publicKey_u8_Alecia, 42);
  // const publicKeyU8_Alecia = keyring.decodeAddress('5FP8MMBmPdBCMgG5AspTHVNWXXSEoR4vgJwSrehUj1qJAKxN')
  // console.log(`Alecia ${Alecia.meta.name}: has address ${Alecia.address} with publicKey [${Alecia.publicKey}]`);
  // console.log(`For hex 0x92c192cbc87592da162e2e57693382c084eb6b13cc2c8aa47a7515b27b5ccc0f publicKey is ${hexToU8a("0x92c192cbc87592da162e2e57693382c084eb6b13cc2c8aa47a7515b27b5ccc0f")} kusamaAddress: ${kusamaAddress} and again publicKey From any address e.g. Kusama [${keyring.decodeAddress('5FP8MMBmPdBCMgG5AspTHVNWXXSEoR4vgJwSrehUj1qJAKxN')}]`);

  const publicKeyU8 = keyring.decodeAddress(accountI32)
  const hexvalue = u8aToHex(publicKeyU8);
  console.log(`getAccountIdtoHex Received accountI32: ${accountI32} publicKeyU8:${publicKeyU8} hexvalue: ${hexvalue}`);

  return hexvalue;
}
//#endregion

//#region transfer_multiasset
const transfer_multiasset = async (assetStr, parachainID, _amount, destinationAccount) => {
  let assetGeneralKey;
  if (assetStr.toLowerCase() ==="xckar") assetGeneralKey="0080";
  else if (assetStr.toLowerCase()==="xcausd") assetGeneralKey="0081"

  // let parachainHex
  // if (parachainID==="2000") parachainHex="000007D0";        //KARURAAlphanet
  // else if (parachainID==="2023") parachainHex="000007E7";   //MOONRIVER
  const parachainHex = `0000${numberToHex(Number(parachainID)).substring(2)}`;
  console.log(`Transfer_multiasset assetStr:${assetStr} assetGeneralKey:${assetGeneralKey} parachainID:${parachainID} parachainHex:${parachainHex}`);
  
  //token assetMultilocation  const assetM = [`0x00${"000007D0"}` ,`0x06${"0080"}`];
  const assetM = [`0x00${parachainHex}` ,`0x06${assetGeneralKey}`];
  const assetMultilocation =[1,assetM];
  console.log("Transfer_multiasset assetMultilocation: ",assetMultilocation);

  //amount
  // const amount = (new BN( Number("0.123456789100") * mantissa)).toString();
  const amount = (new BN( Number(_amount) * mantissa12)).toString();

  //multilocation
  // const hexvalue = getAccountIdtoHex("qVA946xk9bGQ8A4m4EP3q1A1LJwvyi3QBzTRsAr68VvqeEo")
  const hexvalue = getAccountIdtoHex(destinationAccount)
  const nakedhexvalue = hexvalue.substring(2);
  // const multilocation = [`0x00${"000007DO"}`,`0x01${nakedhexvalue}00`];
  const multilocation = [`0x00${parachainHex}`,`0x01${nakedhexvalue}00`];
  const destination = [1,multilocation];
  console.log(`Transfer_multiasset amount: ${amount} nakedhexvalue: ${nakedhexvalue} Multilocation: `,multilocation,` should be 0x0160c4d758184d11761943be32f71ae877974e0fa4cad523e1c3ba6c5ed340545c00 for qVA946xk9bGQ8A4m4EP3q1A1LJwvyi3QBzTRsAr68VvqeEo   destination: `,destination);

  //fees
  const weight = 4000000000;
  
  const tx4 = await Xtokens.transfer_multiasset(assetMultilocation, amount, destination , weight);
  tx4.wait().then( async reslveMsg => {
    console.log(`tx4 for transfering xcKAR to KAR is mined resolveMsg : `,reslveMsg);
    // tx4 for transfering xcKAR to KAR is mined resolveMsg :  {to: '0x0000000000000000000000000000000000000804', from: '0x8731732996d815E34DA3eda6f13277a919b3d0d8', contractAddress: null, transactionIndex: 0, gasUsed: BigNumber,
    // blockNumber: 2157608, blockHash: "0x0d613dd91986ed1fd11ad7d5dc0d709ad8f2a65f3f6b348324482c04324a651c"  
    // transactionHash: "0x85d6db8e707d8c102e02336db2bb396133be56913fcad63947b6c00f59e26c5b" …}
    console.log(`TX4===> transactionHash: ${reslveMsg.transactionHash} from: ${reslveMsg.from} to: ${reslveMsg.to} transactionHash: ${reslveMsg.transactionHash} gasUsed: ${reslveMsg.gasUsed} blockNumber: ${reslveMsg.blockNumber}`);
  });
  //SAMPLE const tx4 = await Xtokens.transfer_multiasset([1,[`0x00${"000007D0"}` ,`0x06${"0080"}`]],amount,[1,["0x00000007D0","0x0160c4d758184d11761943be32f71ae877974e0fa4cad523e1c3ba6c5ed340545c00"]] ,weight;
}
//#endregion 

//#region transfer_xcKSMtoKSM
const transfer_xcKSMtoKSM = async (_amount, destinationRelayAccount) => {
  console.log("GET READY for xcKSM to KSM action");

  //#region This will be removedonce linked properly to the right button
  console.log("====> CALLING transfer_multiasset");
  // transfer_multiasset("xcKAR", "2000", _amount, destinationRelayAccount);
  //transfer_multiasset("xcAUSD", "2000", _amount, destinationRelayAccount);

  // const weight = 4000000000;
  // const amount = (new BN( Number(_amount) * mantissa12)).toString();
  // const tx4 = await Xtokens.transfer_multiasset([1,['0x00000007D0', '0x060080']],amount,[1,["0x00000007D0","0x0160c4d758184d11761943be32f71ae877974e0fa4cad523e1c3ba6c5ed340545c00"]],weight);

  // tx4.wait().then( async reslveMsg => {
  //   console.log(`tx4 for transfering xcKAR to KAR is mined resolveMsg : `,reslveMsg);
  //  });
  //#endregion This will be removedonce linked properly to the right button

  //Moonriver xcTokens Precompiles Addresses 
  const relayTokenPrecompileAddress = "0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080";  //xcUNIT

  //multilocation
  const hexvalue = getAccountIdtoHex(destinationRelayAccount)
  const nakedhexvalue = hexvalue.substring(2);
  const multilocation = `0x01${nakedhexvalue}00`;
  
  //amount
  const amount = (new BN(Number(_amount) * mantissa12)).toString();
  console.log(`===>>>>> amount: ${amount} _amount: ${_amount} nakedhexvalue: ${nakedhexvalue} Multilocation: ${multilocation} should be 0x0192c192cbc87592da162e2e57693382c084eb6b13cc2c8aa47a7515b27b5ccc0f00`);

  //fees
  const weight = 4000000000;
  
  const destination = [1,[multilocation]];
  // const destination = [1,["0x0192c192cbc87592da162e2e57693382c084eb6b13cc2c8aa47a7515b27b5ccc0f00"]];
  //[1,["0x01  from 0x92c192cbc87592da162e2e57693382c084eb6b13cc2c8aa47a7515b27b5ccc0f remove 0x add 00 for last option"]]

  const tx4 = await Xtokens.transfer(relayTokenPrecompileAddress, amount, destination , weight);
  tx4.wait().then( async reslveMsg => {
    console.log(`tx4 for transfering xcKSM to KSM is mined resolveMsg : `,reslveMsg);
    console.log(`TX4===> transactionHash: ${reslveMsg.transactionHash} from: ${reslveMsg.from} to: ${reslveMsg.to} transactionHash: ${reslveMsg.transactionHash} gasUsed: ${reslveMsg.gasUsed} blockNumber: ${reslveMsg.blockNumber}`);
  });
  //Sample "0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080",100000000000,[1,["0x0192c192cbc87592da162e2e57693382c084eb6b13cc2c8aa47a7515b27b5ccc0f00"]],4000000000
}
//#endregion


//#region ***** Transfer Asset from Parachain to Parachain //*****   0x1270dbdE6Fa704f9363e47Dd05493D5dae329A4d is Pablo Moon Account
const transfer_Asset_FromParachainToParachain = async (api, _token="KUSD", originParachain=2000, parachain=1000, EVMaccount="0x1270dbdE6Fa704f9363e47Dd05493D5dae329A4d", amount="1") => {
  // parachain : 1000 for Moonbasealpha and 2023 for Moonriver   
  //2000 for Karura and KaruraAlphanet

  if (!polkadotInjector || !polkadotInjectorAddress) {
    console.log(`transfer_Currency_FromParachainToParachain polkadotInjector and/or polkadotInjectorAddress are null. Cannot proceed!!!`)
  }

  let general_key;
  const token = _token.toLowerCase();
  if (token.toLowerCase()==="kusd" || token.toLowerCase()==="ausd") general_key="0x0081";  
  
  const now = await api.query.timestamp.now();   // Retrieve the last timestamp
  // const { nonce, data: balance } = await api.query.system.account(ADDR1);   // Retrieve the account balance & nonce via the system module
  // console.log(`${now}: balance of ${balance.free} and a nonce of ${nonce}`);
  // const {free: free1 , reserved: reserved1, frozen: frozen1} = await api.query.tokens.accounts(ADDR1, {Token: token}); 
  const {free: free1 , reserved: reserved1, frozen: frozen1} = await api.query.tokens.accounts(polkadotInjectorAddress, {Token: token}); 

  console.log(`KUSD=> ${now}: balance free: ${free1} reserved: ${reserved1} frozen: ${frozen1}`);

  const txAssetParachainToParachain = await api.tx.xTokens
  .transferMultiasset(
      { V1: 
                { 
                    id:  { 
                           Concrete: { 
                                      parents: 1, 
                                      interior: 
                                                {
                                                  x2: [
                                                        { 
                                                            Parachain: originParachain,
                                                        },
                                                        {
                                                            Generalkey: general_key  
                                                        }
                                                      ]
                                                }
                                      } 
                          },
                    fun: { Fungible: (new BN(amount * mantissa12)) }
                }
      },
      { V1: {
                      parents: 1,
                      interior: {
                          x2: [
                                { 
                                  Parachain: parachain,
                                },
                                {
                                  accountKey20: {
                                                  network: "Any",
                                                  key: EVMaccount
                                                }
                                }
                              ]
                      }
              } 
      },
      (new BN(1000000000) )
  )      //transfer(cuurencyId, amount, dest, weight)  
  // .signAndSend(Alecia, async ({ status, events=[], dispatchError }) => {
  .signAndSend(polkadotInjectorAddress, { signer: polkadotInjector.signer }, async ({ status, events=[], dispatchError }) => {
      // console.log(`Current status: `,status,` Current status is ${status.type}`);
      // events.forEach(({ phase, event: { data, method, section } }) => {
      //   console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
      // });

      let errorInfo;
      if (dispatchError) {
        if (dispatchError.isModule) {
          // for module errors, we have the section indexed, lookup
          const decoded = api.registry.findMetaError(dispatchError.asModule);
          const { docs, name, section } = decoded;
          errorInfo = `${section}.${name}`;
          console.log(`txAssetParachainToParachain dispatchError1 ${section}.${name}: ${docs.join(' ')}`);
        } else {
          // Other, CannotLookup, BadOrigin, no extra info
          errorInfo = dispatchError.toString();
          console.log(`txAssetParachainToParachain dispatchError2: `,dispatchError.toString());
        }
      }
      else console.log(`txAssetParachainToParachain ***** NO DISAPTCHEERROR *****: `);

      if (status.isFinalized) {
        let txResult="", extrinsicBlockHash = status.asFinalized, extrinsicIndexinBlock;
        // Loop through all events
        events.forEach(({ phase, event: { data, method, section } }) => {
            extrinsicIndexinBlock = phase.asApplyExtrinsic;
            // console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
            if (method==="ExtrinsicSuccess") txResult +=` Extrisnic Succeeded with Fees: ${data[0].weight}`;
            else if (method==="ExtrinsicFailed") txResult +=" Extrisnic Failed";
            else if (method==="Withdrawn"  && section==="currencies")  txResult +=` Withdrawn ${JSON.parse(data[0]).token} from ${data[1]} ${_token}:${ethers.utils.formatUnits(ethers.BigNumber.from(`${data[2]}`),12)}`;
            else if (method==="Deposited"  && section==="currencies")  txResult +=` Deposited ${JSON.parse(data[0]).token} to ${data[1]}  ${_token}:${ethers.utils.formatUnits(ethers.BigNumber.from(`${data[2]}`),12)}`;

            else if (method==="Deposit" && section==="treasury")   txResult +=` Deposit to treasury ${data[0]} KSM:${ethers.utils.formatUnits(ethers.BigNumber.from(`${data[0]}`),12)}`;
            else if (method==="XcmpMessageSent" && section==="xcmpQueue")   txResult +=` XcmpMessageSent ${data[0]}`;
        });
        
        const signedBlock = await api.rpc.chain.getBlock(extrinsicBlockHash);
        signedBlock.block.extrinsics.forEach(({ hash, method: { method, section } }, index) => {
          // console.log(`signedBlock.block.extrinsics.forEach ===> ${section}.${method}:: index:${index} hash.toString(): `,hash.toString(),`    u8aToHex(hash): `,u8aToHex(hash), `  hash: `,hash);
          if (index===Number(extrinsicIndexinBlock))
          {
            console.log(`Extrinsic hash: ${hash.toString()} finalised at Block Hash: ${extrinsicBlockHash} Result: `,txResult);
            // Extrinsic hash: 0x3ccae167d34a500e5ceb7bb94b158291125ca7dcaaf954b1936f3916afc4593c finalised at Block Hash: 0x04a036c14165838cf41b39b840c36a6a8a8b0d65862adf1519fe514ad321f731 Result:   Withdrawn KUSD from rchZcn4KjSV3gWJNmueSrL4Z2aEwBfEGL6ywQqEywcibETm KUSD:0.1 Deposited KUSD to qubt4UfkxtejFvWGmkRjwXFaPmdhB2i4s65Nmno2Gg9DKTH  KUSD:0.1 XcmpMessageSent 0xd5a5b46388c2a10a6e539db04deb46541d6ee6aeaa86502269520632ba54eda0 Deposit to treasury 2685294445 KSM:0.002685294445 Extrisnic Succeeded with Fees: 500000000
          }
        });

        txAssetParachainToParachain();
            
      }
      
  });
  console.log(`Submitted xTokens transaction with txAssetParachainToParachain`);    

}
//#endregion 


//#region ***** Transfer Currency from Parachain to Parachain //*****   0x1270dbdE6Fa704f9363e47Dd05493D5dae329A4d is Pablo Moon Account
const transfer_Currency_FromParachainToParachain = async (api, parachain=1000, EVMaccount="0x1270dbdE6Fa704f9363e47Dd05493D5dae329A4d", amount="1") => {
  // parachain : 1000 for Moonbasealpha and 2023 for Moonriver
  
  if (!polkadotInjector || !polkadotInjectorAddress) {
    console.log(`transfer_Currency_FromParachainToParachain polkadotInjector and/or polkadotInjectorAddress are null. Cannot proceed!!!`)
  }

  const now = await api.query.timestamp.now();   // Retrieve the last timestamp
  // const { nonce, data: balance } = await api.query.system.account(ADDR1);   // Retrieve the account balance & nonce via the system module

  const { nonce, data: balance } = await api.query.system.account(polkadotInjectorAddress);   // Retrieve the account balance & nonce via the system module

  console.log(`${now}: balance of ${balance.free} and a nonce of ${nonce}`);

  const txCurrencyParachainToParachain = await api.tx.xTokens
  .transfer(
      { Token: "kar" },
      (new BN(amount * mantissa12)),
      { V1: {
                      parents: new BN(1),
                      interior: {
                          x2: [
                                { 
                                  Parachain: parachain,
                                },
                                {
                                  accountKey20: {
                                                  network: "Any",
                                                  key: EVMaccount
                                                }
                                }
                              ]
                      }
              } 
      },
      (new BN(1000000000) )
  )      //transfer(cuurencyId, amount, dest, weight)  
  // .signAndSend(Alecia, async ({ status, events=[], dispatchError }) => {
  .signAndSend(polkadotInjectorAddress, { signer: polkadotInjector.signer }, async ({ status, events=[], dispatchError }) => {

      // console.log(`Current status: `,status,` Current status is ${status.type}`);
      let errorInfo;
      if (dispatchError) {
        if (dispatchError.isModule) {
          // for module errors, we have the section indexed, lookup
          const decoded = api.registry.findMetaError(dispatchError.asModule);
          const { docs, name, section } = decoded;
          errorInfo = `${section}.${name}`;
          console.log(`txCurrencyParachainToParachain dispatchError1 ${section}.${name}: ${docs.join(' ')}`);
        } else {
          // Other, CannotLookup, BadOrigin, no extra info
          errorInfo = dispatchError.toString();
          console.log(`txCurrencyParachainToParachain dispatchError2: `,dispatchError.toString());
        }
      }
      else console.log(`txCurrencyParachainToParachain ***** NO DISAPTCHEERROR *****: `);

      if (status.isFinalized) {
        let txResult="", extrinsicBlockHash = status.asFinalized, extrinsicIndexinBlock;
        // Loop through all events
        events.forEach(({ phase, event: { data, method, section } }) => {
            extrinsicIndexinBlock = phase.asApplyExtrinsic;
            // console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
            if (method==="ExtrinsicSuccess") txResult +=` Extrisnic Succeeded with Fees: ${data[0].weight}`;
            else if (method==="ExtrinsicFailed") txResult +=" Extrisnic Failed";
            else if (method==="Withdrawn"  && section==="currencies")  txResult +=` Withdrawn ${JSON.parse(data[0]).token} from ${data[1]} KSM:${ethers.utils.formatUnits(ethers.BigNumber.from(`${data[2]}`),12)}`;
            else if (method==="Deposit" && section==="treasury")   txResult +=` Deposit to treasury ${data[0]} KSM:${ethers.utils.formatUnits(ethers.BigNumber.from(`${data[0]}`),12)}`;
            else if (method==="XcmpMessageSent" && section==="xcmpQueue")   txResult +=` XcmpMessageSent ${data[0]}`;
        });
        
        const signedBlock = await api.rpc.chain.getBlock(extrinsicBlockHash);
        signedBlock.block.extrinsics.forEach(({ hash, method: { method, section } }, index) => {
          // console.log(`signedBlock.block.extrinsics.forEach ===> ${section}.${method}:: index:${index} hash.toString(): `,hash.toString(),`    u8aToHex(hash): `,u8aToHex(hash), `  hash: `,hash);
          if (index===Number(extrinsicIndexinBlock))
          {
            console.log(`Extrinsic hash: ${hash.toString()} finalised at Block Hash: ${extrinsicBlockHash} Result: `,txResult);
          }
        });

        txCurrencyParachainToParachain();
            
      }
      
  });
  console.log(`Submitted xcmPallet transaction with txCurrencyParachainToParachain`);    

}
//#endregion 


//#region ***** Transfer from Relay to Parachain //*****   0x1270dbdE6Fa704f9363e47Dd05493D5dae329A4d is Pablo Moon Account
const transferFromRelayToParachain = async (apiRelay, parachain=1000, EVMaccount="0x1270dbdE6Fa704f9363e47Dd05493D5dae329A4d", amount="1") => {
  // parachain : 1000 for Moonbasealpha and 2023 for Moonriver

  if (!polkadotInjector || !polkadotInjectorAddress) {
    console.log(`transfer_Currency_FromParachainToParachain polkadotInjector and/or polkadotInjectorAddress are null. Cannot proceed!!!`)
  }
  
  const now = await apiRelay.query.timestamp.now();   // Retrieve the last timestamp
  // const { nonce, data: balance } = await apiRelay.query.system.account(ADDR1);   // Retrieve the account balance & nonce via the system module

  const { nonce, data: balance } = await apiRelay.query.system.account(polkadotInjectorAddress);   // Retrieve the account balance & nonce via the system module

  console.log(`${now}: balance of ${balance.free} and a nonce of ${nonce}`);

  const txRelaytoParachain = await apiRelay.tx.xcmPallet
  .limitedReserveTransferAssets(
      { V1: {parents: new BN(0), interior: { X1: { Parachain: parachain } } } },
      { V1: {parents: new BN(0), interior: { X1: { AccountKey20: { network: "Any", key: EVMaccount } } } } },
      { V1: [ 
                { 
                    id:  { Concrete: { parents: new BN(0), interior: "Here"} },
                    fun: { Fungible: (new BN(amount * mantissa12)) }
                }
            ] 
      },
     0, 
    {Limited: new BN(1000000000)}

  )      //limitedReserveTransferAssets(dest, beneficiary, assets, feeAssetItem, weightLimit)   
  // .signAndSend(Alecia, async ({ status, events=[], dispatchError }) => {
  .signAndSend(polkadotInjectorAddress, { signer: polkadotInjector.signer }, async ({ status, events=[], dispatchError }) => {

      // console.log(`Current status: `,status,` Current status is ${status.type}`);
      let errorInfo;
      if (dispatchError) {
        if (dispatchError.isModule) {
          // for module errors, we have the section indexed, lookup
          const decoded = apiRelay.registry.findMetaError(dispatchError.asModule);
          const { docs, name, section } = decoded;
          errorInfo = `${section}.${name}`;
          console.log(`txRelaytoParachain dispatchError1 ${section}.${name}: ${docs.join(' ')}`);
        } else {
          // Other, CannotLookup, BadOrigin, no extra info
          errorInfo = dispatchError.toString();
          console.log(`txRelaytoParachain dispatchError2: `,dispatchError.toString());
        }
      }
      else console.log(`txRelaytoParachain ***** NO DISAPTCHEERROR *****: `);

      if (status.isFinalized) {
        let txResult="", extrinsicBlockHash = status.asFinalized, extrinsicIndexinBlock;
        // Loop through all events
        events.forEach(({ phase, event: { data, method, section } }) => {
            extrinsicIndexinBlock = phase.asApplyExtrinsic;
            // console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
            if (method==="ExtrinsicSuccess") txResult +=` Extrisnic Succeeded with Fees: ${data[0].weight}`;
            else if (method==="ExtrinsicFailed") txResult +=" Extrisnic Failed";
            else if (method==="Withdraw")  txResult +=` Widrawn from ${data[0]} ${data[1]} KSM:${ethers.utils.formatUnits(ethers.BigNumber.from(`${data[1]}`),11)}`;
            else if (method==="Transfer")  txResult +=` Transfer to ${data[1]} ${data[2]} KSM:${ethers.utils.formatUnits(ethers.BigNumber.from(`${data[2]}`),12)}`;
            else if (method==="Deposit")   txResult +=` Deposit to validator ${data[0]} ${data[1]} KSM:${ethers.utils.formatUnits(ethers.BigNumber.from(`${data[1]}`),11)}`;
        });
        
        const signedBlock = await apiRelay.rpc.chain.getBlock(extrinsicBlockHash);
        signedBlock.block.extrinsics.forEach(({ hash, method: { method, section } }, index) => {
          // console.log(`signedBlock.block.extrinsics.forEach ===> ${section}.${method}:: index:${index} hash.toString(): `,hash.toString(),`    u8aToHex(hash): `,u8aToHex(hash), `  hash: `,hash);
          if (index===Number(extrinsicIndexinBlock))
          {
            console.log(`Extrinsic hash: ${hash.toString()} finalised at Block Hash: ${extrinsicBlockHash} Result: `,txResult);
          }
        });

        txRelaytoParachain();
      }
      
      // fun: { Fungible: (new BN(amount)).mul(mantissa12) }
  });
  console.log(`Submitted xcmPallet transaction with txRelaytoParachain`);    

}
//#endregion 


//#region ***** Transfer from Relay to Relay //*****
const tranferFromRelayToRelay = async (apiRelay, recipient='5EbenGjMnTsyMuDVoSbMfXidaCTrtqfLya1Khnb8zXCkD6LJ', _amount="1") => {

      if (!polkadotInjector || !polkadotInjectorAddress) {
        console.log(`transfer_Currency_FromParachainToParachain polkadotInjector and/or polkadotInjectorAddress are null. Cannot proceed!!!`)
      }

      const amount = (new BN(_amount)).mul(mantissa12);
      const unsub_Tx = apiRelay.tx.balances
      .transfer(recipient, amount)
      // .signAndSend(Alecia, ({ status, events, dispatchError }) => {
      .signAndSend(polkadotInjectorAddress, { signer: polkadotInjector.signer }, ({ status, events, dispatchError }) => {
        
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
//#endregion 


//#region ***** Setup Substrate Chain //*****
const setup_SubstrateChain = async (wsURL = 'MoonbaseAlpha') => {
  console.log("setup_Moonbeam is RUN");

  let WS_URL;
  //mainnet
  if (wsURL === 'Moonriver') WS_URL = 'wss://wss.moonriver.moonbeam.network'; 
  else if (wsURL === 'Polkadot') WS_URL = 'wss://rpc.polkadot.io'; 
  else if (wsURL === 'Kusama') WS_URL = 'wss://kusama-rpc.polkadot.io'; 
  else if (wsURL === 'Karura') WS_URL = 'wss://karura.api.onfinality.io/public-ws'; 

  //testnets
  else if (wsURL === 'MoonbaseRelayTestnet') WS_URL = 'wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network'; 
  else if (wsURL === 'MoonbaseAlpha') WS_URL = 'wss://wss.api.moonbase.moonbeam.network'; 
  else if (wsURL === 'KaruraAlphanet') WS_URL = 'wss://crosschain-dev.polkawallet.io:9908'; 
  else if (wsURL === 'BifrostAlphanet') WS_URL = 'wss://moonriver.bifrost-rpc.testnet.liebi.com/ws'; 
  else if (wsURL === 'KintsugiAlphanet') WS_URL = 'wss://api-dev-moonbeam.interlay.io/parachain'; 
   
  const wsProvider = new WsProvider(WS_URL);

  // Wait for Provider
  const api = await ApiPromise.create({ provider: wsProvider });
  await api.isReady;
  console.log(`api => : `,api);
  return {api};
};
//#endregion 



const getAvailableBalance = async (network, api, account, token) => {

    if (network==="Moonriver")
    {

    }
    else {

    }



}

//For MoobaseAlpha use Pablo Monn Address 0x1270dbdE6Fa704f9363e47Dd05493D5dae329A4d
//#region ***** Setup EVM Chain //*****
const setup = async (network = "moonbaseAlpha", useMetaMask=true) => {

      // let provider, wallet, wss_provider=null, mm_acounts;
      //#region SETUP PROVIDER AND WALLET WITH METAMASK 
      // if (useMetaMask)
      // {
      //   const _provider = await detectEthereumProvider();
      //   if (_provider) {
      //     provider = new ethers.providers.Web3Provider(window.ethereum, "any");   
      //     provider.on("network", (newNetwork, oldNetwork) => {
      //         if (oldNetwork) {
      //             window.location.reload();
      //         }
      //     });

      //     mm_acounts = await _provider.request({ method: 'eth_requestAccounts' });
      //     console.log(`MetaMask Accounts: `,mm_acounts);
      //     const account = mm_acounts[0];
      //     const mm_chainId = await _provider.request({ method: 'eth_chainId' });
      //     console.log(`MetaMask mm_chainId: `,mm_chainId);
        
      //     wallet = provider.getSigner(); 

      //     console.log("New MetaMask wallet signer : ",wallet);
      //     setWallet(wallet);

      //     return { provider, wallet, account,  };
      //   } 
      //   else { 
      //     console.log('Please install MetaMask!'); 
      //     return { provider: null, wallet: null, account: null };
      //   }
      // }
      //#endregion SETUP PROVIDER AND WALLET WITH METAMASK  
}
//#endregion 


export {
          setWallet,
          setPolkadotInjector,
          wallet,
          setup, 
          setup_SubstrateChain, 
          transferFromRelayToParachain, 
          tranferFromRelayToRelay,
          transfer_Currency_FromParachainToParachain,
          transfer_Asset_FromParachainToParachain,
          transfer_multiasset,
          transfer_xcKSMtoKSM,
          simpleERC20Transfer,
          getBalance,
          checkAllowanceOfTokentoAddress,
          approve,
          getAccountIdtoHex,
          getAvailableBalance,
       };