
// const auth = require('./../utils/auth');
// const globals = require('./globals');

const home = require('./../controllers/homeController');
const buyer = require('./../controllers/buyerController');
const seller = require('./../controllers/sellerController');

module.exports = app => {
    
    //home
    app.get('/', home.index);
    app.get('/buyer/register', buyer.register);
    app.get('/seller/register', seller.register);

    // //home
    // app.get('/', home.index);

    // // user
    // // register
    // app.get('/register', user.get.register);
    // app.post('/register', user.post.register);

    // // login
    // app.get('/login', user.get.login);
    // app.post('/login', user.post.login);

    // // logout
    // app.post('/logout', user.post.logout);

    // // product/doner
    // //app.get('/doner/add',  doner.get.add);
    // app.get('/doner/add', auth.isInRole(globals.roles.admin), doner.get.add);
    // //app.post('/doner/add',  doner.post.add);
    // app.post('/doner/add', auth.isInRole(globals.roles.admin), doner.post.add);

    // // order
    // app.get('/order/:productId',auth.isAuthed, order.get.customize);
    // app.post('/order/customize',auth.isAuthed, order.post.customize);
    // app.get('/details/order',auth.isAuthed,  order.get.details); // auth.isAuthed,
    // app.get('/manageadmin/order',auth.isInRole(globals.roles.admin), order.get.manageAdmin);
    // app.post('/manageadmin/order', auth.isInRole(globals.roles.admin), order.post.manageAdmin);


    // handle all path that missing!
    app.all('*', (req,res) => {
        res.status(404);
        res.send('404 Not Found!');
        res.end();
    });
};