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

exports.checkUser = (val)=>{
    var v = 'red';
    Users.findOne({id:val},
    (err, doc) =>{
        if(err) {
            console.log('error') 
            v='red';
        }
        if(!doc){ 
            console.log("Not Found")
            v='red';
        }else{
            v='green';
        }
        return /green/.test(v)
    })
}

exports.getUser = (req,res) =>{
    console.log(req.params.usr_id);
    Users.findOne({id:req.params.usr_id},'-profile.password',
     (err, result) => {
            if(err){
                console.log(`Error: ${err}`)
                res.json({Error:err})
            }
             if(!result){
              console.log(`ERROR FindOne failed :${err}`);
              res.json({Error: 'User not found'});
            }else{
             console.log(`into mongoose findone \n ${result}`);
             res.json(result);
         }
             return;
    });


}