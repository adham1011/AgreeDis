const   express     = require('express'),
        app         = express(),
        bodyParser  = require('body-parser'),
        userCtl     = require('./controllers/users.ctl'),
        debateCtl   = require('./controllers/debates.ctl'),
        port        = process.env.PORT || 3000;
        session     = require('express-session');
app.set('port',port);
app.use('/', express.static('./public'));//for API
app.use(
 (req,res,next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type,Accept, Authorization");
    res.header("Access-Control-Allow-Methods",'GET,POST,DELETE,OPTIONS');
    res.set("Content-Type", "application/json");
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true}));
app.use(session({secret:'shjlowyi739d',resave: false, saveUninitialized:true}))

/*** All routes ***/
/*
* Search Routes
*/

// app.get('/search/:search_value')
app.post('/profile/signIn',userCtl.signIn)

app.all('*',userCtl.access)
/* Debate Set + Get */
app.get('/debates/dashBoard',debateCtl.dashBoard)/*will get Top 10 recents Debates -sorting as user vip rate*/

app.get('/debates/:debate_id',debateCtl.getById)

app.get('/debates/userDebate/:usr_id',debateCtl.getByUser)

app.delete('/debates/deleteDebate/:debate_id',debateCtl.deleteDebate)

app.post('/debates/createDebate',debateCtl.createDebate);

app.get('/debates/invitationResponse/:debate_id/:response',debateCtl.handleRequest) //

app.post('/debates/updateDebate') //debate_id as a parameter

app.post('/debates/vote',debateCtl.pickSide) // debate_id/choice as a parameter

/* Users SET + Get */
app.get('/profile/:usr_id',userCtl.getUser)

app.get('/profile/searchFriendList/:query',userCtl.searchFriendList)

// app.post('/profile/createProfile') // profile data

app.post('/profile/updateProfile') // profile_id as a parameter


app.listen(port,
    () => {
        console.log(`listening on port ${port}`);
    });