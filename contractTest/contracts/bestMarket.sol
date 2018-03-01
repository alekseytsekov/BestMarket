pragma solidity ^0.4.18;
contract BestMarket {
    
    address private owner;
    
    uint private registerTax;
    uint private fee;
    
    uint private numOfSellers;
    uint private numOfBuyers;
    
    event RegisterEvent(address addr, uint _registerTax, uint currentTime);
    event BuyProduct(address addr, uint currentTime, uint price, string productName);
    
    mapping(address => bool) private sellers;
    mapping(address => bool) private buyers;
    
    mapping(address => uint) private balanceOf;
    
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
    
    function BestMarket() public {
        owner = msg.sender; 
        
        registerTax = 1 ether;
        fee = 5; //percent
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
    
    // info funcs
    function getOwner() public view returns (address) {
        return owner;
    }
    
    function getNumOfSellers() public view returns (uint) {
        return numOfSellers;
    }
    
    function getNumOfBuyers() public view returns (uint) {
        return numOfBuyers;
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
        
        numOfSellers++;
    }
    
    function addProduct(uint price, string productName, string doc, string ipfsPath) public isSeller isProductNameFree(productName) {
        
        Product memory newProduct;
        newProduct.price = price;
        newProduct.name = productName;
        newProduct.jsonDoc = doc;
        newProduct.ipfsPath = ipfsPath;
        
        //sellerProducts[msg.sender]++;
        isProductExist[productName] = true;
        allProducts.push(newProduct);
        productSeller[productName] = msg.sender;
        productByName[productName] = newProduct;
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
        
        numOfBuyers++;
    }
    
    function buyProduct(string productName) public payable returns (uint, string, string, string) {
        
        require(isProductExist[productName] == true);
        require(msg.value >= productByName[productName].price);
        
        uint difference = msg.value - productByName[productName].price;
        if(difference > 0) {
            msg.sender.transfer(difference);
        }
        
        uint dealFee = (productByName[productName].price / 100) * fee;
        uint amountForSeller = productByName[productName].price - dealFee;
        
        assert(balanceOf[owner] + dealFee >= balanceOf[owner]);
        require(balanceOf[productSeller[productName]] + amountForSeller >= balanceOf[productSeller[productName]]);
        
        balanceOf[owner] += dealFee;
        balanceOf[productSeller[productName]] += amountForSeller;
        
        //require(totalSellerBalance + amountForSeller >= totalSellerBalance);
        //totalSellerBalance += amountForSeller;
        
        BuyProduct(msg.sender, now, productByName[productName].price, productByName[productName].name);
        
        return (productByName[productName].price, productByName[productName].name, productByName[productName].jsonDoc , productByName[productName].ipfsPath);
    } 
    
    //  Withdraw
    function withdraw(uint amount) public isSeller {
        require(amount > 0 && balanceOf[msg.sender] >= amount);
        
        balanceOf[msg.sender] -= amount;
        
        uint temp = amount;
        amount = 0;
        
        msg.sender.transfer(temp);
    }
    
    // view section
    function getProductPrice(string productName) public view returns (uint) {
        require(isProductExist[productName]);
        
        return productByName[productName].price;
    }
    
    function getBalance() public view isSeller returns (uint) {
        
        return balanceOf[msg.sender];
    }
    
    function getNumberOfProducts() public view returns (uint) {
        return allProducts.length;
    }
    
    function getProduct(uint index) public view returns (uint, string) {
        require(index >= 0 && index < allProducts.length);
        return (allProducts[index].price, allProducts[index].name);
    }
    
    // function getFee() public view returns (uint) {
    //     return fee;
    // }
    
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