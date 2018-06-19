var mongoose        =   require('mongoose'),
    debate          =   new mongoose.Schema({
        // debate_id:{
        //     type:Number,
        //     unique: true,
        //     index:1 
        // },

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
            voters:[Number]/*array will hold Users_is (voters)*/

        },

        timeOut:Date,/*end time*/
        status:{
            type: Number,
            default: 0
        }/*0 = pending /1 = running /2 = closed*/
        // timestamps: true,
    });

debate.pre('save',
    (next)=>{
        console.log('test');
        return next();
});
// debate.path('basic_info.title').set(
//     (val)=>{
//         let sVal = String(val).toLowerCase();
//         console.log(`\nlower:${sVal}`);
//         return sVal;
// });

// debate.path('debate_id').set(
//     ()=>
// )






var Debate  = mongoose.model('Debate',debate);

module.exports = Debate; 