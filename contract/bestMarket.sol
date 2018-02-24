pragma solidity 0.4.18;

contract BestMarket {
    
    address private owner;
    
    uint private registerTax;
    uint private fee;
    ///uint private minPrice;
    
    event RegisterEvent(address addr, uint _registerTax, uint currentTime);
    event BuyProduct(address addr, uint currentTime, uint price, string productName);
    
    mapping(address => bool) private sellers;
    mapping(address => bool) private buyers;
    
    uint private totalSellerBalance;
    mapping(address => uint) private balanceOfSeller;
    
    mapping(string => address) private productSeller;
    //mapping(address => uint) private sellerProducts;
    //mapping(address => uint) private buyerProducts;
    
    Product[] private allProducts;
    mapping(string => Product) private productByName;
    mapping(string => bool) private isProductExist;
    
    struct Product {
        uint price;
        string name;
        string jsonDoc;
        string ipfsPath;
    }
    
    modifier isOwner {
        require(owner == msg.sender);
        _;
    }
    
    function BestMarket(uint _registerTax, uint _fee) public {
        owner = msg.sender;
        //registerTax = _registerTax * 1 ether;
        //fee = _fee; 
        
        registerTax = 1 ether;
        fee = 5;
        //minPrice = 1 finney;
    }
    
    function () public payable {
        
    }
    
    modifier isSeller {
        require(sellers[msg.sender] == true || owner == msg.sender);
        _;
    }
    
    modifier isProductNameFree(string productName) {
        require(isProductExist[productName] != true);
        _;
    }
    
    
    //seller section
    function registerAsSeller() public payable {
        require(msg.value >= registerTax);
        require(sellers[msg.sender] != true);
        
        uint difference = msg.value - registerTax;
        
        if (difference > 0) {
            msg.sender.transfer(difference);
        }
        
        sellers[msg.sender] = true;
        uint currentTime = now;
        RegisterEvent(msg.sender, registerTax, currentTime);
    }
    
    function addProduct(uint price, string productName, string doc, string ipfsPath) public isSeller isProductNameFree(productName) returns(bool) {
        
        // uint nameLength = utfStringLength(productName);
        // uint docLength = utfStringLength(doc);
        // uint ipfsPathLength = utfStringLength(ipfsPath);
        
        // if( price < 1 || 
        //     nameLength < 3 || nameLength > 50 ||
        //     docLength > 1000 ||
        //     ipfsPathLength > 100
        //     ){
        //     return false;  
        // }
        
        Product memory newProduct;
        newProduct.price = price * 1 finney;
        newProduct.name = productName;
        newProduct.jsonDoc = doc;
        newProduct.ipfsPath = ipfsPath;
        
        //sellerProducts[msg.sender]++;
        isProductExist[productName] = true;
        allProducts.push(newProduct);
        productSeller[productName] = msg.sender;
        productByName[productName] = newProduct;
        
        return true;
    }
    
    
    // BUYER section
    function registerAsBuyer() public payable {
        require(msg.value >= registerTax);
        require(buyers[msg.sender] != true);
        
        uint difference = msg.value - registerTax;
        if (difference > 0) {
            msg.sender.transfer(difference);
        }
        
        buyers[msg.sender] = true;
        RegisterEvent(msg.sender, registerTax, now);
    }
    
    function buyProduct(string productName) public payable returns (uint, string, string, string) {
        //require(productIndex >= 0 || productIndex < allProducts.length);
        
        //Product storage pr = allProducts[productIndex];
        //require(productNames[pr.name] == true);
        
        require(isProductExist[productName]);
        
        Product storage pr = productByName[productName];
        
        require(msg.value >= pr.price);
        
        uint difference = msg.value - pr.price;
        if(difference > 0) {
            msg.sender.transfer(difference);
        }
        
        uint contractFee = (pr.price / 100) * fee;
        uint amountForSeller = pr.price - contractFee;
        
        address seller = productSeller[productName];
        
        assert(balanceOfSeller[seller] + amountForSeller >= balanceOfSeller[seller]);
        assert(totalSellerBalance + amountForSeller >= totalSellerBalance);
        
        balanceOfSeller[seller] += amountForSeller;
        totalSellerBalance += amountForSeller;
        
        BuyProduct(msg.sender, now, pr.price, pr.name);
        
        //buyerProducts[msg.sender]++;
        
        return (pr.price, pr.name, pr.jsonDoc , pr.ipfsPath);
    } 
    
    //  Withdraw
    function sellerWithdraw() public {
        require(sellers[msg.sender]);
        require(balanceOfSeller[msg.sender] > 0);
        
        uint sellerBalance = balanceOfSeller[msg.sender];
        balanceOfSeller[msg.sender] = 0;
        totalSellerBalance -= sellerBalance;
        msg.sender.transfer(sellerBalance);
    }
    
    function ownerWithdraw() public isOwner {
        
        uint ownerBalance = this.balance - totalSellerBalance;
        require(ownerBalance > 0);
        owner.transfer(ownerBalance);
    }
    
    // view section
    function getProductPriceInFinney(string productName) public view returns (uint) {
        require(isProductExist[productName]);
        
        Product storage pr = productByName[productName];
        
        return pr.price / 1 finney;
    }
    
    function getBalance() public view isOwner returns (uint) {
        //return this.balance / 1 finney;
        if(owner == msg.sender) {
            return this.balance / 1 finney;
        } else {
            return balanceOfSeller[msg.sender] / 1 finney;
        }
    }
    
    function getNumberOfProducts() public view returns (uint) {
        return allProducts.length;
    }
    
    function getProduct(uint index) public view returns (uint, string) {
        require(index >= 0 && index < allProducts.length);
        return (allProducts[index].price / 1 finney, allProducts[index].name);
    }
    
    function getFee() public view returns (uint) {
        return fee;
    }
    
    // // utils
    // function utfStringLength(string str) private pure returns (uint length) {
    //     uint i=0;
    //     bytes memory string_rep = bytes(str);

    //     while (i<string_rep.length)
    //     {
    //         if (string_rep[i]>>7==0)
    //             i+=1;
    //         else if (string_rep[i]>>5==0x6)
    //             i+=2;
    //         else if (string_rep[i]>>4==0xE)
    //             i+=3;
    //         else if (string_rep[i]>>3==0x1E)
    //             i+=4;
    //         else
    //             //For safety
    //             i+=1;

    //         length++;
    //     }
    // }
}