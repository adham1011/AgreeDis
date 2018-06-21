var mongoose        =   require('mongoose'),
    userCtl         =   require('../controllers/users.ctl'),
    debate          =   new mongoose.Schema({
        basic_info:{
            title:{
                type:String,
                lowercase: true,
                required: true
            },
            img:String,
            voters:{
                type:[String],
                default:[]
            },
            status:{
                type: Number,
                default: 0
            }/*0 = pending /1= rejected /2 = running /3 = closed*/

        },
    owner:{
        owner_id:Number,
        owner_votes:{
                type:Number,
                default: 0
        }
    },
    collaborator:{
        collaborator_id:Number,
        collaborator_votes:{
                type:Number,
                default: 0
        }

        }
    },{ versionKey: false });
        // timeOut:Date,/*end time*/
        // timestamps: true,

debate.path('basic_info.title').set(
    (val)=>{
    let sVal = String(val).toLowerCase();
    return sVal;
});

debate.path('collaborator.collaborator_id').validate(
    userCtl.checkUser,'User not Found');

var Debate  = mongoose.model('Debate',debate);

module.exports = Debate; 