const mongoose   =  require('mongoose');
var   Debates    =  require('../models/debate'),
      Users      =  require('../models/user');


exports.createDebate = (req, res) =>{
    var debOwner = 41195;
    var newDebate = new Debates({
        basic_info:{
            title:req.body.title,
            img:req.body.img,
            debate_owner: debOwner,
            debate_collabrate:req.body.collabrate
        }
    });
    newDebate.save(
        (err,product)=>{
            if(err){
                console.log(`Error: ${err}`);
                res.json({Error:'ValidationError'})
            }else{
                console.log(`Debate_id: ${product._id}\n debOwner:${product.basic_info.debate_owner}`);
                var update = {$push:{debates:product._id}} ;
                Users.findOneAndUpdate({id:product.basic_info.debate_owner}, update,
                (err)=>{
                    if(err) res.json({Error:'finding error'})

                    res.json({success:1});
                    // mongoose.disconnect();
                })  
            }
            return;
    })}