import React, { useEffect, useState } from 'react'    
import { Dropdown } from "react-bootstrap";
 

const Header = ({ setupSpecs, blockHeader, polakdotSignerfunction, polkadtoAccountList, evm_api_state, accountList }) => {

	const [dropdowncolor, setDropdowncolor] = useState("#DE5106");
	const [dropdownDisabled, setDropdownDisabled] = useState(true);		

	const pdotAccountsList = ["Polkadot_KSM","Polkadot_KAR","Polkadot_AUSD"];
	const [polkadotAccount, setPolkadotAccount] = useState("");
	const [polkadotAccountsDropDown, setPolkadotAccountsDropDown] = useState("");

  const [metamaskAccount, setMetaMaskAccount] = useState("Reading MetaMask Extension");
	const [metamaskAccountsDropDown, setMetaMaskAccountsDropDown] = useState("");
  

  useEffect(() => {
      if (evm_api_state)
      {
        setDropdowncolor("white");
        setDropdownDisabled(false);
      } else {
        setDropdowncolor("#DE5106");
        setDropdownDisabled(true);
      }
  },[evm_api_state])


    
  useEffect(() => {
    setPolkadotAccountsDropDown( refreshPolkadotAccountsList(polkadtoAccountList) );
    console.log("Header polkadtoAccountList=> ",polkadtoAccountList);
    if (polkadtoAccountList.length > 0)
    {
      setPolkadotAccount(polkadtoAccountList[0]);
      polakdotSignerfunction(polkadtoAccountList[0]);
    }

  },[polkadtoAccountList])

  useEffect(() => {
    setMetaMaskAccountsDropDown( refreshMetaMaskAccountsList(accountList) );
  },[accountList])

  //#region Polkadot Accounts Drop List
  const refreshPolkadotAccountsList = (tokens) =>{
    if (tokens)
    {
      return tokens.map((token, index) => {
        return (
          <Dropdown.Item key={index}  onClick={() => { 
            setPolkadotAccount(token);
            polakdotSignerfunction(token);
            console.log(`Polkadot Account is: ${token}`);
        } }>{token}</Dropdown.Item>
        )
      });
    }
    else return <>Loading data...</> 
  }
  
  const polokadotAccountMenu =   (			
    <div className="form-group">
      <div className="input-group input-group-lg">
        <div className="input-group-prepend">
          <Dropdown className="weather-btn mb-2" style={{backgroundColor:"#171622", marginTop:"20px",}}>
            <Dropdown.Toggle variant="" as="div" className="input-group-text form-control style-2 default-select cursor-pointer" style={{width:"600px", fontSize:"12px", color: dropdowncolor,  backgroundColor:"#171622"}}>
              {/* {polkadotAccount} */}
              <span className="fs-22 font-w600 d-flex" style={{color: dropdowncolor,  backgroundColor:"#171622"}}><i className="fa fa-google-wallet me-3 ms-3">Polkadot</i></span>
              <span className="fs-14 font-w600 d-flex" style={{color: dropdowncolor, backgroundColor:"#171622", marginRight:"10px"}}>{polkadotAccount? polkadotAccount : "Sign in to Polkadot Extension"}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu style={{height:"500px", width:"500px", overflowY: "scroll", fontSize:"14px"}}>{polkadotAccountsDropDown}</Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
          )
  //#endregion


  //#region MetaMask Accounts Drop List
  const refreshMetaMaskAccountsList = (tokens) =>{
    if (tokens)
    {
      return tokens.map((token, index) => {
        return (
          <Dropdown.Item key={index}  onClick={() => { 
            setMetaMaskAccount(token);
            console.log(`MetaMask Account is: ${token}`);
        } }>{token}</Dropdown.Item>
        )
      });
    }
    else return <>Loading data...</> 
  }
  
  const metamaskAccountMenu =   (			
    <div className="form-group">
      <div className="input-group input-group-lg">
        <div className="input-group-prepend">
          <Dropdown className="weather-btn mb-2" style={{backgroundColor:"#171622", marginTop:"20px",}}>
            <Dropdown.Toggle variant="" as="div" className="input-group-text form-control style-2 default-select cursor-pointer" style={{width:"600px", fontSize:"14px", color: dropdowncolor,  backgroundColor:"#171622"}}>
              {/* {metamaskAccount} */}
              <span className="fs-22 font-w600 d-flex" style={{color: dropdowncolor,  backgroundColor:"#171622"}}><i className="fa fa-google-wallet me-3 ms-3"></i></span>
              <span className="fs-14 font-w600 d-flex" style={{color: dropdowncolor, backgroundColor:"#171622", marginRight:"10px"}}>{metamaskAccount? metamaskAccount : "Sign in to MetaMask Extension"}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu style={{height:"500px", width:"500px", overflowY: "scroll", fontSize:"14px"}}>{metamaskAccountsDropDown}</Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
          )
  //#endregion




  return (
    <div className="header">
      <div className="header-content">
        <nav className="navbar navbar-expand">
          <div className="collapse navbar-collapse justify-content-between">

            <div className="header-left">
                <li className="nav-item">
                  <div  style={{ width: "30vw"}}> 
                    {/* <div style={{ width: "100v%" }}> 
                    TODO GENERAL INFO
                    </div>  */}
                  </div>
                </li>
            </div>

            <div className="header-left">
                {/* <ul className="navbar-nav  main-notification" style={{backgroundColor:""}}>
                  {metamaskAccountMenu}
                </ul> */}

                <Dropdown className="weather-btn mb-2" style={{backgroundColor:"#171622", fontSize:"14px", marginTop:"20px" }}>
                    <span className="fs-22 font-w600 d-flex" style={{color: dropdowncolor,  backgroundColor:"#171622"}}><i className="fa fa-google-wallet me-3 ms-3">MetaMask</i></span>
                    <span className="fs-14 font-w600 d-flex" style={{color: dropdowncolor, backgroundColor:"#171622", marginRight:"10px"}}>{accountList? accountList : "Sign in to Metamask"}</span>
                </Dropdown>  
            </div>
            <div className="header-left">
                <ul className="navbar-nav  main-notification" style={{backgroundColor:""}}>
                   {polokadotAccountMenu}
                </ul>
            </div>



            {/* <ul className="navbar-nav header-right main-notification" style={{backgroundColor:""}}> */}
              {/* <Dropdown className="weather-btn mb-2" style={{backgroundColor:"#171622"}}>
                    <span className="fs-22 font-w600 d-flex" style={{color: dropdowncolor,  backgroundColor:"#171622"}}><i className="fa fa-google-wallet me-3 ms-3"></i></span>
                    <span className="fs-14 font-w600 d-flex" style={{color: dropdowncolor, backgroundColor:"#171622", marginRight:"10px"}}>{accountList? accountList : "Sign in to Metamask"}</span>
              </Dropdown>   */}


{/* 
              <div className="timeline-panel" style={{ marginTop:"20px", }}>
                    <div className="media me-2">
                      TODO IDENTICON
                    </div>
                    <div className="media-body" style={{ marginTop:"5px", }}>
                      <h6 className="mb-1">{selectedAccountName}</h6>
                    </div>
              </div> */}

            {/* </ul> */}

          </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;
