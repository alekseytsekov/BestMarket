pragma solidity 0.4.20;

contract BestMarket {
    
    address private owner;
    
    uint private registerTax;
    ///uint private minPrice;
    
    event RegisterEvent(address addr, uint timestamp);
    mapping(address => bool) sellers;
    mapping(address => bool) buyers;
    
    mapping(address => uint) balanceOfSellers;
    
    mapping(string => address) productSeller;
    mapping(address => uint) sellerProducts;
    mapping(address => uint) buyerProducts;
    
    Product[] allProducts;
    mapping(string => bool) productNames;
    
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
    
    function BestMarket() public {
        owner = msg.sender;
        registerTax = 1 ether;
        //minPrice = 1 finney;
    }
    
    function () public payable {
        
    }
    
    modifier isSeller {
        require(sellers[msg.sender] == true || owner == msg.sender);
        _;
    }
    
    modifier isProductNameFree(string productName) {
        require(productNames[productName] != true);
        _;
    }
    
    
    //seller section
    function registerAsSeller() public payable {
        require(msg.value >= registerTax);
        require(sellers[msg.sender] != true);
        
        uint difference = msg.value - registerTax;
        if(difference > 0){
            msg.sender.transfer(difference);
        }
        
        sellers[msg.sender] = true;
        RegisterEvent(msg.sender, now);
    }
    
    function addProduct(uint price, string productName, string doc, string ipfsPath) public isSeller isProductNameFree(productName) returns(bool) {
        
        uint nameLength = utfStringLength(productName);
        uint docLength = utfStringLength(doc);
        uint ipfsPathLength = utfStringLength(ipfsPath);
        
        if(price < 1 || 
            nameLength < 3 || nameLength > 50 ||
            docLength > 1000 ||
            ipfsPathLength > 100
            ){
            return false;
        }
        
        Product memory newProduct;
        newProduct.price = price * 1 finney;
        newProduct.name = productName;
        newProduct.jsonDoc = doc;
        newProduct.ipfsPath = ipfsPath;
        
        sellerProducts[msg.sender]++;
        productNames[productName] = true;
        allProducts.push(newProduct);
        productSeller[productName] = msg.sender;
        
        return true;
    }
    
    
    function withdraw() public isSeller {
        if(owner == msg.sender) {
            require(this.balance > 0);
            owner.transfer(this.balance);
        }
        else {
            require(balanceOfSellers[msg.sender] > 0);
            uint sellerBalance = balanceOfSellers[msg.sender];
            balanceOfSellers[msg.sender] = 0;
            msg.sender.transfer(sellerBalance);
        }
    }
    
    // BUYER section
    function registerAsBuyer() public payable {
        require(msg.value >= registerTax);
        require(buyers[msg.sender] != true);
        
        uint difference = msg.value - registerTax;
        if(difference > 0){
            msg.sender.transfer(difference);
        }
        
        buyers[msg.sender] = true;
        RegisterEvent(msg.sender, now);
    }
    
    function buyProduct(string productName, uint productIndex) public payable returns (uint, string, string, string) {
        require(productIndex >=0 || productIndex < allProducts.length);
        
        Product storage pr = allProducts[productIndex];
        if(productNames[pr.name] != true){
            require(false);
        }
        
        require(msg.value >= pr.price);
        
        uint difference = msg.value - pr.price;
        if(difference > 0) {
            msg.sender.transfer(difference);
        }
        
        address seller = productSeller[productName];
        
        assert(balanceOfSellers[seller] + pr.price >= balanceOfSellers[seller]);
        
        balanceOfSellers[seller] += pr.price;
        buyerProducts[msg.sender]++;
    } 
    
    // view section
    function getBalance() public view isSeller returns (uint) {
        if(owner == msg.sender) {
            return this.balance;
        } else {
            return balanceOfSellers[msg.sender];
        }
    }
    
    function getNumberOfProducts() public view returns (uint){
        return allProducts.length;
    }
    
    function getProduct(uint index) public view returns (uint, string) {
        require(index >= 0 && index < allProducts.length);
        return (allProducts[index].price, allProducts[index].name);
    }
    
    // utils
    function utfStringLength(string str) private pure returns (uint length) {
        uint i=0;
        bytes memory string_rep = bytes(str);

        while (i<string_rep.length)
        {
            if (string_rep[i]>>7==0)
                i+=1;
            else if (string_rep[i]>>5==0x6)
                i+=2;
            else if (string_rep[i]>>4==0xE)
                i+=3;
            else if (string_rep[i]>>3==0x1E)
                i+=4;
            else
                //For safety
                i+=1;

            length++;
        }
    }
}