

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
    }
};