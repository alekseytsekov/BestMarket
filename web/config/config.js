
module.exports = {
    development :{
        port : process.env.PORT || 5000,
        contractCreator : '0x627306090abab3a6e1400e9345bc60c78a8bef57',

        contractAddress : '0xf25186b5081ff5ce73482ad761db0eb0d25abfbf',

        contractAbi : [{
            "constant": true,
            "inputs": [],
            "name": "getBalanceOfSeller",
            "outputs": [{
                "name": "",
                "type": "uint256"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getBalance",
            "outputs": [{
                "name": "",
                "type": "uint256"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getFee",
            "outputs": [{
                "name": "",
                "type": "uint256"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [{
                "name": "productName",
                "type": "string"
            }],
            "name": "getProductPriceInFinney",
            "outputs": [{
                "name": "",
                "type": "uint256"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [{
                "name": "index",
                "type": "uint256"
            }],
            "name": "getProduct",
            "outputs": [{
                    "name": "",
                    "type": "uint256"
                },
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getNumberOfProducts",
            "outputs": [{
                "name": "",
                "type": "uint256"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [{
                    "indexed": false,
                    "name": "addr",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "currentTime",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "name": "price",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "name": "productName",
                    "type": "string"
                }
            ],
            "name": "BuyProduct",
            "type": "event"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "sellerWithdraw",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [{
                    "indexed": false,
                    "name": "addr",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "_registerTax",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "name": "currentTime",
                    "type": "uint256"
                }
            ],
            "name": "RegisterEvent",
            "type": "event"
        },
        {
            "constant": false,
            "inputs": [{
                    "name": "price",
                    "type": "uint256"
                },
                {
                    "name": "productName",
                    "type": "string"
                },
                {
                    "name": "doc",
                    "type": "string"
                },
                {
                    "name": "ipfsPath",
                    "type": "string"
                }
            ],
            "name": "addProduct",
            "outputs": [{
                "name": "",
                "type": "bool"
            }],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [{
                "name": "productName",
                "type": "string"
            }],
            "name": "buyProduct",
            "outputs": [{
                    "name": "",
                    "type": "uint256"
                },
                {
                    "name": "",
                    "type": "string"
                },
                {
                    "name": "",
                    "type": "string"
                },
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [{
                    "name": "_registerTax",
                    "type": "uint256"
                },
                {
                    "name": "_fee",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "payable": true,
            "stateMutability": "payable",
            "type": "fallback"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "registerAsBuyer",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "registerAsSeller",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "ownerWithdraw",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ],

        //dbConnectionString : 'mongodb://hw-4-admin:hw-4-admin@ds121575.mlab.com:21575/mlab-hw-4'
    }
    //production : {}
};