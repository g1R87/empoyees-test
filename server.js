const express = require('express')
const app = express()
const path = require('path');
const cors = require('cors')
const corsOption = require('./config/corsOptions');
const {logEvents,logger} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');  //because refreshToken is send through httpOnly Cookie
const credentials = require('./middleware/credentials');
const port = process.env.PORT || 5000;

//custom middleware for logger
app.use(logger);

//3rd party middleware Cross Origin Resource Sharing
app.use(credentials);
app.use(cors(corsOption));

//'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({extended: false}));

//middleware for json
app.use(express.json());

//middleware for cookies(which includes refresh token)
app.use(cookieParser());

//middleware to serve static files
app.use(express.static(path.join(__dirname,'/public')));
app.use('/subdir',express.static(path.join(__dirname,'/public'))); //make static page available for subdir files

//routes
app.use('/subdir',require('./routes/subdir'))
app.use('/',require('./routes/root'))
app.use('/register',require('./routes/register'))        //for creating user
app.use('/auth',require('./routes/auth'))        //for login
app.use("/refresh",require('./routes/refresh'))
app.use("/logout",require('./routes/logout'))


app.use(verifyJWT); // jwt before empliyees route
app.use('/employees',require('./routes/api/employees'))

//404 response for all http verbs
app.all('*',(req,res)=>{                      
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,'views','404.html'));
    }else if(req.accepts('json')){
        res.json({error: "404 not found"})
    }else{
        res.type('txt').send("404 not found")
    }
})

//error handling middleware
//express handles error by default but this just makes it look cleaner
app.use(errorHandler)

app.listen(port,()=> console.log('server listening on',port))