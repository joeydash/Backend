var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://manager:joeydash@ds135790.mlab.com:35790/joeydash";
var hash = require('object-hash');
/* GET home page. */
router.post('/create_user', function(req, res, next) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("joeydash");
        var data = {
            username : req.body.username,
            random_string : Math.random().toString(36).substring(7),
            avatar : req.body.avatar,
            auth_token : Math.random().toString(36).substring(7)
        };
        data.hashed_password = hash(req.body.password+data.random_string);

        dbo.collection("users").insertOne(data, function(error, result) {
            if (error) res.json(error);
            else {
                delete data['random_string'];
                delete data['hashed_password'];
                res.json(data);
                db.close();
            }
        });
    });
});
router.post('/check_user', function(req, res, next) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("joeydash");
        var query = {
            "username" : req.body.username
        };
        dbo.collection("users").findOne(query,function(error, result) {
            if (error) throw err;
            if (result!=null){
                if (hash(req.body.password+result.random_string) === result.hashed_password){
                    result.auth_token = Math.random().toString(36).substring(7);
                    MongoClient.connect(url, function(err, db) {
                        if (err) throw err;
                        dbo.collection("users").updateOne(query,{ $set : result} , function(error_2, result_2) {
                            if (error_2) throw error_2;
                            delete result['random_string'];
                            delete result['hashed_password'];
                            res.json(result);
                            db.close();
                        });
                    });

                }else {
                    res.json({
                        "RESULT_CODE" : 1013,
                        "RESULT" : "Username and password didn't match"
                    });
                    db.close();
                }
            }else {
                res.json({
                    "RESULT_CODE" : 1014,
                    "RESULT" : "Username and password not found"
                });
                db.close();
            }


        });
    });
});
router.post('/check_username', function(req, res, next) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("joeydash");
        var query = {
            "username" : req.body.username
        };
        dbo.collection("users").findOne(query,function(error, result) {
            if (error) throw err;
            if (result === null){
                res.json({
                    "RESULT_CODE" : 1081,
                    "RESULT" : "Username doesn't exists"
                });
            }else{
                res.json({
                    "RESULT_CODE" : 1080,
                    "RESULT" : "Username exists"
                });
            }
            db.close();

        });
    });
});
module.exports = router;