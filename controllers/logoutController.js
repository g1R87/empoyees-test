const usersDB = {
    users: require("../model/users.json"),
    setusers: function (data) {
      this.users = data;
    },
  };
  
const fsPromises = require('fs').promises;
const { dirname } = require("path");
const path = require('path');
  
  const handleLogout = async (req, res) => {
    //On client, also delete the access token

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(201); //No content
    const refreshToken = cookies.jwt;
    
    //is there a ref token in db?
    const foundUser = usersDB.users.find(
      (person) => person.refreshToken === refreshToken
    );
    if (!foundUser) {
        res.clearCookie('jwt', {httpOnly: true, maxAge: 24* 60 *60*1000})
        return res.sendStatus(204);} //success but no content
    

    //delete ref token in the users object
    const otherUser = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken)
    const currentUser = {...foundUser, refreshToken};
    usersDB.setusers([...otherUser, currentUser])
    await fsPromises.writeFile(path.join(__dirname, "..", 'model','users.json'), JSON.stringify(usersDB.users));
    res.clearCookie('jwt',{httpOnly:true, maxAge: 25*60*60*1000}) //secure: true in production
    res.sendStatus(204);
   

  };
  
  module.exports = {
    handleLogout,
  };
  