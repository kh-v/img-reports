const {
    getUser,
    updateUser,
    insertUser
} = require('../model/users')
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });
    // console.log(user,pwd)
    // const foundUser = usersDB.users.find(person => person.username === user);
    const foundUser = await getUser(user) 
    if (!foundUser) return res.sendStatus(401); //Unauthorized 
    // evaluate password 
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        // create JWTs
        const accessToken = jwt.sign(
            { "username": foundUser.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '480m' }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '3d' }
        );
        // Saving refreshToken with current user
        // const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username);
        // const currentUser = { ...foundUser, refreshToken };
        // usersDB.setUsers([...otherUsers, currentUser]);
        // await fsPromises.writeFile(
        //     path.join(__dirname, '..', 'model', 'users.json'),
        //     JSON.stringify(usersDB.users, null, 4)
        // );
        await updateUser(foundUser.username, refreshToken)
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 72 * 60 * 60 * 1000 });
        res.json({ accessToken, refreshToken });
    } else {
        res.sendStatus(401);
    }
}

const generateBackendToken = async (req, res) => {
    const accessToken = jwt.sign(
        { "username": 'rust_backend' },
        process.env.ACCESS_TOKEN_SECRET
    );

    res.json({ accessToken });
}

module.exports = { 
    handleLogin,
    generateBackendToken
 };