const usersDB = {
    users: require('../model/users.json'),
    setusers: function (data) {this.users = data}
   }

const bcrypt = require('bcrypt');
const { json } = require('express');
const jwt = require('jsonwebtoken')
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path')


const handleLogin = async (req, res) => {
  const {user, pwd} = req.body;
  if(!user || !pwd) return res.status(400).json({"ststus": "error", "message":"un/pwd required"})
  const foundUser = usersDB.users.find(person => person.username === user);
  if(!foundUser) return res.sendStatus(401); //unauthorized
  //evaluate passwordusing bcrypt

  const match = await bcrypt.compare(pwd, foundUser.password);
  if(match) {
    //create JWT
    const accessToken = jwt.sign(
        {
            "username": foundUser.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '3m'}

    );
    const refreshToken = jwt.sign(
        {
            "username": foundUser.username
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: '1d'}

    );

    //saving refresh token with the current user
    const otherUser = usersDB.users.filter(person => person.username !== foundUser)
    const currentUser = {...foundUser, refreshToken}
    usersDB.setusers([...otherUser,currentUser]);
    await fsPromises.writeFile(
        path.join(__dirname,'..','model','users.json'),
        JSON.stringify(usersDB.users)
    )
    //send refresh token not as a json but as an "httpOnly cookie" which in invulnerable to js.
    res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24* 60 *60*1000})  //maxage of the cookie in miliseconds
    
    res.json({accessToken});
    } 
  else res.sendStatus(401);
}

module.exports = {
    handleLogin
}