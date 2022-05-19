import React,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import {Dropdown} from 'react-bootstrap';
import {setup, setup_SubstrateChain, wallet, transferFromRelayToParachain, tranferFromRelayToRelay, simpleERC20Transfer, getBalance, transfer_xcKSMtoKSM, transfer_multiasset, transfer_Currency_FromParachainToParachain, transfer_Asset_FromParachainToParachain } from '../../../../Setup.js';

// import { getAllData, setWallet, getStableBalance, getPrice, swapStableForToken, swapTokenForStable, faucet, checkAllowanceOfStabletoDEX, checkAllowanceOfTokentoDEX } from '../../../../ntt54Dex.js';         
 
// import axios from 'axios'; 

// const QuickTrade = ({setupSpecs, portfolio, oracleData, accountList }) => {
// const QuickTrade = ({setupSpecs, relaySpecs, karuraAlphaSpecs, portfolio, icons, tickSymbols, blockHeader, customerPortfolio, accountList}) => {
const QuickTrade = ({setupSpecs, relaySpecs, karuraAlphaSpecs, blockHeader, accountList, icons}) => {
    
	//#region xcmRputes schema  Token=> OriginChain => ArrayOfTragetChains
    const xcmRoutes = {
                         "KSM": {
									"Kusama1": ["Moonriver11"],
									"Moonriver1": ["Kusama11"], 
						        },
						 "KAR": {
									"Karura2": ["Moonriver22"],
									"Moonriver2": ["Karura22"], 
								},
						 "AUSD": {
									"Karura3": ["Moonriver33"],
									"Moonriver3": ["Karura33"], 
								 }
					};
    //#endregion
    
	const parachainCodes = {   
								Moonriver: 1000, //2023
								Karura   : 2000,
								
								MoonbaseAlpha : 1000,
								KaruraAlphanet: 2000,
	    					}	
					
	const tokenList = ["KSM","KAR","AUSD"];
	
	//Token List
	const [baseCurrency, setBaseCurrency] = useState("Token");
	const [tokenDropDownn, setTokenDropDown] = useState(tokenList);
	//Origin Chain
	const [destination, setDestination] = useState("Origin");
	// const [tokenDropDownsDestination, setTokenDropDownsDestination] = useState(tokenDestination1);
	const [tokenDropDownsDestination, setTokenDropDownsDestination] = useState("Origin Chain");
    //Target Chain
	const [targetChainDestination, setTargetChainDestination] = useState("Target Chain");
	const [targetChainDropDownsDestination, setTargetChainDropDownsDestination] = useState(["Kusama", "Moonriver", "Karura"]);
	
    const [inputTranferAmount, setInputTranferAmount] = useState("");
	const [sendToAddress, setSendToAddress] = useState("");	
    
	const [transfer_IsSubmiting, setTransfer_IsSubmiting] = useState(false);
    const [transactionMessage, setTransactionMessage] = useState("...........");
	
	const relayTokenPrecompileAddress = "0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080";  //xcUNIT or xcKSM

    const [availableBalance, setAvailableBalance] = useState("123456789");
    const [targetAccountBalance, setTargetAccountBalance] = useState("123456789");



	// const Moonriver_parachainCode = 1000;
	// const Karura_parachainCode = 2000;
	// const tokenList = ["KSM","KAR","AUSD","xcKSM","MOVR","xcKAR","xcKINT","xcRMRK"];
	// const tokenList = ["KSM","KAR","AUSD"];
	// const tokenDestination1 = ["Kusama","Moonriver"];
	// const tokenDestination2 = ["Moonriver"];
	// const [baseCurrencyPlaceHolder, setBaseCurrencyPlaceHolder] = useState("");	
	// const [placeholderText, setPlaceholderText] = useState("Substrate Address");	  //For Balances

    // const sendRequest = async () => {
	// 	// const response = await axios.post(
	// 	// 	'https://example.com',
	// 	// 	{ example: 'data' },
	// 	// 	{ headers: { 'Content-Type': 'application/json' } }
	// 	//   )
	// 	//   console.log(response.data)
		
	// 	console.log(`SENDING  A SUBQUERY`);
        

	// 	  axios({
	// 		url: 'https://api.subquery.network/sq/subquery/moonriver-evm-starter-project',
	// 		method: 'post',
	// 		data: {
	// 		  query: `
	// 			query {
	// 				transactions (first: 5) {
	// 					nodes {
	// 						id
	// 						value
	// 						to
	// 						from
	// 					}
	// 				}
	// 			}
	// 			`
	// 		}
	// 	  }).then((result) => {
	// 		console.log("GRAPHQL sendRequest ======> : ",result.data)
	// 	  });

	// }




	//#region
	const transferBalance = async () => {
		console.log(`XCMTransfer Begins transferBalance baseCurrency: `,baseCurrency,` sendToAddress: `,sendToAddress,`  inputTranferAmount: `,inputTranferAmount, ` OrginChain: ${destination} TargetChain:${targetChainDestination}`);
		const amount = inputTranferAmount.toString();
		const orginChain = destination;

		if (amount!=="0" && sendToAddress!==""   && setupSpecs.wallet && relaySpecs.api && karuraAlphaSpecs.api)
		{

            //#region baseCurrency KSM
			if (baseCurrency==="KSM")
			{
				if (orginChain==="Kusama" && targetChainDestination==="Moonriver")
				{
					console.log(`We are sending KSM from Kusama to Moonriver xcKSM inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
					setTransfer_IsSubmiting(true);
					setTransactionMessage(`Transfer KSM from Kusama to Moonriver, submitted at BlockNumber: ${blockHeader.number}`);

				    await transferFromRelayToParachain(relaySpecs.api, parachainCodes.Moonriver, sendToAddress, amount);

					setTransfer_IsSubmiting(false);
					setInputTranferAmount("");
				}
				else if (orginChain==="Moonriver" && targetChainDestination==="Kusama") {
					console.log(`We are sending xcKSM from Moonriver to Kusama inputTranferAmount:${amount} sendToAddress:${sendToAddress}`)
					setTransfer_IsSubmiting(true);
					setTransactionMessage(`Transfer xcKSM from Moonriver to Kusama, submitted at BlockNumber: ${blockHeader.number}`);
					
					await transfer_xcKSMtoKSM(amount, sendToAddress);

					setTransfer_IsSubmiting(false);
					setInputTranferAmount("");
				}
				else if (orginChain==="Kusama" && targetChainDestination==="Kusama")
				{
					console.log(`We are sending KSM from Kusama to another Kusama Account inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
					setTransfer_IsSubmiting(true);
					setTransactionMessage(`Transfer KSM to from Kusama another Kusama account, submitted at BlockNumber: ${blockHeader.number}`);
					
					await tranferFromRelayToRelay(relaySpecs.api, sendToAddress, amount);

					setTransfer_IsSubmiting(false);
					setInputTranferAmount("");
				}
				else if (orginChain==="Moonriver" && targetChainDestination==="Moonriver")
				{
					console.log(`We are transfering xcKSM from one Moonriver account to another account within Moonriver inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
					setTransfer_IsSubmiting(true);
					setTransactionMessage(`Transfer xcKSM to another Moonriver account, submitted at BlockNumber: ${blockHeader.number}`);

					await getBalance(relayTokenPrecompileAddress, await wallet.getAddress())
					await simpleERC20Transfer(setupSpecs.wallet, relayTokenPrecompileAddress, sendToAddress, amount);

					setTransfer_IsSubmiting(false);
					setInputTranferAmount("");
				}

			}
			//#endregion
			//#region baseCurrency KAR
			else if (baseCurrency==="KAR")
			{
				if (orginChain==="Karura" && targetChainDestination==="Moonriver")
				{
					console.log(`We are sending KAR from Karura to Moonriver inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
					setTransfer_IsSubmiting(true);
					setTransactionMessage(`Transfer KAR from Karura to Moonriver, submitted at BlockNumber: ${blockHeader.number}`);

					await transfer_Currency_FromParachainToParachain(karuraAlphaSpecs.api, parachainCodes.Moonriver, sendToAddress, amount);
					
					setTransfer_IsSubmiting(false);
					setInputTranferAmount("");
				}
				else if (orginChain==="Moonriver" && targetChainDestination==="Karura")
				{
					console.log(`We are sending KAR from Moonriver to Karura inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
					setTransfer_IsSubmiting(true);
					setTransactionMessage(`Transfer KAR from Moonriver to Karura, submitted at BlockNumber: ${blockHeader.number}`);

  					await transfer_multiasset("xcKAR", parachainCodes.Karura, amount, sendToAddress);

					setTransfer_IsSubmiting(false);
					setInputTranferAmount("");
				}
			}
			//#endregion
			//#region baseCurrency AUSD
			else if (baseCurrency==="AUSD")
			{
				if (orginChain==="Karura" && targetChainDestination==="Moonriver")
				{
					console.log(`We are sending AUSD from Karura to Moonriver inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
					setTransfer_IsSubmiting(true);
					setTransactionMessage(`Transfer AUSD from Karura to Moonriver, submitted at BlockNumber: ${blockHeader.number}`);

					await transfer_Asset_FromParachainToParachain(karuraAlphaSpecs.api, "KUSD", parachainCodes.Karura, parachainCodes.Moonriver, sendToAddress, amount);
					
					setTransfer_IsSubmiting(false);
					setInputTranferAmount("");
				}
				else if (orginChain==="Moonriver" && targetChainDestination==="Karura")
				{
					console.log(`We are sending AUSD from Moonriver to Karura inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
					setTransfer_IsSubmiting(true);
					setTransactionMessage(`Transfer AUSD from Moonriver to Karura, submitted at BlockNumber: ${blockHeader.number}`);

  					await transfer_multiasset("xcAUSD", parachainCodes.Karura, amount, sendToAddress);

					setTransfer_IsSubmiting(false);
					setInputTranferAmount("");
				}
			}
			//#endregion
		
		}

	};
	//#endregion

	
	useEffect(() => {
		// setBaseCurrency(tokenList[0]);
		setTokenDropDown( refreshDataTokenList(tokenList) );
		// setDestination(tokenDestination1[1]);
		// setTokenDropDownsDestination( refreshDataDestination(tokenDestination1) );

		//ToDo FIND TOKEN BALANCE FOR tokenList[0]
	},[]);

    //#region
	const refreshDataTokenList = (tokens) =>{
		if (tokens)
		{
			return tokens.map((token, index) => {
				return (

					<Dropdown.Item key={index} onClick={() => { 
						setBaseCurrency(token);
						// console.log(`Base Currency is: ${token}`);
					 
						const originChainsArray = Object.keys( xcmRoutes[token] );
						setTokenDropDownsDestination( refreshDataDestination(token, originChainsArray) );
						setDestination(originChainsArray[0])

						const trgtChains = xcmRoutes[token][originChainsArray[0]] ;
						setTargetChainDropDownsDestination(refreshTargetChainDestination(trgtChains) );
						setTargetChainDestination( trgtChains[0] );
						console.log(`Base Currency is: ${token} OriginChain is: ${originChainsArray[0]} TragetChain is: ${trgtChains[0]}`);

						// console.log(`ABOUT TO RUN A SUBQUERY`);
						// sendRequest();

					} }>{token}</Dropdown.Item>
				)
			});
		}
		else return <>Loading data...</> 
	}
    //#endregion

    //#region
	const refreshDataDestination = (baseT, tokens) =>{
		if (tokens)
		{
			return tokens.map((token, index) => {
				return (

					<Dropdown.Item key={index} onClick={() => { 
						setDestination(token);
						console.log(`baseT:${baseT} => Origin Chain is: ${token}`);
                       
						const targetChainsArray = xcmRoutes[`${baseT}`][`${token}`] ;
						// console.log(`targetChainsArray: `,targetChainsArray);

						setTargetChainDropDownsDestination(refreshTargetChainDestination(targetChainsArray) );
						setTargetChainDestination(targetChainsArray[0]);
					} }>{token}</Dropdown.Item>
				)
			});
		}
		else return <>Loading data...</> 
	}
    //#endregion

    //#region
	const refreshTargetChainDestination = (tokens) =>{
		if (tokens)
		{
			return tokens.map((token, index) => {
				return (
					<Dropdown.Item key={index} onClick={() => { 
						setTargetChainDestination(token);
						console.log(`TargetChainDestination is: ${token}`);
					} }>{token}</Dropdown.Item>
				)
			});
		}
		else return <>Loading data...</> 
	}
    //#endregion




	//#region TO DELETE
	// const [tokenDropDowns, setTokenDropDowns] = useState(null);
	// // const [baseCurrency, setBaseCurrency] = useState("BTC");	
	// const [baseCurrencyIconIndex, setBaseCurrencyIconIndex] = useState(0);	
	// const [dexArray, setDexArray] = useState([]);	
	// const [swapQuote, setSwapQuote] = useState(0);	 //0 for stable 1 for token
	// const [tokenQtyInputState, setTokenQtyInputState] = useState(true);	 //if false then the input is not disabled, hence active
    // const [expectedToreceiveFromSwap, setExpectedToreceiveFromSwap] = useState("");
	// const [tokenCurrency, setTokenCurrency] = useState("BTC");	
    // const [swapWithExactSupply_IsSubmiting, setSwapWithExactSupply_IsSubmiting] = useState(false);
    // const [input_Supply, setInput_Supply] = useState("");
    // const [accountMaxSupply, setAccountMaxSupply] = useState("");
    //#endregion

    //#region TO DELETE
	// const _swapWithExactSupply = async () => {
	// 	console.log(`SWAP WITH EXACT SUPPLY HAS BEEN TRIGERRED HURRAH`)
	// 	setSwapWithExactSupply_IsSubmiting(true);
	// 	if (baseCurrency.toLowerCase()==='ausd')
	// 	{
    //         console.log(`WE WILL SWAP STABLE FOR TOKEN ${dexArray[baseCurrencyIconIndex].ticker}   ${dexArray[baseCurrencyIconIndex]._ticker} address:${dexArray[baseCurrencyIconIndex].tokenAddress}  ${input_Supply} ${accountMaxSupply}`);
	// 		swapStableForToken( dexArray[baseCurrencyIconIndex]._ticker , `${Math.min(Number(accountMaxSupply),Number(input_Supply))}` )
	// 		.then( resMsg => {
	// 			console.log(`swapStableForToken resMsg: `,resMsg)
	// 		    setExpectedToreceiveFromSwap(`Received: ${resMsg}`);
	// 			setSwapWithExactSupply_IsSubmiting(false);
	// 		})
	// 		.catch( er => {
	// 			console.log(er); 
	// 			setSwapWithExactSupply_IsSubmiting(false);
	// 		});  
			 
	// 	}
	// 	else  //SWAP TOKEN FOR STABLE
	// 	{
	// 		console.log(`WE WILL SWAP TOKEN FOR STABLE ${dexArray[baseCurrencyIconIndex].ticker}   ${dexArray[baseCurrencyIconIndex]._ticker}  ${input_Supply} ${accountMaxSupply}`);
	// 		swapTokenForStable( dexArray[baseCurrencyIconIndex].tokenAddress, dexArray[baseCurrencyIconIndex]._ticker , `${Math.min(Number(accountMaxSupply),Number(input_Supply))}` )  
	// 		.then( resMsg => {
	// 			console.log(`swapTokenForStable resMsg: `,resMsg)
	// 		    setExpectedToreceiveFromSwap(`Received: ${resMsg}`);
	// 			setSwapWithExactSupply_IsSubmiting(false);
	// 		})
	// 		.catch( er => {
	// 			console.log(er); 
	// 			setSwapWithExactSupply_IsSubmiting(false);
	// 		});  

	// 	}
	// };
    //#endregion

    //#region TO DELETE
	// useEffect( async () => {
	//     if (swapQuote===0) 
	// 	{
	// 		setBaseCurrency("aUSD");
	// 		setTokenQtyInputState(true);
	// 	}
	// 	else{
	// 		setBaseCurrency("BTC");
	// 		setTokenQtyInputState(false);
	// 	}
	// }, [swapQuote]);
    //#endregion
    
	 
    //#region TO DELETE
	// const refreshData = (_portfolio) =>{
	// 	if (_portfolio)
	// 	{
	// 		return _portfolio.map((token, index) => {
	// 			return (

	// 				<Dropdown.Item key={index} onClick={() => { 
	// 					// console.log(`index:$ token.ticker : `,token.ticker);
	// 					if (swapQuote===1) setBaseCurrency(token.ticker);
	// 					// setBaseCurrency(token.ticker);
	// 					setTokenCurrency(token.ticker);
	// 					setBaseCurrencyIconIndex(index);
	// 				} }>{token.ticker}</Dropdown.Item>
	// 			)
	// 		});
	// 	}
	// 	else return <>Loading data...</> 
	// }

	// useEffect( async () => {
	// 	if (setupSpecs.wallet)
	// 	{
	// 		setWallet(setupSpecs.wallet);
	// 		const _portfolio = await getAllData();
	// 		setDexArray(_portfolio);
	// 		setTokenDropDowns( refreshData(_portfolio) );
	// 	}
	// }, [setupSpecs]);
    //#endregion 

	//====> TODO MAYBE TO BE USED FOR ICONS
	// useEffect(async () => {
	// 		console.log(`Running useEffect for ntt54_QuickTrade`);
	// 		const _portfolio = await getAllData();
	// 		setDexArray(_portfolio);
	// 		setTokenDropDowns( refreshData(_portfolio) );
	// }, [baseCurrencyIconIndex]);

    //#region  MAYBE FOR READIGN TOKEN BALANCE
	// useEffect(async () => {
    //     console.log(`GET BALANCE FOR THIS TOKEN`);
	// 	if(setupSpecs.wallet)
	// 	{
	// 		if (baseCurrency.toLowerCase()==='ausd' && dexArray && dexArray.length>0)
	// 		{
	// 			console.log("STABLECOING  BALANCE");
	// 			const balance = await getStableBalance(accountList[0]);
	// 			setInput_Supply(balance);
	// 			setAccountMaxSupply(balance);
					 
	// 		    const price = await getPrice(dexArray[baseCurrencyIconIndex]._ticker);
	// 		    console.log(`PRICE IS FOR INDEX ${baseCurrencyIconIndex}`,price);
	// 			setExpectedToreceiveFromSwap(price!=="0"? (Number(balance) / Number(price)).toFixed(5) : "" );
	// 		}
	// 		else if (dexArray && dexArray.length>0)
	// 		{
	// 			console.log(`BASE CURRENCY `,dexArray[baseCurrencyIconIndex]);
	// 			const balance = await getBalance(dexArray[baseCurrencyIconIndex].tokenAddress, accountList[0]);
	// 			setInput_Supply(balance);
	// 			setAccountMaxSupply(balance);

	// 			const price = await getPrice(dexArray[baseCurrencyIconIndex]._ticker);
	// 		    console.log(`PRICE IS FOR INDEX ${baseCurrencyIconIndex}`,price,` AND REVERSE IS : `,price==="0"?"":1/Number(price));
	// 			setExpectedToreceiveFromSwap(balance!=="0"? (Number(balance) * Number(price)).toFixed(5) : "" );

	// 		}
	// 	}
	// },[baseCurrency,setupSpecs,tokenCurrency,dexArray]);
    //#endregion


	const xcmTokenDiv =   (
		<div className="form-group">
			<div className="input-group input-group-lg">
			{/* <div className=" input-group-lg"> */}

				<div className="input-group-prepend">

				    <Dropdown>
							{/* <Dropdown.Toggle variant="" as="div" className="input-group-text form-control style-2 default-select cursor-pointer" style={{backgroundColor:"black",}}>{baseCurrency} </Dropdown.Toggle> */}
							<Dropdown.Toggle variant="" as="div" className="input-group-text form-control style-2 default-select cursor-pointer">{baseCurrency} </Dropdown.Toggle>

							<Dropdown.Menu style={{height:"150px", overflowY: "scroll"}} >
								{tokenDropDownn}
							</Dropdown.Menu>
					</Dropdown>

				</div>
				{/* <input type="text" className="form-control" disabled={tokenQtyInputState} placeholder={swapQuote===1? "":expectedToreceiveFromSwap} value = {swapQuote===1? input_Supply : "" } style={{color:"white"}}  onChange = { (event) => { 
					if (swapQuote===1) setInput_Supply(event.target.value); 
				}
				} /> */}

			</div>
		</div>
	);

	const tokenDiv =   (
			<div className="form-group">
				<div className="input-group input-group-lg">
					<div className="input-group-prepend">
						<Dropdown>
							<Dropdown.Toggle variant="" as="div" className="input-group-text form-control style-2 default-select cursor-pointer">{destination}</Dropdown.Toggle>
							<Dropdown.Menu style={{height:"100px", overflowY: "scroll"}}>{tokenDropDownsDestination}</Dropdown.Menu>
						</Dropdown>
					</div>
					{/* <input type="text" className="form-control" disabled={tokenQtyInputState} placeholder={swapQuote===1? "":expectedToreceiveFromSwap} value = {swapQuote===1? input_Supply : "" } style={{color:"white"}}  onChange = { (event) => { 
						if (swapQuote===1) setInput_Supply(event.target.value); 
					}
					} /> */}
					<input type="text" className="form-control" value={inputTranferAmount} placeholder={"Number of tokens to send"} onChange = {(event) => setInputTranferAmount( event.target.value) } style={{color:"white"}} />
				</div>
			</div>
						);
	const stableDiv =   (			
			<div className="form-group">
				<div className="input-group input-group-lg">
					<div className="input-group-prepend">
						<Dropdown>
							<Dropdown.Toggle variant="" as="div" className="input-group-text form-control style-2 default-select cursor-pointer">{targetChainDestination}</Dropdown.Toggle>
							<Dropdown.Menu style={{height:"100px", overflowY: "scroll"}}>{targetChainDropDownsDestination}</Dropdown.Menu>
						</Dropdown>

						{/* <div className="input-group-prepend">
							<span className="input-group-text">aUSD</span>
						</div> */}

					</div>
					{/* <input type="text" disabled={!tokenQtyInputState}  value = {swapQuote===0? input_Supply : "" } placeholder={swapQuote===0?"":expectedToreceiveFromSwap} className="form-control" style={{color:"white"}} onChange={(event) => { 
						setInput_Supply(event.target.value);
						}
					} /> */}
					<input type="text" className="form-control" value={sendToAddress} placeholder={"Account Address"} onChange = {(event) => setSendToAddress(event.target.value)} style={{fontSize: "18px", color: "white"}} />
				</div>
			</div>
						)

	//#endregion
    
	return(
		<>
			<div className="card">
				{/* <div className="card-header d-sm-flex d-block pb-0 border-0"> */}
				{/* <div className="card-header d-block border-0"> */}
				<div className="card-header d-block ">

					<div>
						<h4 className="fs-20 text-black"  style={{textAlign:"center"}}>XCM Transfers Center</h4>
					</div>
				</div>
				<div className="card-body">
					<div className="basic-form">
						<form className="form-wrapper">
								<div>

									{xcmTokenDiv}

								</div>
								<div style={{marginTop:"20px"}}>
									<div className="row" style={{marginBottom:"10px"}}>
										<div className="col-xl-9 col-xxl-12"></div>
										<div className="col-xl-3 col-xxl-12">
											<span>Available {availableBalance}</span>
										</div>
									</div>

									{tokenDiv}
								</div>

								<div style={{marginTop:"20px"}}>
									<div className="row" style={{marginBottom:"10px"}}>
										<div className="col-xl-9 col-xxl-12"></div>
										<div className="col-xl-3 col-xxl-12">
											<span>Balance {targetAccountBalance}</span>
										</div>
									</div>

									{stableDiv}
								</div>

								{/* { swapQuote===0? stableDiv : tokenDiv } */}


							{/* <div className="row" style={{marginTop:"10px", marginBottom:"10px", backgroundColor:""}}> 
									<div className="col-xl-5 col-xxl-12" style={{backgroundColor:""}}></div>
									<div className="col-xl-2 col-xxl-12" style={{backgroundColor:"", textAlign:"center"}} onClick={() => swapQuote===0? setSwapQuote(1) : setSwapQuote(0)} ><i className="bi bi-arrow-down-up" style={{fontSize:"24px"}}></i></div>
									<div className="col-xl-5 col-xxl-12" style={{backgroundColor:""}}></div>
							</div> */}


								{/* { swapQuote===0? tokenDiv : stableDiv } */}

							<div className="row mt-4 align-items-center"  style={{backgroundColor:"",  }}>
									<div className="col-sm-3"   >
									</div>
									<div className="col-sm-6"  style={{marginTop:"20px"}}>
										<Link to={"#"} className="btn btn-primary d-block btn-lg rounded">
    				                    	{/* <button className="btn-primary" disabled = { swapWithExactSupply_IsSubmiting } onClick = { _swapWithExactSupply } style={{border: "none"}}>SEND</button>  */}
    				                    	{/* <button className="btn-primary" disabled = { false } style={{border: "none"}}>SEND</button>  */}
											<button className="btn-primary" disabled={transfer_IsSubmiting} style={{border: "none"}}  onClick = {transferBalance}>SEND</button> 
										</Link>
									</div>
							</div>

							<br/>
							<span style={{fontSize:18, color:"white"}}>{transactionMessage}</span>
							<br/>
							<br/>

						</form>
					</div>
				</div>
			</div>
		</>
	)
}
export default QuickTrade;