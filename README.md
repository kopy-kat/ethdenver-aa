# ethdenver-aa
The first modular implementation of Account Abstraction (ERC4337) using (modified) Diamond Proxies (ERC2535).

## Team
Hackers from Oxford Blockchain Society - with funding and support from EduDAO and SozuHaus
- Alex Cheema
- Konrad Kopp
- Mohamed Baioumy
- Ollie Turnbull

## Installation


### Smart Contract Deployment

Networks with lower gas costs are preferred (such as Polygon, or other L2s), as the infrastrucutre involves complex smart contracts which entail higher gas costs for execution.

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


## Long Description

### Problems

Current solution for account abstraction have three main problems: opinionated smart contract wallets, vendor lock-in & duplication of engineering work.

Most smart contract wallets that are currently being built are opinionated in the sense that developers decide on the features that users will get and the user cannot decide what features to use based on their preference. As a result, user preferences are never really met, creating a large inefficiency in the space.

Secondly, all smart contract wallets to date lock users into using a specific interface. It has so far been impossible for Safe users to switch to Argent or from Argent users to switch to Soul wallet without needing to create a new wallet and port over all their assets. It is obvious that this creates an extreme vendor lock-in and strong market power of individual wallets (which usually entails very little innovation).

Finally, because all smart contract wallet implementations are pretty much building their entire infrastructure from the ground up, a large part of the engineering work happening in the space is duplicated. The promise is that this will improve using the ERC-4337 standard, meaning the teams will not need to build the infrastructure (e.g. bundler/relayer, etc) but can focus on the implementation. However, so far, it seems that most teams have spent most of their engineering efforts on implementing the user interface and basic features, such as email recovery or batch transactions.

### Solution

The dream solution to these problems is infrastructure for smart contract wallets that allows them to be simple, custom and modular. Firstly, the dream solution should be easy for anyone to use, even with very little understanding of Ethereum and the ERC-4337 infrastructure. Secondly, the user should be able to choose all the features that they want and not be required to use features that they do not want. Finally, and related to the second point, features should be easy to select and edit, as well as being easy for developers to build.

### Architecture

In order to combat the problems mentioned above and build a product that satisfies the dream solution, we have combined ERC-4337 (Account Abstraction via an alt mempool) and ERC-2535 (Diamond Proxy Pattern). As far as we know, and according to Nick Mudge (the main author of ERC-2535) this is the first implementation of ERC-4337 using the diamond proxy pattern.

The diamond proxy pattern allows developers to split a smart contract into a state contract and multiple logic contracts (as opposed to a single logic contract for UUPS or transparent proxies). The main reason behind this is to allow smart contracts to have more functionality (by getting around the 24kb size limit) and in order to reuse stateless contracts without needing to deploy them for every consumer contract. This is ideal for our use-case, allowing us to split a smart contract wallet into a stateful contract, holding core logic, and multiple, re-usable plugin contracts. These plugin contracts are stateless, meaning that a user only needs to deploy the main account contract and can add and remove plugins at will - without needing to re-deploy any contract.

On the first iteration of building rhinestone, we simply combined the two standards by using an ERC-4337 wallet as a facet of a main diamond contract. However, we are able to reduce gas cost of both deployment and usage, making it easier and cheaper to add and remove plugins and remove redundant code by combining the two standards. Therefore, on the second iteration, we created a custom implementation of diamond proxies that uses core ERC-4337 logic in the main diamond contract. On top of this, we implement hooks that call pre-defined plugins based on how the contract is called. For example, when the EntryPoint calls the execute function, the "_preExecute" hook is called before the UserOperation is executed and finally the "_postExecute" hook is called. A similar pattern is used for the other functions, including validate, receive and fallback.

On top of the implementation of this protocol, we have also built the infrastructure to programatically create, edit and deploy smart contract wallets. We have built a frontend with a drag-and-drop UI allowing users to simply select the plugins they want in their wallets. Depending on the plugin, the user might be prompted to configure the plugin by adding required variables. Then, we translate this into code and create the smart contract as specified above. Using CREATE2, we deterministically create the contract address to allow users to receive funds before deploying the contract. For the scope of this hackathon, we completely abstract the deployment gas cost away from the user and relay it instead. Users can also edit deployed wallets at any time by adding or removing plugins as well as initialising or changing configuration variables.

Finally, we have built a number of plugins for different use-cases, including plugins that allow users to interface with the wallet, recover their accounts, use banking features, such as savings accounts or retirement funds and more. We have deployed those plugins to selected testnets and have tested them.

### Product

As mentioned above, the product that we built on top of this standard is a simple drag-and-drop UI for users to easily create smart contract wallets with only those features that they want. Further, the user can edit the wallet on the go, making it very easy for them to ensure that their wallet always matches their preferences. This means that users can switch out (or add on top of) the interface through which they interact with the wallet, thus getting around the problem of vendor lock-in. You can see exactly how this product works in the demo video above.

### Future

We think that modular account abstraction would be a huge step for both the AA space and the mainstream adoption of Ethereum. The reason for this is that it solves all three of the problems mentioned above. It allows for flexible, customizable smart contract wallets and creates an open-source ecosystem in which developers focus on building features rather than building the same basic infrastructure in parallel. On top of this, we envision a marketplace for presets around common functionality, such as a gaming preset or a fintech preset. This would allow for even easier onboarding, as brands could onboard users with a preset wallet that fits the use-case of the brand. Users, however, could then modify their wallet permissionlessly to cater it exactly to what they want their wallet to do.
