var mongoose        =   require('mongoose'),
    debate          =   new mongoose.Schema({
        basic_info:{
            title:{
                type:String,
                lowercase: true,
                required: true
            },
            img:String,
            debate_owner:Number,/*Usr_id*/
            debate_collabrate:Number,/*Usr_id*/  
        },
        votes:{
            owner_votes:{
                type:Number,
                default: 0
            },
            collabrate_votes:{
                type:Number,
                default: 0
            },
            voters:{
                type:[String],
                default:[]
            }
        },
        // timeOut:Date,/*end time*/
        status:{
            type: Number,
            default: 0
        },/*0 = pending /1 = running /2 = closed*/
        // timestamps: true,
    },{ versionKey: false });

debate.pre('save',
    (next)=>{
        console.log('before saving');
        return next();
});



var Debate  = mongoose.model('Debate',debate);

module.exports = Debate; 