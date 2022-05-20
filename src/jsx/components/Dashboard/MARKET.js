import React, { useState, useRef, useEffect } from "react";
// import {  Sparklines, SparklinesLine } from 'react-sparklines';
import {Dropdown} from 'react-bootstrap';
// import {Link} from 'react-router-dom';
import { utils } from 'ethers';  


import axios from 'axios'; 
import { 
		query_XTokensTransferredMultiAssetsEvents_FromAccount, 
		query_XTokensTransferredEvents_FromAccount, 
		query_DMPQueueEvent_toAccount,
		query_XcmpQueueEvent_Karura_toAccount,
	   } from './Queries.js';


 

//sparkPriceArray
// const sampleData1 = [2,2,2,4,4,5,4,6,5,7,6,8,7,9,8,4,7,6,8,7];
// const sampleData2 = [2,3,4,5,6,5,4,6,5,7,2,3,4,5,3,2,5,4,5,7];
// const sampleData3 = [2,2,4,3,2,4,3,3,4,2,1,3,2,4,2,3,5,4,3,2];
// const sampleData4 = [6,2,3,2,3,5,3,3,7,2,4,7,5,1,3,6,5,9];
// const sampleData5 = [6,2,3,2,3,5,4,3,2,2,4,5,2,5,5,4,3,1,3,4,5,6];
// const sampleData6 = [1,2,3,1,4,2,4,2,2,1,2,5,1,4,1,1,5,4,3,2,4,2];
// const sampleData7 = [2,3,4,5,6,5,4,6,5,7,2,3,4,5,3,2,5,4,5,7];
// const sampleData8 = [2,2,2,4,4,5,4,6,5,7,6,8,7,9,8,4,7,6,8,7];
// const sampleData9 = [1,2,3,1,4,2,4,2,2,1,2,5,1,4,1,1,5,4,3,2,4,2];
 
const MarketCapital = () => {
	const [data, setData] = useState(document.querySelectorAll("#marketCapital tbody tr"));
	const sort = 9;
	const activePag = useRef(0);
	// const [test, settest] = useState(0);

	const [txDataList, setTxDataList] = useState(null);
	const [labelsList, setLabelsList] = useState(null);

	const [explorerOriginChain, setExplorerOriginChain] = useState("Chain");
	const [queryDestination, setQueryDestination] = useState("From");
	const [querriedAccount, setQuerriedAccount] = useState("");

	const [direction, setDirection] = useState("Direction");



	 
    // Active data
	const chageData = (frist, sec) => {
		for (var i = 0; i < data.length; ++i) {
			if (i >= frist && i < sec) {
				data[i].classList.remove("d-none");
			} else {
				data[i].classList.add("d-none");
			}
		}
	};

	//#region
	// const getsparkData = (index) => {
	// 	let dataArray;
	// 	switch (index%9) {
	// 		case 1:
	// 			dataArray = sampleData1;
	// 			break;
	// 		case 2:
	// 			dataArray = sampleData2;
	// 			break;
	// 		case 3:
	// 			dataArray = sampleData3;
	// 			break;
	// 		case 4:
	// 			dataArray = sampleData4;
	// 			break;
	// 		case 5:
	// 			dataArray = sampleData5;
	// 			break;
	// 		case 6:
	// 			dataArray = sampleData6;
	// 			break;
	// 		case 7:
	// 			dataArray = sampleData7;
	// 			break;
	// 		case 8:
	// 			dataArray = sampleData8;
	// 			break;
	// 		case 0:
	// 			dataArray = sampleData9;
	// 			break;
	// 	}
	// 	return dataArray;
	// }
	//#endregion
    
	//#region ORACLE DATA
	//#region
	const refreshData_KaruraDepositsToAcount = (data=null) =>{
        console.log(`refreshData3======>> data: `,data);
		if (data && data.length > 0)
		{
			return data.map((ticker, index) => {

				return (
					<tr key={index} role="row" className={index%2 === 0? "even" : "odd"}> 
						<td className="sorting_1"><span className="rank-ic fs-6">#{index+1}</span></td>
						{/* <td>{ticker.id}</td> */}
						<td>{ticker.blockNum}</td>
						<td>{ticker.timestamp}</td>
						<td>{ticker.fromAccountId32}</td>
						<td>{ticker.toAccountId32Id}</td>
						<td>{ utils.formatUnits( ticker.netReceivedAmount, 12 )}</td>
						<td>{ticker.token}</td>
						<td>{ticker.extrinsicHash}</td>
						<td>{ utils.formatUnits( ticker.treasuryFees, 12 )}</td>
						<td>{ticker.treasuryAddress}</td>
						<td>{ticker.xcmHash}</td>
					</tr>
				)

			});

		}
		else return <tr><td>Loading data...</td></tr>
	}
	//#endregion
	//#region
	const refreshData_MoonriverDepositsToAcount = (data=null) =>{
        console.log(`refreshData3======>> data: `,data);
		if (data && data.length > 0)
		{
			return data.map((ticker, index) => {

				return (
					<tr key={index} role="row" className={index%2 === 0? "even" : "odd"}> 
						<td className="sorting_1"><span className="rank-ic fs-6">#{index+1}</span></td>
						{/* <td>{ticker.id}</td> */}
						<td>{ticker.blockNum}</td>
						<td>{ticker.timestamp}</td>
						<td>{ticker.toAddressId20Id}</td>
						<td>{ utils.formatUnits( ticker.receivedAmount, 12 )}</td>
						<td>{ticker.asset}</td>
						<td>{ticker.extrinsicHash}</td>
						<td>{ticker.sentAtKusamaBlockNum}</td>
						<td>{ticker.dmpQueueID}</td>
						<td>{ utils.formatUnits( ticker.treasuryAmount, 12 )}</td>
						<td>{ticker.treasuryAddress}</td>
						<td>{ticker.downMsgHash}</td>
						<td>{ticker.downwardMsg}</td>
					</tr>
				)

			});

		}
		else return <tr><td>Loading data...</td></tr>
	}
	//#endregion


	const refreshData_MoonriverTransfersFromAccount = (data=null) =>{
        console.log(`refreshData======>> data: `,data);
		if (data && data.length > 0)
		{
			// const numOfData = _oracleData.tickersStrings.length;
			// console.log(`MARKET numOfData: ${numOfData}`)
			return data.map((ticker, index) => {
			// return ["MOVR","GLMR","KAR","ACA","AUSD","KSM"].map((ticker, index) => {

				return (
					<tr key={index} role="row" className={index%2 === 0? "even" : "odd"}> 
						<td className="sorting_1"><span className="rank-ic fs-6">#{index+1}</span></td>
						{/* <td>{ticker.id}</td> */}
						<td>{ticker.blockNum}</td>
						{/* <td>{ticker.blockHash}</td> */}
						<td>{ticker.timestamp}</td>
						<td>{ticker.fromAccountId20Id}</td>
						<td>{ticker.toAccountId32Id}</td>
						<td>{ utils.formatUnits( ticker.sentAmount, 12 ) }</td>
						<td>{ticker.transferredToken}</td>
						<td>{ticker.toChainName}</td>
						<td>{ticker.extrinsicHash}</td>
						<td>{ticker.xcmpMessage}</td>
						<td>{ utils.formatUnits( ticker.treasuryFees, 12 )}</td>
						<td>{ticker.treasuryAdress}</td>
						{/* <td>{"_oracleData.tokenAddresses[index]"}</td> */}
						{/* <td>{ "new Date(1000 * Number( _oracleData.timestamp[index] )).toISOString()" }</td> */}
						{/* <td>
							<svg className="peity-line" width="280" height="50" >
								<Sparklines data={getsparkData(index)}>
								<Sparklines data={getsparkData(10)}>

									<SparklinesLine style={{ strokeWidth: 4, stroke: "#2258bf", fill: "none" }}  />
								</Sparklines>		
							</svg>
						</td> */}
					</tr>
				)

			});

		}
		else return <tr><td>Loading data...</td></tr>
		//#endregion
	}

    //#region
	const labels_MoonriverTransfersFromAccount = () => {
		return (
			<tr role="row">
				<th className="sorting_asc" tabIndex={0}  rowSpan={1} colSpan={1}></th>
				<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>Block Number</th>
				<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>Timestamp</th>
				<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>From account</th>
				<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>To account</th>
				<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>Amount</th>
				<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>Token</th>
				<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>Destination</th>
				<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>ExtrisnicHash</th>
				<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>XCM Message</th>
				<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>Treasury Fees</th>
				<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>Treasury Address</th>
	   		</tr>
		)
	}
    //#endregion
	//#region
	const labels_MoonriverDepositsToAcount = (network="Moonriver") => {
		return (
			<tr role="row">
				<th className="sorting_asc" tabIndex={0}  rowSpan={1} colSpan={1}></th>
				<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>Block Number</th>
				<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>Timestamp</th>
				<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>Deposited to account</th>
				<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>Amount</th>
				<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>Token</th>
				<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>ExtrisnicHash</th>
				<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>sent@KusamaBlockNum</th>
				<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>DmpQueueID</th>
				<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>Treasury Fees</th>
				<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>Treasury Address</th>
				<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>DownMsgHash</th>
				<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>DownwardMsg</th>
	   		</tr>
		)
	}
    //#endregion
	//#region
	const labels_KaruraDepositsToAcount = (network="Moonriver") => {
		return (
			<tr role="row">
				<th className="sorting_asc" tabIndex={0}  rowSpan={1} colSpan={1}></th>
				<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>Block Number</th>
				<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>Timestamp</th>
				<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>From account</th>
				<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>To account</th>
				<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>Amount</th>
				<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>Token</th>
				<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>ExtrisnicHash</th>
				<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>Treasury Fees</th>
				<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>Treasury Address</th>
				<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>XCM Hash</th>
				</tr>
		)
	}
	//#endregion

	//tkD79qwULPRxQTVaKe4zEGMwTh5EjY4gd9s3CXer9XNFGwb 
	const sendRequest_KaruraDepositsToAcount = async (network="Karura", account="") => {	 
		console.log(`SENDING  A SUBQUERY 4`);
		let url;
		if (network==="Karura") url = 'https://api.subquery.network/sq/Entity54/karura_xcm_explorer__RW50a';
		else if (network==="Kusama") url = 'https://api.subquery.network/sq/Entity54/karura_xcm_explorer__RW50a';
		
	    // const query = query_XTokensTransferredMultiAssetsEvents_FromAccount(account);
		const query = query_XcmpQueueEvent_Karura_toAccount(account);
		axios({ url: `${url}`, method: 'post', data: { query: query } })
		.then((result) => {
				console.log("====> GRAPHQL sendRequest 4 ======> : ",result.data)
				const dataArray = result.data.data.xcmpQueueEvents.nodes;
				// setLabelsList(labels_KaruraDepositsToAcount());
				setTxDataList( refreshData_KaruraDepositsToAcount(dataArray) );
		});
	};
    
	//0xa95b7843825449DC588EC06018B48019D1111000
    const sendRequest_MoonriverDepositsToAcount = async (network="Moonriver", account="") => {	
		console.log(`SENDING  A SUBQUERY 3 account: `,account);
		let url;
		if (network==="Moonriver") url = 'https://api.subquery.network/sq/Entity54/moonriver_xcm_explorer__RW50a';
		else if (network==="Karura") url = 'https://api.subquery.network/sq/Entity54/karura_xcm_explorer__RW50a';
		else if (network==="Kusama") url = 'https://api.subquery.network/sq/Entity54/moonriver_xcm_explorer__RW50a';
		
	    // const query = query_XTokensTransferredMultiAssetsEvents_FromAccount(account);
		const query = query_DMPQueueEvent_toAccount(account);
		console.log(`=====> query: `,query);

		axios({ url: `${url}`, method: 'post', data: { query: query } })
		.then((result) => {
			console.log("====> GRAPHQL sendRequest 3 ======> url: ",url);
			console.log("====> GRAPHQL sendRequest 3 ======> query: ",query);
			console.log("====> GRAPHQL sendRequest 3 ======> result: ",result)

				console.log("====> GRAPHQL sendRequest 3 ======> : ",result.data)
				const dataArray = result.data.data.dMPQueueEvents.nodes;
				// setLabelsList(labels_MoonriverDepositsToAcount());
				setTxDataList( refreshData_MoonriverDepositsToAcount(dataArray) );
		});
	};

	const sendRequest_MoonriverTransfersFromAccount_KSM = async (network="Moonriver", account="") => {
		console.log(`SENDING  A SUBQUERY 2`);
		let url;
		if (network==="Moonriver") url = 'https://api.subquery.network/sq/Entity54/moonriver_xcm_explorer__RW50a';
		else if (network==="Karura") url = 'https://api.subquery.network/sq/Entity54/karura_xcm_explorer__RW50a';
		else if (network==="Kusama") url = 'https://api.subquery.network/sq/Entity54/moonriver_xcm_explorer__RW50a';
		
	    // const query = query_XTokensTransferredMultiAssetsEvents_FromAccount(account);
		const query = query_XTokensTransferredEvents_FromAccount(account);
		axios({ url: `${url}`, method: 'post', data: { query: query } })
		.then((result) => {
				console.log("====> GRAPHQL sendRequest 2 ======> : ",result.data)
				const dataArray = result.data.data.xTokensTransferredEvents.nodes;
				// setLabelsList(labels_MoonriverTransfersFromAccount());
				setTxDataList( refreshData_MoonriverTransfersFromAccount(dataArray) );
		});
	};

	const sendRequest_MoonriverTransfersFromAccount = async (network="Moonriver", account="tkD79qwULPRxQTVaKe4zEGMwTh5EjY4gd9s3CXer9XNFGwb") => {
		console.log(`SENDING  A SUBQUERY account: `,account);
		let url;
		if (network==="Moonriver") url = 'https://api.subquery.network/sq/Entity54/moonriver_xcm_explorer__RW50a';
		else if (network==="Karura") url = 'https://api.subquery.network/sq/Entity54/karura_xcm_explorer__RW50a';
		else if (network==="Kusama") url = 'https://api.subquery.network/sq/Entity54/moonriver_xcm_explorer__RW50a';
		
	    const query = query_XTokensTransferredMultiAssetsEvents_FromAccount(account);
	    // const query = query_XTokensTransferredMultiAssetsEvents_FromAccount("0xa95b7843825449DC588EC06018B48019D1111000");
	    // const query = query_XTokensTransferredMultiAssetsEvents_FromAccount("tkD79qwULPRxQTVaKe4zEGMwTh5EjY4gd9s3CXer9XNFGwb");

		axios({ url: `${url}`, method: 'post', data: { query: query } })
		.then((result) => {
				console.log("====> GRAPHQL sendRequest 1 ======> : ",result.data)
				// refreshData(result.data);
				const dataArray = result.data.data.xTokensTransferredMultiAssetsEvents.nodes;
				// setLabelsList(labels_MoonriverTransfersFromAccount());
				// setTxDataList( refreshData_MoonriverTransfersFromAccount(dataArray) );
                
				if (network==="Moonriver")  //To capture transfers from Moonriver to both Karura and Kusama
				{
		            const query2 = query_XTokensTransferredEvents_FromAccount(account);
					axios({ url: `${url}`, method: 'post', data: { query: query2 } })
					.then((result2) => {
							console.log("====> GRAPHQL sendRequest 2 ======> : ",result2.data)
							const dataArray2 = result2.data.data.xTokensTransferredEvents.nodes;
							console.log(`dataArray2: `,dataArray2);
							console.log(`dataArray: `,dataArray);

							const data = [...dataArray,...dataArray2]; 
							setTxDataList( refreshData_MoonriverTransfersFromAccount(data) );
					});
				}
				else setTxDataList( refreshData_MoonriverTransfersFromAccount(dataArray) );

				//#region Example
				// {data: {…}}
				// data:
				// xTokensTransferredMultiAssetsEvents:
				// nodes: Array(2)
				// 0: {id: '1846865-41', blockNum: '1846865', blockHash: '0xf4be49a835164313d2d91c631fe4a76cb77fb5b94ab53bec4b75bb05ecc2f7e8', timestamp: '2022-05-17T18:58:18.246', extrinsicHash: '0x97fdee85bffe606f0f7af36e02a177afd1fa97973cb933f74b08d8d777dfc7e3', …}
				// 1: {id: '1847176-5', blockNum: '1847176', blockHash: '0xd2c95be65851cf8849c41efed415307e482a8922d05284e113529ce323f0b285', timestamp: '2022-05-17T20:07:54.64', extrinsicHash: '0x4956acf2d2c01edcb807f2cd4c2ecacd895c899c430eacbfc76a0b1da3a94a28', …}
				// 2: {id: '1847698-21', blockNum: '1847698', blockHash: '0xfc000cef51fdd4392f327f26dd7f697d2b2022ea5e7a21338df59191a36376f1', timestamp: '2022-05-17T22:06:48.288', extrinsicHash: '0x2904e459c46c2d3fe7df64b85d691573d2b2cc89638f914af2a2eb7014f0755f', …}
				// length: 5
				//#endregion 
		});
	};

		
	// useEffect(() => {
	// 	console.log(`Running useEffect for Oracle Data`);
	// 	// setOracleDataList( refreshData(oracleData) );
	// 	// sendRequest("Moonriver");

	// }, [oracleData]);

	useEffect(() => {
		console.log(`sendRequest is Running Ole ====>`);
		setLabelsList(labels_MoonriverTransfersFromAccount());
		sendRequest_MoonriverTransfersFromAccount("Karura");
		// sendRequest_MoonriverTransfersFromAccount_KSM();
		// sendRequest_MoonriverDepositsToAcount();
		// sendRequest_KaruraDepositsToAcount();
	}, []);


	// useEffect(() => {
	// 	setData(document.querySelectorAll("#marketCapital tbody tr"));
	// }, [test]);

  // Active pagginarion
	activePag.current === 0 && chageData(0, sort);
	// paggination
	let paggination = Array(Math.ceil(data.length / sort))
		.fill()
		.map((_, i) => i + 1);

  // Active paggination & chage data
	const onClick = (i) => {
		activePag.current = i;
		chageData(activePag.current * sort, (activePag.current + 1) * sort);
		// settest(i);
	};

    //#region 
	const submitQuery = () => {
		console.log(`The Query that will be submitted reads explorerOriginChain:${explorerOriginChain} queryDestination:${queryDestination} querriedAccount:${querriedAccount}`);
		if (explorerOriginChain==="Moonriver" && queryDestination==="From")
		{
			console.log(`Will send Query ${explorerOriginChain} ${queryDestination}`)
			setLabelsList(labels_MoonriverTransfersFromAccount());
     		sendRequest_MoonriverTransfersFromAccount("Moonriver",querriedAccount);
		}
		else if (explorerOriginChain==="Moonriver" && queryDestination==="To")
		{
			console.log(`Will send Query ${explorerOriginChain} ${queryDestination}`)
			setLabelsList(labels_MoonriverDepositsToAcount());
			sendRequest_MoonriverDepositsToAcount("Moonriver",querriedAccount);
		}
		else if (explorerOriginChain==="Karura" && queryDestination==="From")
		{
			console.log(`Will send Query ${explorerOriginChain} ${queryDestination}`)
			setLabelsList(labels_MoonriverTransfersFromAccount());
			sendRequest_MoonriverTransfersFromAccount("Karura",querriedAccount);
			//TODO COMBINE WITH sendRequest_KaruraDepositsToAcount FOR KUSD/AUSD

		}
		else if (explorerOriginChain==="Karura" && queryDestination==="To")
		{
			console.log(`Will send Query ${explorerOriginChain} ${queryDestination}`)
			setLabelsList(labels_KaruraDepositsToAcount());
			sendRequest_KaruraDepositsToAcount("Karura",querriedAccount);
		}
		else if (explorerOriginChain==="Kusama"  && queryDestination==="From")
		{
			console.log(`Will send Query ${explorerOriginChain} ${queryDestination}`)
		}
		else if (explorerOriginChain==="Kusama"  && queryDestination==="To")
		{
			console.log(`Will send Query ${explorerOriginChain} ${queryDestination}`)
		}
		

	};
    //#endregion 

	const queryFilterOptions =   (			
		<div className="form-group">
			<div className="input-group input-group-lg">
			<div className="input-group-prepend">
					<Dropdown>
						<Dropdown.Toggle variant="" as="div" className="input-group-text form-control style-2 default-select cursor-pointer" style={{width:"180px"}}>{explorerOriginChain}</Dropdown.Toggle>
						<Dropdown.Menu style={{height:"150px", overflowY: "scroll"}}> 
									<Dropdown.Item key={1} onClick={() => { 
										setExplorerOriginChain("Moonriver");
										console.log(`Chosen chain is Moonriver`);
									} }>Moonriver</Dropdown.Item>
									<Dropdown.Item key={2} onClick={() => { 
										setExplorerOriginChain("Karura");
										console.log(`Chosen chain is Karura`);
									} }>Karura</Dropdown.Item>
									<Dropdown.Item key={3} onClick={() => { 
										setExplorerOriginChain("Kusama");
										console.log(`Chosen chain is Kusama`);
									} }>Kusama</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>

				</div>
				<div className="input-group-prepend">
					<Dropdown>
						{/* <Dropdown.Toggle variant="" as="div" className="input-group-text form-control style-2 default-select cursor-pointer" style={{width:"180px"}}>{queryDestination} Account</Dropdown.Toggle> */}
						<Dropdown.Toggle variant="" as="div" className="input-group-text form-control style-2 default-select cursor-pointer" style={{width:"180px"}}>{direction}</Dropdown.Toggle>

						<Dropdown.Menu style={{height:"150px", overflowY: "scroll"}}> 
									<Dropdown.Item key={1} onClick={() => { 
										setQueryDestination("From");
										setDirection("Outgoing");
										console.log(`Chosen chain is From`);
									} }>Outgoing</Dropdown.Item>
									<Dropdown.Item key={2} onClick={() => { 
										setQueryDestination("To");
										setDirection("Incoming");
										console.log(`Chosen chain is To`);
									} }>Incoming</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>

				</div>
				<div>
					<input type="text" className="form-control" value={querriedAccount} placeholder={"Account Address"} onChange = {(event) => setQuerriedAccount(event.target.value)} style={{fontSize: "16px", color: "white", textAlign:"center", width:"500px"}} />
				</div>
				<div className="dataTables_paginate " id="" style={{color:"white"}}>
				<span className="paginate_button previous disabled" to=""  onClick = {submitQuery}>
									GET DATA
								</span>
				{/* <button className="btn-primary paginate_button previous " style={{border: "none", color:"white"}} ><span className="" to="">GET DATA</span></button>  */}
					{/* <div className="col-sm-6"  style={{marginTop:"20px"}}> */}
										{/* <Link to={"#"} className="btn btn-primary d-block btn-lg rounded"> */}
    				                    	{/* <button className="btn-primary" disabled = { swapWithExactSupply_IsSubmiting } onClick = { _swapWithExactSupply } style={{border: "none"}}>SEND</button>  */}
    				                    	{/* <button className="btn-primary" disabled = { false } style={{border: "none"}}>SEND</button>  */}
											{/* <button className="btn-primary" disabled={transfer_IsSubmiting} style={{border: "none"}}  onClick = {transferBalance}>SEND</button>  */}
											{/* <button className="btn-primary"   style={{border: "none"}}  >SEND</button> 

										</Link>
					</div>*/}
				</div> 
			</div>
		</div>
	)
	
	
  return (
    <>
		<div className="row">
			<div className="col-xl-12">
				<div className="table-responsive table-hover fs-14 " style={{backgroundColor:"", height:"75vh"}}>
					
					<div id="example6_wrapper" className="dataTables_wrapper no-footer">
						<table className="table display  mb-4 dataTablesCard   market-tbl  border-no  text-black no-footer border-0" 
							id="marketCapital" role="grid" aria-describedby="example6_info" style={{backgroundColor:"", margin:"10px", width:"99%"}}> 
							<thead>
				          	    <tr role="row">
								 	<td className="" tabIndex={0}  rowSpan={1} colSpan={1}>{queryFilterOptions}</td>
									{/* <th className="" tabIndex={0}  rowSpan={1} colSpan={1}>Block Number</th> */}
								</tr>
							</thead>
						</table>
					</div>

					
					
					<div id="example6_wrapper" className="dataTables_wrapper no-footer">
						<table className="table display  mb-4 dataTablesCard   market-tbl  border-no  text-black no-footer border-0" 
							id="marketCapital" role="grid" aria-describedby="example6_info" style={{backgroundColor:"", margin:"10px", width:"99%"}}> 
							<thead>
								{/* <tr role="row">
								    <th className="sorting_asc" tabIndex={0}  rowSpan={1} colSpan={1}>#</th> */}
									{/* <th className="sorting_asc" tabIndex={0}  rowSpan={1} colSpan={1}>Block Number</th> */}
									{/* <th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>Block Number</th> */}
									{/* <th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>Block Hash</th> */}
									{/* <th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>Timestamp</th>
									<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>From account</th>
									<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>To account</th>
									<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>Amount</th>
									<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>Token</th>
									<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>Destination</th>
									<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>ExtrisnicHash</th>
									<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>XCM Message</th>
									<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>Treasury Fees</th>
									<th className="sorting" tabIndex={0}  rowSpan={1} colSpan={1}>Treasury Address</th>
							   </tr> */}
							   {labelsList? labelsList : " " }
							</thead>
							<tbody>
								{txDataList}
							</tbody>
						</table>
						{/* <div className="d-sm-flex text-center justify-content-between align-items-center mt-3">
							<div className="dataTables_info">
								  Showing {activePag.current * sort + 1} to{" "}
								  {data.length > (activePag.current + 1) * sort
									? (activePag.current + 1) * sort
									: data.length}{" "}
								  of {data.length} entries
							</div>
							<div className="dataTables_paginate paging_simple_numbers" id="example5_paginate">
								<span className="paginate_button previous disabled" to="">
									Previous
								</span>
								  <span> 
									{paggination.map((number, i) => (
										<span key={i} to="/market-capital" onClick={onClick(i)} className={`paginate_button  ${ activePag.current === i ? "current" : "" } `}  
											style={{ display: "inline-block" }}>{number}
										</span>
									))}
								  </span>
								<span className="paginate_button next" to="">
									Next
								</span>
							</div>
						</div> */}
					</div>
				</div>
			</div>
		</div>
    </>
  );
};

export default MarketCapital;
