
// const auth = require('./../utils/auth');
// const globals = require('./globals');

const home = require('./../controllers/homeController');
const buyer = require('./../controllers/buyerController');
const seller = require('./../controllers/sellerController');

module.exports = app => {
    
    //home
    app.get('/', home.list);
    app.get('/buyer/register', buyer.register);
    app.get('/seller/register', seller.register);
    app.get('/seller/addProduct', seller.addProduct);
    app.get('/seller/checkBalance', seller.checkBalance);
    app.get('/seller/withdraw', seller.withdraw);

    // app.get('/..../add', auth.isInRole(globals.roles.admin), xxx.get.add);

    // handle all path that missing!
    app.all('*', (req,res) => {
        res.status(404);
        res.send('404 Not Found!');
        res.end();
    });
};