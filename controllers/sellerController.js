
module.exports = {
    register : async (req, res) => {

        let obj = {
            isAdmin : false,
        };

        let error = req.query.error;
        let success = req.query.success;
        if (error) {
            obj.error = error;
        }

        if (success) {
            data.success = success;
        }

        res.render('partials/sellerRegister', obj);
    }
};