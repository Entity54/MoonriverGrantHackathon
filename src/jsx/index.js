import React, { useContext } from "react";

/// React router dom
import {  Switch, Route } from "react-router-dom";
   
/// Css 
import "./index.css";
import "./chart.css";
import "./step.css";

/// Layout
import Header from "./layouts/nav/Header";
import NAV_NavHade from "./layouts/nav/NavHader";
import NAV_SideBar from "./layouts/nav/SideBar";
import Footer from "./layouts/Footer";
/// Dashboard
import DashboardDark from "./components/Dashboard/DashboardDark";
import DEX from "./components/Dashboard/DEX";
import Portofolio from "./components/Dashboard/Portofolio";
import QuickTransfer from '../ntt54_QuickTransfer';
 

import { ThemeContext } from "../context/ThemeContext"; 

const Markup = ( { setupSpecs, polakdotSignerfunction, polkadtoAccountList, relaySpecs, karuraAlphaSpecs, portfolio, oracleData, blockChainSpecs, blockHeader, blockTimestamp, evm_api_state, accountList, selectedAccountName, polakdotAccountSigner }) => {

  const { menuToggle } = useContext(ThemeContext);

  let path = window.location.pathname;
  path = path.split("/");
  path = path[path.length - 1];

  let pagePath = path.split("-").includes("page");
  return (
    <>
      <div id={`${!pagePath ? "main-wrapper" : ""}`} className={`${!pagePath ? "show" : "mh100vh"}  ${menuToggle ? "menu-toggle" : ""}`}>

        {!pagePath && <Header setupSpecs={setupSpecs} polakdotSignerfunction={polakdotSignerfunction} polkadtoAccountList={polkadtoAccountList} evm_api_state={evm_api_state} blockHeader={blockHeader} accountList={accountList}/>}
        {!pagePath && <NAV_NavHade blockHeader={blockHeader} />}
        {!pagePath && <NAV_SideBar />}

        <div className={`${!pagePath ? "content-body" : ""}`} style={{marginBottom:"-450px"}}>
          <div
            className={`${!pagePath ? "container-fluid" : ""}`}
            style={{ minHeight: window.screen.height - 60 }}
          >
            <Switch>
              {/* <Route exact path='/'> <DashboardDark setupSpecs={setupSpecs} oracleData={oracleData} blockHeader={blockHeader} accountList={accountList} /> </Route> */}
              {/* <Route exact path='/'> <DEX  setupSpecs={setupSpecs} portfolio={portfolio} oracleData={oracleData} blockHeader={blockHeader} accountList={accountList} /> </Route> */}

              <Route exact path='/dashboard-dark'> 
                    {/* <DashboardDark setupSpecs={setupSpecs} oracleData={oracleData} blockHeader={blockHeader} accountList={accountList} />  */}
                     {/* <DEX  setupSpecs={setupSpecs} relaySpecs={relaySpecs} karuraAlphaSpecs={karuraAlphaSpecs} portfolio={portfolio} oracleData={oracleData} blockHeader={blockHeader} accountList={accountList} />  */}
                     <DEX  setupSpecs={setupSpecs} relaySpecs={relaySpecs} karuraAlphaSpecs={karuraAlphaSpecs} blockHeader={blockHeader}  accountList={accountList}  polakdotAccountSigner={polakdotAccountSigner} /> 

              </Route>
              {/* <Route exact path='/portofolio'> <Portofolio  setupSpecs={setupSpecs} portfolio={portfolio} blockHeader={blockHeader} accountList={accountList}/> </Route> */}
              {/* <Route exact path='/portofolio'> 
	   					    <QuickTransfer setupSpecs={setupSpecs} relaySpecs={relaySpecs} karuraAlphaSpecs={karuraAlphaSpecs} portfolio={portfolio} blockHeader={blockHeader}/>
              </Route> */}
              <Route exact path='/'> 
	   					    {/* <QuickTransfer setupSpecs={setupSpecs} relaySpecs={relaySpecs} karuraAlphaSpecs={karuraAlphaSpecs} portfolio={portfolio} blockHeader={blockHeader}/> */}
                   <DEX  setupSpecs={setupSpecs} relaySpecs={relaySpecs} karuraAlphaSpecs={karuraAlphaSpecs} blockHeader={blockHeader}  accountList={accountList}  polakdotAccountSigner={polakdotAccountSigner} /> 


              </Route>

              <Route exact path='/dex'> 
                  {/* <DEX  setupSpecs={setupSpecs} relaySpecs={relaySpecs} karuraAlphaSpecs={karuraAlphaSpecs} portfolio={portfolio} oracleData={oracleData} blockHeader={blockHeader} accountList={accountList} />  */}
                    {/* <DashboardDark setupSpecs={setupSpecs} oracleData={oracleData} blockHeader={blockHeader} accountList={accountList} />  */}
                    <DashboardDark/> 

              </Route>
            </Switch> 
          </div>
        </div>
        {!pagePath && <Footer />}
      </div>
    </>
  );
};

export default Markup;
