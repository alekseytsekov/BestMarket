//let Web3 = require('Web3');
const config = require('./../config/config');

module.exports = {
    index : async (req, res) => {

        let obj = {
            isAdmin : false,
            title : 'DApp Market Place',
            message : "Hello world!"
        };

        let error = req.query.error;
        let success = req.query.success;
        if (error) {
            obj.error = error;
        }

        if (success) {
            data.success = success;
        }

        

        res.render('partials/index', obj);
    },
    list : async (req, res) => {

        let obj = {
            contractCreator : config.development.contractCreator,
            contractAddress : config.development.contractAddress,
            shouldGetProducts : true
        };

        //console.log(Web3);
        //var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

        //const contract = web3.eth.contract(obj.contractAbi).at(obj.contractAddress);

		// if (typeof window.web3 !== "undefined" && typeof window.web3.currentProvider !== "undefined") {
		// 	web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/ri45PYMaMiRFCfZh2H5a"));
		// } else {
		// 	web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/ri45PYMaMiRFCfZh2H5a"));
		// }

        res.render('partials/list', obj);
    }
};