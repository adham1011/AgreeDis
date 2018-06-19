const mongoose   =  require('mongoose');
var   Debates    =  require('../models/debate'),
      Users      =  require('../models/user');


exports.createDebate = (req, res) =>{
    var debOwner = 41195;
    var newDebate = new Debates({
        basic_info:{
            title:req.body.title,
            img:req.body.img,
        },
        owner:{
            owner_id:debOwner
        },
        collaborator:{
            collaborator_id:req.body.collaborator
        }
    });
    newDebate.save(
        (err,product)=>{
            if(err){
                console.log(`Error: ${err}`);
                res.json({Error:'ValidationError'})
            }else{
                console.log(`Debate_id: ${product._id}\n debOwner:${product.owner.owner_id}`);
                var update = {$push:{debates:product._id}} ;
                Users.findOneAndUpdate({id:product.owner.owner_id}, update,
                (err)=>{
                    if(err) res.json({Error:'finding error'})

                    res.json({success:1});
                    // mongoose.disconnect();
                })  
            }
            return;
    })}