const allowedOrigin = require("./allowedOrigins");

const corsOption = {
    origin: (origin, callback) => {
        if(allowedOrigin.indexOf(origin) !== -1 || !origin) {  //!origin equivalent to undefines
            callback(null, true)
        }else{
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}
module.exports = corsOption;