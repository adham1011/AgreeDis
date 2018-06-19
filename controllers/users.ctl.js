const mongoose =  require('mongoose');
var   Users    =  require('../models/user');
//access the MODEL
//for route /final-ideas/getAllIdeas
exports.getData = (req, res) =>{
    Users.find({},
    (err, docs) => {
        if (err) console.log(`query error:${err}`);
        console.log(docs);
        res.json(docs);
        return;
    });
}