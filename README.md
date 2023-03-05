# ethdenver-aa
The first modular implementation of Account Abstraction (ERC4337) using (modified) Diamond Proxies (ERC2535).

## Team
Hackers from Oxford Blockchain Society - with funding and support from EduDAO and SozuHaus
- Alex Cheema
- Konrad Kopp
- Mohamed Baioumy
- Ollie Turnbull

## Instillation


### Smart Contract Deployment

### zksync

Smart contracts can be compiled and deployed using the following commands 
```shell
npx hardhat compile --network zkSyncTestnet  
npx hardhat deploy-zksync --script deploy_zksync.js --network zkSyncTestnet
```

### EVM networks
For all other networks, the following commands can be run:
```shell
npx hardhat run deploy/deploy.js --network {network_name}
```
The supported networks are:
- Goerli testnet (using tenderly web3 gateway)
- Mumbai
- Base Goerli
- Scroll Alpha testnet
The network names can be found in aa-blockchain/hardhat.config.js

