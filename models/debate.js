var mongoose        =   require('mongoose'),
    debate          =   new mongoose.Schema({
        basic_info:{
            title:{
                type:String,
                lowercase: true,
                required: true
            },
            img:String,
            voters:{
                type:[Number],
                default:[]
            },
            status:{
                type: Number,
                default: 0
            },/*0 = pending /1= rejected /2 = running /3 = closed*/
            time:{
                publish_time:{
                    type:Date,
                    default:Date.now
                },
                end_time:{
                    type:Number,/*time by Hours: Example 2 means 2 hours*/
                    min:0.5,/*min - half hour*/
                    max:90,/*max 24 hours from publish date*/
                    default:0.5
                }
            }
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
    console.log(`toLowerCase : ${val}`)
    let sVal = String(val).toLowerCase();
    return sVal;
});

debate.path('basic_info.time.publish_time').set(
    (val)=>{
        console.log("i'm here");
        let date = new Date(val.getFullYear(),val.getMonth(),val.getDay());
        console.log(`\nDate:${date}`)
        return date
    }
)


var Debate  = mongoose.model('Debate',debate);

module.exports = Debate; 