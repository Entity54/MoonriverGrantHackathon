# MOONBEAM(PURESTAKE) ETHDenver Hackathon

Our project shows how we can use the power of XCM, its different protocols and channels and the powerful representation of native Substrate tokens in Moonbeam, Moonriver and MoonbaseAlpha testnet chains

## The Dapp is a GUI that allows four ways of transfers
We have focused on Moonbasealpha testnet and its Relay Alphanet
UNIT is the native token of Alphanet Relay and what KSM is for Kusama and DOT for Polkadot 

The user can:
a) Send UNIT from his Alphanet Relay to MoonbaseAlpha testnet
   Once his asset arrives it is representated by xcUNIT and xcToken eequivalent 
b) Since xcUNIT mimics classic ERC20 interface, we can approve it for someone to transferFrom us, transfer it to another EVM account, increase allowance etc.
c) Next we can send back the xcUNIT from the parachain level of MoonbaseAlpha to the Alphanet Relay.
   Inversely to the previous transaction we see xcUNIT being replaced for native UNIT tokens in the Relay chain
d) The last action the user can do is trsnfer natively the UNIT takens from one Realy account to another

In the project directory, you can run:


Moonbeam_ETHDenverHackathonBounty2.png




