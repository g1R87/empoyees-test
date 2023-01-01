const whiteList = ['https://www.yourserver.com',
                    'http://localhost:80',
                    'http://12.0.0.1:5500',
                ];
const corsOption = {
    origin: (origin, callback) => {
        if(whiteList.indexOf(origin) !== -1 || !origin) {  //!origin equivalent to undefines
            callback(null, true)
        }else{
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}
module.exports = corsOption;