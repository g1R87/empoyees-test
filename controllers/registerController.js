const usersDB = {
 users: require('../model/users.json'),
 setusers: function (data) {this.users = data}
}
const bcrypt = require('bcrypt');
const fsPromises = require('fs').promises;
const path = require('path');

const handleNewUser = async (req, res) => {
    const {user, pwd} = req.body;
    if (!user || !pwd) return res.status(400).json({"message": "Username/Pwd are required"});
    //check for duplicate usernames in the db
    const dupes = usersDB.users.find(person => person.username === user);
    if(dupes) return res.sendStatus(409); //409 = conflict
    try {
        //encrypt password using bcrypt aka hasihing
        const hashedPwd = await bcrypt.hash(pwd, 10)  //10 is the salt round, makes difficult for hackers
        //store the new user
        const newUser = { "username": user, "password": hashedPwd};
        usersDB.setusers([...usersDB.users,newUser])
        await fsPromises.writeFile(path.join(__dirname,'..','model','users.json'),JSON.stringify(usersDB.users));
        console.log('logger',newUser);
        res.status(201).json({'status': "success","payload": newUser})

    } catch (error) {
        res.status(500).json({'message': error.message})
    }
}

module.exports = {
    handleNewUser
};