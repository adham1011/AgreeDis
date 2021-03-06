const mongoose   =  require('mongoose');
var   Debates    =  require('../models/debate'),
      Users      =  require('../models/user');


exports.dashBoard = (req,res) =>{
    Debates.find({
        "basic_info.status":2,
    }).sort({"basic_info.time.publish_time":-1}).limit(10).exec(
        (err,doc) =>{
            if(err){
                console.log(`Error: ${err}`)
                res.json({Error:err})
                return;
            }
            if(doc.length<=0){
                res.json({doc,users:[]});
                console.log(`doc : ${doc}`)
            }else{
                var users = [];
                var alreadyUser=[];
                var length = doc.length;
                var getusers = (i)=>{
                    if(i<length){
                        Users.findOne({id:doc[i].collaborator.collaborator_id},'-profile.password -notifications -debates -profile.age',
                            (err,usr)=>{
                                if(err){
                                    res.status(300).json({Error:err});
                                }else{
                                    if(!(alreadyUser.includes(usr.id))){
                                        alreadyUser.push(usr.id);
                                        users.push(usr);
                                    }
                                    Users.findOne({id:doc[i].owner.owner_id},'-profile.password -notifications -debates -profile.age',
                                        (err,ok)=>{
                                            if(err){
                                               res.status(300).json({Error:err});
                                            }else{
                                                if(!(alreadyUser.includes(ok.id))){
                                                    alreadyUser.push(ok.id);
                                                    users.push(ok);
                                                }
                                                getusers(i+1);
                                            }
                                        });/*usr_2*/
                                }
                            });
                    }else{
                        res.json({doc,users});
                    }
            }/*function*/
            getusers(0);
        }/*else limit*/
    });
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
                var users = [];
                var alreadyUser=[];
                var length = docs.length;
                var getusers = (i)=>{
                    if(i<length){
                        Users.findOne({id:docs[i].collaborator.collaborator_id},'-profile.password -notifications -debates -profile.age',
                        (err, usr)=>{
                            if(err) return;
                            if(!(alreadyUser.includes(usr.id))){
                                alreadyUser.push(usr.id);
                                users.push(usr);
                            }
                        Users.findOne({id:docs[i].owner.owner_id},'-profile.password -notifications -debates -profile.age',
                            (err, owner)=>{
                                if(err) return;
                                if(!(alreadyUser.includes(owner.id))){
                                alreadyUser.push(owner.id);
                                users.push(owner);
                            }
                            getusers(i+1);

                        });

                        });  
                    }else{
                        res.json({docs,users});
                    }
                }/*function*/
                getusers(0);
            }/*else*/
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
    console.log(req.body.end_time);
    var debOwner = Number(req.currentUser.id) /*This will be dynamic id */
    var newDebate = new Debates({
        basic_info:{
            title:req.body.title,
            img:req.body.img,
            time:{
            end_time: req.body.end_time
            }
        },
        owner:{
            owner_id:debOwner
        },
        collaborator:{
            collaborator_id:Number(req.body.collaborator)
        }
    });
    newDebate.save(
        (err,product)=>{
            if(err){
                console.log(`Error: ${err}`);
                res.status(404).json({Error:'ValidationError'})
            }else{
                console.log(`\nowner:${debOwner}\ncollab:${Number(req.body.collaborator)}`)
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
    console.log(req.currentUser.id);
    var ans = Number(req.params.response),
        condition = {id:req.currentUser.id,notifications:{$in:[req.params.debate_id]}},
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
                (err,debate)=>{
                    if(ans==2){
                        setTimeout(function(){
                            //  close debate
                            console.log("start Counting to close in");
                            console.log(debate.basic_info.time.end_time);
                            var update3 = {"basic_info.status":3};
                            Debates.findOneAndUpdate(con,update3,
                                (err,cDebate)=>{
                                    if(err){
                                    res.json({Error:err})
                                    return;
                                    }else{
                                        console.log("a Debate has been closed");
                                        console.log("updating winner atts");
                                      if(cDebate.owner.owner_votes>cDebate.collaborator.collaborator_votes){
                                        console.log("owner WinZ");
                                        var winner = cDebate.owner.owner_id,
                                            newClaps = cDebate.owner.owner_votes;
                                      }if(cDebate.owner.owner_votes<cDebate.collaborator.collaborator_votes){
                                        var winner = cDebate.collaborator.collaborator_id;
                                            newClaps = cDebate.collaborator.collaborator_votes;
                                        console.log("Collaborator WinZ");
                                      }else{
                                        console.log("Draw");
                                      }  
                                     var winnerCondition = {id:winner};
                                     var winnerUpdate = {$inc:{wins: 1 , claps:newClaps}};
                                       console.log("updated claps and wins updating experience");
                                       Users.findOneAndUpdate(winnerCondition,winnerUpdate,
                                        (err,Usr)=>{
                                             if(err){
                                                res.json({Error:err})
                                                return;
                                    }else{
                                        console.log(Usr);
                                      var VipCalc = Math.floor(Usr.claps*0.005 + Usr.wins*0.02);
                                      console.log(VipCalc);
                                      var winnerUpdateVip = {vip:VipCalc};
                                      Users.findOneAndUpdate(winnerCondition,winnerUpdateVip,
                                        (err,doc)=>{
                                            if(err){
                                         return;
                                         }else{
                                            console.log("Updated VIP status");
                                        }})
                                     }

                                       })

    
                                    }

                                })



                        }, debate.basic_info.time.end_time * 60000);
                            // this code will not block, and will only run at the time
                    }
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




exports.pickSide = (req,res) =>{
    console.log(req.currentUser.vip);
    console.log(req.body.side_flag); // 0=Disagree 1=agree
    console.log(req.currentUser.id);
    console.log(req.body.debate_id);
    var owner,collab;
    if(req.body.side_flag==0){
        owner =0;
        collab=(req.currentUser.vip+1)
    }else{
        owner = (req.currentUser.vip+1)
        collab =0 
    }

    var update = {$push:{"basic_info.voters":req.currentUser.id},
                 $inc:{"owner.owner_votes":owner , "collaborator.collaborator_votes" : collab}
    };
    var conditions = {_id:req.body.debate_id,
                      "basic_info.status":2,
                      "basic_info.voters":{$ne:req.currentUser.id}
                     }
    Debates.findOneAndUpdate(conditions, update, 
            (err,doc)=>{
                if(err){
                    console.log(`Error: ${err}`)
                     res.json({Error:err})
                     return
                }
                if(!doc){
                     console.log(`Debate not found`)
                     res.json({Error:'Debate Not Found'})
                     return
                     }
                    res.json({Msg:'successfuly voted'})
            }
    )
    return // executes
}






