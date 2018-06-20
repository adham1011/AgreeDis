var consts       = require('./consts'),
    mongoose     = require('mongoose');

//define the MODEL
var Debates = require('./models/debate'),
    Users   = require('./models/user'),
    options = {
        autoReconnect:true,

};
mongoose.connect(consts.MLAB,options)
.then(
    () => {
        console.log('connected');
    },
    err => {
        console.log(`connection error: ${err}`);
    }
);