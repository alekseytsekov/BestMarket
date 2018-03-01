
const BestMarket = artifacts.require("../contracts/bestMarket.sol");

contract('BestMarket', function(accounts) {
    let bestMarketInstance;

    const _owner = accounts[0];
    const _seller1 = accounts[1];
    const _seller2 = accounts[2];
    const _buyer1 = accounts[3];
    const _buyer2 = accounts[4];

    // ....
    // notEqual
    // equal
    // strictEqual

    describe("Init contract", () => {

        beforeEach(async function() {
            bestMarketInstance = await BestMarket.new({
                from: _owner
            });
        });

        it("Should set owner correctly", async function() {
            let owner = await bestMarketInstance.getOwner();

            assert.strictEqual(owner, _owner, "The expected owner is not set");
        });

        it("Should not have registered sellers", async function() {

            let result = await bestMarketInstance.getNumOfSellers();

            assert.equal(JSON.parse(result), 0, "The expected count of sellers are not equal!");
        });

        it("Should not have registered buyers", async function() {

            let result = await bestMarketInstance.getNumOfBuyers();

            assert.equal(JSON.parse(result), 0, "The expected count of buyers are not equal!");
        });

        it("Should not have inserted products", async function() {

            let result = await bestMarketInstance.getNumberOfProducts();

            assert.equal(JSON.parse(result), 0, "The expected products count are not equal!");
        });

        
    });

    describe("Seller tests", () => {

        beforeEach(async function() {
            bestMarketInstance = await BestMarket.new({
                from: _owner
            });
        });

        it("Should register 1 seller correctly", async function() {

            let options = {
				from: _seller1, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsSeller(options);

            let numOfSellers = await bestMarketInstance.getNumOfSellers();


            assert.equal(JSON.parse(numOfSellers), 1, "The expected seller number is not equal!");
        });

        it("Should be 2 registered sellers", async function() {

            let options = {
				from: _seller1, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsSeller(options);

            options = {
				from: _seller2, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsSeller(options);

            let numOfSellers = await bestMarketInstance.getNumOfSellers();

            assert.equal(JSON.parse(numOfSellers), 2, "The expected seller number is not equal!");
        });

        it("Seller balance should be 0", async function() {

            let options = {
				from: _seller1, 
				value: '1000000000000000000', 
				gas: 1000000
            };

            await bestMarketInstance.registerAsSeller(options);

            let result = await bestMarketInstance.getBalance();

            // expectThrow
            assert.equal(JSON.parse(result), 0, "The expected seller balance is not equal!");
        });

        it("Seller balance should be product price minus contract fee. Sell 1 product.", async function() {

            let options = {
				from: _seller1, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsSeller(options);

            let name = 'home';
            let price = '1000000000000000000'
            await bestMarketInstance.addProduct(price, name, 'doc', 'ipfspath', {from:_seller1});

            options = {
				from: _buyer1, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsBuyer(options);

            await bestMarketInstance.buyProduct(name, options);
            
            let result = await bestMarketInstance.getBalance({from : _seller1});

            assert.equal(result.toString(), '950000000000000000', "Seller does not receive product price!");
            //console.log(result);
            //console.log(web3.eth.getBalance({from: _buyer1}));
        });

        it("Seller balance should be product price minus contract fee. Sell 2 product.", async function() {

            let options = {
				from: _seller1, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsSeller(options);

            let name = 'home';
            let price = '1000000000000000000'
            await bestMarketInstance.addProduct(price, name, 'doc', 'ipfspath', {from:_seller1});

            options = {
				from: _buyer1, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsBuyer(options);

            await bestMarketInstance.buyProduct(name, options);
            await bestMarketInstance.buyProduct(name, options);
            
            let result = await bestMarketInstance.getBalance({from : _seller1});

            assert.equal(result.toString(), '1900000000000000000', "Seller does not receive product price!");
            //console.log(result);
            //console.log(web3.eth.getBalance({from: _buyer1}));
        });

        it("Seller balance should be product price minus contract fee from his product. Sell 2 products from different sellers.", async function() {

            let options = {
				from: _seller1, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsSeller(options);

            options = {
				from: _seller2, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsSeller(options);

            let name = 'home';
            let price = '1000000000000000000'
            await bestMarketInstance.addProduct(price, name, 'doc', 'ipfspath', {from:_seller1});

            let name1 = 'car';
            let price1 = '5000000000000000000'
            await bestMarketInstance.addProduct(price1, name1, 'doc', 'ipfspath', {from:_seller2});

            options = {
				from: _buyer1, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsBuyer(options);

            await bestMarketInstance.buyProduct(name, options);
            options = {
				from: _buyer1, 
				value: '5000000000000000000', 
				gas: 100000
            };
            await bestMarketInstance.buyProduct(name1, options);
            
            let result = await bestMarketInstance.getBalance({from : _seller2});

            assert.equal(result.toString(), '4750000000000000000', "Seller does not receive product price!");
            //console.log(result);
            //console.log(web3.eth.getBalance({from: _buyer1}));
        });

        it("Get owner balance after 1 sell.", async function() {

            let options = {
				from: _seller1, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsSeller(options);

            let name = 'home';
            let price = '1000000000000000000'
            await bestMarketInstance.addProduct(price, name, 'doc', 'ipfspath', {from:_seller1});

            options = {
				from: _buyer1, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsBuyer(options);

            await bestMarketInstance.buyProduct(name, options);
            
            let result = await bestMarketInstance.getBalance({from : _owner});

            assert.equal(result.toString(), '50000000000000000', "Seller does not receive product price!");
            //console.log(result);
            //console.log(web3.eth.getBalance({from: _buyer1}));
        });

        it("Get owner balance after 2 sells.", async function() {

            let options = {
				from: _seller1, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsSeller(options);

            options = {
				from: _seller2, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsSeller(options);

            let name = 'home';
            let price = '1000000000000000000'
            await bestMarketInstance.addProduct(price, name, 'doc', 'ipfspath', {from:_seller1});

            let name1 = 'car';
            let price1 = '5000000000000000000'
            await bestMarketInstance.addProduct(price1, name1, 'doc', 'ipfspath', {from:_seller2});

            options = {
				from: _buyer1, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsBuyer(options);

            await bestMarketInstance.buyProduct(name, options);
            options = {
				from: _buyer1, 
				value: '5000000000000000000', 
				gas: 100000
            };
            await bestMarketInstance.buyProduct(name1, options);
            
            let result = await bestMarketInstance.getBalance({from : _owner});

            assert.equal(result.toString(), '300000000000000000', "Owner does not receive his funds!");
            //console.log(result);
            //console.log(web3.eth.getBalance({from: _buyer1}));
        });
    });

    describe("Buyer tests", () => {

        beforeEach(async function() {
            bestMarketInstance = await BestMarket.new({
                from: _owner
            });
        });

        it("Should register 1 buyer correctly", async function() {

            let options = {
				from: _seller1, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsBuyer(options);

            let numOfSellers = await bestMarketInstance.getNumOfBuyers();


            assert.equal(JSON.parse(numOfSellers), 1, "The expected count of buyers are not equal!");
        });

        it("Should be 2 registered buyers", async function() {

            let options = {
				from: _seller1, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsBuyer(options);

            options = {
				from: _seller2, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsBuyer(options);

            let numOfSellers = await bestMarketInstance.getNumOfBuyers();

            assert.equal(JSON.parse(numOfSellers), 2, "The expected seller number is not equal!");
        });

        it("Buyer should buy a product.", async function() {

            let options = {
				from: _seller1, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsSeller(options);

            let name = 'home';
            let price = '1000000000000000000'
            await bestMarketInstance.addProduct(price, name, 'doc', 'ipfspath', {from:_seller1});

            options = {
				from: _buyer1, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsBuyer(options);

            try {
                let result = await bestMarketInstance.buyProduct(name, options);
                assert.equal(1, 1, "The buyer could not buy a product!");
            } catch (e) {
                assert.equal(1, 0, "The buyer could not buy a product!");
            }
            

            //console.log(result);
            //console.log(web3.eth.getBalance({from: _buyer1}));

            
        });

        it("Buyer should NOT buy a product.", async function() {

            let options = {
				from: _seller1, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsSeller(options);

            let name = 'home';
            let price = '1000000000000000000'
            await bestMarketInstance.addProduct(price, name, 'doc', 'ipfspath', {from:_seller1});

            options = {
				from: _buyer1, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsBuyer(options);

            options = {
				from: _buyer1, 
				value: '100000000000000000', 
				gas: 100000
            };

            try {
                let result = await bestMarketInstance.buyProduct(name, options);
                assert.equal(1, 0, "The buyer could not buy a product!");
            } catch (e) {
                assert.equal(1, 1, "The buyer could not buy a product!");
            }
            

            //console.log(result);
            //console.log(web3.eth.getBalance({from: _buyer1}));

            
        });
    });

    describe("Product tests", () => {

        beforeEach(async function() {
            bestMarketInstance = await BestMarket.new({
                from: _owner
            });
        });

        it("Should NOT inserted product from unregistered seller.", async function() {

            try {
                await bestMarketInstance.addProduct('1000000000000000000', 'home', 'doc', 'ipfspath', {from:_seller1});
                assert.equal(0, 1, "Add product without registration!");
            } catch (e) {
                assert.equal(1, 1, "");
            }
        });

        it("Should NOT buy product from unregistered buyer.", async function() {

            let options = {
				from: _seller1, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsSeller(options);

            let name = 'home';
            let price = '1000000000000000000'
            await bestMarketInstance.addProduct(price, name, 'doc', 'ipfspath', {from:_seller1});

            options = {
				from: _buyer1, 
				value: '1000000000000000000', 
				gas: 100000
            };

            //await bestMarketInstance.registerAsBuyer(options);

            try {
                let result = await bestMarketInstance.buyProduct(name, options);
                assert.equal(1, 0, "The buyer could not buy a product!");
            } catch (e) {
                assert.equal(1, 1, "");
            }
        });

        it("Should have 1 inserted product", async function() {

            let options = {
				from: _seller1, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsSeller(options);

            await bestMarketInstance.addProduct('1000000000000000000', 'home', 'doc', 'ipfspath', {from:_seller1});

            let result = await bestMarketInstance.getNumberOfProducts();

            assert.equal(JSON.parse(result), 1, "The expected count of products are not equal!");
        });

        it("Should have 2 inserted products", async function() {

            let options = {
				from: _seller1, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsSeller(options);

            await bestMarketInstance.addProduct('1000000000000000000', 'home', 'doc', 'ipfspath', {from:_seller1});
            await bestMarketInstance.addProduct('5000000000000000000', 'car', 'doc', 'ipfspath', {from:_seller1});

            let result = await bestMarketInstance.getNumberOfProducts();

            assert.equal(JSON.parse(result), 2, "The expected count of products are not equal!");
        });

        it("Should NOT add product with same name from same seller.", async function() {

            let options = {
				from: _seller1, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsSeller(options);

            await bestMarketInstance.addProduct('1000000000000000000', 'home', 'doc', 'ipfspath', {from:_seller1});

            try{
                await bestMarketInstance.addProduct('1000000000000000000', 'home', 'doc', 'ipfspath', {from:_seller1});
                assert.equal(1, 0, "Add same product twice!");
            } catch (e) {
                assert.equal(1, 1, "");
            }
        });

        it("Should NOT add product with same name from different sellers.", async function() {

            let options = {
				from: _seller1, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsSeller(options);

            options = {
				from: _seller2, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsSeller(options);

            await bestMarketInstance.addProduct('1000000000000000000', 'home', 'doc', 'ipfspath', {from:_seller1});
            

            try{
                await bestMarketInstance.addProduct('1000000000000000000', 'home', 'doc', 'ipfspath', {from:_seller2});
                assert.equal(1, 0, "Add same product twice!");
            } catch (e) {
                assert.equal(1, 1, "");
            }
        });

        it("Inserted 1 product. Get product. Name and price should match", async function() {

            let options = {
				from: _seller1, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsSeller(options);

            let name = 'home';
            let price = '1000000000000000000'
            await bestMarketInstance.addProduct(price, name, 'doc', 'ipfspath', {from:_seller1});

            let result = await bestMarketInstance.getProduct(0);

            let tokens = result.toString().split(',').filter(x => x != '');
            let name1 = tokens[1];
            let price1 = tokens[0];

            //console.log(name1);
            //console.log(price1);

            assert.equal(name, name1, "The expected name of product is not equal!");
            assert.equal(price, price1, "The expected price of product is not equal!");
        });

        it("Inserted 2 products. Get product 2. Name and price should match", async function() {

            let options = {
				from: _seller1, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsSeller(options);

            let name = 'home';
            let price = '1000000000000000000'
            await bestMarketInstance.addProduct(price, name, 'doc', 'ipfspath', {from:_seller1});

            name = 'car';
            price = '5000000000000000000'
            await bestMarketInstance.addProduct(price, name, 'doc', 'ipfspath', {from:_seller1});

            let result = await bestMarketInstance.getProduct(1);

            let tokens = result.toString().split(',').filter(x => x != '');
            let name1 = tokens[1];
            let price1 = tokens[0];

            //console.log(name1);
            //console.log(price1);

            assert.equal(name, name1, "The expected name of product is not equal!");
            assert.equal(price, price1, "The expected price of product is not equal!");
        });

        it("Inserted 2 products. 2 seller. Get product 2. Name and price should match", async function() {

            let options = {
				from: _seller1, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsSeller(options);

            options = {
				from: _seller2, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsSeller(options);

            let name = 'home';
            let price = '1000000000000000000'
            await bestMarketInstance.addProduct(price, name, 'doc', 'ipfspath', {from:_seller1});

            name = 'car';
            price = '5000000000000000000'
            await bestMarketInstance.addProduct(price, name, 'doc', 'ipfspath', {from:_seller2});

            let result = await bestMarketInstance.getProduct(1);

            let tokens = result.toString().split(',').filter(x => x != '');
            let name1 = tokens[1];
            let price1 = tokens[0];

            //console.log(name1);
            //console.log(price1);

            assert.equal(name, name1, "The expected name of product is not equal!");
            assert.equal(price, price1, "The expected price of product is not equal!");
        });

    });

    describe("Withdraw tests", () => {

        beforeEach(async function() {
            bestMarketInstance = await BestMarket.new({
                from: _owner
            });
        });

        it("Withdraw all funds.", async function() {

            let options = {
				from: _seller1, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsSeller(options);

            let name = 'home';
            let price = '1000000000000000000'
            await bestMarketInstance.addProduct(price, name, 'doc', 'ipfspath', {from:_seller1});

            options = {
				from: _buyer1, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsBuyer(options);

            await bestMarketInstance.buyProduct(name, options);
            
            await bestMarketInstance.withdraw('950000000000000000', { from : _seller1 })
            let result = await bestMarketInstance.getBalance({ from : _seller1 });

            assert.equal(result.toString(), '0', "Seller cannot withdraw all funds!");
            //console.log(result);
            //console.log(web3.eth.getBalance({from: _buyer1}));
        });

        it("Withdraw some funds.", async function() {

            let options = {
				from: _seller1, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsSeller(options);

            let name = 'home';
            let price = '1000000000000000000'
            await bestMarketInstance.addProduct(price, name, 'doc', 'ipfspath', {from:_seller1});

            options = {
				from: _buyer1, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsBuyer(options);

            await bestMarketInstance.buyProduct(name, options);
            
            await bestMarketInstance.withdraw('900000000000000000', { from : _seller1 })
            let result = await bestMarketInstance.getBalance({ from : _seller1 });

            assert.equal(result.toString(), '50000000000000000', "Seller cannot withdraw all funds!");
            //console.log(result);
            //console.log(web3.eth.getBalance({from: _buyer1}));
        });

        it("Withdraw all funds by 2 steps.", async function() {

            let options = {
				from: _seller1, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsSeller(options);

            let name = 'home';
            let price = '1000000000000000000'
            await bestMarketInstance.addProduct(price, name, 'doc', 'ipfspath', {from:_seller1});

            options = {
				from: _buyer1, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsBuyer(options);

            await bestMarketInstance.buyProduct(name, options);
            
            await bestMarketInstance.withdraw('900000000000000000', { from : _seller1 });
            await bestMarketInstance.withdraw('50000000000000000', { from : _seller1 });
            let result = await bestMarketInstance.getBalance({ from : _seller1 });

            assert.equal(result.toString(), '0', "Seller cannot withdraw all funds!");
            //console.log(result);
            //console.log(web3.eth.getBalance({from: _buyer1}));
        });

        it("Owner withdraw all funds.", async function() {

            let options = {
				from: _seller1, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsSeller(options);

            let name = 'home';
            let price = '1000000000000000000'
            await bestMarketInstance.addProduct(price, name, 'doc', 'ipfspath', {from:_seller1});

            options = {
				from: _buyer1, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsBuyer(options);

            await bestMarketInstance.buyProduct(name, options);
            
            await bestMarketInstance.withdraw('50000000000000000', { from : _owner });
            let result = await bestMarketInstance.getBalance({ from : _owner });

            assert.equal(result.toString(), '0', "Owner cannot withdraw all funds!");
            //console.log(result);
            //console.log(web3.eth.getBalance({from: _buyer1}));
        });

        it("Owner withdraw all funds. by 2 steps.", async function() {

            let options = {
				from: _seller1, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsSeller(options);

            let name = 'home';
            let price = '1000000000000000000'
            await bestMarketInstance.addProduct(price, name, 'doc', 'ipfspath', {from:_seller1});

            options = {
				from: _buyer1, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsBuyer(options);

            await bestMarketInstance.buyProduct(name, options);
            
            await bestMarketInstance.withdraw('30000000000000000', { from : _owner });
            await bestMarketInstance.withdraw('20000000000000000', { from : _owner });
            let result = await bestMarketInstance.getBalance({ from : _owner });

            assert.equal(result.toString(), '0', "Owner cannot withdraw all funds!");
            //console.log(result);
            //console.log(web3.eth.getBalance({from: _buyer1}));
        });

        it("Owner withdraw some of funds.", async function() {

            let options = {
				from: _seller1, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsSeller(options);

            let name = 'home';
            let price = '1000000000000000000'
            await bestMarketInstance.addProduct(price, name, 'doc', 'ipfspath', {from:_seller1});

            options = {
				from: _buyer1, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsBuyer(options);

            await bestMarketInstance.buyProduct(name, options);
            
            await bestMarketInstance.withdraw('30000000000000000', { from : _owner });
            let result = await bestMarketInstance.getBalance({ from : _owner });

            assert.equal(result.toString(), '20000000000000000', "Owner cannot withdraw all funds!");
            //console.log(result);
            //console.log(web3.eth.getBalance({from: _buyer1}));
        });

        it("Try withdraw more funds than have. Threw exception.", async function() {

            let options = {
				from: _seller1, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsSeller(options);

            let name = 'home';
            let price = '1000000000000000000'
            await bestMarketInstance.addProduct(price, name, 'doc', 'ipfspath', {from:_seller1});

            options = {
				from: _buyer1, 
				value: '1000000000000000000', 
				gas: 100000
            };

            await bestMarketInstance.registerAsBuyer(options);

            await bestMarketInstance.buyProduct(name, options);
            
            try {
                await bestMarketInstance.withdraw('960000000000000000', { from : _seller1 });
                assert.equal(1, 0, "Seller withdraw all funds!");
            } catch(e) {
                assert.equal(1, 1, "Seller cannot withdraw all funds!");
            }
            
            //console.log(result);
            //console.log(web3.eth.getBalance({from: _buyer1}));
        });

    });
});