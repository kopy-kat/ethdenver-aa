import { chains } from "./chains";

interface PluginCategory {
  id: number;
  name: string;
  description: string;
  backgroundColor: string;
  textColor: string;
  buttonBackgroundColor: string;
  buttonTextColor: string;
}

export const pluginCategories = [
  {
    id: 1,
    name: "Signature",
    description: "category1",
    backgroundColor: "blue",
    textColor: "zincLight",
    buttonBackgroundColor: "zincLight",
    buttonTextColor: "zincDark",
  },
  {
    id: 2,
    name: "Recovery",
    description: "category2",
    backgroundColor: "green",
    textColor: "zincLight",
    buttonBackgroundColor: "zincLight",
    buttonTextColor: "zincDark",
  },
  {
    id: 3,
    name: "Savings",
    description: "category3",
    backgroundColor: "purple",
    textColor: "zincLight",
    buttonBackgroundColor: "zincLight",
    buttonTextColor: "zincDark",
  },
];

export const plugins = [
  {
    id: 1,
    name: "Plugin",
    description: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed euismod erat. Curabitur sed sapien efficitur, gravida massa ac, feugiat tortor. Nullam efficitur massa tortor, vitae ultricies ante mattis id. Maecenas egestas eros ac vehicula semper. Sed mi dui, condimentum in vulputate quis, tristique sit amet odio. Sed condimentum dui ac bibendum cursus. Pellentesque finibus tincidunt ligula vel rhoncus. Quisque ultricies tempus hendrerit. Praesent efficitur ac nulla a pretium. Pellentesque ac augue tellus. Aliquam et suscipit mauris, sit amet aliquet purus. Maecenas a tincidunt est, eget gravida diam. Quisque vel egestas quam, ac ultrices sem. Fusce ut mollis nisl, ut ullamcorper mi.",
      "Integer dapibus ultricies purus vitae aliquam. Maecenas in venenatis lorem. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec ut scelerisque metus. In id nunc sed velit ornare convallis sit amet sed nisi. Suspendisse fringilla porttitor nunc, tempor sagittis ligula commodo at. Sed magna nisi, ultricies vitae feugiat id, hendrerit nec leo. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec erat ligula, viverra eget tortor vitae, mollis congue diam. Curabitur cursus dapibus turpis, et faucibus eros. Donec libero turpis, ullamcorper ac consequat et, sollicitudin et mauris. Curabitur venenatis malesuada augue, eget interdum massa porta et. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum non placerat nunc, vitae lacinia nisl. Vivamus finibus sagittis diam sed efficitur.",
      "Sed varius lorem sem, et fringilla lorem porttitor in. Suspendisse ligula orci, congue eget fermentum sit amet, hendrerit nec dolor. Praesent id elementum turpis. Sed vestibulum ante ut euismod aliquam. Aliquam ultricies accumsan aliquam. Praesent ac augue libero. Phasellus ullamcorper lacus ac scelerisque posuere. Pellentesque vehicula bibendum dolor ac suscipit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Suspendisse aliquam orci et euismod eleifend. Fusce gravida leo at ex iaculis facilisis. Vivamus sit amet metus venenatis, porttitor tortor bibendum, varius lacus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur eget lorem nisl. Etiam a mattis ex.",
    ],
    version: "1.0.0",
    icon: "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
    creator: "creator.eth",
    categoryId: 1,
    oneLiner:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed euismod erat.",
    rating: 5,
    ratingAmout: 381,
    audits: 4,
    usage: "288,300",
    contractAddress: "0x7ea2be2df7ba6e54b1a9c70676f668455e329d29",
    chains: [chains.eth],
    tippingAddress: "0xF7C012789aac54B5E33EA5b88064ca1F1172De05",
    reviews: [
      {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed euismod erat. Curabitur sed sapien efficitur, gravida massa ac, feugiat tortor.",
        rating: 5,
        reviewer: "reviewer.eth",
      },
      {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed euismod erat. Curabitur sed sapien efficitur, gravida massa ac, feugiat tortor.",
        rating: 5,
        reviewer: "reviewer.eth",
      },
    ],
    code: [
      {
        name: "DynamicMembership",
        version: "1.0.0",
        url: "https://github.com",
        content: `
            // SPDX-License-Identifier: MIT
            pragma solidity ^0.8.9;
            
            import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
            import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
            import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
            import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
            import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
            import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
            
            contract DynamicMembership is Initializable, ERC721Upgradeable, ERC721BurnableUpgradeable, OwnableUpgradeable, UUPSUpgradeable {
                using CountersUpgradeable for CountersUpgradeable.Counter;
            
                CountersUpgradeable.Counter private _tokenIdCounter;
            
                /// @custom:oz-upgrades-unsafe-allow constructor
                constructor() {
                    _disableInitializers();
                }
            
                function initialize() initializer public {
                    __ERC721_init("PLACEHOLDER_NAME", "PLACEHOLDER_SYMBOL");
                    __ERC721Burnable_init();
                    __Ownable_init();
                    __UUPSUpgradeable_init();
                }
            
                function _baseURI() internal pure override returns (string memory) {
                    return "PLACEHOLDER_URI";
                }
            
                function safeMint(address to) public onlyOwner {
                    require(
                        balanceOf(to) == 0,
                        "DynamicMembership: address already owns a token"
                    );
                    uint256 tokenId = _tokenIdCounter.current();
                    _tokenIdCounter.increment();
                    _safeMint(to, tokenId);
                }
            
                function _authorizeUpgrade(address newImplementation)
                    internal
                    onlyOwner
                    override
                {}
            
                function airdrop(address[] calldata addresses) external onlyOwner {
                    uint256 _len = addresses.length;
                    for (uint256 i = 0; i < _len;) {
                        safeMint(addresses[i]);
                        unchecked {
                            i++;
                        }
                    }
                }
            }`,
      },
    ],
  },
  {
    id: 2,
    name: "Plugin2",
    description: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed euismod erat. Curabitur sed sapien efficitur, gravida massa ac, feugiat tortor. Nullam efficitur massa tortor, vitae ultricies ante mattis id. Maecenas egestas eros ac vehicula semper. Sed mi dui, condimentum in vulputate quis, tristique sit amet odio. Sed condimentum dui ac bibendum cursus. Pellentesque finibus tincidunt ligula vel rhoncus. Quisque ultricies tempus hendrerit. Praesent efficitur ac nulla a pretium. Pellentesque ac augue tellus. Aliquam et suscipit mauris, sit amet aliquet purus. Maecenas a tincidunt est, eget gravida diam. Quisque vel egestas quam, ac ultrices sem. Fusce ut mollis nisl, ut ullamcorper mi.",
      "Integer dapibus ultricies purus vitae aliquam. Maecenas in venenatis lorem. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec ut scelerisque metus. In id nunc sed velit ornare convallis sit amet sed nisi. Suspendisse fringilla porttitor nunc, tempor sagittis ligula commodo at. Sed magna nisi, ultricies vitae feugiat id, hendrerit nec leo. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec erat ligula, viverra eget tortor vitae, mollis congue diam. Curabitur cursus dapibus turpis, et faucibus eros. Donec libero turpis, ullamcorper ac consequat et, sollicitudin et mauris. Curabitur venenatis malesuada augue, eget interdum massa porta et. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum non placerat nunc, vitae lacinia nisl. Vivamus finibus sagittis diam sed efficitur.",
      "Sed varius lorem sem, et fringilla lorem porttitor in. Suspendisse ligula orci, congue eget fermentum sit amet, hendrerit nec dolor. Praesent id elementum turpis. Sed vestibulum ante ut euismod aliquam. Aliquam ultricies accumsan aliquam. Praesent ac augue libero. Phasellus ullamcorper lacus ac scelerisque posuere. Pellentesque vehicula bibendum dolor ac suscipit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Suspendisse aliquam orci et euismod eleifend. Fusce gravida leo at ex iaculis facilisis. Vivamus sit amet metus venenatis, porttitor tortor bibendum, varius lacus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur eget lorem nisl. Etiam a mattis ex.",
    ],
    version: "1.0.0",
    icon: "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
    creator: "creator.eth",
    categoryId: 1,
    rating: 4,
    ratingAmout: 200,
    audits: 0,
    usage: "100,203",
    contractAddress: "0x7ea2be2df7ba6e54b1a9c70676f668455e329d29",
    chains: [chains.eth],
    tippingAddress: "0xF7C012789aac54B5E33EA5b88064ca1F1172De05",
    oneLiner:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed euismod erat.",
    reviews: [
      {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed euismod erat. Curabitur sed sapien efficitur, gravida massa ac, feugiat tortor.",
        rating: 5,
        reviewer: "reviewer.eth",
      },
      {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed euismod erat. Curabitur sed sapien efficitur, gravida massa ac, feugiat tortor.",
        rating: 5,
        reviewer: "reviewer.eth",
      },
    ],
    code: [
      {
        name: "DynamicMembership",
        version: "1.0.0",
        url: "https://github.com",
        content: `
            // SPDX-License-Identifier: MIT
            pragma solidity ^0.8.9;
            
            import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
            import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
            import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
            import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
            import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
            import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
            
            contract DynamicMembership is Initializable, ERC721Upgradeable, ERC721BurnableUpgradeable, OwnableUpgradeable, UUPSUpgradeable {
                using CountersUpgradeable for CountersUpgradeable.Counter;
            
                CountersUpgradeable.Counter private _tokenIdCounter;
            
                /// @custom:oz-upgrades-unsafe-allow constructor
                constructor() {
                    _disableInitializers();
                }
            
                function initialize() initializer public {
                    __ERC721_init("PLACEHOLDER_NAME", "PLACEHOLDER_SYMBOL");
                    __ERC721Burnable_init();
                    __Ownable_init();
                    __UUPSUpgradeable_init();
                }
            
                function _baseURI() internal pure override returns (string memory) {
                    return "PLACEHOLDER_URI";
                }
            
                function safeMint(address to) public onlyOwner {
                    require(
                        balanceOf(to) == 0,
                        "DynamicMembership: address already owns a token"
                    );
                    uint256 tokenId = _tokenIdCounter.current();
                    _tokenIdCounter.increment();
                    _safeMint(to, tokenId);
                }
            
                function _authorizeUpgrade(address newImplementation)
                    internal
                    onlyOwner
                    override
                {}
            
                function airdrop(address[] calldata addresses) external onlyOwner {
                    uint256 _len = addresses.length;
                    for (uint256 i = 0; i < _len;) {
                        safeMint(addresses[i]);
                        unchecked {
                            i++;
                        }
                    }
                }
            }`,
      },
    ],
  },
  {
    id: 3,
    name: "Plugin3",
    description: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed euismod erat. Curabitur sed sapien efficitur, gravida massa ac, feugiat tortor. Nullam efficitur massa tortor, vitae ultricies ante mattis id. Maecenas egestas eros ac vehicula semper. Sed mi dui, condimentum in vulputate quis, tristique sit amet odio. Sed condimentum dui ac bibendum cursus. Pellentesque finibus tincidunt ligula vel rhoncus. Quisque ultricies tempus hendrerit. Praesent efficitur ac nulla a pretium. Pellentesque ac augue tellus. Aliquam et suscipit mauris, sit amet aliquet purus. Maecenas a tincidunt est, eget gravida diam. Quisque vel egestas quam, ac ultrices sem. Fusce ut mollis nisl, ut ullamcorper mi.",
      "Integer dapibus ultricies purus vitae aliquam. Maecenas in venenatis lorem. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec ut scelerisque metus. In id nunc sed velit ornare convallis sit amet sed nisi. Suspendisse fringilla porttitor nunc, tempor sagittis ligula commodo at. Sed magna nisi, ultricies vitae feugiat id, hendrerit nec leo. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec erat ligula, viverra eget tortor vitae, mollis congue diam. Curabitur cursus dapibus turpis, et faucibus eros. Donec libero turpis, ullamcorper ac consequat et, sollicitudin et mauris. Curabitur venenatis malesuada augue, eget interdum massa porta et. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum non placerat nunc, vitae lacinia nisl. Vivamus finibus sagittis diam sed efficitur.",
      "Sed varius lorem sem, et fringilla lorem porttitor in. Suspendisse ligula orci, congue eget fermentum sit amet, hendrerit nec dolor. Praesent id elementum turpis. Sed vestibulum ante ut euismod aliquam. Aliquam ultricies accumsan aliquam. Praesent ac augue libero. Phasellus ullamcorper lacus ac scelerisque posuere. Pellentesque vehicula bibendum dolor ac suscipit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Suspendisse aliquam orci et euismod eleifend. Fusce gravida leo at ex iaculis facilisis. Vivamus sit amet metus venenatis, porttitor tortor bibendum, varius lacus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur eget lorem nisl. Etiam a mattis ex.",
    ],
    version: "1.0.0",
    icon: "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
    creator: "creator.eth",
    categoryId: 1,
    rating: 5,
    ratingAmout: 600,
    audits: 3,
    usage: "508,230",
    contractAddress: "0x7ea2be2df7ba6e54b1a9c70676f668455e329d29",
    chains: [chains.eth],
    tippingAddress: "0xF7C012789aac54B5E33EA5b88064ca1F1172De05",
    oneLiner:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed euismod erat.",
    reviews: [
      {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed euismod erat. Curabitur sed sapien efficitur, gravida massa ac, feugiat tortor.",
        rating: 5,
        reviewer: "reviewer.eth",
      },
      {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed euismod erat. Curabitur sed sapien efficitur, gravida massa ac, feugiat tortor.",
        rating: 5,
        reviewer: "reviewer.eth",
      },
    ],
    code: [
      {
        name: "DynamicMembership",
        version: "1.0.0",
        url: "https://github.com",
        content: `
            // SPDX-License-Identifier: MIT
            pragma solidity ^0.8.9;
            
            import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
            import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
            import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
            import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
            import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
            import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
            
            contract DynamicMembership is Initializable, ERC721Upgradeable, ERC721BurnableUpgradeable, OwnableUpgradeable, UUPSUpgradeable {
                using CountersUpgradeable for CountersUpgradeable.Counter;
            
                CountersUpgradeable.Counter private _tokenIdCounter;
            
                /// @custom:oz-upgrades-unsafe-allow constructor
                constructor() {
                    _disableInitializers();
                }
            
                function initialize() initializer public {
                    __ERC721_init("PLACEHOLDER_NAME", "PLACEHOLDER_SYMBOL");
                    __ERC721Burnable_init();
                    __Ownable_init();
                    __UUPSUpgradeable_init();
                }
            
                function _baseURI() internal pure override returns (string memory) {
                    return "PLACEHOLDER_URI";
                }
            
                function safeMint(address to) public onlyOwner {
                    require(
                        balanceOf(to) == 0,
                        "DynamicMembership: address already owns a token"
                    );
                    uint256 tokenId = _tokenIdCounter.current();
                    _tokenIdCounter.increment();
                    _safeMint(to, tokenId);
                }
            
                function _authorizeUpgrade(address newImplementation)
                    internal
                    onlyOwner
                    override
                {}
            
                function airdrop(address[] calldata addresses) external onlyOwner {
                    uint256 _len = addresses.length;
                    for (uint256 i = 0; i < _len;) {
                        safeMint(addresses[i]);
                        unchecked {
                            i++;
                        }
                    }
                }
            }`,
      },
    ],
  },
  {
    id: 4,
    name: "Plugin4",
    description: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed euismod erat. Curabitur sed sapien efficitur, gravida massa ac, feugiat tortor. Nullam efficitur massa tortor, vitae ultricies ante mattis id. Maecenas egestas eros ac vehicula semper. Sed mi dui, condimentum in vulputate quis, tristique sit amet odio. Sed condimentum dui ac bibendum cursus. Pellentesque finibus tincidunt ligula vel rhoncus. Quisque ultricies tempus hendrerit. Praesent efficitur ac nulla a pretium. Pellentesque ac augue tellus. Aliquam et suscipit mauris, sit amet aliquet purus. Maecenas a tincidunt est, eget gravida diam. Quisque vel egestas quam, ac ultrices sem. Fusce ut mollis nisl, ut ullamcorper mi.",
      "Integer dapibus ultricies purus vitae aliquam. Maecenas in venenatis lorem. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec ut scelerisque metus. In id nunc sed velit ornare convallis sit amet sed nisi. Suspendisse fringilla porttitor nunc, tempor sagittis ligula commodo at. Sed magna nisi, ultricies vitae feugiat id, hendrerit nec leo. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec erat ligula, viverra eget tortor vitae, mollis congue diam. Curabitur cursus dapibus turpis, et faucibus eros. Donec libero turpis, ullamcorper ac consequat et, sollicitudin et mauris. Curabitur venenatis malesuada augue, eget interdum massa porta et. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum non placerat nunc, vitae lacinia nisl. Vivamus finibus sagittis diam sed efficitur.",
      "Sed varius lorem sem, et fringilla lorem porttitor in. Suspendisse ligula orci, congue eget fermentum sit amet, hendrerit nec dolor. Praesent id elementum turpis. Sed vestibulum ante ut euismod aliquam. Aliquam ultricies accumsan aliquam. Praesent ac augue libero. Phasellus ullamcorper lacus ac scelerisque posuere. Pellentesque vehicula bibendum dolor ac suscipit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Suspendisse aliquam orci et euismod eleifend. Fusce gravida leo at ex iaculis facilisis. Vivamus sit amet metus venenatis, porttitor tortor bibendum, varius lacus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur eget lorem nisl. Etiam a mattis ex.",
    ],
    version: "1.0.0",
    icon: "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
    creator: "creator.eth",
    categoryId: 2,
    rating: 3,
    ratingAmout: 200,
    audits: 1,
    usage: "100,201",
    contractAddress: "0x7ea2be2df7ba6e54b1a9c70676f668455e329d29",
    chains: [chains.eth],
    tippingAddress: "0xF7C012789aac54B5E33EA5b88064ca1F1172De05",
    oneLiner:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed euismod erat.",
    reviews: [
      {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed euismod erat. Curabitur sed sapien efficitur, gravida massa ac, feugiat tortor.",
        rating: 5,
        reviewer: "reviewer.eth",
      },
      {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed euismod erat. Curabitur sed sapien efficitur, gravida massa ac, feugiat tortor.",
        rating: 5,
        reviewer: "reviewer.eth",
      },
    ],
    code: [
      {
        name: "DynamicMembership",
        version: "1.0.0",
        url: "https://github.com",
        content: `
            // SPDX-License-Identifier: MIT
            pragma solidity ^0.8.9;
            
            import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
            import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
            import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
            import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
            import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
            import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
            
            contract DynamicMembership is Initializable, ERC721Upgradeable, ERC721BurnableUpgradeable, OwnableUpgradeable, UUPSUpgradeable {
                using CountersUpgradeable for CountersUpgradeable.Counter;
            
                CountersUpgradeable.Counter private _tokenIdCounter;
            
                /// @custom:oz-upgrades-unsafe-allow constructor
                constructor() {
                    _disableInitializers();
                }
            
                function initialize() initializer public {
                    __ERC721_init("PLACEHOLDER_NAME", "PLACEHOLDER_SYMBOL");
                    __ERC721Burnable_init();
                    __Ownable_init();
                    __UUPSUpgradeable_init();
                }
            
                function _baseURI() internal pure override returns (string memory) {
                    return "PLACEHOLDER_URI";
                }
            
                function safeMint(address to) public onlyOwner {
                    require(
                        balanceOf(to) == 0,
                        "DynamicMembership: address already owns a token"
                    );
                    uint256 tokenId = _tokenIdCounter.current();
                    _tokenIdCounter.increment();
                    _safeMint(to, tokenId);
                }
            
                function _authorizeUpgrade(address newImplementation)
                    internal
                    onlyOwner
                    override
                {}
            
                function airdrop(address[] calldata addresses) external onlyOwner {
                    uint256 _len = addresses.length;
                    for (uint256 i = 0; i < _len;) {
                        safeMint(addresses[i]);
                        unchecked {
                            i++;
                        }
                    }
                }
            }`,
      },
    ],
  },
  {
    id: 5,
    name: "Plugin5",
    description: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed euismod erat. Curabitur sed sapien efficitur, gravida massa ac, feugiat tortor. Nullam efficitur massa tortor, vitae ultricies ante mattis id. Maecenas egestas eros ac vehicula semper. Sed mi dui, condimentum in vulputate quis, tristique sit amet odio. Sed condimentum dui ac bibendum cursus. Pellentesque finibus tincidunt ligula vel rhoncus. Quisque ultricies tempus hendrerit. Praesent efficitur ac nulla a pretium. Pellentesque ac augue tellus. Aliquam et suscipit mauris, sit amet aliquet purus. Maecenas a tincidunt est, eget gravida diam. Quisque vel egestas quam, ac ultrices sem. Fusce ut mollis nisl, ut ullamcorper mi.",
      "Integer dapibus ultricies purus vitae aliquam. Maecenas in venenatis lorem. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec ut scelerisque metus. In id nunc sed velit ornare convallis sit amet sed nisi. Suspendisse fringilla porttitor nunc, tempor sagittis ligula commodo at. Sed magna nisi, ultricies vitae feugiat id, hendrerit nec leo. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec erat ligula, viverra eget tortor vitae, mollis congue diam. Curabitur cursus dapibus turpis, et faucibus eros. Donec libero turpis, ullamcorper ac consequat et, sollicitudin et mauris. Curabitur venenatis malesuada augue, eget interdum massa porta et. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum non placerat nunc, vitae lacinia nisl. Vivamus finibus sagittis diam sed efficitur.",
      "Sed varius lorem sem, et fringilla lorem porttitor in. Suspendisse ligula orci, congue eget fermentum sit amet, hendrerit nec dolor. Praesent id elementum turpis. Sed vestibulum ante ut euismod aliquam. Aliquam ultricies accumsan aliquam. Praesent ac augue libero. Phasellus ullamcorper lacus ac scelerisque posuere. Pellentesque vehicula bibendum dolor ac suscipit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Suspendisse aliquam orci et euismod eleifend. Fusce gravida leo at ex iaculis facilisis. Vivamus sit amet metus venenatis, porttitor tortor bibendum, varius lacus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur eget lorem nisl. Etiam a mattis ex.",
    ],
    version: "1.0.0",
    icon: "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
    creator: "creator.eth",
    categoryId: 2,
    rating: 4,
    ratingAmout: 600,
    audits: 8,
    usage: "42,600",
    contractAddress: "0x7ea2be2df7ba6e54b1a9c70676f668455e329d29",
    chains: [chains.eth],
    tippingAddress: "0xF7C012789aac54B5E33EA5b88064ca1F1172De05",
    oneLiner:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed euismod erat.",
    reviews: [
      {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed euismod erat. Curabitur sed sapien efficitur, gravida massa ac, feugiat tortor.",
        rating: 5,
        reviewer: "reviewer.eth",
      },
      {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed euismod erat. Curabitur sed sapien efficitur, gravida massa ac, feugiat tortor.",
        rating: 5,
        reviewer: "reviewer.eth",
      },
    ],
    code: [
      {
        name: "DynamicMembership",
        version: "1.0.0",
        url: "https://github.com",
        content: `
            // SPDX-License-Identifier: MIT
            pragma solidity ^0.8.9;
            
            import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
            import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
            import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
            import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
            import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
            import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
            
            contract DynamicMembership is Initializable, ERC721Upgradeable, ERC721BurnableUpgradeable, OwnableUpgradeable, UUPSUpgradeable {
                using CountersUpgradeable for CountersUpgradeable.Counter;
            
                CountersUpgradeable.Counter private _tokenIdCounter;
            
                /// @custom:oz-upgrades-unsafe-allow constructor
                constructor() {
                    _disableInitializers();
                }
            
                function initialize() initializer public {
                    __ERC721_init("PLACEHOLDER_NAME", "PLACEHOLDER_SYMBOL");
                    __ERC721Burnable_init();
                    __Ownable_init();
                    __UUPSUpgradeable_init();
                }
            
                function _baseURI() internal pure override returns (string memory) {
                    return "PLACEHOLDER_URI";
                }
            
                function safeMint(address to) public onlyOwner {
                    require(
                        balanceOf(to) == 0,
                        "DynamicMembership: address already owns a token"
                    );
                    uint256 tokenId = _tokenIdCounter.current();
                    _tokenIdCounter.increment();
                    _safeMint(to, tokenId);
                }
            
                function _authorizeUpgrade(address newImplementation)
                    internal
                    onlyOwner
                    override
                {}
            
                function airdrop(address[] calldata addresses) external onlyOwner {
                    uint256 _len = addresses.length;
                    for (uint256 i = 0; i < _len;) {
                        safeMint(addresses[i]);
                        unchecked {
                            i++;
                        }
                    }
                }
            }`,
      },
    ],
  },
  {
    id: 6,
    name: "Plugin6",
    description: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed euismod erat. Curabitur sed sapien efficitur, gravida massa ac, feugiat tortor. Nullam efficitur massa tortor, vitae ultricies ante mattis id. Maecenas egestas eros ac vehicula semper. Sed mi dui, condimentum in vulputate quis, tristique sit amet odio. Sed condimentum dui ac bibendum cursus. Pellentesque finibus tincidunt ligula vel rhoncus. Quisque ultricies tempus hendrerit. Praesent efficitur ac nulla a pretium. Pellentesque ac augue tellus. Aliquam et suscipit mauris, sit amet aliquet purus. Maecenas a tincidunt est, eget gravida diam. Quisque vel egestas quam, ac ultrices sem. Fusce ut mollis nisl, ut ullamcorper mi.",
      "Integer dapibus ultricies purus vitae aliquam. Maecenas in venenatis lorem. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec ut scelerisque metus. In id nunc sed velit ornare convallis sit amet sed nisi. Suspendisse fringilla porttitor nunc, tempor sagittis ligula commodo at. Sed magna nisi, ultricies vitae feugiat id, hendrerit nec leo. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec erat ligula, viverra eget tortor vitae, mollis congue diam. Curabitur cursus dapibus turpis, et faucibus eros. Donec libero turpis, ullamcorper ac consequat et, sollicitudin et mauris. Curabitur venenatis malesuada augue, eget interdum massa porta et. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum non placerat nunc, vitae lacinia nisl. Vivamus finibus sagittis diam sed efficitur.",
      "Sed varius lorem sem, et fringilla lorem porttitor in. Suspendisse ligula orci, congue eget fermentum sit amet, hendrerit nec dolor. Praesent id elementum turpis. Sed vestibulum ante ut euismod aliquam. Aliquam ultricies accumsan aliquam. Praesent ac augue libero. Phasellus ullamcorper lacus ac scelerisque posuere. Pellentesque vehicula bibendum dolor ac suscipit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Suspendisse aliquam orci et euismod eleifend. Fusce gravida leo at ex iaculis facilisis. Vivamus sit amet metus venenatis, porttitor tortor bibendum, varius lacus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur eget lorem nisl. Etiam a mattis ex.",
    ],
    version: "1.0.0",
    icon: "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
    creator: "creator.eth",
    categoryId: 3,
    rating: 4,
    ratingAmout: 293,
    audits: 8,
    usage: "209,672",
    contractAddress: "0x7ea2be2df7ba6e54b1a9c70676f668455e329d29",
    chains: [chains.eth],
    tippingAddress: "0xF7C012789aac54B5E33EA5b88064ca1F1172De05",
    oneLiner:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed euismod erat.",
    reviews: [
      {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed euismod erat. Curabitur sed sapien efficitur, gravida massa ac, feugiat tortor.",
        rating: 5,
        reviewer: "reviewer.eth",
      },
      {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed euismod erat. Curabitur sed sapien efficitur, gravida massa ac, feugiat tortor.",
        rating: 5,
        reviewer: "reviewer.eth",
      },
    ],
    code: [
      {
        name: "DynamicMembership",
        version: "1.0.0",
        url: "https://github.com",
        content: `
            // SPDX-License-Identifier: MIT
            pragma solidity ^0.8.9;
            
            import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
            import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
            import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
            import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
            import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
            import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
            
            contract DynamicMembership is Initializable, ERC721Upgradeable, ERC721BurnableUpgradeable, OwnableUpgradeable, UUPSUpgradeable {
                using CountersUpgradeable for CountersUpgradeable.Counter;
            
                CountersUpgradeable.Counter private _tokenIdCounter;
            
                /// @custom:oz-upgrades-unsafe-allow constructor
                constructor() {
                    _disableInitializers();
                }
            
                function initialize() initializer public {
                    __ERC721_init("PLACEHOLDER_NAME", "PLACEHOLDER_SYMBOL");
                    __ERC721Burnable_init();
                    __Ownable_init();
                    __UUPSUpgradeable_init();
                }
            
                function _baseURI() internal pure override returns (string memory) {
                    return "PLACEHOLDER_URI";
                }
            
                function safeMint(address to) public onlyOwner {
                    require(
                        balanceOf(to) == 0,
                        "DynamicMembership: address already owns a token"
                    );
                    uint256 tokenId = _tokenIdCounter.current();
                    _tokenIdCounter.increment();
                    _safeMint(to, tokenId);
                }
            
                function _authorizeUpgrade(address newImplementation)
                    internal
                    onlyOwner
                    override
                {}
            
                function airdrop(address[] calldata addresses) external onlyOwner {
                    uint256 _len = addresses.length;
                    for (uint256 i = 0; i < _len;) {
                        safeMint(addresses[i]);
                        unchecked {
                            i++;
                        }
                    }
                }
            }`,
      },
    ],
  },
  {
    id: 7,
    name: "Plugin7",
    description: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed euismod erat. Curabitur sed sapien efficitur, gravida massa ac, feugiat tortor. Nullam efficitur massa tortor, vitae ultricies ante mattis id. Maecenas egestas eros ac vehicula semper. Sed mi dui, condimentum in vulputate quis, tristique sit amet odio. Sed condimentum dui ac bibendum cursus. Pellentesque finibus tincidunt ligula vel rhoncus. Quisque ultricies tempus hendrerit. Praesent efficitur ac nulla a pretium. Pellentesque ac augue tellus. Aliquam et suscipit mauris, sit amet aliquet purus. Maecenas a tincidunt est, eget gravida diam. Quisque vel egestas quam, ac ultrices sem. Fusce ut mollis nisl, ut ullamcorper mi.",
      "Integer dapibus ultricies purus vitae aliquam. Maecenas in venenatis lorem. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec ut scelerisque metus. In id nunc sed velit ornare convallis sit amet sed nisi. Suspendisse fringilla porttitor nunc, tempor sagittis ligula commodo at. Sed magna nisi, ultricies vitae feugiat id, hendrerit nec leo. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec erat ligula, viverra eget tortor vitae, mollis congue diam. Curabitur cursus dapibus turpis, et faucibus eros. Donec libero turpis, ullamcorper ac consequat et, sollicitudin et mauris. Curabitur venenatis malesuada augue, eget interdum massa porta et. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum non placerat nunc, vitae lacinia nisl. Vivamus finibus sagittis diam sed efficitur.",
      "Sed varius lorem sem, et fringilla lorem porttitor in. Suspendisse ligula orci, congue eget fermentum sit amet, hendrerit nec dolor. Praesent id elementum turpis. Sed vestibulum ante ut euismod aliquam. Aliquam ultricies accumsan aliquam. Praesent ac augue libero. Phasellus ullamcorper lacus ac scelerisque posuere. Pellentesque vehicula bibendum dolor ac suscipit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Suspendisse aliquam orci et euismod eleifend. Fusce gravida leo at ex iaculis facilisis. Vivamus sit amet metus venenatis, porttitor tortor bibendum, varius lacus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur eget lorem nisl. Etiam a mattis ex.",
    ],
    version: "1.0.0",
    icon: "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
    creator: "creator.eth",
    categoryId: 3,
    rating: 4,
    ratingAmout: 649,
    audits: 4,
    usage: "802,163",
    contractAddress: "0x7ea2be2df7ba6e54b1a9c70676f668455e329d29",
    chains: [chains.eth],
    tippingAddress: "0xF7C012789aac54B5E33EA5b88064ca1F1172De05",
    oneLiner:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed euismod erat.",
    reviews: [
      {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed euismod erat. Curabitur sed sapien efficitur, gravida massa ac, feugiat tortor.",
        rating: 5,
        reviewer: "reviewer.eth",
      },
      {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed euismod erat. Curabitur sed sapien efficitur, gravida massa ac, feugiat tortor.",
        rating: 5,
        reviewer: "reviewer.eth",
      },
    ],
    code: [
      {
        name: "DynamicMembership",
        version: "1.0.0",
        url: "https://github.com",
        content: `
            // SPDX-License-Identifier: MIT
            pragma solidity ^0.8.9;
            
            import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
            import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
            import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
            import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
            import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
            import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
            
            contract DynamicMembership is Initializable, ERC721Upgradeable, ERC721BurnableUpgradeable, OwnableUpgradeable, UUPSUpgradeable {
                using CountersUpgradeable for CountersUpgradeable.Counter;
            
                CountersUpgradeable.Counter private _tokenIdCounter;
            
                /// @custom:oz-upgrades-unsafe-allow constructor
                constructor() {
                    _disableInitializers();
                }
            
                function initialize() initializer public {
                    __ERC721_init("PLACEHOLDER_NAME", "PLACEHOLDER_SYMBOL");
                    __ERC721Burnable_init();
                    __Ownable_init();
                    __UUPSUpgradeable_init();
                }
            
                function _baseURI() internal pure override returns (string memory) {
                    return "PLACEHOLDER_URI";
                }
            
                function safeMint(address to) public onlyOwner {
                    require(
                        balanceOf(to) == 0,
                        "DynamicMembership: address already owns a token"
                    );
                    uint256 tokenId = _tokenIdCounter.current();
                    _tokenIdCounter.increment();
                    _safeMint(to, tokenId);
                }
            
                function _authorizeUpgrade(address newImplementation)
                    internal
                    onlyOwner
                    override
                {}
            
                function airdrop(address[] calldata addresses) external onlyOwner {
                    uint256 _len = addresses.length;
                    for (uint256 i = 0; i < _len;) {
                        safeMint(addresses[i]);
                        unchecked {
                            i++;
                        }
                    }
                }
            }`,
      },
    ],
  },
];
