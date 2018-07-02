const mongoose   =  require('mongoose');
var   Debates    =  require('../models/debate'),
      Users      =  require('../models/user');


exports.dashBoard = (req,res) =>{
    Debates.find({
        "basic_info.status":2,
    }).limit(10).sort({"time.publish_time":-1}).exec(
        (err,doc) =>{
            if(err){
                console.log(`Error: ${err}`)
                res.json({Error:err})
            }
            res.json(doc)
            return
        }
    )
}

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
                let stat = doc.basic_info.status
                let usr = req.session.user.id
                if(stat == 1){
                    if(usr == doc.owner.owner_id){ 
                        res.json(doc)
                    }else{
                     res.json({
                            Status:'private Debate',
                            Error:'No permission'
                        })                    
                 }
                    return
                }else if( stat == 0 ){
                    if(usr == doc.owner.owner_id || usr == doc.collaborator.collaborator_id){
                        res.json(doc)
                    }else{
                        res.json({
                            Status:'private Debate',
                            Error:'No permission'
                        })
                    }
                    return
                }else{
                    res.json(doc)
                }
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
                return;
            }            
            if(!this_debate){
                console.log(`Debate not found`)
                res.json({Error:'No Debates Found'})
                return;
            }else{
                console.log(`Removing Debate Number: ${this_debate._id}\n`);
                var current_owner_id = Number(this_debate.owner.owner_id);
                console.log(`Owner ID : ${current_owner_id}`);
                var current_collaborator_id =Number(this_debate.collaborator.collaborator_id);
                console.log(`Owner ID : ${current_collaborator_id}`);
                var current_debate_id = this_debate._id;
                console.log(`Debate ID : ${current_debate_id}`);
               Users.update( {$or: [{id:current_owner_id},
                {id:current_collaborator_id}]},
                { $pull: { debates: { $in:[ current_debate_id] } ,
                          notifications: { $in:[ current_debate_id], }} },{multi:true},
                (err)=>{if(err) res.json({Error:err})});

                this_debate.remove();
                res.json({success:'Debate Deleted successfuly'})


               Debates.findOne({_id:req.params.debate_id},
                (err) => {
                    console.log(`\nCheck after delete: ${JSON.stringify(Debates)}`);
                    console.log(`Debate Removed ! \n`);
                });
               return;
            }
            return;
        });
},


exports.createDebate = (req, res) =>{
    var debOwner = Number(req.session.user.id) /*This will be dynamic id */
    var newDebate = new Debates({
        basic_info:{
            title:req.body.title,
            img:req.body.img,
        },
        owner:{
            owner_id:debOwner
        },
        collaborator:{
            collaborator_id:Number(req.body.collaborator)
        },
        time:{
            end_time: req.body.end_time
        }
    });
    newDebate.save(
        (err,product)=>{
            if(err){
                console.log(`Error: ${err}`);
                res.json({Error:'ValidationError'})
            }else{
                var update = {$push:{debates:product._id}} ;
                var updatecoll = {$push:{notifications:product._id}};
                Users.findOneAndUpdate({id:product.owner.owner_id}, update,
                    err =>{
                        if(err) console.log('Error with owner');
                    }
                );
                Users.findOneAndUpdate({id:product.collaborator.collaborator_id},updatecoll,
                    err=>{
                        if(err) console.log('Error with callabrator');
                        else {res.json(product)}
                    }
                );
            
                  
            }

            return;
    })}



exports.handleRequest = (req, res)=>{
    var ans = Number(req.params.response),
        condition = {id:req.session.user.id,notifications:{$in:[req.params.debate_id]}},
        update    = {$push:{debates:req.params.debate_id},$pull:{notifications:req.params.debate_id}},
        opts      = {multi:false};
    // if(ans !=1 || ans !=2){
    //     res.json({Error:'Fields ValidationError'})
    //     return
    // }

    if(ans == 1){
        update = {$pull:{notifications:req.params.debate_id}};
    }else if(ans==2){

    }else{
        res.json({Error:'Fields ValidationError'})
        return
    }

    Users.update(condition, update , opts,
        (err,doc)=>{
            if(err){
                res.json({Error:err})
                return;
            }
            if(doc.nModified == 0){
                res.json({Error:'Access Denied'})
                return;
            }
            console.log(doc);

            var con     = {_id:req.params.debate_id},
                update2 = {"basic_info.status":ans};
            Debates.findOneAndUpdate(con,update2,
                (err)=>{
                    res.json({
                        Debate:req.params.debate_id,
                        status: ans
                    });
                }
            )
            return;
        }
    ) 

}





exports.pickSide = (req, res)=>{
    
}






