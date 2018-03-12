var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://manager:joeydash@ds135790.mlab.com:35790/joeydash";


router.post('/create/:database/:table', function(req, res, next) {
    MongoClient.connect(url, function(error_1, db) {
        if (error_1) throw error_1;
        var query = { auth_token : req.get("auth_token")};
        dbo.collection("customers").findOne(query).toArray(function(error_2, result_2) {
            if (error_2) res.json(error_2);
            if (result_2!=null){
                MongoClient.connect(url, function(err, db) {
                    if (err) throw err;
                    var myobj = req.body;
                    dbo.collection(req.params).insertOne(myobj, function(error_3, result_3) {
                        if (error_3) throw error_3;
                        console.log("1 document inserted");
                        res.json(result_3);
                        db.close();
                    });
                });
            }
            console.log(result_2);
            db.close();
        });
    });
});
module.exports = router;
