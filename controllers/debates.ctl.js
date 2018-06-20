const mongoose   =  require('mongoose');
var   Debates    =  require('../models/debate'),
      Users      =  require('../models/user');



exports.getById = (req, res) =>{
    Debates.findOne({_id:req.params.debate_id},
        (err,doc)=>{
            if(err){
                console.log(`Error: ${err}`)
                res.json({Error:err})
            }
            if(!doc){
                console.log(`Debate not found`)
                res.json({Error:'Debate Not Found'})
            }else{
                res.json(doc)
            }

            return;
        });
}

exports.getByUser = (req, res) =>{
    var usr = Number(req.params.usr_id)
    console.log(`\nSearching Debate for user: ${usr}`)

    Debates.find({$or:[
        {"owner.owner_id":usr},
        {"collaborator.collaborator_id":usr},
        ]},
    (err,docs)=>{
            if(err){
                console.log(`Error: ${err}`)
                res.json({Error:err})
            }
            if(docs.length == 0){
                console.log(`Debate not found`)
                res.json({Error:'user has No Debates'})
            }else{
                res.json(docs)
            }
            return;
        });
}

exports.deleteDebate = (req, res) =>{
    Debates.findOne({_id:req.params.debate_id},
        (err, this_debate)=>{
            if(err){
                console.log(`Error:${err}`);
                res.json({Error:err})
            }            
            if(!this_debate){
                console.log(`Debate not found`)
                res.json({Error:'No Debates Found'})
            }else{
                console.log(`Removing Debate... \n`);
               this_debate.remove();

               Debates.findOne({_id:req.params.debate_id},
                (err) => {
                    console.log(`\nCheck after delete: ${JSON.stringify(Debates)}`);
                    console.log(`Debate Removed ! \n`);
                });

            }
        });
/*
    this_debate.remove({_id:req.params.debate_id},
        (err) => {
            if(err)
            console.log(`err:${err}`);
            else{
            console.log(`debate Removed`);
            Debates.findOne({_id:req.params.debate_id},
                (err) => {
                    console.log(`\nCheck after delete: ${JSON.stringify(Debates)}`);

                });
            };    
        });*/
},


exports.createDebate = (req, res) =>{
    var debOwner = 41195
    var newDebate = new Debates({
        basic_info:{
            title:req.body.title,
            img:req.body.img,
        },
        owner:{
            owner_id:Number(debOwner)
        },
        collaborator:{
            collaborator_id:Number(req.body.collaborator)
        }
    });
    newDebate.save(
        (err,product)=>{
            if(err){
                console.log(`Error: ${err}`);
                res.json({Error:'ValidationError'})
            }else{
                console.log(`Debate_id: ${product._id}\ndebOwner:${product.owner.owner_id}`);
                var update = {$push:{debates:product._id}} ;
                Users.findOneAndUpdate({id:product.owner.owner_id}, update,
                (err)=>{
                    if(err) res.json({Error:'finding error'})

                    res.json({success:1});
                })  
            }

            return;
    })}