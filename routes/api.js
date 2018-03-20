var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://joeydash:joeydash@ds135790.mlab.com:35790/joeydash";
var db_name = "joeydash";
var collection_list = ["food_data"];
var contains = function(needle) {
    var findNaN = needle !== needle;
    var indexOf;
    if(!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;
            for(i = 0; i < this.length; i++) {
                var item = this[i];
                if((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }
            return index;
        };
    }
    return indexOf.call(this, needle) > -1;
};

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.json({RESULT : "UBA Api Service",STATUS : "Working",DB_NAME : db_name,TABLES_WORKING : collection_list});
});
router.get('/read', function(req, res, next) {
    res.json({TABLES_WORKING : collection_list});
});

router.get('/read/:collection_name/:data_id', function(req, res, next) {
    if (contains.call(collection_list,req.params.collection_name)){
        ObjectId = require('mongodb').ObjectID;
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(db_name);
            dbo.collection(req.params.collection_name).findOne({"_id" : new ObjectId(req.params.data_id)}, function(error, result) {
                if (error) res.json(error);
                res.json(result);
                db.close();
            });
        });
    }else {
        res.json({
            RESULT : "No Table Found",
            RESULT_CODE : 1081
        })
    }
});
router.get('/delete/:collection_name/:data_id', function(req, res, next) {
    if (contains.call(collection_list,req.params.collection_name)){
        ObjectId = require('mongodb').ObjectID;
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(db_name);
            dbo.collection(req.params.collection_name).deleteOne({"_id" : new ObjectId(req.params.data_id)}, function(error, result) {
                if (error) res.json(error);
                res.json(result);
                db.close();
            });
        });
    }else {
        res.json({
            RESULT : "No Table Found",
            RESULT_CODE : 1081
        })
    }
});

router.get('/read/:collection_name', function(req, res, next) {
    if (contains.call(collection_list,req.params.collection_name)){
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(db_name);
            dbo.collection(req.params.collection_name).find({}).toArray(function(error, result) {
                if (error) {res.json(error);}
                else{
                    res.json(result);
                    db.close();
                }
            });
        });
    }else {
        res.json({
            RESULT : "No Table Found",
            RESULT_CODE : 1081
        })
    }
});
router.get('/read/:collection_name/:skip/:limit', function(req, res, next) {
    if (contains.call(collection_list,req.params.collection_name)){
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(db_name);
            dbo.collection(req.params.collection_name).find({}).skip(parseInt(req.params.skip)).limit(parseInt(req.params.limit)).toArray(function(error, result) {
                if (error) {res.json(error);}
                else{
                    res.json(result);
                    db.close();
                }
            });
        });
    }else {
        res.json({
            RESULT : "No Table Found",
            RESULT_CODE : 1081
        })
    }
});

router.get('/get_numbers/:collection_name', function(req, res, next) {
    if (contains.call(collection_list,req.params.collection_name)){
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(db_name);
            dbo.collection(req.params.collection_name).count({}, function(error, numOfDocs) {
                if (error) res.json(error);
                res.json({"number_of_data":numOfDocs});
            });
        });
    }else {
        res.json({
            RESULT : "No Table Found",
            RESULT_CODE : 1081
        })
    }
});
router.post('/create/:collection_name', function(req, res, next) {
    if (contains.call(collection_list,req.params.collection_name)){
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(db_name);
            dbo.collection(req.params.collection_name).insertOne(JSON.parse(req.body.data), function(error, result) {
                if (error) {res.json(error);}
                else{
                    res.json(result);
                    db.close();
                }

            });
        });
    }else {
        res.json({
            RESULT : "No Table Found",
            RESULT_CODE : 1081
        })
    }
});
router.post('/update/:collection_name/:data_id', function(req, res, next) {
    if (contains.call(collection_list,req.params.collection_name)){
        ObjectId = require('mongodb').ObjectID;
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(db_name);
            dbo.collection(req.params.collection_name).updateOne({"_id" : new ObjectId(req.params.data_id)},{$set:JSON.parse(req.body.data)}, function(error, result) {
                if (error) res.json(error);
                res.json(result);
                db.close();
            });
        });
    }else {
        res.json({
            RESULT : "No Table Found",
            RESULT_CODE : 1081
        })
    }
});
router.post('/create_many/:collection_name', function(req, res, next) {
    if (contains.call(collection_list,req.params.collection_name)){
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(db_name);
            dbo.collection(req.params.collection_name).insertMany(JSON.parse(req.body.data), function(error, result) {
                if (error) {res.json(error);}
                else{
                    console.log(req.body.data);
                    res.json(result);
                    db.close();
                }
            });
        });
    }else {
        res.json({
            RESULT : "No Table Found",
            RESULT_CODE : 1081
        })
    }
});



module.exports = router;