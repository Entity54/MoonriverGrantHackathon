import React,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import {Dropdown} from 'react-bootstrap';
import {setup, setup_SubstrateChain, wallet, transferFromRelayToParachain, tranferFromRelayToRelay, simpleERC20Transfer, getBalance, transfer_xcKSMtoKSM } from './Setup.js';

 
const QuickTransfer = ({setupSpecs, relaySpecs, portfolio, icons, tickSymbols, blockHeader, customerPortfolio}) => {
     
	const parachainCode = 1000;
	const tokenList = ["KSM","xcKSM","MOVR","xcKAR","xcKINT","xcRMRK"];
	const tokenDestination1 = ["Kusama","Moonriver"];
	const tokenDestination2 = ["Moonriver"];
	const relayTokenPrecompileAddress = "0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080";  //xcUNIT

	const [tokenDropDownn, setTokenDropDown] = useState(tokenList);
	const [tokenDropDownsDestination, setTokenDropDownsDestination] = useState(tokenDestination1);
	const [baseCurrency, setBaseCurrency] = useState("KSM");
	const [destination, setDestination] = useState("Moonriver");
    const [inputTranferAmount, setInputTranferAmount] = useState("");
	const [baseCurrencyPlaceHolder, setBaseCurrencyPlaceHolder] = useState("");	
	const [sendToAddress, setSendToAddress] = useState("0x1270dbdE6Fa704f9363e47Dd05493D5dae329A4d");	
    const [transfer_IsSubmiting, setTransfer_IsSubmiting] = useState(false);
    const [transactionMessage, setTransactionMessage] = useState("...........");
	// const [placeholderText, setPlaceholderText] = useState("Substrate Address");	  //For Balances


	const transferBalance = async () => {
		console.log(`QuickTransfer transferBalance baseCurrency: `,baseCurrency,` sendToAddress: `,sendToAddress,`  inputTranferAmount: `,inputTranferAmount);
    	const amount = inputTranferAmount.toString();

        if (amount!=="0" && sendToAddress!=="" && setupSpecs.wallet && relaySpecs.api)
		{

			if (baseCurrency==="KSM")
			{
				if (destination==="Moonriver")
				{
					console.log(`We are sending KSM from Kusama to Moonriver xcKSM inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
					setTransfer_IsSubmiting(true);
					setTransactionMessage(`Transfer KSM from Kusama account to Moonriver account for xcKSM, submitted at BlockNumber: ${blockHeader.number}`);

					await transferFromRelayToParachain(relaySpecs.api, parachainCode, sendToAddress, amount)

					setTransfer_IsSubmiting(false);
					setInputTranferAmount("");
				}
				else 
				{
					console.log(`We are sending KSM to another Kusama Account inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
					setTransfer_IsSubmiting(true);
					setTransactionMessage(`Transfer KSM to another Kusama account, submitted at BlockNumber: ${blockHeader.number}`);
					
					await tranferFromRelayToRelay(relaySpecs.api, sendToAddress, amount);

					setTransfer_IsSubmiting(false);
					setInputTranferAmount("");
				}

			}
			else if (baseCurrency==="xcKSM") {
				if (destination==="Kusama") {
					console.log(`We are sending xcKSM to Kusama as KSM inputTranferAmount:${amount} sendToAddress:${sendToAddress}`)
					setTransfer_IsSubmiting(true);
					setTransactionMessage(`Transfer xcKSM from Moonriver to Kusama account for KSM, submitted at BlockNumber: ${blockHeader.number}`);
					
					console.log("We are about to send xcKSM to KSM");
					await transfer_xcKSMtoKSM(amount, sendToAddress);

					setTransfer_IsSubmiting(false);
					setInputTranferAmount("");
				}
				else
				{
					console.log(`We are transfering xcKSM to another account within Moonriver inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
					setTransfer_IsSubmiting(true);
					setTransactionMessage(`Transfer xcKSM to another Moonriver account, submitted at BlockNumber: ${blockHeader.number}`);

					await getBalance(relayTokenPrecompileAddress, await wallet.getAddress())
					await simpleERC20Transfer(setupSpecs.wallet, relayTokenPrecompileAddress, sendToAddress, amount);

					setTransfer_IsSubmiting(false);
					setInputTranferAmount("");
				}
			}
       
		}

	};

	useEffect(() => {
		setTokenDropDown( refreshDataTokenList(tokenList) );
		setTokenDropDownsDestination( refreshDataDestination(tokenDestination1) );
		setBaseCurrency(tokenList[0]);
		setDestination(tokenDestination1[1]);

		//ToDo FIND TOKEN BALANCE FOR tokenList[0]
	},[]);

	const refreshDataTokenList = (tokens) =>{
		if (tokens)
		{
			return tokens.map((token, index) => {
				return (

					<Dropdown.Item key={index} onClick={() => { 
						setBaseCurrency(token);
						console.log(`Base Currency is: ${token}`);

					 
						if (token!=="KSM" && token!=="xcKSM") {
							setTokenDropDownsDestination( refreshDataDestination(tokenDestination2) );
							setDestination(tokenDestination2[0])
						}
						else {
							setTokenDropDownsDestination( refreshDataDestination(tokenDestination1) );
							setDestination(tokenDestination1[0])
						}  

					} }>{token}</Dropdown.Item>
				)
			});
		}
		else return <>Loading data...</> 

	}
	const refreshDataDestination = (tokens) =>{
		if (tokens)
		{
			return tokens.map((token, index) => {
				return (

					<Dropdown.Item key={index} onClick={() => { 
						setDestination(token);
					} }>{token}</Dropdown.Item>
				)
			});
		}
		else return <>Loading data...</> 

	}


	return(
		<>
			<div className="card" style={{backgroundColor:"#000080"}}>
				<div className="card-header d-sm-flex d-block pb-0 border-0">
					<div>
						<h4 className="fs-20" style={{backgroundColor:"#800080"}}>Transfer</h4>
					</div>
					<div  onClick = {() => setInputTranferAmount(baseCurrencyPlaceHolder)}>
						<span className="fs-20" style={{color:"#a7adba"}}>{baseCurrencyPlaceHolder===""?"":`Max: ${baseCurrencyPlaceHolder}`}</span>
					</div>
				</div>
				
				<div className="card-body">
					<div className="form-wrapper">
						<div className="form-group">
							<div className="input-group input-group-lg">
								<div className="input-group-prepend">
									<Dropdown>
											<Dropdown.Toggle variant="" as="div" className="input-group-text form-control style-2 default-select cursor-pointer">{baseCurrency} </Dropdown.Toggle>
											<Dropdown.Menu style={{height:"500px", overflowY: "scroll"}} >
												{tokenDropDownn}
											</Dropdown.Menu>
									</Dropdown>
								</div>
								<input type="number"  className="form-control"  value={inputTranferAmount}  placeholder={baseCurrency===""?"":`Balance: ${baseCurrency}`} onChange = {(event) => setInputTranferAmount( Math.min( Number(event.target.value) ) )} style={{color:"Black"}} />
							</div>
						</div>
						<div className="form-group">
								<div className="input-group input-group-lg">
									<div className="input-group-prepend">
										<Dropdown>
											<Dropdown.Toggle variant="" as="div" className="input-group-text form-control style-2 default-select cursor-pointer">{destination} </Dropdown.Toggle>
											<Dropdown.Menu style={{height:"500px", overflowY: "scroll"}} >
												{tokenDropDownsDestination}
											</Dropdown.Menu>
									    </Dropdown>
									</div>
									<input type="text" className="form-control" value={sendToAddress} placeholder={"Account Address"} onChange = {(event) => setSendToAddress(event.target.value)} style={{fontSize: "18px", color: "black"}} />
								</div>
							</div>
					</div>

					<br/>
					<span style={{fontSize:18, color:"white"}}>{transactionMessage}</span>
					<br/>
					<br/>

					<div className="d-flex mb-3 justify-content-between align-items-center view-link">
					</div>
					
					<div className="row pt-5 align-items-center">
						<div className="col-xl-3">
						</div>

						<div className="col-xl-6">
							{/* <Link to={"#"} className="btn btn-primary d-block btn-lg rounded" style={{backgroundColor: "#DE9C06"}}> */}
    				            <button className="tn btn-primary d-block btn-lg rounded"  disabled={transfer_IsSubmiting} onClick = {transferBalance} styles={{border: "none", backgroundColor: "#DE9C06", width:"80%"}}>SUBMIT TRANSFER</button> 
							{/* </Link> */}
						</div>
						<div className="col-xl-3">
						</div>
					</div>
				</div>
			</div>
		
		</>
	)
}
export default QuickTransfer;