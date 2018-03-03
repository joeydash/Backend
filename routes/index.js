var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://manager:joeydash@ds135790.mlab.com:35790/joeydash";

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.cookies.backend_portal_user != null){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("joeydash");
        var query = {
            "username" : JSON.parse(req.cookies.backend_portal_user).username
        };
        dbo.collection("users").findOne(query,function(error, result) {
            if (error) throw err;
            if (result!=null){
                if (result.auth_token===JSON.parse(req.cookies.backend_portal_user).auth_token){
                    res.render('index');
                }else {
                    res.render('sign_in');
                    db.close();
                }
            }else {
                res.render('sign_in');
                console.log(JSON.parse(req.cookies.backend_portal_user).username);
                db.close();
            }

        });
    });
    }else {
        res.render('sign_in');
    }
});

module.exports = router;
