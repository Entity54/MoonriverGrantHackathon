
const query_XTokensTransferredMultiAssetsEvents_FromAccount = (account) => {
    let filter;
    if (account!=="") filter=`(filter: {fromAccountId20Id: {equalTo:"${account}"}})`;
    else filter="";

    const query =
            `
                query {
                    xTokensTransferredMultiAssetsEvents  ${filter}  {
                        nodes   {
                                    id,
                                    blockNum,
                                    blockHash,
                                    timestamp,
                                    extrinsicHash,
                                    fromAccountId20Id,
                                    transferredToken,
                                    sentAmount,
                                    toAccountId32Id,
                                    treasuryFees,
                                    treasuryAdress,
                                    toChainName,
                                    xcmpMessage,
                                }
                    }
                }
            `;
    return query
};


const query_XTokensTransferredEvents_FromAccount = (account) => {
    let filter;
    if (account!=="") filter=`(filter: {fromAccountId20Id: {equalTo:"${account}"}})`;
    else filter="";

    const query =
            `
                query {
                    xTokensTransferredEvents  ${filter}  {
                        nodes   {
                                    id,
                                    blockNum,
                                    blockHash,
                                    timestamp,
                                    extrinsicHash,
                                    fromAccountId20Id,
                                    transferredToken,
                                    sentAmount,
                                    toAccountId32Id,
                                  
                                    treasuryFees,
                                    treasuryAdress,
                                }
                    }
                }
            `;
    return query
};



const query_DMPQueueEvent_toAccount = (account) => {
    const query =
            `
                query {
                    dMPQueueEvents  (filter: {toAddressId20Id: {equalTo:"${account}"}})  {
                        nodes   {
                                    blockNum,
                                    blockHash,
                                    timestamp,
                                    signer,
                                    toAddressId20Id 
                                    receivedAmount,
                                    asset,
                                    extrinsicHash,
                                    sentAtKusamaBlockNum
                                    dmpQueueID,
                                    treasuryAmount,
                                    treasuryAddress,
                                    downwardMsg,
                                    downMsgHash,
                                    weightUsed,
                                }
                    }
                }
            `;
    return query
};


const query_XcmpQueueEvent_Karura_toAccount = (account) => {
    const query =
            `
                query {
                    xcmpQueueEvents  (filter: {toAccountId32Id: {equalTo:"${account}"}})  {
                        nodes   {
                                    blockNum,
                                    blockHash,
                                    timestamp,
                                    fromAccountId32,
                                    toAccountId32Id,
                                    netReceivedAmount,
                                    token,
                                    extrinsicHash,
                                    treasuryFees,
                                    treasuryAddress,
                                    xcmHash,
                                }
                    }
                }
            `;
    return query
};





export {
    query_XTokensTransferredMultiAssetsEvents_FromAccount,
    query_XTokensTransferredEvents_FromAccount,
    query_DMPQueueEvent_toAccount,
    query_XcmpQueueEvent_Karura_toAccount,
    
 };