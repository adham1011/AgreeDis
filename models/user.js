var mongoose        =   require('mongoose'),
    user            =   new mongoose.Schema({
        id:Number,
        profile:{
            email:String,
            password:String,
            name:{
                first:String,
                last:String,
            },
            age:Number,
            imgSrc:String,
        },
        debates:[String],/*will hold the debates id*/
        claps:Number,
        vip:Number,
        friends:[Number], /*array of friends id's*/
        notifications:[String]
    });



var User  = mongoose.model('User',user);

module.exports = User;