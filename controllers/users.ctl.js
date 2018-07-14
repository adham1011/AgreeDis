const mongoose =  require('mongoose');
var   Users    =  require('../models/user');
var   jwt      =  require('jsonwebtoken');
var   consts   =  require('../consts');
//access the MODEL
//for route /final-ideas/getAllIdeas

exports.access = (req, res, next)=>{
    const authorizationHeader = req.headers['authorization'];
    let token;
    if(authorizationHeader){
        token = authorizationHeader.split(' ')[1];
    }
    if(token){
        jwt.verify(token, consts.jwtSecret,
            (err, decoded) =>{
                if(err) {
                    res.json({Error:"Failed to authenticate"})
                }else{
                    Users.findOne({id:decoded.id},'-profile.password',
                        (err,User)=>{
                            if(err){
                                console.log('err in finding user')
                                res.status(404).json({Error: err})
                                return;
                             }
                            if(!User){
                                console.log('User Not Found')
                                res.status(404).json({Error: 'User Not Found'})
                            }else{
                                req.currentUser = User;
                                // res.status(200).json(req.currentUser);
                                next();
                            }
                        }
                    )
                }
        });
    }else{
        res.json({Error:'No Token Provieded'})
    }
}

exports.signIn = (req, res) =>{
    Users.findOne({"profile.email":req.body.email,"profile.password":req.body.password},
        (err,User)=>{
            if(err){
                console.log('Some errors in sign in')
                res.status(404).json({Error: err})
                return;
            }
            if(!User){
                console.log('User Not Found')
                res.status(404).json({Error: 'User Not Found'})
                return;
            }
            const token = jwt.sign({
                id: User.id,
                username: User.profile.name.first,
                img:User.profile.imgSrc

            }, consts.jwtSecret);
            res.json({token});
            // req.session.user = User
            // res.json({User})
        }
    )
}


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


/*internal function No routes*/




